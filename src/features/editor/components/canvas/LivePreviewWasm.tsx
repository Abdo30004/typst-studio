"use client";

import React, { useState } from "react";
import { DocumentState, DocumentBlock } from "@/types/document";
import { ZoomIn, ZoomOut, Maximize2, FileCheck } from "lucide-react";

interface Props {
  documentState: DocumentState;
}

export function LivePreviewWasm({ documentState }: Props) {
  const [zoom, setZoom] = useState<number>(100);

  const { settings, blocks } = documentState;
  const isLandscape = settings.orientation === "landscape";
  const paper = settings.paper;

  // Paper styling
  const paperStyle = {
    a4: isLandscape
      ? { width: "297mm", minHeight: "210mm" }
      : { width: "210mm", minHeight: "297mm" },
    "us-letter": isLandscape
      ? { width: "11in", minHeight: "8.5in" }
      : { width: "8.5in", minHeight: "11in" },
    "presentation-16-9": { width: "280mm", minHeight: "157.5mm" },
  }[paper] || { width: "210mm", minHeight: "297mm" };

  const renderPreviewBlock = (b: DocumentBlock) => {
    switch (b.type) {
      case "heading": {
        const h = b as any;
        const Tag = h.level === 1 ? "h1" : h.level === 2 ? "h2" : h.level === 3 ? "h3" : "h4";
        const levelKey = (h.level || 1) as 1 | 2 | 3 | 4;
        const sizeClass = {
          1: "text-2xl font-bold tracking-tight text-slate-900 border-b border-slate-200 pb-1.5",
          2: "text-xl font-bold text-slate-800",
          3: "text-lg font-semibold text-slate-800",
          4: "text-base font-semibold text-slate-700",
        }[levelKey] || "text-xl font-bold text-slate-800";
        const align = h.align === "center" ? "text-center" : h.align === "right" ? "text-right" : "text-left";

        return (
          <div key={b.id} className={`${align} space-y-1`}>
            <Tag className={sizeClass}>{h.text}</Tag>
            {h.subtitle && <p className="text-xs text-slate-500">{h.subtitle}</p>}
          </div>
        );
      }

      case "text": {
        const t = b as any;
        return (
          <div key={b.id} className="text-xs leading-relaxed text-slate-700 whitespace-pre-wrap">
            {t.content}
          </div>
        );
      }

      case "card": {
        const c = b as any;
        return (
          <div
            key={b.id}
            style={{
              backgroundColor: c.fillColor || "#ffffff",
              borderColor: c.strokeColor || "#e2e8f0",
              borderWidth: `${c.strokeWidth ?? 1}px`,
              borderRadius: `${c.radius ?? 6}px`,
              padding: `${c.padding ?? 12}px`,
            }}
            className="border shadow-xs space-y-1.5"
          >
            {c.title && <h4 className="font-bold text-sm text-slate-900">{c.title}</h4>}
            <div className="text-xs text-slate-700 whitespace-pre-wrap leading-relaxed">
              {c.content}
            </div>
          </div>
        );
      }

      case "card_callout": {
        const callout = b as any;
        const variantKey = (callout.variant || "note") as "note" | "tip" | "warning" | "caution";
        const borderStyle = {
          note: "border-l-blue-500 bg-blue-50/60 text-blue-900",
          tip: "border-l-emerald-500 bg-emerald-50/60 text-emerald-900",
          warning: "border-l-amber-500 bg-amber-50/60 text-amber-900",
          caution: "border-l-rose-500 bg-rose-50/60 text-rose-900",
        }[variantKey] || "border-l-blue-500 bg-blue-50/60 text-blue-900";

        return (
          <div
            key={b.id}
            className={`border-l-4 rounded-r-md p-3 text-xs space-y-1 ${borderStyle}`}
          >
            <div className="font-bold text-xs">{callout.title}</div>
            <div className="text-xs leading-relaxed opacity-90">{callout.message}</div>
          </div>
        );
      }

      case "card_metric": {
        const m = b as any;
        return (
          <div
            key={b.id}
            className="p-3 bg-slate-50 border border-slate-200 rounded-md space-y-1"
          >
            <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
              {m.label}
            </div>
            <div className="text-2xl font-bold text-slate-900 tracking-tight">{m.value}</div>
            {m.change && (
              <div
                className={`text-[11px] font-semibold ${
                  m.changeType === "positive"
                    ? "text-emerald-600"
                    : m.changeType === "negative"
                    ? "text-rose-600"
                    : "text-slate-500"
                }`}
              >
                {m.change}
              </div>
            )}
          </div>
        );
      }

      case "card_profile": {
        const p = b as any;
        return (
          <div
            key={b.id}
            className="p-3.5 bg-white border border-slate-200 rounded-md space-y-1.5"
          >
            <div className="font-bold text-base text-slate-900">{p.name}</div>
            <div className="text-xs font-semibold text-blue-600">{p.role}</div>
            <div className="text-xs text-slate-600 leading-relaxed">{p.bio}</div>
            {p.contact && (
              <div className="text-[11px] text-slate-400 font-mono pt-1">{p.contact}</div>
            )}
          </div>
        );
      }

      case "columns": {
        const cols = b as any;
        const gridColsClass = cols.columnsCount === 3 ? "grid-cols-3" : "grid-cols-2";
        return (
          <div key={b.id} className={`grid gap-3 ${gridColsClass}`}>
            {cols.columns.map((c: any, idx: number) => (
              <div key={idx} className="space-y-3">
                {c.blocks.map(renderPreviewBlock)}
              </div>
            ))}
          </div>
        );
      }

      case "image": {
        const img = b as any;
        if (!img.url) return null;
        return (
          <div key={b.id} className="text-center space-y-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={img.url}
              alt={img.alt || "preview"}
              className="inline-block max-h-64 rounded object-contain border border-slate-200"
              style={{ width: img.width || "80%" }}
            />
            {img.caption && (
              <p className="text-[11px] italic text-slate-500">{img.caption}</p>
            )}
          </div>
        );
      }

      case "table": {
        const tbl = b as any;
        return (
          <div key={b.id} className="space-y-1 my-2">
            {tbl.caption && (
              <div className="text-center text-xs font-semibold text-slate-600">
                Table: {tbl.caption}
              </div>
            )}
            <table className="w-full text-left text-xs border border-slate-200 border-collapse">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-200">
                  {tbl.headers.map((h: string, i: number) => (
                    <th key={i} className="p-2 font-bold text-slate-800 border-r border-slate-200">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tbl.rows.map((row: string[], rIdx: number) => (
                  <tr key={rIdx} className="border-b border-slate-200 hover:bg-slate-50/50">
                    {row.map((cell: string, cIdx: number) => (
                      <td key={cIdx} className="p-2 text-slate-700 border-r border-slate-200">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      }

      case "code": {
        const code = b as any;
        return (
          <div key={b.id} className="rounded border border-slate-200 bg-slate-900 text-slate-100 p-3 font-mono text-xs overflow-x-auto">
            {code.filename && (
              <div className="text-[10px] text-slate-400 border-b border-slate-800 pb-1 mb-2 font-semibold">
                {code.filename}
              </div>
            )}
            <pre className="whitespace-pre">{code.code}</pre>
          </div>
        );
      }

      case "divider": {
        return <hr key={b.id} className="border-slate-200 my-3" />;
      }

      default:
        return null;
    }
  };

  return (
    <div
      className="flex-1 flex flex-col h-full overflow-hidden transition-colors duration-150"
      style={{ backgroundColor: "var(--theme-desk)" }}
    >
      {/* Top Controls Bar */}
      <div
        className="h-10 border-b px-4 flex items-center justify-between text-xs select-none transition-colors duration-150"
        style={{
          backgroundColor: "var(--theme-panel)",
          borderColor: "var(--theme-border)",
          color: "var(--theme-text-primary)",
        }}
      >
        <div className="flex items-center gap-2 font-mono">
          <FileCheck className="w-3.5 h-3.5 text-zinc-300" />
          <span className="font-semibold text-zinc-200">Live Typst Preview</span>
          <span className="text-[11px] bg-zinc-900 border border-zinc-800 text-zinc-400 px-2 py-0.5 rounded">
            {paper.toUpperCase()} ({settings.orientation})
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setZoom((z) => Math.max(50, z - 10))}
            className="p-1 rounded hover:bg-zinc-850 text-zinc-400 hover:text-white"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="font-mono text-[11px] w-10 text-center text-zinc-300">{zoom}%</span>
          <button
            onClick={() => setZoom((z) => Math.min(150, z + 10))}
            className="p-1 rounded hover:bg-zinc-850 text-zinc-400 hover:text-white"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setZoom(100)}
            className="p-1 rounded hover:bg-zinc-850 text-zinc-400 hover:text-white"
            title="Reset Zoom"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Scaled Preview Canvas Wrapper */}
      <div
        className="flex-1 overflow-auto p-8 flex justify-center items-start transition-colors duration-150"
        style={{ backgroundColor: "var(--theme-desk)" }}
      >
        <div
          style={{
            transform: `scale(${zoom / 100})`,
            transformOrigin: "top center",
            transition: "transform 0.15s ease-out",
          }}
          className="shadow-2xl rounded-sm transition-all"
        >
          {/* Printable Typst Page Simulation */}
          <div
            style={{
              ...paperStyle,
              paddingTop: settings.margins.top,
              paddingBottom: settings.margins.bottom,
              paddingLeft: settings.margins.left,
              paddingRight: settings.margins.right,
              fontFamily: `${settings.font}, sans-serif`,
            }}
            className="bg-white text-slate-900 shadow-xl flex flex-col justify-between"
          >
            <div className="space-y-4">
              {blocks.map(renderPreviewBlock)}
            </div>

            {settings.showPageNumbers && (
              <div className="text-center text-[10px] text-slate-400 pt-8 font-mono">
                Page 1 of 1
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
