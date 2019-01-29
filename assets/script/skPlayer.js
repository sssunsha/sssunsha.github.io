//SKPlayer
console.log('%cSKPlayer 3.0.8', 'color:#D94240');
require('./skPlayer.scss');
var Util = {
    leftDistance: function (el) {
        var left = el.offsetLeft;
        var scrollLeft;
        while (el.offsetParent) {
            el = el.offsetParent;
            left += el.offsetLeft;
        }
        scrollLeft = document.body.scrollLeft + document.documentElement.scrollLeft;
        return left - scrollLeft;
    },
    timeFormat: function (time) {
        var tempMin = parseInt(time / 60);
        var tempSec = parseInt(time % 60);
        var curMin = tempMin < 10 ? ('0' + tempMin) : tempMin;
        var curSec = tempSec < 10 ? ('0' + tempSec) : tempSec;
        return curMin + ':' + curSec;
    },
    percentFormat: function (percent) {
        return (percent * 100).toFixed(2) + '%';
    },
    ajax: function (option) {
        option.beforeSend && option.beforeSend();
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status >= 200 && xhr.status < 300) {
                    option.success && option.success(xhr.responseText);
                }
                else {
                    option.fail && option.fail(xhr.status);
                }
            }
        };
        xhr.open('GET', option.url);
        xhr.send(null);
    }
};
var instance = false;
var baseUrl = 'http://120.79.36.48/';
var skPlayer = /** @class */ (function () {
    function skPlayer(option) {
        var _this = this;
        if (instance) {
            console.error('SKPlayer只能存在一个实例！');
            return Object.create(null);
        }
        else {
            instance = true;
        }
        var defaultOption = {
            element: document.getElementById('skPlayer'),
            autoplay: false,
            mode: 'listloop',
            listshow: true //true/false
        };
        // this.option = Object.assign({},defaultOption,option);
        for (var defaultKey in defaultOption) {
            if (!option.hasOwnProperty(defaultKey)) {
                option[defaultKey] = defaultOption[defaultKey];
            }
        }
        this.option = option;
        if (!(this.option.music && this.option.music.type && this.option.music.source)) {
            console.error('请正确配置对象！');
            return Object.create(null);
        }
        this.root = this.option.element;
        this.type = this.option.music.type;
        this.music = this.option.music.source;
        this.isMobile = /mobile/i.test(window.navigator.userAgent);
        this.toggle = this.toggle.bind(this);
        this.toggleList = this.toggleList.bind(this);
        this.toggleMute = this.toggleMute.bind(this);
        this.switchMode = this.switchMode.bind(this);
        if (this.type === 'file') {
            this.root.innerHTML = this.template();
            this.init();
            this.bind();
        }
        else if (this.type === 'cloud') {
            this.root.innerHTML = '<p class="skPlayer-tip-loading">LOADING</p>';
            Util.ajax({
                url: baseUrl + 'playlist/detail?id=' + this.music,
                beforeSend: function () {
                    console.log('SKPlayer正在努力的拉取歌单 ...');
                },
                success: function (data) {
                    console.log('歌单拉取成功！');
                    _this.music = JSON.parse(data);
                    _this.root.innerHTML = _this.template();
                    _this.init();
                    _this.bind();
                },
                fail: function (status) {
                    console.error('歌单拉取失败！ 错误码：' + status);
                }
            });
        }
    }
    skPlayer.prototype.template = function () {
        var html = "\n            <audio class=\"skPlayer-source\" src=\"" + (this.type === 'file' ? this.music[0].src : '') + "\" preload=\"auto\"></audio>\n            <div class=\"skPlayer-picture\">\n                <img class=\"skPlayer-cover\" src=\"" + this.music[0].cover + "\" alt=\"\">\n                <a href=\"javascript:;\" class=\"skPlayer-play-btn\">\n                    <span class=\"skPlayer-left\"></span>\n                    <span class=\"skPlayer-right\"></span>\n                </a>\n            </div>\n            <div class=\"skPlayer-control\">\n                <p class=\"skPlayer-name\">" + this.music[0].name + "</p>\n                <p class=\"skPlayer-author\">" + this.music[0].author + "</p>\n                <div class=\"skPlayer-percent\">\n                    <div class=\"skPlayer-line-loading\"></div>\n                    <div class=\"skPlayer-line\"></div>\n                </div>\n                <p class=\"skPlayer-time\">\n                    <span class=\"skPlayer-cur\">" + '00:00' + "</span>/<span class=\"skPlayer-total\">" + '00:00' + "</span>\n                </p>\n                <div class=\"skPlayer-volume\" style=\"" + (this.isMobile ? 'display:none;' : '') + "\">\n                    <i class=\"skPlayer-icon\"></i>\n                    <div class=\"skPlayer-percent\">\n                        <div class=\"skPlayer-line\"></div>\n                    </div>\n                </div>\n                <div class=\"skPlayer-list-switch\">\n                    <i class=\"skPlayer-list-icon\"></i>\n                </div>\n                <i class=\"" + (this.option.mode === 'singleloop' ? 'skPlayer-mode skPlayer-mode-loop' : 'skPlayer-mode') + "\"></i>\n            </div>\n            <ul class=\"skPlayer-list\">\n        ";
        for (var index in this.music) {
            html += "\n                <li data-index=\"" + index + "\">\n                    <i class=\"skPlayer-list-sign\"></i>\n                    <span class=\"skPlayer-list-index\">" + (parseInt(index) + 1) + "</span>\n                    <span class=\"skPlayer-list-name\" title=\"" + this.music[index].name + "\">" + this.music[index].name + "</span>\n                    <span class=\"skPlayer-list-author\" title=\"" + this.music[index].author + "\">" + this.music[index].author + "</span>\n                </li>\n            ";
        }
        html += "\n            </ul>\n        ";
        return html;
    };
    skPlayer.prototype.init = function () {
        var _this = this;
        this.dom = {
            cover: this.root.querySelector('.skPlayer-cover'),
            playbutton: this.root.querySelector('.skPlayer-play-btn'),
            name: this.root.querySelector('.skPlayer-name'),
            author: this.root.querySelector('.skPlayer-author'),
            timeline_total: this.root.querySelector('.skPlayer-percent'),
            timeline_loaded: this.root.querySelector('.skPlayer-line-loading'),
            timeline_played: this.root.querySelector('.skPlayer-percent .skPlayer-line'),
            timetext_total: this.root.querySelector('.skPlayer-total'),
            timetext_played: this.root.querySelector('.skPlayer-cur'),
            volumebutton: this.root.querySelector('.skPlayer-icon'),
            volumeline_total: this.root.querySelector('.skPlayer-volume .skPlayer-percent'),
            volumeline_value: this.root.querySelector('.skPlayer-volume .skPlayer-line'),
            switchbutton: this.root.querySelector('.skPlayer-list-switch'),
            modebutton: this.root.querySelector('.skPlayer-mode'),
            musiclist: this.root.querySelector('.skPlayer-list'),
            musicitem: this.root.querySelectorAll('.skPlayer-list li')
        };
        this.audio = this.root.querySelector('.skPlayer-source');
        if (this.option.listshow) {
            this.root.className = 'skPlayer-list-on';
        }
        if (this.option.mode === 'singleloop') {
            this.audio.loop = true;
        }
        this.dom.musicitem[0].className = 'skPlayer-curMusic';
        if (this.type === 'cloud') {
            Util.ajax({
                url: baseUrl + 'music/url?id=' + this.music[0].song_id,
                beforeSend: function () {
                    console.log('SKPlayer正在努力的拉取歌曲 ...');
                },
                success: function (data) {
                    var url = JSON.parse(data).url;
                    if (url !== null) {
                        console.log('歌曲拉取成功！');
                        _this.audio.src = url;
                    }
                    else {
                        console.log('歌曲拉取失败！ 资源无效！');
                        if (_this.music.length !== 1) {
                            _this.next();
                        }
                    }
                },
                fail: function (status) {
                    console.error('歌曲拉取失败！ 错误码：' + status);
                }
            });
        }
    };
    skPlayer.prototype.bind = function () {
        var _this = this;
        this.updateLine = function () {
            var percent = _this.audio.buffered.length ? (_this.audio.buffered.end(_this.audio.buffered.length - 1) / _this.audio.duration) : 0;
            _this.dom.timeline_loaded.style.width = Util.percentFormat(percent);
        };
        this.audio.addEventListener('durationchange', function (e) {
            _this.dom.timetext_total.innerHTML = Util.timeFormat(_this.audio.duration);
            _this.updateLine();
        });
        this.audio.addEventListener('progress', function (e) {
            _this.updateLine();
        });
        this.audio.addEventListener('canplay', function (e) {
            if (_this.option.autoplay && !_this.isMobile) {
                _this.play();
            }
        });
        this.audio.addEventListener('timeupdate', function (e) {
            var percent = _this.audio.currentTime / _this.audio.duration;
            _this.dom.timeline_played.style.width = Util.percentFormat(percent);
            _this.dom.timetext_played.innerHTML = Util.timeFormat(_this.audio.currentTime);
        });
        this.audio.addEventListener('seeked', function (e) {
            _this.play();
        });
        this.audio.addEventListener('ended', function (e) {
            _this.next();
        });
        this.dom.playbutton.addEventListener('click', this.toggle);
        this.dom.switchbutton.addEventListener('click', this.toggleList);
        if (!this.isMobile) {
            this.dom.volumebutton.addEventListener('click', this.toggleMute);
        }
        this.dom.modebutton.addEventListener('click', this.switchMode);
        this.dom.musiclist.addEventListener('click', function (e) {
            var target, index, curIndex;
            if (e.target.tagName.toUpperCase() === 'LI') {
                target = e.target;
            }
            else if (e.target.parentElement.tagName.toUpperCase() === 'LI') {
                target = e.target.parentElement;
            }
            else {
                return;
            }
            index = parseInt(target.getAttribute('data-index'));
            curIndex = parseInt(_this.dom.musiclist.querySelector('.skPlayer-curMusic').getAttribute('data-index'));
            if (index === curIndex) {
                _this.play();
            }
            else {
                _this.switchMusic(index + 1);
            }
        });
        this.dom.timeline_total.addEventListener('click', function (event) {
            var e = event || window.event;
            var percent = (e.clientX - Util.leftDistance(_this.dom.timeline_total)) / _this.dom.timeline_total.clientWidth;
            if (!isNaN(_this.audio.duration)) {
                _this.dom.timeline_played.style.width = Util.percentFormat(percent);
                _this.dom.timetext_played.innerHTML = Util.timeFormat(percent * _this.audio.duration);
                _this.audio.currentTime = percent * _this.audio.duration;
            }
        });
        if (!this.isMobile) {
            this.dom.volumeline_total.addEventListener('click', function (event) {
                var e = event || window.event;
                var percent = (e.clientX - Util.leftDistance(_this.dom.volumeline_total)) / _this.dom.volumeline_total.clientWidth;
                _this.dom.volumeline_value.style.width = Util.percentFormat(percent);
                _this.audio.volume = percent;
                if (_this.audio.muted) {
                    _this.toggleMute();
                }
            });
        }
    };
    skPlayer.prototype.prev = function () {
        var index = parseInt(this.dom.musiclist.querySelector('.skPlayer-curMusic').getAttribute('data-index'));
        if (index === 0) {
            if (this.music.length === 1) {
                this.play();
            }
            else {
                this.switchMusic(this.music.length - 1 + 1);
            }
        }
        else {
            this.switchMusic(index - 1 + 1);
        }
    };
    skPlayer.prototype.next = function () {
        var index = parseInt(this.dom.musiclist.querySelector('.skPlayer-curMusic').getAttribute('data-index'));
        if (index === (this.music.length - 1)) {
            if (this.music.length === 1) {
                this.play();
            }
            else {
                this.switchMusic(0 + 1);
            }
        }
        else {
            this.switchMusic(index + 1 + 1);
        }
    };
    skPlayer.prototype.switchMusic = function (index) {
        var _this = this;
        if (typeof index !== 'number') {
            console.error('请输入正确的歌曲序号！');
            return;
        }
        index -= 1;
        if (index < 0 || index >= this.music.length) {
            console.error('请输入正确的歌曲序号！');
            return;
        }
        if (index == this.dom.musiclist.querySelector('.skPlayer-curMusic').getAttribute('data-index')) {
            this.play();
            return;
        }
        //if(!this.isMobile){
        //    this.audio.pause();
        //    this.audio.currentTime = 0;
        //}
        this.dom.musiclist.querySelector('.skPlayer-curMusic').classList.remove('skPlayer-curMusic');
        this.dom.musicitem[index].classList.add('skPlayer-curMusic');
        this.dom.name.innerHTML = this.music[index].name;
        this.dom.author.innerHTML = this.music[index].author;
        this.dom.cover.src = this.music[index].cover;
        if (this.type === 'file') {
            this.audio.src = this.music[index].src;
            this.play();
        }
        else if (this.type === 'cloud') {
            Util.ajax({
                url: baseUrl + 'music/url?id=' + this.music[index].song_id,
                beforeSend: function () {
                    console.log('SKPlayer正在努力的拉取歌曲 ...');
                },
                success: function (data) {
                    var url = JSON.parse(data).url;
                    if (url !== null) {
                        console.log('歌曲拉取成功！');
                        _this.audio.src = url;
                        _this.play();
                        //暂存问题，移动端兼容性
                    }
                    else {
                        console.log('歌曲拉取失败！ 资源无效！');
                        if (_this.music.length !== 1) {
                            _this.next();
                        }
                    }
                },
                fail: function (status) {
                    console.error('歌曲拉取失败！ 错误码：' + status);
                }
            });
        }
    };
    skPlayer.prototype.play = function () {
        if (this.audio.paused) {
            this.audio.play();
            this.dom.playbutton.classList.add('skPlayer-pause');
            this.dom.cover.classList.add('skPlayer-pause');
        }
    };
    skPlayer.prototype.pause = function () {
        if (!this.audio.paused) {
            this.audio.pause();
            this.dom.playbutton.classList.remove('skPlayer-pause');
            this.dom.cover.classList.remove('skPlayer-pause');
        }
    };
    skPlayer.prototype.toggle = function () {
        this.audio.paused ? this.play() : this.pause();
    };
    skPlayer.prototype.toggleList = function () {
        this.root.classList.contains('skPlayer-list-on') ? this.root.classList.remove('skPlayer-list-on') : this.root.classList.add('skPlayer-list-on');
    };
    skPlayer.prototype.toggleMute = function () {
        //暂存问题，移动端兼容性
        if (this.audio.muted) {
            this.audio.muted = false;
            this.dom.volumebutton.classList.remove('skPlayer-quiet');
            this.dom.volumeline_value.style.width = Util.percentFormat(this.audio.volume);
        }
        else {
            this.audio.muted = true;
            this.dom.volumebutton.classList.add('skPlayer-quiet');
            this.dom.volumeline_value.style.width = '0%';
        }
    };
    skPlayer.prototype.switchMode = function () {
        if (this.audio.loop) {
            this.audio.loop = false;
            this.dom.modebutton.classList.remove('skPlayer-mode-loop');
        }
        else {
            this.audio.loop = true;
            this.dom.modebutton.classList.add('skPlayer-mode-loop');
        }
    };
    skPlayer.prototype.destroy = function () {
        instance = false;
        this.audio.pause();
        this.root.innerHTML = '';
        for (var prop in this) {
            delete this[prop];
        }
        console.log('该实例已销毁，可重新配置 ...');
    };
    return skPlayer;
}());
module.exports = skPlayer;
