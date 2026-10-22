"use client";

import React, { useRef } from "react";
import { BlockType, DocumentBlock } from "@/types/document";
import {
  Heading,
  Type,
  Square,
  AlertCircle,
  TrendingUp,
  User,
  Columns,
  Image as ImageIcon,
  Table as TableIcon,
  Code2,
  Minus,
  Upload,
  Plus,
} from "lucide-react";

interface Props {
  onAddBlock: (block: DocumentBlock) => void;
  onImportDocument?: (content: string) => void;
}

export function SidebarPalette({ onAddBlock, onImportDocument }: Props) {
  const uploadInputRef = useRef<HTMLInputElement>(null);

  const blockTemplates: {
    type: BlockType;
    label: string;
    description: string;
    icon: any;
    create: () => DocumentBlock;
  }[] = [
    {
      type: "card",
      label: "Custom Card",
      description: "Customizable box with fill, border & radius",
      icon: Square,
      create: () => ({
        id: "b-" + Math.random().toString(36).substring(2, 9),
        type: "card",
        title: "Feature Card",
        content: "Write your description or add list points here.",
        fillColor: "#1e293b",
        strokeColor: "#334155",
        strokeWidth: 1,
        radius: 8,
        padding: 14,
      }),
    },
    {
      type: "card_callout",
      label: "Callout / Alert",
      description: "Note, Tip, Warning, or Caution banner",
      icon: AlertCircle,
      create: () => ({
        id: "b-" + Math.random().toString(36).substring(2, 9),
        type: "card_callout",
        variant: "tip",
        title: "Pro Tip",
        message: "Highlight crucial insights or instructions.",
      }),
    },
    {
      type: "card_metric",
      label: "Metric / Stat",
      description: "KPI number with trend badge",
      icon: TrendingUp,
      create: () => ({
        id: "b-" + Math.random().toString(36).substring(2, 9),
        type: "card_metric",
        label: "Active Users",
        value: "24.8K",
        change: "+18% MoM",
        changeType: "positive",
      }),
    },
    {
      type: "card_profile",
      label: "Author / Profile",
      description: "Name, title, bio and contact badge",
      icon: User,
      create: () => ({
        id: "b-" + Math.random().toString(36).substring(2, 9),
        type: "card_profile",
        name: "Alex Morgan",
        role: "Systems Architect",
        bio: "Specializing in distributed infrastructure and document engines.",
        contact: "alex@example.com",
      }),
    },
    {
      type: "heading",
      label: "Heading / Title",
      description: "H1-H4 title with optional subtitle",
      icon: Heading,
      create: () => ({
        id: "b-" + Math.random().toString(36).substring(2, 9),
        type: "heading",
        level: 2,
        text: "New Section Title",
        subtitle: "Descriptive section subtitle",
        align: "left",
      }),
    },
    {
      type: "text",
      label: "Text Paragraph",
      description: "Markdown text, lists, and math equations",
      icon: Type,
      create: () => ({
        id: "b-" + Math.random().toString(36).substring(2, 9),
        type: "text",
        content: "This is a body text block. You can write paragraphs, bullet lists, or math equations.",
        align: "left",
      }),
    },
    {
      type: "columns",
      label: "2 Columns",
      description: "Side-by-side grid split container",
      icon: Columns,
      create: () => ({
        id: "b-" + Math.random().toString(36).substring(2, 9),
        type: "columns",
        columnsCount: 2,
        gutter: 14,
        columns: [
          {
            id: "col-1",
            blocks: [
              {
                id: "b-" + Math.random().toString(36).substring(2, 9),
                type: "card",
                title: "Left Column",
                content: "Content on the left side.",
                fillColor: "#1e293b",
                strokeColor: "#334155",
                padding: 12,
              },
            ],
          },
          {
            id: "col-2",
            blocks: [
              {
                id: "b-" + Math.random().toString(36).substring(2, 9),
                type: "card",
                title: "Right Column",
                content: "Content on the right side.",
                fillColor: "#1e293b",
                strokeColor: "#334155",
                padding: 12,
              },
            ],
          },
        ],
      }),
    },
    {
      type: "image",
      label: "Image / Media",
      description: "PNG, JPG, or SVG with caption",
      icon: ImageIcon,
      create: () => ({
        id: "b-" + Math.random().toString(36).substring(2, 9),
        type: "image",
        url: "",
        caption: "Figure caption",
        align: "center",
        width: "80%",
      }),
    },
    {
      type: "table",
      label: "Data Table",
      description: "Structured table grid or CSV import",
      icon: TableIcon,
      create: () => ({
        id: "b-" + Math.random().toString(36).substring(2, 9),
        type: "table",
        headers: ["Feature", "Standard", "Enterprise"],
        rows: [
          ["Live Preview", "WASM (<50ms)", "WASM (<50ms)"],
          ["PDF Compilation", "CLI Native", "Cluster High-Throughput"],
          ["Max Document Size", "Unlimited", "Unlimited"],
        ],
        caption: "Service Tier Comparison",
      }),
    },
    {
      type: "code",
      label: "Code Snippet",
      description: "Syntax highlighted code block",
      icon: Code2,
      create: () => ({
        id: "b-" + Math.random().toString(36).substring(2, 9),
        type: "code",
        language: "rust",
        code: `fn compile_typst(source: &str) -> Result<Vec<u8>, Box<dyn Error>> {\n    // Native Typst compiler invocation\n    typst::compile(source)\n}`,
        filename: "compiler.rs",
      }),
    },
    {
      type: "divider",
      label: "Divider Line",
      description: "Clean separation rule",
      icon: Minus,
      create: () => ({
        id: "b-" + Math.random().toString(36).substring(2, 9),
        type: "divider",
        style: "solid",
        spacing: 12,
      }),
    },
  ];

  const handleGenericFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

  return (
    <div className="w-64 border-r border-zinc-850 bg-[#09090b] p-4 flex flex-col gap-4 overflow-y-auto shrink-0 select-none">
      <div>
        <h3 className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">
          Component Palette
        </h3>
        <p className="text-[11px] text-zinc-500 font-mono mt-0.5">
          Click or drop to add to canvas
        </p>
      </div>

      {/* Upload button */}
      <div>
        <button
          onClick={() => uploadInputRef.current?.click()}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-zinc-800 text-zinc-200 text-xs font-mono transition-colors"
        >
          <Upload className="w-3.5 h-3.5 text-zinc-400" />
          <span>Upload Asset / CSV</span>
        </button>
        <input
          ref={uploadInputRef}
          type="file"
          accept="image/*,.csv,.md,.typ,.txt"
          onChange={handleGenericFileUpload}
          className="hidden"
        />
      </div>

      <div className="space-y-1.5">
        {blockTemplates.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.label}
              onClick={() => onAddBlock(item.create())}
              className="w-full text-left p-2.5 rounded-lg border border-zinc-850 bg-zinc-950/60 hover:bg-zinc-900 hover:border-zinc-700 transition-all flex items-center gap-3 group/item cursor-pointer"
            >
              <div className="p-2 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-300 group-hover/item:text-white group-hover/item:bg-zinc-800 transition-colors">
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium text-zinc-200 group-hover/item:text-white flex items-center justify-between">
                  <span>{item.label}</span>
                  <Plus className="w-3 h-3 text-zinc-500 opacity-0 group-hover/item:opacity-100 transition-opacity" />
                </div>
                <div className="text-[10px] text-zinc-500 truncate font-mono">
                  {item.description}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
