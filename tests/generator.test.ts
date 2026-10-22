import { describe, it, expect } from "vitest";
import { generateTypstDocument, renderBlockToTypst, escapeTypst } from "../src/lib/typst/generator";
import { createInitialDocument, PRESET_CONFIGS } from "../src/lib/typst/presets";
import { CardBlock, CalloutCardBlock, ColumnsBlock, TableBlock } from "../src/types/document";

describe("Typst Generator Tests", () => {
  it("escapes special Typst characters including labels and citations", () => {
    const raw = "Email alex@example.com <45ms> #1 [note] $50";
    const escaped = escapeTypst(raw);
    expect(escaped).toBe("Email alex\\@example.com \\<45ms\\> \\#1 \\[note\\] \\$50");
  });

  it("renders a card block with custom styling", () => {
    const card: CardBlock = {
      id: "test-card",
      type: "card",
      title: "Architecture Highlights",
      content: "Microservices with Rust and Next.js",
      fillColor: "#f1f5f9",
      strokeColor: "#94a3b8",
      strokeWidth: 2,
      radius: 8,
      padding: 16,
    };

    const result = renderBlockToTypst(card);
    expect(result).toContain('#rect(');
    expect(result).toContain('fill: rgb("#f1f5f9")');
    expect(result).toContain('stroke: 2pt + rgb("#94a3b8")');
    expect(result).toContain('radius: 8pt');
    expect(result).toContain('inset: 16pt');
    expect(result).toContain('Architecture Highlights');
    expect(result).toContain('Microservices with Rust and Next.js');
  });

  it("renders callout cards with correct variant palette", () => {
    const callout: CalloutCardBlock = {
      id: "test-callout",
      type: "card_callout",
      variant: "tip",
      title: "Pro Tip",
      message: "Use Docker for consistent deployments.",
    };

    const result = renderBlockToTypst(callout);
    expect(result).toContain('rgb("#f0fdf4")');
    expect(result).toContain('stroke: (left: 4pt + rgb("#10b981"))');
    expect(result).toContain('Pro Tip');
    expect(result).toContain('Use Docker for consistent deployments.');
  });

  it("renders multi-column grid containers", () => {
    const cols: ColumnsBlock = {
      id: "test-cols",
      type: "columns",
      columnsCount: 2,
      gutter: 14,
      columns: [
        {
          id: "col-1",
          blocks: [{ id: "t1", type: "text", content: "Column 1 text" }],
        },
        {
          id: "col-2",
          blocks: [{ id: "t2", type: "text", content: "Column 2 text" }],
        },
      ],
    };

    const result = renderBlockToTypst(cols);
    expect(result).toContain('#grid(');
    expect(result).toContain('columns: (1fr, 1fr)');
    expect(result).toContain('gutter: 14pt');
    expect(result).toContain('Column 1 text');
    expect(result).toContain('Column 2 text');
  });

  it("renders data tables with headers and rows", () => {
    const table: TableBlock = {
      id: "test-table",
      type: "table",
      headers: ["Service", "Status"],
      rows: [
        ["API", "Healthy"],
        ["Database", "Connected"],
      ],
      caption: "System Health",
    };

    const result = renderBlockToTypst(table);
    expect(result).toContain('#table(');
    expect(result).toContain('columns: 2');
    expect(result).toContain('[*Service*], [*Status*]');
    expect(result).toContain('[API], [Healthy]');
  });

  it("generates a valid Typst document with modern context footer for all presets", () => {
    const presets = ["a4_document", "resume", "presentation_16_9", "cheatsheet"] as const;
    for (const p of presets) {
      const doc = createInitialDocument(p, "Test Document");
      const typstCode = generateTypstDocument(doc);

      expect(typstCode).toContain('#set page(');
      expect(typstCode).not.toContain('locate(loc');
      expect(typstCode).not.toContain('#if true');
      expect(typstCode).toContain('#set text(');
    }
  });

  it("synchronizes accent colors and contrasting text in Typst output", () => {
    const doc = createInitialDocument("a4_document", "Color Sync Doc");
    doc.settings.accentColor = "#e11d48"; // Bauhaus red

    const typstCode = generateTypstDocument(doc);
    expect(typstCode).toContain('#line(length: 100%, stroke: 1.5pt + rgb("#e11d48"))');
  });
});
