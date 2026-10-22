"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { PRESET_CONFIGS } from "@/lib/typst/presets";
import { DocumentPreset } from "@/types/document";
import { ToastContainer, showToast } from "@/components/ui/toast";
import {
  FileText,
  Plus,
  Trash2,
  ExternalLink,
  Presentation,
  BookOpen,
  Briefcase,
  Layers,
  Sparkles,
  Loader2,
  Search,
  Copy,
  Calendar,
  Grid,
} from "lucide-react";

interface ProjectSummary {
  id: string;
  title: string;
  preset: string;
  updatedAt: string;
  createdAt: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/projects");
      const data = await res.json();
      if (Array.isArray(data)) {
        setProjects(data);
      }
    } catch (err) {
      console.error("Failed to load projects:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreateFromPreset = async (preset: DocumentPreset, defaultTitle?: string) => {
    setIsCreating(true);
    showToast("Creating new document...", "info");
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: defaultTitle || PRESET_CONFIGS[preset].label,
          preset,
        }),
      });
      const data = await res.json();
      if (data.id) {
        router.push(`/editor/${data.id}`);
      }
    } catch (err) {
      console.error("Create project error:", err);
      showToast("Failed to create document", "error");
      setIsCreating(false);
    }
  };

  const handleDeleteProject = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this document?")) return;

    try {
      await fetch(`/api/projects/${id}`, { method: "DELETE" });
      setProjects((prev) => prev.filter((p) => p.id !== id));
      showToast("Document deleted", "info");
    } catch (err) {
      console.error("Delete error:", err);
      showToast("Failed to delete document", "error");
    }
  };

  const handleDuplicateProject = async (proj: ProjectSummary, e: React.MouseEvent) => {
    e.stopPropagation();
    showToast("Duplicating document...", "info");
    try {
      // Fetch full project
      const res = await fetch(`/api/projects/${proj.id}`);
      const full = await res.json();

      const createRes = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: `${proj.title} (Copy)`,
          preset: proj.preset,
          documentState: full.documentState,
        }),
      });
      const duplicated = await createRes.json();
      setProjects((prev) => [duplicated, ...prev]);
      showToast("Document duplicated!", "success");
    } catch (err) {
      console.error("Duplicate error:", err);
      showToast("Failed to duplicate document", "error");
    }
  };

  const filteredProjects = useMemo(() => {
    if (!searchQuery.trim()) return projects;
    return projects.filter((p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [projects, searchQuery]);

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
      description: "A4 document with clean header metrics, tables & callout cards.",
      badge: "Popular",
      icon: FileText,
      gradient: "from-blue-600 via-indigo-600 to-violet-600",
      shadow: "shadow-blue-500/20",
    },
    {
      preset: "resume",
      title: "Modern Resume / CV",
      description: "High-density two-column layout with skills, experience, and KPI badges.",
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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans select-none">
      <ToastContainer />

      {/* Top Banner Navigation */}
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-20 px-6 sm:px-10 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/25 text-white font-bold">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-slate-100 tracking-tight">
                Typst Studio
              </h1>
              <span className="text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/25 px-2 py-0.5 rounded-full font-mono font-semibold">
                Canva Edition
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Drag-and-drop document design compiled with Typst
            </p>
          </div>
        </div>

        <button
          onClick={() => handleCreateFromPreset("a4_document", "Untitled Document")}
          disabled={isCreating}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-500/25 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
        >
          {isCreating ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Plus className="w-4 h-4" />
          )}
          <span>Create Blank Document</span>
        </button>
      </header>

      {/* Main Studio Body */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 sm:px-10 py-8 space-y-10">
        {/* Template Gallery Section */}
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
                  onClick={() => handleCreateFromPreset(card.preset)}
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
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed line-clamp-2">
                        {card.description}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 flex items-center justify-between text-xs font-semibold text-blue-400 group-hover:text-blue-300">
                    <span>Use Template</span>
                    <Plus className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Existing Projects Library Section */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Grid className="w-4 h-4 text-blue-400" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Your Documents ({projects.length})
              </h2>
            </div>

            {/* Search filter bar */}
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search documents..."
                className="w-full bg-slate-900/80 border border-slate-800 focus:border-blue-500 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 outline-none transition-colors"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="py-16 flex flex-col items-center justify-center text-slate-500 gap-2">
              <Loader2 className="w-7 h-7 animate-spin text-blue-500" />
              <span className="text-xs">Loading documents...</span>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-center py-16 border-2 border-dashed border-slate-800 rounded-2xl bg-slate-900/20 p-8 space-y-3">
              <FileText className="w-10 h-10 text-slate-600 mx-auto" />
              <p className="text-sm font-semibold text-slate-300">
                {searchQuery ? "No matching documents found" : "No saved documents yet"}
              </p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                {searchQuery
                  ? "Try searching for a different keyword or create a new document."
                  : "Pick a starter template above or click New Blank Document to compose your first Typst document."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProjects.map((proj) => (
                <div
                  key={proj.id}
                  onClick={() => router.push(`/editor/${proj.id}`)}
                  className="group rounded-2xl border border-slate-800/90 bg-slate-900/60 hover:bg-slate-900 hover:border-slate-700/80 p-5 cursor-pointer transition-all hover:shadow-xl hover:-translate-y-0.5 flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-mono px-2.5 py-0.5 rounded-full bg-blue-950/60 text-blue-400 border border-blue-800/40 font-semibold">
                        {proj.preset.replace("_", " ")}
                      </span>

                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => handleDuplicateProject(proj, e)}
                          className="text-slate-400 hover:text-blue-400 p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
                          title="Duplicate document"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => handleDeleteProject(proj.id, e)}
                          className="text-slate-400 hover:text-rose-400 p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
                          title="Delete document"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <h3 className="text-sm font-bold text-slate-200 group-hover:text-blue-400 transition-colors truncate">
                      {proj.title}
                    </h3>

                    <div className="flex items-center gap-1 text-[11px] text-slate-500">
                      <Calendar className="w-3 h-3" />
                      <span>
                        Updated {new Date(proj.updatedAt).toLocaleDateString()} at{" "}
                        {new Date(proj.updatedAt).toLocaleTimeString([], {
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
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
