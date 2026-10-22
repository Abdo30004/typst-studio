"use client";

import React, { useState } from "react";
import { Copy, Check, Download, X, Terminal, Code } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  typstCode: string;
  documentTitle: string;
}

export function TypstCodeDrawer({
  isOpen,
  onClose,
  typstCode,
  documentTitle,
}: Props) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(typstCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadTyp = () => {
    const blob = new Blob([typstCode], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${(documentTitle || "document").replace(/[^a-zA-Z0-9_-]/g, "_")}.typ`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const lines = typstCode.split("\n");

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-[520px] max-w-full bg-[#09090b] border-l border-zinc-850 shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
      {/* Drawer Header */}
      <div className="p-4 border-b border-zinc-850 flex items-center justify-between bg-zinc-950/80">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-zinc-300" />
          <h3 className="text-sm font-semibold text-zinc-100">
            Typst Code Inspector
          </h3>
          <span className="text-[11px] bg-zinc-900 border border-zinc-800 text-zinc-400 px-2 py-0.5 rounded font-mono">
            {lines.length} lines
          </span>
        </div>

        <div className="flex items-center gap-2 font-mono">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownloadTyp}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded bg-white text-zinc-950 hover:bg-zinc-200 transition-colors"
            title="Download .typ file"
          >
            <Download className="w-3.5 h-3.5" />
            <span>.typ</span>
          </button>

          <button
            onClick={onClose}
            className="p-1 rounded text-zinc-400 hover:text-white hover:bg-zinc-850 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Code Container */}
      <div className="flex-1 overflow-auto p-4 font-mono text-xs leading-relaxed text-zinc-300 bg-[#09090b]">
        <div className="flex">
          {/* Line Numbers */}
          <div className="pr-4 select-none text-slate-600 text-right font-mono text-xs border-r border-slate-800/80 mr-4">
            {lines.map((_, i) => (
              <div key={i}>{i + 1}</div>
            ))}
          </div>

          {/* Code Text */}
          <pre className="flex-1 overflow-x-auto whitespace-pre font-mono text-xs text-slate-200">
            <code>{typstCode}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}
