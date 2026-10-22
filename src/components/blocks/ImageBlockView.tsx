"use client";

import React, { useRef } from "react";
import { ImageBlock } from "@/types/document";
import { Upload, ImageIcon, AlignLeft, AlignCenter, AlignRight } from "lucide-react";

interface Props {
  block: ImageBlock;
  onChange: (updated: Partial<ImageBlock>) => void;
}

export function ImageBlockView({ block, onChange }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.url) {
        onChange({ url: data.url });
      }
    } catch (err) {
      console.error("Image upload failed:", err);
    }
  };

  const alignClass = {
    left: "items-start",
    center: "items-center",
    right: "items-end",
  }[block.align || "center"];

  return (
    <div className={`flex flex-col ${alignClass} space-y-2`}>
      <div className="flex items-center gap-1 border-b border-slate-800 pb-1 mb-1 self-stretch justify-between">
        <span className="text-xs text-slate-400 font-medium">Image Block</span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onChange({ align: "left" })}
            className={`p-1 rounded text-xs ${
              block.align === "left" ? "bg-slate-700 text-white" : "text-slate-400 hover:text-white"
            }`}
          >
            <AlignLeft className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onChange({ align: "center" })}
            className={`p-1 rounded text-xs ${
              block.align === "center" ? "bg-slate-700 text-white" : "text-slate-400 hover:text-white"
            }`}
          >
            <AlignCenter className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onChange({ align: "right" })}
            className={`p-1 rounded text-xs ${
              block.align === "right" ? "bg-slate-700 text-white" : "text-slate-400 hover:text-white"
            }`}
          >
            <AlignRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {block.url ? (
        <div className="relative group/img max-w-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={block.url}
            alt={block.alt || "Uploaded"}
            className="max-h-72 rounded-md object-contain border border-slate-800"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="absolute top-2 right-2 bg-slate-900/80 backdrop-blur text-xs text-slate-300 px-2 py-1 rounded border border-slate-700 opacity-0 group-hover/img:opacity-100 transition-opacity"
          >
            Replace
          </button>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="w-full h-40 border-2 border-dashed border-slate-800 hover:border-blue-500 rounded-lg flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors bg-slate-900/30"
        >
          <ImageIcon className="w-8 h-8 text-slate-500" />
          <span className="text-xs text-slate-400 font-medium">
            Click to upload PNG, JPG, or SVG
          </span>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />

      <input
        type="text"
        value={block.caption || ""}
        onChange={(e) => onChange({ caption: e.target.value })}
        placeholder="Image caption (optional)..."
        className="w-full text-center bg-transparent border-0 outline-none p-0 text-xs italic text-slate-400 placeholder:text-slate-600 focus:ring-0"
      />
    </div>
  );
}
