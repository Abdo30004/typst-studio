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
    <div className="fixed inset-y-0 right-0 z-50 w-[520px] max-w-full bg-slate-950 border-l border-slate-800 shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
      {/* Drawer Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-blue-400" />
          <h3 className="text-sm font-semibold text-slate-100">
            Typst Code Inspector
          </h3>
          <span className="text-[11px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono">
            {lines.length} lines
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
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
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 transition-colors"
            title="Download .typ file"
          >
            <Download className="w-3.5 h-3.5" />
            <span>.typ</span>
          </button>

          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Code Container */}
      <div className="flex-1 overflow-auto p-4 font-mono text-xs leading-relaxed text-slate-300 bg-slate-950/90">
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
