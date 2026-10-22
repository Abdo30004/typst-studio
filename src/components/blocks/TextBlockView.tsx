"use client";

import React from "react";
import { TextBlock } from "@/types/document";

interface Props {
  block: TextBlock;
  onChange: (updated: Partial<TextBlock>) => void;
}

export function TextBlockView({ block, onChange }: Props) {
  return (
    <div className="space-y-1">
      <textarea
        value={block.content}
        onChange={(e) => onChange({ content: e.target.value })}
        placeholder="Type markdown, text, lists, or math equations ($x^2$)..."
        rows={Math.max(2, (block.content || "").split("\n").length)}
        className="w-full resize-y bg-transparent border-0 outline-none p-0 text-sm leading-relaxed text-slate-200 placeholder:text-slate-600 focus:ring-0 font-normal"
      />
    </div>
  );
}
