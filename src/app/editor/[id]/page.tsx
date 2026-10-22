"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { DocumentState, DocumentBlock, DocumentPreset } from "@/types/document";
import { generateTypstDocument, renderBlockToTypst } from "@/lib/typst/generator";
import { createInitialDocument } from "@/lib/typst/presets";
import { updateBlockInList, deleteBlockInList } from "@/lib/typst/block-utils";
import {
  Canvas,
  CanvaSidebar,
  PropertyInspector,
  InteractivePreviewCanvas,
  ResizableSplitView,
  TypstCodeDrawer,
  ContextMenu,
  ContextMenuPosition,
  useDocumentHistory,
} from "@/features/editor";
import { ToastContainer, showToast } from "@/components/ui/toast";
import {
  ArrowLeft,
  Download,
  Code,
  Save,
  Columns,
  Eye,
  Edit3,
  Check,
  Loader2,
  Undo2,
  Redo2,
  Sparkles,
  Layers,
  ChevronDown,
} from "lucide-react";

export default function EditorPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params?.id as string;

  const {
    documentState,
    setDocumentState,
    resetHistory,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useDocumentHistory(null);

  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"interactive" | "split" | "builder">("interactive");
  const [isCodeDrawerOpen, setIsCodeDrawerOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [contextMenuPos, setContextMenuPos] = useState<ContextMenuPosition | null>(null);

  // Load project on mount
  useEffect(() => {
    if (!projectId) return;

    fetch(`/api/projects/${projectId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.documentState) {
          resetHistory(data.documentState);
        } else {
          const initial = createInitialDocument("a4_document", data.title || "Untitled Document");
          resetHistory(initial);
        }
      })
      .catch((err) => {
        console.error("Failed to load project:", err);
        const fallback = createInitialDocument("a4_document", "New Document");
        resetHistory(fallback);
      });
  }, [projectId, resetHistory]);

  // Compute live Typst source code
  const typstSourceCode = useMemo(() => {
    if (!documentState) return "";
    return generateTypstDocument(documentState);
  }, [documentState]);

  // Save changes to database
  const handleSave = useCallback(async () => {
    if (!documentState || !projectId) return;
    setIsSaving(true);
    try {
      await fetch(`/api/projects/${projectId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: documentState.title,
          documentState: documentState,
        }),
      });
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch (err) {
      console.error("Save error:", err);
      setIsSaving(false);
    }
  }, [documentState, projectId]);

  // Autosave debounced
  useEffect(() => {
    if (!documentState) return;
    const timeout = setTimeout(() => {
      handleSave();
    }, 4000);
    return () => clearTimeout(timeout);
  }, [documentState, handleSave]);

  // Block Manipulation Handlers
  const handleAddBlock = useCallback((block: DocumentBlock) => {
    setDocumentState((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        blocks: [...prev.blocks, block],
        updatedAt: new Date().toISOString(),
      };
    });
    setSelectedBlockId(block.id);
    showToast(`Added ${block.type.replace("card_", "")} block`, "info");
  }, [setDocumentState]);

  const handleUpdateBlock = useCallback((blockId: string, updated: Partial<DocumentBlock>) => {
    setDocumentState((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        blocks: updateBlockInList(prev.blocks, blockId, updated),
        updatedAt: new Date().toISOString(),
      };
    });
  }, [setDocumentState]);

  const handleDeleteBlock = useCallback((blockId: string) => {
    setDocumentState((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        blocks: deleteBlockInList(prev.blocks, blockId),
        updatedAt: new Date().toISOString(),
      };
    });
    setSelectedBlockId((curr) => (curr === blockId ? null : curr));
    showToast("Block deleted", "info");
  }, [setDocumentState]);

  const handleDuplicateBlock = useCallback((blockId: string) => {
    setDocumentState((prev) => {
      if (!prev) return null;
      const index = prev.blocks.findIndex((b) => b.id === blockId);
      if (index === -1) return prev;

      const target = prev.blocks[index];
      const duplicated: DocumentBlock = {
        ...JSON.parse(JSON.stringify(target)),
        id: "b-" + Math.random().toString(36).substring(2, 9),
      };

      const newBlocks = [...prev.blocks];
      newBlocks.splice(index + 1, 0, duplicated);

      setSelectedBlockId(duplicated.id);
      return {
        ...prev,
        blocks: newBlocks,
        updatedAt: new Date().toISOString(),
      };
    });
    showToast("Block duplicated", "success");
  }, [setDocumentState]);

  const handleMoveUp = useCallback((blockId: string) => {
    setDocumentState((prev) => {
      if (!prev) return null;
      const index = prev.blocks.findIndex((b) => b.id === blockId);
      if (index <= 0) return prev;

      const newBlocks = [...prev.blocks];
      const item = newBlocks.splice(index, 1)[0];
      newBlocks.splice(index - 1, 0, item);

      return {
        ...prev,
        blocks: newBlocks,
        updatedAt: new Date().toISOString(),
      };
    });
  }, [setDocumentState]);

  const handleMoveDown = useCallback((blockId: string) => {
    setDocumentState((prev) => {
      if (!prev) return null;
      const index = prev.blocks.findIndex((b) => b.id === blockId);
      if (index === -1 || index >= prev.blocks.length - 1) return prev;

      const newBlocks = [...prev.blocks];
      const item = newBlocks.splice(index, 1)[0];
      newBlocks.splice(index + 1, 0, item);

      return {
        ...prev,
        blocks: newBlocks,
        updatedAt: new Date().toISOString(),
      };
    });
  }, [setDocumentState]);

  const handleInsertBlockBelow = useCallback((targetBlockId: string) => {
    const newBlock: DocumentBlock = {
      id: "b-" + Math.random().toString(36).substring(2, 9),
      type: "card",
      title: "New Card",
      content: "Write your details here...",
      fillColor: "#ffffff",
      strokeColor: "#e2e8f0",
      padding: 12,
    };

    setDocumentState((prev) => {
      if (!prev) return null;
      const index = prev.blocks.findIndex((b) => b.id === targetBlockId);
      const newBlocks = [...prev.blocks];
      if (index !== -1) {
        newBlocks.splice(index + 1, 0, newBlock);
      } else {
        newBlocks.push(newBlock);
      }
      return {
        ...prev,
        blocks: newBlocks,
        updatedAt: new Date().toISOString(),
      };
    });
    setSelectedBlockId(newBlock.id);
    showToast("Inserted card block below", "info");
  }, [setDocumentState]);

  const handleCopyTypstSnippet = useCallback((blockId: string) => {
    if (!documentState) return;
    const block = documentState.blocks.find((b) => b.id === blockId);
    if (!block) return;

    const snippet = renderBlockToTypst(block);
    navigator.clipboard.writeText(snippet);
    showToast("Typst snippet copied to clipboard!", "success");
  }, [documentState]);

  const handleApplyPreset = useCallback((preset: DocumentPreset) => {
    setDocumentState((prev) => {
      if (!prev) return null;
      const fresh = createInitialDocument(preset, prev.title);
      return {
        ...prev,
        preset,
        settings: fresh.settings,
        blocks: fresh.blocks,
        updatedAt: new Date().toISOString(),
      };
    });
    showToast(`Switched to ${preset.replace("_", " ")} template`, "success");
  }, [setDocumentState]);

  const handleUpdateDocumentSettings = useCallback((newSettings: Partial<DocumentState["settings"]>) => {
    setDocumentState((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        settings: { ...prev.settings, ...newSettings },
        updatedAt: new Date().toISOString(),
      };
    });
  }, [setDocumentState]);

  // Context Menu Trigger
  const handleContextMenu = (e: React.MouseEvent, blockId: string) => {
    setSelectedBlockId(blockId);
    setContextMenuPos({
      x: e.clientX,
      y: e.clientY,
      blockId,
    });
  };

  // Keyboard Shortcuts (Undo, Redo, Duplicate, Delete)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeTag = (document.activeElement?.tagName || "").toLowerCase();
      const isInput = activeTag === "input" || activeTag === "textarea";

      // Undo: Ctrl+Z / Cmd+Z
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z" && !e.shiftKey) {
        e.preventDefault();
        undo();
        showToast("Undo", "info");
        return;
      }

      // Redo: Ctrl+Y or Ctrl+Shift+Z
      if (
        ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "y") ||
        ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === "z")
      ) {
        e.preventDefault();
        redo();
        showToast("Redo", "info");
        return;
      }

      // If typing in an input, don't trigger element shortcuts
      if (isInput) return;

      // Duplicate: Ctrl+D
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "d" && selectedBlockId) {
        e.preventDefault();
        handleDuplicateBlock(selectedBlockId);
        return;
      }

      // Delete: Delete key
      if (e.key === "Delete" && selectedBlockId) {
        e.preventDefault();
        handleDeleteBlock(selectedBlockId);
        return;
      }

      // Move Up: Alt+ArrowUp
      if (e.altKey && e.key === "ArrowUp" && selectedBlockId) {
        e.preventDefault();
        handleMoveUp(selectedBlockId);
        return;
      }

      // Move Down: Alt+ArrowDown
      if (e.altKey && e.key === "ArrowDown" && selectedBlockId) {
        e.preventDefault();
        handleMoveDown(selectedBlockId);
        return;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    undo,
    redo,
    selectedBlockId,
    handleDuplicateBlock,
    handleDeleteBlock,
    handleMoveUp,
    handleMoveDown,
  ]);

  // PDF Export via Docker Native Typst CLI
  const handleExportPdf = async () => {
    if (!documentState) return;
    setIsExporting(true);
    showToast("Compiling PDF with native Typst CLI...", "info");
    try {
      const res = await fetch("/api/export/pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documentState,
          typstCode: typstSourceCode,
          filename: documentState.title,
        }),
      });

      if (!res.ok) {
        const errJson = await res.json();
        throw new Error(errJson.details || errJson.error || "Export failed");
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${(documentState.title || "document").replace(/[^a-zA-Z0-9_-]/g, "_")}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast("PDF downloaded successfully!", "success");
    } catch (err: any) {
      showToast("PDF Export error: " + (err.message || "Failed to compile"), "error");
    } finally {
      setIsExporting(false);
    }
  };

  if (!documentState) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-slate-950 text-slate-300 gap-3">
        <Loader2 className="w-9 h-9 animate-spin text-blue-500" />
        <span className="text-xs font-medium text-slate-400">Loading Typst Studio...</span>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen flex flex-col bg-slate-950 text-slate-100 overflow-hidden font-sans">
      <ToastContainer />

      {/* Top Canva-style Studio Bar */}
      <header className="h-14 border-b border-slate-800/90 bg-slate-950/95 px-4 flex items-center justify-between shrink-0 z-30 shadow-md">
        {/* Left: Branding, Document title, Auto-save & History */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/")}
            className="p-2 rounded-lg hover:bg-slate-900 text-slate-400 hover:text-white transition-colors"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={documentState.title}
              onChange={(e) =>
                setDocumentState((prev) =>
                  prev ? { ...prev, title: e.target.value } : null
                )
              }
              className="bg-transparent hover:bg-slate-900/80 focus:bg-slate-900 border border-transparent focus:border-slate-700 rounded-lg px-2.5 py-1 text-sm font-bold text-slate-100 outline-none w-56 sm:w-64 truncate transition-all"
              placeholder="Untitled Document"
            />
            <span className="text-[10px] bg-blue-950/80 text-blue-400 border border-blue-800/40 px-2 py-0.5 rounded-full uppercase font-mono hidden md:inline">
              {documentState.preset.replace("_", " ")}
            </span>
          </div>

          {/* Save status badge */}
          <div className="text-[11px] text-slate-500 flex items-center gap-1">
            {isSaving ? (
              <>
                <Loader2 className="w-3 h-3 animate-spin text-blue-400" />
                <span>Saving...</span>
              </>
            ) : saveSuccess ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" />
                <span className="text-emerald-400">Saved</span>
              </>
            ) : (
              <span>All changes saved</span>
            )}
          </div>

          {/* Undo / Redo buttons */}
          <div className="flex items-center gap-0.5 border-l border-slate-800 pl-2">
            <button
              onClick={undo}
              disabled={!canUndo}
              title="Undo (Ctrl+Z)"
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 disabled:opacity-30 disabled:pointer-events-none transition-colors"
            >
              <Undo2 className="w-4 h-4" />
            </button>
            <button
              onClick={redo}
              disabled={!canRedo}
              title="Redo (Ctrl+Y)"
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 disabled:opacity-30 disabled:pointer-events-none transition-colors"
            >
              <Redo2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Center: View Switcher */}
        <div className="flex items-center bg-slate-900/90 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setViewMode("interactive")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all ${
              viewMode === "interactive"
                ? "bg-blue-600 text-white font-semibold shadow-md"
                : "text-slate-400 hover:text-slate-200"
            }`}
            title="Direct Click-to-Edit on Document Sheet"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Interactive Sheet</span>
          </button>

          <button
            onClick={() => setViewMode("split")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all ${
              viewMode === "split"
                ? "bg-blue-600 text-white font-semibold shadow-md"
                : "text-slate-400 hover:text-slate-200"
            }`}
            title="Split Side-by-Side: Blocks & Sheet"
          >
            <Columns className="w-3.5 h-3.5" />
            <span>Split View</span>
          </button>

          <button
            onClick={() => setViewMode("builder")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all ${
              viewMode === "builder"
                ? "bg-blue-600 text-white font-semibold shadow-md"
                : "text-slate-400 hover:text-slate-200"
            }`}
            title="Drag & Drop Block Sorter"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Flow Builder</span>
          </button>
        </div>

        {/* Right: Quick actions & Canva Export Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsCodeDrawerOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700/80 bg-slate-900/80 hover:bg-slate-800 text-slate-200 text-xs font-semibold transition-colors"
            title="Inspect Typst source code"
          >
            <Code className="w-3.5 h-3.5 text-blue-400" />
            <span>Typst Code</span>
          </button>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700/80 bg-slate-900/80 hover:bg-slate-800 text-slate-200 text-xs font-semibold transition-colors"
          >
            <Save className="w-3.5 h-3.5 text-slate-400" />
            <span>Save</span>
          </button>

          {/* Canva-style Gradient Export Button */}
          <button
            onClick={handleExportPdf}
            disabled={isExporting}
            className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-blue-500/25 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
          >
            {isExporting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Compiling...</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                <span>Export PDF</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Main Studio Body */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Canva Left Tool Rail & Expandable Drawer */}
        <CanvaSidebar
          documentState={documentState}
          onAddBlock={handleAddBlock}
          onApplyPreset={handleApplyPreset}
          onUpdateDocumentSettings={handleUpdateDocumentSettings}
          typstCode={typstSourceCode}
        />

        {/* Central Work Area */}
        <div className="flex-1 flex overflow-hidden bg-slate-950">
          {viewMode === "split" ? (
            <ResizableSplitView
              leftTitle="Flow Builder"
              rightTitle="Interactive Sheet"
              leftPane={
                <div className="flex-1 flex flex-col h-full overflow-hidden border-r border-slate-800/80">
                  <Canvas
                    blocks={documentState.blocks}
                    onReorder={(newBlocks) =>
                      setDocumentState((prev) =>
                        prev ? { ...prev, blocks: newBlocks } : null
                      )
                    }
                    onUpdateBlock={handleUpdateBlock}
                    onDeleteBlock={handleDeleteBlock}
                    selectedBlockId={selectedBlockId}
                    onSelectBlock={(id) => setSelectedBlockId(id)}
                    onAddDefaultBlock={() =>
                      handleAddBlock({
                        id: "b-" + Math.random().toString(36).substring(2, 9),
                        type: "card",
                        title: "First Card",
                        content: "Start writing here or drop components from the left bar.",
                        fillColor: "#1e293b",
                        strokeColor: "#334155",
                        padding: 14,
                      })
                    }
                  />
                </div>
              }
              rightPane={
                <div className="flex-1 flex flex-col h-full overflow-hidden">
                  <InteractivePreviewCanvas
                    documentState={documentState}
                    selectedBlockId={selectedBlockId}
                    onSelectBlock={(id) => setSelectedBlockId(id)}
                    onUpdateBlock={handleUpdateBlock}
                    onDeleteBlock={handleDeleteBlock}
                    onDuplicateBlock={handleDuplicateBlock}
                    onMoveUp={handleMoveUp}
                    onMoveDown={handleMoveDown}
                    onContextMenu={handleContextMenu}
                    onInsertBlockBelow={handleInsertBlockBelow}
                    onOpenInspector={() => {}}
                  />
                </div>
              }
            />
          ) : viewMode === "builder" ? (
            <div className="flex-1 flex flex-col overflow-hidden w-full">
              <Canvas
                blocks={documentState.blocks}
                onReorder={(newBlocks) =>
                  setDocumentState((prev) =>
                    prev ? { ...prev, blocks: newBlocks } : null
                  )
                }
                onUpdateBlock={handleUpdateBlock}
                onDeleteBlock={handleDeleteBlock}
                selectedBlockId={selectedBlockId}
                onSelectBlock={(id) => setSelectedBlockId(id)}
                onAddDefaultBlock={() =>
                  handleAddBlock({
                    id: "b-" + Math.random().toString(36).substring(2, 9),
                    type: "card",
                    title: "First Card",
                    content: "Start writing here or drop components from the left bar.",
                    fillColor: "#1e293b",
                    strokeColor: "#334155",
                    padding: 14,
                  })
                }
              />
            </div>
          ) : (
            <div className="flex-1 flex flex-col overflow-hidden w-full">
              <InteractivePreviewCanvas
                documentState={documentState}
                selectedBlockId={selectedBlockId}
                onSelectBlock={(id) => setSelectedBlockId(id)}
                onUpdateBlock={handleUpdateBlock}
                onDeleteBlock={handleDeleteBlock}
                onDuplicateBlock={handleDuplicateBlock}
                onMoveUp={handleMoveUp}
                onMoveDown={handleMoveDown}
                onContextMenu={handleContextMenu}
                onInsertBlockBelow={handleInsertBlockBelow}
                onOpenInspector={() => {}}
              />
            </div>
          )}
        </div>

        {/* Right Property Inspector Panel */}
        <PropertyInspector
          documentState={documentState}
          selectedBlockId={selectedBlockId}
          onUpdateDocumentSettings={handleUpdateDocumentSettings}
          onUpdateBlock={handleUpdateBlock}
          onDeselect={() => setSelectedBlockId(null)}
        />
      </div>

      {/* Right-Click Context Menu */}
      <ContextMenu
        position={contextMenuPos}
        onClose={() => setContextMenuPos(null)}
        onDuplicate={handleDuplicateBlock}
        onDelete={handleDeleteBlock}
        onMoveUp={handleMoveUp}
        onMoveDown={handleMoveDown}
        onCopyTypst={handleCopyTypstSnippet}
        onInspect={(id) => setSelectedBlockId(id)}
        onAddBelow={handleInsertBlockBelow}
      />

      {/* Typst Code Slide-over Inspector */}
      <TypstCodeDrawer
        isOpen={isCodeDrawerOpen}
        onClose={() => setIsCodeDrawerOpen(false)}
        typstCode={typstSourceCode}
        documentTitle={documentState.title}
      />
    </div>
  );
}
