# Layouts & Publishing Blocks Reference

Typst Studio provides an extensible suite of publication-grade components, ranging from atomic typography elements to multi-slot grid layout engines.

---

## 1. Complex Grid Layouts (`grid_layout`)

The `grid_layout` component provides N-column, N-row container structures with granular slot targeting, gutter controls, and pre-engineered publishing presets.

### Grid Preset Catalog

| Preset ID | Track Definition | Structure & Purpose |
| :--- | :--- | :--- |
| `image_title_image` | `(1fr, 2fr, 1fr)` | Symmetric hero banner with left and right visual accents framing a central title block. |
| `split_2_1` | `(2fr, 1fr)` | Asymmetric 2:1 editorial layout for main narrative text paired with a right-hand sidebar. |
| `hero_1_2_1` | `(1fr, 1fr)` (3 rows) | Three-tier structure: full-width hero header, dual split body cells, and full-width footer summary. |
| `deck_3` | `(1fr, 1fr, 1fr)` | 3-card equal column deck for feature comparisons, pricing tiers, or service pillars. |
| `sidebar_main` | `(1fr, 3fr)` | Asymmetric 1:3 ratio for left metadata/navigation index and broad right body canvas. |

### Typst Code Generation for Grids
```typst
#grid(
  columns: (1fr, 2fr, 1fr),
  column-gutter: 12pt,
  row-gutter: 12pt,
  align: horizon,
  [
    // Cell 0
    #image("assets/img1.png", width: 100%, fit: "cover")
  ],
  [
    // Cell 1
    #heading(level: 1)[Annual Engineering Report]
    #text(fill: luma(100))[Q4 Deliverables and System Metrics]
  ],
  [
    // Cell 2
    #image("assets/img2.png", width: 100%, fit: "cover")
  ]
)
```

---

## 2. Specialized Publishing Elements

Typst Studio features 8 specialized elements designed specifically for formal documents, technical whitepapers, and executive reports:

### 1. Pull Quotes (`quote`)
Styled editorial callout with quotation mark accents, italicized body, and author attribution.
- **Metadata**:
  - `quote` (string): The quote text.
  - `author` (string): Attribution source or speaker name.
  - `title` (string): Author affiliation or job role.
- **Typst Output**:
  ```typst
  #rect(fill: rgb("#f8fafc"), stroke: (left: 3pt + rgb("#0284c7")), inset: (x: 14pt, y: 10pt))[
    #text(style: "italic", size: 11pt)["The function of good software is to make the complex appear simple."] \
    #v(4pt)
    #text(size: 9pt, weight: "bold", fill: rgb("#0284c7"))[— Grady Booch], #text(size: 8.5pt, fill: luma(100))[Software Architect]
  ]
  ```

### 2. Key-Value Specifications (`key_value`)
Clean two-column tabular layout for metadata, technical specifications, and executive summaries.
- **Metadata**:
  - `items`: Array of `{ key: string, value: string }`.
- **Typst Output**:
  ```typst
  #grid(
    columns: (auto, 1fr),
    column-gutter: 16pt,
    row-gutter: 8pt,
    [*Platform:*], [Linux 6.8.0 x86_64],
    [*Memory Allocation:*], [32 GB ECC DDR5],
    [*Target SLA:*], [99.999% Uptime]
  )
  ```

### 3. Chronological Timelines (`timeline`)
Vertical event sequence with numbered step badges, milestone headings, timestamps, and descriptive summaries.
- **Metadata**:
  - `steps`: Array of `{ date: string, title: string, description: string }`.
- **Typst Output**:
  ```typst
  #rect(stroke: (left: 2pt + rgb("#0284c7")), inset: (left: 12pt, y: 4pt))[
    #text(weight: "bold", size: 10.5pt)[Phase 1: Architecture Review] \
    #text(size: 8pt, fill: rgb("#0284c7"))[2026-Q1] \
    #text(size: 9pt, fill: luma(80))[Complete formal verification and model validation.]
  ]
  ```

### 4. Legal & Sign-Off Signatures (`signature`)
Dual-column or single-column formal execution block with signature line, signatory name, job title, and execution date.
- **Metadata**:
  - `signerName` (string): Full name of the authorized signatory.
  - `signerTitle` (string): Position/Title (e.g. *Chief Information Security Officer*).
  - `date` (string): Execution date.
  - `company` (string): Organization name.
- **Typst Output**:
  ```typst
  #grid(
    columns: (1fr, 1fr),
    column-gutter: 40pt,
    [
      #line(length: 100%, stroke: 0.5pt + luma(150))
      #v(4pt)
      #text(weight: "bold", size: 10pt)[Yahiaoui Abderrahmane] \
      #text(size: 8.5pt, fill: luma(100))[Lead Architect & Maintainer] \
      #text(size: 8pt, fill: luma(130))[Date: 2026-10-23]
    ],
    [...]
  )
  ```

### 5. Categorical Badge Tags (`tags`)
Horizontal pill/chip cloud for categorizing reports, skills, tech stacks, or compliance tags.
- **Metadata**:
  - `tags`: Array of string labels.
  - `color`: Hex color or semantic color key.
- **Typst Output**:
  ```typst
  #box(fill: rgb("#e0f2fe"), inset: (x: 8pt, y: 4pt), radius: 99pt)[
    #text(size: 8pt, weight: "bold", fill: rgb("#0284c7"))[Rust]
  ]
  ```

### 6. Mathematical Formulas (`math`)
Display and inline equations rendered using native Typst mathematical syntax (e.g. `$integral_0^inf e^(-x^2) dif x = sqrt(pi) / 2$`).
- **Metadata**:
  - `equation` (string): Typst math expression.
  - `block` (boolean): Whether to render as a display equation (`$ ... $`) or inline.
- **Typst Output**:
  ```typst
  $ integral_0^infinity e^(-x^2) dif x = frac(sqrt(pi), 2) $
  ```

### 7. Visual Metric Progress Bars (`progress`)
Horizontal metric fill bars with percentage label, custom bar height, and custom palette colors.
- **Metadata**:
  - `label` (string): Metric title (e.g. *Test Coverage*).
  - `value` (number): Percentage completion (0–100).
  - `color` (string): Hex color code.
- **Typst Output**:
  ```typst
  #grid(
    columns: (1fr, auto),
    [*Test Coverage*], [*94%*]
  )
  #rect(width: 100%, height: 6pt, fill: luma(230), radius: 3pt)[
    #place(top + left, rect(width: 94%, height: 6pt, fill: rgb("#0284c7"), radius: 3pt))
  ]
  ```

---

## 3. Core Structural Blocks

In addition to the specialized elements above, Typst Studio provides the full foundational block set:
- **`heading`**: Levels 1–4 with custom font scale, margins, and anchor identifiers.
- **`text`**: Rich paragraphs with Markdown bold, italic, code spans, links, and lists.
- **`card`**: Customizable background fill, borders, corner radius, and inner padding.
- **`callout`**: Semantic alerts (`note`, `tip`, `warning`, `caution`) with color-coded left borders and icons.
- **`metric`**: Key Performance Indicator (KPI) cards with delta trend badges (positive/negative/neutral).
- **`profile`**: Professional bio cards with avatar, social links, role, and summary.
- **`columns`**: 2-column and 3-column split layouts for multi-column prose.
- **`table`**: Dynamic data tables with header styling, cell alignment, and CSV import.
- **`code`**: Syntax-highlighted code blocks with line numbers and language tags.
- **`divider`**: Stylized horizontal rules with optional label text.
