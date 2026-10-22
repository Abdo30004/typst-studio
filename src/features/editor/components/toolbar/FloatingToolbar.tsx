"use client";

import React from "react";
import { DocumentBlock, HeadingBlock, CardBlock, CalloutCardBlock } from "@/types/document";
import {
  Copy,
  Trash2,
  ArrowUp,
  ArrowDown,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Code,
  Sliders,
  Sparkles,
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
  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="absolute -top-11 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1 bg-slate-900/95 backdrop-blur-md border border-slate-700/90 shadow-2xl rounded-full px-2.5 py-1 text-slate-200 select-none animate-in fade-in zoom-in-95 duration-100"
    >
      <span className="text-[10px] font-semibold text-blue-400 bg-blue-950/80 px-2 py-0.5 rounded-full border border-blue-800/40 uppercase tracking-wider font-mono mr-1">
        {block.type.replace("card_", "")}
      </span>

      {/* Heading controls */}
      {block.type === "heading" && (
        <div className="flex items-center gap-0.5 pr-1.5 border-r border-slate-700/80">
          {([1, 2, 3] as const).map((lvl) => (
            <button
              key={lvl}
              onClick={() => onUpdate({ level: lvl })}
              className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                (block as HeadingBlock).level === lvl
                  ? "bg-blue-600 text-white"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              H{lvl}
            </button>
          ))}
          <button
            onClick={() => onUpdate({ align: "left" })}
            className={`p-1 rounded text-slate-400 hover:text-white ${
              (block as HeadingBlock).align === "left" ? "bg-slate-800 text-white" : ""
            }`}
          >
            <AlignLeft className="w-3 h-3" />
          </button>
          <button
            onClick={() => onUpdate({ align: "center" })}
            className={`p-1 rounded text-slate-400 hover:text-white ${
              (block as HeadingBlock).align === "center" ? "bg-slate-800 text-white" : ""
            }`}
          >
            <AlignCenter className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Card color swatches */}
      {block.type === "card" && (
        <div className="flex items-center gap-1.5 pr-1.5 border-r border-slate-700/80">
          {["#1e293b", "#0f172a", "#1e1b4b", "#064e3b", "#701a75"].map((col) => (
            <button
              key={col}
              onClick={() => onUpdate({ fillColor: col })}
              style={{ backgroundColor: col }}
              className={`w-3.5 h-3.5 rounded-full border ${
                (block as CardBlock).fillColor === col
                  ? "ring-2 ring-blue-500 scale-110 border-white"
                  : "border-slate-600 hover:scale-105"
              } transition-transform`}
            />
          ))}
        </div>
      )}

      {/* Callout variant */}
      {block.type === "card_callout" && (
        <div className="flex items-center gap-1 pr-1.5 border-r border-slate-700/80">
          {(["note", "tip", "warning", "caution"] as const).map((v) => (
            <button
              key={v}
              onClick={() => onUpdate({ variant: v })}
              className={`px-1.5 py-0.5 rounded text-[10px] font-medium capitalize ${
                (block as CalloutCardBlock).variant === v
                  ? "bg-blue-600 text-white"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      )}

      {/* Movement actions */}
      <div className="flex items-center gap-0.5 pr-1 border-r border-slate-700/80">
        <button
          onClick={onMoveUp}
          title="Move Up (Alt+Up)"
          className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <ArrowUp className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={onMoveDown}
          title="Move Down (Alt+Down)"
          className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <ArrowDown className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Common actions */}
      <div className="flex items-center gap-0.5">
        <button
          onClick={onDuplicate}
          title="Duplicate Block (Ctrl+D)"
          className="p-1 rounded-full text-slate-400 hover:text-blue-400 hover:bg-slate-800 transition-colors"
        >
          <Copy className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={onOpenInspector}
          title="Customize Block Style"
          className="p-1 rounded-full text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition-colors"
        >
          <Sliders className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={onDelete}
          title="Delete Block (Del)"
          className="p-1 rounded-full text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
