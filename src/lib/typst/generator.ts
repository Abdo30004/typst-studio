import {
  DocumentBlock,
  DocumentState,
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
} from "@/types/document";

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

export function renderBlockToTypst(block: DocumentBlock): string {
  switch (block.type) {
    case "heading": {
      const h = block as HeadingBlock;
      const alignPrefix =
        h.align === "center"
          ? "#align(center)"
          : h.align === "right"
          ? "#align(right)"
          : "";
      const subtitleMarkup = h.subtitle
        ? `\n#v(2pt)\n#text(size: 0.85em, fill: rgb("#64748b"))[${escapeTypst(h.subtitle)}]`
        : "";

      const headingCode = `${"=".repeat(h.level)} ${escapeTypst(h.text)}${subtitleMarkup}`;
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

      const badgeMarkup = c.badge
        ? `#box(fill: rgb("#e2e8f0"), radius: 3pt, inset: (x: 5pt, y: 3pt))[#text(size: 0.75em, weight: "bold", fill: rgb("#475569"))[${escapeTypst(c.badge)}]] \\ \n#v(2pt)\n`
        : "";
      const titleMarkup = c.title
        ? `#text(weight: "bold", size: 1.1em, fill: rgb("#0f172a"))[${escapeTypst(c.title)}] \\ \n#v(4pt)\n`
        : "";
      const bodyMarkup = formatMarkdownToTypst(c.content);

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
      const colors = {
        note: { bg: "#eff6ff", border: "#3b82f6", text: "#1d4ed8" },
        tip: { bg: "#f0fdf4", border: "#10b981", text: "#047857" },
        warning: { bg: "#fffbeb", border: "#f59e0b", text: "#b45309" },
        caution: { bg: "#fef2f2", border: "#ef4444", text: "#b91c1c" },
      }[callout.variant] || { bg: "#f8fafc", border: "#64748b", text: "#334155" };

      return `#block(
  fill: rgb("${colors.bg}"),
  stroke: (left: 4pt + rgb("${colors.border}")),
  radius: (right: 4pt),
  inset: (x: 12pt, y: 10pt),
  width: 100%,
  [
    #text(weight: "bold", fill: rgb("${colors.text}"))[${escapeTypst(callout.title)}] \\
    #v(2pt)
    #text(fill: rgb("#1e293b"))[${formatMarkdownToTypst(callout.message)}]
  ]
)`;
    }

    case "card_metric": {
      const m = block as MetricCardBlock;
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
  fill: rgb("#f8fafc"),
  stroke: 1pt + rgb("#e2e8f0"),
  radius: 6pt,
  inset: 12pt,
  width: 100%,
  [
    #text(size: 0.85em, weight: "medium", fill: rgb("#64748b"))[${escapeTypst(m.label)}] \\
    #v(3pt)
    #text(size: 1.8em, weight: "bold", fill: rgb("#0f172a"))[${escapeTypst(m.value)}]${changeMarkup}
  ]
)`;
    }

    case "card_profile": {
      const p = block as ProfileCardBlock;
      const contactMarkup = p.contact
        ? `\n    #v(4pt)\n    #text(size: 0.8em, fill: rgb("#64748b"))[${escapeTypst(p.contact)}]`
        : "";

      return `#rect(
  fill: rgb("#ffffff"),
  stroke: 1pt + rgb("#e2e8f0"),
  radius: 8pt,
  inset: 14pt,
  width: 100%,
  [
    #text(size: 1.25em, weight: "bold", fill: rgb("#0f172a"))[${escapeTypst(p.name)}] \\
    #text(size: 0.9em, weight: "medium", fill: rgb("#2563eb"))[${escapeTypst(p.role)}] \\
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
        const inner = col.blocks.map(renderBlockToTypst).join("\n\n");
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
      if (!img.url) return "";

      const align = img.align || "center";
      const width = img.width || "80%";
      const captionMarkup = img.caption
        ? `\n#v(4pt)\n#text(size: 0.85em, style: "italic", fill: rgb("#64748b"))[${escapeTypst(img.caption)}]`
        : "";

      return `#align(${align})[
  #image("${img.url}", width: ${width})${captionMarkup}
]`;
    }

    case "table": {
      const tbl = block as TableBlock;
      const colsCount = Math.max(tbl.headers.length, tbl.rows[0]?.length || 1);
      const headersMarkup = tbl.headers.length > 0
        ? tbl.headers.map((h) => `[*${escapeTypst(h)}*]`).join(", ") + ",\n  "
        : "";

      const rowsMarkup = tbl.rows
        .map((row) => row.map((cell) => `[${escapeTypst(cell)}]`).join(", "))
        .join(",\n  ");

      const captionMarkup = tbl.caption
        ? `#align(center)[#text(size: 0.85em, weight: "medium", fill: rgb("#64748b"))[Table: ${escapeTypst(tbl.caption)}]]\n#v(4pt)\n`
        : "";

      const zebraFill = tbl.isZebra
        ? `fill: (col, row) => if row == 0 { rgb("#f1f5f9") } else if calc.even(row) { rgb("#f8fafc") } else { none },`
        : `fill: (col, row) => if row == 0 { rgb("#f1f5f9") } else { none },`;

      return `${captionMarkup}#align(center)[
#table(
  columns: ${colsCount},
  stroke: 0.5pt + rgb("#cbd5e1"),
  ${zebraFill}
  align: (col, row) => if row == 0 { center + horizon } else { left + horizon },
  ${headersMarkup}${rowsMarkup}
)
]`;
    }

    case "code": {
      const codeBlock = block as CodeBlock;
      const cleanCode = codeBlock.code.replace(/```/g, "\\`\\`\\`");
      const titleMarkup = codeBlock.filename
        ? `#block(fill: rgb("#1e293b"), radius: (top: 4pt), inset: (x: 10pt, y: 6pt), width: 100%)[#text(size: 0.8em, fill: rgb("#94a3b8"), font: "Liberation Mono")[${escapeTypst(codeBlock.filename)}]]\n`
        : "";

      return `${titleMarkup}#raw("${cleanCode}", lang: "${codeBlock.language || "text"}", block: true)`;
    }

    case "divider": {
      const div = block as DividerBlock;
      const spacing = div.spacing || 12;
      const thickness = div.thickness || 0.5;
      const color = div.color || "#e2e8f0";
      return `#v(${spacing}pt)\n#line(length: 100%, stroke: ${thickness}pt + rgb("${color}"))\n#v(${spacing}pt)`;
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
    .map(renderBlockToTypst)
    .filter(Boolean)
    .join("\n\n");

  return preamble + renderedBlocks + "\n";
}
