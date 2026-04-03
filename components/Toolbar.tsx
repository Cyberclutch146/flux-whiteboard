"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  MousePointer2, Square, Circle, Minus,
  Pencil, Type, Hand,
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
  { id: "pencil", label: "Pencil",    shortcut: "P", group: "draw" },
  { id: "text",   label: "Text",      shortcut: "T", group: "draw" },
];

const ICONS: Record<ToolId, React.ReactNode> = {
  select: <MousePointer2 size={16} strokeWidth={1.6} />,
  hand:   <Hand          size={16} strokeWidth={1.6} />,
  rect:   <Square        size={16} strokeWidth={1.6} />,
  circle: <Circle        size={16} strokeWidth={1.6} />,
  line:   <Minus         size={16} strokeWidth={1.6} />,
  pencil: <Pencil        size={16} strokeWidth={1.6} />,
  text:   <Type          size={16} strokeWidth={1.6} />,
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
        whileTap={{ scale: 0.88 }}
        onClick={() => setSelectedTool(tool.id)}
        className={clsx(
          "w-10 h-10 rounded-[10px] flex items-center justify-center",
          "border transition-all duration-150",
          isActive
            ? "bg-gradient-to-br from-accent-purple/20 to-accent-blue/20 border-accent-purple/40 text-purple-300"
            : "border-transparent text-text-muted hover:bg-white/[0.06] hover:border-border-subtle hover:text-text-secondary"
        )}
        aria-label={tool.label}
        aria-pressed={isActive}
      >
        {/* Active glow */}
        {isActive && (
          <motion.span
            layoutId="tool-glow"
            className="absolute inset-0 rounded-[10px] bg-accent-purple/10"
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          />
        )}
        <span className="relative z-10">{ICONS[tool.id]}</span>
      </motion.button>

      {/* Tooltip */}
      <div
        className="pointer-events-none absolute left-[calc(100%+10px)] top-1/2 -translate-y-1/2
          opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-[200]"
      >
        <div className="flex items-center gap-2 bg-canvas-elevated border border-border-default
          text-text-primary text-[11px] font-medium px-2.5 py-1.5 rounded-lg shadow-xl
          whitespace-nowrap">
          {tool.label}
          <kbd className="bg-canvas-overlay border border-border-default rounded px-1 py-0.5
            font-mono text-[9px] text-text-muted leading-none">
            {tool.shortcut}
          </kbd>
        </div>
        {/* Arrow */}
        <div className="absolute right-full top-1/2 -translate-y-1/2 -mr-px
          border-4 border-transparent border-r-border-default" />
      </div>
    </div>
  );
}

// ─── Toolbar ──────────────────────────────────────────────────────────────────

export default function Toolbar() {
  const selectedTool = useBoardStore((s) => s.selectedTool);

  return (
    <aside
      className="flex-shrink-0 w-14 flex flex-col items-center gap-1
        pt-3 pb-4 px-2
        bg-canvas-bg/80 border-r border-border-subtle
        backdrop-blur-xl z-40"
    >
      {TOOLS.map((tool, i) => (
        <div key={tool.id} className="flex flex-col items-center w-full">
          {groupBreak(TOOLS[i - 1], tool) && (
            <div className="w-8 h-px bg-border-subtle my-1.5" />
          )}
          <ToolButton tool={tool} isActive={selectedTool === tool.id} />
        </div>
      ))}
    </aside>
  );
}
