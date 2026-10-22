import {
  DocumentBlock,
  DocumentState,
  DocumentSettings,
  HeadingBlock,
  TextBlock,
  CardBlock,
  CalloutCardBlock,
  MetricCardBlock,
  ProfileCardBlock,
  ColumnsBlock,
  ImageBlock,
  TableBlock,
  CodeBlock,
  DividerBlock,
  GridLayoutBlock,
  QuoteBlock,
  KeyValueBlock,
  TimelineBlock,
  SignatureBlock,
  TagsBlock,
  MathBlock,
  ProgressBlock,
} from "@/types/document";
import { isColorDark, getContrastingText, CALLOUT_THEMES } from "./document-theme";

export function escapeTypst(str: string): string {
  if (!str) return "";
  let res = str
    .replace(/\\/g, "\\\\")
    .replace(/#/g, "\\#")
    .replace(/@/g, "\\@")
    .replace(/</g, "\\<")
    .replace(/>/g, "\\>")
    .replace(/\[/g, "\\[")
    .replace(/\]/g, "\\]");

  // Preserve valid paired math $...$, escape lone currency dollars ($2.4M, $50)
  const parts = res.split(/(\$[^$\n]+\$)/g);
  res = parts
    .map((part) => {
      if (part.startsWith("$") && part.endsWith("$") && part.length > 2) {
        return part;
      }
      return part.replace(/\$/g, "\\$");
    })
    .join("");

  return res;
}

function formatMarkdownToTypst(text: string): string {
  if (!text) return "";
  // Convert markdown double asterisks **bold** to Typst single asterisk *bold*
  const normalized = text.replace(/\*\*([^*]+)\*\*/g, "*$1*");
  const lines = normalized.split("\n");
  const processedLines = lines.map((line) => {
    const trimmed = line.trim();
    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      return "- " + escapeTypst(trimmed.substring(2));
    }
    const numMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
    if (numMatch) {
      return "+ " + escapeTypst(numMatch[2]);
    }
    return escapeTypst(line);
  });

  return processedLines.join("\n");
}

