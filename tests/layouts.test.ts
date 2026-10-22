import { describe, it, expect } from "vitest";
import { renderBlockToTypst, generateTypstDocument } from "../src/lib/typst/generator";
import {
  findBlockById,
  updateBlockInList,
  deleteBlockInList,
  insertBlockIntoSlot,
} from "../src/lib/typst/block-utils";
import { harmonizeBlock, getPalette } from "../src/lib/theme/palettes";
import {
  GridLayoutBlock,
  QuoteBlock,
  KeyValueBlock,
  TimelineBlock,
  SignatureBlock,
  TagsBlock,
  MathBlock,
  ProgressBlock,
  DocumentState,
} from "../src/types/document";

describe("Universal Grid Layout & Publishing Elements Tests", () => {
  it("renders an Image - Title - Image grid layout with center alignment", () => {
    const grid: GridLayoutBlock = {
      id: "grid-hero",
      type: "grid_layout",
      presetId: "image_title_image",
      tracks: ["1fr", "2fr", "1fr"],
      gutter: 14,
      verticalAlign: "center",
      slots: [
        {
          id: "slot-1",
          widthFraction: "1fr",
          blocks: [
            {
              id: "img-left",
              type: "image",
              url: "/logo-left.png",
              width: "100%",
              align: "center",
            },
          ],
        },
        {
          id: "slot-2",
          widthFraction: "2fr",
          blocks: [
            {
              id: "head-center",
              type: "heading",
              level: 1,
              align: "center",
              text: "ANNUAL STRATEGY 2026",
              subtitle: "Board of Directors Review",
            },
          ],
        },
        {
          id: "slot-3",
          widthFraction: "1fr",
          blocks: [
            {
              id: "img-right",
              type: "image",
              url: "/logo-right.png",
              width: "100%",
              align: "center",
            },
          ],
        },
      ],
    };

    const result = renderBlockToTypst(grid);
    expect(result).toContain("#grid(");
    expect(result).toContain("columns: (1fr, 2fr, 1fr)");
    expect(result).toContain("gutter: 14pt");
    expect(result).toContain("align: (col, row) => horizon + left");
    expect(result).toContain('#image("/logo-left.png"');
    expect(result).toContain("ANNUAL STRATEGY 2026");
    expect(result).toContain('#image("/logo-right.png"');
  });

  it("renders pull quotes with border accent, author, and citation", () => {
    const quote: QuoteBlock = {
      id: "q-1",
      type: "quote",
      quote: "Simplicity is prerequisite for reliability.",
      author: "Edsger W. Dijkstra",
      citation: "EWD 498",
      borderColor: "#e11d48",
      bgColor: "#fff1f2",
      textColor: "#881337",
    };

    const result = renderBlockToTypst(quote);
    expect(result).toContain('#rect(');
    expect(result).toContain('fill: rgb("#fff1f2")');
    expect(result).toContain('stroke: (left: 3.5pt + rgb("#e11d48"))');
    expect(result).toContain('"Simplicity is prerequisite for reliability."');
    expect(result).toContain("— Edsger W. Dijkstra");
    expect(result).toContain("EWD 498");
  });

  it("renders key-value property grids with uppercase keys", () => {
    const kv: KeyValueBlock = {
      id: "kv-1",
      type: "key_value",
      title: "Document Metadata",
      columnsCount: 3,
      items: [
        { id: "item-1", key: "Author", value: "Architecture Core" },
        { id: "item-2", key: "Classification", value: "Confidential" },
        { id: "item-3", key: "Version", value: "v3.0.1" },
      ],
    };

    const result = renderBlockToTypst(kv);
    expect(result).toContain("Document Metadata");
    expect(result).toContain("columns: (1fr, 1fr, 1fr)");
    expect(result).toContain("gutter: 8pt");
    expect(result).toContain("AUTHOR");
    expect(result).toContain("CLASSIFICATION");
    expect(result).toContain("Confidential");
    expect(result).toContain("v3.0.1");
  });

  it("renders process timelines in vertical and horizontal orientations", () => {
    const verticalTimeline: TimelineBlock = {
      id: "tl-v",
      type: "timeline",
      title: "Project Phases",
      orientation: "vertical",
      steps: [
        {
          id: "s1",
          stepNumber: "01",
          title: "Discovery & Scope",
          date: "Sprint 1",
          description: "Establish requirements and acceptance criteria.",
        },
        {
          id: "s2",
          stepNumber: "02",
          title: "Architecture & POC",
          date: "Sprint 2",
          description: "Validate WASM compile times and typography contracts.",
        },
      ],
    };

    const vResult = renderBlockToTypst(verticalTimeline);
    expect(vResult).toContain("Project Phases");
    expect(vResult).toContain("columns: (26pt, 1fr)");
    expect(vResult).toContain("Discovery & Scope");
    expect(vResult).toContain("Sprint 1");
    expect(vResult).toContain("Validate WASM compile times");

    const horizontalTimeline: TimelineBlock = {
      ...verticalTimeline,
      id: "tl-h",
      orientation: "horizontal",
    };

    const hResult = renderBlockToTypst(horizontalTimeline);
    expect(hResult).toContain("columns: (1fr, 1fr)");
    expect(hResult).toContain("gutter: 12pt");
  });

  it("renders signatures block with official seal stamp box", () => {
    const sig: SignatureBlock = {
      id: "sig-contract",
      type: "signature",
      hasSealBox: true,
      parties: [
        {
          id: "p1",
          name: "Marcus Vance",
          title: "Principal Executive",
          role: "Client",
          date: "2026-10-23",
        },
        {
          id: "p2",
          name: "Elena Rostova",
          title: "Chief Architect",
          role: "Contractor",
          date: "2026-10-23",
        },
      ],
    };

    const result = renderBlockToTypst(sig);
    expect(result).toContain("#line(length: 100%");
    expect(result).toContain("Marcus Vance");
    expect(result).toContain("Principal Executive");
    expect(result).toContain("Elena Rostova");
    expect(result).toContain("Role: Contractor");
    expect(result).toContain("OFFICIAL\\ SEAL");
  });

  it("renders pill tags strip with category prefix", () => {
    const tags: TagsBlock = {
      id: "tags-1",
      type: "tags",
      category: "Skills & Tech",
      tags: [
        { id: "t1", label: "Rust", color: "#fef3c7" },
        { id: "t2", label: "Typst", color: "#e0f2fe" },
        { id: "t3", label: "Next.js", color: "#f3e8ff" },
      ],
    };

    const result = renderBlockToTypst(tags);
    expect(result).toContain("Skills & Tech:");
    expect(result).toContain("Rust");
    expect(result).toContain("Typst");
    expect(result).toContain("Next.js");
  });

  it("renders numbered display math equations and caption", () => {
    const math: MathBlock = {
      id: "math-1",
      type: "math",
      formula: "sum_(k=1)^n k = (n(n+1))/2",
      equationNumber: "1",
      caption: "Gaussian summation identity",
    };

    const result = renderBlockToTypst(math);
    expect(result).toContain("$ sum_(k=1)^n k = (n(n+1))/2 $");
    expect(result).toContain("(1)");
    expect(result).toContain("Gaussian summation identity");
  });

  it("renders milestone progress bar with target indicator", () => {
    const progress: ProgressBlock = {
      id: "prog-1",
      type: "progress",
      label: "Quarterly Revenue",
      percentage: 92,
      target: "$1,000,000",
      color: "#2563eb",
    };

    const result = renderBlockToTypst(progress);
    expect(result).toContain("Quarterly Revenue");
    expect(result).toContain("92% / \\$1,000,000");
    expect(result).toContain('width: 92%');
    expect(result).toContain('fill: rgb("#2563eb")');
  });

  it("performs recursive search, mutation, and slot insertion in block-utils", () => {
    const initialGrid: GridLayoutBlock = {
      id: "grid-root",
      type: "grid_layout",
      tracks: ["1fr", "1fr"],
      gutter: 12,
      verticalAlign: "top",
      slots: [
        {
          id: "slot-A",
          widthFraction: "1fr",
          blocks: [
            {
              id: "child-heading",
              type: "heading",
              level: 2,
              align: "left",
              text: "Original Child Title",
            },
          ],
        },
        {
          id: "slot-B",
          widthFraction: "1fr",
          blocks: [],
        },
      ],
    };

    const docBlocks = [initialGrid];

    // 1. findBlockById recursively inside slot
    const found = findBlockById(docBlocks, "child-heading");
    expect(found).not.toBeNull();
    expect(found?.type).toBe("heading");

    // 2. updateBlockInList recursively inside slot
    const updated = updateBlockInList(docBlocks, "child-heading", {
      text: "Updated Child Title",
    });
    const updatedBlock = findBlockById(updated, "child-heading") as any;
    expect(updatedBlock.text).toBe("Updated Child Title");

    // 3. insertBlockIntoSlot into slot-B
    const withInserted = insertBlockIntoSlot(updated, "grid-root", "slot-B", {
      id: "new-progress",
      type: "progress",
      label: "Sprint Goal",
      percentage: 75,
    });
    const insertedProg = findBlockById(withInserted, "new-progress");
    expect(insertedProg).not.toBeNull();
    expect(insertedProg?.type).toBe("progress");

    // 4. deleteBlockInList recursively inside slot-A
    const afterDelete = deleteBlockInList(withInserted, "child-heading");
    const searchDeleted = findBlockById(afterDelete, "child-heading");
    expect(searchDeleted).toBeNull();
  });

  it("harmonizes grid nested slots and specialized blocks with theme palettes", () => {
    const cyberPalette = getPalette("cyber");

    const rawGrid: GridLayoutBlock = {
      id: "g1",
      type: "grid_layout",
      tracks: ["1fr", "1fr"],
      gutter: 12,
      verticalAlign: "top",
      slots: [
        {
          id: "s1",
          widthFraction: "1fr",
          blocks: [
            {
              id: "q1",
              type: "quote",
              quote: "Cyberpunk aesthetic.",
            },
            {
              id: "p1",
              type: "progress",
              label: "Overclocking",
              percentage: 95,
            },
          ],
        },
      ],
    };

    const harmonized = harmonizeBlock(rawGrid, cyberPalette) as GridLayoutBlock;
    const harmonizedQuote = harmonized.slots[0].blocks[0] as QuoteBlock;
    const harmonizedProgress = harmonized.slots[0].blocks[1] as ProgressBlock;

    expect(harmonizedQuote.borderColor).toBe(cyberPalette.defaults.accent);
    expect(harmonizedProgress.color).toBe(cyberPalette.defaults.accent);
  });
});
