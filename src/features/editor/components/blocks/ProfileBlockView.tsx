"use client";

import React from "react";
import { ProfileCardBlock } from "@/types/document";
import { User } from "lucide-react";

interface Props {
  block: ProfileCardBlock;
  onChange: (updated: Partial<ProfileCardBlock>) => void;
}

export function ProfileBlockView({ block, onChange }: Props) {
  return (
    <div className="p-4 bg-zinc-950/90 border border-zinc-800 rounded-lg flex items-start gap-4">
      <div className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0 text-zinc-300">
        <User className="w-6 h-6" />
      </div>

      <div className="flex-1 space-y-1">
        <input
          type="text"
          value={block.name}
          onChange={(e) => onChange({ name: e.target.value })}
          placeholder="Full Name..."
          className="w-full bg-transparent border-0 outline-none p-0 text-base font-bold text-zinc-100 placeholder:text-zinc-600 focus:ring-0"
        />

        <input
          type="text"
          value={block.role}
          onChange={(e) => onChange({ role: e.target.value })}
          placeholder="Role / Title (e.g. Lead Engineer)..."
          className="w-full bg-transparent border-0 outline-none p-0 text-xs font-mono font-medium text-zinc-400 placeholder:text-zinc-600 focus:ring-0"
        />

        <textarea
          value={block.bio}
          onChange={(e) => onChange({ bio: e.target.value })}
          placeholder="Brief professional bio or summary..."
          rows={2}
          className="w-full resize-y bg-transparent border-0 outline-none p-0 text-xs text-zinc-300 placeholder:text-zinc-600 focus:ring-0 pt-1"
        />

        <input
          type="text"
          value={block.contact || ""}
          onChange={(e) => onChange({ contact: e.target.value })}
          placeholder="Contact / Links (e.g. email@example.com • github.com/user)"
          className="w-full bg-transparent border-0 outline-none p-0 text-[11px] font-mono text-zinc-400 placeholder:text-zinc-600 focus:ring-0 pt-1"
        />
      </div>
    </div>
  );
}
