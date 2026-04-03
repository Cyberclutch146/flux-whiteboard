"use client";

import { useEffect } from "react";
import { useBoardStore } from "@/store/board";
import type { ToolId } from "@/types";

const TOOL_KEYS: Record<string, ToolId> = {
  v: "select",
  r: "rect",
  o: "circle",
  l: "line",
  p: "pencil",
  t: "text",
  h: "hand",
};

export function useKeyboardShortcuts() {
  const { setSelectedTool, zoomIn, zoomOut, resetZoom, undo, redo, closePanel } =
    useBoardStore();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;

      const key = e.key.toLowerCase();

      // Tool shortcuts
      if (TOOL_KEYS[key] && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        setSelectedTool(TOOL_KEYS[key]);
        return;
      }

      // Zoom shortcuts
      if ((e.key === "=" || e.key === "+") && !e.ctrlKey) { zoomIn(); return; }
      if (e.key === "-" && !e.ctrlKey) { zoomOut(); return; }
      if (e.key === "0" && (e.ctrlKey || e.metaKey)) { e.preventDefault(); resetZoom(); return; }

      // Undo / Redo
      if ((e.ctrlKey || e.metaKey) && key === "z" && !e.shiftKey) {
        e.preventDefault(); undo(); return;
      }
      if ((e.ctrlKey || e.metaKey) && (key === "y" || (key === "z" && e.shiftKey))) {
        e.preventDefault(); redo(); return;
      }

      // Escape
      if (e.key === "Escape") { closePanel(); return; }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [setSelectedTool, zoomIn, zoomOut, resetZoom, undo, redo, closePanel]);
}
