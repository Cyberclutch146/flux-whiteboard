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
      whileTap={{ y: 1 }}
      onClick={onClick}
      title={title}
      className={clsx(
        "h-7 min-w-[28px] px-2 rounded-lg border flex items-center justify-center gap-1",
        "text-text-secondary font-medium text-[12px] transition-all duration-150",
        active
          ? "bg-accent-purple/10 border-accent-purple/20 text-accent-purple"
          : "bg-transparent border-transparent hover:bg-black/[0.04] hover:border-border-subtle hover:text-text-primary",
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
    <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end pointer-events-none z-40">
      {/* Left Corner */}
      <div className="pointer-events-auto flex items-center gap-1.5 p-1.5 bg-canvas-surface border border-border-default rounded-xl shadow-layer-1">
        <div className="flex">
          <BarBtn
            onClick={undo}
            title="Undo (Ctrl+Z)"
            className={clsx("rounded-r-none border-r-0 border-border-subtle", !canUndo && "opacity-40 pointer-events-none")}
          >
            <Undo2 size={13} />
          </BarBtn>
          <BarBtn
            onClick={redo}
            title="Redo (Ctrl+Y)"
            className={clsx("rounded-l-none border-border-subtle", !canRedo && "opacity-40 pointer-events-none")}
          >
            <Redo2 size={13} />
          </BarBtn>
        </div>

        <Sep />

        <BarBtn onClick={zoomOut} title="Zoom out (-)">
          <Minus size={12} />
        </BarBtn>

        <button
          onClick={resetZoom}
          className="font-mono text-[11px] text-text-secondary h-7 px-2 rounded-lg
            border border-transparent bg-transparent
            hover:bg-black/[0.04] hover:border-border-subtle hover:text-text-primary
            transition-all duration-150 min-w-[48px] text-center"
          title="Reset zoom (Ctrl+0)"
        >
          {zoom}%
        </button>

        <BarBtn onClick={zoomIn} title="Zoom in (+)">
          <Plus size={12} />
        </BarBtn>
      </div>

      {/* Right Corner */}
      <div className="pointer-events-auto flex items-center gap-1.5 p-1.5 bg-canvas-surface border border-border-default rounded-xl shadow-layer-1">
        <BarBtn onClick={toggleGrid} title="Toggle grid" active={isGridVisible}>
          <Grid3X3 size={12} />
        </BarBtn>
        <Sep />
        <BarBtn title="Comments">
          <MessageSquare size={12} />
        </BarBtn>
        <BarBtn title="Minimap">
          <Map size={12} />
        </BarBtn>
      </div>
    </div>
  );
}
