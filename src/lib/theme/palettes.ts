import {
  DocumentBlock,
  DocumentState,
  CardBlock,
  DividerBlock,
  CalloutCardBlock,
  MetricCardBlock,
  ProfileCardBlock,
} from "@/types/document";
import { ThemePalette, PaletteId } from "./types";

export const THEME_PALETTES: ThemePalette[] = [
  {
    id: "monochrome",
    name: "Architectural Monochrome",
    description: "Swiss atelier high-contrast black, obsidian, zinc, and pure white.",
    category: "monochrome",
    swatches: [
      { label: "Obsidian", fill: "#09090b", stroke: "#27272a", text: "#ffffff" },
      { label: "Zinc Dark", fill: "#18181b", stroke: "#3f3f46", text: "#f4f4f5" },
      { label: "Steel", fill: "#27272a", stroke: "#52525b", text: "#e4e4e7" },
      { label: "Muted Plate", fill: "#f4f4f5", stroke: "#e4e4e7", text: "#18181b" },
      { label: "Pure Paper", fill: "#ffffff", stroke: "#d4d4d8", text: "#09090b" },
      { label: "Warm Editorial", fill: "#fafafa", stroke: "#e5e5e5", text: "#18181b" },
    ],
    defaults: {
      cardFill: "#ffffff",
      cardStroke: "#e4e4e7",
      accent: "#09090b",
      badgeBg: "#09090b",
      badgeText: "#ffffff",
      dividerColor: "#e4e4e7",
      codeBg: "#09090b",
    },
  },
  {
    id: "bauhaus",
    name: "Swiss Bauhaus",
    description: "Iconic modernist primary color harmony on matte paper.",
    category: "vibrant",
    swatches: [
      { label: "Bauhaus Red", fill: "#e11d48", stroke: "#be123c", text: "#ffffff" },
      { label: "Cobalt Blue", fill: "#2563eb", stroke: "#1d4ed8", text: "#ffffff" },
      { label: "Ochre Yellow", fill: "#d97706", stroke: "#b45309", text: "#ffffff" },
      { label: "Matte Charcoal", fill: "#18181b", stroke: "#27272a", text: "#ffffff" },
      { label: "Bauhaus Cream", fill: "#fefefe", stroke: "#e2e8f0", text: "#0f172a" },
      { label: "Alabaster Light", fill: "#f8fafc", stroke: "#cbd5e1", text: "#0f172a" },
    ],
    defaults: {
      cardFill: "#f8fafc",
      cardStroke: "#cbd5e1",
      accent: "#e11d48",
      badgeBg: "#2563eb",
      badgeText: "#ffffff",
      dividerColor: "#cbd5e1",
      codeBg: "#0f172a",
    },
  },
  {
    id: "editorial",
    name: "Kinfolk Editorial",
    description: "Earthy, warm, literary tones of terracotta, espresso, and sand.",
    category: "editorial",
    swatches: [
      { label: "Dark Roast", fill: "#1c1917", stroke: "#292524", text: "#fafaf9" },
      { label: "Terracotta", fill: "#c2410c", stroke: "#9a3412", text: "#ffffff" },
      { label: "Warm Sand", fill: "#f5f5f4", stroke: "#e7e5e4", text: "#292524" },
      { label: "Washed Linen", fill: "#fafaf9", stroke: "#d6d3d1", text: "#1c1917" },
      { label: "Forest Sage", fill: "#3f6212", stroke: "#365314", text: "#ffffff" },
      { label: "Umber", fill: "#78350f", stroke: "#451a03", text: "#ffffff" },
    ],
    defaults: {
      cardFill: "#fafaf9",
      cardStroke: "#e7e5e4",
      accent: "#c2410c",
      badgeBg: "#1c1917",
      badgeText: "#fafaf9",
      dividerColor: "#e7e5e4",
      codeBg: "#1c1917",
    },
  },
  {
    id: "cyber",
    name: "Cyber OLED Minimal",
    description: "Pure OLED blacks with electric neon mint and titanium gray.",
    category: "minimal",
    swatches: [
      { label: "OLED Black", fill: "#000000", stroke: "#18181b", text: "#ffffff" },
      { label: "Neon Mint", fill: "#10b981", stroke: "#059669", text: "#ffffff" },
      { label: "Deep Graphite", fill: "#18181b", stroke: "#27272a", text: "#f4f4f5" },
      { label: "Cold Silver", fill: "#94a3b8", stroke: "#64748b", text: "#0f172a" },
      { label: "Pure Ice", fill: "#f8fafc", stroke: "#e2e8f0", text: "#000000" },
      { label: "Dark Cyan", fill: "#0e7490", stroke: "#155e75", text: "#ffffff" },
    ],
    defaults: {
      cardFill: "#ffffff",
      cardStroke: "#e2e8f0",
      accent: "#10b981",
      badgeBg: "#000000",
      badgeText: "#10b981",
      dividerColor: "#e2e8f0",
      codeBg: "#000000",
    },
  },
  {
    id: "glacier",
    name: "Nordic Glacier",
    description: "Crisp polar blues, arctic white, and frosted slate.",
    category: "minimal",
    swatches: [
      { label: "Deep Navy", fill: "#0f172a", stroke: "#1e293b", text: "#f8fafc" },
      { label: "Glacier Blue", fill: "#0284c7", stroke: "#0369a1", text: "#ffffff" },
      { label: "Frost Tint", fill: "#f0f9ff", stroke: "#bae6fd", text: "#0369a1" },
      { label: "Slate Mist", fill: "#64748b", stroke: "#475569", text: "#ffffff" },
      { label: "Alpine White", fill: "#ffffff", stroke: "#e0f2fe", text: "#0f172a" },
      { label: "Ice Berg", fill: "#e0f2fe", stroke: "#7dd3fc", text: "#0c4a6e" },
    ],
    defaults: {
      cardFill: "#f0f9ff",
      cardStroke: "#bae6fd",
      accent: "#0284c7",
      badgeBg: "#0f172a",
      badgeText: "#38bdf8",
      dividerColor: "#bae6fd",
      codeBg: "#0f172a",
    },
  },
  {
    id: "corporate",
    name: "Corporate Ledger",
    description: "Executive navy, slate steel, and clean professional platinum.",
    category: "editorial",
    swatches: [
      { label: "Midnight Executive", fill: "#0a192f", stroke: "#172a45", text: "#ffffff" },
      { label: "Steel Blue", fill: "#1e3a8a", stroke: "#172554", text: "#ffffff" },
      { label: "Platinum Plate", fill: "#f1f5f9", stroke: "#cbd5e1", text: "#0f172a" },
      { label: "Slate Crisp", fill: "#334155", stroke: "#1e293b", text: "#ffffff" },
      { label: "Clean Sheet", fill: "#ffffff", stroke: "#e2e8f0", text: "#0f172a" },
      { label: "Silver Mist", fill: "#e2e8f0", stroke: "#94a3b8", text: "#1e293b" },
    ],
    defaults: {
      cardFill: "#ffffff",
      cardStroke: "#cbd5e1",
      accent: "#1e3a8a",
      badgeBg: "#0a192f",
      badgeText: "#ffffff",
      dividerColor: "#cbd5e1",
      codeBg: "#0a192f",
    },
  },
  {
    id: "botanical",
    name: "Botanical Earth",
    description: "Deep evergreen, olive sage, warm ochre, and linen canvas.",
    category: "editorial",
    swatches: [
      { label: "Deep Evergreen", fill: "#064e3b", stroke: "#065f46", text: "#ecfdf5" },
      { label: "Sage Olive", fill: "#047857", stroke: "#065f46", text: "#ffffff" },
      { label: "Sandstone", fill: "#fef3c7", stroke: "#fde68a", text: "#78350f" },
      { label: "Earthy Linen", fill: "#f7fee7", stroke: "#d9f99d", text: "#365314" },
      { label: "Botanical White", fill: "#ffffff", stroke: "#e2e8f0", text: "#064e3b" },
      { label: "Bark Brown", fill: "#78350f", stroke: "#451a03", text: "#ffffff" },
    ],
    defaults: {
      cardFill: "#f7fee7",
      cardStroke: "#d9f99d",
      accent: "#047857",
      badgeBg: "#064e3b",
      badgeText: "#ecfdf5",
      dividerColor: "#d9f99d",
      codeBg: "#064e3b",
    },
  },
];

