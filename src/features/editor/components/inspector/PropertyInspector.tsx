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
} from "@/types/document";
import { findBlockById } from "@/lib/typst/block-utils";
import {
  Sliders,
  FileText,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
} from "lucide-react";

interface Props {
  documentState: DocumentState;
  selectedBlockId: string | null;
  onUpdateDocumentSettings: (settings: Partial<DocumentState["settings"]>) => void;
  onUpdateBlock: (blockId: string, updated: Partial<DocumentBlock>) => void;
  onDeselect: () => void;
}

export function PropertyInspector({
  documentState,
  selectedBlockId,
  onUpdateDocumentSettings,
  onUpdateBlock,
  onDeselect,
}: Props) {
  const selectedBlock = selectedBlockId
    ? findBlockById(documentState.blocks, selectedBlockId)
    : null;

  const quickColorSwatches = [
    { label: "Obsidian", fill: "#09090b", stroke: "#27272a" },
    { label: "Zinc Dark", fill: "#18181b", stroke: "#3f3f46" },
    { label: "Steel", fill: "#27272a", stroke: "#52525b" },
    { label: "Muted Plate", fill: "#f4f4f5", stroke: "#e4e4e7" },
    { label: "Paper Pure", fill: "#ffffff", stroke: "#d4d4d8" },
    { label: "Warm Editorial", fill: "#fafafa", stroke: "#e5e5e5" },
  ];

  return (
    <aside className="w-80 border-l border-zinc-850 bg-zinc-950/95 backdrop-blur flex flex-col h-full overflow-hidden select-none text-xs z-20 shrink-0">
      {/* Top Header */}
      <div className="p-3.5 border-b border-zinc-850 flex items-center justify-between shrink-0 bg-zinc-900/40">
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

                {/* Quick Swatches */}
                <div>
                  <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 block mb-1.5">
                    Color Presets
                  </label>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {quickColorSwatches.map((swatch) => (
                      <button
                        key={swatch.label}
                        onClick={() =>
                          onUpdateBlock(selectedBlock.id, {
                            fillColor: swatch.fill,
                            strokeColor: swatch.stroke,
                          })
                        }
                        title={swatch.label}
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