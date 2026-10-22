"use client";

import { useState, useCallback, useRef } from "react";
import { DocumentState } from "@/types/document";

interface HistoryState {
  past: DocumentState[];
  present: DocumentState | null;
  future: DocumentState[];
}

export function useDocumentHistory(initialState: DocumentState | null) {
  const [history, setHistory] = useState<HistoryState>({
    past: [],
    present: initialState,
    future: [],
  });

  const lastRecordedTimeRef = useRef<number>(0);

  const setPresent = useCallback(
    (newState: DocumentState | ((prev: DocumentState | null) => DocumentState | null)) => {
      setHistory((curr) => {
        const resolved =
          typeof newState === "function" ? newState(curr.present) : newState;

        if (!resolved) return curr;
        if (curr.present && JSON.stringify(curr.present) === JSON.stringify(resolved)) {
          return curr;
        }

        // Debounce rapid typing history pushes (within 600ms) to avoid cluttering undo stack
        const now = Date.now();
        const shouldReplace = now - lastRecordedTimeRef.current < 600 && curr.past.length > 0;
        lastRecordedTimeRef.current = now;

        if (shouldReplace && curr.past.length > 0) {
          return {
            past: curr.past,
            present: resolved,
            future: [],
          };
        }

        return {
          past: curr.present ? [...curr.past.slice(-30), curr.present] : curr.past,
          present: resolved,
          future: [],
        };
      });
    },
    []
  );

  const resetHistory = useCallback((state: DocumentState) => {
    setHistory({
      past: [],
      present: state,
      future: [],
    });
  }, []);

  const undo = useCallback(() => {
    setHistory((curr) => {
      if (curr.past.length === 0 || !curr.present) return curr;
      const previous = curr.past[curr.past.length - 1];
      const newPast = curr.past.slice(0, curr.past.length - 1);
      return {
        past: newPast,
        present: previous,
        future: [curr.present, ...curr.future],
      };
    });
  }, []);

  const redo = useCallback(() => {
    setHistory((curr) => {
      if (curr.future.length === 0 || !curr.present) return curr;
      const next = curr.future[0];
      const newFuture = curr.future.slice(1);
      return {
        past: [...curr.past, curr.present],
        present: next,
        future: newFuture,
      };
    });
  }, []);

  const canUndo = history.past.length > 0;
  const canRedo = history.future.length > 0;

  return {
    documentState: history.present,
    setDocumentState: setPresent,
    resetHistory,
    undo,
    redo,
    canUndo,
    canRedo,
  };
}
