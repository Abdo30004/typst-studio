"use client";

import React from "react";
import { DocumentPreset } from "@/types";
import { FileText, Briefcase, Presentation, BookOpen, Sparkles } from "lucide-react";

interface Props {
  onSelectPreset: (preset: DocumentPreset) => void;
}

export function TemplateGallery({ onSelectPreset }: Props) {
  const presetCards: {
    preset: DocumentPreset;
    title: string;
    description: string;
    badge: string;
    icon: any;
    gradient: string;
    shadow: string;
  }[] = [
    {
      preset: "a4_document",
      title: "Executive Report",
      description: "Clean standard technical documentation or business proposal with page numbering.",
      badge: "Standard",
      icon: FileText,
      gradient: "from-blue-600 via-indigo-600 to-violet-600",
      shadow: "shadow-blue-500/20",
    },
    {
      preset: "resume",
      title: "Modern Resume",
      description: "High-density curriculum vitae with profile bio, experience blocks, and metrics.",
      badge: "Career",
      icon: Briefcase,
      gradient: "from-emerald-600 via-teal-600 to-cyan-600",
      shadow: "shadow-emerald-500/20",
    },
    {
      preset: "presentation_16_9",
      title: "Slide Deck (16:9)",
      description: "Landscape card-based slide layout optimized for projection & PDFs.",
      badge: "Deck",
      icon: Presentation,
      gradient: "from-purple-600 via-pink-600 to-rose-600",
      shadow: "shadow-purple-500/20",
    },
    {
      preset: "cheatsheet",
      title: "Reference Cheatsheet",
      description: "Multi-column landscape quick reference packed with code and tables.",
      badge: "Technical",
      icon: BookOpen,
      gradient: "from-amber-600 via-orange-600 to-red-600",
      shadow: "shadow-amber-500/20",
    },
  ];

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Start from a Canva-Grade Template
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {presetCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.preset}
              onClick={() => onSelectPreset(card.preset)}
              className={`group relative rounded-2xl border border-slate-800/90 bg-slate-900/60 hover:bg-slate-900 hover:border-slate-700/80 p-5 cursor-pointer transition-all hover:shadow-2xl ${card.shadow} hover:-translate-y-1 flex flex-col justify-between`}
            >
              <div className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <div
                    className={`w-11 h-11 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center text-white shadow-md`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                    {card.badge}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-200 group-hover:text-blue-400 transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed mt-1">
                    {card.description}
                  </p>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 group-hover:text-slate-200">
                <span className="font-semibold text-xs">Use Template</span>
                <span className="text-blue-400 group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
