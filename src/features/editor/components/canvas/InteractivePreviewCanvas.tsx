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
  TableBlock,
  CodeBlock,
  ImageBlock,
  ColumnsBlock,
  DividerBlock,
} from "@/types/document";
import { FloatingToolbar } from "../toolbar/FloatingToolbar";
import { AutoResizeTextarea } from "@/components/ui/AutoResizeTextarea";
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  FileCheck,
  Plus,
  Trash2,
  TrendingUp,
  TrendingDown,
  Minus,
  Sparkles,
  Columns as ColumnsIcon,
  Table as TableIcon,
  Code2,
  ImageIcon,
} from "lucide-react";

interface Props {
  documentState: DocumentState;
  selectedBlockId: string | null;
  onSelectBlock: (id: string | null) => void;
  onUpdateBlock: (blockId: string, updated: Partial<DocumentBlock>) => void;
  onDeleteBlock: (blockId: string) => void;
  onDuplicateBlock: (blockId: string) => void;
  onMoveUp: (blockId: string) => void;
  onMoveDown: (blockId: string) => void;
  onContextMenu: (e: React.MouseEvent, blockId: string) => void;
  onInsertBlockBelow: (targetBlockId: string) => void;
  onOpenInspector: () => void;
}

export function InteractivePreviewCanvas({
  documentState,
  selectedBlockId,
  onSelectBlock,
  onUpdateBlock,
  onDeleteBlock,
  onDuplicateBlock,
  onMoveUp,
  onMoveDown,
  onContextMenu,
  onInsertBlockBelow,
  onOpenInspector,
}: Props) {
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

  const handleBlockClick = (e: React.MouseEvent, blockId: string) => {
    e.stopPropagation();
    onSelectBlock(blockId);
  };

  const renderEditableBlock = (b: DocumentBlock) => {
    const isSelected = selectedBlockId === b.id;

    const blockTypeLabel = {
      heading: "Heading",
      text: "Text Paragraph",
      card: "Custom Card",
      card_callout: "Callout Banner",
      card_metric: "KPI Metric",
      card_profile: "Author Profile",
      columns: "Multi-Column",
      image: "Media Image",
      table: "Data Table",
      code: "Code Snippet",
      divider: "Divider",
    }[b.type] || b.type;

    let contentNode: React.ReactNode = null;

    switch (b.type) {
      // 1. Heading Block
      case "heading": {
        const h = b as HeadingBlock;
        const alignClass =
          h.align === "center" ? "text-center" : h.align === "right" ? "text-right" : "text-left";
        const levelStyle = {
          1: "text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 border-b border-slate-200 pb-2",
          2: "text-xl sm:text-2xl font-bold tracking-tight text-slate-850 border-b border-slate-100 pb-1.5",
          3: "text-lg sm:text-xl font-bold text-slate-800",
          4: "text-base font-semibold text-slate-700",
        }[h.level || 1] || "text-2xl font-bold text-slate-900";

        contentNode = (
          <div className={`${alignClass} space-y-1.5`} onClick={() => onSelectBlock(h.id)}>
            <AutoResizeTextarea
              value={h.text}
              onValueChange={(val) => onUpdateBlock(h.id, { text: val })}
              placeholder="Click to type heading..."
              className={`${levelStyle} leading-tight ${
                isSelected
                  ? "bg-blue-50/50 rounded px-1.5 py-0.5 ring-1 ring-blue-400"
                  : "hover:bg-slate-100/60 rounded px-1.5 py-0.5"
              }`}
            />

            {(h.subtitle !== undefined || isSelected) && (
              <AutoResizeTextarea
                value={h.subtitle || ""}
                onValueChange={(val) => onUpdateBlock(h.id, { subtitle: val })}
                placeholder="+ Add subtitle..."
                className={`text-xs sm:text-sm text-slate-500 font-normal leading-relaxed ${
                  isSelected
                    ? "bg-blue-50/40 rounded px-1.5 py-0.5 ring-1 ring-blue-300"
                    : "hover:bg-slate-100/60 rounded px-1.5 py-0.5"
                }`}
              />
            )}
          </div>
        );
        break;
      }

      // 2. Text Paragraph
      case "text": {
        const t = b as TextBlock;
        contentNode = (
          <div onClick={() => onSelectBlock(t.id)}>
            <AutoResizeTextarea
              value={t.content}
              onValueChange={(val) => onUpdateBlock(t.id, { content: val })}
              placeholder="Start writing text or descriptions..."
              className={`text-xs sm:text-sm leading-relaxed text-slate-700 font-normal ${
                isSelected
                  ? "bg-blue-50/50 rounded p-1.5 ring-1 ring-blue-400"
                  : "hover:bg-slate-100/60 rounded p-1.5"
              }`}
            />
          </div>
        );
        break;
      }

      // 3. Custom Card Block
      case "card": {
        const c = b as CardBlock;
        contentNode = (
          <div
            onClick={() => onSelectBlock(c.id)}
            style={{
              backgroundColor: c.fillColor || "#ffffff",
              borderColor: c.strokeColor || "#e2e8f0",
              borderWidth: `${c.strokeWidth ?? 1}px`,
              borderRadius: `${c.radius ?? 8}px`,
              padding: `${c.padding ?? 14}px`,
            }}
            className="border shadow-xs space-y-2 transition-all relative"
          >
            {/* Optional Badge */}
            {(c.badge !== undefined || isSelected) && (
              <div className="flex items-center">
                <input
                  type="text"
                  value={c.badge || ""}
                  onChange={(e) => onUpdateBlock(c.id, { badge: e.target.value })}
                  placeholder="+ Add Badge"
                  className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                    isSelected
                      ? "bg-blue-50 border-blue-400 text-blue-700 ring-1 ring-blue-300 outline-none"
                      : "bg-slate-100 border-slate-300 text-slate-600 hover:border-slate-400"
                  }`}
                />
              </div>
            )}

            {/* Card Title */}
            <AutoResizeTextarea
              value={c.title || ""}
              onValueChange={(val) => onUpdateBlock(c.id, { title: val })}
              placeholder="+ Card Title..."
              className={`font-bold text-sm sm:text-base text-slate-900 leading-snug ${
                isSelected
                  ? "bg-blue-50/60 rounded px-1.5 py-0.5 ring-1 ring-blue-400"
                  : "hover:bg-slate-100/40 rounded px-1.5 py-0.5"
              }`}
            />

            {/* Card Content Description */}
            <AutoResizeTextarea
              value={c.content || ""}
              onValueChange={(val) => onUpdateBlock(c.id, { content: val })}
              placeholder="Card description text..."
              className={`text-xs sm:text-sm text-slate-700 leading-relaxed font-normal ${
                isSelected
                  ? "bg-blue-50/50 rounded p-1.5 ring-1 ring-blue-400"
                  : "hover:bg-slate-100/40 rounded p-1.5"
              }`}
            />
          </div>
        );
        break;
      }

      // 4. Callout Banner
      case "card_callout": {
        const callout = b as CalloutCardBlock;
        const variantStyle = {
          note: "border-l-blue-500 bg-blue-50/80 text-blue-950",
          tip: "border-l-emerald-500 bg-emerald-50/80 text-emerald-950",
          warning: "border-l-amber-500 bg-amber-50/80 text-amber-950",
          caution: "border-l-rose-500 bg-rose-50/80 text-rose-950",
        }[callout.variant || "note"];

        contentNode = (
          <div
            onClick={() => onSelectBlock(callout.id)}
            className={`border-l-4 rounded-r-lg p-3 sm:p-4 text-xs space-y-2 transition-all ${variantStyle}`}
          >
            {/* Variant Selector pills when selected */}
            {isSelected && (
              <div className="flex items-center gap-1.5 pb-1 border-b border-black/10">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mr-1">
                  Type:
                </span>
                {(["note", "tip", "warning", "caution"] as const).map((v) => (
                  <button
                    key={v}
                    onClick={(e) => {
                      e.stopPropagation();
                      onUpdateBlock(callout.id, { variant: v });
                    }}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold capitalize transition-all ${
                      callout.variant === v
                        ? "bg-slate-900 text-white shadow-xs"
                        : "bg-white/70 hover:bg-white text-slate-700 border border-slate-300"
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            )}

            {/* Callout Title */}
            <AutoResizeTextarea
              value={callout.title}
              onValueChange={(val) => onUpdateBlock(callout.id, { title: val })}
              placeholder="Callout title..."
              className={`font-bold text-xs sm:text-sm text-slate-900 ${
                isSelected
                  ? "bg-white/80 rounded px-1.5 py-0.5 ring-1 ring-blue-400"
                  : "hover:bg-white/50 rounded px-1.5 py-0.5"
              }`}
            />

            {/* Callout Message */}
            <AutoResizeTextarea
              value={callout.message}
              onValueChange={(val) => onUpdateBlock(callout.id, { message: val })}
              placeholder="Callout note details and instructions..."
              className={`text-xs sm:text-sm leading-relaxed text-slate-800 font-normal ${
                isSelected
                  ? "bg-white/80 rounded p-1.5 ring-1 ring-blue-400"
                  : "hover:bg-white/50 rounded p-1.5"
              }`}
            />
          </div>
        );
        break;
      }

      // 5. KPI Metric Card
      case "card_metric": {
        const m = b as MetricCardBlock;
        contentNode = (
          <div
            onClick={() => onSelectBlock(m.id)}
            className="p-3.5 bg-slate-50/90 border border-slate-200/90 rounded-lg space-y-2 shadow-xs"
          >
            {/* KPI Label */}
            <AutoResizeTextarea
              value={m.label}
              onValueChange={(val) => onUpdateBlock(m.id, { label: val })}
              placeholder="KPI LABEL..."
              className={`text-[11px] font-bold uppercase tracking-wider text-slate-500 ${
                isSelected
                  ? "bg-blue-50/60 rounded px-1.5 py-0.5 ring-1 ring-blue-400"
                  : "hover:bg-slate-200/40 rounded px-1.5 py-0.5"
              }`}
            />

            {/* KPI Value */}
            <AutoResizeTextarea
              value={m.value}
              onValueChange={(val) => onUpdateBlock(m.id, { value: val })}
              placeholder="$0.00"
              className={`text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 ${
                isSelected
                  ? "bg-blue-50/60 rounded px-1.5 py-0.5 ring-1 ring-blue-400"
                  : "hover:bg-slate-200/40 rounded px-1.5 py-0.5"
              }`}
            />

            {/* Change Trend & Change Type */}
            <div className="flex items-center gap-2 pt-1 border-t border-slate-200/70">
              <AutoResizeTextarea
                value={m.change || ""}
                onValueChange={(val) => onUpdateBlock(m.id, { change: val })}
                placeholder="+0.0% vs last month"
                className={`text-xs font-semibold ${
                  m.changeType === "positive"
                    ? "text-emerald-600"
                    : m.changeType === "negative"
                    ? "text-rose-600"
                    : "text-slate-600"
                } ${
                  isSelected
                    ? "bg-blue-50/60 rounded px-1.5 py-0.5 ring-1 ring-blue-400"
                    : "hover:bg-slate-200/40 rounded px-1.5 py-0.5"
                }`}
              />

              {isSelected && (
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onUpdateBlock(m.id, { changeType: "positive" });
                    }}
                    title="Positive Trend"
                    className={`p-1 rounded text-xs ${
                      m.changeType === "positive"
                        ? "bg-emerald-600 text-white"
                        : "bg-slate-200 text-slate-600 hover:bg-slate-300"
                    }`}
                  >
                    <TrendingUp className="w-3 h-3" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onUpdateBlock(m.id, { changeType: "negative" });
                    }}
                    title="Negative Trend"
                    className={`p-1 rounded text-xs ${
                      m.changeType === "negative"
                        ? "bg-rose-600 text-white"
                        : "bg-slate-200 text-slate-600 hover:bg-slate-300"
                    }`}
                  >
                    <TrendingDown className="w-3 h-3" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onUpdateBlock(m.id, { changeType: "neutral" });
                    }}
                    title="Neutral"
                    className={`p-1 rounded text-xs ${
                      m.changeType === "neutral"
                        ? "bg-slate-700 text-white"
                        : "bg-slate-200 text-slate-600 hover:bg-slate-300"
                    }`}
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          </div>
        );
        break;
      }

      // 6. Author Profile Card
      case "card_profile": {
        const p = b as ProfileCardBlock;
        contentNode = (
          <div
            onClick={() => onSelectBlock(p.id)}
            className="p-4 bg-white border border-slate-200 rounded-lg space-y-2 shadow-xs transition-all"
          >
            <div className="flex items-start gap-3">
              {/* Profile Avatar */}
              <div className="w-11 h-11 rounded-full bg-blue-100 border border-blue-300 flex items-center justify-center font-bold text-blue-700 shrink-0 text-sm overflow-hidden">
                {p.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.avatarUrl} alt={p.name} className="w-full h-full object-cover" />
                ) : (
                  (p.name || "A").slice(0, 2).toUpperCase()
                )}
              </div>

              <div className="flex-1 space-y-1">
                {/* Full Name */}
                <AutoResizeTextarea
                  value={p.name}
                  onValueChange={(val) => onUpdateBlock(p.id, { name: val })}
                  placeholder="Author Full Name..."
                  className={`font-bold text-base text-slate-900 ${
                    isSelected
                      ? "bg-blue-50/60 rounded px-1.5 py-0.5 ring-1 ring-blue-400"
                      : "hover:bg-slate-100/60 rounded px-1.5 py-0.5"
                  }`}
                />

                {/* Role / Title */}
                <AutoResizeTextarea
                  value={p.role}
                  onValueChange={(val) => onUpdateBlock(p.id, { role: val })}
                  placeholder="Job Title / Role..."
                  className={`text-xs font-semibold text-blue-600 ${
                    isSelected
                      ? "bg-blue-50/60 rounded px-1.5 py-0.5 ring-1 ring-blue-400"
                      : "hover:bg-slate-100/60 rounded px-1.5 py-0.5"
                  }`}
                />
              </div>
            </div>

            {/* Bio Description */}
            <AutoResizeTextarea
              value={p.bio}
              onValueChange={(val) => onUpdateBlock(p.id, { bio: val })}
              placeholder="Biography or professional summary description..."
              className={`text-xs sm:text-sm text-slate-600 leading-relaxed ${
                isSelected
                  ? "bg-blue-50/50 rounded p-1.5 ring-1 ring-blue-400"
                  : "hover:bg-slate-100/60 rounded p-1.5"
              }`}
            />

            {/* Contact details */}
            <AutoResizeTextarea
              value={p.contact || ""}
              onValueChange={(val) => onUpdateBlock(p.id, { contact: val })}
              placeholder="alex@example.com • github.com/username • +1 (555) 019-2831"
              className={`text-[11px] text-slate-400 font-mono ${
                isSelected
                  ? "bg-blue-50/50 rounded px-1.5 py-0.5 ring-1 ring-blue-300"
                  : "hover:bg-slate-100/60 rounded px-1.5 py-0.5"
              }`}
            />
          </div>
        );
        break;
      }

      // 7. Multi-Column Layout
      case "columns": {
        const cols = b as ColumnsBlock;
        const gridColsClass = cols.columnsCount === 3 ? "grid-cols-3" : "grid-cols-2";
        contentNode = (
          <div className={`grid gap-3 ${gridColsClass}`}>
            {cols.columns.map((col, idx) => (
              <div
                key={idx}
                className="space-y-3 min-h-[50px] p-2 rounded border border-dashed border-slate-200/80 bg-slate-50/30"
              >
                {col.blocks.length === 0 ? (
                  <div className="text-[11px] text-slate-400 text-center py-4">Empty column</div>
                ) : (
                  col.blocks.map((innerB) => renderEditableBlock(innerB))
                )}
              </div>
            ))}
          </div>
        );
        break;
      }

      // 8. Media Image Block
      case "image": {
        const img = b as ImageBlock;
        contentNode = (
          <div onClick={() => onSelectBlock(img.id)} className="space-y-2 text-center">
            {img.url ? (
              <div className="relative inline-block max-w-full">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.url}
                  alt={img.alt || "preview"}
                  className="rounded object-contain border border-slate-200 shadow-xs max-h-72 mx-auto"
                  style={{ width: img.width || "80%" }}
                />
              </div>
            ) : (
              <div className="h-32 border border-dashed border-slate-300 rounded flex flex-col items-center justify-center text-xs text-slate-400 gap-1 bg-slate-50/50">
                <ImageIcon className="w-5 h-5 text-slate-400" />
                <span>Empty Image Block</span>
              </div>
            )}

            {/* Quick URL & size presets when selected */}
            {isSelected && (
              <div className="flex flex-wrap items-center justify-center gap-2 p-1.5 bg-slate-100/80 rounded border border-slate-200 text-xs">
                <input
                  type="text"
                  value={img.url}
                  onChange={(e) => onUpdateBlock(img.id, { url: e.target.value })}
                  placeholder="Paste Image URL (https://... or /uploads/...)"
                  className="bg-white border border-slate-300 rounded px-2 py-0.5 text-xs text-slate-800 w-56 outline-none focus:ring-1 focus:ring-blue-400"
                />
                <div className="flex items-center gap-1">
                  {(["50%", "75%", "100%"] as const).map((w) => (
                    <button
                      key={w}
                      onClick={() => onUpdateBlock(img.id, { width: w })}
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        img.width === w
                          ? "bg-blue-600 text-white"
                          : "bg-white border border-slate-300 text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      {w}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Image Caption */}
            <AutoResizeTextarea
              value={img.caption || ""}
              onValueChange={(val) => onUpdateBlock(img.id, { caption: val })}
              placeholder="+ Add image caption..."
              className={`text-[11px] italic text-slate-500 text-center ${
                isSelected
                  ? "bg-blue-50/50 rounded px-1.5 py-0.5 ring-1 ring-blue-300"
                  : "hover:bg-slate-100/50 rounded px-1.5 py-0.5"
              }`}
            />
          </div>
        );
        break;
      }

      // 9. Data Table Block
      case "table": {
        const tbl = b as TableBlock;

        const updateHeader = (colIdx: number, val: string) => {
          const newHeaders = [...tbl.headers];
          newHeaders[colIdx] = val;
          onUpdateBlock(tbl.id, { headers: newHeaders });
        };

        const updateCell = (rowIdx: number, colIdx: number, val: string) => {
          const newRows = tbl.rows.map((row, r) =>
            r === rowIdx ? row.map((cell, c) => (c === colIdx ? val : cell)) : row
          );
          onUpdateBlock(tbl.id, { rows: newRows });
        };

        const addRow = () => {
          const emptyRow = new Array(tbl.headers.length).fill("Data");
          onUpdateBlock(tbl.id, { rows: [...tbl.rows, emptyRow] });
        };

        const removeRow = () => {
          if (tbl.rows.length <= 1) return;
          onUpdateBlock(tbl.id, { rows: tbl.rows.slice(0, -1) });
        };

        const addColumn = () => {
          const newHeaders = [...tbl.headers, `Col ${tbl.headers.length + 1}`];
          const newRows = tbl.rows.map((row) => [...row, "Data"]);
          onUpdateBlock(tbl.id, { headers: newHeaders, rows: newRows });
        };

        const removeColumn = () => {
          if (tbl.headers.length <= 1) return;
          const newHeaders = tbl.headers.slice(0, -1);
          const newRows = tbl.rows.map((row) => row.slice(0, -1));
          onUpdateBlock(tbl.id, { headers: newHeaders, rows: newRows });
        };

        contentNode = (
          <div onClick={() => onSelectBlock(tbl.id)} className="space-y-2 my-2">
            {/* Caption */}
            <AutoResizeTextarea
              value={tbl.caption || ""}
              onValueChange={(val) => onUpdateBlock(tbl.id, { caption: val })}
              placeholder="Table: Description / Title..."
              className={`text-center text-xs font-semibold text-slate-700 ${
                isSelected
                  ? "bg-blue-50/60 rounded px-1.5 py-0.5 ring-1 ring-blue-300"
                  : "hover:bg-slate-100/50 rounded px-1.5 py-0.5"
              }`}
            />

            {/* Quick Table Manipulation Controls when selected */}
            {isSelected && (
              <div className="flex items-center justify-between bg-slate-100/90 border border-slate-300 rounded px-2.5 py-1 text-[11px] text-slate-700">
                <span className="font-bold flex items-center gap-1 text-slate-800">
                  <TableIcon className="w-3.5 h-3.5 text-blue-600" />
                  Table Grid ({tbl.rows.length} rows × {tbl.headers.length} cols)
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addRow();
                    }}
                    className="px-2 py-0.5 bg-blue-600 hover:bg-blue-700 text-white rounded font-bold transition-colors"
                  >
                    + Row
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeRow();
                    }}
                    disabled={tbl.rows.length <= 1}
                    className="px-2 py-0.5 bg-slate-200 hover:bg-slate-300 disabled:opacity-40 text-slate-800 rounded font-bold transition-colors"
                  >
                    - Row
                  </button>
                  <span className="text-slate-400">|</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addColumn();
                    }}
                    className="px-2 py-0.5 bg-blue-600 hover:bg-blue-700 text-white rounded font-bold transition-colors"
                  >
                    + Col
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeColumn();
                    }}
                    disabled={tbl.headers.length <= 1}
                    className="px-2 py-0.5 bg-slate-200 hover:bg-slate-300 disabled:opacity-40 text-slate-800 rounded font-bold transition-colors"
                  >
                    - Col
                  </button>
                </div>
              </div>
            )}

            {/* Editable Spreadsheet View */}
            <div className="overflow-x-auto border border-slate-200 rounded">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-200">
                    {tbl.headers.map((h, i) => (
                      <th key={i} className="p-1 border-r border-slate-200 font-bold text-slate-800">
                        <input
                          type="text"
                          value={h}
                          onChange={(e) => updateHeader(i, e.target.value)}
                          className="w-full bg-transparent font-bold text-slate-800 px-1 py-0.5 outline-none focus:bg-white focus:ring-1 focus:ring-blue-400 rounded"
                        />
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tbl.rows.map((row, rIdx) => (
                    <tr
                      key={rIdx}
                      className={`border-b border-slate-200 ${
                        tbl.isZebra && rIdx % 2 === 1 ? "bg-slate-50/60" : "bg-white"
                      }`}
                    >
                      {row.map((cell, cIdx) => (
                        <td key={cIdx} className="p-1 border-r border-slate-200">
                          <input
                            type="text"
                            value={cell}
                            onChange={(e) => updateCell(rIdx, cIdx, e.target.value)}
                            className="w-full bg-transparent text-slate-700 px-1 py-0.5 outline-none focus:bg-white focus:ring-1 focus:ring-blue-400 rounded"
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
        break;
      }

      // 10. Code Snippet Block
      case "code": {
        const code = b as CodeBlock;
        contentNode = (
          <div
            onClick={() => onSelectBlock(code.id)}
            className="rounded-lg border border-slate-800 bg-slate-950 text-slate-100 p-3 font-mono text-xs overflow-hidden shadow-md space-y-2"
          >
            {/* Monospace header bar */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 text-[11px] text-slate-400">
              <input
                type="text"
                value={code.filename || ""}
                onChange={(e) => onUpdateBlock(code.id, { filename: e.target.value })}
                placeholder="filename.typ"
                className="bg-slate-900 border border-slate-700 rounded px-1.5 py-0.5 text-blue-400 font-semibold outline-none focus:border-blue-500 w-40"
              />
              <input
                type="text"
                value={code.language || "typst"}
                onChange={(e) => onUpdateBlock(code.id, { language: e.target.value })}
                placeholder="typst"
                className="bg-slate-900 border border-slate-700 rounded px-1.5 py-0.5 text-slate-300 text-right uppercase text-[10px] outline-none focus:border-blue-500 w-20"
              />
            </div>

            {/* Code Body Textarea */}
            <AutoResizeTextarea
              value={code.code}
              onValueChange={(val) => onUpdateBlock(code.id, { code: val })}
              placeholder="// Write code here..."
              className="text-emerald-400 font-mono text-xs leading-relaxed bg-slate-900/60 rounded p-2 border border-slate-800/80 outline-none focus:border-blue-500"
            />
          </div>
        );
        break;
      }

      // 11. Divider Block
      case "divider": {
        const div = b as DividerBlock;
        contentNode = (
          <div onClick={() => onSelectBlock(div.id)} className="py-2.5">
            <hr
              style={{
                borderColor: div.color || "#cbd5e1",
                borderTopWidth: `${div.thickness || 1}px`,
                borderStyle: div.style || "solid",
              }}
            />
            {isSelected && (
              <div className="flex items-center justify-center gap-1.5 pt-1.5 text-[10px]">
                {(["solid", "dashed", "dotted"] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => onUpdateBlock(div.id, { style: s })}
                    className={`px-2 py-0.5 rounded capitalize ${
                      (div.style || "solid") === s
                        ? "bg-blue-600 text-white font-bold"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
        );
        break;
      }

      default:
        contentNode = null;
    }

    return (
      <div
        key={b.id}
        onClick={(e) => handleBlockClick(e, b.id)}
        onContextMenu={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onContextMenu(e, b.id);
        }}
        className={`group/paper-block relative rounded-md transition-all cursor-pointer ${
          isSelected
            ? "ring-2 ring-blue-500 ring-offset-2 ring-offset-white shadow-md z-20"
            : "hover:outline hover:outline-1 hover:outline-blue-400/60 hover:outline-dashed"
        } p-1`}
      >
        {/* Floating toolbar when selected */}
        {isSelected && (
          <FloatingToolbar
            block={b}
            onUpdate={(upd) => onUpdateBlock(b.id, upd)}
            onDuplicate={() => onDuplicateBlock(b.id)}
            onDelete={() => onDeleteBlock(b.id)}
            onMoveUp={() => onMoveUp(b.id)}
            onMoveDown={() => onMoveDown(b.id)}
            onOpenInspector={onOpenInspector}
          />
        )}

        {/* Canva element tag on hover */}
        <div className="absolute -top-3 left-1 opacity-0 group-hover/paper-block:opacity-100 transition-opacity z-10 pointer-events-none">
          <span className="text-[9px] font-bold bg-blue-600 text-white px-1.5 py-0.5 rounded shadow font-sans">
            {blockTypeLabel}
          </span>
        </div>

        {contentNode}

        {/* Quick insertion divider on hover below block */}
        <div className="relative group/divider-hover py-1 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="w-full border-t border-dashed border-blue-400/50" />
          <button
            onClick={(e) => {
              e.stopPropagation();
              onInsertBlockBelow(b.id);
            }}
            className="absolute bg-blue-600 hover:bg-blue-700 text-white rounded-full p-1 shadow-md hover:scale-110 transition-transform"
            title="Add Block Here"
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div
      onClick={() => onSelectBlock(null)}
      className="flex-1 bg-slate-950 flex flex-col h-full overflow-hidden select-none"
    >
      {/* Top Controls Bar */}
      <div className="h-11 border-b border-slate-800/80 px-4 flex items-center justify-between text-xs text-slate-400 bg-slate-900/70 backdrop-blur shrink-0">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-emerald-950/60 border border-emerald-800/50 text-emerald-400 px-2.5 py-1 rounded-full text-xs font-semibold">
            <FileCheck className="w-3.5 h-3.5" />
            <span>Interactive Sheet Canvas</span>
          </div>
          <span className="text-[11px] text-slate-500 font-mono hidden sm:inline">
            Directly edit titles, metrics, descriptions, profiles & tables on sheet
          </span>
        </div>

        {/* Zoom controller */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setZoom((z) => Math.max(50, z - 10))}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="font-mono text-xs w-11 text-center font-medium text-slate-300">
            {zoom}%
          </span>
          <button
            onClick={() => setZoom((z) => Math.min(150, z + 10))}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setZoom(100)}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            title="Reset Zoom to 100%"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Canva Workspace Scroll Area */}
      <div className="flex-1 overflow-auto p-6 sm:p-10 flex justify-center items-start bg-slate-950/90 relative">
        <div
          style={{
            transform: `scale(${zoom / 100})`,
            transformOrigin: "top center",
            transition: "transform 0.15s ease-out",
          }}
          className="transition-all my-2"
        >
          {/* Printable Document Paper Simulation */}
          <div
            style={{
              ...paperStyle,
              paddingTop: settings.margins.top,
              paddingBottom: settings.margins.bottom,
              paddingLeft: settings.margins.left,
              paddingRight: settings.margins.right,
              fontFamily: `${settings.font}, sans-serif`,
            }}
            className="bg-white text-slate-900 shadow-2xl rounded-sm border border-slate-300/80 flex flex-col justify-between relative cursor-default transition-all"
          >
            <div className="space-y-4">
              {blocks.map(renderEditableBlock)}
            </div>

            {settings.showPageNumbers && (
              <div className="text-center text-[10px] text-slate-400 pt-8 font-mono border-t border-slate-100 mt-6">
                Page 1 of 1
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
