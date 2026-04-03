"use client";

import { useEffect } from "react";
import { useBoardStore } from "@/store/board";

interface CursorState {
  x: number;
  y: number;
  dx: number;
  dy: number;
}

export function useCollaboratorCursors() {
  const collaborators = useBoardStore((s) => s.collaborators);

  useEffect(() => {
    const states: Record<string, CursorState> = {};

    collaborators.forEach((c) => {
      states[c.id] = {
        x: c.cursor.x,
        y: c.cursor.y,
        dx: (Math.random() - 0.5) * 0.6,
        dy: (Math.random() - 0.5) * 0.6,
      };
    });

    const interval = setInterval(() => {
      collaborators.forEach((c) => {
        const s = states[c.id];
        if (!s) return;

        s.x += s.dx + (Math.random() - 0.5) * 0.3;
        s.y += s.dy + (Math.random() - 0.5) * 0.3;

        if (s.x < 8 || s.x > 88) s.dx *= -1;
        if (s.y < 12 || s.y > 82) s.dy *= -1;

        s.x = Math.max(5, Math.min(92, s.x));
        s.y = Math.max(8, Math.min(86, s.y));

        const el = document.getElementById(`cursor-${c.id}`);
        if (el) {
          el.style.left = `${s.x}%`;
          el.style.top  = `${s.y}%`;
        }
      });
    }, 550);

    return () => clearInterval(interval);
  }, [collaborators]);
}
