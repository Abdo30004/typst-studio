"use client";

import React, { createContext, useContext, useEffect, useState, useMemo } from "react";
import { UITheme, UIThemeId, ThemePalette, PaletteId } from "./types";
import { UI_THEMES, getUITheme } from "./themes";
import { THEME_PALETTES, getPalette, applyPaletteToDocument } from "./palettes";
import { DocumentState } from "@/types/document";

interface ThemeContextType {
  uiTheme: UIThemeId;
  setUITheme: (themeId: UIThemeId) => void;
  currentUITheme: UITheme;
  activePaletteId: PaletteId;
  setActivePaletteId: (paletteId: PaletteId) => void;
  activePalette: ThemePalette;
  allPalettes: ThemePalette[];
  allUIThemes: UITheme[];
  applyPalette: (doc: DocumentState) => DocumentState;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [uiTheme, setUiThemeState] = useState<UIThemeId>("atelier-dark");
  const [activePaletteId, setActivePaletteIdState] = useState<PaletteId>("monochrome");
  const [mounted, setMounted] = useState(false);

  // Load preferences from localStorage on mount
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem("typst-studio-theme") as UIThemeId;
      if (savedTheme && UI_THEMES.some((t) => t.id === savedTheme)) {
        setUiThemeState(savedTheme);
      }
      const savedPalette = localStorage.getItem("typst-studio-palette") as PaletteId;
      if (savedPalette && THEME_PALETTES.some((p) => p.id === savedPalette)) {
        setActivePaletteIdState(savedPalette);
      }
    } catch {
      // Ignore localStorage errors
    }
    setMounted(true);
  }, []);

  // Synchronize UI Theme with DOM attributes and CSS Custom Properties
  useEffect(() => {
    if (typeof window === "undefined") return;
    const themeConfig = getUITheme(uiTheme);

    const root = document.documentElement;
    root.setAttribute("data-theme", uiTheme);
    if (themeConfig.isDark) {
      root.classList.add("dark");
      root.classList.remove("light");
    } else {
      root.classList.remove("dark");
      root.classList.add("light");
    }

    // Set core CSS variables for universal cascading
    root.style.setProperty("--theme-bg", themeConfig.colors.bg);
    root.style.setProperty("--theme-panel", themeConfig.colors.surface || themeConfig.colors.bg);
    root.style.setProperty("--theme-surface", themeConfig.colors.surface);
    root.style.setProperty("--theme-surface-hover", themeConfig.colors.surfaceHover);
    root.style.setProperty("--theme-border", themeConfig.colors.border);
    root.style.setProperty("--theme-border-subtle", themeConfig.colors.borderSubtle);
    root.style.setProperty("--theme-text-primary", themeConfig.colors.textPrimary);
    root.style.setProperty("--theme-text-secondary", themeConfig.colors.textSecondary);
    root.style.setProperty("--theme-text-muted", themeConfig.colors.textMuted);
    root.style.setProperty("--theme-accent", themeConfig.colors.accent);
    root.style.setProperty("--theme-accent-text", themeConfig.colors.accentText);
    root.style.setProperty("--theme-desk", themeConfig.colors.deskBg);

    document.body.style.backgroundColor = themeConfig.colors.bg;
    document.body.style.color = themeConfig.colors.textPrimary;
  }, [uiTheme]);

  const setUITheme = (themeId: UIThemeId) => {
    setUiThemeState(themeId);
    try {
      localStorage.setItem("typst-studio-theme", themeId);
    } catch {
      // Ignore
    }
  };

  const setActivePaletteId = (paletteId: PaletteId) => {
    setActivePaletteIdState(paletteId);
    try {
      localStorage.setItem("typst-studio-palette", paletteId);
    } catch {
      // Ignore
    }
  };

  const currentUITheme = useMemo(() => getUITheme(uiTheme), [uiTheme]);
  const activePalette = useMemo(() => getPalette(activePaletteId), [activePaletteId]);

  const applyPalette = (doc: DocumentState): DocumentState => {
    return applyPaletteToDocument(activePalette, doc);
  };

  return (
    <ThemeContext.Provider
      value={{
        uiTheme,
        setUITheme,
        currentUITheme,
        activePaletteId,
        setActivePaletteId,
        activePalette,
        allPalettes: THEME_PALETTES,
        allUIThemes: UI_THEMES,
        applyPalette,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
