"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useBoardStore } from "@/store/board";

// ─── Cursor SVG ───────────────────────────────────────────────────────────────

function CursorIcon({ color }: { color: string }) {
  return (
    <svg width="18" height="20" viewBox="0 0 18 20" fill="none">
      <path
        d="M2 2L2 15L6 11L9 18L11.5 17L8.5 10L15 10Z"
        fill={color}
        stroke="white"
        strokeWidth="0.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ─── Single cursor ────────────────────────────────────────────────────────────

function CollabCursor({
  id,
  name,
  color,
  initialX,
  initialY,
}: {
  id: string;
  name: string;
  color: string;
  initialX: number;
  initialY: number;
}) {
  return (
    <div
      id={`cursor-${id}`}
      className="absolute pointer-events-none transition-[left,top] duration-500 ease-out"
      style={{ left: `${initialX}%`, top: `${initialY}%`, zIndex: 100 }}
    >
      <CursorIcon color={color} />
      <div
        className="absolute top-[18px] left-[8px] flex items-center px-2 py-0.5
          rounded-full text-white text-[10px] font-semibold shadow-lg whitespace-nowrap"
        style={{ background: color }}
      >
        {name}
      </div>
    </div>
  );
}

// ─── CursorOverlay ────────────────────────────────────────────────────────────

export default function CursorOverlay() {
  const collaborators = useBoardStore((s) => s.collaborators);

  // Animate cursor positions
  useEffect(() => {
    type State = { x: number; y: number; dx: number; dy: number };
    const states: Record<string, State> = {};

    collaborators.forEach((c) => {
      states[c.id] = {
        x: c.cursor.x,
        y: c.cursor.y,
        dx: (Math.random() - 0.5) * 0.55,
        dy: (Math.random() - 0.5) * 0.55,
      };
    });

    const id = setInterval(() => {
      collaborators.forEach((c) => {
        const s = states[c.id];
        if (!s) return;

        s.x += s.dx + (Math.random() - 0.5) * 0.25;
        s.y += s.dy + (Math.random() - 0.5) * 0.25;

        if (s.x < 8  || s.x > 88) s.dx *= -1;
        if (s.y < 12 || s.y > 80) s.dy *= -1;

        s.x = Math.max(6, Math.min(90, s.x));
        s.y = Math.max(10, Math.min(82, s.y));

        const el = document.getElementById(`cursor-${c.id}`);
        if (el) {
          el.style.left = `${s.x}%`;
          el.style.top  = `${s.y}%`;
        }
      });
    }, 580);

    return () => clearInterval(id);
  }, [collaborators]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
      {collaborators.map((c) => (
        <CollabCursor
          key={c.id}
          id={c.id}
          name={c.name}
          color={c.color}
          initialX={c.cursor.x}
          initialY={c.cursor.y}
        />
      ))}
    </div>
  );
}
