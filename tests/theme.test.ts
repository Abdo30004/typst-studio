import { describe, it, expect } from "vitest";
import { UI_THEMES, getUITheme } from "@/lib/theme/themes";
import { THEME_PALETTES, getPalette, applyPaletteToDocument } from "@/lib/theme/palettes";
import { DocumentState, CardBlock, ColumnsBlock } from "@/types/document";

describe("UI Themes Specification", () => {
  it("should define all 5 core UI workspace themes", () => {
    const expectedThemeIds = [
      "atelier-dark",
      "editorial-light",
      "tokyo-midnight",
      "nordic-steel",
      "solarized-sepia",
    ];

    expect(UI_THEMES.length).toBe(5);
    expectedThemeIds.forEach((id) => {
      const theme = UI_THEMES.find((t) => t.id === id);
      expect(theme).toBeDefined();
      expect(theme?.colors.bg).toMatch(/^#[0-9a-fA-F]{6}$/);
      expect(theme?.colors.accent).toMatch(/^#[0-9a-fA-F]{6}$/);
    });
  });

  it("should safely return fallback theme for invalid id", () => {
    const fallback = getUITheme("non-existent-theme");
    expect(fallback.id).toBe("atelier-dark");
  });
});

describe("Document Design Palettes", () => {
  it("should define all 7 curated design palettes with complete swatches", () => {
    const expectedPaletteIds = [
      "monochrome",
      "bauhaus",
      "editorial",
      "cyber",
      "glacier",
      "corporate",
      "botanical",
    ];

    expect(THEME_PALETTES.length).toBe(7);
    expectedPaletteIds.forEach((id) => {
      const pal = getPalette(id);
      expect(pal.id).toBe(id);
      expect(pal.swatches.length).toBeGreaterThanOrEqual(5);
      pal.swatches.forEach((swatch) => {
        expect(swatch.fill).toMatch(/^#[0-9a-fA-F]{6}$/);
        expect(swatch.stroke).toMatch(/^#[0-9a-fA-F]{6}$/);
      });
    });
  });

  it("should correctly harmonize cards and column blocks via applyPaletteToDocument", () => {
    const mockDoc: DocumentState = {
      id: "doc-test-1",
      title: "Test Publication",
      preset: "a4_document",
      settings: {
        paper: "a4",
        orientation: "portrait",
        margins: { top: "2.5cm", bottom: "2.5cm", left: "2.5cm", right: "2.5cm" },
        font: "Liberation Sans",
        accentColor: "#000000",
        showPageNumbers: true,
      },
      blocks: [
        {
          id: "card-1",
          type: "card",
          title: "Standalone Card",
          content: "Sample body text",
          fillColor: "#111111",
          strokeColor: "#222222",
        } as CardBlock,
        {
          id: "cols-1",
          type: "columns",
          columnsCount: 2,
          gutter: 12,
          columns: [
            {
              id: "col-1",
              blocks: [
                {
                  id: "nested-card",
                  type: "card",
                  title: "Nested Card",
                  content: "Nested body",
                  fillColor: "#333333",
                  strokeColor: "#444444",
                } as CardBlock,
              ],
            },
            { id: "col-2", blocks: [] },
          ],
        } as ColumnsBlock,
      ],
      updatedAt: new Date().toISOString(),
    };

    const bauhausPal = getPalette("bauhaus");
    const updatedDoc = applyPaletteToDocument(bauhausPal, mockDoc);

    // Verify accent color updated
    expect(updatedDoc.settings.accentColor).toBe(bauhausPal.defaults.accent);

    // Verify standalone card updated
    const card = updatedDoc.blocks[0] as CardBlock;
    expect(card.fillColor).toBe(bauhausPal.defaults.cardFill);
    expect(card.strokeColor).toBe(bauhausPal.defaults.cardStroke);

    // Verify nested card inside columns updated
    const cols = updatedDoc.blocks[1] as ColumnsBlock;
    const nestedCard = cols.columns[0].blocks[0] as CardBlock;
    expect(nestedCard.fillColor).toBe(bauhausPal.defaults.cardFill);
    expect(nestedCard.strokeColor).toBe(bauhausPal.defaults.cardStroke);
  });
});
