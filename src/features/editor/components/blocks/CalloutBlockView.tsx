"use client";

import React from "react";
import { CalloutCardBlock } from "@/types/document";
import { Info, Lightbulb, AlertTriangle, AlertCircle } from "lucide-react";

interface Props {
  block: CalloutCardBlock;
  onChange: (updated: Partial<CalloutCardBlock>) => void;
}

export function CalloutBlockView({ block, onChange }: Props) {
  const variantConfig = {
    note: {
      bg: "bg-blue-950/40 border-l-blue-500 text-blue-400",
      icon: Info,
      label: "Note",
    },
    tip: {
      bg: "bg-emerald-950/40 border-l-emerald-500 text-emerald-400",
      icon: Lightbulb,
      label: "Tip",
    },
    warning: {
      bg: "bg-amber-950/40 border-l-amber-500 text-amber-400",
      icon: AlertTriangle,
      label: "Warning",
    },
    caution: {
      bg: "bg-rose-950/40 border-l-rose-500 text-rose-400",
      icon: AlertCircle,
      label: "Caution",
    },
  }[block.variant || "note"];

  const IconComp = variantConfig.icon;

  return (
    <div className={`p-3.5 rounded-r-md border-l-4 ${variantConfig.bg} border-zinc-800 space-y-2`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <IconComp className="w-4 h-4 shrink-0" />
          <input
            type="text"
            value={block.title}
            onChange={(e) => onChange({ title: e.target.value })}
            placeholder="Callout Title..."
            className="bg-transparent border-0 outline-none p-0 text-sm font-semibold text-zinc-100 placeholder:text-zinc-500 focus:ring-0"
          />
        </div>

        <select
          value={block.variant}
          onChange={(e) => onChange({ variant: e.target.value as any })}
          className="text-xs bg-zinc-900 border border-zinc-800 text-zinc-300 font-mono rounded px-2 py-0.5 outline-none"
        >
          <option value="note">Note</option>
          <option value="tip">Tip</option>
          <option value="warning">Warning</option>
          <option value="caution">Caution</option>
        </select>
      </div>

      <textarea
        value={block.message}
        onChange={(e) => onChange({ message: e.target.value })}
        placeholder="Enter callout explanation or details..."
        rows={2}
        className="w-full resize-y bg-transparent border-0 outline-none p-0 text-xs leading-relaxed text-zinc-200 placeholder:text-zinc-500 focus:ring-0"
      />
    </div>
  );
}
