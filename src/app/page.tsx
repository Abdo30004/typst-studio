"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { PRESET_CONFIGS } from "@/lib/typst/presets";
import { DocumentPreset, ProjectSummary } from "@/types";
import { ToastContainer, showToast } from "@/components/ui/toast";
import { TemplateGallery, ProjectCard } from "@/features/dashboard";
import { ThemeQuickSwitcher } from "@/components/theme/ThemeQuickSwitcher";
import {
  FileText,
  Plus,
  Loader2,
  Search,
  LayoutGrid,
} from "lucide-react";

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
    showToast("Initializing document canvas...", "info");
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
      showToast("Failed to initialize document", "error");
      setIsCreating(false);
    }
  };

  const handleDeleteProject = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this document?")) return;

    try {
      await fetch(`/api/projects/${id}`, { method: "DELETE" });
      setProjects((prev) => prev.filter((p) => p.id !== id));
      showToast("Document removed", "info");
    } catch (err) {
      console.error("Delete error:", err);
      showToast("Failed to delete document", "error");
    }
  };

  const handleDuplicateProject = async (proj: ProjectSummary, e: React.MouseEvent) => {
    e.stopPropagation();
    showToast("Duplicating specimen...", "info");
    try {
      const res = await fetch(`/api/projects/${proj.id}`);
      const fullProj = await res.json();

      const createRes = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: `${proj.title} (Copy)`,
          preset: proj.preset,
        }),
      });

      const newProj = await createRes.json();

      if (fullProj.documentState && newProj.id) {
        await fetch(`/api/projects/${newProj.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: `${proj.title} (Copy)`,
            documentState: {
              ...fullProj.documentState,
              id: newProj.id,
              title: `${proj.title} (Copy)`,
            },
          }),
        });
      }

      await fetchProjects();
      showToast("Specimen duplicated", "success");
    } catch (err) {
      console.error("Duplicate error:", err);
      showToast("Failed to duplicate specimen", "error");
    }
  };

  const filteredProjects = useMemo(() => {
    if (!searchQuery.trim()) return projects;
    const q = searchQuery.toLowerCase();
    return projects.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.preset.toLowerCase().includes(q)
    );
  }, [projects, searchQuery]);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans select-none">
      <ToastContainer />

      {/* Monochromatic Atelier Header */}
      <header className="border-b border-zinc-900 bg-zinc-950/90 backdrop-blur sticky top-0 z-20 px-6 sm:px-12 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-9 h-9 rounded bg-white text-black font-mono font-black text-sm flex items-center justify-center tracking-tighter shadow-sm">
            TY
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-sm font-bold text-white tracking-tight uppercase">
                Typst Studio
              </h1>
              <span className="text-[10px] bg-zinc-900 text-zinc-400 border border-zinc-800 px-2 py-0.5 rounded font-mono font-medium">
                ATELIER
              </span>
            </div>
            <p className="text-[11px] font-mono text-zinc-500">
              Visual composition engine • Native Typst compiler
            </p>
          </div>
        </div>

        {/* High-Contrast Inverted Action Button & Theme Switcher */}
        <div className="flex items-center gap-3">
          <ThemeQuickSwitcher />
          <button
            onClick={() => handleCreateFromPreset("a4_document", "Untitled Document")}
            disabled={isCreating}
            className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-zinc-200 text-zinc-950 rounded-lg text-xs font-semibold shadow-sm transition-all active:scale-[0.98] disabled:opacity-50 font-mono"
          >
            {isCreating ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-zinc-950" />
            ) : (
              <Plus className="w-3.5 h-3.5 text-zinc-950" />
            )}
            <span>New Document</span>
          </button>
        </div>
      </header>

      {/* Main Workbench Body */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 sm:px-12 py-10 space-y-12">
        {/* Architectural Template Standards Section */}
        <TemplateGallery onSelectPreset={handleCreateFromPreset} />

        {/* Saved Documents Ledger Section */}
        <section className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-900 pb-3">
            <div className="flex items-center gap-2">
              <LayoutGrid className="w-4 h-4 text-zinc-400" />
              <h2 className="text-xs font-mono uppercase tracking-[0.15em] text-zinc-400 font-medium">
                Document Ledger ({projects.length})
              </h2>
            </div>

            {/* Precision Search Filter */}
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search archive..."
                className="w-full bg-zinc-900/60 border border-zinc-800 focus:border-zinc-500 rounded-lg pl-8 pr-3 py-1.5 text-xs text-zinc-200 placeholder:text-zinc-600 outline-none transition-colors font-mono"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="py-20 flex flex-col items-center justify-center text-zinc-500 gap-2 font-mono">
              <Loader2 className="w-6 h-6 animate-spin text-white" />
              <span className="text-xs">Synchronizing ledger...</span>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-zinc-800/80 rounded-xl bg-zinc-900/20 p-8 space-y-3">
              <FileText className="w-8 h-8 text-zinc-600 mx-auto" />
              <p className="text-sm font-semibold text-zinc-300">
                {searchQuery ? "No matching records found" : "No documents in ledger"}
              </p>
              <p className="text-xs text-zinc-500 max-w-sm mx-auto leading-relaxed">
                {searchQuery
                  ? "Try searching for a different keyword or create a new document."
                  : "Select a standard template above or click New Document to begin typesetting."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProjects.map((proj) => (
                <ProjectCard
                  key={proj.id}
                  project={proj}
                  onOpen={(id) => router.push(`/editor/${id}`)}
                  onDuplicate={handleDuplicateProject}
                  onDelete={handleDeleteProject}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
