"use client";

import React from "react";
import { MetricCardBlock } from "@/types/document";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface Props {
  block: MetricCardBlock;
  onChange: (updated: Partial<MetricCardBlock>) => void;
}

export function MetricBlockView({ block, onChange }: Props) {
  const trendColor = {
    positive: "text-emerald-400 bg-emerald-950/40 border-emerald-800/50",
    negative: "text-rose-400 bg-rose-950/40 border-rose-800/50",
    neutral: "text-slate-400 bg-slate-800 border-slate-700",
  }[block.changeType || "neutral"];

  const TrendIcon = {
    positive: TrendingUp,
    negative: TrendingDown,
    neutral: Minus,
  }[block.changeType || "neutral"];

  return (
    <div className="p-3.5 bg-slate-900/90 border border-slate-800 rounded-lg space-y-2">
      <input
        type="text"
        value={block.label}
        onChange={(e) => onChange({ label: e.target.value })}
        placeholder="Metric Label (e.g. Total Revenue)"
        className="w-full bg-transparent border-0 outline-none p-0 text-xs font-medium text-slate-400 placeholder:text-slate-600 focus:ring-0"
      />

      <input
        type="text"
        value={block.value}
        onChange={(e) => onChange({ value: e.target.value })}
        placeholder="Value (e.g. $1.2M or 99.9%)"
        className="w-full bg-transparent border-0 outline-none p-0 text-2xl font-bold text-slate-100 placeholder:text-slate-600 focus:ring-0 tracking-tight"
      />

      <div className="flex items-center gap-2 pt-1">
        <div className={`flex items-center gap-1 px-2 py-0.5 rounded text-xs border ${trendColor}`}>
          <TrendIcon className="w-3 h-3" />
          <input
            type="text"
            value={block.change || ""}
            onChange={(e) => onChange({ change: e.target.value })}
            placeholder="+12% YoY"
            className="w-20 bg-transparent border-0 outline-none p-0 text-xs focus:ring-0"
          />
        </div>

        <select
          value={block.changeType || "neutral"}
          onChange={(e) => onChange({ changeType: e.target.value as any })}
          className="text-[11px] bg-slate-950 border border-slate-800 text-slate-400 rounded px-1.5 py-0.5 outline-none"
        >
          <option value="positive">Positive</option>
          <option value="negative">Negative</option>
          <option value="neutral">Neutral</option>
        </select>
      </div>
    </div>
  );
}
