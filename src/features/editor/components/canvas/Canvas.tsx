"use client";

import React from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { DocumentBlock } from "@/types/document";
import { SortableBlockItem } from "../blocks/SortableBlockItem";
import { Plus } from "lucide-react";

interface Props {
  blocks: DocumentBlock[];
  onReorder: (newBlocks: DocumentBlock[]) => void;
  onUpdateBlock: (blockId: string, updated: Partial<DocumentBlock>) => void;
  onDeleteBlock: (blockId: string) => void;
  selectedBlockId: string | null;
  onSelectBlock: (blockId: string) => void;
  onAddDefaultBlock: () => void;
}

export function Canvas({
  blocks,
  onReorder,
  onUpdateBlock,
  onDeleteBlock,
  selectedBlockId,
  onSelectBlock,
  onAddDefaultBlock,
}: Props) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 4,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = blocks.findIndex((b) => b.id === active.id);
      const newIndex = blocks.findIndex((b) => b.id === over.id);
      if (oldIndex !== -1 && newIndex !== -1) {
        onReorder(arrayMove(blocks, oldIndex, newIndex));
      }
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center bg-slate-900/50">
      <div className="w-full max-w-3xl space-y-3 pb-24">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={blocks.map((b) => b.id)}
            strategy={verticalListSortingStrategy}
          >
            {blocks.map((block) => (
              <SortableBlockItem
                key={block.id}
                block={block}
                onUpdate={(upd) => onUpdateBlock(block.id, upd)}
                onDelete={() => onDeleteBlock(block.id)}
                isSelected={selectedBlockId === block.id}
                onSelect={() => onSelectBlock(block.id)}
              />
            ))}
          </SortableContext>
        </DndContext>

        {blocks.length === 0 && (
          <div className="py-16 text-center border-2 border-dashed border-slate-800 rounded-xl p-8 space-y-3">
            <p className="text-slate-400 text-sm">
              Your canvas is currently empty.
            </p>
            <button
              onClick={onAddDefaultBlock}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-medium inline-flex items-center gap-1.5 shadow"
            >
              <Plus className="w-4 h-4" /> Add First Block
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
