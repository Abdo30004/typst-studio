"use client";

import React, { useEffect, useRef } from "react";
import {
  Copy,
  Trash2,
  ArrowUp,
  ArrowDown,
  Code,
  Sliders,
  PlusCircle,
  Square,
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

  const menuWidth = 220;
  const menuHeight = 270;
  const safeX = Math.min(position.x, window.innerWidth - menuWidth - 10);
  const safeY = Math.min(position.y, window.innerHeight - menuHeight - 10);

  return (
    <div
      ref={menuRef}
      style={{ top: `${safeY}px`, left: `${safeX}px` }}
      className="fixed z-50 w-56 bg-zinc-950 border border-zinc-800 rounded-lg shadow-2xl p-1.5 text-xs text-zinc-200 select-none animate-in fade-in zoom-in-95 duration-100 font-mono"
    >
      <div className="px-2.5 py-1 text-[10px] font-mono uppercase tracking-[0.12em] text-zinc-500 border-b border-zinc-900 flex items-center justify-between">
        <span>Block Commands</span>
        <Square className="w-2.5 h-2.5 text-zinc-500" />
      </div>

      <div className="py-1 space-y-0.5 font-sans">
        <button
          onClick={() => {
            onDuplicate(position.blockId);
            onClose();
          }}
          className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-md hover:bg-zinc-900 hover:text-white transition-colors group text-xs"
        >
          <div className="flex items-center gap-2">
            <Copy className="w-3.5 h-3.5 text-zinc-400 group-hover:text-white" />
            <span>Duplicate Block</span>
          </div>
          <span className="text-[10px] text-zinc-500 font-mono">Ctrl+D</span>
        </button>

        <button
          onClick={() => {
            onAddBelow(position.blockId);
            onClose();
          }}
          className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md hover:bg-zinc-900 hover:text-white transition-colors group text-xs"
        >
          <PlusCircle className="w-3.5 h-3.5 text-zinc-400 group-hover:text-white" />
          <span>Add Block Below</span>
        </button>

        <div className="my-1 border-t border-zinc-900" />

        <button
          onClick={() => {
            onMoveUp(position.blockId);
            onClose();
          }}
          className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-md hover:bg-zinc-900 transition-colors group text-xs"
        >
          <div className="flex items-center gap-2">
            <ArrowUp className="w-3.5 h-3.5 text-zinc-400 group-hover:text-white" />
            <span>Move Up</span>
          </div>
          <span className="text-[10px] text-zinc-500 font-mono">Alt+↑</span>
        </button>

        <button
          onClick={() => {
            onMoveDown(position.blockId);
            onClose();
          }}
          className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-md hover:bg-zinc-900 transition-colors group text-xs"
        >
          <div className="flex items-center gap-2">
            <ArrowDown className="w-3.5 h-3.5 text-zinc-400 group-hover:text-white" />
            <span>Move Down</span>
          </div>
          <span className="text-[10px] text-zinc-500 font-mono">Alt+↓</span>
        </button>

        <div className="my-1 border-t border-zinc-900" />

        <button
          onClick={() => {
            onInspect(position.blockId);
            onClose();
          }}
          className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md hover:bg-zinc-900 transition-colors group text-xs"
        >
          <Sliders className="w-3.5 h-3.5 text-zinc-400 group-hover:text-white" />
          <span>Inspect Specifications</span>
        </button>

        <button
          onClick={() => {
            onCopyTypst(position.blockId);
            onClose();
          }}
          className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md hover:bg-zinc-900 transition-colors group text-xs"
        >
          <Code className="w-3.5 h-3.5 text-zinc-400 group-hover:text-white" />
          <span>Copy Typst Snippet</span>
        </button>

        <div className="my-1 border-t border-zinc-900" />

        <button
          onClick={() => {
            onDelete(position.blockId);
            onClose();
          }}
          className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-zinc-400 hover:bg-rose-950/60 hover:text-rose-300 transition-colors group text-xs"
        >
          <div className="flex items-center gap-2">
            <Trash2 className="w-3.5 h-3.5 text-zinc-500 group-hover:text-rose-400" />
            <span>Delete Block</span>
          </div>
          <span className="text-[10px] font-mono text-zinc-600 group-hover:text-rose-400">Del</span>
        </button>
      </div>
    </div>
  );
}
