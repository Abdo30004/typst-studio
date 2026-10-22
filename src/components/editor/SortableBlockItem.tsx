"use client";

import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { DocumentBlock } from "@/types/document";
import { BlockRenderer } from "./BlockRenderer";

interface Props {
  block: DocumentBlock;
  onUpdate: (updated: Partial<DocumentBlock>) => void;
  onDelete: () => void;
  isSelected?: boolean;
  onSelect?: () => void;
}

export function SortableBlockItem({
  block,
  onUpdate,
  onDelete,
  isSelected,
  onSelect,
}: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.35 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative touch-none">
      <BlockRenderer
        block={block}
        onUpdate={onUpdate}
        onDelete={onDelete}
        isSelected={isSelected}
        onSelect={onSelect}
        dragHandleProps={{ ...attributes, ...listeners }}
      />
    </div>
  );
}
