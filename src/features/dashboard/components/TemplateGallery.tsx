"use client";

import React from "react";
import { DocumentPreset } from "@/types";
import { ArrowUpRight, Compass } from "lucide-react";

interface Props {
  onSelectPreset: (preset: DocumentPreset) => void;
}

export function TemplateGallery({ onSelectPreset }: Props) {
  const templates: {
    preset: DocumentPreset;
    title: string;
    subtitle: string;
    format: string;
    specimen: React.ReactNode;
  }[] = [
    {
      preset: "a4_document",
      title: "Executive Architecture Brief",
      subtitle: "Formal technical brief with structured sections, metadata callouts, and page counter.",
      format: "A4 PORTRAIT • 210 × 297 MM",
      specimen: (
        <div className="w-full h-28 bg-zinc-950 border border-zinc-800 rounded p-2.5 flex flex-col justify-between group-hover:border-zinc-600 transition-colors">
          <div className="space-y-1.5">
            <div className="h-2 w-3/4 bg-zinc-300 rounded-xs" />
            <div className="h-1 w-1/2 bg-zinc-600 rounded-xs" />
            <div className="pt-1.5 space-y-1">
              <div className="h-1 w-full bg-zinc-800 rounded-xs" />
              <div className="h-1 w-5/6 bg-zinc-800 rounded-xs" />
              <div className="h-1 w-4/6 bg-zinc-800 rounded-xs" />
            </div>
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-zinc-900 text-[9px] font-mono text-zinc-500">
            <span>SEC. 01</span>
            <span>P. 1 / 1</span>
          </div>
        </div>
      ),
    },
    {
      preset: "resume",
      title: "Curriculum Vitae Specimen",
      subtitle: "Minimalist two-column profile with typography hierarchy, verified metrics, and career timeline.",
      format: "A4 DENSITY • SWISS GRID",
      specimen: (
        <div className="w-full h-28 bg-zinc-950 border border-zinc-800 rounded p-2.5 flex flex-col justify-between group-hover:border-zinc-600 transition-colors">
          <div className="flex items-center gap-2 pb-1.5 border-b border-zinc-800">
            <div className="w-4 h-4 rounded-full bg-zinc-300 shrink-0" />
            <div className="space-y-0.5 w-full">
              <div className="h-1.5 w-1/3 bg-zinc-300 rounded-xs" />
              <div className="h-1 w-1/4 bg-zinc-600 rounded-xs" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-1.5 pt-1">
            <div className="col-span-1 space-y-1">
              <div className="h-1 w-full bg-zinc-700 rounded-xs" />
              <div className="h-1 w-3/4 bg-zinc-800 rounded-xs" />
            </div>
            <div className="col-span-2 space-y-1">
              <div className="h-1 w-full bg-zinc-700 rounded-xs" />
              <div className="h-1 w-5/6 bg-zinc-800 rounded-xs" />
            </div>
          </div>
          <div className="text-[9px] font-mono text-zinc-600 text-right">SYSTEMS ARCHITECT</div>
        </div>
      ),
    },
    {
      preset: "presentation_16_9",
      title: "Keynote Specimen Slide",
      subtitle: "Widescreen display canvas optimized for high-contrast projection, charts, and executive review.",
      format: "16:9 RATIO • PROJECTION",
      specimen: (
        <div className="w-full h-28 bg-zinc-950 border border-zinc-800 rounded p-2.5 flex flex-col justify-between group-hover:border-zinc-600 transition-colors">
          <div className="flex justify-between items-start">
            <span className="text-[9px] font-mono text-zinc-500">01 / KEYNOTE</span>
            <div className="h-1 w-8 bg-zinc-700 rounded-xs" />
          </div>
          <div className="space-y-1.5 my-auto">
            <div className="h-3 w-4/5 bg-white rounded-xs" />
            <div className="h-1.5 w-1/2 bg-zinc-500 rounded-xs" />
          </div>
          <div className="h-0.5 w-full bg-zinc-800" />
        </div>
      ),
    },
    {
      preset: "cheatsheet",
      title: "Technical Reference Plate",
      subtitle: "Multi-column compact landscape layout packed with monospace code snippets and tabular indices.",
      format: "LANDSCAPE • DENSE MONO",
      specimen: (
        <div className="w-full h-28 bg-zinc-950 border border-zinc-800 rounded p-2 flex flex-col justify-between group-hover:border-zinc-600 transition-colors font-mono">
          <div className="grid grid-cols-3 gap-1.5 h-full">
            <div className="border-r border-zinc-800 pr-1 space-y-1">
              <div className="h-1.5 w-full bg-zinc-500" />
              <div className="h-1 w-4/5 bg-zinc-800" />
              <div className="h-1 w-3/5 bg-zinc-800" />
            </div>
            <div className="border-r border-zinc-800 pr-1 space-y-1">
              <div className="h-1.5 w-full bg-zinc-500" />
              <div className="h-1 w-5/6 bg-zinc-800" />
              <div className="h-1 w-2/3 bg-zinc-800" />
            </div>
            <div className="space-y-1">
              <div className="h-1.5 w-full bg-zinc-500" />
              <div className="h-1 w-3/4 bg-zinc-800" />
              <div className="h-1 w-1/2 bg-zinc-800" />
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <section className="space-y-5">
      <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-zinc-400" />
          <h2 className="text-xs font-mono uppercase tracking-[0.15em] text-zinc-400 font-medium">
            Atelier Standards & Specimen Presets
          </h2>
        </div>
        <span className="text-[11px] font-mono text-zinc-600">
          Native Typst v0.12 AST
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {templates.map((tpl) => (
          <div
            key={tpl.preset}
            onClick={() => onSelectPreset(tpl.preset)}
            className="group relative rounded-xl border border-zinc-800/80 bg-zinc-900/40 hover:bg-zinc-900/90 hover:border-zinc-500 p-4 cursor-pointer transition-all hover:shadow-2xl flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              {/* Miniature Specimen Visual */}
              {tpl.specimen}

              <div className="space-y-1.5 pt-1">
                <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                  {tpl.format}
                </div>
                <h3 className="text-sm font-semibold text-zinc-100 group-hover:text-white transition-colors tracking-tight">
                  {tpl.title}
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed line-clamp-2">
                  {tpl.subtitle}
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-zinc-800/60 flex items-center justify-between text-xs font-mono text-zinc-500 group-hover:text-zinc-200 transition-colors">
              <span>Compose Specimen</span>
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform text-zinc-400 group-hover:text-white" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
