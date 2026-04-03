"use client";

import { motion } from "framer-motion";
import {
  Minus, Plus, Maximize2, Undo2, Redo2,
  Grid3X3, MessageSquare, Map,
} from "lucide-react";
import { useBoardStore } from "@/store/board";
import clsx from "clsx";

// ─── Icon button ──────────────────────────────────────────────────────────────

function BarBtn({
  onClick,
  title,
  children,
  active,
  className,
}: {
  onClick?: () => void;
  title?: string;
  children: React.ReactNode;
  active?: boolean;
  className?: string;
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      title={title}
      className={clsx(
        "h-7 min-w-[28px] px-2 rounded-lg border flex items-center justify-center gap-1",
        "text-text-secondary font-medium text-[12px] transition-all duration-150",
        active
          ? "bg-accent-purple/15 border-accent-purple/35 text-purple-300"
          : "bg-white/[0.03] border-border-subtle hover:bg-white/[0.07] hover:border-border-default hover:text-text-primary",
        className
      )}
    >
      {children}
    </motion.button>
  );
}

function Sep() {
  return <div className="w-px h-4 bg-border-subtle mx-1 flex-shrink-0" />;
}

// ─── BottomBar ────────────────────────────────────────────────────────────────

export default function BottomBar() {
  const {
    zoom, zoomIn, zoomOut, resetZoom,
    undo, redo, historyIndex, historyLength,
    isGridVisible, toggleGrid, elements,
  } = useBoardStore();

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < historyLength;

  return (
    <footer
      className="flex-shrink-0 h-[42px] flex items-center justify-between px-4
        bg-canvas-bg/90 border-t border-border-subtle backdrop-blur-xl z-50"
    >
      {/* Left — undo/redo + history */}
      <div className="flex items-center gap-1">
        <div className="flex">
          <BarBtn
            onClick={undo}
            title="Undo (Ctrl+Z)"
            className={clsx("rounded-r-none border-r-0", !canUndo && "opacity-40 pointer-events-none")}
          >
            <Undo2 size={13} />
          </BarBtn>
          <BarBtn
            onClick={redo}
            title="Redo (Ctrl+Y)"
            className={clsx("rounded-l-none", !canRedo && "opacity-40 pointer-events-none")}
          >
            <Redo2 size={13} />
          </BarBtn>
        </div>
        <Sep />
        <span className="font-mono text-[10px] text-text-muted">
          {historyIndex > 0 ? `${historyIndex} action${historyIndex !== 1 ? "s" : ""}` : "no history"}
        </span>
      </div>

      {/* Center — zoom */}
      <div className="flex items-center gap-1">
        <BarBtn onClick={zoomOut} title="Zoom out (-)">
          <Minus size={12} />
        </BarBtn>

        <button
          onClick={resetZoom}
          className="font-mono text-[12px] text-text-secondary h-7 px-3 rounded-lg
            border border-border-subtle bg-white/[0.03]
            hover:bg-white/[0.07] hover:border-border-default hover:text-text-primary
            transition-all duration-150 min-w-[56px] text-center"
          title="Reset zoom (Ctrl+0)"
        >
          {zoom}%
        </button>

        <BarBtn onClick={zoomIn} title="Zoom in (+)">
          <Plus size={12} />
        </BarBtn>

        <Sep />

        <BarBtn onClick={resetZoom} title="Fit to screen">
          <Maximize2 size={12} />
          <span className="text-[11px]">Fit</span>
        </BarBtn>

        <Sep />

        <BarBtn onClick={toggleGrid} title="Toggle grid" active={isGridVisible}>
          <Grid3X3 size={12} />
        </BarBtn>
      </div>

      {/* Right — meta */}
      <div className="flex items-center gap-2">
        <BarBtn title="Comments">
          <MessageSquare size={12} />
        </BarBtn>
        <BarBtn title="Minimap">
          <Map size={12} />
        </BarBtn>
        <Sep />
        <span className="font-mono text-[10px] text-text-muted">
          {elements.length} elements
        </span>
      </div>
    </footer>
  );
}
