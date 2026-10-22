export function isColorDark(hexColor: string): boolean {
  if (!hexColor || !hexColor.startsWith("#")) return false;
  let hex = hexColor.replace("#", "");
  if (hex.length === 3) {
    hex = hex.split("").map((c) => c + c).join("");
  }
  if (hex.length !== 6) return false;

  const r = parseInt(hex.substring(0, 2), 16) || 0;
  const g = parseInt(hex.substring(2, 4), 16) || 0;
  const b = parseInt(hex.substring(4, 6), 16) || 0;

  // Standard perceived luminance formula
  const lum = 0.299 * r + 0.587 * g + 0.114 * b;
  return lum < 140;
}

export function getContrastingText(hexColor: string): "#ffffff" | "#0f172a" {
  return isColorDark(hexColor) ? "#ffffff" : "#0f172a";
}

export function getMutedText(hexColor: string): "#cbd5e1" | "#475569" {
  return isColorDark(hexColor) ? "#cbd5e1" : "#475569";
}

export const CALLOUT_THEMES = {
  note: {
    bg: "#eff6ff",
    border: "#3b82f6",
    text: "#1d4ed8",
    body: "#1e293b",
  },
  tip: {
    bg: "#f0fdf4",
    border: "#10b981",
    text: "#047857",
    body: "#1e293b",
  },
  warning: {
    bg: "#fffbeb",
    border: "#f59e0b",
    text: "#b45309",
    body: "#1e293b",
  },
  caution: {
    bg: "#fef2f2",
    border: "#ef4444",
    text: "#b91c1c",
    body: "#1e293b",
  },
};
