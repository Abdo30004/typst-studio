"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { GripVertical, ArrowLeftRight, Columns, Maximize2, Minimize2 } from "lucide-react";

interface Props {
  leftPane: React.ReactNode;
  rightPane: React.ReactNode;
  defaultRatio?: number; // 20 to 80 (percentage)
  minRatio?: number;
  maxRatio?: number;
  leftTitle?: string;
  rightTitle?: string;
  storageKey?: string;
}

export function ResizableSplitView({
  leftPane,
  rightPane,
  defaultRatio = 50,
  minRatio = 20,
  maxRatio = 80,
  leftTitle = "Flow Builder",
  rightTitle = "Interactive Canvas",
  storageKey = "typst-editor-split-ratio",
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [splitRatio, setSplitRatio] = useState<number>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = parseFloat(saved);
        if (!isNaN(parsed) && parsed >= minRatio && parsed <= maxRatio) {
          return parsed;
        }
      }
    }
    return defaultRatio;
  });

  const [isDragging, setIsDragging] = useState(false);
  const [isSwapped, setIsSwapped] = useState(false);

  // Save ratio changes to localStorage
  const updateRatio = useCallback(
    (newRatio: number) => {
      const clamped = Math.min(maxRatio, Math.max(minRatio, newRatio));
      setSplitRatio(clamped);
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(storageKey, clamped.toString());
        } catch {
          // Ignore localStorage errors
        }
      }
    },
    [maxRatio, minRatio, storageKey]
  );

  // Handle pointer down on splitter bar
  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      setIsDragging(true);

      const handlePointerMove = (moveEvent: PointerEvent) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        if (rect.width <= 0) return;

        let relativeX = moveEvent.clientX - rect.left;
        let percentage = (relativeX / rect.width) * 100;

        if (isSwapped) {
          percentage = 100 - percentage;
        }

        updateRatio(percentage);
      };

      const handlePointerUp = () => {
        setIsDragging(false);
        window.removeEventListener("pointermove", handlePointerMove);
        window.removeEventListener("pointerup", handlePointerUp);
      };

      window.addEventListener("pointermove", handlePointerMove);
      window.addEventListener("pointerup", handlePointerUp);
    },
    [isSwapped, updateRatio]
  );

  // Double click splitter resets to 50/50
  const handleDoubleClick = () => {
    updateRatio(50);
  };

  const actualLeftRatio = isSwapped ? 100 - splitRatio : splitRatio;
  const actualRightRatio = 100 - actualLeftRatio;

  const firstPane = isSwapped ? rightPane : leftPane;
  const secondPane = isSwapped ? leftPane : rightPane;

  const firstTitle = isSwapped ? rightTitle : leftTitle;
  const secondTitle = isSwapped ? leftTitle : rightTitle;

  return (
    <div
      ref={containerRef}
      className={`flex-1 flex w-full h-full overflow-hidden select-none relative ${
        isDragging ? "cursor-col-resize select-none" : ""
      }`}
    >
      {/* First Pane */}
      <div
        style={{
          width: `${actualLeftRatio}%`,
          transition: isDragging ? "none" : "width 0.18s ease-out",
        }}
        className="h-full flex flex-col overflow-hidden relative"
      >
        {firstPane}
      </div>

      {/* Resizable Splitter Handle */}
      <div
        onPointerDown={handlePointerDown}
        onDoubleClick={handleDoubleClick}
        title="Drag to resize panels (Double-click for 50/50)"
        className={`w-3.5 -mx-1.5 z-30 flex flex-col items-center justify-center cursor-col-resize relative group transition-colors ${
          isDragging ? "bg-white/10" : "hover:bg-white/5"
        }`}
      >
        {/* Subtle center line */}
        <div
          className={`w-[2px] h-full transition-colors ${
            isDragging
              ? "bg-white shadow-[0_0_8px_rgba(255,255,255,0.4)]"
              : "bg-zinc-800 group-hover:bg-zinc-600"
          }`}
        />

        {/* Center Pill Handle */}
        <div
          className={`absolute top-1/2 -translate-y-1/2 rounded-full py-2 px-0.5 border shadow-lg flex flex-col items-center gap-1 transition-all ${
            isDragging
              ? "bg-white border-white text-zinc-950 scale-110 shadow-black/50"
              : "bg-zinc-900 border-zinc-750 text-zinc-400 group-hover:border-zinc-500 group-hover:text-zinc-200"
          }`}
        >
          <GripVertical className="w-3 h-3" />
        </div>

        {/* Floating Quick Ratio Bar on Hover/Drag */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-zinc-950/95 backdrop-blur border border-zinc-800 shadow-xl rounded-full px-2 py-0.5 flex items-center gap-1 text-[10px] text-zinc-300 font-mono pointer-events-auto z-40">
          <button
            onClick={(e) => {
              e.stopPropagation();
              updateRatio(isSwapped ? 60 : 40);
            }}
            className="px-1.5 py-0.5 rounded hover:bg-zinc-850 hover:text-white"
            title="Set 40% / 60%"
          >
            40:60
          </button>
          <span className="text-zinc-700">|</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              updateRatio(50);
            }}
            className="px-1.5 py-0.5 rounded hover:bg-zinc-850 hover:text-white font-bold"
            title="Reset 50% / 50%"
          >
            50:50
          </button>
          <span className="text-zinc-700">|</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              updateRatio(isSwapped ? 40 : 60);
            }}
            className="px-1.5 py-0.5 rounded hover:bg-zinc-850 hover:text-white"
            title="Set 60% / 40%"
          >
            60:40
          </button>
          <span className="text-zinc-700">|</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsSwapped((s) => !s);
            }}
            className="p-1 rounded hover:bg-zinc-850 hover:text-white"
            title="Swap Panels (Left <-> Right)"
          >
            <ArrowLeftRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Second Pane */}
      <div
        style={{
          width: `${actualRightRatio}%`,
          transition: isDragging ? "none" : "width 0.18s ease-out",
        }}
        className="h-full flex flex-col overflow-hidden relative"
      >
        {secondPane}
      </div>
    </div>
  );
}
