"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useBoardStore } from "@/store/board";
import CursorOverlay from "./CursorOverlay";
import clsx from "clsx";

// ─── Loading skeleton ─────────────────────────────────────────────────────────

function CanvasSkeleton({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 1600);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <motion.div
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="absolute inset-0 z-30 bg-canvas-surface flex flex-col items-center justify-center gap-4"
    >
      <div className="flex items-center gap-2 mb-2">
        <div className="w-6 h-6 rounded-md bg-gradient-to-br from-accent-purple to-accent-blue" />
        <span className="font-bold text-sm tracking-widest text-text-muted uppercase">Flux</span>
      </div>
      <div className="w-48 h-0.5 rounded-full bg-canvas-overlay overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-accent-purple to-accent-blue"
          initial={{ x: "-100%" }}
          animate={{ x: "100%" }}
          transition={{ repeat: Infinity, duration: 1.4, ease: "linear" }}
        />
      </div>
      <p className="text-text-muted text-[11px] font-medium tracking-wider">
        Loading workspace…
      </p>
    </motion.div>
  );
}

// ─── Grid background ──────────────────────────────────────────────────────────

function GridBackground({ visible }: { visible: boolean }) {
  return (
    <div
      className={clsx(
        "absolute inset-0 pointer-events-none transition-opacity duration-300",
        visible ? "opacity-100" : "opacity-0"
      )}
      style={{
        backgroundImage: `
          radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px),
          linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
        `,
        backgroundSize: "28px 28px, 280px 280px, 280px 280px",
      }}
    />
  );
}

// ─── Mock element shapes ──────────────────────────────────────────────────────

interface MockShape {
  id: string;
  style: React.CSSProperties;
  className: string;
}

const MOCK_SHAPES: MockShape[] = [
  {
    id: "el-1",
    className: "absolute rounded-xl border cursor-pointer hover:brightness-125 transition-all duration-200",
    style: {
      left: "20%", top: "22%",
      width: 160, height: 100,
      background: "rgba(124,106,255,0.1)",
      borderColor: "rgba(124,106,255,0.45)",
    },
  },
  {
    id: "el-2",
    className: "absolute rounded-xl border cursor-pointer hover:brightness-125 transition-all duration-200",
    style: {
      left: "55%", top: "44%",
      width: 120, height: 80,
      background: "rgba(255,106,155,0.1)",
      borderColor: "rgba(255,106,155,0.45)",
    },
  },
  {
    id: "el-3",
    className: "absolute rounded-full border cursor-pointer hover:brightness-125 transition-all duration-200",
    style: {
      left: "25%", top: "54%",
      width: 90, height: 90,
      background: "rgba(91,159,255,0.1)",
      borderColor: "rgba(91,159,255,0.45)",
    },
  },
];

// ─── Selection overlay ────────────────────────────────────────────────────────

function SelectionOverlay({ elId }: { elId: string | null }) {
  const shape = MOCK_SHAPES.find((s) => s.id === elId);
  if (!shape) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      className="absolute pointer-events-none"
      style={{
        left:   `calc(${shape.style.left} - 5px)`,
        top:    `calc(${shape.style.top} - 5px)`,
        width:  (shape.style.width as number) + 10,
        height: (shape.style.height as number) + 10,
        borderRadius: shape.className.includes("rounded-full") ? "50%" : 14,
      }}
    >
      {/* Border */}
      <div
        className="absolute inset-0 border border-accent-purple shadow-[0_0_0_1px_rgba(124,106,255,0.2)]"
        style={{ borderRadius: "inherit" }}
      />
      {/* Handles */}
      {[
        "top-0 left-0 -translate-x-1/2 -translate-y-1/2 cursor-nw-resize",
        "top-0 right-0  translate-x-1/2 -translate-y-1/2 cursor-ne-resize",
        "bottom-0 left-0 -translate-x-1/2 translate-y-1/2 cursor-sw-resize",
        "bottom-0 right-0  translate-x-1/2  translate-y-1/2 cursor-se-resize",
        "top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-n-resize",
        "bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 cursor-s-resize",
        "top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 cursor-w-resize",
        "top-1/2 right-0 translate-x-1/2 -translate-y-1/2 cursor-e-resize",
      ].map((pos, i) => (
        <div
          key={i}
          className={clsx(
            "absolute w-2 h-2 rounded-sm bg-accent-purple border-2 border-canvas-bg",
            pos
          )}
        />
      ))}
    </motion.div>
  );
}

