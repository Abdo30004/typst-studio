"use client";

import React from "react";
import { ColumnsBlock, DocumentBlock } from "@/types/document";
import { Plus, Trash2 } from "lucide-react";
import { BlockRenderer } from "./BlockRenderer";

interface Props {
  block: ColumnsBlock;
  onChange: (updated: Partial<ColumnsBlock>) => void;
  onSelectBlock?: (blockId: string) => void;
  selectedBlockId?: string | null;
}

export function ColumnsBlockView({
  block,
  onChange,
  onSelectBlock,
  selectedBlockId,
}: Props) {
  const columnsCount = block.columnsCount || 2;

  const handleAddBlockToColumn = (colIndex: number) => {
    const newBlock: DocumentBlock = {
      id: "b-" + Math.random().toString(36).substring(2, 9),
      type: "card",
      title: "Column Card",
      content: "Content inside column block.",
      fillColor: "#1e293b",
      strokeColor: "#334155",
      padding: 12,
    };

    const newColumns = [...block.columns];
    if (!newColumns[colIndex]) {
      newColumns[colIndex] = { id: `col-${colIndex}`, blocks: [] };
    }
    newColumns[colIndex] = {
      ...newColumns[colIndex],
      blocks: [...newColumns[colIndex].blocks, newBlock],
    };

    onChange({ columns: newColumns });
  };

  const handleUpdateInnerBlock = (
    colIndex: number,
    blockId: string,
    updated: Partial<DocumentBlock>
  ) => {
    const newColumns = [...block.columns];
    newColumns[colIndex] = {
      ...newColumns[colIndex],
      blocks: newColumns[colIndex].blocks.map((b) =>
        b.id === blockId ? ({ ...b, ...updated } as DocumentBlock) : b
      ),
    };
    onChange({ columns: newColumns });
  };

  const handleDeleteInnerBlock = (colIndex: number, blockId: string) => {
    const newColumns = [...block.columns];
    newColumns[colIndex] = {
      ...newColumns[colIndex],
      blocks: newColumns[colIndex].blocks.filter((b) => b.id !== blockId),
    };
    onChange({ columns: newColumns });
  };

  return (
    <div className="space-y-2 border border-dashed border-zinc-800 p-3 rounded-lg bg-zinc-950/40">
      <div className="flex items-center justify-between text-xs text-zinc-400 border-b border-zinc-800 pb-2 font-mono">
        <span className="font-semibold text-zinc-200">Multi-Column Layout</span>
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-zinc-500 uppercase">Columns:</span>
          <button
            onClick={() => {
              if (columnsCount !== 2) {
                onChange({
                  columnsCount: 2,
                  columns: [
                    block.columns[0] || { id: "col-0", blocks: [] },
                    block.columns[1] || { id: "col-1", blocks: [] },
                  ],
                });
              }
            }}
            className={`px-2 py-0.5 rounded text-xs transition-colors ${
              columnsCount === 2 ? "bg-white text-zinc-950 font-bold shadow-xs" : "bg-zinc-900 border border-zinc-800 text-zinc-400"
            }`}
          >
            2 Columns
          </button>
          <button
            onClick={() => {
              if (columnsCount !== 3) {
                onChange({
                  columnsCount: 3,
                  columns: [
                    block.columns[0] || { id: "col-0", blocks: [] },
                    block.columns[1] || { id: "col-1", blocks: [] },
                    block.columns[2] || { id: "col-2", blocks: [] },
                  ],
                });
              }
            }}
            className={`px-2 py-0.5 rounded text-xs transition-colors ${
              columnsCount === 3 ? "bg-white text-zinc-950 font-bold shadow-xs" : "bg-zinc-900 border border-zinc-800 text-zinc-400"
            }`}
          >
            3 Columns
          </button>
        </div>
      </div>

      <div
        className={`grid gap-3 pt-1 ${
          columnsCount === 3 ? "grid-cols-3" : "grid-cols-2"
        }`}
      >
        {Array.from({ length: columnsCount }).map((_, colIdx) => {
          const colData = block.columns[colIdx] || { id: `col-${colIdx}`, blocks: [] };
          return (
            <div
              key={colIdx}
              className="border border-zinc-850 rounded-md p-2 bg-zinc-950/60 min-h-[100px] flex flex-col justify-between space-y-2"
            >
              <div className="space-y-2">
                {colData.blocks.map((innerBlock) => (
                  <div key={innerBlock.id} className="relative group/inner">
                    <BlockRenderer
                      block={innerBlock}
                      onUpdate={(upd: Partial<DocumentBlock>) => handleUpdateInnerBlock(colIdx, innerBlock.id, upd)}
                      onDelete={() => handleDeleteInnerBlock(colIdx, innerBlock.id)}
                      isSelected={selectedBlockId === innerBlock.id}
                      onSelect={() => onSelectBlock?.(innerBlock.id)}
                    />
                  </div>
                ))}
              </div>

              <button
                onClick={() => handleAddBlockToColumn(colIdx)}
                className="w-full py-1.5 border border-dashed border-zinc-700/80 rounded text-xs text-zinc-400 hover:text-white hover:border-zinc-500 flex items-center justify-center gap-1 transition-colors font-mono"
              >
                <Plus className="w-3.5 h-3.5" /> Add Block
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
