"use client";

import React, { useState } from "react";
import {
  DocumentState,
  DocumentBlock,
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
} from "@/types/document";
import { CALLOUT_THEMES, getContrastingText, isColorDark } from "@/lib/typst/document-theme";
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
        const h = b as HeadingBlock;
        const Tag = h.level === 1 ? "h1" : h.level === 2 ? "h2" : h.level === 3 ? "h3" : "h4";
        const levelKey = (h.level || 1) as 1 | 2 | 3 | 4;
        const sizeClass = {
          1: "text-2xl font-bold tracking-tight text-slate-900 pb-1.5",
          2: "text-xl font-bold text-slate-800",
          3: "text-lg font-semibold text-slate-800",
          4: "text-base font-semibold text-slate-700",
        }[levelKey] || "text-xl font-bold text-slate-800";
        const align = h.align === "center" ? "text-center" : h.align === "right" ? "text-right" : "text-left";

        return (
          <div key={b.id} className={`${align} space-y-1`}>
            <Tag className={sizeClass}>{h.text}</Tag>
            {h.level === 1 && (
              <div
                className="h-[2px] w-full rounded-full"
                style={{ backgroundColor: settings.accentColor || "#0f172a" }}
              />
            )}
            {h.subtitle && <p className="text-xs text-[#64748b]">{h.subtitle}</p>}
          </div>
        );
      }

      case "text": {
        const t = b as TextBlock;
        return (
          <div key={b.id} className="text-xs leading-relaxed text-[#334155] whitespace-pre-wrap">
            {t.content}
          </div>
        );
      }

      case "card": {
        const c = b as CardBlock;
        const fill = c.fillColor || "#ffffff";
        const stroke = c.strokeColor || "#e2e8f0";
        const titleColor = getContrastingText(fill);
        const bodyColor = isColorDark(fill) ? "#e2e8f0" : "#334155";
        const badgeBg = c.badgeBg || (isColorDark(fill) ? "#ffffff" : (settings.accentColor || "#0f172a"));
        const badgeText = c.badgeText || (isColorDark(fill) ? "#0f172a" : "#ffffff");

        return (
          <div
            key={b.id}
            style={{
              backgroundColor: fill,
              borderColor: stroke,
              borderWidth: `${c.strokeWidth ?? 1}px`,
              borderRadius: `${c.radius ?? 8}px`,
              padding: `${c.padding ?? 14}px`,
            }}
            className="border shadow-xs space-y-1.5"
          >
            {c.badge && (
              <div className="flex items-center">
                <span
                  style={{ backgroundColor: badgeBg, color: badgeText }}
                  className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full border border-black/10 shadow-xs"
                >
                  {c.badge}
                </span>
              </div>
            )}
            {c.title && (
              <h4 className="font-bold text-sm" style={{ color: titleColor }}>
                {c.title}
              </h4>
            )}
            <div className="text-xs whitespace-pre-wrap leading-relaxed" style={{ color: bodyColor }}>
              {c.content}
            </div>
          </div>
        );
      }

      case "card_callout": {
        const callout = b as CalloutCardBlock;
        const base = CALLOUT_THEMES[callout.variant] || CALLOUT_THEMES.note;
        const bg = callout.bgColor || base.bg;
        const border = callout.borderColor || (callout.variant === "note" ? (settings.accentColor || base.border) : base.border);
        const titleColor = callout.textColor || (callout.variant === "note" ? (settings.accentColor || base.text) : base.text);

        return (
          <div
            key={b.id}
            style={{
              backgroundColor: bg,
              borderLeftColor: border,
              borderLeftWidth: "4px",
            }}
            className="rounded-r-md p-3 text-xs space-y-1 border border-black/5 shadow-xs"
          >
            <div className="font-bold text-xs" style={{ color: titleColor }}>{callout.title}</div>
            <div className="text-xs leading-relaxed" style={{ color: base.body }}>{callout.message}</div>
          </div>
        );
      }

      case "card_metric": {
        const m = b as MetricCardBlock;
        const fill = m.fillColor || "#f8fafc";
        const stroke = m.strokeColor || "#e2e8f0";
        const valueColor = settings.accentColor || "#0f172a";
        const badgeColor =
          m.changeType === "positive"
            ? "#16a34a"
            : m.changeType === "negative"
            ? "#dc2626"
            : "#64748b";

        return (
          <div
            key={b.id}
            style={{
              backgroundColor: fill,
              borderColor: stroke,
            }}
            className="p-3.5 border rounded-md space-y-1 shadow-xs"
          >
            <div className="text-[11px] font-mono font-medium uppercase tracking-wider text-[#64748b]">
              {m.label}
            </div>
            <div className="text-2xl font-mono font-bold tracking-tight" style={{ color: valueColor }}>
              {m.value}
            </div>
            {m.change && (
              <div
                className="text-xs font-mono font-medium pt-1 border-t border-black/5"
                style={{ color: badgeColor }}
              >
                {m.change}
              </div>
            )}
          </div>
        );
      }

      case "card_profile": {
        const p = b as ProfileCardBlock;
        const fill = p.fillColor || "#ffffff";
        const stroke = p.strokeColor || "#e2e8f0";
        const roleColor = p.roleColor || settings.accentColor || "#0f172a";

        return (
          <div
            key={b.id}
            style={{
              backgroundColor: fill,
              borderColor: stroke,
            }}
            className="p-3.5 border rounded-md space-y-1.5 shadow-xs"
          >
            <div className="font-bold text-base text-[#0f172a]">{p.name}</div>
            <div className="text-xs font-mono font-medium" style={{ color: roleColor }}>{p.role}</div>
            <div className="text-xs text-[#334155] leading-relaxed">{p.bio}</div>
            {p.contact && (
              <div className="text-[11px] text-[#64748b] font-mono pt-1">{p.contact}</div>
            )}
          </div>
        );
      }

      case "columns": {
        const cols = b as ColumnsBlock;
        const gridColsClass = cols.columnsCount === 3 ? "grid-cols-3" : "grid-cols-2";
        return (
          <div key={b.id} className={`grid gap-3 ${gridColsClass}`}>
            {cols.columns.map((c, idx) => (
              <div key={idx} className="space-y-3">
                {c.blocks.map(renderPreviewBlock)}
              </div>
            ))}
          </div>
        );
      }

      case "image": {
        const img = b as ImageBlock;
        if (!img.url) return null;
        return (
          <div key={b.id} className="text-center space-y-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={img.url}
              alt={img.caption || "preview"}
              className="inline-block max-h-64 rounded object-contain border border-slate-200"
              style={{ width: img.width || "80%" }}
            />
            {img.caption && (
              <p className="text-[11px] italic text-[#64748b]">{img.caption}</p>
            )}
          </div>
        );
      }

      case "table": {
        const tbl = b as TableBlock;
        const tableBorder = tbl.borderColor || "#cbd5e1";
        const headerBg = tbl.headerBg || "#f1f5f9";
        const headerColor = tbl.headerColor || "#0f172a";

        return (
          <div key={b.id} className="space-y-1 my-2">
            {tbl.caption && (
              <div className="text-center text-xs font-semibold text-[#0f172a]">
                Table: {tbl.caption}
              </div>
            )}
            <table
              className="w-full text-left text-xs border border-collapse"
              style={{ borderColor: tableBorder }}
            >
              <thead>
                <tr
                  className="border-b"
                  style={{
                    backgroundColor: headerBg,
                    borderColor: tableBorder,
                  }}
                >
                  {tbl.headers.map((h, i) => (
                    <th
                      key={i}
                      className="p-2 font-mono font-semibold border-r"
                      style={{
                        borderColor: tableBorder,
                        color: headerColor,
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tbl.rows.map((row, rIdx) => (
                  <tr
                    key={rIdx}
                    className="border-b"
                    style={{
                      backgroundColor: tbl.isZebra && rIdx % 2 === 1 ? (tbl.headerBg ? tbl.headerBg + "40" : "#f8fafc") : "#ffffff",
                      borderColor: tableBorder,
                    }}
                  >
                    {row.map((cell, cIdx) => (
                      <td
                        key={cIdx}
                        className="p-2 text-[#334155] border-r"
                        style={{ borderColor: tableBorder }}
                      >
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
        const code = b as CodeBlock;
        return (
          <div key={b.id} className="rounded border border-zinc-800 bg-[#09090b] text-zinc-100 p-3 font-mono text-xs overflow-x-auto shadow-xs">
            {code.filename && (
              <div className="text-[10px] text-zinc-400 border-b border-zinc-800 pb-1 mb-2 font-semibold">
                {code.filename}
              </div>
            )}
            <pre className="whitespace-pre">{code.code}</pre>
          </div>
        );
      }

      case "divider": {
        const div = b as DividerBlock;
        const color = div.color || settings.accentColor || "#e2e8f0";
        return (
          <hr
            key={b.id}
            style={{
              borderColor: color,
              borderTopWidth: `${div.thickness || 1}px`,
              borderStyle: div.style || "solid",
            }}
            className="my-3"
          />
        );
      }

      case "grid_layout": {
        const g = b as GridLayoutBlock;
        const tracks = g.tracks && g.tracks.length > 0 ? g.tracks : ["1fr", "1fr"];
        const gridTemplateColumns = tracks.join(" ");
        const alignItems =
          g.verticalAlign === "center"
            ? "center"
            : g.verticalAlign === "bottom"
            ? "flex-end"
            : "flex-start";

        return (
          <div
            key={b.id}
            style={{
              display: "grid",
              gridTemplateColumns,
              gap: `${g.gutter ?? 12}pt`,
              alignItems,
            }}
            className="w-full"
          >
            {(g.slots || []).map((slot, sIdx) => (
              <div key={slot.id || sIdx} className="space-y-3 min-w-0">
                {(slot.blocks || []).map((childBlock) => renderPreviewBlock(childBlock))}
              </div>
            ))}
          </div>
        );
      }

      case "quote": {
        const q = b as QuoteBlock;
        const border = q.borderColor || settings.accentColor || "#0f172a";
        const bg = q.bgColor || "#f8fafc";
        const text = q.textColor || "#334155";

        return (
          <blockquote
            key={b.id}
            style={{
              backgroundColor: bg,
              borderLeftColor: border,
              borderLeftWidth: "4px",
              color: text,
            }}
            className="p-3.5 rounded-r-md shadow-xs space-y-1.5"
          >
            <p className="italic text-xs sm:text-sm font-serif leading-relaxed">
              &ldquo;{q.quote}&rdquo;
            </p>
            {q.author && (
              <p className="text-[11px] text-right font-medium text-slate-900">
                — {q.author}
                {q.citation && <span className="text-slate-500 font-normal">, {q.citation}</span>}
              </p>
            )}
          </blockquote>
        );
      }

      case "key_value": {
        const kv = b as KeyValueBlock;
        const colsClass =
          kv.columnsCount === 3
            ? "grid-cols-3"
            : kv.columnsCount === 4
            ? "grid-cols-4"
            : "grid-cols-2";

        return (
          <div key={b.id} className="space-y-1.5">
            {kv.title && <div className="text-xs font-bold text-slate-900">{kv.title}</div>}
            <div className={`grid gap-2 ${colsClass}`}>
              {kv.items.map((item) => (
                <div
                  key={item.id}
                  className="bg-slate-50 border border-slate-200 rounded p-2 text-xs"
                >
                  <div className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">
                    {item.key}
                  </div>
                  <div className="font-semibold text-slate-900 mt-0.5 truncate">{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        );
      }

      case "timeline": {
        const tl = b as TimelineBlock;
        const isHorizontal = tl.orientation === "horizontal";
        const accent = settings.accentColor || "#0f172a";

        return (
          <div key={b.id} className="space-y-2">
            {tl.title && <div className="text-xs font-bold text-slate-900">{tl.title}</div>}
            {isHorizontal ? (
              <div
                className="grid gap-3"
                style={{ gridTemplateColumns: `repeat(${Math.max(1, tl.steps.length)}, 1fr)` }}
              >
                {tl.steps.map((step) => (
                  <div key={step.id} className="space-y-1 text-xs">
                    <span
                      style={{ backgroundColor: accent }}
                      className="inline-block text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded-full"
                    >
                      {step.stepNumber}
                    </span>
                    <div className="font-bold text-slate-900">{step.title}</div>
                    {step.date && <div className="text-[10px] text-slate-500">{step.date}</div>}
                    <div className="text-[11px] text-slate-600 leading-normal">
                      {step.description}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-2.5">
                {tl.steps.map((step) => (
                  <div key={step.id} className="flex items-start gap-2.5 text-xs">
                    <span
                      style={{ backgroundColor: accent }}
                      className="shrink-0 text-white text-[10px] font-mono font-bold w-6 h-6 flex items-center justify-center rounded-full mt-0.5"
                    >
                      {step.stepNumber}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-2">
                        <span className="font-bold text-slate-900">{step.title}</span>
                        {step.date && <span className="text-[10px] text-slate-500">({step.date})</span>}
                      </div>
                      <div className="text-[11px] text-slate-600 mt-0.5">{step.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      }

      case "signature": {
        const sig = b as SignatureBlock;
        const cols = Math.max(1, sig.parties.length);

        return (
          <div key={b.id} className="flex items-center gap-6 pt-3">
            <div
              className="flex-1 grid gap-6"
              style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
            >
              {sig.parties.map((p) => (
                <div key={p.id} className="text-xs space-y-1 pt-6 border-t border-slate-400">
                  <div className="font-bold text-slate-900">{p.name}</div>
                  <div className="text-slate-600 text-[11px]">{p.title}</div>
                  <div className="text-slate-400 text-[10px] font-mono">Role: {p.role}</div>
                  {p.date && <div className="text-slate-400 text-[10px] font-mono">Date: {p.date}</div>}
                </div>
              ))}
            </div>
            {sig.hasSealBox && (
              <div className="w-20 h-20 border border-dashed border-slate-300 rounded flex flex-col items-center justify-center text-[10px] text-slate-400 font-mono text-center shrink-0">
                <span>OFFICIAL</span>
                <span>SEAL</span>
              </div>
            )}
          </div>
        );
      }

      case "tags": {
        const tb = b as TagsBlock;
        return (
          <div key={b.id} className="flex flex-wrap items-center gap-1.5 text-xs">
            {tb.category && (
              <span className="text-[11px] font-bold text-slate-500 font-mono mr-1">
                {tb.category}:
              </span>
            )}
            {tb.tags.map((t) => {
              const bg = t.color || "#e0f2fe";
              const text = isColorDark(bg) ? "#ffffff" : "#0369a1";
              return (
                <span
                  key={t.id}
                  style={{ backgroundColor: bg, color: text }}
                  className="px-2.5 py-0.5 rounded-full text-[11px] font-medium"
                >
                  {t.label}
                </span>
              );
            })}
          </div>
        );
      }

      case "math": {
        const m = b as MathBlock;
        return (
          <div key={b.id} className="my-2 text-center">
            <div className="flex items-center justify-center relative py-1 px-4 bg-slate-50 rounded border border-slate-200">
              <span className="font-mono text-xs sm:text-sm text-slate-900 italic tracking-wider">
                {m.formula}
              </span>
              {m.equationNumber && (
                <span className="absolute right-3 text-xs font-mono text-slate-400">
                  ({m.equationNumber})
                </span>
              )}
            </div>
            {m.caption && (
              <p className="text-[10px] text-slate-500 italic mt-1 font-mono">{m.caption}</p>
            )}
          </div>
        );
      }

      case "progress": {
        const p = b as ProgressBlock;
        const color = p.color || settings.accentColor || "#0f172a";
        const clamped = Math.max(0, Math.min(100, p.percentage));

        return (
          <div key={b.id} className="space-y-1 text-xs">
            <div className="flex items-center justify-between font-mono">
              <span className="font-semibold text-slate-800">{p.label}</span>
              <span style={{ color }} className="font-bold">
                {clamped}%{p.target ? ` of ${p.target}` : ""}
              </span>
            </div>
            <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
              <div
                style={{ width: `${clamped}%`, backgroundColor: color }}
                className="h-full rounded-full transition-all duration-300"
              />
            </div>
          </div>
        );
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
            className="document-paper-sheet bg-white text-slate-900 shadow-xl flex flex-col justify-between"
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
