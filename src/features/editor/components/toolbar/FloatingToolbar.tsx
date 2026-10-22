"use client";

import React from "react";
import { DocumentBlock, HeadingBlock, CardBlock, CalloutCardBlock } from "@/types/document";
import { useTheme } from "@/lib/theme";
import {
  Copy,
  Trash2,
  ArrowUp,
  ArrowDown,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Sliders,
} from "lucide-react";

interface Props {
  block: DocumentBlock;
  onUpdate: (updated: Partial<DocumentBlock>) => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onOpenInspector: () => void;
}

export function FloatingToolbar({
  block,
  onUpdate,
  onDuplicate,
  onDelete,
  onMoveUp,
  onMoveDown,
  onOpenInspector,
}: Props) {
  const { activePalette } = useTheme();

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="absolute -top-11 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5 bg-zinc-950/95 backdrop-blur border border-zinc-800 shadow-2xl rounded-lg px-2.5 py-1 text-zinc-200 select-none animate-in fade-in zoom-in-95 duration-100"
    >
      <span className="text-[10px] font-mono font-bold text-zinc-300 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800 uppercase tracking-wider mr-1">
        {block.type.replace("card_", "")}
      </span>

      {/* Heading controls */}
      {block.type === "heading" && (
        <div className="flex items-center gap-0.5 pr-1.5 border-r border-zinc-800">
          {([1, 2, 3] as const).map((lvl) => (
            <button
              key={lvl}
              onClick={() => onUpdate({ level: lvl })}
              className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                (block as HeadingBlock).level === lvl
                  ? "bg-white text-zinc-950 shadow-xs"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-850"
              }`}
            >
              H{lvl}
            </button>
          ))}
          <button
            onClick={() => onUpdate({ align: "left" })}
            className={`p-1 rounded text-zinc-400 hover:text-white ${
              (block as HeadingBlock).align === "left" ? "bg-zinc-800 text-white" : ""
            }`}
          >
            <AlignLeft className="w-3 h-3" />
          </button>
          <button
            onClick={() => onUpdate({ align: "center" })}
            className={`p-1 rounded text-zinc-400 hover:text-white ${
              (block as HeadingBlock).align === "center" ? "bg-zinc-800 text-white" : ""
            }`}
          >
            <AlignCenter className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Card dynamic palette swatches */}
      {block.type === "card" && (
        <div className="flex items-center gap-1.5 pr-1.5 border-r border-zinc-800">
          {activePalette.swatches.slice(0, 5).map((swatch) => (
            <button
              key={swatch.fill}
              onClick={() => onUpdate({ fillColor: swatch.fill, strokeColor: swatch.stroke })}
              title={`${swatch.label} (${swatch.fill})`}
              style={{ backgroundColor: swatch.fill }}
              className={`w-3.5 h-3.5 rounded-full border ${
                (block as CardBlock).fillColor === swatch.fill
                  ? "ring-2 ring-white scale-110 border-black"
                  : "border-zinc-700 hover:scale-105"
              } transition-transform`}
            />
          ))}
        </div>
      )}

      {/* Callout variant */}
      {block.type === "card_callout" && (
        <div className="flex items-center gap-1 pr-1.5 border-r border-zinc-800">
          {(["note", "tip", "warning", "caution"] as const).map((v) => (
            <button
              key={v}
              onClick={() => onUpdate({ variant: v })}
              className={`px-1.5 py-0.5 rounded text-[10px] font-mono capitalize ${
                (block as CalloutCardBlock).variant === v
                  ? "bg-white text-zinc-950 font-bold"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-850"
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      )}

      {/* Movement actions */}
      <div className="flex items-center gap-0.5 pr-1 border-r border-zinc-800">
        <button
          onClick={onMoveUp}
          title="Move Up (Alt+Up)"
          className="p-1 rounded text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
        >
          <ArrowUp className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={onMoveDown}
          title="Move Down (Alt+Down)"
          className="p-1 rounded text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
        >
          <ArrowDown className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Common actions */}
      <div className="flex items-center gap-0.5">
        <button
          onClick={onDuplicate}
          title="Duplicate Block (Ctrl+D)"
          className="p-1 rounded text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
        >
          <Copy className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={onOpenInspector}
          title="Inspect Specs"
          className="p-1 rounded text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
        >
          <Sliders className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={onDelete}
          title="Delete Block (Del)"
          className="p-1 rounded text-zinc-400 hover:text-rose-400 hover:bg-zinc-800 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
