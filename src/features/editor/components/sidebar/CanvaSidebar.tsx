"use client";

import React, { useState, useRef } from "react";
import { BlockType, DocumentBlock, DocumentPreset, DocumentState } from "@/types/document";
import { PRESET_CONFIGS } from "@/lib/typst/presets";
import {
  Square,
  Type,
  Upload,
  LayoutTemplate,
  FileCode,
  Sliders,
  ChevronLeft,
  ChevronRight,
  Plus,
  Heading,
  TrendingUp,
  AlertCircle,
  Columns,
  Table as TableIcon,
  Code2,
  Minus,
  Sparkles,
  User,
  Check,
  Copy,
  Download,
} from "lucide-react";

interface Props {
  documentState: DocumentState;
  onAddBlock: (block: DocumentBlock) => void;
  onApplyPreset: (preset: DocumentPreset) => void;
  onUpdateDocumentSettings: (settings: Partial<DocumentState["settings"]>) => void;
  typstCode: string;
}

type TabType = "elements" | "text" | "uploads" | "templates" | "code" | "design";

export function CanvaSidebar({
  documentState,
  onAddBlock,
  onApplyPreset,
  onUpdateDocumentSettings,
  typstCode,
}: Props) {
  const [activeTab, setActiveTab] = useState<TabType | null>("elements");
  const [copiedCode, setCopiedCode] = useState(false);
  const uploadInputRef = useRef<HTMLInputElement>(null);

  const toggleTab = (tab: TabType) => {
    setActiveTab((curr) => (curr === tab ? null : tab));
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (data.type === "image") {
        onAddBlock({
          id: "b-" + Math.random().toString(36).substring(2, 9),
          type: "image",
          url: data.url,
          caption: data.name,
          align: "center",
          width: "85%",
        });
      } else if (data.type === "csv") {
        onAddBlock({
          id: "b-" + Math.random().toString(36).substring(2, 9),
          type: "table",
          headers: data.headers,
          rows: data.rows,
          caption: data.name.replace(/\.[^/.]+$/, ""),
        });
      } else if (data.type === "document_text") {
        onAddBlock({
          id: "b-" + Math.random().toString(36).substring(2, 9),
          type: "text",
          content: data.content,
        });
      }
    } catch (err) {
      console.error("Upload error:", err);
    }
  };

  const handleCopyCode = async () => {
    await navigator.clipboard.writeText(typstCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleDownloadTyp = () => {
    const blob = new Blob([typstCode], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${(documentState.title || "document").replace(/[^a-zA-Z0-9_-]/g, "_")}.typ`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex h-full select-none z-20 shrink-0">
      {/* 1. Left Vertical Icon Rail (Canva Style) */}
      <nav className="w-16 bg-slate-950 border-r border-slate-800/80 flex flex-col items-center py-3 gap-2 shrink-0">
        <button
          onClick={() => toggleTab("elements")}
          className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all ${
            activeTab === "elements"
              ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
          }`}
          title="Elements & Cards"
        >
          <Square className="w-5 h-5" />
          <span className="text-[9px] font-medium mt-1">Cards</span>
        </button>

        <button
          onClick={() => toggleTab("text")}
          className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all ${
            activeTab === "text"
              ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
          }`}
          title="Typography & Text"
        >
          <Type className="w-5 h-5" />
          <span className="text-[9px] font-medium mt-1">Text</span>
        </button>

        <button
          onClick={() => toggleTab("uploads")}
          className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all ${
            activeTab === "uploads"
              ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
          }`}
          title="Uploads & Assets"
        >
          <Upload className="w-5 h-5" />
          <span className="text-[9px] font-medium mt-1">Uploads</span>
        </button>

        <button
          onClick={() => toggleTab("templates")}
          className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all ${
            activeTab === "templates"
              ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
          }`}
          title="Document Templates"
        >
          <LayoutTemplate className="w-5 h-5" />
          <span className="text-[9px] font-medium mt-1">Presets</span>
        </button>

        <div className="w-8 border-t border-slate-800 my-1" />

        <button
          onClick={() => toggleTab("code")}
          className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all ${
            activeTab === "code"
              ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
          }`}
          title="Typst Code Inspector"
        >
          <FileCode className="w-5 h-5" />
          <span className="text-[9px] font-medium mt-1">Typst</span>
        </button>

        <button
          onClick={() => toggleTab("design")}
          className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all ${
            activeTab === "design"
              ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
          }`}
          title="Document Setup"
        >
          <Sliders className="w-5 h-5" />
          <span className="text-[9px] font-medium mt-1">Setup</span>
        </button>
      </nav>

      {/* 2. Expandable Canva Tool Panel */}
      {activeTab && (
        <aside className="w-72 bg-slate-900/95 backdrop-blur-md border-r border-slate-800/90 flex flex-col h-full animate-in slide-in-from-left duration-200">
          {/* Header */}
          <div className="p-3.5 border-b border-slate-800/80 flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 capitalize">
              {activeTab}
            </h3>
            <button
              onClick={() => setActiveTab(null)}
              className="p-1 rounded-md text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
              title="Collapse Panel"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3.5 space-y-4">
            {/* Elements / Cards Tab */}
            {activeTab === "elements" && (
              <div className="space-y-4">
                <div>
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                    Card Containers
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() =>
                        onAddBlock({
                          id: "b-" + Math.random().toString(36).substring(2, 9),
                          type: "card",
                          title: "Custom Card",
                          content: "Write card description here.",
                          fillColor: "#1e293b",
                          strokeColor: "#334155",
                          radius: 8,
                          padding: 14,
                        })
                      }
                      className="p-2.5 rounded-lg border border-slate-800 bg-slate-950/60 hover:bg-slate-950 hover:border-blue-500 text-left transition-all group"
                    >
                      <Square className="w-4 h-4 text-blue-400 mb-1.5 group-hover:scale-110 transition-transform" />
                      <div className="text-xs font-semibold text-slate-200">Box Card</div>
                      <div className="text-[10px] text-slate-500">Stylable container</div>
                    </button>

                    <button
                      onClick={() =>
                        onAddBlock({
                          id: "b-" + Math.random().toString(36).substring(2, 9),
                          type: "card_callout",
                          variant: "tip",
                          title: "Pro Tip",
                          message: "Key insight or notification highlight.",
                        })
                      }
                      className="p-2.5 rounded-lg border border-slate-800 bg-slate-950/60 hover:bg-slate-950 hover:border-emerald-500 text-left transition-all group"
                    >
                      <AlertCircle className="w-4 h-4 text-emerald-400 mb-1.5 group-hover:scale-110 transition-transform" />
                      <div className="text-xs font-semibold text-slate-200">Callout Banner</div>
                      <div className="text-[10px] text-slate-500">Note / Tip / Alert</div>
                    </button>

                    <button
                      onClick={() =>
                        onAddBlock({
                          id: "b-" + Math.random().toString(36).substring(2, 9),
                          type: "card_metric",
                          label: "Conversion Rate",
                          value: "64.2%",
                          change: "+12.4% MoM",
                          changeType: "positive",
                        })
                      }
                      className="p-2.5 rounded-lg border border-slate-800 bg-slate-950/60 hover:bg-slate-950 hover:border-purple-500 text-left transition-all group"
                    >
                      <TrendingUp className="w-4 h-4 text-purple-400 mb-1.5 group-hover:scale-110 transition-transform" />
                      <div className="text-xs font-semibold text-slate-200">KPI Metric</div>
                      <div className="text-[10px] text-slate-500">Stat highlight card</div>
                    </button>

                    <button
                      onClick={() =>
                        onAddBlock({
                          id: "b-" + Math.random().toString(36).substring(2, 9),
                          type: "card_profile",
                          name: "Sarah Jenkins",
                          role: "Lead Typographer",
                          bio: "Curating high-aesthetic visual documents.",
                          contact: "sarah@example.com",
                        })
                      }
                      className="p-2.5 rounded-lg border border-slate-800 bg-slate-950/60 hover:bg-slate-950 hover:border-amber-500 text-left transition-all group"
                    >
                      <User className="w-4 h-4 text-amber-400 mb-1.5 group-hover:scale-110 transition-transform" />
                      <div className="text-xs font-semibold text-slate-200">Profile Card</div>
                      <div className="text-[10px] text-slate-500">Author & bio card</div>
                    </button>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                    Layout & Tables
                  </span>
                  <div className="space-y-1.5">
                    <button
                      onClick={() =>
                        onAddBlock({
                          id: "b-" + Math.random().toString(36).substring(2, 9),
                          type: "columns",
                          columnsCount: 2,
                          gutter: 14,
                          columns: [
                            { id: "col-1", blocks: [] },
                            { id: "col-2", blocks: [] },
                          ],
                        })
                      }
                      className="w-full flex items-center gap-2.5 p-2 rounded-lg border border-slate-800/80 bg-slate-950/50 hover:bg-slate-950 hover:border-slate-700 text-xs text-slate-200"
                    >
                      <Columns className="w-4 h-4 text-blue-400" />
                      <div className="flex-1 text-left">
                        <span className="font-semibold block">2-Column Layout</span>
                        <span className="text-[10px] text-slate-500">Side-by-side split grid</span>
                      </div>
                    </button>

                    <button
                      onClick={() =>
                        onAddBlock({
                          id: "b-" + Math.random().toString(36).substring(2, 9),
                          type: "table",
                          headers: ["Metric", "Goal", "Achieved"],
                          rows: [
                            ["Throughput", "10k req/s", "14.2k req/s"],
                            ["P99 Latency", "<50ms", "38ms"],
                          ],
                          caption: "Q4 Engineering Key Results",
                        })
                      }
                      className="w-full flex items-center gap-2.5 p-2 rounded-lg border border-slate-800/80 bg-slate-950/50 hover:bg-slate-950 hover:border-slate-700 text-xs text-slate-200"
                    >
                      <TableIcon className="w-4 h-4 text-emerald-400" />
                      <div className="flex-1 text-left">
                        <span className="font-semibold block">Data Table</span>
                        <span className="text-[10px] text-slate-500">Grid or CSV import</span>
                      </div>
                    </button>

                    <button
                      onClick={() =>
                        onAddBlock({
                          id: "b-" + Math.random().toString(36).substring(2, 9),
                          type: "code",
                          language: "rust",
                          code: `// Typst macro\n#let card(title, body) = rect(\n  fill: rgb("#f8fafc"),\n  inset: 10pt,\n  [#text(weight: "bold")[#title] \\ #body]\n)`,
                          filename: "template.typ",
                        })
                      }
                      className="w-full flex items-center gap-2.5 p-2 rounded-lg border border-slate-800/80 bg-slate-950/50 hover:bg-slate-950 hover:border-slate-700 text-xs text-slate-200"
                    >
                      <Code2 className="w-4 h-4 text-purple-400" />
                      <div className="flex-1 text-left">
                        <span className="font-semibold block">Code Snippet</span>
                        <span className="text-[10px] text-slate-500">Syntax highlighted block</span>
                      </div>
                    </button>

                    <button
                      onClick={() =>
                        onAddBlock({
                          id: "b-" + Math.random().toString(36).substring(2, 9),
                          type: "divider",
                          style: "solid",
                          spacing: 12,
                        })
                      }
                      className="w-full flex items-center gap-2.5 p-2 rounded-lg border border-slate-800/80 bg-slate-950/50 hover:bg-slate-950 hover:border-slate-700 text-xs text-slate-200"
                    >
                      <Minus className="w-4 h-4 text-slate-400" />
                      <div className="flex-1 text-left">
                        <span className="font-semibold block">Divider Line</span>
                        <span className="text-[10px] text-slate-500">Horizontal separation</span>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Text Tab */}
            {activeTab === "text" && (
              <div className="space-y-3">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Add Typography
                </span>

                <button
                  onClick={() =>
                    onAddBlock({
                      id: "b-" + Math.random().toString(36).substring(2, 9),
                      type: "heading",
                      level: 1,
                      text: "Major Document Heading",
                      subtitle: "Subtitle description here",
                      align: "left",
                    })
                  }
                  className="w-full p-3 rounded-lg border border-slate-800 bg-slate-950/60 hover:bg-slate-950 hover:border-blue-500 text-left transition-all"
                >
                  <h1 className="text-xl font-bold text-white tracking-tight">Add a Heading</h1>
                  <span className="text-[11px] text-slate-500">H1 Document Title</span>
                </button>

                <button
                  onClick={() =>
                    onAddBlock({
                      id: "b-" + Math.random().toString(36).substring(2, 9),
                      type: "heading",
                      level: 2,
                      text: "Sub-Section Title",
                      align: "left",
                    })
                  }
                  className="w-full p-3 rounded-lg border border-slate-800 bg-slate-950/60 hover:bg-slate-950 hover:border-blue-500 text-left transition-all"
                >
                  <h2 className="text-base font-bold text-slate-200">Add a Subheading</h2>
                  <span className="text-[11px] text-slate-500">H2 Section Heading</span>
                </button>

                <button
                  onClick={() =>
                    onAddBlock({
                      id: "b-" + Math.random().toString(36).substring(2, 9),
                      type: "text",
                      content:
                        "Start typing your paragraph here. Supports inline markdown, bold, italic, and math formulas like $E=mc^2$.",
                      align: "left",
                    })
                  }
                  className="w-full p-3 rounded-lg border border-slate-800 bg-slate-950/60 hover:bg-slate-950 hover:border-blue-500 text-left transition-all"
                >
                  <p className="text-xs text-slate-300">Add a Paragraph of Body Text</p>
                  <span className="text-[11px] text-slate-500">Markdown + Math formulas</span>
                </button>
              </div>
            )}

            {/* Uploads Tab */}
            {activeTab === "uploads" && (
              <div className="space-y-4">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Upload Media & Data
                </span>

                <div
                  onClick={() => uploadInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-700/80 hover:border-blue-500 rounded-xl p-6 text-center cursor-pointer transition-colors bg-slate-950/40 hover:bg-slate-950/80 space-y-2"
                >
                  <Upload className="w-8 h-8 text-blue-400 mx-auto" />
                  <div className="text-xs font-semibold text-slate-200">
                    Click or drop files here
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Supports PNG, JPG, SVG, CSV tables, or Typst (.typ) files
                  </p>
                </div>

                <input
                  ref={uploadInputRef}
                  type="file"
                  accept="image/*,.csv,.md,.typ,.txt"
                  onChange={handleUpload}
                  className="hidden"
                />
              </div>
            )}

            {/* Templates Tab */}
            {activeTab === "templates" && (
              <div className="space-y-3">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Switch Preset Template
                </span>
                {(
                  [
                    "a4_document",
                    "resume",
                    "presentation_16_9",
                    "cheatsheet",
                  ] as DocumentPreset[]
                ).map((preset) => {
                  const cfg = PRESET_CONFIGS[preset];
                  const isCurrent = documentState.preset === preset;
                  return (
                    <button
                      key={preset}
                      onClick={() => onApplyPreset(preset)}
                      className={`w-full p-3 rounded-lg border text-left transition-all ${
                        isCurrent
                          ? "border-blue-500 bg-blue-950/40 text-blue-200"
                          : "border-slate-800 bg-slate-950/60 hover:bg-slate-950 hover:border-slate-700 text-slate-200"
                      }`}
                    >
                      <div className="text-xs font-bold flex items-center justify-between">
                        <span>{cfg.label}</span>
                        {isCurrent && <Check className="w-3.5 h-3.5 text-blue-400" />}
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                        {cfg.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Typst Code Inspector Tab */}
            {activeTab === "code" && (
              <div className="space-y-3 flex flex-col h-full">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                    Live Typst Code
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={handleCopyCode}
                      className="px-2 py-1 text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-700 flex items-center gap-1"
                    >
                      {copiedCode ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedCode ? "Copied" : "Copy"}</span>
                    </button>
                    <button
                      onClick={handleDownloadTyp}
                      className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800"
                      title="Download .typ"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <pre className="flex-1 bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono text-[11px] leading-relaxed text-slate-300 overflow-auto max-h-[500px]">
                  <code>{typstCode}</code>
                </pre>
              </div>
            )}

            {/* Document Setup Tab */}
            {activeTab === "design" && (
              <div className="space-y-4">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Document Sizing & Setup
                </span>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Paper Sizing</label>
                  <select
                    value={documentState.settings.paper}
                    onChange={(e) => onUpdateDocumentSettings({ paper: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 outline-none"
                  >
                    <option value="a4">A4 (210 × 297 mm)</option>
                    <option value="us-letter">US Letter (8.5 × 11 in)</option>
                    <option value="presentation-16-9">Presentation Slide (16:9)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Orientation</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => onUpdateDocumentSettings({ orientation: "portrait" })}
                      className={`py-1.5 rounded text-xs font-semibold border ${
                        documentState.settings.orientation === "portrait"
                          ? "bg-blue-600 border-blue-500 text-white"
                          : "border-slate-800 bg-slate-950 text-slate-400"
                      }`}
                    >
                      Portrait
                    </button>
                    <button
                      onClick={() => onUpdateDocumentSettings({ orientation: "landscape" })}
                      className={`py-1.5 rounded text-xs font-semibold border ${
                        documentState.settings.orientation === "landscape"
                          ? "bg-blue-600 border-blue-500 text-white"
                          : "border-slate-800 bg-slate-950 text-slate-400"
                      }`}
                    >
                      Landscape
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Base Font</label>
                  <select
                    value={documentState.settings.font}
                    onChange={(e) => onUpdateDocumentSettings({ font: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 outline-none"
                  >
                    <option value="Liberation Sans">Liberation Sans (Clean Sans-Serif)</option>
                    <option value="Liberation Serif">Liberation Serif (Editorial Serif)</option>
                    <option value="Liberation Mono">Liberation Mono (Technical Code)</option>
                  </select>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                  <span className="text-xs text-slate-300">Page Numbers</span>
                  <input
                    type="checkbox"
                    checked={documentState.settings.showPageNumbers}
                    onChange={(e) => onUpdateDocumentSettings({ showPageNumbers: e.target.checked })}
                    className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-0 cursor-pointer"
                  />
                </div>
              </div>
            )}
          </div>
        </aside>
      )}
    </div>
  );
}
