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
  Palette,
  Layers,
  Heading,
  Type,
  TrendingUp,
  AlertCircle,
  Columns,
  Table as TableIcon,
  Code2,
  Image as ImageIcon,
  Minus,
  User,
  Plus,
  Trash2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Upload,
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
    { label: "Dark Slate", fill: "#1e293b", stroke: "#334155" },
    { label: "Midnight", fill: "#0f172a", stroke: "#1e293b" },
    { label: "Indigo Mist", fill: "#1e1b4b", stroke: "#3730a3" },
    { label: "Emerald Deep", fill: "#064e3b", stroke: "#047857" },
    { label: "Wine Berry", fill: "#4c0519", stroke: "#9f1239" },
    { label: "Pure Clean", fill: "#ffffff", stroke: "#cbd5e1" },
    { label: "Light Sky", fill: "#f0f9ff", stroke: "#bae6fd" },
  ];

  return (
    <aside className="w-80 border-l border-slate-800/90 bg-slate-950/95 backdrop-blur flex flex-col h-full overflow-hidden select-none text-xs z-20 shrink-0">
      {/* Top Header */}
      <div className="p-3.5 border-b border-slate-800 flex items-center justify-between shrink-0 bg-slate-900/40">
        <div className="flex items-center gap-2">
          {selectedBlock ? (
            <>
              <Sliders className="w-4 h-4 text-blue-400" />
              <span className="font-bold text-slate-100 capitalize">
                {selectedBlock.type.replace("card_", "")} Settings
              </span>
            </>
          ) : (
            <>
              <FileText className="w-4 h-4 text-blue-400" />
              <span className="font-bold text-slate-100">Page & Typography</span>
            </>
          )}
        </div>

        {selectedBlock && (
          <button
            onClick={onDeselect}
            className="text-[11px] text-blue-400 hover:text-blue-300 font-medium transition-colors"
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
                  <label className="text-slate-400 block mb-1 font-medium">Heading Text</label>
                  <input
                    type="text"
                    value={(selectedBlock as HeadingBlock).text}
                    onChange={(e) =>
                      onUpdateBlock(selectedBlock.id, { text: e.target.value })
                    }
                    placeholder="Enter heading..."
                    className="w-full bg-slate-900 border border-slate-800 focus:border-blue-500 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 outline-none"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1 font-medium">Subtitle / Eyebrow</label>
                  <input
                    type="text"
                    value={(selectedBlock as HeadingBlock).subtitle || ""}
                    onChange={(e) =>
                      onUpdateBlock(selectedBlock.id, { subtitle: e.target.value })
                    }
                    placeholder="Optional subtitle..."
                    className="w-full bg-slate-900 border border-slate-800 focus:border-blue-500 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 outline-none"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1 font-medium">Heading Level</label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {([1, 2, 3, 4] as const).map((lvl) => (
                      <button
                        key={lvl}
                        onClick={() => onUpdateBlock(selectedBlock.id, { level: lvl })}
                        className={`py-1 rounded-md text-xs font-bold border transition-colors ${
                          (selectedBlock as HeadingBlock).level === lvl
                            ? "bg-blue-600 border-blue-500 text-white"
                            : "border-slate-800 bg-slate-900 text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        H{lvl}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1 font-medium">Text Alignment</label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {(["left", "center", "right"] as const).map((align) => (
                      <button
                        key={align}
                        onClick={() => onUpdateBlock(selectedBlock.id, { align })}
                        className={`py-1.5 flex items-center justify-center rounded-md border capitalize ${
                          (selectedBlock as HeadingBlock).align === align
                            ? "bg-blue-600 border-blue-500 text-white"
                            : "border-slate-800 bg-slate-900 text-slate-400 hover:text-slate-200"
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
                  <label className="text-slate-400 block mb-1 font-medium">
                    Content (Markdown & Math)
                  </label>
                  <textarea
                    rows={6}
                    value={(selectedBlock as TextBlock).content}
                    onChange={(e) =>
                      onUpdateBlock(selectedBlock.id, { content: e.target.value })
                    }
                    placeholder="Type markdown, bullet lists (- item), or math ($formula$)..."
                    className="w-full bg-slate-900 border border-slate-800 focus:border-blue-500 rounded-lg p-2.5 text-xs text-slate-100 outline-none leading-relaxed resize-y font-mono"
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    Tip: Use *bold*, _italic_, or $x^2$ for formulas.
                  </span>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1 font-medium">Alignment</label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {(["left", "center", "right", "justify"] as const).map((align) => (
                      <button
                        key={align}
                        onClick={() => onUpdateBlock(selectedBlock.id, { align })}
                        className={`py-1.5 flex items-center justify-center rounded-md border capitalize ${
                          (selectedBlock as TextBlock).align === align
                            ? "bg-blue-600 border-blue-500 text-white"
                            : "border-slate-800 bg-slate-900 text-slate-400 hover:text-slate-200"
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
                  <label className="text-slate-400 block mb-1 font-medium">Card Title</label>
                  <input
                    type="text"
                    value={(selectedBlock as CardBlock).title || ""}
                    onChange={(e) =>
                      onUpdateBlock(selectedBlock.id, { title: e.target.value })
                    }
                    placeholder="Card title..."
                    className="w-full bg-slate-900 border border-slate-800 focus:border-blue-500 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 outline-none"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1 font-medium">Card Description / Body</label>
                  <textarea
                    rows={4}
                    value={(selectedBlock as CardBlock).content}
                    onChange={(e) =>
                      onUpdateBlock(selectedBlock.id, { content: e.target.value })
                    }
                    placeholder="Body text or bullet items..."
                    className="w-full bg-slate-900 border border-slate-800 focus:border-blue-500 rounded-lg p-2.5 text-xs text-slate-100 outline-none resize-y"
                  />
                </div>

                {/* Quick Swatches */}
                <div>
                  <label className="text-slate-400 block mb-1.5 font-medium">Color Presets</label>
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
                        className="w-6 h-6 rounded-lg border-2 hover:scale-110 transition-transform shadow-xs"
                      />
                    ))}
                  </div>
                </div>

                {/* Custom Color Pickers */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Fill Color</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={(selectedBlock as CardBlock).fillColor || "#1e293b"}
                        onChange={(e) =>
                          onUpdateBlock(selectedBlock.id, { fillColor: e.target.value })
                        }
                        className="w-8 h-8 rounded border border-slate-700 bg-transparent cursor-pointer p-0"
                      />
                      <input
                        type="text"
                        value={(selectedBlock as CardBlock).fillColor || "#1e293b"}
                        onChange={(e) =>
                          onUpdateBlock(selectedBlock.id, { fillColor: e.target.value })
                        }
                        className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-[11px] font-mono text-slate-200"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Border Color</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={(selectedBlock as CardBlock).strokeColor || "#334155"}
                        onChange={(e) =>
                          onUpdateBlock(selectedBlock.id, { strokeColor: e.target.value })
                        }
                        className="w-8 h-8 rounded border border-slate-700 bg-transparent cursor-pointer p-0"
                      />
                      <input
                        type="text"
                        value={(selectedBlock as CardBlock).strokeColor || "#334155"}
                        onChange={(e) =>
                          onUpdateBlock(selectedBlock.id, { strokeColor: e.target.value })
                        }
                        className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-[11px] font-mono text-slate-200"
                      />
                    </div>
                  </div>
                </div>

                {/* Sliders for Radius and Padding */}
                <div className="space-y-3 pt-1">
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                      <span>Corner Radius</span>
                      <span className="font-mono text-slate-300">
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
                      className="w-full accent-blue-600 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                      <span>Internal Padding</span>
                      <span className="font-mono text-slate-300">
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
                      className="w-full accent-blue-600 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 4. CALLOUT BANNER BLOCK */}
            {selectedBlock.type === "card_callout" && (
              <div className="space-y-3.5">
                <div>
                  <label className="text-slate-400 block mb-1 font-medium">Banner Variant</label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {(["note", "tip", "warning", "caution"] as const).map((v) => (
                      <button
                        key={v}
                        onClick={() => onUpdateBlock(selectedBlock.id, { variant: v })}
                        className={`py-1.5 px-2 rounded-lg text-xs font-semibold capitalize border transition-all text-left flex items-center gap-1.5 ${
                          (selectedBlock as CalloutCardBlock).variant === v
                            ? "bg-blue-600 border-blue-500 text-white"
                            : "border-slate-800 bg-slate-900 text-slate-400 hover:text-white"
                        }`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${
                            v === "note"
                              ? "bg-blue-400"
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
                  <label className="text-slate-400 block mb-1 font-medium">Callout Title</label>
                  <input
                    type="text"
                    value={(selectedBlock as CalloutCardBlock).title}
                    onChange={(e) =>
                      onUpdateBlock(selectedBlock.id, { title: e.target.value })
                    }
                    placeholder="Callout title..."
                    className="w-full bg-slate-900 border border-slate-800 focus:border-blue-500 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 outline-none"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1 font-medium">Message / Details</label>
                  <textarea
                    rows={4}
                    value={(selectedBlock as CalloutCardBlock).message}
                    onChange={(e) =>
                      onUpdateBlock(selectedBlock.id, { message: e.target.value })
                    }
                    placeholder="Write detailed callout message..."
                    className="w-full bg-slate-900 border border-slate-800 focus:border-blue-500 rounded-lg p-2.5 text-xs text-slate-100 outline-none resize-y"
                  />
                </div>
              </div>
            )}

            {/* 5. METRIC / KPI BLOCK */}
            {selectedBlock.type === "card_metric" && (
              <div className="space-y-3.5">
                <div>
                  <label className="text-slate-400 block mb-1 font-medium">Metric Label</label>
                  <input
                    type="text"
                    value={(selectedBlock as MetricCardBlock).label}
                    onChange={(e) =>
                      onUpdateBlock(selectedBlock.id, { label: e.target.value })
                    }
                    placeholder="e.g. Total Revenue or Uptime"
                    className="w-full bg-slate-900 border border-slate-800 focus:border-blue-500 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 outline-none"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1 font-medium">Metric Value</label>
                  <input
                    type="text"
                    value={(selectedBlock as MetricCardBlock).value}
                    onChange={(e) =>
                      onUpdateBlock(selectedBlock.id, { value: e.target.value })
                    }
                    placeholder="e.g. $1.2M or 99.99%"
                    className="w-full bg-slate-900 border border-slate-800 focus:border-blue-500 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 outline-none font-bold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Trend Text</label>
                    <input
                      type="text"
                      value={(selectedBlock as MetricCardBlock).change || ""}
                      onChange={(e) =>
                        onUpdateBlock(selectedBlock.id, { change: e.target.value })
                      }
                      placeholder="+12% YoY"
                      className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-slate-200"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Direction</label>
                    <select
                      value={(selectedBlock as MetricCardBlock).changeType || "neutral"}
                      onChange={(e) =>
                        onUpdateBlock(selectedBlock.id, { changeType: e.target.value as any })
                      }
                      className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-slate-200 outline-none"
                    >
                      <option value="positive">Positive (Green)</option>
                      <option value="negative">Negative (Red)</option>
                      <option value="neutral">Neutral (Gray)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* 6. PROFILE / AUTHOR BLOCK */}
            {selectedBlock.type === "card_profile" && (
              <div className="space-y-3.5">
                <div>
                  <label className="text-slate-400 block mb-1 font-medium">Full Name</label>
                  <input
                    type="text"
                    value={(selectedBlock as ProfileCardBlock).name}
                    onChange={(e) =>
                      onUpdateBlock(selectedBlock.id, { name: e.target.value })
                    }
                    placeholder="Name..."
                    className="w-full bg-slate-900 border border-slate-800 focus:border-blue-500 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 outline-none font-bold"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1 font-medium">Role / Title</label>
                  <input
                    type="text"
                    value={(selectedBlock as ProfileCardBlock).role}
                    onChange={(e) =>
                      onUpdateBlock(selectedBlock.id, { role: e.target.value })
                    }
                    placeholder="Role / Title..."
                    className="w-full bg-slate-900 border border-slate-800 focus:border-blue-500 rounded-lg px-2.5 py-1.5 text-xs text-blue-400 outline-none font-semibold"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1 font-medium">Bio / Summary</label>
                  <textarea
                    rows={4}
                    value={(selectedBlock as ProfileCardBlock).bio}
                    onChange={(e) =>
                      onUpdateBlock(selectedBlock.id, { bio: e.target.value })
                    }
                    placeholder="Professional bio..."
                    className="w-full bg-slate-900 border border-slate-800 focus:border-blue-500 rounded-lg p-2.5 text-xs text-slate-100 outline-none resize-y"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1 font-medium">Contact / Links</label>
                  <input
                    type="text"
                    value={(selectedBlock as ProfileCardBlock).contact || ""}
                    onChange={(e) =>
                      onUpdateBlock(selectedBlock.id, { contact: e.target.value })
                    }
                    placeholder="email@example.com • github.com/user"
                    className="w-full bg-slate-900 border border-slate-800 focus:border-blue-500 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 outline-none font-mono"
                  />
                </div>
              </div>
            )}

            {/* 7. DATA TABLE BLOCK */}
            {selectedBlock.type === "table" && (
              <div className="space-y-3.5">
                <div>
                  <label className="text-slate-400 block mb-1 font-medium">Table Caption</label>
                  <input
                    type="text"
                    value={(selectedBlock as TableBlock).caption || ""}
                    onChange={(e) =>
                      onUpdateBlock(selectedBlock.id, { caption: e.target.value })
                    }
                    placeholder="Table caption..."
                    className="w-full bg-slate-900 border border-slate-800 focus:border-blue-500 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 outline-none"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const tbl = selectedBlock as TableBlock;
                      const newHeaders = [...tbl.headers, `Col ${tbl.headers.length + 1}`];
                      const newRows = tbl.rows.map((r) => [...r, ""]);
                      onUpdateBlock(selectedBlock.id, { headers: newHeaders, rows: newRows });
                    }}
                    className="flex-1 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 rounded-lg text-xs font-semibold"
                  >
                    + Add Column
                  </button>
                  <button
                    onClick={() => {
                      const tbl = selectedBlock as TableBlock;
                      const newRows = [...tbl.rows, Array(tbl.headers.length).fill("")];
                      onUpdateBlock(selectedBlock.id, { rows: newRows });
                    }}
                    className="flex-1 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 rounded-lg text-xs font-semibold"
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
                  <label className="text-slate-400 block mb-1 font-medium">Filename / Title</label>
                  <input
                    type="text"
                    value={(selectedBlock as CodeBlock).filename || ""}
                    onChange={(e) =>
                      onUpdateBlock(selectedBlock.id, { filename: e.target.value })
                    }
                    placeholder="e.g. main.rs or config.typ"
                    className="w-full bg-slate-900 border border-slate-800 focus:border-blue-500 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 font-mono outline-none"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1 font-medium">Syntax Language</label>
                  <select
                    value={(selectedBlock as CodeBlock).language}
                    onChange={(e) =>
                      onUpdateBlock(selectedBlock.id, { language: e.target.value })
                    }
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 outline-none font-mono"
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
                  <label className="text-slate-400 block mb-1 font-medium">Code Snippet</label>
                  <textarea
                    rows={6}
                    value={(selectedBlock as CodeBlock).code}
                    onChange={(e) =>
                      onUpdateBlock(selectedBlock.id, { code: e.target.value })
                    }
                    className="w-full bg-slate-900 border border-slate-800 focus:border-blue-500 rounded-lg p-2.5 text-xs text-slate-100 font-mono outline-none resize-y leading-relaxed"
                  />
                </div>
              </div>
            )}

            {/* 9. IMAGE BLOCK */}
            {selectedBlock.type === "image" && (
              <div className="space-y-3.5">
                <div>
                  <label className="text-slate-400 block mb-1 font-medium">Image URL</label>
                  <input
                    type="text"
                    value={(selectedBlock as ImageBlock).url}
                    onChange={(e) =>
                      onUpdateBlock(selectedBlock.id, { url: e.target.value })
                    }
                    placeholder="https://... or /uploads/..."
                    className="w-full bg-slate-900 border border-slate-800 focus:border-blue-500 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 outline-none"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1 font-medium">Caption</label>
                  <input
                    type="text"
                    value={(selectedBlock as ImageBlock).caption || ""}
                    onChange={(e) =>
                      onUpdateBlock(selectedBlock.id, { caption: e.target.value })
                    }
                    placeholder="Figure caption..."
                    className="w-full bg-slate-900 border border-slate-800 focus:border-blue-500 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 outline-none italic"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1 font-medium">Image Width</label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {["50%", "80%", "100%"].map((w) => (
                      <button
                        key={w}
                        onClick={() => onUpdateBlock(selectedBlock.id, { width: w })}
                        className={`py-1 rounded-md text-xs font-semibold border ${
                          (selectedBlock as ImageBlock).width === w
                            ? "bg-blue-600 border-blue-500 text-white"
                            : "border-slate-800 bg-slate-900 text-slate-400 hover:text-white"
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
                  <label className="text-slate-400 block mb-1 font-medium">Column Count</label>
                  <div className="grid grid-cols-2 gap-2">
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
                        className={`py-1.5 rounded-lg text-xs font-semibold border ${
                          (selectedBlock as ColumnsBlock).columnsCount === count
                            ? "bg-blue-600 border-blue-500 text-white"
                            : "border-slate-800 bg-slate-900 text-slate-400 hover:text-white"
                        }`}
                      >
                        {count} Columns
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                    <span>Gutter Spacing</span>
                    <span className="font-mono text-slate-300">
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
                    className="w-full accent-blue-600 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
                  />
                </div>
              </div>
            )}

            {/* 11. DIVIDER BLOCK */}
            {selectedBlock.type === "divider" && (
              <div className="space-y-3.5">
                <div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                    <span>Vertical Spacing</span>
                    <span className="font-mono text-slate-300">
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
                    className="w-full accent-blue-600 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
                  />
                </div>
              </div>
            )}
          </div>
        ) : (
          /* DOCUMENT PAGE SETUP (when no block is selected) */
          <div className="space-y-4">
            <div>
              <label className="text-slate-400 block mb-1 font-medium">Paper Format</label>
              <select
                value={documentState.settings.paper}
                onChange={(e) => onUpdateDocumentSettings({ paper: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 outline-none"
              >
                <option value="a4">A4 (210 × 297 mm)</option>
                <option value="us-letter">US Letter (8.5 × 11 in)</option>
                <option value="presentation-16-9">Presentation Slide (16:9)</option>
              </select>
            </div>

            <div>
              <label className="text-slate-400 block mb-1 font-medium">Orientation</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => onUpdateDocumentSettings({ orientation: "portrait" })}
                  className={`py-1.5 rounded-lg text-xs font-semibold border ${
                    documentState.settings.orientation === "portrait"
                      ? "bg-blue-600 border-blue-500 text-white"
                      : "border-slate-800 bg-slate-900 text-slate-400 hover:text-white"
                  }`}
                >
                  Portrait
                </button>
                <button
                  onClick={() => onUpdateDocumentSettings({ orientation: "landscape" })}
                  className={`py-1.5 rounded-lg text-xs font-semibold border ${
                    documentState.settings.orientation === "landscape"
                      ? "bg-blue-600 border-blue-500 text-white"
                      : "border-slate-800 bg-slate-900 text-slate-400 hover:text-white"
                  }`}
                >
                  Landscape
                </button>
              </div>
            </div>

            <div>
              <label className="text-slate-400 block mb-1 font-medium">Typography Font</label>
              <select
                value={documentState.settings.font}
                onChange={(e) => onUpdateDocumentSettings({ font: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 outline-none"
              >
                <option value="Liberation Sans">Liberation Sans (Clean Sans-Serif)</option>
                <option value="Liberation Serif">Liberation Serif (Editorial Classic)</option>
                <option value="Liberation Mono">Liberation Mono (Technical Code)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-400 block font-medium">Page Margins</label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[10px] text-slate-500">Top</span>
                  <input
                    type="text"
                    value={documentState.settings.margins.top}
                    onChange={(e) =>
                      onUpdateDocumentSettings({
                        margins: { ...documentState.settings.margins, top: e.target.value },
                      })
                    }
                    className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-slate-200"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-slate-500">Bottom</span>
                  <input
                    type="text"
                    value={documentState.settings.margins.bottom}
                    onChange={(e) =>
                      onUpdateDocumentSettings({
                        margins: { ...documentState.settings.margins, bottom: e.target.value },
                      })
                    }
                    className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-slate-200"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-slate-500">Left</span>
                  <input
                    type="text"
                    value={documentState.settings.margins.left}
                    onChange={(e) =>
                      onUpdateDocumentSettings({
                        margins: { ...documentState.settings.margins, left: e.target.value },
                      })
                    }
                    className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-slate-200"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-slate-500">Right</span>
                  <input
                    type="text"
                    value={documentState.settings.margins.right}
                    onChange={(e) =>
                      onUpdateDocumentSettings({
                        margins: { ...documentState.settings.margins, right: e.target.value },
                      })
                    }
                    className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-slate-200"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              <span className="text-xs text-slate-300 font-medium">Show Page Numbers</span>
              <input
                type="checkbox"
                checked={documentState.settings.showPageNumbers}
                onChange={(e) =>
                  onUpdateDocumentSettings({ showPageNumbers: e.target.checked })
                }
                className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-0 cursor-pointer"
              />
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
