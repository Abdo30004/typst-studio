export type UIThemeId =
  | "atelier-dark"
  | "editorial-light"
  | "tokyo-midnight"
  | "nordic-steel"
  | "solarized-sepia";

export interface UITheme {
  id: UIThemeId;
  name: string;
  description: string;
  isDark: boolean;
  colors: {
    bg: string;
    surface: string;
    surfaceHover: string;
    border: string;
    borderSubtle: string;
    textPrimary: string;
    textSecondary: string;
    textMuted: string;
    accent: string;
    accentText: string;
    deskBg: string;
  };
}

export type PaletteId =
  | "monochrome"
  | "bauhaus"
  | "editorial"
  | "cyber"
  | "glacier"
  | "corporate"
  | "botanical";

export interface ColorSwatch {
  label: string;
  fill: string;
  stroke: string;
  text?: string;
}

export interface ThemePalette {
  id: PaletteId;
  name: string;
  description: string;
  category: "monochrome" | "editorial" | "vibrant" | "minimal";
  swatches: ColorSwatch[];
  defaults: {
    cardFill: string;
    cardStroke: string;
    accent: string;
    badgeBg: string;
    badgeText: string;
    dividerColor: string;
    codeBg: string;
    calloutBg?: string;
    calloutBorder?: string;
    calloutText?: string;
    tableHeaderBg?: string;
    tableBorder?: string;
    tableHeaderColor?: string;
  };
}