export function getPalette(id: PaletteId | string): ThemePalette {
  return THEME_PALETTES.find((p) => p.id === id) || THEME_PALETTES[0];
}

/**
 * Harmonize a block's colors to a ThemePalette
 */
function harmonizeBlock(block: DocumentBlock, palette: ThemePalette): DocumentBlock {
  switch (block.type) {
    case "card": {
      const c = block as CardBlock;
      return {
        ...c,
        fillColor: palette.defaults.cardFill,
        strokeColor: palette.defaults.cardStroke,
        badgeBg: palette.defaults.badgeBg,
        badgeText: palette.defaults.badgeText,
      };
    }
    case "card_callout": {
      const callout = block as CalloutCardBlock;
      if (callout.variant === "note") {
        return {
          ...callout,
          borderColor: palette.defaults.accent,
          textColor: palette.defaults.accent,
          bgColor: palette.defaults.cardFill === "#ffffff" ? "#eff6ff" : palette.defaults.cardFill,
        };
      }
      return callout;
    }
    case "card_metric": {
      const m = block as MetricCardBlock;
      return {
        ...m,
        fillColor: palette.defaults.cardFill === "#ffffff" ? "#f8fafc" : palette.defaults.cardFill,
        strokeColor: palette.defaults.cardStroke,
      };
    }
    case "card_profile": {
      const p = block as ProfileCardBlock;
      return {
        ...p,
        fillColor: palette.defaults.cardFill,
        strokeColor: palette.defaults.cardStroke,
        roleColor: palette.defaults.accent,
      };
    }
    case "divider": {
      const d = block as DividerBlock;
      return {
        ...d,
        color: palette.defaults.dividerColor,
      };
    }
    case "columns": {
      return {
        ...block,
        columns: block.columns.map((col) => ({
          ...col,
          blocks: col.blocks.map((innerB) => harmonizeBlock(innerB, palette)),
        })),
      };
    }
    default:
      return block;
  }
}

/**
 * Apply the colors of a ThemePalette across an existing document.
 * Modifies cards, callouts, metrics, profiles, dividers, and document settings seamlessly.
 */
export function applyPaletteToDocument(
  palette: ThemePalette,
  documentState: DocumentState
): DocumentState {
  const updatedBlocks = documentState.blocks.map((block) => harmonizeBlock(block, palette));

  return {
    ...documentState,
    settings: {
      ...documentState.settings,
      accentColor: palette.defaults.accent,
      paletteId: palette.id,
    },
    blocks: updatedBlocks,
    updatedAt: new Date().toISOString(),
  };
}
