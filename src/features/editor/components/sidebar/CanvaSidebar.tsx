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
  Palette,
  Wand2,
  Moon,
  Sun,
  LayoutGrid,
  Quote,
  Clock,
  PenTool,
  Tag,
  Percent,
} from "lucide-react";
import { useTheme } from "@/lib/theme";
import { applyPaletteToDocument, getPalette } from "@/lib/theme/palettes";

interface Props {
  documentState: DocumentState;
  onAddBlock: (block: DocumentBlock) => void;
  onApplyPreset: (preset: DocumentPreset) => void;
  onUpdateDocumentSettings: (settings: Partial<DocumentState["settings"]>) => void;
  onApplyPaletteToDoc?: (updatedDoc: DocumentState) => void;
  typstCode: string;
}

type TabType =
  | "elements"
  | "layouts"
  | "text"
  | "uploads"
  | "templates"
  | "theme"
  | "code"
  | "design";

export function CanvaSidebar({
  documentState,
  onAddBlock,
  onApplyPreset,
  onUpdateDocumentSettings,
  onApplyPaletteToDoc,
  typstCode,
}: Props) {
  const [activeTab, setActiveTab] = useState<TabType | null>("elements");
  const [copiedCode, setCopiedCode] = useState(false);
  const [paletteAppliedToast, setPaletteAppliedToast] = useState(false);
  const uploadInputRef = useRef<HTMLInputElement>(null);

  const {
    uiTheme,
    setUITheme,
    activePaletteId,
    setActivePaletteId,
    activePalette,
    allPalettes,
    allUIThemes,
    applyPalette,
  } = useTheme();

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
      {/* 1. Left Vertical Icon Rail (Monochromatic Precision) */}
      <nav
        className="w-16 border-r flex flex-col items-center py-3 gap-2 shrink-0 transition-colors duration-150"
        style={{
          backgroundColor: "var(--theme-panel)",
          borderColor: "var(--theme-border)",
        }}
      >
        <button
          onClick={() => toggleTab("elements")}
          className={`flex flex-col items-center justify-center w-12 h-12 rounded-lg transition-all ${
            activeTab === "elements"
              ? "bg-white text-zinc-950 font-bold shadow-xs"
              : "text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900"
          }`}
          title="Elements & Cards"
        >
          <Square className="w-5 h-5" />
          <span className="text-[9px] font-mono tracking-tight mt-1">Cards</span>
        </button>

        <button
          onClick={() => toggleTab("layouts")}
          className={`flex flex-col items-center justify-center w-12 h-12 rounded-lg transition-all ${
            activeTab === "layouts"
              ? "bg-white text-zinc-950 font-bold shadow-xs"
              : "text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900"
          }`}
          title="Grid Layouts & Splits"
        >
          <LayoutGrid className="w-5 h-5" />
          <span className="text-[9px] font-mono tracking-tight mt-1">Layouts</span>
        </button>

        <button
          onClick={() => toggleTab("text")}
          className={`flex flex-col items-center justify-center w-12 h-12 rounded-lg transition-all ${
            activeTab === "text"
              ? "bg-white text-zinc-950 font-bold shadow-xs"
              : "text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900"
          }`}
          title="Typography & Text"
        >
          <Type className="w-5 h-5" />
          <span className="text-[9px] font-mono tracking-tight mt-1">Text</span>
        </button>

        <button
          onClick={() => toggleTab("uploads")}
          className={`flex flex-col items-center justify-center w-12 h-12 rounded-lg transition-all ${
            activeTab === "uploads"
              ? "bg-white text-zinc-950 font-bold shadow-xs"
              : "text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900"
          }`}
          title="Uploads & Assets"
        >
          <Upload className="w-5 h-5" />
          <span className="text-[9px] font-mono tracking-tight mt-1">Uploads</span>
        </button>

        <button
          onClick={() => toggleTab("templates")}
          className={`flex flex-col items-center justify-center w-12 h-12 rounded-lg transition-all ${
            activeTab === "templates"
              ? "bg-white text-zinc-950 font-bold shadow-xs"
              : "text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900"
          }`}
          title="Document Templates"
        >
          <LayoutTemplate className="w-5 h-5" />
          <span className="text-[9px] font-mono tracking-tight mt-1">Presets</span>
        </button>

        <button
          onClick={() => toggleTab("theme")}
          className={`flex flex-col items-center justify-center w-12 h-12 rounded-lg transition-all ${
            activeTab === "theme"
              ? "bg-white text-zinc-950 font-bold shadow-xs"
              : "text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900"
          }`}
          title="Themes & Palettes"
        >
          <Palette className="w-5 h-5" />
          <span className="text-[9px] font-mono tracking-tight mt-1">Theme</span>
        </button>

        <div className="w-8 border-t border-zinc-800 my-1" />

        <button
          onClick={() => toggleTab("code")}
          className={`flex flex-col items-center justify-center w-12 h-12 rounded-lg transition-all ${
            activeTab === "code"
              ? "bg-white text-zinc-950 font-bold shadow-xs"
              : "text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900"
          }`}
          title="Typst Code Inspector"
        >
          <FileCode className="w-5 h-5" />
          <span className="text-[9px] font-mono tracking-tight mt-1">Typst</span>
        </button>

        <button
          onClick={() => toggleTab("design")}
          className={`flex flex-col items-center justify-center w-12 h-12 rounded-lg transition-all ${
            activeTab === "design"
              ? "bg-white text-zinc-950 font-bold shadow-xs"
              : "text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900"
          }`}
          title="Document Setup"
        >
          <Sliders className="w-5 h-5" />
          <span className="text-[9px] font-mono tracking-tight mt-1">Setup</span>
        </button>
      </nav>

      {/* 2. Expandable Canva Tool Panel */}
      {activeTab && (
        <aside
          className="w-72 border-r flex flex-col h-full animate-in slide-in-from-left duration-200 transition-colors duration-150"
          style={{
            backgroundColor: "var(--theme-panel)",
            borderColor: "var(--theme-border)",
            color: "var(--theme-text-primary)",
          }}
        >
          {/* Header */}
          <div
            className="p-3.5 border-b flex items-center justify-between"
            style={{ borderColor: "var(--theme-border)" }}
          >
            <h3 className="text-xs font-mono font-bold uppercase tracking-[0.12em] text-zinc-300 capitalize">
              {activeTab}
            </h3>
            <button
              onClick={() => setActiveTab(null)}
              className="p-1 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors"
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

                <div>
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                    Publishing Elements
                  </span>
                  <div className="space-y-1.5">
                    <button
                      onClick={() =>
                        onAddBlock({
                          id: "b-" + Math.random().toString(36).substring(2, 9),
                          type: "quote",
                          quote: "Simplicity is the prerequisite for reliability.",
                          author: "Edsger W. Dijkstra",
                          citation: "EWD 498",
                        })
                      }
                      className="w-full flex items-center gap-2.5 p-2 rounded-lg border border-slate-800/80 bg-slate-950/50 hover:bg-slate-950 hover:border-amber-500 text-xs text-slate-200"
                    >
                      <Quote className="w-4 h-4 text-amber-400" />
                      <div className="flex-1 text-left">
                        <span className="font-semibold block">Pull Quote</span>
                        <span className="text-[10px] text-slate-500">Editorial quote with citation</span>
                      </div>
                    </button>

                    <button
                      onClick={() =>
                        onAddBlock({
                          id: "b-" + Math.random().toString(36).substring(2, 9),
                          type: "key_value",
                          title: "Document Metadata",
                          columnsCount: 2,
                          items: [
                            { id: "kv-1", key: "AUTHOR", value: "Architecture Team" },
                            { id: "kv-2", key: "STATUS", value: "Approved" },
                            { id: "kv-3", key: "VERSION", value: "v2.4.0" },
                            { id: "kv-4", key: "SECURITY", value: "Confidential" },
                          ],
                        })
                      }
                      className="w-full flex items-center gap-2.5 p-2 rounded-lg border border-slate-800/80 bg-slate-950/50 hover:bg-slate-950 hover:border-cyan-500 text-xs text-slate-200"
                    >
                      <LayoutGrid className="w-4 h-4 text-cyan-400" />
                      <div className="flex-1 text-left">
                        <span className="font-semibold block">Property Grid</span>
                        <span className="text-[10px] text-slate-500">Key-value metadata specs</span>
                      </div>
                    </button>

                    <button
                      onClick={() =>
                        onAddBlock({
                          id: "b-" + Math.random().toString(36).substring(2, 9),
                          type: "timeline",
                          title: "Delivery Milestones",
                          orientation: "vertical",
                          steps: [
                            {
                              id: "tl-1",
                              stepNumber: "01",
                              title: "Architecture Spec",
                              date: "Phase 1",
                              description: "Define schemas, contracts, and Typst boundaries.",
                            },
                            {
                              id: "tl-2",
                              stepNumber: "02",
                              title: "Interactive Canvas",
                              date: "Phase 2",
                              description: "Real-time visual editor with zero regression tests.",
                            },
                            {
                              id: "tl-3",
                              stepNumber: "03",
                              title: "Production Launch",
                              date: "Phase 3",
                              description: "Export high-resolution vector PDF documents.",
                            },
                          ],
                        })
                      }
                      className="w-full flex items-center gap-2.5 p-2 rounded-lg border border-slate-800/80 bg-slate-950/50 hover:bg-slate-950 hover:border-emerald-500 text-xs text-slate-200"
                    >
                      <Clock className="w-4 h-4 text-emerald-400" />
                      <div className="flex-1 text-left">
                        <span className="font-semibold block">Process Timeline</span>
                        <span className="text-[10px] text-slate-500">Milestones and stage progression</span>
                      </div>
                    </button>

                    <button
                      onClick={() =>
                        onAddBlock({
                          id: "b-" + Math.random().toString(36).substring(2, 9),
                          type: "signature",
                          hasSealBox: true,
                          parties: [
                            {
                              id: "sig-1",
                              name: "Marcus Vance",
                              title: "Managing Director",
                              role: "Client Principal",
                              date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }),
                            },
                            {
                              id: "sig-2",
                              name: "Elena Rostova",
                              title: "Chief Architect",
                              role: "Contractor Lead",
                              date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }),
                            },
                          ],
                        })
                      }
                      className="w-full flex items-center gap-2.5 p-2 rounded-lg border border-slate-800/80 bg-slate-950/50 hover:bg-slate-950 hover:border-rose-500 text-xs text-slate-200"
                    >
                      <PenTool className="w-4 h-4 text-rose-400" />
                      <div className="flex-1 text-left">
                        <span className="font-semibold block">Signatures & Seal</span>
                        <span className="text-[10px] text-slate-500">Legal contract sign-off block</span>
                      </div>
                    </button>

                    <button
                      onClick={() =>
                        onAddBlock({
                          id: "b-" + Math.random().toString(36).substring(2, 9),
                          type: "tags",
                          category: "Taxonomy",
                          tags: [
                            { id: "t-1", label: "Production" },
                            { id: "t-2", label: "Typst Native" },
                            { id: "t-3", label: "WASM" },
                          ],
                        })
                      }
                      className="w-full flex items-center gap-2.5 p-2 rounded-lg border border-slate-800/80 bg-slate-950/50 hover:bg-slate-950 hover:border-indigo-500 text-xs text-slate-200"
                    >
                      <Tag className="w-4 h-4 text-indigo-400" />
                      <div className="flex-1 text-left">
                        <span className="font-semibold block">Pill Tags</span>
                        <span className="text-[10px] text-slate-500">Categories and skill badges</span>
                      </div>
                    </button>

                    <button
                      onClick={() =>
                        onAddBlock({
                          id: "b-" + Math.random().toString(36).substring(2, 9),
                          type: "math",
                          formula: "sum_(k=1)^n k^2 = (n(n+1)(2n+1)) / 6",
                          equationNumber: "1",
                          caption: "Sum of squares identity",
                        })
                      }
                      className="w-full flex items-center gap-2.5 p-2 rounded-lg border border-slate-800/80 bg-slate-950/50 hover:bg-slate-950 hover:border-teal-500 text-xs text-slate-200"
                    >
                      <Code2 className="w-4 h-4 text-teal-400" />
                      <div className="flex-1 text-left">
                        <span className="font-semibold block">Math Equation</span>
                        <span className="text-[10px] text-slate-500">Numbered LaTeX/Typst formula</span>
                      </div>
                    </button>

                    <button
                      onClick={() =>
                        onAddBlock({
                          id: "b-" + Math.random().toString(36).substring(2, 9),
                          type: "progress",
                          label: "Milestone Target",
                          percentage: 82,
                          target: "100%",
                        })
                      }
                      className="w-full flex items-center gap-2.5 p-2 rounded-lg border border-slate-800/80 bg-slate-950/50 hover:bg-slate-950 hover:border-sky-500 text-xs text-slate-200"
                    >
                      <Percent className="w-4 h-4 text-sky-400" />
                      <div className="flex-1 text-left">
                        <span className="font-semibold block">Progress Bar</span>
                        <span className="text-[10px] text-slate-500">Completion metric bar</span>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Layouts Tab (Complex Layout Presets) */}
            {activeTab === "layouts" && (
              <div className="space-y-3">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Complex Grid Presets
                </span>

                {/* 1. Image - Title - Image */}
                <button
                  onClick={() =>
                    onAddBlock({
                      id: "b-" + Math.random().toString(36).substring(2, 9),
                      type: "grid_layout",
                      presetId: "image_title_image",
                      tracks: ["1fr", "2fr", "1fr"],
                      gutter: 14,
                      verticalAlign: "center",
                      slots: [
                        {
                          id: "slot-1",
                          widthFraction: "1fr",
                          blocks: [
                            {
                              id: "b-" + Math.random().toString(36).substring(2, 9),
                              type: "image",
                              url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80",
                              width: "100%",
                              align: "center",
                            },
                          ],
                        },
                        {
                          id: "slot-2",
                          widthFraction: "2fr",
                          blocks: [
                            {
                              id: "b-" + Math.random().toString(36).substring(2, 9),
                              type: "heading",
                              level: 1,
                              align: "center",
                              text: "EXECUTIVE REPORT",
                              subtitle: "Strategic Review & Architecture Plan",
                            },
                          ],
                        },
                        {
                          id: "slot-3",
                          widthFraction: "1fr",
                          blocks: [
                            {
                              id: "b-" + Math.random().toString(36).substring(2, 9),
                              type: "image",
                              url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80",
                              width: "100%",
                              align: "center",
                            },
                          ],
                        },
                      ],
                    })
                  }
                  className="w-full p-2.5 rounded-lg border border-slate-800 bg-slate-950/60 hover:bg-slate-950 hover:border-blue-500 text-left transition-all group"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-semibold text-slate-200">Image - Title - Image</span>
                    <span className="text-[9px] font-mono bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded">
                      1 : 2 : 1
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-1 p-1 bg-black/40 rounded border border-slate-800/80 mb-2">
                    <div className="h-6 bg-slate-700/60 rounded flex items-center justify-center text-[8px] font-mono text-slate-300">Img</div>
                    <div className="col-span-2 h-6 bg-blue-600/30 rounded flex items-center justify-center text-[8px] font-mono text-blue-200 font-bold">TITLE</div>
                    <div className="h-6 bg-slate-700/60 rounded flex items-center justify-center text-[8px] font-mono text-slate-300">Img</div>
                  </div>
                  <div className="text-[10px] text-slate-500">Horizon-aligned header with brand logos and centered title</div>
                </button>

                {/* 2. Split 2:1 */}
                <button
                  onClick={() =>
                    onAddBlock({
                      id: "b-" + Math.random().toString(36).substring(2, 9),
                      type: "grid_layout",
                      presetId: "split_2_1",
                      tracks: ["2fr", "1fr"],
                      gutter: 14,
                      verticalAlign: "top",
                      slots: [
                        {
                          id: "slot-1",
                          widthFraction: "2fr",
                          blocks: [
                            {
                              id: "b-" + Math.random().toString(36).substring(2, 9),
                              type: "heading",
                              level: 2,
                              align: "left",
                              text: "Executive Summary",
                            },
                            {
                              id: "b-" + Math.random().toString(36).substring(2, 9),
                              type: "text",
                              content: "Comprehensive overview of the platform architecture, deployment pipelines, and quantitative performance metrics across cloud regions.",
                            },
                          ],
                        },
                        {
                          id: "slot-2",
                          widthFraction: "1fr",
                          blocks: [
                            {
                              id: "b-" + Math.random().toString(36).substring(2, 9),
                              type: "card_metric",
                              label: "GLOBAL UPTIME",
                              value: "99.98%",
                              change: "+0.15% MoM",
                              changeType: "positive",
                            },
                          ],
                        },
                      ],
                    })
                  }
                  className="w-full p-2.5 rounded-lg border border-slate-800 bg-slate-950/60 hover:bg-slate-950 hover:border-purple-500 text-left transition-all group"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-semibold text-slate-200">Split 2:1 (Main + KPI)</span>
                    <span className="text-[9px] font-mono bg-purple-500/20 text-purple-400 px-1.5 py-0.5 rounded">
                      2 : 1
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-1 p-1 bg-black/40 rounded border border-slate-800/80 mb-2">
                    <div className="col-span-2 h-6 bg-slate-700/60 rounded flex items-center justify-center text-[8px] font-mono text-slate-300">Feature Content</div>
                    <div className="h-6 bg-purple-600/30 rounded flex items-center justify-center text-[8px] font-mono text-purple-200 font-bold">KPI</div>
                  </div>
                  <div className="text-[10px] text-slate-500">Asymmetric layout pairing primary copy with a high-impact metric</div>
                </button>

                {/* 3. Hero 1:2:1 */}
                <button
                  onClick={() =>
                    onAddBlock({
                      id: "b-" + Math.random().toString(36).substring(2, 9),
                      type: "grid_layout",
                      presetId: "hero_1_2_1",
                      tracks: ["1fr", "2fr", "1fr"],
                      gutter: 12,
                      verticalAlign: "top",
                      slots: [
                        {
                          id: "slot-1",
                          widthFraction: "1fr",
                          blocks: [
                            {
                              id: "b-" + Math.random().toString(36).substring(2, 9),
                              type: "card_metric",
                              label: "EFFICIENCY",
                              value: "4.8x",
                              change: "Typst Engine",
                              changeType: "positive",
                            },
                          ],
                        },
                        {
                          id: "slot-2",
                          widthFraction: "2fr",
                          blocks: [
                            {
                              id: "b-" + Math.random().toString(36).substring(2, 9),
                              type: "heading",
                              level: 2,
                              align: "center",
                              text: "Core Innovation",
                              subtitle: "Precision Document Engineering",
                            },
                            {
                              id: "b-" + Math.random().toString(36).substring(2, 9),
                              type: "text",
                              content: "Built on high-performance vector rendering with full typographic hierarchy and zero runtime overhead.",
                              align: "center",
                            },
                          ],
                        },
                        {
                          id: "slot-3",
                          widthFraction: "1fr",
                          blocks: [
                            {
                              id: "b-" + Math.random().toString(36).substring(2, 9),
                              type: "card_metric",
                              label: "LATENCY",
                              value: "<12ms",
                              change: "WASM Native",
                              changeType: "positive",
                            },
                          ],
                        },
                      ],
                    })
                  }
                  className="w-full p-2.5 rounded-lg border border-slate-800 bg-slate-950/60 hover:bg-slate-950 hover:border-emerald-500 text-left transition-all group"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-semibold text-slate-200">Hero 1:2:1 (Balanced Showcase)</span>
                    <span className="text-[9px] font-mono bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded">
                      1 : 2 : 1
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-1 p-1 bg-black/40 rounded border border-slate-800/80 mb-2">
                    <div className="h-6 bg-emerald-600/30 rounded flex items-center justify-center text-[8px] font-mono text-emerald-200">Metric</div>
                    <div className="col-span-2 h-6 bg-slate-700/60 rounded flex items-center justify-center text-[8px] font-mono text-slate-300">Feature Text</div>
                    <div className="h-6 bg-emerald-600/30 rounded flex items-center justify-center text-[8px] font-mono text-emerald-200">Metric</div>
                  </div>
                  <div className="text-[10px] text-slate-500">Symmetrical 3-column layout framing editorial content between KPIs</div>
                </button>

                {/* 4. 3-Deck Equal Columns */}
                <button
                  onClick={() =>
                    onAddBlock({
                      id: "b-" + Math.random().toString(36).substring(2, 9),
                      type: "grid_layout",
                      presetId: "deck_3",
                      tracks: ["1fr", "1fr", "1fr"],
                      gutter: 12,
                      verticalAlign: "top",
                      slots: [
                        {
                          id: "slot-1",
                          widthFraction: "1fr",
                          blocks: [
                            {
                              id: "b-" + Math.random().toString(36).substring(2, 9),
                              type: "card",
                              title: "Phase 1: Discovery",
                              content: "Requirements gathering, user interviews, and constraint mapping.",
                            },
                          ],
                        },
                        {
                          id: "slot-2",
                          widthFraction: "1fr",
                          blocks: [
                            {
                              id: "b-" + Math.random().toString(36).substring(2, 9),
                              type: "card",
                              title: "Phase 2: Execution",
                              content: "Iterative sprints, unit testing, and continuous deployment validation.",
                            },
                          ],
                        },
                        {
                          id: "slot-3",
                          widthFraction: "1fr",
                          blocks: [
                            {
                              id: "b-" + Math.random().toString(36).substring(2, 9),
                              type: "card",
                              title: "Phase 3: Launch",
                              content: "Staged canary rollouts, telemetry monitoring, and SLA verification.",
                            },
                          ],
                        },
                      ],
                    })
                  }
                  className="w-full p-2.5 rounded-lg border border-slate-800 bg-slate-950/60 hover:bg-slate-950 hover:border-amber-500 text-left transition-all group"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-semibold text-slate-200">3-Deck Column Cards</span>
                    <span className="text-[9px] font-mono bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded">
                      1 : 1 : 1
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-1 p-1 bg-black/40 rounded border border-slate-800/80 mb-2">
                    <div className="h-6 bg-slate-700/60 rounded flex items-center justify-center text-[8px] font-mono text-slate-300">Col 1</div>
                    <div className="h-6 bg-slate-700/60 rounded flex items-center justify-center text-[8px] font-mono text-slate-300">Col 2</div>
                    <div className="h-6 bg-slate-700/60 rounded flex items-center justify-center text-[8px] font-mono text-slate-300">Col 3</div>
                  </div>
                  <div className="text-[10px] text-slate-500">Three uniform columns ideal for stages, pricing tiers, or features</div>
                </button>

                {/* 5. Sidebar + Main (30% / 70%) */}
                <button
                  onClick={() =>
                    onAddBlock({
                      id: "b-" + Math.random().toString(36).substring(2, 9),
                      type: "grid_layout",
                      presetId: "sidebar_main",
                      tracks: ["30%", "70%"],
                      gutter: 14,
                      verticalAlign: "top",
                      slots: [
                        {
                          id: "slot-1",
                          widthFraction: "30%",
                          blocks: [
                            {
                              id: "b-" + Math.random().toString(36).substring(2, 9),
                              type: "card_profile",
                              name: "Marcus Aurelius",
                              role: "Chief Architect",
                              bio: "Specializing in deterministic systems and typographic rigor.",
                              contact: "marcus@typst.io",
                            },
                          ],
                        },
                        {
                          id: "slot-2",
                          widthFraction: "70%",
                          blocks: [
                            {
                              id: "b-" + Math.random().toString(36).substring(2, 9),
                              type: "heading",
                              level: 2,
                              align: "left",
                              text: "Architectural Philosophy",
                            },
                            {
                              id: "b-" + Math.random().toString(36).substring(2, 9),
                              type: "text",
                              content: "Simplicity is the prerequisite for reliability. Every component follows strict data contracts and explicit typographic flow.",
                            },
                            {
                              id: "b-" + Math.random().toString(36).substring(2, 9),
                              type: "quote",
                              quote: "Quality is not an act, it is a habit.",
                              author: "Aristotle",
                            },
                          ],
                        },
                      ],
                    })
                  }
                  className="w-full p-2.5 rounded-lg border border-slate-800 bg-slate-950/60 hover:bg-slate-950 hover:border-cyan-500 text-left transition-all group"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-semibold text-slate-200">Sidebar + Main</span>
                    <span className="text-[9px] font-mono bg-cyan-500/20 text-cyan-400 px-1.5 py-0.5 rounded">
                      30% : 70%
                    </span>
                  </div>
                  <div className="grid grid-cols-10 gap-1 p-1 bg-black/40 rounded border border-slate-800/80 mb-2">
                    <div className="col-span-3 h-6 bg-cyan-600/30 rounded flex items-center justify-center text-[8px] font-mono text-cyan-200">Bio</div>
                    <div className="col-span-7 h-6 bg-slate-700/60 rounded flex items-center justify-center text-[8px] font-mono text-slate-300">Document Flow</div>
                  </div>
                  <div className="text-[10px] text-slate-500">Sidebar layout for resumes, technical manuals, and whitepapers</div>
                </button>
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

            {/* Themes & Palettes Tab */}
            {activeTab === "theme" && (
              <div className="space-y-4 font-mono text-xs">
                {/* 1. UI Themes */}
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-2">
                    Studio Interface Theme
                  </span>
                  <div className="space-y-1.5">
                    {allUIThemes.map((theme) => {
                      const isSelected = uiTheme === theme.id;
                      return (
                        <button
                          key={theme.id}
                          onClick={() => setUITheme(theme.id)}
                          className={`w-full text-left p-2 rounded-lg border transition-all flex items-center justify-between ${
                            isSelected
                              ? "bg-zinc-900 border-zinc-600 shadow-xs"
                              : "bg-zinc-950/60 border-zinc-850 hover:bg-zinc-900/60 hover:border-zinc-750"
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div
                              className="w-5 h-5 rounded border flex items-center justify-center shrink-0"
                              style={{
                                backgroundColor: theme.colors.bg,
                                borderColor: theme.colors.border,
                              }}
                            >
                              <div
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: theme.colors.accent }}
                              />
                            </div>
                            <div className="min-w-0">
                              <div className="font-semibold text-zinc-100 flex items-center gap-1.5 text-xs">
                                <span>{theme.name}</span>
                                {theme.isDark ? (
                                  <Moon className="w-3 h-3 text-zinc-500" />
                                ) : (
                                  <Sun className="w-3 h-3 text-amber-500" />
                                )}
                              </div>
                              <div className="text-[10px] text-zinc-400 truncate">
                                {theme.description}
                              </div>
                            </div>
                          </div>
                          {isSelected && <Check className="w-3.5 h-3.5 text-white shrink-0 ml-1.5" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Document Palettes */}
                <div className="pt-2 border-t border-zinc-850">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                      Document Design Palettes
                    </span>
                    <span className="text-[10px] text-zinc-500">{allPalettes.length} Palettes</span>
                  </div>

                  <div className="space-y-2">
                    {allPalettes.map((pal) => {
                      const isSelected = activePaletteId === pal.id;
                      return (
                        <div
                          key={pal.id}
                          onClick={() => {
                            setActivePaletteId(pal.id);
                            if (onApplyPaletteToDoc) {
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
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-semibold text-zinc-100 text-xs">
                              {pal.name}
                            </span>
                            {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                          </div>

                          <div className="flex items-center gap-1.5 my-1.5">
                            {pal.swatches.map((swatch, idx) => (
                              <div
                                key={idx}
                                title={`${swatch.label}: ${swatch.fill}`}
                                style={{
                                  backgroundColor: swatch.fill,
                                  borderColor: swatch.stroke,
                                }}
                                className="w-4 h-4 rounded border shadow-xs hover:scale-110 transition-transform"
                              />
                            ))}
                          </div>

                          <p className="text-[10px] text-zinc-400 leading-snug">
                            {pal.description}
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  {/* Apply Palette to Document */}
                  {onApplyPaletteToDoc && (
                    <div className="pt-3 mt-3 border-t border-zinc-850">
                      <button
                        onClick={() => {
                          const currentPal = getPalette(activePaletteId);
                          const updated = applyPaletteToDocument(currentPal, documentState);
                          onApplyPaletteToDoc(updated);
                          setPaletteAppliedToast(true);
                          setTimeout(() => setPaletteAppliedToast(false), 2200);
                        }}
                        className="w-full py-2 px-3 rounded-lg bg-white hover:bg-zinc-200 text-zinc-950 font-bold transition-all flex items-center justify-center gap-2 shadow-xs active:scale-[0.98]"
                      >
                        {paletteAppliedToast ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Palette Applied!</span>
                          </>
                        ) : (
                          <>
                            <Wand2 className="w-3.5 h-3.5" />
                            <span>Apply &quot;{activePalette.name}&quot; to Blocks</span>
                          </>
                        )}
                      </button>
                      <span className="text-[10px] text-zinc-500 block text-center mt-1">
                        Instantly harmonizes all cards, borders & accents
                      </span>
                    </div>
                  )}
                </div>
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
