"use client";

import { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";
import { database } from "@/lib/firebase";
import { ref, onValue, set } from "firebase/database";
import { useBoardStore } from "@/store/board";
import GhostCursors from "./GhostCursors";
import ShapeGrid from "./ShapeGrid";
import Noise from "./Noise";

// Import react-quill-new dynamically to avoid SSR issues
const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
  loading: () => <div className="p-8 text-[var(--text-muted)] animate-pulse">Initializing Editor...</div>,
});
import "react-quill-new/dist/quill.snow.css";
import "./Notebook.css"; 

interface NotebookProps {
  user: any;
  roomId: string | null;
}

export default function Notebook({ user, roomId }: NotebookProps) {
  const { notebookContent, setNotebookContent, theme } = useBoardStore();
  const [internalValue, setInternalValue] = useState(notebookContent || "");
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Timer for debouncing firebase writes
  const typingTimer = useRef<NodeJS.Timeout | null>(null);

  // Sync from Firebase
  useEffect(() => {
    if (!roomId) return;

    const notebookRef = ref(database, `rooms/${roomId}/notebookContent`);
    const unsubscribe = onValue(notebookRef, (snapshot) => {
      const data = snapshot.val();
      if (data !== null && data !== internalValue) {
        setInternalValue(data);
        if (notebookContent !== data) {
          setNotebookContent(data);
        }
      }
    });

    return () => unsubscribe();
  }, [roomId]); 

  // Handle changes
  const handleChange = (content: string, delta: any, source: string, editor: any) => {
    setInternalValue(content);
    setNotebookContent(content);

    if (roomId && source === 'user') {
      if (typingTimer.current) clearTimeout(typingTimer.current);
      
      typingTimer.current = setTimeout(() => {
        set(ref(database, `rooms/${roomId}/notebookContent`), content);
      }, 500); // 500ms debounce
    }
  };

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ color: [] }, { background: [] }],
      [{ list: "ordered" }, { list: "bullet" }],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "bold", "italic", "underline", "strike",
    "color", "background",
    "list",
  ];

  return (
    <div className="relative w-full h-full flex flex-col items-center bg-[var(--bg-secondary)] overflow-y-auto no-scrollbar py-12 px-4" ref={containerRef}>
      
      {/* Background Texture Logic */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {theme === 'light' ? (
          <div className="absolute inset-0 opacity-20">
            <ShapeGrid 
              speed={0.4} squareSize={50} direction='diagonal' 
              borderColor='var(--text-muted)' hoverFillColor='transparent' 
              shape='square' hoverTrailAmount={0} 
            />
          </div>
        ) : (
          <Noise 
            patternSize={250} patternScaleX={2} patternScaleY={2} 
            patternRefreshInterval={2} patternAlpha={15} 
          />
        )}
      </div>

      {roomId && <GhostCursors roomId={roomId} currentUser={user} containerRef={containerRef} />}
      
      <div className="relative w-full max-w-4xl bg-[var(--bg-primary)] shadow-[0_20px_80px_-15px_rgba(249,115,22,0.1)] min-h-[100vh] border border-[var(--border-primary)] rounded-[2rem] overflow-hidden z-10 transition-all duration-500">
        
        {/* Luminous Orange Top Edge Accent */}
        <div className="w-full h-1.5 bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 shadow-[0_0_20px_rgba(249,115,22,0.4)]" />

        <ReactQuill
          theme="snow"
          value={internalValue}
          onChange={handleChange}
          modules={modules}
          formats={formats}
          className="h-full min-h-[800px] quill-modern"
          placeholder="Start typing your collaborative notes here..."
        />
      </div>
    </div>
  );
}
