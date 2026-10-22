"use client";

import React, { useState, useRef, useEffect } from "react";
import { useTheme } from "@/lib/theme";
import { UIThemeId, PaletteId } from "@/lib/theme/types";
import { applyPaletteToDocument } from "@/lib/theme/palettes";
import { DocumentState } from "@/types/document";
import { Palette, Check, Sparkles, Moon, Sun, Monitor, Wand2, X } from "lucide-react";

interface Props {
  documentState?: DocumentState;
  onApplyPaletteToDoc?: (updatedDoc: DocumentState) => void;
  className?: string;
  compact?: boolean;
}

export function ThemeQuickSwitcher({
  documentState,
  onApplyPaletteToDoc,
  className = "",
  compact = false,
}: Props) {
  const {
    uiTheme,
    setUITheme,
    currentUITheme,
    activePaletteId,
    setActivePaletteId,
    activePalette,
    allPalettes,
    allUIThemes,
    applyPalette,
  } = useTheme();

  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"ui" | "palette">("ui");
  const [appliedNotification, setAppliedNotification] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleApplyPaletteToCurrentDocument = () => {
    if (!documentState || !onApplyPaletteToDoc) return;
    const updated = applyPalette(documentState);
    onApplyPaletteToDoc(updated);
    setAppliedNotification(true);
    setTimeout(() => setAppliedNotification(false), 2200);
  };

  return (
    <div className={`relative inline-block ${className}`} ref={menuRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className={`flex items-center gap-2 rounded-md font-mono text-xs transition-all ${
          isOpen
            ? "bg-zinc-800 text-white border-zinc-700 shadow-xs"
            : "bg-zinc-900/90 hover:bg-zinc-800 border-zinc-800 text-zinc-300 hover:text-white"
        } border px-2.5 py-1.5`}
        title="Switch UI Theme & Palettes"
      >
        <div className="flex items-center gap-1.5">
          <span
            className="w-2.5 h-2.5 rounded-full border border-black/40 shadow-xs shrink-0"
            style={{ backgroundColor: currentUITheme.colors.accent }}
          />
          {!compact && (
            <span className="font-medium truncate max-w-[110px] hidden sm:inline">
              {currentUITheme.name}
            </span>
          )}
        </div>
        <Palette className="w-3.5 h-3.5 text-zinc-400" />
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-zinc-950/98 backdrop-blur border border-zinc-800 shadow-2xl rounded-xl z-50 p-3.5 text-xs text-zinc-200 animate-in fade-in-0 zoom-in-95 duration-150">
          {/* Header & Tabs */}
          <div className="flex items-center justify-between pb-2.5 border-b border-zinc-850">
            <div className="flex items-center gap-1 bg-zinc-900 p-0.5 rounded-lg border border-zinc-800 font-mono text-[11px]">
              <button
                onClick={() => setActiveTab("ui")}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  activeTab === "ui"
                    ? "bg-white text-zinc-950 font-bold shadow-xs"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                UI Theme
              </button>
              <button
                onClick={() => setActiveTab("palette")}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  activeTab === "palette"
                    ? "bg-white text-zinc-950 font-bold shadow-xs"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                Document Palettes
              </button>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded text-zinc-500 hover:text-white hover:bg-zinc-850 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* TAB 1: UI THEME SELECTOR */}
          {activeTab === "ui" && (
            <div className="mt-3 space-y-2">
              <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 px-1">
                Workspace & Studio Interface Theme
              </div>
              <div className="space-y-1.5 max-h-[320px] overflow-y-auto pr-1">
                {allUIThemes.map((theme) => {
                  const isSelected = uiTheme === theme.id;
                  return (
                    <button
                      key={theme.id}
                      onClick={() => setUITheme(theme.id)}
                      className={`w-full text-left p-2.5 rounded-lg border transition-all flex items-center justify-between group ${
                        isSelected
                          ? "bg-zinc-900 border-zinc-600 shadow-xs"
                          : "bg-zinc-950/60 border-zinc-850 hover:bg-zinc-900/60 hover:border-zinc-750"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Theme preview dot with desk and accent */}
                        <div
                          className="w-7 h-7 rounded-md border flex items-center justify-center shrink-0 shadow-inner"
                          style={{
                            backgroundColor: theme.colors.bg,
                            borderColor: theme.colors.border,
                          }}
                        >
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: theme.colors.accent }}
                          />
                        </div>

                        <div className="min-w-0">
                          <div className="font-semibold text-zinc-100 flex items-center gap-1.5">
                            <span>{theme.name}</span>
                            {theme.isDark ? (
                              <Moon className="w-3 h-3 text-zinc-500" />
                            ) : (
                              <Sun className="w-3 h-3 text-amber-500" />
                            )}
                          </div>
                          <div className="text-[11px] text-zinc-400 truncate mt-0.5">
                            {theme.description}
                          </div>
                        </div>
                      </div>

                      {isSelected && <Check className="w-4 h-4 text-white shrink-0 ml-2" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: DOCUMENT PALETTES */}
          {activeTab === "palette" && (
            <div className="mt-3 space-y-2">
              <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-zinc-500 px-1">
                <span>Curated Document Design Palettes</span>
                <span>{allPalettes.length} Palettes</span>
              </div>

              <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
                {allPalettes.map((pal) => {
                  const isSelected = activePaletteId === pal.id;
                  return (
                    <div
                      key={pal.id}
                      onClick={() => {
                        setActivePaletteId(pal.id);
                        if (documentState && onApplyPaletteToDoc) {
                          const updated = applyPaletteToDocument(pal, documentState);
                          onApplyPaletteToDoc(updated);
                        }
                      }}
                      className={`p-2.5 rounded-lg border transition-all cursor-pointer ${
                        isSelected
                          ? "bg-zinc-900 border-zinc-600 shadow-xs"
                          : "bg-zinc-950/60 border-zinc-850 hover:bg-zinc-900/60 hover:border-zinc-750"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-semibold text-zinc-100 flex items-center gap-1.5">
                          {pal.name}
                        </span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                      </div>

                      {/* Swatches preview row */}
                      <div className="flex items-center gap-1.5 mt-1.5">
                        {pal.swatches.map((swatch, idx) => (
                          <div
                            key={idx}
                            title={`${swatch.label}: ${swatch.fill}`}
                            style={{
                              backgroundColor: swatch.fill,
                              borderColor: swatch.stroke,
                            }}
                            className="w-5 h-5 rounded border shadow-xs hover:scale-110 transition-transform"
                          />
                        ))}
                      </div>

                      <p className="text-[10px] text-zinc-400 mt-1.5 leading-snug">
                        {pal.description}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Apply Palette to Current Document Action Button */}
              {documentState && onApplyPaletteToDoc && (
                <div className="pt-2 border-t border-zinc-850 mt-2">
                  <button
                    onClick={handleApplyPaletteToCurrentDocument}
                    className="w-full py-2 px-3 rounded-lg bg-white hover:bg-zinc-200 text-zinc-950 font-mono text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-xs active:scale-[0.98]"
                  >
                    {appliedNotification ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Palette Applied to All Blocks!</span>
                      </>
                    ) : (
                      <>
                        <Wand2 className="w-3.5 h-3.5" />
                        <span>Apply &quot;{activePalette.name}&quot; to Document</span>
                      </>
                    )}
                  </button>
                  <span className="text-[10px] font-mono text-zinc-500 block text-center mt-1">
                    Harmonizes cards, strokes, borders & accents
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
