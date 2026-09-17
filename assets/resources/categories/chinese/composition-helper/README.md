# Composition Helper Data Files

All data for the "作文助手" (Composition Helper) feature is stored as CSV files in this directory. You can freely edit any CSV file to add, remove, or modify content. The app will load these files at runtime.

## Directory Structure

```
composition-helper/
├── README.md                   # This file
├── nav-config.csv              # Navigation structure (categories + items)
├── genres/                     # Genre templates (文体)
│   ├── 写人作文.csv            # ┐
│   ├── 记事作文.csv            # │ 作文分类 (genre-main)
│   ├── 写景作文.csv            # │
│   ├── 状物作文.csv            # │
│   ├── 想象作文.csv            # │
│   ├── 读后感.csv              # ┘
│   ├── 日记.csv                # ┐ 其他文体 (genre-other)
│   └── 书信.csv                # ┘
├── words/                      # Good words (好词宝库)
│   ├── 外貌描写.csv            # ┐
│   ├── 神态表情.csv            # │ 人物类 (words-person)
│   ├── 语言描写.csv            # │
│   ├── 动作描写.csv            # │
│   ├── 心理描写.csv            # │
│   ├── 品质性格.csv            # ┘
│   ├── 自然山水.csv            # ┐
│   ├── 动物描写.csv            # │ 景物类 (words-scene)
│   ├── 植物描写.csv            # │
│   ├── 天气时令.csv            # │
│   ├── 颜色词汇.csv            # │
│   ├── 声音描写.csv            # │
│   ├── 味道气味.csv            # ┘
│   ├── 表示观看.csv            # ┐
│   ├── 表示说叫.csv            # │ 通用类 (words-general)
│   └── 成语归类.csv            # ┘
└── sentences/                  # Good sentences (好句宝库)
    ├── 比喻句.csv              # ┐
    ├── 拟人句.csv              # │ 修辞句 (sentences-rhetoric)
    ├── 排比句.csv              # │
    ├── 夸张句.csv              # │
    ├── 反问设问句.csv          # ┘
    ├── 精彩开头.csv            # ┐
    ├── 优美结尾.csv            # │ 结构句 (sentences-structure)
    ├── 过渡衔接.csv            # ┘
    ├── 家庭亲情.csv            # ┐
    ├── 校园生活.csv            # │ 主题句 (sentences-theme)
    └── 名人名言.csv            # ┘
```

## CSV Format Reference

### nav-config.csv

Defines the left sidebar navigation tree.

| Column | Description |
|--------|-------------|
| `category_id` | Top-level category ID: `genre`, `words`, or `sentences` |
| `category_label` | Display name for the category |
| `category_icon` | Material icon name for the category |
| `item_id` | Unique item ID (used to match data file) |
| `item_label` | Display name shown in the sidebar |
| `item_icon` | Material icon name for the item |
| `item_color` | Hex color code (e.g. `#e57373`) |
| `data_file` | Relative path to the CSV data file |

### Genre CSV (`genres/*.csv`)

| Column | Description |
|--------|-------------|
| `section` | One of: `structure`, `tip`, `example` |
| `order` | Sort order within section (1, 2, 3…) |
| `content` | The text content |

### Words CSV (`words/*.csv`)

| Column | Description |
|--------|-------------|
| `group` | Sub-group name (e.g. "五官描写", "身材体型") |
| `word` | A single word or phrase |

### Sentences CSV (`sentences/*.csv`)

| Column | Description |
|--------|-------------|
| `group` | Sub-group name (e.g. "描写自然", "描写人物") |
| `sentence` | The full sentence |
| `source` | (Optional) Author or source attribution |

## How to Add Content

1. Open the corresponding CSV file in any text editor or spreadsheet app.
2. Add new rows following the existing format.
3. Save the file (make sure encoding is UTF-8).
4. Refresh the app page to see the new content.

### Example: Adding a new word

Open `words/外貌描写.csv` and add a row:

```csv
五官描写,目光如炬
```

### Example: Adding a new sentence

Open `sentences/比喻句.csv` and add a row:

```csv
描写自然,大海像一面巨大的蓝色镜子。,
```

### Example: Adding a new genre

1. Create a new CSV file in `genres/`, e.g. `genres/申请书.csv`
2. Add rows with `section`, `order`, `content` columns
3. Add a new row in `nav-config.csv` pointing to this file
