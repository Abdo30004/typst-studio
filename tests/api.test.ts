import { describe, it, expect } from "vitest";
import { generateTypstDocument } from "../src/lib/typst/generator";
import { createInitialDocument, PRESET_CONFIGS } from "../src/lib/typst/presets";

describe("Document Presets & Architecture Integration", () => {
  it("provides valid presets for all document formats", () => {
    const presets = ["a4_document", "letter_report", "presentation_16_9", "resume", "cheatsheet"] as const;
    
    for (const p of presets) {
      const config = PRESET_CONFIGS[p];
      expect(config).toBeDefined();
      expect(config.label).toBeTruthy();
      expect(config.settings.paper).toBeTruthy();

      const doc = createInitialDocument(p);
      expect(doc.blocks.length).toBeGreaterThan(0);

      const typst = generateTypstDocument(doc);
      expect(typst).toContain("#set page(");
      expect(typst.length).toBeGreaterThan(100);
    }
  });

  it("compiles resume template into valid multi-column Typst markup", () => {
    const resume = createInitialDocument("resume", "Jane Doe");
    const typst = generateTypstDocument(resume);

    expect(typst).toContain("Jane Doe");
    expect(typst).toContain("#grid(");
    expect(typst).toContain("Executive Summary");
  });
});
