"use client";

import { useBoardStore } from "@/store/board";

export default function StatusBar() {
  const { zoom, elements } = useBoardStore();

  return (
    <footer className="flex-shrink-0 h-7 border-t border-[#dcd7d0] bg-[#f4f0ea] flex items-center justify-between px-4 text-[11px] font-mono text-[#666] z-50">
      <div className="flex items-center gap-6">
        <span>Position: 0, 0</span>
        <span>Zoom: {zoom}%</span>
        <span>Pressure: -</span>
      </div>
      <div>
        <span>Elements: {elements.length}</span>
      </div>
    </footer>
  );
}
