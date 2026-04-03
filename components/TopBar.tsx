"use client";

import {
  FileImage, FolderOpen, Save, FileDown,
  Undo2, Redo2,
  MousePointer2, Pencil, Minus, Square, Circle, Type,
  X, Plus, Eraser, Trash2
} from "lucide-react";
import { useBoardStore } from "@/store/board";
import clsx from "clsx";

function ToolBtn({ icon: Icon, active, onClick, title, color = "text-[#666]", activeColor = "text-white bg-[#333]" }: any) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={clsx(
        "w-8 h-8 flex items-center justify-center rounded-md transition-colors shrink-0",
        active 
          ? activeColor
          : `${color} hover:bg-[#eae5df] hover:text-[#333]`
      )}
    >
      <Icon size={16} />
    </button>
  );
}

function Sep() {
  return <div className="w-px h-6 bg-[#dcd7d0] mx-2 shrink-0" />;
}

export default function TopBar() {
  const { 
    selectedTool, setSelectedTool,
    undo, redo, historyIndex, historyLength,
    currentColor, setCurrentColor,
    currentWidth, setCurrentWidth,
    clearBoard
  } = useBoardStore();

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < historyLength;

  return (
    <header className="flex-shrink-0 w-full bg-[#f4f0ea] border-b border-[#e5e0d8] flex flex-col z-50">
      {/* Tabs Row */}
      <div className="flex items-center h-9 bg-[#eae5df] px-2 border-b border-[#dcd7d0] overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-2 h-full">
          <div className="flex items-center h-full px-4 bg-[#f4f0ea] text-[#333] text-[12px] font-medium border-t border-t-[#8ab4f8] border-r border-[#dcd7d0] min-w-[130px] justify-between">
            <span>demo.lorien</span>
            <button className="hover:text-black ml-3 text-[#888]"><X size={12} /></button>
          </div>
          <button className="w-7 h-7 flex items-center justify-center text-[#888] hover:text-[#333] rounded hover:bg-[#dfdad2]">
            <Plus size={14} />
          </button>
        </div>
      </div>

      {/* Ribbon Row */}
      <div className="flex items-center h-12 px-3 gap-1 overflow-x-auto no-scrollbar">
        {/* File Tools */}
        <div className="relative">
          <input 
            type="file" 
            accept="image/*" 
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" 
            title="Import Image"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                const reader = new FileReader();
                reader.onload = (ev) => {
                  if (ev.target?.result) {
                    window.dispatchEvent(new CustomEvent('import-image', { detail: ev.target.result }));
                  }
                };
                reader.readAsDataURL(e.target.files[0]);
              }
              e.target.value = '';
            }}
          />
          <ToolBtn icon={FileImage} active={false} />
        </div>
        <ToolBtn icon={Save} title="Save to Cloud" />
        <ToolBtn icon={FileImage} title="Export PNG" onClick={() => window.dispatchEvent(new CustomEvent('export-board', { detail: 'png' }))} />
        <ToolBtn icon={FileDown} title="Export PDF" onClick={() => window.dispatchEvent(new CustomEvent('export-board', { detail: 'pdf' }))} />

        <Sep />

        <ToolBtn icon={Undo2} title="Undo" onClick={undo} color={canUndo ? "text-[#666]" : "text-[#aaa]"} />
        <ToolBtn icon={Redo2} title="Redo" onClick={redo} color={canRedo ? "text-[#666]" : "text-[#aaa]"} />

        <Sep />

        {/* Draw Tools */}
        <ToolBtn icon={MousePointer2} active={selectedTool === "select"} onClick={() => setSelectedTool("select")} title="Select" />
        <ToolBtn icon={Pencil} active={selectedTool === "pencil"} onClick={() => setSelectedTool("pencil")} title="Pencil" />
        <ToolBtn icon={Minus} active={selectedTool === "line"} onClick={() => setSelectedTool("line")} title="Line" />
        <ToolBtn icon={Square} active={selectedTool === "rect"} onClick={() => setSelectedTool("rect")} title="Rectangle" />
        <ToolBtn icon={Circle} active={selectedTool === "circle"} onClick={() => setSelectedTool("circle")} title="Circle" />
        <ToolBtn icon={Type} active={selectedTool === "text"} onClick={() => setSelectedTool("text")} title="Text" />
        <ToolBtn icon={Eraser} active={selectedTool === "eraser"} onClick={() => setSelectedTool("eraser")} title="Eraser" />

        <Sep />

        {/* Color and Width */}
        <div className="flex items-center gap-4 px-2 shrink-0">
          <div className="flex items-center gap-1.5 border border-[#dcd7d0] p-1 rounded-md bg-white">
            {["#333333", "#e74c3c", "#3498db", "#2ecc71", "#f1c40f"].map(c => (
              <button 
                key={c} 
                onClick={() => setCurrentColor(c)}
                className={clsx(
                  "w-5 h-5 rounded-full border flex items-center justify-center",
                  currentColor === c ? "border-[#333] scale-110" : "border-transparent"
                )} 
              >
                <div className="w-4 h-4 rounded-full" style={{ background: c }} />
              </button>
            ))}
            <input 
              type="color" 
              value={currentColor} 
              onChange={(e) => setCurrentColor(e.target.value)}
              className="w-5 h-5 p-0 border-0 bg-transparent rounded cursor-pointer ml-1" 
            />
          </div>
          
          <div className="flex items-center gap-3 border border-[#dcd7d0] px-3 py-1.5 rounded-md bg-white min-w-[140px]">
            <span className="text-[#666] text-[11px] font-medium w-4">{currentWidth}</span>
            <input 
              type="range" min="1" max="50" 
              value={currentWidth} 
              onChange={(e) => setCurrentWidth(parseInt(e.target.value))}
              className="w-24 accent-[#666]" 
            />
          </div>
        </div>

        <Sep />
        
        {/* Erase Board explicitly */}
        <ToolBtn icon={Trash2} active={false} onClick={clearBoard} title="Erase Board" color="text-[#e74c3c]" />
      </div>
    </header>
  );
}
