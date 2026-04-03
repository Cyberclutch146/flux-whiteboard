"use client";

import { useBoardStore } from "@/store/board";

export default function StatusBar() {
  const { zoom, elements } = useBoardStore();

  return (
    <footer className="flex-shrink-0 h-6 border-t border-[#333] bg-[#1e1e1e] flex items-center justify-between px-3 text-[10px] font-mono text-[#888] z-50">
      <div className="flex items-center gap-4">
        <span>Position: 0, 0</span>
        <span>Zoom: {zoom}%</span>
        <span>Pressure: -</span>
        <span>FPS: 60</span>
      </div>
      <div>
        <span>Elements: {elements.length}</span>
      </div>
    </footer>
  );
}
