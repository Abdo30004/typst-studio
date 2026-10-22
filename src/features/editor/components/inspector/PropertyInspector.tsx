"use client";

import React from "react";
import {
  DocumentBlock,
  DocumentState,
  HeadingBlock,
  TextBlock,
  CardBlock,
  CalloutCardBlock,
  MetricCardBlock,
  ProfileCardBlock,
  ColumnsBlock,
  ImageBlock,
  TableBlock,
  CodeBlock,
  DividerBlock,
  GridLayoutBlock,
  QuoteBlock,
  KeyValueBlock,
  TimelineBlock,
  SignatureBlock,
  TagsBlock,
  MathBlock,
  ProgressBlock,
  KeyValueItem,
  TimelineStep,
  SignatureParty,
  TagItem,
} from "@/types/document";
import { findBlockById } from "@/lib/typst/block-utils";
import { useTheme } from "@/lib/theme";
import { getPalette, applyPaletteToDocument } from "@/lib/theme/palettes";
import {
  Sliders,
  FileText,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Upload,
  Loader2,
  Plus,
  Trash2,
  LayoutGrid,
} from "lucide-react";

interface Props {
  documentState: DocumentState;
  selectedBlockId: string | null;
  onUpdateDocumentSettings: (settings: Partial<DocumentState["settings"]>) => void;
  onUpdateBlock: (blockId: string, updated: Partial<DocumentBlock>) => void;
  onDeselect: () => void;
  onApplyPaletteToDoc?: (updatedDoc: DocumentState) => void;
}

