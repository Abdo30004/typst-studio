"use client";

import React from "react";
import { HeadingBlock } from "@/types/document";
import { AlignLeft, AlignCenter, AlignRight } from "lucide-react";

interface Props {
  block: HeadingBlock;
  onChange: (updated: Partial<HeadingBlock>) => void;
}

export function HeadingBlockView({ block, onChange }: Props) {
  const headingStyles = {
    1: "text-2xl font-bold tracking-tight text-slate-100",
    2: "text-xl font-bold tracking-tight text-slate-100",
    3: "text-lg font-semibold text-slate-200",
    4: "text-base font-semibold text-slate-300",
  }[block.level || 1];

  const textAlignClass = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  }[block.align || "left"];

  return (
    <div className="space-y-2 group/h">
      <div className="flex items-center justify-between gap-2 border-b border-zinc-800 pb-1 mb-1">
        <div className="flex items-center gap-1 font-mono">
          {([1, 2, 3, 4] as const).map((lvl) => (
            <button
              key={lvl}
              onClick={(e) => {
                e.stopPropagation();
                onChange({ level: lvl });
              }}
              className={`px-1.5 py-0.5 rounded text-[11px] font-semibold transition-colors ${
                block.level === lvl
                  ? "bg-white text-zinc-950 shadow-xs"
                  : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
              }`}
            >
              H{lvl}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onChange({ align: "left" });
            }}
            className={`p-1 rounded text-xs transition-colors ${
              block.align === "left" ? "bg-zinc-800 text-white" : "text-zinc-400 hover:text-white"
            }`}
          >
            <AlignLeft className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onChange({ align: "center" });
            }}
            className={`p-1 rounded text-xs transition-colors ${
              block.align === "center" ? "bg-zinc-800 text-white" : "text-zinc-400 hover:text-white"
            }`}
          >
            <AlignCenter className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onChange({ align: "right" });
            }}
            className={`p-1 rounded text-xs transition-colors ${
              block.align === "right" ? "bg-zinc-800 text-white" : "text-zinc-400 hover:text-white"
            }`}
          >
            <AlignRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <input
        type="text"
        value={block.text}
        onChange={(e) => onChange({ text: e.target.value })}
        placeholder="Enter heading text..."
        className={`w-full bg-transparent border-0 outline-none p-0 focus:ring-0 ${headingStyles} ${textAlignClass} placeholder:text-zinc-600`}
      />

      <input
        type="text"
        value={block.subtitle || ""}
        onChange={(e) => onChange({ subtitle: e.target.value })}
        placeholder="Add subtitle (optional)..."
        className={`w-full bg-transparent border-0 outline-none p-0 text-sm text-zinc-400 ${textAlignClass} placeholder:text-zinc-600 focus:text-zinc-200`}
      />
    </div>
  );
}