export function renderBlockToTypst(block: DocumentBlock, settings?: DocumentSettings): string {
  const docAccent = settings?.accentColor || "#0f172a";

  switch (block.type) {
    case "heading": {
      const h = block as HeadingBlock;
      const level = Math.max(1, Math.min(4, h.level || 1));
      const alignPrefix =
        h.align === "center"
          ? "#align(center)"
          : h.align === "right"
          ? "#align(right)"
          : "";
      const subtitleMarkup = h.subtitle
        ? `\n#v(2pt)\n#text(size: 0.85em, fill: rgb("#64748b"))[${escapeTypst(h.subtitle)}]`
        : "";

      const underline = level === 1 ? `\n#v(3pt)\n#line(length: 100%, stroke: 1.5pt + rgb("${docAccent}"))` : "";
      const headingCode = `${"=".repeat(level)} ${escapeTypst(h.text)}${subtitleMarkup}${underline}`;
      return alignPrefix ? `${alignPrefix}[\n${headingCode}\n]` : headingCode;
    }

    case "text": {
      const t = block as TextBlock;
      const align = t.align || "left";
      const formatted = formatMarkdownToTypst(t.content);
      if (align === "center") {
        return `#align(center)[\n${formatted}\n]`;
      }
      if (align === "right") {
        return `#align(right)[\n${formatted}\n]`;
      }
      return formatted;
    }

    case "card": {
      const c = block as CardBlock;
      const fill = c.fillColor || "#ffffff";
      const stroke = c.strokeColor || "#e2e8f0";
      const strokeWidth = c.strokeWidth ?? 1;
      const radius = c.radius ?? 6;
      const inset = c.padding ?? 12;

      const titleColor = getContrastingText(fill);
      const bodyColor = isColorDark(fill) ? "#e2e8f0" : "#334155";
      const badgeBg = c.badgeBg || (isColorDark(fill) ? "#ffffff" : docAccent);
      const badgeText = c.badgeText || (isColorDark(fill) ? "#0f172a" : "#ffffff");

      const badgeMarkup = c.badge
        ? `#box(fill: rgb("${badgeBg}"), radius: 3pt, inset: (x: 5pt, y: 3pt))[#text(size: 0.75em, weight: "bold", fill: rgb("${badgeText}"))[${escapeTypst(c.badge)}]] \\ \n#v(2pt)\n`
        : "";
      const titleMarkup = c.title
        ? `#text(weight: "bold", size: 1.1em, fill: rgb("${titleColor}"))[${escapeTypst(c.title)}] \\ \n#v(4pt)\n`
        : "";
      const bodyMarkup = `#text(fill: rgb("${bodyColor}"))[${formatMarkdownToTypst(c.content)}]`;

      return `#rect(
  fill: rgb("${fill}"),
  stroke: ${strokeWidth}pt + rgb("${stroke}"),
  radius: ${radius}pt,
  inset: ${inset}pt,
  width: 100%,
  [
    ${badgeMarkup}${titleMarkup}${bodyMarkup}
  ]
)`;
    }

    case "card_callout": {
      const callout = block as CalloutCardBlock;
      const base = CALLOUT_THEMES[callout.variant] || CALLOUT_THEMES.note;
      const bg = callout.bgColor || base.bg;
      const border = callout.borderColor || (callout.variant === "note" ? docAccent : base.border);
      const text = callout.textColor || (callout.variant === "note" ? docAccent : base.text);

      return `#block(
  fill: rgb("${bg}"),
  stroke: (left: 4pt + rgb("${border}")),
  radius: (right: 4pt),
  inset: (x: 12pt, y: 10pt),
  width: 100%,
  [
    #text(weight: "bold", fill: rgb("${text}"))[${escapeTypst(callout.title)}] \\
    #v(2pt)
    #text(fill: rgb("#1e293b"))[${formatMarkdownToTypst(callout.message)}]
  ]
)`;
    }

    case "card_metric": {
      const m = block as MetricCardBlock;
      const fill = m.fillColor || "#f8fafc";
      const stroke = m.strokeColor || "#e2e8f0";
      const valueColor = docAccent;
      const badgeColor =
        m.changeType === "positive"
          ? "#16a34a"
          : m.changeType === "negative"
          ? "#dc2626"
          : "#64748b";

      const changeMarkup = m.change
        ? `\n    #v(3pt)\n    #text(size: 0.8em, weight: "medium", fill: rgb("${badgeColor}"))[${escapeTypst(m.change)}]`
        : "";

      return `#rect(
  fill: rgb("${fill}"),
  stroke: 1pt + rgb("${stroke}"),
  radius: 6pt,
  inset: 12pt,
  width: 100%,
  [
    #text(size: 0.85em, weight: "medium", fill: rgb("#64748b"))[${escapeTypst(m.label)}] \\
    #v(3pt)
    #text(size: 1.8em, weight: "bold", fill: rgb("${valueColor}"))[${escapeTypst(m.value)}]${changeMarkup}
  ]
)`;
    }

    case "card_profile": {
      const p = block as ProfileCardBlock;
      const fill = p.fillColor || "#ffffff";
      const stroke = p.strokeColor || "#e2e8f0";
      const roleColor = p.roleColor || docAccent;
      const contactMarkup = p.contact
        ? `\n    #v(4pt)\n    #text(size: 0.8em, fill: rgb("#64748b"))[${escapeTypst(p.contact)}]`
        : "";

      return `#rect(
  fill: rgb("${fill}"),
  stroke: 1pt + rgb("${stroke}"),
  radius: 8pt,
  inset: 14pt,
  width: 100%,
  [
    #text(size: 1.25em, weight: "bold", fill: rgb("#0f172a"))[${escapeTypst(p.name)}] \\
    #text(size: 0.9em, weight: "medium", fill: rgb("${roleColor}"))[${escapeTypst(p.role)}] \\
    #v(4pt)
    #text(fill: rgb("#334155"))[${formatMarkdownToTypst(p.bio)}]${contactMarkup}
  ]
)`;
    }

    case "columns": {
      const cols = block as ColumnsBlock;
      const colFraction = cols.columnsCount === 3 ? "1fr, 1fr, 1fr" : "1fr, 1fr";
      const gutter = cols.gutter || 12;

      const renderedColumns = cols.columns.map((col) => {
        const inner = col.blocks.map((b) => renderBlockToTypst(b, settings)).join("\n\n");
        return `[\n${inner || " "}\n]`;
      });

      return `#grid(
  columns: (${colFraction}),
  gutter: ${gutter}pt,
  ${renderedColumns.join(",\n  ")}
)`;
    }

    case "image": {
      const img = block as ImageBlock;
      const align = img.align || "center";
      const cleanWidth = img.width ? (img.width.endsWith("%") || img.width.endsWith("pt") ? img.width : `${img.width}%`) : "80%";

      if (!img.url || img.url.startsWith("blob:")) {
        return `#align(${align})[
  #rect(fill: rgb("#f8fafc"), stroke: 1pt + rgb("#cbd5e1"), radius: 4pt, width: ${cleanWidth}, height: 60pt)[
    #align(center + horizon)[#text(size: 8pt, fill: rgb("#94a3b8"))[Image Placeholder]]
  ]
]`;
      }

      const captionMarkup = img.caption
        ? `\n#v(4pt)\n#text(size: 0.85em, style: "italic", fill: rgb("#64748b"))[${escapeTypst(img.caption)}]`
        : "";

      return `#align(${align})[
  #image("${img.url}", width: ${cleanWidth})${captionMarkup}
]`;
    }

    case "table": {
      const tbl = block as TableBlock;
      const colsCount = Math.max(tbl.headers.length, tbl.rows[0]?.length || 1);
      const tableBorder = tbl.borderColor || "#cbd5e1";
      const headerBg = tbl.headerBg || "#f1f5f9";
      const headerColor = tbl.headerColor || "#0f172a";

      const headersMarkup = tbl.headers.length > 0
        ? tbl.headers.map((h) => `[#text(weight: "bold", fill: rgb("${headerColor}"))[${escapeTypst(h)}]]`).join(", ") + ",\n  "
        : "";

      const rowsMarkup = tbl.rows
        .map((row) => row.map((cell) => `[${escapeTypst(cell)}]`).join(", "))
        .join(",\n  ");

      const captionMarkup = tbl.caption
        ? `#align(center)[#text(size: 0.85em, weight: "medium", fill: rgb("#64748b"))[Table: ${escapeTypst(tbl.caption)}]]\n#v(4pt)\n`
        : "";

      const zebraFill = tbl.isZebra
        ? `fill: (col, row) => if row == 0 { rgb("${headerBg}") } else if calc.even(row) { rgb("#f8fafc") } else { none },`
        : `fill: (col, row) => if row == 0 { rgb("${headerBg}") } else { none },`;

      return `${captionMarkup}#align(center)[
#table(
  columns: ${colsCount},
  stroke: 0.5pt + rgb("${tableBorder}"),
  ${zebraFill}
  align: (col, row) => if row == 0 { center + horizon } else { left + horizon },
  ${headersMarkup}${rowsMarkup}
)
]`;
    }

    case "code": {
      const codeBlock = block as CodeBlock;
      const lang = codeBlock.language || "text";
      const codeContent = codeBlock.code || "";
      const fence = codeContent.includes("```") ? "````" : "```";
      const titleMarkup = codeBlock.filename
        ? `#block(fill: rgb("#1e293b"), radius: (top: 4pt), inset: (x: 10pt, y: 6pt), width: 100%)[#text(size: 0.8em, fill: rgb("#94a3b8"), font: "Liberation Mono")[${escapeTypst(codeBlock.filename)}]]\n`
        : "";

      return `${titleMarkup}${fence}${lang}\n${codeContent}\n${fence}`;
    }

    case "divider": {
      const div = block as DividerBlock;
      const spacing = div.spacing || 12;
      const thickness = div.thickness || 0.5;
      const color = div.color || docAccent || "#e2e8f0";
      return `#v(${spacing}pt)\n#line(length: 100%, stroke: ${thickness}pt + rgb("${color}"))\n#v(${spacing}pt)`;
    }

    case "grid_layout": {
      const g = block as GridLayoutBlock;
      const tracks = g.tracks && g.tracks.length > 0 ? g.tracks : ["1fr", "1fr"];
      const gutter = g.gutter ?? 12;
      const vAlign = g.verticalAlign === "center" ? "horizon" : g.verticalAlign === "bottom" ? "bottom" : "top";

      const renderedSlots = (g.slots || []).map((slot) => {
        const slotContent = (slot.blocks || [])
          .map((childBlock) => renderBlockToTypst(childBlock, settings))
          .filter(Boolean)
          .join("\n\n");
        return `[\n${slotContent || " "}\n]`;
      });

      while (renderedSlots.length < tracks.length) {
        renderedSlots.push(`[\n \n]`);
      }

      return `#grid(
  columns: (${tracks.join(", ")}),
  gutter: ${gutter}pt,
  align: (col, row) => ${vAlign} + left,
  ${renderedSlots.join(",\n  ")}
)`;
    }

    case "quote": {
      const q = block as QuoteBlock;
      const border = q.borderColor || docAccent;
      const bg = q.bgColor || "#f8fafc";
      const text = q.textColor || "#334155";

      const authorMarkup = q.author
        ? `\n#v(6pt)\n#align(right)[#text(size: 0.85em, weight: "bold", fill: rgb("#0f172a"))[— ${escapeTypst(q.author)}]${
            q.citation ? ` #text(size: 0.8em, fill: rgb("#64748b"))[, ${escapeTypst(q.citation)}]` : ""
          }]`
        : "";

      return `#rect(
  fill: rgb("${bg}"),
  stroke: (left: 3.5pt + rgb("${border}")),
  radius: (right: 4pt),
  inset: (x: 14pt, y: 12pt),
  width: 100%,
  [
    #text(style: "italic", size: 1.05em, fill: rgb("${text}"))["${escapeTypst(q.quote)}"]${authorMarkup}
  ]
)`;
    }

    case "key_value": {
      const kv = block as KeyValueBlock;
      const colsCount = kv.columnsCount || 2;
      const colTracks = Array(colsCount).fill("1fr").join(", ");

      const renderedItems = kv.items.map((item) => {
        return `[\n#block(
  fill: rgb("#f8fafc"),
  stroke: 0.5pt + rgb("#e2e8f0"),
  radius: 4pt,
  inset: 8pt,
  width: 100%,
  [
    #text(size: 0.72em, weight: "bold", fill: rgb("#64748b"))[${escapeTypst(item.key.toUpperCase())}] \\
    #v(2pt)
    #text(size: 0.95em, weight: "semibold", fill: rgb("#0f172a"))[${escapeTypst(item.value)}]
  ]
)\n]`;
      });

      const titleMarkup = kv.title
        ? `#text(weight: "bold", size: 1.05em, fill: rgb("#0f172a"))[${escapeTypst(kv.title)}]\n#v(4pt)\n`
        : "";

      return `${titleMarkup}#grid(
  columns: (${colTracks}),
  gutter: 8pt,
  ${renderedItems.join(",\n  ")}
)`;
    }

    case "timeline": {
      const tl = block as TimelineBlock;
      const isHorizontal = tl.orientation === "horizontal";
      const titleMarkup = tl.title
        ? `#text(weight: "bold", size: 1.1em, fill: rgb("#0f172a"))[${escapeTypst(tl.title)}]\n#v(6pt)\n`
        : "";

      if (isHorizontal) {
        const colsCount = Math.max(1, tl.steps.length);
        const colTracks = Array(colsCount).fill("1fr").join(", ");
        const stepCells = tl.steps.map((step) => {
          return `[
  #box(fill: rgb("${docAccent}"), radius: 10pt, inset: (x: 7pt, y: 3.5pt))[#text(size: 0.75em, weight: "bold", fill: rgb("#ffffff"))[${escapeTypst(step.stepNumber)}]] \\
  #v(4pt)
  #text(weight: "bold", size: 0.95em, fill: rgb("#0f172a"))[${escapeTypst(step.title)}] \\
  ${step.date ? `#text(size: 0.78em, fill: rgb("#64748b"))[${escapeTypst(step.date)}] \\ \n` : ""}#v(2pt)
  #text(size: 0.85em, fill: rgb("#475569"))[${escapeTypst(step.description)}]
]`;
        });

        return `${titleMarkup}#grid(
  columns: (${colTracks}),
  gutter: 12pt,
  ${stepCells.join(",\n  ")}
)`;
      }

      const gridItems: string[] = [];
      tl.steps.forEach((step) => {
        gridItems.push(
          `[#align(center + top)[#box(fill: rgb("${docAccent}"), radius: 12pt, inset: (x: 7pt, y: 4pt))[#text(size: 0.75em, weight: "bold", fill: rgb("#ffffff"))[${escapeTypst(step.stepNumber)}]]]]`,
          `[
  #text(weight: "bold", size: 0.95em, fill: rgb("#0f172a"))[${escapeTypst(step.title)}]${
            step.date ? ` #text(size: 0.8em, fill: rgb("#64748b"))[(${escapeTypst(step.date)})]` : ""
          } \\
  #v(2pt)
  #text(size: 0.85em, fill: rgb("#475569"))[${escapeTypst(step.description)}]
  #v(6pt)
]`
        );
      });

      return `${titleMarkup}#grid(
  columns: (26pt, 1fr),
  column-gutter: 10pt,
  row-gutter: 6pt,
  ${gridItems.join(",\n  ")}
)`;
    }

    case "signature": {
      const sig = block as SignatureBlock;
      const count = Math.max(1, sig.parties.length);
      const cols = Array(count).fill("1fr").join(", ");

      const renderedParties = sig.parties.map((party) => {
        const dateMarkup = party.date
          ? `\n  #v(2pt)\n  #text(size: 0.75em, fill: rgb("#64748b"))[Date: ${escapeTypst(party.date)}]`
          : "";
        return `[
  #v(26pt)
  #line(length: 100%, stroke: 0.75pt + rgb("#94a3b8"))
  #v(4pt)
  #text(weight: "bold", size: 0.95em, fill: rgb("#0f172a"))[${escapeTypst(party.name)}] \\
  #text(size: 0.82em, fill: rgb("#475569"))[${escapeTypst(party.title)}] \\
  #text(size: 0.75em, fill: rgb("#64748b"))[Role: ${escapeTypst(party.role)}]${dateMarkup}
]`;
      });

      const partiesGrid = `#grid(
  columns: (${cols}),
  gutter: 20pt,
  ${renderedParties.join(",\n  ")}
)`;

      if (sig.hasSealBox) {
        return `#grid(
  columns: (1fr, auto),
  gutter: 16pt,
  align: horizon,
  [
    ${partiesGrid}
  ],
  [
    #rect(
      stroke: 1pt + rgb("#cbd5e1"),
      radius: 4pt,
      width: 72pt,
      height: 72pt,
      [#align(center + horizon)[#text(size: 0.7em, fill: rgb("#94a3b8"), weight: "bold")[OFFICIAL\\ SEAL]]]
    )
  ]
)`;
      }

      return partiesGrid;
    }

    case "tags": {
      const tb = block as TagsBlock;
      const categoryMarkup = tb.category
        ? `#text(size: 0.82em, weight: "bold", fill: rgb("#64748b"))[${escapeTypst(tb.category)}: ] `
        : "";

      const pills = tb.tags.map((t) => {
        const pillBg = t.color || "#e0f2fe";
        const pillText = isColorDark(pillBg) ? "#ffffff" : "#0369a1";
        return `#box(fill: rgb("${pillBg}"), radius: 10pt, inset: (x: 8pt, y: 3.5pt))[#text(size: 0.78em, weight: "medium", fill: rgb("${pillText}"))[${escapeTypst(t.label)}]]`;
      });

      return `${categoryMarkup}${pills.join(" ")}`;
    }

    case "math": {
      const m = block as MathBlock;
      const cleanFormula = m.formula.trim().replace(/^\$+|\$+$/g, "");
      const captionMarkup = m.caption
        ? `\n#v(4pt)\n#align(center)[#text(size: 0.82em, style: "italic", fill: rgb("#64748b"))[${escapeTypst(m.caption)}]]`
        : "";

      if (m.equationNumber) {
        return `#grid(
  columns: (1fr, auto),
  gutter: 8pt,
  align: (center + horizon, right + horizon),
  [ $ ${cleanFormula} $ ],
  [ #text(size: 0.85em, fill: rgb("#64748b"))[(${escapeTypst(m.equationNumber)})] ]
)${captionMarkup}`;
      }

      return `#align(center)[ $ ${cleanFormula} $ ]${captionMarkup}`;
    }

    case "progress": {
      const p = block as ProgressBlock;
      const barColor = p.color || docAccent;
      const clamped = Math.max(0, Math.min(100, p.percentage));
      const targetMarkup = p.target ? ` / ${escapeTypst(p.target)}` : "";

      return `#block(width: 100%)[
  #grid(
    columns: (1fr, auto),
    [#text(weight: "semibold", size: 0.88em, fill: rgb("#0f172a"))[${escapeTypst(p.label)}]],
    [#text(weight: "bold", size: 0.88em, fill: rgb("${barColor}"))[${clamped}%${targetMarkup}]]
  )
  #v(4pt)
  #rect(width: 100%, height: 7pt, fill: rgb("#e2e8f0"), radius: 3.5pt)[
    #place(left)[#rect(width: ${clamped}%, height: 7pt, fill: rgb("${barColor}"), radius: 3.5pt)]
  ]
]`;
    }

    default:
      return "";
  }
}

export function generateTypstDocument(doc: DocumentState): string {
  const { settings, blocks } = doc;
  const { margins } = settings;
  const paper = settings.paper || "a4";

  const footerCode = settings.showPageNumbers
    ? 'footer: context align(center)[#text(size: 8pt, fill: rgb("#94a3b8"))[Page #counter(page).display() of #counter(page).final().first()]],'
    : "footer: none,";

  const preamble = `// Generated by Typst Drag & Drop Builder
#set page(
  paper: "${paper}",
  flipped: ${settings.orientation === "landscape"},
  margin: (
    top: ${margins.top},
    bottom: ${margins.bottom},
    left: ${margins.left},
    right: ${margins.right},
  ),
  ${footerCode}
)

#set text(
  font: ("${settings.font || "Liberation Sans"}", "Helvetica", "Arial"),
  size: 10pt,
  fill: rgb("#0f172a"),
  lang: "en"
)

#set par(justify: true, leading: 0.65em)

`;

  const renderedBlocks = blocks
    .map((b) => renderBlockToTypst(b, settings))
    .filter(Boolean)
    .join("\n\n");

  return preamble + renderedBlocks + "\n";
}
