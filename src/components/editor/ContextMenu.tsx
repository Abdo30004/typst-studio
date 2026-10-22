"use client";

import React, { useEffect, useRef } from "react";
import {
  Copy,
  Trash2,
  ArrowUp,
  ArrowDown,
  Code,
  Palette,
  PlusCircle,
  Layers,
} from "lucide-react";

export interface ContextMenuPosition {
  x: number;
  y: number;
  blockId: string;
}

interface Props {
  position: ContextMenuPosition | null;
  onClose: () => void;
  onDuplicate: (blockId: string) => void;
  onDelete: (blockId: string) => void;
  onMoveUp: (blockId: string) => void;
  onMoveDown: (blockId: string) => void;
  onCopyTypst: (blockId: string) => void;
  onInspect: (blockId: string) => void;
  onAddBelow: (blockId: string) => void;
}

export function ContextMenu({
  position,
  onClose,
  onDuplicate,
  onDelete,
  onMoveUp,
  onMoveDown,
  onCopyTypst,
  onInspect,
  onAddBelow,
}: Props) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  if (!position) return null;

  // Keep menu within viewport
  const menuWidth = 210;
  const menuHeight = 260;
  const safeX = Math.min(position.x, window.innerWidth - menuWidth - 10);
  const safeY = Math.min(position.y, window.innerHeight - menuHeight - 10);

  return (
    <div
      ref={menuRef}
      style={{ top: `${safeY}px`, left: `${safeX}px` }}
      className="fixed z-50 w-52 bg-slate-900/95 backdrop-blur-md border border-slate-700/80 rounded-xl shadow-2xl p-1.5 text-xs text-slate-200 select-none animate-in fade-in zoom-in-95 duration-100"
    >
      <div className="px-2 py-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800 flex items-center justify-between">
        <span>Block Actions</span>
        <Layers className="w-3 h-3 text-blue-400" />
      </div>

      <div className="py-1 space-y-0.5">
        <button
          onClick={() => {
            onDuplicate(position.blockId);
            onClose();
          }}
          className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-blue-600 hover:text-white transition-colors group"
        >
          <div className="flex items-center gap-2">
            <Copy className="w-3.5 h-3.5 text-slate-400 group-hover:text-white" />
            <span>Duplicate Block</span>
          </div>
          <span className="text-[10px] text-slate-500 group-hover:text-blue-200 font-mono">Ctrl+D</span>
        </button>

        <button
          onClick={() => {
            onAddBelow(position.blockId);
            onClose();
          }}
          className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-blue-600 hover:text-white transition-colors group"
        >
          <PlusCircle className="w-3.5 h-3.5 text-slate-400 group-hover:text-white" />
          <span>Add Block Below</span>
        </button>

        <div className="my-1 border-t border-slate-800" />

        <button
          onClick={() => {
            onMoveUp(position.blockId);
            onClose();
          }}
          className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-slate-800 transition-colors group"
        >
          <div className="flex items-center gap-2">
            <ArrowUp className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-200" />
            <span>Move Up</span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono">Alt+↑</span>
        </button>

        <button
          onClick={() => {
            onMoveDown(position.blockId);
            onClose();
          }}
          className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-slate-800 transition-colors group"
        >
          <div className="flex items-center gap-2">
            <ArrowDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-200" />
            <span>Move Down</span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono">Alt+↓</span>
        </button>

        <div className="my-1 border-t border-slate-800" />

        <button
          onClick={() => {
            onInspect(position.blockId);
            onClose();
          }}
          className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-slate-800 transition-colors group"
        >
          <Palette className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-200" />
          <span>Edit Appearance</span>
        </button>

        <button
          onClick={() => {
            onCopyTypst(position.blockId);
            onClose();
          }}
          className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-slate-800 transition-colors group"
        >
          <Code className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-200" />
          <span>Copy Typst Snippet</span>
        </button>

        <div className="my-1 border-t border-slate-800" />

        <button
          onClick={() => {
            onDelete(position.blockId);
            onClose();
          }}
          className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-red-600 hover:text-white text-red-400 transition-colors group"
        >
          <div className="flex items-center gap-2">
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete Block</span>
          </div>
          <span className="text-[10px] group-hover:text-red-200 font-mono">Del</span>
        </button>
      </div>
    </div>
  );
}