// ─── Canvas ───────────────────────────────────────────────────────────────────

export default function Canvas() {
  const {
    selectedTool, selectedElementId, isGridVisible, zoom,
    selectElement, setZoom, pushHistory,
  } = useBoardStore();

  const [loaded, setLoaded] = useState(false);
  const [isPanning, setIsPanning] = useState(false);
  const panStart = useRef({ x: 0, y: 0 });

  const cursorClass = selectedTool === "hand"
    ? (isPanning ? "cursor-grabbing" : "cursor-grab")
    : selectedTool === "text"
      ? "cursor-text"
      : "cursor-crosshair";

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (selectedTool === "hand") {
      setIsPanning(true);
      panStart.current = { x: e.clientX, y: e.clientY };
    }
  }, [selectedTool]);

  const handleMouseUp = useCallback(() => setIsPanning(false), []);

  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    const isElement = MOCK_SHAPES.some((s) => target.closest(`[data-id="${s.id}"]`));
    if (!isElement) {
      selectElement(null);
    }
    if (selectedTool !== "select" && selectedTool !== "hand") {
      pushHistory();
    }
  }, [selectedTool, selectElement, pushHistory]);

  // Ctrl+scroll to zoom
  useEffect(() => {
    const handler = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        setZoom(zoom + (e.deltaY < 0 ? 10 : -10));
      }
    };
    window.addEventListener("wheel", handler, { passive: false });
    return () => window.removeEventListener("wheel", handler);
  }, [zoom, setZoom]);

  return (
    <div
      className="relative flex-1 overflow-hidden bg-canvas-surface"
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <GridBackground visible={isGridVisible} />

      {/* Canvas inner */}
      <div
        className={clsx("absolute inset-0", cursorClass)}
        onClick={handleCanvasClick}
      >
        {/* Mock elements */}
        {MOCK_SHAPES.map((shape) => (
          <div
            key={shape.id}
            data-id={shape.id}
            className={shape.className}
            style={shape.style}
            onClick={(e) => {
              e.stopPropagation();
              if (selectedTool === "select") selectElement(shape.id);
            }}
          />
        ))}

        {/* Text label */}
        <div
          className="absolute pointer-events-none font-bold text-lg text-white/20"
          style={{ left: "43%", top: "28%" }}
        >
          Ideas Board
        </div>

        {/* Line */}
        <div
          className="absolute pointer-events-none h-0.5 rounded-full"
          style={{
            left: "37%", top: "40%",
            width: 140,
            background: "linear-gradient(90deg, #7c6aff, #5b9fff)",
            transform: "rotate(-15deg)",
            transformOrigin: "left center",
          }}
        />

        {/* Selection overlay */}
        <AnimatePresence>
          <SelectionOverlay key={selectedElementId} elId={selectedElementId} />
        </AnimatePresence>

        {/* Hint text */}
        {!selectedElementId && (
          <div className="absolute bottom-[22%] left-1/2 -translate-x-1/2
            text-text-muted text-[11px] font-medium tracking-wide pointer-events-none
            whitespace-nowrap">
            Click an element to select · Drag to pan · Scroll to zoom
          </div>
        )}
      </div>

      {/* Collaborator cursors */}
      <CursorOverlay />

      {/* Zoom indicator */}
      <div className="absolute bottom-4 right-4 pointer-events-none
        bg-canvas-overlay/80 border border-border-subtle backdrop-blur-sm
        text-text-muted text-[10px] font-mono px-2 py-1 rounded-lg">
        {zoom}%
      </div>

      {/* Loading skeleton */}
      <AnimatePresence>
        {!loaded && <CanvasSkeleton onDone={() => setLoaded(true)} />}
      </AnimatePresence>
    </div>
  );
}
