"use client";

import React from "react";
import { DividerBlock } from "@/types/document";

interface Props {
  block: DividerBlock;
  onChange: (updated: Partial<DividerBlock>) => void;
}

export function DividerBlockView({ block }: Props) {
  return (
    <div className="py-2 flex items-center justify-center">
      <div className="w-full border-t border-slate-700/60" />
    </div>
  );
}
