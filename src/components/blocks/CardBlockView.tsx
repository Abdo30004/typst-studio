"use client";

import React from "react";
import { CardBlock } from "@/types/document";

interface Props {
  block: CardBlock;
  onChange: (updated: Partial<CardBlock>) => void;
}

export function CardBlockView({ block, onChange }: Props) {
  const fillColor = block.fillColor || "#1e293b";
  const strokeColor = block.strokeColor || "#334155";
  const radius = block.radius ?? 8;
  const padding = block.padding ?? 14;

  return (
    <div
      style={{
        backgroundColor: fillColor,
        borderColor: strokeColor,
        borderWidth: `${block.strokeWidth ?? 1}px`,
        borderRadius: `${radius}px`,
        padding: `${padding}px`,
      }}
      className="space-y-2 border transition-all shadow-sm"
    >
      <input
        type="text"
        value={block.title || ""}
        onChange={(e) => onChange({ title: e.target.value })}
        placeholder="Card Title (optional)..."
        className="w-full bg-transparent border-0 outline-none p-0 text-base font-semibold text-slate-100 placeholder:text-slate-400 focus:ring-0"
      />

      <textarea
        value={block.content}
        onChange={(e) => onChange({ content: e.target.value })}
        placeholder="Card body text or bullet list..."
        rows={Math.max(2, (block.content || "").split("\n").length)}
        className="w-full resize-y bg-transparent border-0 outline-none p-0 text-sm leading-relaxed text-slate-300 placeholder:text-slate-400 focus:ring-0"
      />
    </div>
  );
}
