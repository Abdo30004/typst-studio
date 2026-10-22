"use client";

import React, { useState, useEffect } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export interface ToastMessage {
  id: string;
  type: "success" | "error" | "info";
  message: string;
}

let globalAddToast: ((msg: Omit<ToastMessage, "id">) => void) | null = null;

export function showToast(message: string, type: "success" | "error" | "info" = "success") {
  if (globalAddToast) {
    globalAddToast({ message, type });
  }
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    globalAddToast = ({ message, type }) => {
      const id = Math.random().toString(36).substring(2, 9);
      setToasts((prev) => [...prev, { id, message, type }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 3500);
    };

    return () => {
      globalAddToast = null;
    };
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`pointer-events-auto flex items-center gap-2.5 px-4 py-3 rounded-xl border shadow-2xl backdrop-blur-md text-xs font-medium text-white animate-in slide-in-from-bottom-2 duration-150 ${
            t.type === "success"
              ? "bg-slate-900/95 border-emerald-500/50"
              : t.type === "error"
              ? "bg-slate-900/95 border-rose-500/50"
              : "bg-slate-900/95 border-blue-500/50"
          }`}
        >
          {t.type === "success" && (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          )}
          {t.type === "error" && (
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          )}
          {t.type === "info" && (
            <Info className="w-4 h-4 text-blue-400 shrink-0" />
          )}

          <span className="flex-1 text-slate-100">{t.message}</span>

          <button
            onClick={() => setToasts((prev) => prev.filter((item) => item.id !== t.id))}
            className="text-slate-400 hover:text-white p-0.5 rounded"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}
