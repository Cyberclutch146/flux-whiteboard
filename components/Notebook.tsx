"use client";

import { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";
import { database } from "@/lib/firebase";
import { ref, onValue, set } from "firebase/database";
import { useBoardStore } from "@/store/board";

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
  const { notebookContent, setNotebookContent } = useBoardStore();
  const [internalValue, setInternalValue] = useState(notebookContent || "");
  
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
  }, [roomId]); // Explicitly omitted internalValue to avoid infinite loops

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
    "list", "bullet",
  ];

  return (
    <div className="w-full h-full flex flex-col items-center bg-[var(--bg-secondary)] overflow-y-auto no-scrollbar py-12 px-4">
      <div className="w-full max-w-4xl bg-[var(--bg-primary)] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] min-h-[100vh] border border-[var(--border-primary)] rounded-[2rem] overflow-hidden">
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
