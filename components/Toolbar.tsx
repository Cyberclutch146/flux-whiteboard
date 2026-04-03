"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  MousePointer2, Square, Circle, Minus,
  Pencil, Type, Hand, Eraser,
} from "lucide-react";
import { useBoardStore } from "@/store/board";
import type { Tool, ToolId } from "@/types";
import clsx from "clsx";

// ─── Tool definitions ─────────────────────────────────────────────────────────

const TOOLS: Tool[] = [
  { id: "select", label: "Select",    shortcut: "V", group: "interaction" },
  { id: "hand",   label: "Pan",       shortcut: "H", group: "interaction" },
  { id: "rect",   label: "Rectangle", shortcut: "R", group: "shape" },
  { id: "circle", label: "Circle",    shortcut: "O", group: "shape" },
  { id: "line",   label: "Line",      shortcut: "L", group: "shape" },
  { id: "eraser", label: "Eraser", shortcut: "E", group: "draw" },
  { id: "pencil", label: "Pencil", shortcut: "P", group: "draw" },
  { id: "text",   label: "Text",   shortcut: "T", group: "draw" },
];

const ICONS: Record<ToolId, React.ReactNode> = {
  select: <MousePointer2 size={16} strokeWidth={1.6} />,
  hand:   <Hand          size={16} strokeWidth={1.6} />,
  rect:   <Square        size={16} strokeWidth={1.6} />,
  circle: <Circle        size={16} strokeWidth={1.6} />,
  line:   <Minus         size={16} strokeWidth={1.6} />,
  pencil: <Pencil        size={16} strokeWidth={1.6} />,
  text:   <Type          size={16} strokeWidth={1.6} />,
  eraser: <Eraser        size={16} strokeWidth={1.6} />,
};

// Group separators: render a divider before each new group
function groupBreak(prev: Tool | undefined, curr: Tool) {
  return prev && prev.group !== curr.group;
}

// ─── Single tool button ───────────────────────────────────────────────────────

function ToolButton({ tool, isActive }: { tool: Tool; isActive: boolean }) {
  const setSelectedTool = useBoardStore((s) => s.setSelectedTool);

  return (
    <div className="relative group">
      <motion.button
        whileTap={{ y: 1 }}
        onClick={() => setSelectedTool(tool.id)}
        className={clsx(
          "relative w-10 h-10 rounded-[10px] flex items-center justify-center transition-all duration-150 overflow-hidden",
          isActive
            ? "text-accent-purple"
            : "text-text-muted hover:bg-black/[0.04] hover:text-text-primary"
        )}
        aria-label={tool.label}
        aria-pressed={isActive}
      >
        {/* Active background blob */}
        {isActive && (
          <motion.span
            layoutId="tool-active-blob"
            className="absolute inset-0 bg-accent-purple/10"
            style={{ borderRadius: 10 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          />
        )}
        <span className="relative z-10">{ICONS[tool.id]}</span>
      </motion.button>

      {/* Tooltip */}
      <div
        className="pointer-events-none absolute bottom-[calc(100%+8px)] left-1/2 -translate-x-1/2
          opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-[200]"
      >
        <div className="flex items-center gap-2 bg-canvas-surface border border-border-default
          text-text-primary text-[11px] font-medium px-2.5 py-1.5 rounded-lg shadow-layer-1
          whitespace-nowrap">
          {tool.label}
          <kbd className="bg-black/5 border border-border-subtle rounded px-1 py-0.5
            font-mono text-[9px] text-text-muted leading-none">
            {tool.shortcut}
          </kbd>
        </div>
      </div>
    </div>
  );
}

// ─── Toolbar ──────────────────────────────────────────────────────────────────

export default function Toolbar() {
  const selectedTool = useBoardStore((s) => s.selectedTool);

  return (
    <aside
      className="pointer-events-auto absolute bottom-6 left-1/2 -translate-x-1/2
        flex items-center gap-1.5 p-1.5
        bg-canvas-surface border border-border-default rounded-2xl shadow-layer-2 z-50"
    >
      {TOOLS.map((tool, i) => (
        <div key={tool.id} className="flex items-center h-10">
          {groupBreak(TOOLS[i - 1], tool) && (
            <div className="w-px h-6 bg-border-subtle mx-1.5" />
          )}
          <ToolButton tool={tool} isActive={selectedTool === tool.id} />
        </div>
      ))}
    </aside>
  );
}
