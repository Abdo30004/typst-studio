import { describe, it, expect } from "vitest";
import { UI_THEMES, getUITheme } from "@/lib/theme/themes";
import { THEME_PALETTES, getPalette, applyPaletteToDocument } from "@/lib/theme/palettes";
import { DocumentState, CardBlock, ColumnsBlock, MetricCardBlock, ProfileCardBlock, CalloutCardBlock, DividerBlock } from "@/types/document";

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

  it("should correctly configure light vs dark theme properties", () => {
    const lightTheme = getUITheme("editorial-light");
    expect(lightTheme.isDark).toBe(false);
    expect(lightTheme.colors.bg).toBe("#f4f4f5");
    expect(lightTheme.colors.textPrimary).toBe("#09090b");

    const tokyo = getUITheme("tokyo-midnight");
    expect(tokyo.isDark).toBe(true);
    expect(tokyo.colors.bg).toBe("#0a0e17");
    expect(tokyo.colors.accent).toBe("#38bdf8");

    const sepia = getUITheme("solarized-sepia");
    expect(sepia.isDark).toBe(true);
    expect(sepia.colors.accent).toBe("#f59e0b");
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
          id: "metric-1",
          type: "card_metric",
          label: "ARR",
          value: "$1.2M",
        } as MetricCardBlock,
        {
          id: "profile-1",
          type: "card_profile",
          name: "Alex",
          role: "Lead Architect",
          bio: "Rust expert",
        } as ProfileCardBlock,
        {
          id: "callout-1",
          type: "card_callout",
          variant: "note",
          title: "Note",
          message: "Note text",
        } as CalloutCardBlock,
        {
          id: "divider-1",
          type: "divider",
        } as DividerBlock,
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
    expect(updatedDoc.settings.paletteId).toBe(bauhausPal.id);

    // Verify standalone card updated
    const card = updatedDoc.blocks[0] as CardBlock;
    expect(card.fillColor).toBe(bauhausPal.defaults.cardFill);
    expect(card.strokeColor).toBe(bauhausPal.defaults.cardStroke);

    // Verify metric card updated
    const metric = updatedDoc.blocks[1] as MetricCardBlock;
    expect(metric.fillColor).toBe(bauhausPal.defaults.cardFill);
    expect(metric.strokeColor).toBe(bauhausPal.defaults.cardStroke);

    // Verify profile card updated
    const profile = updatedDoc.blocks[2] as ProfileCardBlock;
    expect(profile.fillColor).toBe(bauhausPal.defaults.cardFill);
    expect(profile.roleColor).toBe(bauhausPal.defaults.accent);

    // Verify callout card updated
    const callout = updatedDoc.blocks[3] as CalloutCardBlock;
    expect(callout.borderColor).toBe(bauhausPal.defaults.accent);

    // Verify divider updated
    const divider = updatedDoc.blocks[4] as DividerBlock;
    expect(divider.color).toBe(bauhausPal.defaults.dividerColor);

    // Verify nested card inside columns updated
    const cols = updatedDoc.blocks[5] as ColumnsBlock;
    const nestedCard = cols.columns[0].blocks[0] as CardBlock;
    expect(nestedCard.fillColor).toBe(bauhausPal.defaults.cardFill);
    expect(nestedCard.strokeColor).toBe(bauhausPal.defaults.cardStroke);
  });
});
