"use client";

import {
  File, FolderOpen, Save,
  Undo2, Redo2,
  MousePointer2, Pencil, Minus, Square, Circle, Type,
  X, Plus
} from "lucide-react";
import { useBoardStore } from "@/store/board";
import clsx from "clsx";

function ToolBtn({ icon: Icon, active, onClick, title }: any) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={clsx(
        "w-7 h-7 flex items-center justify-center rounded-[4px] transition-colors",
        active 
          ? "bg-[#333] text-white" 
          : "text-[#888] hover:bg-[#2A2A2A] hover:text-[#CCC]"
      )}
    >
      <Icon size={14} />
    </button>
  );
}

function Sep() {
  return <div className="w-px h-5 bg-[#333] mx-1" />;
}

export default function TopBar() {
  const { 
    selectedTool, setSelectedTool,
    undo, redo, historyIndex, historyLength
  } = useBoardStore();

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < historyLength;

  return (
    <header className="flex-shrink-0 w-full bg-[#1e1e1e] border-b border-[#333] flex flex-col z-50">
      {/* Tabs Row */}
      <div className="flex items-center h-8 bg-[#151515] px-2 border-b border-[#111]">
        <div className="flex items-center gap-2 h-full">
          <div className="flex items-center h-full px-3 bg-[#1e1e1e] text-[#ccc] text-[11px] font-mono border-t border-t-accent-purple border-r border-[#333] min-w-[120px] justify-between">
            <span>demo.lorien</span>
            <button className="hover:text-white ml-2"><X size={10} /></button>
          </div>
          <button className="w-6 h-6 flex items-center justify-center text-[#666] hover:text-[#ccc]">
            <Plus size={12} />
          </button>
        </div>
      </div>

      {/* Ribbon Row */}
      <div className="flex items-center h-10 px-2 gap-1 text-[#888]">
        <ToolBtn icon={File} title="New" />
        <ToolBtn icon={FolderOpen} title="Open" />
        <ToolBtn icon={Save} title="Save" />

        <Sep />

        <ToolBtn icon={Undo2} title="Undo" onClick={undo} />
        <ToolBtn icon={Redo2} title="Redo" onClick={redo} />

        <Sep />

        <ToolBtn icon={MousePointer2} active={selectedTool === "select"} onClick={() => setSelectedTool("select")} title="Select" />
        <ToolBtn icon={Pencil} active={selectedTool === "pencil"} onClick={() => setSelectedTool("pencil")} title="Pencil" />
        <ToolBtn icon={Minus} active={selectedTool === "line"} onClick={() => setSelectedTool("line")} title="Line" />
        <ToolBtn icon={Square} active={selectedTool === "rect"} onClick={() => setSelectedTool("rect")} title="Rectangle" />
        <ToolBtn icon={Circle} active={selectedTool === "circle"} onClick={() => setSelectedTool("circle")} title="Circle" />
        <ToolBtn icon={Type} active={selectedTool === "text"} onClick={() => setSelectedTool("text")} title="Text" />

        <Sep />

        {/* Color and Width */}
        <div className="flex items-center gap-3 px-2">
          {/* Color swatches */}
          <div className="flex items-center gap-1">
            {["#ffffff", "#ff6b6b", "#4ecdc4", "#ffe66d"].map(c => (
              <button key={c} className="w-4 h-4 rounded-[3px] border border-[#444]" style={{ background: c }} />
            ))}
          </div>
          
          <input type="color" className="w-5 h-5 p-0 border-0 bg-transparent rounded cursor-pointer" defaultValue="#ffffff" />
          
          <div className="flex items-center gap-2">
            <span className="text-[#888] text-[10px] font-mono">12</span>
            <input type="range" min="1" max="50" defaultValue="12" className="w-24 accent-[#888]" />
          </div>
        </div>
      </div>
    </header>
  );
}
