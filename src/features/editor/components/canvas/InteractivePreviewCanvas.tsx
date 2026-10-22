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
import { useTheme } from "@/lib/theme";
import { isColorDark, getContrastingText, CALLOUT_THEMES } from "@/lib/typst/document-theme";
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
  Upload,
  AlertCircle,
  Loader2,
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

interface InteractiveImageBlockProps {
  img: ImageBlock;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updated: Partial<ImageBlock>) => void;
}

function InteractiveImageBlock({
  img,
  isSelected,
  onSelect,
  onUpdate,
}: InteractiveImageBlockProps) {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = React.useState(false);
  const [hasError, setHasError] = React.useState(false);
  const [isDragging, setIsDragging] = React.useState(false);

  // Reset error when URL changes
  React.useEffect(() => {
    setHasError(false);
  }, [img.url]);

  const handleUploadFile = async (file: File) => {
    setIsUploading(true);
    setHasError(false);
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
        onUpdate({
          url: data.url,
          caption: img.caption || data.name,
        });
      }
    } catch (err) {
      console.error("Canvas image upload error:", err);
      setHasError(true);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleUploadFile(file);
    }
  };

  return (
    <div
      onClick={onSelect}
      onDragOver={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
      }}
      onDragLeave={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
      }}
      onDrop={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file && file.type.startsWith("image/")) {
          handleUploadFile(file);
        }
      }}
      className={`space-y-2 text-center transition-all ${
        isDragging ? "ring-2 ring-blue-500 rounded-md bg-blue-50/20" : ""
      }`}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {isUploading ? (
        <div className="h-40 border border-dashed border-zinc-400 rounded-md flex flex-col items-center justify-center text-xs text-zinc-600 gap-2 bg-zinc-50/80 font-mono">
          <Loader2 className="w-6 h-6 animate-spin text-zinc-800" />
          <span>Uploading and processing image...</span>
        </div>
      ) : hasError ? (
        <div className="p-4 rounded-md border border-amber-300 bg-amber-50/90 text-amber-950 text-xs flex flex-col items-center gap-2">
          <div className="flex items-center gap-1.5 font-bold">
            <AlertCircle className="w-4 h-4 text-amber-600" />
            <span>Image could not be loaded</span>
          </div>
          <p className="text-[11px] text-amber-800 font-mono truncate max-w-sm">
            URL: {img.url}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
              className="px-3 py-1 bg-zinc-950 text-white rounded text-xs font-mono hover:bg-black transition-colors"
            >
              Upload Replacement Image
            </button>
          </div>
        </div>
      ) : img.url ? (
        <div className="relative group/canvas-img inline-block max-w-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={img.url}
            alt={img.alt || "preview"}
            onError={() => setHasError(true)}
            className="rounded-sm object-contain border border-zinc-200 shadow-xs max-h-72 mx-auto"
            style={{ width: img.width || "80%" }}
          />
          <button
            onClick={(e) => {
              e.stopPropagation();
              fileInputRef.current?.click();
            }}
            className="absolute top-2 right-2 bg-zinc-950/90 text-white text-[11px] font-mono px-2 py-1 rounded shadow-md opacity-0 group-hover/canvas-img:opacity-100 transition-opacity hover:bg-black"
          >
            Replace Image
          </button>
        </div>
      ) : (
        <div
          onClick={(e) => {
            e.stopPropagation();
            onSelect();
            fileInputRef.current?.click();
          }}
          className="h-36 border-2 border-dashed border-zinc-300 hover:border-zinc-500 rounded-md flex flex-col items-center justify-center text-xs text-zinc-500 gap-1.5 bg-zinc-50/60 hover:bg-zinc-100/60 cursor-pointer transition-colors font-mono"
        >
          <ImageIcon className="w-6 h-6 text-zinc-400" />
          <span className="font-semibold text-zinc-700">Click to upload image</span>
          <span className="text-[10px] text-zinc-400">or drag and drop PNG, JPG, SVG</span>
        </div>
      )}

      {/* Quick URL & size presets when selected */}
      {isSelected && (
        <div className="flex flex-wrap items-center justify-center gap-2 p-1.5 bg-zinc-100 rounded-md border border-zinc-200 text-xs">
          <input
            type="text"
            value={img.url}
            onChange={(e) => onUpdate({ url: e.target.value })}
            placeholder="Paste Image URL (https://... or /uploads/...)"
            className="bg-white border border-zinc-300 rounded px-2 py-0.5 text-xs text-zinc-800 w-56 outline-none focus:ring-1 focus:ring-zinc-950"
          />
          <button
            onClick={(e) => {
              e.stopPropagation();
              fileInputRef.current?.click();
            }}
            disabled={isUploading}
            className="flex items-center gap-1 px-2 py-0.5 rounded bg-zinc-950 text-white hover:bg-zinc-800 text-[10px] font-mono font-bold transition-colors"
            title="Upload image from computer"
          >
            <Upload className="w-3 h-3" />
            <span>Upload File</span>
          </button>
          <div className="flex items-center gap-1 font-mono">
            {(["50%", "75%", "100%"] as const).map((w) => (
              <button
                key={w}
                onClick={() => onUpdate({ width: w })}
                className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                  img.width === w
                    ? "bg-zinc-950 text-white"
                    : "bg-white border border-zinc-300 text-zinc-700 hover:bg-zinc-50"
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
        onValueChange={(val) => onUpdate({ caption: val })}
        placeholder="+ Add image caption..."
        className={`text-[11px] italic font-mono text-zinc-500 text-center ${
          isSelected
            ? "bg-zinc-100/80 rounded px-1.5 py-0.5 ring-1 ring-zinc-300"
            : "hover:bg-zinc-100/50 rounded px-1.5 py-0.5"
        }`}
      />
    </div>
  );
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
  const { currentUITheme } = useTheme();

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
          1: "text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0f172a] pb-1",
          2: "text-xl sm:text-2xl font-bold tracking-tight text-[#0f172a] pb-1",
          3: "text-lg sm:text-xl font-bold text-[#0f172a]",
          4: "text-base font-semibold text-[#1e293b]",
        }[h.level || 1] || "text-2xl font-bold text-[#0f172a]";

        contentNode = (
          <div className={`${alignClass} space-y-1.5`} onClick={() => onSelectBlock(h.id)}>
            <AutoResizeTextarea
              value={h.text}
              onValueChange={(val) => onUpdateBlock(h.id, { text: val })}
              placeholder="Click to type heading..."
              className={`${levelStyle} leading-tight ${
                isSelected
                  ? "bg-zinc-100/80 rounded px-1.5 py-0.5 ring-1 ring-zinc-400"
                  : "hover:bg-zinc-100/50 rounded px-1.5 py-0.5"
              }`}
            />
            {h.level === 1 && (
              <div
                className="h-[2px] w-full rounded-full"
                style={{ backgroundColor: documentState.settings.accentColor || "#0f172a" }}
              />
            )}

            {(h.subtitle !== undefined || isSelected) && (
              <AutoResizeTextarea
                value={h.subtitle || ""}
                onValueChange={(val) => onUpdateBlock(h.id, { subtitle: val })}
                placeholder="+ Add subtitle..."
                className={`text-xs sm:text-sm text-[#64748b] font-normal leading-relaxed ${
                  isSelected
                    ? "bg-zinc-100/70 rounded px-1.5 py-0.5 ring-1 ring-zinc-300"
                    : "hover:bg-zinc-100/50 rounded px-1.5 py-0.5"
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
              className={`text-xs sm:text-sm leading-relaxed text-[#334155] font-normal ${
                isSelected
                  ? "bg-zinc-100/80 rounded p-1.5 ring-1 ring-zinc-400"
                  : "hover:bg-zinc-100/50 rounded p-1.5"
              }`}
            />
          </div>
        );
        break;
      }

      // 3. Custom Card Block
      case "card": {
        const c = b as CardBlock;
        const fill = c.fillColor || "#ffffff";
        const stroke = c.strokeColor || "#e2e8f0";
        const titleColor = getContrastingText(fill);
        const bodyColor = isColorDark(fill) ? "#e2e8f0" : "#334155";
        const badgeBg = c.badgeBg || (isColorDark(fill) ? "#ffffff" : (documentState.settings.accentColor || "#0f172a"));
        const badgeText = c.badgeText || (isColorDark(fill) ? "#0f172a" : "#ffffff");

        contentNode = (
          <div
            onClick={() => onSelectBlock(c.id)}
            style={{
              backgroundColor: fill,
              borderColor: stroke,
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
                  style={{
                    backgroundColor: badgeBg,
                    color: badgeText,
                  }}
                  className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full border border-black/10 outline-none shadow-xs"
                />
              </div>
            )}

            {/* Card Title */}
            <AutoResizeTextarea
              value={c.title || ""}
              onValueChange={(val) => onUpdateBlock(c.id, { title: val })}
              placeholder="+ Card Title..."
              style={{ color: titleColor }}
              className={`font-bold text-sm sm:text-base leading-snug ${
                isSelected
                  ? "bg-black/5 rounded px-1.5 py-0.5 ring-1 ring-zinc-400"
                  : "hover:bg-black/5 rounded px-1.5 py-0.5"
              }`}
            />

            {/* Card Content Description */}
            <AutoResizeTextarea
              value={c.content || ""}
              onValueChange={(val) => onUpdateBlock(c.id, { content: val })}
              placeholder="Card description text..."
              style={{ color: bodyColor }}
              className={`text-xs sm:text-sm leading-relaxed font-normal ${
                isSelected
                  ? "bg-black/5 rounded p-1.5 ring-1 ring-zinc-400"
                  : "hover:bg-black/5 rounded p-1.5"
              }`}
            />
          </div>
        );
        break;
      }

      // 4. Callout Banner
      case "card_callout": {
        const callout = b as CalloutCardBlock;
        const base = CALLOUT_THEMES[callout.variant] || CALLOUT_THEMES.note;
        const bg = callout.bgColor || base.bg;
        const border = callout.borderColor || (callout.variant === "note" ? (documentState.settings.accentColor || base.border) : base.border);
        const titleColor = callout.textColor || (callout.variant === "note" ? (documentState.settings.accentColor || base.text) : base.text);

        contentNode = (
          <div
            onClick={() => onSelectBlock(callout.id)}
            style={{
              backgroundColor: bg,
              borderLeftColor: border,
              borderLeftWidth: "4px",
            }}
            className="rounded-r-md p-3 sm:p-4 text-xs space-y-2 border border-black/5 shadow-xs transition-all"
          >
            {/* Variant Selector pills when selected */}
            {isSelected && (
              <div className="flex items-center gap-1.5 pb-1 border-b border-black/10">
                <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 mr-1">
                  Type:
                </span>
                {(["note", "tip", "warning", "caution"] as const).map((v) => (
                  <button
                    key={v}
                    onClick={(e) => {
                      e.stopPropagation();
                      onUpdateBlock(callout.id, { variant: v });
                    }}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider transition-all ${
                      callout.variant === v
                        ? "bg-zinc-950 text-white shadow-xs font-semibold"
                        : "bg-white/80 hover:bg-white text-zinc-700 border border-zinc-300"
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
              style={{ color: titleColor }}
              className={`font-bold text-xs sm:text-sm ${
                isSelected
                  ? "bg-white/90 rounded px-1.5 py-0.5 ring-1 ring-zinc-400"
                  : "hover:bg-white/50 rounded px-1.5 py-0.5"
              }`}
            />

            {/* Callout Message */}
            <AutoResizeTextarea
              value={callout.message}
              onValueChange={(val) => onUpdateBlock(callout.id, { message: val })}
              placeholder="Callout note details and instructions..."
              style={{ color: base.body }}
              className={`text-xs sm:text-sm leading-relaxed font-normal ${
                isSelected
                  ? "bg-white/90 rounded p-1.5 ring-1 ring-zinc-400"
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
        const fill = m.fillColor || "#f8fafc";
        const stroke = m.strokeColor || "#e2e8f0";
        const valueColor = documentState.settings.accentColor || "#0f172a";
        const badgeColor =
          m.changeType === "positive"
            ? "#16a34a"
            : m.changeType === "negative"
            ? "#dc2626"
            : "#64748b";

        contentNode = (
          <div
            onClick={() => onSelectBlock(m.id)}
            style={{
              backgroundColor: fill,
              borderColor: stroke,
            }}
            className="p-3.5 border rounded-md space-y-2 shadow-xs transition-all"
          >
            {/* KPI Label */}
            <AutoResizeTextarea
              value={m.label}
              onValueChange={(val) => onUpdateBlock(m.id, { label: val })}
              placeholder="KPI LABEL..."
              style={{ color: "#64748b" }}
              className={`text-[11px] font-mono font-medium uppercase tracking-wider ${
                isSelected
                  ? "bg-zinc-200/70 rounded px-1.5 py-0.5 ring-1 ring-zinc-400"
                  : "hover:bg-zinc-200/40 rounded px-1.5 py-0.5"
              }`}
            />

            {/* KPI Value */}
            <AutoResizeTextarea
              value={m.value}
              onValueChange={(val) => onUpdateBlock(m.id, { value: val })}
              placeholder="$0.00"
              style={{ color: valueColor }}
              className={`text-2xl sm:text-3xl font-mono font-bold tracking-tight ${
                isSelected
                  ? "bg-zinc-200/70 rounded px-1.5 py-0.5 ring-1 ring-zinc-400"
                  : "hover:bg-zinc-200/40 rounded px-1.5 py-0.5"
              }`}
            />

            {/* Change Trend & Change Type */}
            <div className="flex items-center gap-2 pt-1 border-t border-black/5">
              <AutoResizeTextarea
                value={m.change || ""}
                onValueChange={(val) => onUpdateBlock(m.id, { change: val })}
                placeholder="+0.0% vs last month"
                style={{ color: badgeColor }}
                className={`text-xs font-mono font-medium ${
                  isSelected
                    ? "bg-zinc-200/70 rounded px-1.5 py-0.5 ring-1 ring-zinc-400"
                    : "hover:bg-zinc-200/40 rounded px-1.5 py-0.5"
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
                    className={`p-1 rounded text-xs transition-colors ${
                      m.changeType === "positive"
                        ? "bg-zinc-950 text-white"
                        : "bg-zinc-200 text-zinc-600 hover:bg-zinc-300"
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
                    className={`p-1 rounded text-xs transition-colors ${
                      m.changeType === "negative"
                        ? "bg-zinc-950 text-white"
                        : "bg-zinc-200 text-zinc-600 hover:bg-zinc-300"
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
                    className={`p-1 rounded text-xs transition-colors ${
                      m.changeType === "neutral"
                        ? "bg-zinc-950 text-white"
                        : "bg-zinc-200 text-zinc-600 hover:bg-zinc-300"
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
        const fill = p.fillColor || "#ffffff";
        const stroke = p.strokeColor || "#e2e8f0";
        const roleColor = p.roleColor || documentState.settings.accentColor || "#0f172a";

        contentNode = (
          <div
            onClick={() => onSelectBlock(p.id)}
            style={{
              backgroundColor: fill,
              borderColor: stroke,
            }}
            className="p-4 border rounded-md space-y-2 shadow-xs transition-all"
          >
            <div className="flex items-start gap-3">
              {/* Profile Avatar */}
              <div className="w-11 h-11 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center font-mono font-bold text-zinc-100 shrink-0 text-sm overflow-hidden">
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
                  style={{ color: "#0f172a" }}
                  className={`font-bold text-base ${
                    isSelected
                      ? "bg-zinc-100/80 rounded px-1.5 py-0.5 ring-1 ring-zinc-400"
                      : "hover:bg-zinc-100/50 rounded px-1.5 py-0.5"
                  }`}
                />

                {/* Role / Title */}
                <AutoResizeTextarea
                  value={p.role}
                  onValueChange={(val) => onUpdateBlock(p.id, { role: val })}
                  placeholder="Job Title / Role..."
                  style={{ color: roleColor }}
                  className={`text-xs font-mono font-medium ${
                    isSelected
                      ? "bg-zinc-100/80 rounded px-1.5 py-0.5 ring-1 ring-zinc-400"
                      : "hover:bg-zinc-100/50 rounded px-1.5 py-0.5"
                  }`}
                />
              </div>
            </div>

            {/* Bio Description */}
            <AutoResizeTextarea
              value={p.bio}
              onValueChange={(val) => onUpdateBlock(p.id, { bio: val })}
              placeholder="Biography or professional summary description..."
              style={{ color: "#334155" }}
              className={`text-xs sm:text-sm leading-relaxed ${
                isSelected
                  ? "bg-zinc-100/80 rounded p-1.5 ring-1 ring-zinc-400"
                  : "hover:bg-zinc-100/50 rounded p-1.5"
              }`}
            />

            {/* Contact details */}
            <AutoResizeTextarea
              value={p.contact || ""}
              onValueChange={(val) => onUpdateBlock(p.id, { contact: val })}
              placeholder="alex@example.com • github.com/username • +1 (555) 019-2831"
              style={{ color: "#64748b" }}
              className={`text-[11px] font-mono ${
                isSelected
                  ? "bg-zinc-100/80 rounded px-1.5 py-0.5 ring-1 ring-zinc-300"
                  : "hover:bg-zinc-100/50 rounded px-1.5 py-0.5"
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
                className="space-y-3 min-h-[50px] p-2 rounded-sm border border-dashed border-zinc-200/90 bg-zinc-50/40"
              >
                {col.blocks.length === 0 ? (
                  <div className="text-[11px] text-zinc-400 font-mono text-center py-4">Empty column</div>
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
          <InteractiveImageBlock
            img={img}
            isSelected={isSelected}
            onSelect={() => onSelectBlock(img.id)}
            onUpdate={(updated) => onUpdateBlock(img.id, updated)}
          />
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
              className={`text-center text-xs font-semibold text-zinc-800 ${
                isSelected
                  ? "bg-zinc-100/80 rounded px-1.5 py-0.5 ring-1 ring-zinc-300"
                  : "hover:bg-zinc-100/50 rounded px-1.5 py-0.5"
              }`}
            />

            {/* Quick Table Manipulation Controls when selected */}
            {isSelected && (
              <div className="flex items-center justify-between bg-zinc-100 border border-zinc-300 rounded px-2.5 py-1 text-[11px] text-zinc-700">
                <span className="font-mono font-medium flex items-center gap-1.5 text-zinc-900">
                  <TableIcon className="w-3.5 h-3.5 text-zinc-700" />
                  Table Grid ({tbl.rows.length} rows × {tbl.headers.length} cols)
                </span>
                <div className="flex items-center gap-1.5 font-mono">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addRow();
                    }}
                    className="px-2 py-0.5 bg-zinc-950 hover:bg-black text-white rounded font-medium transition-colors"
                  >
                    + Row
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeRow();
                    }}
                    disabled={tbl.rows.length <= 1}
                    className="px-2 py-0.5 bg-zinc-200 hover:bg-zinc-300 disabled:opacity-40 text-zinc-800 rounded font-medium transition-colors"
                  >
                    - Row
                  </button>
                  <span className="text-zinc-400">|</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addColumn();
                    }}
                    className="px-2 py-0.5 bg-zinc-950 hover:bg-black text-white rounded font-medium transition-colors"
                  >
                    + Col
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeColumn();
                    }}
                    disabled={tbl.headers.length <= 1}
                    className="px-2 py-0.5 bg-zinc-200 hover:bg-zinc-300 disabled:opacity-40 text-zinc-800 rounded font-medium transition-colors"
                  >
                    - Col
                  </button>
                </div>
              </div>
            )}

            {/* Editable Spreadsheet View */}
            <div className="overflow-x-auto border border-[#cbd5e1] rounded-sm">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#f1f5f9] border-b border-[#cbd5e1]">
                    {tbl.headers.map((h, i) => (
                      <th key={i} className="p-1 border-r border-[#cbd5e1] font-mono text-[11px] font-semibold text-[#0f172a]">
                        <input
                          type="text"
                          value={h}
                          onChange={(e) => updateHeader(i, e.target.value)}
                          className="w-full bg-transparent font-mono font-semibold text-[#0f172a] px-1 py-0.5 outline-none focus:bg-white focus:ring-1 focus:ring-zinc-950 rounded"
                        />
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tbl.rows.map((row, rIdx) => (
                    <tr
                      key={rIdx}
                      className={`border-b border-[#cbd5e1] ${
                        tbl.isZebra && rIdx % 2 === 1 ? "bg-[#f8fafc]" : "bg-white"
                      }`}
                    >
                      {row.map((cell, cIdx) => (
                        <td key={cIdx} className="p-1 border-r border-[#cbd5e1]">
                          <input
                            type="text"
                            value={cell}
                            onChange={(e) => updateCell(rIdx, cIdx, e.target.value)}
                            className="w-full bg-transparent text-[#334155] px-1 py-0.5 outline-none focus:bg-white focus:ring-1 focus:ring-zinc-950 rounded"
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
            className="rounded border border-zinc-850 bg-[#09090b] text-zinc-100 p-3 font-mono text-xs overflow-hidden shadow-xs space-y-2"
          >
            {/* Monospace header bar */}
            <div className="flex items-center justify-between border-b border-zinc-800 pb-1.5 text-[11px] text-zinc-400">
              <input
                type="text"
                value={code.filename || ""}
                onChange={(e) => onUpdateBlock(code.id, { filename: e.target.value })}
                placeholder="filename.typ"
                className="bg-zinc-900 border border-zinc-800 rounded px-1.5 py-0.5 text-zinc-200 font-mono text-xs outline-none focus:border-zinc-500 w-40"
              />
              <input
                type="text"
                value={code.language || "typst"}
                onChange={(e) => onUpdateBlock(code.id, { language: e.target.value })}
                placeholder="typst"
                className="bg-zinc-900 border border-zinc-800 rounded px-1.5 py-0.5 text-zinc-400 font-mono text-[10px] uppercase outline-none focus:border-zinc-500 w-20 text-right"
              />
            </div>

            {/* Code Body Textarea */}
            <AutoResizeTextarea
              value={code.code}
              onValueChange={(val) => onUpdateBlock(code.id, { code: val })}
              placeholder="// Write code here..."
              className="text-zinc-200 font-mono text-xs leading-relaxed bg-zinc-900/60 rounded p-2 border border-zinc-800/80 outline-none focus:border-zinc-500"
            />
          </div>
        );
        break;
      }

      // 11. Divider Block
      case "divider": {
        const div = b as DividerBlock;
        const color = div.color || documentState.settings.accentColor || "#e2e8f0";
        contentNode = (
          <div onClick={() => onSelectBlock(div.id)} className="py-2.5">
            <hr
              style={{
                borderColor: color,
                borderTopWidth: `${div.thickness || 1}px`,
                borderStyle: div.style || "solid",
              }}
            />
            {isSelected && (
              <div className="flex items-center justify-center gap-1.5 pt-1.5 text-[10px] font-mono">
                {(["solid", "dashed", "dotted"] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => onUpdateBlock(div.id, { style: s })}
                    className={`px-2 py-0.5 rounded capitalize ${
                      (div.style || "solid") === s
                        ? "bg-zinc-950 text-white font-bold"
                        : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
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
        className={`group/paper-block relative rounded-sm transition-all cursor-pointer ${
          isSelected
            ? "ring-1 ring-zinc-950 ring-offset-1 ring-offset-white shadow-xs z-20"
            : "hover:outline hover:outline-1 hover:outline-zinc-300 hover:outline-dashed"
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
          <span className="text-[9px] font-mono uppercase tracking-wider bg-zinc-950 text-zinc-200 border border-zinc-800 px-1.5 py-0.5 rounded shadow-xs">
            {blockTypeLabel}
          </span>
        </div>

        {contentNode}

        {/* Quick insertion divider on hover below block */}
        <div className="relative group/divider-hover py-1 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="w-full border-t border-dashed border-zinc-300" />
          <button
            onClick={(e) => {
              e.stopPropagation();
              onInsertBlockBelow(b.id);
            }}
            className="absolute bg-zinc-950 hover:bg-black text-white border border-zinc-700 rounded-full p-1 shadow-sm hover:scale-105 transition-transform"
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
      style={{ backgroundColor: "var(--theme-desk, " + currentUITheme.colors.deskBg + ")" }}
      className="flex-1 flex flex-col h-full overflow-hidden select-none transition-colors duration-200"
    >
      {/* Top Controls Bar */}
      <div
        className="h-11 border-b px-4 flex items-center justify-between text-xs backdrop-blur shrink-0 transition-colors duration-150"
        style={{
          backgroundColor: "var(--theme-panel)",
          borderColor: "var(--theme-border)",
          color: "var(--theme-text-primary)",
        }}
      >
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 text-zinc-200 px-2.5 py-1 rounded-full text-xs font-mono font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <FileCheck className="w-3.5 h-3.5 text-zinc-400" />
            <span>Interactive Sheet Canvas</span>
          </div>
          <span className="text-[11px] text-zinc-500 font-mono hidden sm:inline">
            Directly edit titles, metrics, descriptions, profiles & tables on sheet
          </span>
        </div>

        {/* Zoom controller */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setZoom((z) => Math.max(50, z - 10))}
            className="p-1.5 rounded-md hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="font-mono text-xs w-11 text-center font-medium text-zinc-300">
            {zoom}%
          </span>
          <button
            onClick={() => setZoom((z) => Math.min(150, z + 10))}
            className="p-1.5 rounded-md hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setZoom(100)}
            className="p-1.5 rounded-md hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
            title="Reset Zoom to 100%"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Canva Workspace Scroll Area */}
      <div
        style={{ backgroundColor: currentUITheme.colors.deskBg }}
        className="flex-1 overflow-auto p-6 sm:p-10 flex justify-center items-start relative transition-colors duration-200"
      >
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
            className="document-paper-sheet bg-white text-zinc-900 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.85)] rounded-sm border border-zinc-200/90 flex flex-col justify-between relative cursor-default transition-all"
          >
            <div className="space-y-4">
              {blocks.map(renderEditableBlock)}
            </div>

            {settings.showPageNumbers && (
              <div className="text-center text-[10px] text-zinc-400 pt-8 font-mono border-t border-zinc-100 mt-6">
                Page 1 of 1
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
