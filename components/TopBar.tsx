"use client";

import {
  FileImage, FolderOpen, Save, FileDown,
  Undo2, Redo2,
  MousePointer2, Pencil, Minus, Square, Circle, Type,
  X, Plus, Eraser, Trash2, Sun, Moon, Home, LogOut, User, Copy, Check
} from "lucide-react";
import { useBoardStore } from "@/store/board";
import clsx from "clsx";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

function ToolBtn({ icon: Icon, active, onClick, title, color = "text-[var(--text-secondary)]", activeColor = "text-[var(--inverted-text)] bg-[var(--inverted-bg)]" }: any) {
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      title={title}
      className={clsx(
        "w-10 h-10 flex items-center justify-center rounded-lg transition-colors shrink-0",
        active 
          ? activeColor
          : `${color} hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]`
      )}
    >
      <Icon size={18} />
    </motion.button>
  );
}

function Sep() {
  return <div className="w-px h-8 bg-[var(--border-secondary)] mx-3 shrink-0" />;
}

export default function TopBar({ roomId, user, title, onBackToHome, onSignOut }: { roomId: string | null; user: any; title?: string; onBackToHome: () => void; onSignOut: () => void }) {
  const [copied, setCopied] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const { 
    selectedTool, setSelectedTool,
    undo, redo, historyIndex, historyLength,
    currentColor, setCurrentColor,
    currentWidth, setCurrentWidth,
    clearBoard,
    theme, toggleTheme
  } = useBoardStore();

  const handleCopyRoom = () => {
    if (roomId) {
      navigator.clipboard.writeText(roomId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < historyLength;

  return (
    <header className="flex-shrink-0 w-full bg-[var(--bg-secondary)] border-b border-[var(--border-primary)] flex flex-col z-50">
      {/* Tabs Row */}
      <div className="flex items-center h-12 bg-[var(--bg-tertiary)] px-2 border-b border-[var(--border-secondary)] overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-2 h-full">
          <button onClick={onBackToHome} className="h-8 px-3 rounded-md hover:bg-[var(--bg-secondary)] flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors ml-2">
            <Home size={16} /> <span className="text-sm font-medium">Home</span>
          </button>
          
          <div className="flex items-center h-full text-[var(--text-primary)] text-[13px] font-medium border-l border-[var(--border-secondary)] ml-2">
            {title ? (
              <span className="px-4 text-[var(--text-primary)] font-bold tracking-wide">{title}</span>
            ) : roomId ? (
              <button 
                onClick={handleCopyRoom}
                className="flex items-center gap-2 px-4 hover:bg-[var(--bg-secondary)] h-full transition-colors group"
                title="Copy Room ID"
              >
                Room: <span className="font-mono font-bold tracking-wider">{roomId}</span>
                {copied ? <Check size={14} className="text-[#2ecc71]" /> : <Copy size={14} className="text-[var(--text-muted)] group-hover:text-[var(--text-primary)] transition-colors" />}
              </button>
            ) : (
              <span className="px-4 text-[var(--text-muted)]">Solo Session</span>
            )}
            {title && roomId && (
              <button 
                onClick={handleCopyRoom}
                className="flex items-center gap-2 px-4 border-l border-[var(--border-secondary)] hover:bg-[var(--bg-secondary)] h-full transition-colors group"
                title="Copy Room ID"
              >
                Room: <span className="font-mono font-bold tracking-wider">{roomId}</span>
                {copied ? <Check size={14} className="text-[#2ecc71]" /> : <Copy size={14} className="text-[var(--text-muted)] group-hover:text-[var(--text-primary)] transition-colors" />}
              </button>
            )}
          </div>
        </div>
        
        <div className="ml-auto px-4 flex items-center gap-4">
          <button onClick={toggleTheme} className="text-[var(--text-primary)] hover:scale-110 hover:text-blue-500 transition-all ml-1 mr-3" title="Toggle Theme">
            {theme === 'light' ? <Moon size={24} /> : <Sun size={24} />}
          </button>
          
          <div className="w-px h-6 bg-[var(--border-secondary)]" />

          {/* Profile & Sign Out Panel */}
          <div className="flex items-center gap-3">
            {user?.photoURL ? (
              <img src={user.photoURL} alt="Avatar" className="w-7 h-7 rounded-full border border-[var(--border-secondary)]" />
            ) : (
              <div className="w-7 h-7 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center text-[var(--text-secondary)]">
                <User size={14} />
              </div>
            )}
            <button 
              onClick={onSignOut}
              className="text-[var(--text-secondary)] hover:text-[#e74c3c] transition-colors p-1"
              title="Sign Out"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Ribbon Row */}
      <div className="flex items-center h-16 px-4 gap-1 overflow-x-auto no-scrollbar">
        {title !== "Collaborative Notebook" && (
          <>
            {/* File Tools */}
            <div className="relative">
              <input 
                type="file" 
                accept="image/*" 
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10" 
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
              <ToolBtn icon={FileImage} active={false} title="Import Image" />
            </div>
            <ToolBtn icon={Save} title="Save to Cloud" />
            <ToolBtn icon={FileImage} title="Export PNG" onClick={() => window.dispatchEvent(new CustomEvent('export-board', { detail: 'png' }))} />
            <ToolBtn icon={FileDown} title="Export PDF" onClick={() => window.dispatchEvent(new CustomEvent('export-board', { detail: 'pdf' }))} />

            <Sep />

            <ToolBtn icon={Undo2} title="Undo" onClick={undo} color={canUndo ? "text-[var(--text-secondary)]" : "text-[var(--border-secondary)]"} />
            <ToolBtn icon={Redo2} title="Redo" onClick={redo} color={canRedo ? "text-[var(--text-secondary)]" : "text-[var(--border-secondary)]"} />


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
              <div className="flex items-center gap-2 border border-[var(--border-secondary)] p-1.5 rounded-lg bg-[var(--bg-primary)]">
                {["#111111", "#e74c3c", "#3498db", "#2ecc71", "#f1c40f"].map(c => (
                  <button 
                    key={c} 
                    onClick={() => setCurrentColor(c)}
                    className={clsx(
                      "w-6 h-6 rounded-full border flex items-center justify-center transition-transform",
                      currentColor === c ? "border-[var(--text-primary)] scale-110 shadow-sm" : "border-transparent"
                    )} 
                  >
                    <div className="w-5 h-5 rounded-full" style={{ background: c }} />
                  </button>
                ))}
                <input 
                  type="color" 
                  value={currentColor} 
                  onChange={(e) => setCurrentColor(e.target.value)}
                  className="w-6 h-6 p-0 border-0 bg-transparent rounded cursor-pointer ml-1" 
                />
              </div>
              
              <div className="flex items-center gap-3 border border-[var(--border-secondary)] px-4 py-2 rounded-lg bg-[var(--bg-primary)] min-w-[160px]">
                <span className="text-[var(--text-secondary)] text-[12px] font-medium w-5 text-center">{currentWidth}</span>
                <input 
                  type="range" min="1" max="50" 
                  value={currentWidth} 
                  onChange={(e) => setCurrentWidth(parseInt(e.target.value))}
                  className="w-28 accent-[var(--text-muted)]" 
                />
              </div>
            </div>

            <Sep />
            
            {/* Erase Board explicitly */}
            <ToolBtn icon={Trash2} active={false} onClick={() => window.dispatchEvent(new Event('clear-board'))} title="Erase Board" color="text-[#e74c3c]" />
          </>
        )}

        {title === "Collaborative Notebook" && (
          <div className="flex items-center gap-4 ml-4">
            <span className="text-xs text-[var(--text-muted)] uppercase tracking-wider font-bold mr-2">File Operations:</span>
            
            <div className="relative">
              <input 
                type="file" 
                accept=".txt,.doc,.docx" 
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10" 
                title="Open Document"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    const file = e.target.files[0];
                    const reader = new FileReader();
                    reader.onload = (ev) => {
                      if (ev.target?.result) {
                        const content = ev.target.result.toString();
                        // Extremely simple: drop the text into the board store.
                        // We wrap plain text in <p> tags so Quill renders it correctly.
                        const htmlContent = content.split('\n').map(line => `<p>${line}</p>`).join('');
                        useBoardStore.getState().setNotebookContent(htmlContent);
                      }
                    };
                    reader.readAsText(file);
                  }
                  e.target.value = '';
                }}
              />
              <ToolBtn icon={FolderOpen} active={false} title="Open Document" />
            </div>

            <div className="relative">
              <ToolBtn 
                icon={FileDown} 
                title="Export Options" 
                active={showExportMenu}
                onClick={() => setShowExportMenu(!showExportMenu)} 
              />
              
              <AnimatePresence>
                {showExportMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-14 left-0 w-48 bg-[var(--bg-primary)] border border-[var(--border-secondary)] rounded-xl shadow-2xl py-2 z-50 flex flex-col overflow-hidden"
                  >
                    <button 
                      className="px-4 py-3 text-left text-sm font-medium hover:bg-[var(--bg-secondary)] transition-colors flex items-center gap-3 text-[var(--text-primary)]"
                      onClick={() => {
                        window.print();
                        setShowExportMenu(false);
                      }}
                    >
                      <FileDown size={16} className="text-red-500" /> Export as PDF
                    </button>
                    
                    <button 
                      className="px-4 py-3 text-left text-sm font-medium hover:bg-[var(--bg-secondary)] transition-colors flex items-center gap-3 text-[var(--text-primary)] border-t border-[var(--border-secondary)]"
                      onClick={() => {
                        const text = document.querySelector('.ql-editor')?.textContent || '';
                        const blob = new Blob([text], { type: "text/plain" });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement("a");
                        a.href = url;
                        a.download = "notebook.txt";
                        a.click();
                        setShowExportMenu(false);
                      }}
                    >
                      <Save size={16} className="text-gray-500" /> Export as TXT
                    </button>

                    <button 
                      className="px-4 py-3 text-left text-sm font-medium hover:bg-[var(--bg-secondary)] transition-colors flex items-center gap-3 text-[var(--text-primary)] border-t border-[var(--border-secondary)]"
                      onClick={() => {
                        const html = document.querySelector('.ql-editor')?.innerHTML || '';
                        const header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'></head><body>";
                        const footer = "</body></html>";
                        const sourceHTML = header + html + footer;
                        const blob = new Blob(['\ufeff', sourceHTML], { type: 'application/msword' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement("a");
                        a.href = url;
                        a.download = "notebook.doc";
                        a.click();
                        setShowExportMenu(false);
                      }}
                    >
                      <FileImage size={16} className="text-blue-500" /> Export as DOCX
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {showExportMenu && (
              <div className="fixed inset-0 z-40" onClick={() => setShowExportMenu(false)} />
            )}
          </div>
        )}
      </div>
    </header>
  );
}
