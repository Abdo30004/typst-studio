"use client";

import React from "react";
import { CodeBlock } from "@/types/document";
import { Code2 } from "lucide-react";

interface Props {
  block: CodeBlock;
  onChange: (updated: Partial<CodeBlock>) => void;
}

export function CodeBlockView({ block, onChange }: Props) {
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-950 overflow-hidden space-y-1">
      <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900 border-b border-slate-800 text-xs">
        <div className="flex items-center gap-2">
          <Code2 className="w-3.5 h-3.5 text-blue-400" />
          <input
            type="text"
            value={block.filename || ""}
            onChange={(e) => onChange({ filename: e.target.value })}
            placeholder="filename.ext (optional)..."
            className="bg-transparent border-0 outline-none p-0 text-slate-300 font-mono text-xs placeholder:text-slate-600 focus:ring-0"
          />
        </div>

        <select
          value={block.language || "text"}
          onChange={(e) => onChange({ language: e.target.value })}
          className="bg-slate-950 border border-slate-800 text-slate-400 rounded px-1.5 py-0.5 text-[11px] font-mono outline-none"
        >
          <option value="rust">Rust</option>
          <option value="typescript">TypeScript</option>
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="typst">Typst</option>
          <option value="json">JSON</option>
          <option value="bash">Bash / Shell</option>
          <option value="sql">SQL</option>
          <option value="text">Plain Text</option>
        </select>
      </div>

      <textarea
        value={block.code}
        onChange={(e) => onChange({ code: e.target.value })}
        placeholder="// Write or paste code snippet here..."
        rows={Math.max(3, (block.code || "").split("\n").length)}
        className="w-full resize-y bg-transparent p-3 font-mono text-xs text-slate-200 outline-none placeholder:text-slate-600 focus:ring-0 leading-relaxed"
      />
    </div>
  );
}
