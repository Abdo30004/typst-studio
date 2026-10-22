"use client";

import React from "react";
import { ProjectSummary } from "@/types";
import { Copy, Trash2, ArrowUpRight, Clock } from "lucide-react";

interface Props {
  project: ProjectSummary;
  onOpen: (id: string) => void;
  onDuplicate: (project: ProjectSummary, e: React.MouseEvent) => void;
  onDelete: (id: string, e: React.MouseEvent) => void;
}

export function ProjectCard({ project, onOpen, onDuplicate, onDelete }: Props) {
  const formattedDate = new Date(project.updatedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const formattedTime = new Date(project.updatedAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      onClick={() => onOpen(project.id)}
      className="group rounded-xl border border-zinc-800/80 bg-zinc-900/30 hover:bg-zinc-900/80 hover:border-zinc-500 p-5 cursor-pointer transition-all hover:shadow-xl flex flex-col justify-between space-y-4"
    >
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700/80 font-medium tracking-wider">
            {project.preset.replace("_", " ")}
          </span>

          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => onDuplicate(project, e)}
              className="text-zinc-400 hover:text-white p-1.5 rounded hover:bg-zinc-800 transition-colors"
              title="Duplicate document"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={(e) => onDelete(project.id, e)}
              className="text-zinc-400 hover:text-rose-400 p-1.5 rounded hover:bg-zinc-800 transition-colors"
              title="Delete document"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-zinc-100 group-hover:text-white transition-colors truncate tracking-tight">
            {project.title}
          </h3>
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-zinc-500 mt-2">
            <Clock className="w-3 h-3" />
            <span>
              {formattedDate} • {formattedTime}
            </span>
          </div>
        </div>
      </div>

      <div className="pt-3 border-t border-zinc-800/60 flex items-center justify-between text-xs font-mono text-zinc-500 group-hover:text-zinc-200 transition-colors">
        <span>Open Atelier</span>
        <ArrowUpRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
      </div>
    </div>
  );
}
