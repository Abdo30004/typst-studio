"use client";

import React from "react";
import { ProjectSummary } from "@/types";
import { Copy, Trash2, Calendar, ExternalLink } from "lucide-react";

interface Props {
  project: ProjectSummary;
  onOpen: (id: string) => void;
  onDuplicate: (project: ProjectSummary, e: React.MouseEvent) => void;
  onDelete: (id: string, e: React.MouseEvent) => void;
}

export function ProjectCard({ project, onOpen, onDuplicate, onDelete }: Props) {
  return (
    <div
      onClick={() => onOpen(project.id)}
      className="group rounded-2xl border border-slate-800/90 bg-slate-900/60 hover:bg-slate-900 hover:border-slate-700/80 p-5 cursor-pointer transition-all hover:shadow-xl hover:-translate-y-0.5 flex flex-col justify-between space-y-4"
    >
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase font-mono px-2.5 py-0.5 rounded-full bg-blue-950/60 text-blue-400 border border-blue-800/40 font-semibold">
            {project.preset.replace("_", " ")}
          </span>

          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => onDuplicate(project, e)}
              className="text-slate-400 hover:text-blue-400 p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
              title="Duplicate document"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={(e) => onDelete(project.id, e)}
              className="text-slate-400 hover:text-rose-400 p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
              title="Delete document"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <h3 className="text-sm font-bold text-slate-200 group-hover:text-blue-400 transition-colors truncate">
          {project.title}
        </h3>

        <div className="flex items-center gap-1 text-[11px] text-slate-500">
          <Calendar className="w-3 h-3" />
          <span>
            Updated {new Date(project.updatedAt).toLocaleDateString()} at{" "}
            {new Date(project.updatedAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
      </div>

      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 group-hover:text-slate-200">
        <span className="text-xs font-semibold">Open in Studio</span>
        <ExternalLink className="w-3.5 h-3.5 text-blue-400 group-hover:translate-x-0.5 transition-transform" />
      </div>
    </div>
  );
}
