"use client";

import React from "react";
import { DocumentBlock } from "@/types/document";
import { HeadingBlockView } from "../blocks/HeadingBlockView";
import { TextBlockView } from "../blocks/TextBlockView";
import { CardBlockView } from "../blocks/CardBlockView";
import { CalloutBlockView } from "../blocks/CalloutBlockView";
import { MetricBlockView } from "../blocks/MetricBlockView";
import { ProfileBlockView } from "../blocks/ProfileBlockView";
import { ColumnsBlockView } from "../blocks/ColumnsBlockView";
import { ImageBlockView } from "../blocks/ImageBlockView";
import { TableBlockView } from "../blocks/TableBlockView";
import { CodeBlockView } from "../blocks/CodeBlockView";
import { DividerBlockView } from "../blocks/DividerBlockView";
import { Trash2, GripVertical, Settings2 } from "lucide-react";

interface Props {
  block: DocumentBlock;
  onUpdate: (updated: Partial<DocumentBlock>) => void;
  onDelete: () => void;
  isSelected?: boolean;
  onSelect?: () => void;
  dragHandleProps?: any;
}

export function BlockRenderer({
  block,
  onUpdate,
  onDelete,
  isSelected,
  onSelect,
  dragHandleProps,
}: Props) {
  const renderInner = () => {
    switch (block.type) {
      case "heading":
        return <HeadingBlockView block={block as any} onChange={onUpdate} />;
      case "text":
        return <TextBlockView block={block as any} onChange={onUpdate} />;
      case "card":
        return <CardBlockView block={block as any} onChange={onUpdate} />;
      case "card_callout":
        return <CalloutBlockView block={block as any} onChange={onUpdate} />;
      case "card_metric":
        return <MetricBlockView block={block as any} onChange={onUpdate} />;
      case "card_profile":
        return <ProfileBlockView block={block as any} onChange={onUpdate} />;
      case "columns":
        return (
          <ColumnsBlockView
            block={block as any}
            onChange={onUpdate}
            onSelectBlock={() => onSelect?.()}
            selectedBlockId={isSelected ? block.id : null}
          />
        );
      case "image":
        return <ImageBlockView block={block as any} onChange={onUpdate} />;
      case "table":
        return <TableBlockView block={block as any} onChange={onUpdate} />;
      case "code":
        return <CodeBlockView block={block as any} onChange={onUpdate} />;
      case "divider":
        return <DividerBlockView block={block as any} onChange={onUpdate} />;
      default:
        return <div className="text-red-400 text-xs">Unknown block: {(block as any).type}</div>;
    }
  };

  return (
    <div
      onClick={onSelect}
      className={`group/block relative rounded-lg border transition-all ${
        isSelected
          ? "border-blue-500/80 bg-slate-900/90 ring-1 ring-blue-500/30"
          : "border-slate-800/80 bg-slate-900/40 hover:border-slate-700/80"
      } p-3.5`}
    >
      {/* Top right quick actions */}
      <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover/block:opacity-100 transition-opacity z-10 bg-slate-900/90 backdrop-blur px-1.5 py-0.5 rounded border border-slate-700/70 shadow-sm">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSelect?.();
          }}
          title="Block Settings"
          className="p-1 text-slate-400 hover:text-blue-400 transition-colors"
        >
          <Settings2 className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          title="Delete Block"
          className="p-1 text-slate-400 hover:text-red-400 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>

        <div
          {...dragHandleProps}
          className="p-1 cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-200"
          title="Drag to reorder"
        >
          <GripVertical className="w-3.5 h-3.5" />
        </div>
      </div>

      <div className="w-full">{renderInner()}</div>
    </div>
  );
}