export function PropertyInspector({
  documentState,
  selectedBlockId,
  onUpdateDocumentSettings,
  onUpdateBlock,
  onDeselect,
  onApplyPaletteToDoc,
}: Props) {
  const { activePalette, activePaletteId, setActivePaletteId, allPalettes } = useTheme();
  const inspectorImageFileRef = React.useRef<HTMLInputElement>(null);
  const [isInspectorUploading, setIsInspectorUploading] = React.useState(false);

  const selectedBlock = selectedBlockId
    ? findBlockById(documentState.blocks, selectedBlockId)
    : null;

  const handleInspectorImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedBlock) return;
    setIsInspectorUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      if (data.url) {
        onUpdateBlock(selectedBlock.id, {
          url: data.url,
          caption: (selectedBlock as ImageBlock).caption || data.name,
        });
      }
    } catch (err) {
      console.error("Inspector image upload error:", err);
    } finally {
      setIsInspectorUploading(false);
    }
  };

  return (
    <aside
      className="w-80 border-l flex flex-col h-full overflow-hidden select-none text-xs z-20 shrink-0 transition-colors duration-150"
      style={{
        backgroundColor: "var(--theme-panel)",
        borderColor: "var(--theme-border)",
        color: "var(--theme-text-primary)",
      }}
    >
      {/* Top Header */}
      <div
        className="p-3.5 border-b flex items-center justify-between shrink-0"
        style={{
          borderColor: "var(--theme-border)",
          backgroundColor: "var(--theme-surface)",
        }}
      >
        <div className="flex items-center gap-2">
          {selectedBlock ? (
            <>
              <Sliders className="w-4 h-4 text-zinc-300" />
              <span className="font-semibold text-zinc-100 capitalize">
                {selectedBlock.type.replace("card_", "")} Settings
              </span>
            </>
          ) : (
            <>
              <FileText className="w-4 h-4 text-zinc-300" />
              <span className="font-semibold text-zinc-100">Page & Typography</span>
            </>
          )}
        </div>

        {selectedBlock && (
          <button
            onClick={onDeselect}
            className="text-[11px] font-mono text-zinc-400 hover:text-white transition-colors"
          >
            Page Setup
          </button>
        )}
      </div>

      {/* Inspector Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {selectedBlock ? (
          <div className="space-y-4">
            {/* 1. HEADING BLOCK */}
            {selectedBlock.type === "heading" && (
              <div className="space-y-3.5">
                <div>
                  <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 block mb-1">
                    Heading Text
                  </label>
                  <input
                    type="text"
                    value={(selectedBlock as HeadingBlock).text}
                    onChange={(e) =>
                      onUpdateBlock(selectedBlock.id, { text: e.target.value })
                    }
                    placeholder="Enter heading..."
                    className="w-full bg-zinc-900 border border-zinc-800 focus:border-zinc-500 rounded-lg px-2.5 py-1.5 text-xs text-zinc-100 outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 block mb-1">
                    Subtitle / Eyebrow
                  </label>
                  <input
                    type="text"
                    value={(selectedBlock as HeadingBlock).subtitle || ""}
                    onChange={(e) =>
                      onUpdateBlock(selectedBlock.id, { subtitle: e.target.value })
                    }
                    placeholder="Optional subtitle..."
                    className="w-full bg-zinc-900 border border-zinc-800 focus:border-zinc-500 rounded-lg px-2.5 py-1.5 text-xs text-zinc-100 outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 block mb-1">
                    Heading Level
                  </label>
                  <div className="grid grid-cols-4 gap-1.5 font-mono">
                    {([1, 2, 3, 4] as const).map((lvl) => (
                      <button
                        key={lvl}
                        onClick={() => onUpdateBlock(selectedBlock.id, { level: lvl })}
                        className={`py-1 rounded-md text-xs font-bold border transition-colors ${
                          (selectedBlock as HeadingBlock).level === lvl
                            ? "bg-white border-white text-zinc-950 shadow-xs"
                            : "border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700"
                        }`}
                      >
                        H{lvl}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 block mb-1">
                    Text Alignment
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {(["left", "center", "right"] as const).map((align) => (
                      <button
                        key={align}
                        onClick={() => onUpdateBlock(selectedBlock.id, { align })}
                        className={`py-1.5 flex items-center justify-center rounded-md border capitalize transition-colors ${
                          (selectedBlock as HeadingBlock).align === align
                            ? "bg-white border-white text-zinc-950 shadow-xs"
                            : "border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700"
                        }`}
                      >
                        {align === "left" && <AlignLeft className="w-3.5 h-3.5" />}
                        {align === "center" && <AlignCenter className="w-3.5 h-3.5" />}
                        {align === "right" && <AlignRight className="w-3.5 h-3.5" />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 2. TEXT PARAGRAPH BLOCK */}
            {selectedBlock.type === "text" && (
              <div className="space-y-3.5">
                <div>
                  <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 block mb-1">
                    Content (Markdown & Math)
                  </label>
                  <textarea
                    rows={6}
                    value={(selectedBlock as TextBlock).content}
                    onChange={(e) =>
                      onUpdateBlock(selectedBlock.id, { content: e.target.value })
                    }
                    placeholder="Type markdown, bullet lists (- item), or math ($formula$)..."
                    className="w-full bg-zinc-900 border border-zinc-800 focus:border-zinc-500 rounded-lg p-2.5 text-xs text-zinc-100 outline-none leading-relaxed resize-y font-mono"
                  />
                  <span className="text-[10px] text-zinc-500 font-mono mt-1 block">
                    Tip: Use *bold*, _italic_, or $x^2$ for formulas.
                  </span>
                </div>

                <div>
                  <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 block mb-1">
                    Alignment
                  </label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {(["left", "center", "right", "justify"] as const).map((align) => (
                      <button
                        key={align}
                        onClick={() => onUpdateBlock(selectedBlock.id, { align })}
                        className={`py-1.5 flex items-center justify-center rounded-md border capitalize transition-colors ${
                          (selectedBlock as TextBlock).align === align
                            ? "bg-white border-white text-zinc-950 shadow-xs"
                            : "border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700"
                        }`}
                      >
                        {align === "left" && <AlignLeft className="w-3.5 h-3.5" />}
                        {align === "center" && <AlignCenter className="w-3.5 h-3.5" />}
                        {align === "right" && <AlignRight className="w-3.5 h-3.5" />}
                        {align === "justify" && <AlignJustify className="w-3.5 h-3.5" />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 3. CARD CONTAINER BLOCK */}
            {selectedBlock.type === "card" && (
              <div className="space-y-4">
                <div>
                  <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 block mb-1">
                    Card Title
                  </label>
                  <input
                    type="text"
                    value={(selectedBlock as CardBlock).title || ""}
                    onChange={(e) =>
                      onUpdateBlock(selectedBlock.id, { title: e.target.value })
                    }
                    placeholder="Card title..."
                    className="w-full bg-zinc-900 border border-zinc-800 focus:border-zinc-500 rounded-lg px-2.5 py-1.5 text-xs text-zinc-100 outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 block mb-1">
                    Card Description / Body
                  </label>
                  <textarea
                    rows={4}
                    value={(selectedBlock as CardBlock).content}
                    onChange={(e) =>
                      onUpdateBlock(selectedBlock.id, { content: e.target.value })
                    }
                    placeholder="Body text or bullet items..."
                    className="w-full bg-zinc-900 border border-zinc-800 focus:border-zinc-500 rounded-lg p-2.5 text-xs text-zinc-100 outline-none resize-y leading-relaxed"
                  />
                </div>

                {/* Quick Swatches & Palette Selector */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">
                      Palette Swatches
                    </label>
                    <select
                      value={activePaletteId}
                      onChange={(e) => setActivePaletteId(e.target.value as any)}
                      className="bg-zinc-900 border border-zinc-800 text-zinc-300 font-mono text-[10px] rounded px-1.5 py-0.5 outline-none max-w-[130px] truncate"
                    >
                      {allPalettes.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {activePalette.swatches.map((swatch) => (
                      <button
                        key={swatch.label}
                        onClick={() =>
                          onUpdateBlock(selectedBlock.id, {
                            fillColor: swatch.fill,
                            strokeColor: swatch.stroke,
                          })
                        }
                        title={`${swatch.label} (${swatch.fill})`}
                        style={{ backgroundColor: swatch.fill, borderColor: swatch.stroke }}
                        className="w-6 h-6 rounded-md border hover:scale-110 transition-transform shadow-xs"
                      />
                    ))}
                  </div>
                </div>

                {/* Custom Color Pickers */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block mb-1">
                      Fill Color
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={(selectedBlock as CardBlock).fillColor || "#ffffff"}
                        onChange={(e) =>
                          onUpdateBlock(selectedBlock.id, { fillColor: e.target.value })
                        }
                        className="w-8 h-8 rounded border border-zinc-700 bg-transparent cursor-pointer p-0"
                      />
                      <input
                        type="text"
                        value={(selectedBlock as CardBlock).fillColor || "#ffffff"}
                        onChange={(e) =>
                          onUpdateBlock(selectedBlock.id, { fillColor: e.target.value })
                        }
                        className="w-full bg-zinc-900 border border-zinc-800 rounded px-2 py-1 text-[11px] font-mono text-zinc-200"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block mb-1">
                      Border Color
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={(selectedBlock as CardBlock).strokeColor || "#e4e4e7"}
                        onChange={(e) =>
                          onUpdateBlock(selectedBlock.id, { strokeColor: e.target.value })
                        }
                        className="w-8 h-8 rounded border border-zinc-700 bg-transparent cursor-pointer p-0"
                      />
                      <input
                        type="text"
                        value={(selectedBlock as CardBlock).strokeColor || "#e4e4e7"}
                        onChange={(e) =>
                          onUpdateBlock(selectedBlock.id, { strokeColor: e.target.value })
                        }
                        className="w-full bg-zinc-900 border border-zinc-800 rounded px-2 py-1 text-[11px] font-mono text-zinc-200"
                      />
                    </div>
                  </div>
                </div>

                {/* Sliders for Radius and Padding */}
                <div className="space-y-3 pt-1">
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-zinc-400 mb-1">
                      <span className="font-mono text-[10px] uppercase tracking-wider">Corner Radius</span>
                      <span className="font-mono text-zinc-300">
                        {(selectedBlock as CardBlock).radius ?? 8}px
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="28"
                      value={(selectedBlock as CardBlock).radius ?? 8}
                      onChange={(e) =>
                        onUpdateBlock(selectedBlock.id, { radius: parseInt(e.target.value) })
                      }
                      className="w-full accent-white bg-zinc-800 h-1.5 rounded-lg cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-[11px] text-zinc-400 mb-1">
                      <span className="font-mono text-[10px] uppercase tracking-wider">Internal Padding</span>
                      <span className="font-mono text-zinc-300">
                        {(selectedBlock as CardBlock).padding ?? 14}px
                      </span>
                    </div>
                    <input
                      type="range"
                      min="4"
                      max="32"
                      value={(selectedBlock as CardBlock).padding ?? 14}
                      onChange={(e) =>
                        onUpdateBlock(selectedBlock.id, { padding: parseInt(e.target.value) })
                      }
                      className="w-full accent-white bg-zinc-800 h-1.5 rounded-lg cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 4. CALLOUT BANNER BLOCK */}
            {selectedBlock.type === "card_callout" && (
              <div className="space-y-3.5">
                <div>
                  <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 block mb-1">
                    Banner Variant
                  </label>
                  <div className="grid grid-cols-2 gap-1.5 font-mono text-xs">
                    {(["note", "tip", "warning", "caution"] as const).map((v) => (
                      <button
                        key={v}
                        onClick={() => onUpdateBlock(selectedBlock.id, { variant: v })}
                        className={`py-1.5 px-2 rounded-md font-medium uppercase tracking-wider border transition-all text-left flex items-center gap-1.5 ${
                          (selectedBlock as CalloutCardBlock).variant === v
                            ? "bg-white border-white text-zinc-950 shadow-xs"
                            : "border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white hover:border-zinc-700"
                        }`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${
                            v === "note"
                              ? "bg-zinc-400"
                              : v === "tip"
                              ? "bg-emerald-400"
                              : v === "warning"
                              ? "bg-amber-400"
                              : "bg-rose-400"
                          }`}
                        />
                        <span>{v}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 block mb-1">
                    Callout Title
                  </label>
                  <input
                    type="text"
                    value={(selectedBlock as CalloutCardBlock).title}
                    onChange={(e) =>
                      onUpdateBlock(selectedBlock.id, { title: e.target.value })
                    }
                    placeholder="Callout title..."
                    className="w-full bg-zinc-900 border border-zinc-800 focus:border-zinc-500 rounded-lg px-2.5 py-1.5 text-xs text-zinc-100 outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 block mb-1">
                    Message / Details
                  </label>
                  <textarea
                    rows={4}
                    value={(selectedBlock as CalloutCardBlock).message}
                    onChange={(e) =>
                      onUpdateBlock(selectedBlock.id, { message: e.target.value })
                    }
                    placeholder="Write detailed callout message..."
                    className="w-full bg-zinc-900 border border-zinc-800 focus:border-zinc-500 rounded-lg p-2.5 text-xs text-zinc-100 outline-none resize-y leading-relaxed"
                  />
                </div>
              </div>
            )}

            {/* 5. METRIC / KPI BLOCK */}
            {selectedBlock.type === "card_metric" && (
              <div className="space-y-3.5">
                <div>
                  <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 block mb-1">
                    Metric Label
                  </label>
                  <input
                    type="text"
                    value={(selectedBlock as MetricCardBlock).label}
                    onChange={(e) =>
                      onUpdateBlock(selectedBlock.id, { label: e.target.value })
                    }
                    placeholder="e.g. Total Revenue or Uptime"
                    className="w-full bg-zinc-900 border border-zinc-800 focus:border-zinc-500 rounded-lg px-2.5 py-1.5 text-xs text-zinc-100 outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 block mb-1">
                    Metric Value
                  </label>
                  <input
                    type="text"
                    value={(selectedBlock as MetricCardBlock).value}
                    onChange={(e) =>
                      onUpdateBlock(selectedBlock.id, { value: e.target.value })
                    }
                    placeholder="e.g. $1.2M or 99.99%"
                    className="w-full bg-zinc-900 border border-zinc-800 focus:border-zinc-500 rounded-lg px-2.5 py-1.5 text-xs text-zinc-100 outline-none font-mono font-bold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block mb-1">
                      Trend Text
                    </label>
                    <input
                      type="text"
                      value={(selectedBlock as MetricCardBlock).change || ""}
                      onChange={(e) =>
                        onUpdateBlock(selectedBlock.id, { change: e.target.value })
                      }
                      placeholder="+12% YoY"
                      className="w-full bg-zinc-900 border border-zinc-800 rounded px-2 py-1 text-xs text-zinc-200 font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block mb-1">
                      Direction
                    </label>
                    <select
                      value={(selectedBlock as MetricCardBlock).changeType || "neutral"}
                      onChange={(e) =>
                        onUpdateBlock(selectedBlock.id, { changeType: e.target.value as any })
                      }
                      className="w-full bg-zinc-900 border border-zinc-800 rounded px-2 py-1 text-xs text-zinc-200 font-mono outline-none"
                    >
                      <option value="positive">Positive (Emerald)</option>
                      <option value="negative">Negative (Rose)</option>
                      <option value="neutral">Neutral (Zinc)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* 6. PROFILE / AUTHOR BLOCK */}
            {selectedBlock.type === "card_profile" && (
              <div className="space-y-3.5">
                <div>
                  <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 block mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={(selectedBlock as ProfileCardBlock).name}
                    onChange={(e) =>
                      onUpdateBlock(selectedBlock.id, { name: e.target.value })
                    }
                    placeholder="Name..."
                    className="w-full bg-zinc-900 border border-zinc-800 focus:border-zinc-500 rounded-lg px-2.5 py-1.5 text-xs text-zinc-100 outline-none font-bold"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 block mb-1">
                    Role / Title
                  </label>
                  <input
                    type="text"
                    value={(selectedBlock as ProfileCardBlock).role}
                    onChange={(e) =>
                      onUpdateBlock(selectedBlock.id, { role: e.target.value })
                    }
                    placeholder="Role / Title..."
                    className="w-full bg-zinc-900 border border-zinc-800 focus:border-zinc-500 rounded-lg px-2.5 py-1.5 text-xs text-zinc-300 font-mono outline-none font-medium"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 block mb-1">
                    Bio / Summary
                  </label>
                  <textarea
                    rows={4}
                    value={(selectedBlock as ProfileCardBlock).bio}
                    onChange={(e) =>
                      onUpdateBlock(selectedBlock.id, { bio: e.target.value })
                    }
                    placeholder="Professional bio..."
                    className="w-full bg-zinc-900 border border-zinc-800 focus:border-zinc-500 rounded-lg p-2.5 text-xs text-zinc-100 outline-none resize-y leading-relaxed"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 block mb-1">
                    Contact / Links
                  </label>
                  <input
                    type="text"
                    value={(selectedBlock as ProfileCardBlock).contact || ""}
                    onChange={(e) =>
                      onUpdateBlock(selectedBlock.id, { contact: e.target.value })
                    }
                    placeholder="email@example.com • github.com/user"
                    className="w-full bg-zinc-900 border border-zinc-800 focus:border-zinc-500 rounded-lg px-2.5 py-1.5 text-xs text-zinc-300 outline-none font-mono"
                  />
                </div>
              </div>
            )}

            {/* 7. DATA TABLE BLOCK */}
            {selectedBlock.type === "table" && (
              <div className="space-y-3.5">
                <div>
                  <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 block mb-1">
                    Table Caption
                  </label>
                  <input
                    type="text"
                    value={(selectedBlock as TableBlock).caption || ""}
                    onChange={(e) =>
                      onUpdateBlock(selectedBlock.id, { caption: e.target.value })
                    }
                    placeholder="Table caption..."
                    className="w-full bg-zinc-900 border border-zinc-800 focus:border-zinc-500 rounded-lg px-2.5 py-1.5 text-xs text-zinc-100 outline-none"
                  />
                </div>

                <div className="flex items-center gap-2 font-mono text-xs">
                  <button
                    onClick={() => {
                      const tbl = selectedBlock as TableBlock;
                      const newHeaders = [...tbl.headers, `Col ${tbl.headers.length + 1}`];
                      const newRows = tbl.rows.map((r) => [...r, ""]);
                      onUpdateBlock(selectedBlock.id, { headers: newHeaders, rows: newRows });
                    }}
                    className="flex-1 py-1.5 bg-zinc-900 hover:bg-zinc-850 text-zinc-200 border border-zinc-800 rounded-lg font-medium transition-colors"
                  >
                    + Add Column
                  </button>
                  <button
                    onClick={() => {
                      const tbl = selectedBlock as TableBlock;
                      const newRows = [...tbl.rows, Array(tbl.headers.length).fill("")];
                      onUpdateBlock(selectedBlock.id, { rows: newRows });
                    }}
                    className="flex-1 py-1.5 bg-zinc-900 hover:bg-zinc-850 text-zinc-200 border border-zinc-800 rounded-lg font-medium transition-colors"
                  >
                    + Add Row
                  </button>
                </div>
              </div>
            )}

            {/* 8. CODE SNIPPET BLOCK */}
            {selectedBlock.type === "code" && (
              <div className="space-y-3.5">
                <div>
                  <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 block mb-1">
                    Filename / Title
                  </label>
                  <input
                    type="text"
                    value={(selectedBlock as CodeBlock).filename || ""}
                    onChange={(e) =>
                      onUpdateBlock(selectedBlock.id, { filename: e.target.value })
                    }
                    placeholder="e.g. main.rs or config.typ"
                    className="w-full bg-zinc-900 border border-zinc-800 focus:border-zinc-500 rounded-lg px-2.5 py-1.5 text-xs text-zinc-100 font-mono outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 block mb-1">
                    Syntax Language
                  </label>
                  <select
                    value={(selectedBlock as CodeBlock).language}
                    onChange={(e) =>
                      onUpdateBlock(selectedBlock.id, { language: e.target.value })
                    }
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-zinc-200 outline-none font-mono"
                  >
                    <option value="rust">Rust</option>
                    <option value="typescript">TypeScript</option>
                    <option value="typst">Typst</option>
                    <option value="python">Python</option>
                    <option value="bash">Bash</option>
                    <option value="json">JSON</option>
                    <option value="sql">SQL</option>
                    <option value="text">Plain Text</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 block mb-1">
                    Code Snippet
                  </label>
                  <textarea
                    rows={6}
                    value={(selectedBlock as CodeBlock).code}
                    onChange={(e) =>
                      onUpdateBlock(selectedBlock.id, { code: e.target.value })
                    }
                    className="w-full bg-zinc-900 border border-zinc-800 focus:border-zinc-500 rounded-lg p-2.5 text-xs text-zinc-100 font-mono outline-none resize-y leading-relaxed"
                  />
                </div>
              </div>
            )}

            {/* 9. IMAGE BLOCK */}
            {selectedBlock.type === "image" && (
              <div className="space-y-3.5">
                <div>
                  <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 block mb-1">
                    Image File
                  </label>
                  <button
                    type="button"
                    onClick={() => inspectorImageFileRef.current?.click()}
                    disabled={isInspectorUploading}
                    className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 hover:border-zinc-700 text-xs font-mono text-zinc-200 transition-colors"
                  >
                    {isInspectorUploading ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-zinc-400" />
                    ) : (
                      <Upload className="w-3.5 h-3.5 text-zinc-400" />
                    )}
                    <span>{isInspectorUploading ? "Uploading..." : "Upload from Computer"}</span>
                  </button>
                  <input
                    ref={inspectorImageFileRef}
                    type="file"
                    accept="image/*"
                    onChange={handleInspectorImageUpload}
                    className="hidden"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 block mb-1">
                    Image URL
                  </label>
                  <input
                    type="text"
                    value={(selectedBlock as ImageBlock).url}
                    onChange={(e) =>
                      onUpdateBlock(selectedBlock.id, { url: e.target.value })
                    }
                    placeholder="https://... or /uploads/..."
                    className="w-full bg-zinc-900 border border-zinc-800 focus:border-zinc-500 rounded-lg px-2.5 py-1.5 text-xs text-zinc-100 outline-none"
                  />
                </div>

                {/* Thumbnail Preview */}
                {(selectedBlock as ImageBlock).url && (
                  <div className="p-2 border border-zinc-800 rounded-lg bg-zinc-900/40 flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={(selectedBlock as ImageBlock).url}
                      alt="thumbnail"
                      className="w-12 h-12 object-contain rounded border border-zinc-800 bg-zinc-950 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-mono text-zinc-300 truncate">
                        {(selectedBlock as ImageBlock).url}
                      </p>
                      <span className="text-[9px] font-mono text-zinc-500">Live preview active</span>
                    </div>
                  </div>
                )}

                <div>
                  <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 block mb-1">
                    Caption
                  </label>
                  <input
                    type="text"
                    value={(selectedBlock as ImageBlock).caption || ""}
                    onChange={(e) =>
                      onUpdateBlock(selectedBlock.id, { caption: e.target.value })
                    }
                    placeholder="Figure caption..."
                    className="w-full bg-zinc-900 border border-zinc-800 focus:border-zinc-500 rounded-lg px-2.5 py-1.5 text-xs text-zinc-100 outline-none italic font-mono"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 block mb-1">
                    Image Width
                  </label>
                  <div className="grid grid-cols-3 gap-1.5 font-mono">
                    {["50%", "80%", "100%"].map((w) => (
                      <button
                        key={w}
                        onClick={() => onUpdateBlock(selectedBlock.id, { width: w })}
                        className={`py-1 rounded-md text-xs font-semibold border transition-colors ${
                          (selectedBlock as ImageBlock).width === w
                            ? "bg-white border-white text-zinc-950 shadow-xs"
                            : "border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white hover:border-zinc-700"
                        }`}
                      >
                        {w}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 10. COLUMNS BLOCK */}
            {selectedBlock.type === "columns" && (
              <div className="space-y-3.5">
                <div>
                  <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 block mb-1">
                    Column Count
                  </label>
                  <div className="grid grid-cols-2 gap-2 font-mono">
                    {[2, 3].map((count) => (
                      <button
                        key={count}
                        onClick={() => {
                          const cols = selectedBlock as ColumnsBlock;
                          if (cols.columnsCount !== count) {
                            onUpdateBlock(selectedBlock.id, {
                              columnsCount: count as 2 | 3,
                              columns: Array.from({ length: count }).map(
                                (_, idx) => cols.columns[idx] || { id: `col-${idx}`, blocks: [] }
                              ),
                            });
                          }
                        }}
                        className={`py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                          (selectedBlock as ColumnsBlock).columnsCount === count
                            ? "bg-white border-white text-zinc-950 shadow-xs"
                            : "border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white hover:border-zinc-700"
                        }`}
                      >
                        {count} Columns
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-[11px] text-zinc-400 mb-1">
                    <span className="font-mono text-[10px] uppercase tracking-wider">Gutter Spacing</span>
                    <span className="font-mono text-zinc-300">
                      {(selectedBlock as ColumnsBlock).gutter || 12}pt
                    </span>
                  </div>
                  <input
                    type="range"
                    min="6"
                    max="30"
                    value={(selectedBlock as ColumnsBlock).gutter || 12}
                    onChange={(e) =>
                      onUpdateBlock(selectedBlock.id, { gutter: parseInt(e.target.value) })
                    }
                    className="w-full accent-white bg-zinc-800 h-1.5 rounded-lg cursor-pointer"
                  />
                </div>
              </div>
            )}

            {/* 11. DIVIDER BLOCK */}
            {selectedBlock.type === "divider" && (
              <div className="space-y-3.5">
                <div>
                  <div className="flex items-center justify-between text-[11px] text-zinc-400 mb-1">
                    <span className="font-mono text-[10px] uppercase tracking-wider">Vertical Spacing</span>
                    <span className="font-mono text-zinc-300">
                      {(selectedBlock as DividerBlock).spacing || 12}pt
                    </span>
                  </div>
                  <input
                    type="range"
                    min="4"
                    max="40"
                    value={(selectedBlock as DividerBlock).spacing || 12}
                    onChange={(e) =>
                      onUpdateBlock(selectedBlock.id, { spacing: parseInt(e.target.value) })
                    }
                    className="w-full accent-white bg-zinc-800 h-1.5 rounded-lg cursor-pointer"
                  />
                </div>
              </div>
            )}

            {/* 12. UNIVERSAL MULTI-TRACK GRID LAYOUT */}
            {selectedBlock.type === "grid_layout" && (
              <div className="space-y-4">
                <div>
                  <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 block mb-1">
                    Track Layout Presets
                  </label>
                  <div className="grid grid-cols-2 gap-1.5 font-mono text-[10px]">
                    {[
                      { label: "1 : 1", tracks: ["1fr", "1fr"] },
                      { label: "2 : 1", tracks: ["2fr", "1fr"] },
                      { label: "1 : 2", tracks: ["1fr", "2fr"] },
                      { label: "1 : 2 : 1", tracks: ["1fr", "2fr", "1fr"] },
                      { label: "1 : 1 : 1", tracks: ["1fr", "1fr", "1fr"] },
                      { label: "30% : 70%", tracks: ["30%", "70%"] },
                    ].map((preset) => {
                      const grid = selectedBlock as GridLayoutBlock;
                      const isCurrent = (grid.tracks || []).join(",") === preset.tracks.join(",");
                      return (
                        <button
                          key={preset.label}
                          onClick={() => {
                            let updatedSlots = [...(grid.slots || [])];
                            while (updatedSlots.length < preset.tracks.length) {
                              updatedSlots.push({
                                id: `slot-${updatedSlots.length + 1}`,
                                widthFraction: preset.tracks[updatedSlots.length] || "1fr",
                                blocks: [],
                              });
                            }
                            updatedSlots = updatedSlots.slice(0, preset.tracks.length).map((s, idx) => ({
                              ...s,
                              widthFraction: preset.tracks[idx] || "1fr",
                            }));

                            onUpdateBlock(selectedBlock.id, {
                              tracks: preset.tracks,
                              slots: updatedSlots,
                            });
                          }}
                          className={`py-1.5 px-2 rounded border transition-colors ${
                            isCurrent
                              ? "bg-white border-white text-zinc-950 font-bold"
                              : "border-zinc-800 bg-zinc-900 text-zinc-300 hover:border-zinc-700"
                          }`}
                        >
                          {preset.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 block mb-1">
                    Custom Tracks (CSS fractions)
                  </label>
                  <input
                    type="text"
                    value={((selectedBlock as GridLayoutBlock).tracks || []).join(" ")}
                    onChange={(e) => {
                      const raw = e.target.value;
                      const parts = raw.split(/[\s,]+/).filter(Boolean);
                      if (parts.length > 0) {
                        const grid = selectedBlock as GridLayoutBlock;
                        let updatedSlots = [...(grid.slots || [])];
                        while (updatedSlots.length < parts.length) {
                          updatedSlots.push({
                            id: `slot-${updatedSlots.length + 1}`,
                            widthFraction: parts[updatedSlots.length] || "1fr",
                            blocks: [],
                          });
                        }
                        updatedSlots = updatedSlots.slice(0, parts.length).map((s, idx) => ({
                          ...s,
                          widthFraction: parts[idx] || "1fr",
                        }));
                        onUpdateBlock(selectedBlock.id, {
                          tracks: parts,
                          slots: updatedSlots,
                        });
                      }
                    }}
                    placeholder="1fr 2fr 1fr"
                    className="w-full bg-zinc-900 border border-zinc-800 focus:border-zinc-500 rounded-lg px-2.5 py-1.5 text-xs text-zinc-100 font-mono outline-none"
                  />
                  <span className="text-[10px] text-zinc-500 font-mono mt-1 block">
                    e.g. "1fr 2fr", "20% 80%", "1fr 1fr 1fr"
                  </span>
                </div>

                <div>
                  <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 block mb-1">
                    Vertical Alignment
                  </label>
                  <div className="grid grid-cols-3 gap-1.5 font-mono text-[10px]">
                    {(["top", "center", "bottom"] as const).map((va) => (
                      <button
                        key={va}
                        onClick={() => onUpdateBlock(selectedBlock.id, { verticalAlign: va })}
                        className={`py-1.5 rounded border capitalize transition-colors ${
                          (selectedBlock as GridLayoutBlock).verticalAlign === va
                            ? "bg-white border-white text-zinc-950 font-bold"
                            : "border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white"
                        }`}
                      >
                        {va}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-[11px] text-zinc-400 mb-1">
                    <span className="font-mono text-[10px] uppercase tracking-wider">Gutter Spacing</span>
                    <span className="font-mono text-zinc-300">
                      {(selectedBlock as GridLayoutBlock).gutter ?? 12}pt
                    </span>
                  </div>
                  <input
                    type="range"
                    min="4"
                    max="36"
                    value={(selectedBlock as GridLayoutBlock).gutter ?? 12}
                    onChange={(e) =>
                      onUpdateBlock(selectedBlock.id, { gutter: parseInt(e.target.value) })
                    }
                    className="w-full accent-white bg-zinc-800 h-1.5 rounded-lg cursor-pointer"
                  />
                </div>
              </div>
            )}

            {/* 13. PULL QUOTE BLOCK */}
            {selectedBlock.type === "quote" && (
              <div className="space-y-4">
                <div>
                  <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 block mb-1">
                    Quote Statement
                  </label>
                  <textarea
                    rows={3}
                    value={(selectedBlock as QuoteBlock).quote}
                    onChange={(e) => onUpdateBlock(selectedBlock.id, { quote: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 focus:border-zinc-500 rounded-lg p-2.5 text-xs text-zinc-100 outline-none resize-y leading-relaxed font-serif"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 block mb-1">
                    Author Attribution
                  </label>
                  <input
                    type="text"
                    value={(selectedBlock as QuoteBlock).author || ""}
                    onChange={(e) => onUpdateBlock(selectedBlock.id, { author: e.target.value })}
                    placeholder="Author name..."
                    className="w-full bg-zinc-900 border border-zinc-800 focus:border-zinc-500 rounded-lg px-2.5 py-1.5 text-xs text-zinc-100 outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 block mb-1">
                    Citation / Source
                  </label>
                  <input
                    type="text"
                    value={(selectedBlock as QuoteBlock).citation || ""}
                    onChange={(e) => onUpdateBlock(selectedBlock.id, { citation: e.target.value })}
                    placeholder="Book / Speech / Year..."
                    className="w-full bg-zinc-900 border border-zinc-800 focus:border-zinc-500 rounded-lg px-2.5 py-1.5 text-xs text-zinc-100 outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 block mb-1">
                    Border Accent Swatches
                  </label>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {activePalette.swatches.map((swatch) => (
                      <button
                        key={swatch.label}
                        onClick={() =>
                          onUpdateBlock(selectedBlock.id, {
                            borderColor: swatch.fill,
                          })
                        }
                        title={swatch.label}
                        style={{ backgroundColor: swatch.fill }}
                        className="w-5 h-5 rounded-full border border-white/20 hover:scale-110 transition-transform"
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 14. KEY-VALUE PROPERTY GRID */}
            {selectedBlock.type === "key_value" && (
              <div className="space-y-4">
                <div>
                  <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 block mb-1">
                    Section Title
                  </label>
                  <input
                    type="text"
                    value={(selectedBlock as KeyValueBlock).title || ""}
                    onChange={(e) => onUpdateBlock(selectedBlock.id, { title: e.target.value })}
                    placeholder="Metadata Title..."
                    className="w-full bg-zinc-900 border border-zinc-800 focus:border-zinc-500 rounded-lg px-2.5 py-1.5 text-xs text-zinc-100 outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 block mb-1">
                    Columns Count
                  </label>
                  <div className="grid grid-cols-3 gap-1.5 font-mono text-[10px]">
                    {([2, 3, 4] as const).map((cols) => (
                      <button
                        key={cols}
                        onClick={() => onUpdateBlock(selectedBlock.id, { columnsCount: cols })}
                        className={`py-1.5 rounded border transition-colors ${
                          ((selectedBlock as KeyValueBlock).columnsCount || 2) === cols
                            ? "bg-white border-white text-zinc-950 font-bold"
                            : "border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white"
                        }`}
                      >
                        {cols} Cols
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">
                      Properties ({(selectedBlock as KeyValueBlock).items.length})
                    </label>
                    <button
                      onClick={() => {
                        const kv = selectedBlock as KeyValueBlock;
                        const newItem: KeyValueItem = {
                          id: "kv-" + Math.random().toString(36).substring(2, 9),
                          key: "KEY",
                          value: "Value",
                        };
                        onUpdateBlock(selectedBlock.id, { items: [...kv.items, newItem] });
                      }}
                      className="text-[10px] text-zinc-300 hover:text-white flex items-center gap-1 font-mono"
                    >
                      <Plus className="w-3 h-3" /> Add
                    </button>
                  </div>
                  <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                    {(selectedBlock as KeyValueBlock).items.map((item, idx) => (
                      <div key={item.id || idx} className="flex items-center gap-1.5 bg-zinc-900/80 p-1.5 rounded border border-zinc-800">
                        <input
                          type="text"
                          value={item.key}
                          onChange={(e) => {
                            const kv = selectedBlock as KeyValueBlock;
                            const newItems = [...kv.items];
                            newItems[idx] = { ...newItems[idx], key: e.target.value };
                            onUpdateBlock(selectedBlock.id, { items: newItems });
                          }}
                          className="w-24 bg-zinc-950 border border-zinc-800 rounded px-1.5 py-0.5 text-[10px] font-mono text-zinc-300 uppercase outline-none"
                        />
                        <input
                          type="text"
                          value={item.value}
                          onChange={(e) => {
                            const kv = selectedBlock as KeyValueBlock;
                            const newItems = [...kv.items];
                            newItems[idx] = { ...newItems[idx], value: e.target.value };
                            onUpdateBlock(selectedBlock.id, { items: newItems });
                          }}
                          className="flex-1 bg-zinc-950 border border-zinc-800 rounded px-1.5 py-0.5 text-[10px] text-zinc-100 outline-none"
                        />
                        <button
                          onClick={() => {
                            const kv = selectedBlock as KeyValueBlock;
                            if (kv.items.length <= 1) return;
                            const newItems = kv.items.filter((_, i) => i !== idx);
                            onUpdateBlock(selectedBlock.id, { items: newItems });
                          }}
                          className="p-1 text-zinc-500 hover:text-red-400"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 15. PROCESS TIMELINE */}
            {selectedBlock.type === "timeline" && (
              <div className="space-y-4">
                <div>
                  <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 block mb-1">
                    Timeline Title
                  </label>
                  <input
                    type="text"
                    value={(selectedBlock as TimelineBlock).title || ""}
                    onChange={(e) => onUpdateBlock(selectedBlock.id, { title: e.target.value })}
                    placeholder="Milestone Title..."
                    className="w-full bg-zinc-900 border border-zinc-800 focus:border-zinc-500 rounded-lg px-2.5 py-1.5 text-xs text-zinc-100 outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 block mb-1">
                    Orientation
                  </label>
                  <div className="grid grid-cols-2 gap-1.5 font-mono text-[10px]">
                    {(["vertical", "horizontal"] as const).map((ori) => (
                      <button
                        key={ori}
                        onClick={() => onUpdateBlock(selectedBlock.id, { orientation: ori })}
                        className={`py-1.5 rounded border capitalize transition-colors ${
                          ((selectedBlock as TimelineBlock).orientation || "vertical") === ori
                            ? "bg-white border-white text-zinc-950 font-bold"
                            : "border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white"
                        }`}
                      >
                        {ori}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">
                      Steps ({(selectedBlock as TimelineBlock).steps.length})
                    </label>
                    <button
                      onClick={() => {
                        const tl = selectedBlock as TimelineBlock;
                        const newStep: TimelineStep = {
                          id: "tl-" + Math.random().toString(36).substring(2, 9),
                          stepNumber: String(tl.steps.length + 1).padStart(2, "0"),
                          title: "New Stage",
                          date: "Stage " + (tl.steps.length + 1),
                          description: "Stage description...",
                        };
                        onUpdateBlock(selectedBlock.id, { steps: [...tl.steps, newStep] });
                      }}
                      className="text-[10px] text-zinc-300 hover:text-white flex items-center gap-1 font-mono"
                    >
                      <Plus className="w-3 h-3" /> Add Step
                    </button>
                  </div>
                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                    {(selectedBlock as TimelineBlock).steps.map((step, idx) => (
                      <div key={step.id || idx} className="bg-zinc-900/80 p-2 rounded border border-zinc-800 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <input
                            type="text"
                            value={step.stepNumber}
                            onChange={(e) => {
                              const tl = selectedBlock as TimelineBlock;
                              const newSteps = [...tl.steps];
                              newSteps[idx] = { ...newSteps[idx], stepNumber: e.target.value };
                              onUpdateBlock(selectedBlock.id, { steps: newSteps });
                            }}
                            className="w-12 bg-zinc-950 border border-zinc-800 rounded px-1.5 py-0.5 text-[10px] font-mono text-zinc-200 outline-none"
                          />
                          <button
                            onClick={() => {
                              const tl = selectedBlock as TimelineBlock;
                              if (tl.steps.length <= 1) return;
                              const newSteps = tl.steps.filter((_, i) => i !== idx);
                              onUpdateBlock(selectedBlock.id, { steps: newSteps });
                            }}
                            className="text-zinc-500 hover:text-red-400"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                        <input
                          type="text"
                          value={step.title}
                          onChange={(e) => {
                            const tl = selectedBlock as TimelineBlock;
                            const newSteps = [...tl.steps];
                            newSteps[idx] = { ...newSteps[idx], title: e.target.value };
                            onUpdateBlock(selectedBlock.id, { steps: newSteps });
                          }}
                          placeholder="Step title..."
                          className="w-full bg-zinc-950 border border-zinc-800 rounded px-1.5 py-0.5 text-xs text-zinc-100 outline-none"
                        />
                        <input
                          type="text"
                          value={step.date || ""}
                          onChange={(e) => {
                            const tl = selectedBlock as TimelineBlock;
                            const newSteps = [...tl.steps];
                            newSteps[idx] = { ...newSteps[idx], date: e.target.value };
                            onUpdateBlock(selectedBlock.id, { steps: newSteps });
                          }}
                          placeholder="Date / Stage..."
                          className="w-full bg-zinc-950 border border-zinc-800 rounded px-1.5 py-0.5 text-[10px] text-zinc-400 outline-none"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 16. SIGNATURE & SEAL BLOCK */}
            {selectedBlock.type === "signature" && (
              <div className="space-y-4">
                <div>
                  <label className="flex items-center justify-between text-xs text-zinc-300 cursor-pointer">
                    <span>Include Official Seal / Stamp Box</span>
                    <input
                      type="checkbox"
                      checked={(selectedBlock as SignatureBlock).hasSealBox || false}
                      onChange={(e) => onUpdateBlock(selectedBlock.id, { hasSealBox: e.target.checked })}
                      className="accent-white h-4 w-4 rounded"
                    />
                  </label>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">
                      Signatories ({(selectedBlock as SignatureBlock).parties.length})
                    </label>
                    <button
                      onClick={() => {
                        const sig = selectedBlock as SignatureBlock;
                        const newParty: SignatureParty = {
                          id: "sig-" + Math.random().toString(36).substring(2, 9),
                          name: "Signer Name",
                          title: "Authorized Officer",
                          role: "Party",
                          date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }),
                        };
                        onUpdateBlock(selectedBlock.id, { parties: [...sig.parties, newParty] });
                      }}
                      className="text-[10px] text-zinc-300 hover:text-white flex items-center gap-1 font-mono"
                    >
                      <Plus className="w-3 h-3" /> Add Signer
                    </button>
                  </div>
                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                    {(selectedBlock as SignatureBlock).parties.map((p, idx) => (
                      <div key={p.id || idx} className="bg-zinc-900/80 p-2 rounded border border-zinc-800 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <input
                            type="text"
                            value={p.name}
                            onChange={(e) => {
                              const sig = selectedBlock as SignatureBlock;
                              const newParties = [...sig.parties];
                              newParties[idx] = { ...newParties[idx], name: e.target.value };
                              onUpdateBlock(selectedBlock.id, { parties: newParties });
                            }}
                            placeholder="Full name..."
                            className="flex-1 bg-zinc-950 border border-zinc-800 rounded px-1.5 py-0.5 text-xs text-zinc-100 font-bold outline-none mr-1.5"
                          />
                          <button
                            onClick={() => {
                              const sig = selectedBlock as SignatureBlock;
                              if (sig.parties.length <= 1) return;
                              const newParties = sig.parties.filter((_, i) => i !== idx);
                              onUpdateBlock(selectedBlock.id, { parties: newParties });
                            }}
                            className="text-zinc-500 hover:text-red-400"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                        <input
                          type="text"
                          value={p.title}
                          onChange={(e) => {
                            const sig = selectedBlock as SignatureBlock;
                            const newParties = [...sig.parties];
                            newParties[idx] = { ...newParties[idx], title: e.target.value };
                            onUpdateBlock(selectedBlock.id, { parties: newParties });
                          }}
                          placeholder="Job Title..."
                          className="w-full bg-zinc-950 border border-zinc-800 rounded px-1.5 py-0.5 text-[11px] text-zinc-300 outline-none"
                        />
                        <div className="grid grid-cols-2 gap-1.5">
                          <input
                            type="text"
                            value={p.role}
                            onChange={(e) => {
                              const sig = selectedBlock as SignatureBlock;
                              const newParties = [...sig.parties];
                              newParties[idx] = { ...newParties[idx], role: e.target.value };
                              onUpdateBlock(selectedBlock.id, { parties: newParties });
                            }}
                            placeholder="Role..."
                            className="bg-zinc-950 border border-zinc-800 rounded px-1.5 py-0.5 text-[10px] font-mono text-zinc-400 outline-none"
                          />
                          <input
                            type="text"
                            value={p.date || ""}
                            onChange={(e) => {
                              const sig = selectedBlock as SignatureBlock;
                              const newParties = [...sig.parties];
                              newParties[idx] = { ...newParties[idx], date: e.target.value };
                              onUpdateBlock(selectedBlock.id, { parties: newParties });
                            }}
                            placeholder="Date..."
                            className="bg-zinc-950 border border-zinc-800 rounded px-1.5 py-0.5 text-[10px] font-mono text-zinc-400 outline-none"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 17. PILL TAGS BLOCK */}
            {selectedBlock.type === "tags" && (
              <div className="space-y-4">
                <div>
                  <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 block mb-1">
                    Category Prefix
                  </label>
                  <input
                    type="text"
                    value={(selectedBlock as TagsBlock).category || ""}
                    onChange={(e) => onUpdateBlock(selectedBlock.id, { category: e.target.value })}
                    placeholder="Category / Taxonomy..."
                    className="w-full bg-zinc-900 border border-zinc-800 focus:border-zinc-500 rounded-lg px-2.5 py-1.5 text-xs text-zinc-100 outline-none"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">
                      Tags ({(selectedBlock as TagsBlock).tags.length})
                    </label>
                    <button
                      onClick={() => {
                        const tb = selectedBlock as TagsBlock;
                        const newTag: TagItem = {
                          id: "t-" + Math.random().toString(36).substring(2, 9),
                          label: "New Tag",
                        };
                        onUpdateBlock(selectedBlock.id, { tags: [...tb.tags, newTag] });
                      }}
                      className="text-[10px] text-zinc-300 hover:text-white flex items-center gap-1 font-mono"
                    >
                      <Plus className="w-3 h-3" /> Add Tag
                    </button>
                  </div>
                  <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                    {(selectedBlock as TagsBlock).tags.map((tag, idx) => (
                      <div key={tag.id || idx} className="flex items-center gap-1.5 bg-zinc-900/80 p-1.5 rounded border border-zinc-800">
                        <input
                          type="text"
                          value={tag.label}
                          onChange={(e) => {
                            const tb = selectedBlock as TagsBlock;
                            const newTags = [...tb.tags];
                            newTags[idx] = { ...newTags[idx], label: e.target.value };
                            onUpdateBlock(selectedBlock.id, { tags: newTags });
                          }}
                          className="flex-1 bg-zinc-950 border border-zinc-800 rounded px-1.5 py-0.5 text-xs text-zinc-200 outline-none"
                        />
                        <button
                          onClick={() => {
                            const tb = selectedBlock as TagsBlock;
                            if (tb.tags.length <= 1) return;
                            const newTags = tb.tags.filter((_, i) => i !== idx);
                            onUpdateBlock(selectedBlock.id, { tags: newTags });
                          }}
                          className="text-zinc-500 hover:text-red-400"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 18. NUMBERED DISPLAY MATH BLOCK */}
            {selectedBlock.type === "math" && (
              <div className="space-y-4">
                <div>
                  <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 block mb-1">
                    Math Formula (LaTeX / Typst)
                  </label>
                  <textarea
                    rows={3}
                    value={(selectedBlock as MathBlock).formula}
                    onChange={(e) => onUpdateBlock(selectedBlock.id, { formula: e.target.value })}
                    placeholder="sum_(i=1)^n i = (n(n+1))/2"
                    className="w-full bg-zinc-900 border border-zinc-800 focus:border-zinc-500 rounded-lg p-2.5 text-xs text-zinc-100 font-mono outline-none resize-y leading-relaxed"
                  />
                  <span className="text-[10px] text-zinc-500 font-mono mt-1 block">
                    e.g. "E = m c^2", "integral_0^1 x^2 dif x = 1/3"
                  </span>
                </div>

                <div>
                  <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 block mb-1">
                    Equation Numbering
                  </label>
                  <input
                    type="text"
                    value={(selectedBlock as MathBlock).equationNumber || ""}
                    onChange={(e) => onUpdateBlock(selectedBlock.id, { equationNumber: e.target.value })}
                    placeholder="1, (2a), Eq. 3..."
                    className="w-full bg-zinc-900 border border-zinc-800 focus:border-zinc-500 rounded-lg px-2.5 py-1.5 text-xs text-zinc-100 font-mono outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 block mb-1">
                    Equation Caption (optional)
                  </label>
                  <input
                    type="text"
                    value={(selectedBlock as MathBlock).caption || ""}
                    onChange={(e) => onUpdateBlock(selectedBlock.id, { caption: e.target.value })}
                    placeholder="Description of the mathematical relation..."
                    className="w-full bg-zinc-900 border border-zinc-800 focus:border-zinc-500 rounded-lg px-2.5 py-1.5 text-xs text-zinc-100 outline-none"
                  />
                </div>
              </div>
            )}

            {/* 19. MILESTONE PROGRESS BLOCK */}
            {selectedBlock.type === "progress" && (
              <div className="space-y-4">
                <div>
                  <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 block mb-1">
                    Milestone Label
                  </label>
                  <input
                    type="text"
                    value={(selectedBlock as ProgressBlock).label}
                    onChange={(e) => onUpdateBlock(selectedBlock.id, { label: e.target.value })}
                    placeholder="Target / Milestone..."
                    className="w-full bg-zinc-900 border border-zinc-800 focus:border-zinc-500 rounded-lg px-2.5 py-1.5 text-xs text-zinc-100 outline-none"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between text-[11px] text-zinc-400 mb-1">
                    <span className="font-mono text-[10px] uppercase tracking-wider">Completion Percentage</span>
                    <span className="font-mono text-zinc-300 font-bold">
                      {(selectedBlock as ProgressBlock).percentage}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={(selectedBlock as ProgressBlock).percentage}
                    onChange={(e) =>
                      onUpdateBlock(selectedBlock.id, { percentage: parseInt(e.target.value) })
                    }
                    className="w-full accent-white bg-zinc-800 h-1.5 rounded-lg cursor-pointer"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 block mb-1">
                    Target Label (optional)
                  </label>
                  <input
                    type="text"
                    value={(selectedBlock as ProgressBlock).target || ""}
                    onChange={(e) => onUpdateBlock(selectedBlock.id, { target: e.target.value })}
                    placeholder="e.g. 1,000 Users, $50k..."
                    className="w-full bg-zinc-900 border border-zinc-800 focus:border-zinc-500 rounded-lg px-2.5 py-1.5 text-xs text-zinc-100 outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 block mb-1">
                    Bar Accent Color
                  </label>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {activePalette.swatches.map((swatch) => (
                      <button
                        key={swatch.label}
                        onClick={() =>
                          onUpdateBlock(selectedBlock.id, {
                            color: swatch.fill,
                          })
                        }
                        title={swatch.label}
                        style={{ backgroundColor: swatch.fill }}
                        className="w-5 h-5 rounded-full border border-white/20 hover:scale-110 transition-transform"
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* DOCUMENT PAGE SETUP (when no block is selected) */
          <div className="space-y-4">
            <div>
              <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 block mb-1">
                Paper Format
              </label>
              <select
                value={documentState.settings.paper}
                onChange={(e) => onUpdateDocumentSettings({ paper: e.target.value })}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-zinc-200 outline-none font-mono"
              >
                <option value="a4">A4 (210 × 297 mm)</option>
                <option value="us-letter">US Letter (8.5 × 11 in)</option>
                <option value="presentation-16-9">Presentation Slide (16:9)</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 block mb-1">
                Orientation
              </label>
              <div className="grid grid-cols-2 gap-2 font-mono">
                <button
                  onClick={() => onUpdateDocumentSettings({ orientation: "portrait" })}
                  className={`py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                    documentState.settings.orientation === "portrait"
                      ? "bg-white border-white text-zinc-950 shadow-xs"
                      : "border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white hover:border-zinc-700"
                  }`}
                >
                  Portrait
                </button>
                <button
                  onClick={() => onUpdateDocumentSettings({ orientation: "landscape" })}
                  className={`py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                    documentState.settings.orientation === "landscape"
                      ? "bg-white border-white text-zinc-950 shadow-xs"
                      : "border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white hover:border-zinc-700"
                  }`}
                >
                  Landscape
                </button>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 block mb-1">
                Typography Font
              </label>
              <select
                value={documentState.settings.font}
                onChange={(e) => onUpdateDocumentSettings({ font: e.target.value })}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-zinc-200 outline-none font-mono"
              >
                <option value="Liberation Sans">Liberation Sans (Clean Sans-Serif)</option>
                <option value="Liberation Serif">Liberation Serif (Editorial Classic)</option>
                <option value="Liberation Mono">Liberation Mono (Technical Code)</option>
              </select>
            </div>

            {/* Document Design Palette */}
            <div>
              <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 block mb-1">
                Document Design Palette
              </label>
              <select
                value={documentState.settings.paletteId || activePaletteId}
                onChange={(e) => {
                  const pal = getPalette(e.target.value);
                  setActivePaletteId(pal.id);
                  if (onApplyPaletteToDoc) {
                    const updated = applyPaletteToDocument(pal, documentState);
                    onApplyPaletteToDoc(updated);
                  }
                }}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-zinc-200 outline-none font-mono"
              >
                {allPalettes.map((pal) => (
                  <option key={pal.id} value={pal.id}>
                    {pal.name}
                  </option>
                ))}
              </select>
              <span className="text-[10px] text-zinc-500 font-mono mt-1 block">
                Harmonizes cards, callouts, metrics, tables & accents
              </span>
            </div>

            {/* Document Accent Color */}
            <div>
              <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 block mb-1">
                Document Accent Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={documentState.settings.accentColor || "#0f172a"}
                  onChange={(e) => onUpdateDocumentSettings({ accentColor: e.target.value })}
                  className="w-8 h-8 rounded border border-zinc-700 bg-zinc-900 cursor-pointer p-0.5"
                />
                <input
                  type="text"
                  value={documentState.settings.accentColor || "#0f172a"}
                  onChange={(e) => onUpdateDocumentSettings({ accentColor: e.target.value })}
                  placeholder="#0f172a"
                  className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-zinc-200 font-mono outline-none uppercase"
                />
              </div>
              <span className="text-[10px] text-zinc-500 font-mono mt-1 block">
                Styles H1 underlines, KPI metrics, callouts & divider lines
              </span>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 block">
                Page Margins
              </label>
              <div className="grid grid-cols-2 gap-2 font-mono">
                <div>
                  <span className="text-[10px] text-zinc-500">Top</span>
                  <input
                    type="text"
                    value={documentState.settings.margins.top}
                    onChange={(e) =>
                      onUpdateDocumentSettings({
                        margins: { ...documentState.settings.margins, top: e.target.value },
                      })
                    }
                    className="w-full bg-zinc-900 border border-zinc-800 rounded px-2 py-1 text-zinc-200 text-xs"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-zinc-500">Bottom</span>
                  <input
                    type="text"
                    value={documentState.settings.margins.bottom}
                    onChange={(e) =>
                      onUpdateDocumentSettings({
                        margins: { ...documentState.settings.margins, bottom: e.target.value },
                      })
                    }
                    className="w-full bg-zinc-900 border border-zinc-800 rounded px-2 py-1 text-zinc-200 text-xs"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-zinc-500">Left</span>
                  <input
                    type="text"
                    value={documentState.settings.margins.left}
                    onChange={(e) =>
                      onUpdateDocumentSettings({
                        margins: { ...documentState.settings.margins, left: e.target.value },
                      })
                    }
                    className="w-full bg-zinc-900 border border-zinc-800 rounded px-2 py-1 text-zinc-200 text-xs"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-zinc-500">Right</span>
                  <input
                    type="text"
                    value={documentState.settings.margins.right}
                    onChange={(e) =>
                      onUpdateDocumentSettings({
                        margins: { ...documentState.settings.margins, right: e.target.value },
                      })
                    }
                    className="w-full bg-zinc-900 border border-zinc-800 rounded px-2 py-1 text-zinc-200 text-xs"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-zinc-850">
              <span className="text-xs text-zinc-300 font-mono">Show Page Numbers</span>
              <input
                type="checkbox"
                checked={documentState.settings.showPageNumbers}
                onChange={(e) =>
                  onUpdateDocumentSettings({ showPageNumbers: e.target.checked })
                }
                className="w-4 h-4 rounded border-zinc-700 bg-zinc-900 text-white focus:ring-0 accent-white cursor-pointer"
              />
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}