"use client";

import { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";
import { database } from "@/lib/firebase";
import { ref, onValue, set, onDisconnect } from "firebase/database";
import { useBoardStore } from "@/store/board";
import "./Notebook.css"; // We'll create custom dark-mode friendly CSS to override standard Quill

// Dynamically import Quill to avoid SSR issues with `document` access
const ReactQuill = dynamic(() => import("react-quill-new"), { 
  ssr: false,
  loading: () => <div className="p-8 text-[var(--text-muted)] animate-pulse">Loading collaborative editor...</div>
});

const modules = {
  toolbar: [
    [{ 'header': [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'color': [] }, { 'background': [] }],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    ['clean']
  ],
};

interface NotebookProps {
  user: any;
  roomId: string | null;
}

export default function Notebook({ user, roomId }: NotebookProps) {
  const { notebookContent, setNotebookContent } = useBoardStore();
  const [value, setValue] = useState(notebookContent || "");
  const initializedRef = useRef(false);

  useEffect(() => {
    if (!roomId) {
      // Local Mode: just use Zustand storage
      setValue(notebookContent);
      return;
    }

    const roomRef = ref(database, `rooms/${roomId}/notebookContent`);
    
    const unsubscribe = onValue(roomRef, (snapshot) => {
      const data = snapshot.val();
      if (data !== null) {
        // Warning: This simplistic approach might cause minor cursor jumping 
        // if two people type inside the exact same millisecond, but works well normally.
        setValue(data);
        setNotebookContent(data);
      }
    });

    // Cleanup Room logic: when the last user disconnects, erase the room.
    // We achieve this via Firebase onDisconnect for connections array.
    const connRef = ref(database, `rooms/${roomId}/connections/${user.uid}`);
    set(connRef, true);
    onDisconnect(connRef).remove();
    
    // Attempting to delete the whole room if no one is left requires a Cloud Function 
    // or tracking all active connection nodes and deleting `rooms/${roomId}` if null. 
    // For now we rely on the connections map to represent presence.

    return () => {
      set(connRef, null); // remove connection when component unmounts
      unsubscribe();
    };
  }, [roomId]);

  const handleChange = (content: string, delta: any, source: string, editor: any) => {
    // Only broadcast to Firebase or Zustand if the change was made by the USER (typing),
    // NOT if the change came from the API (Firebase updating the value).
    if (source === 'user') {
      setValue(content);
      setNotebookContent(content);
      
      if (roomId) {
        const roomRef = ref(database, `rooms/${roomId}/notebookContent`);
        set(roomRef, content);
      }
    }
  };

  return (
    <div className="w-full h-full flex justify-center bg-[var(--bg-secondary)] overflow-y-auto">
      <div className="w-full max-w-4xl bg-[var(--bg-primary)] shadow-2xl min-h-screen my-8 border border-[var(--border-primary)] rounded-xl overflow-hidden notebook-override">
        <ReactQuill 
          theme="snow" 
          value={value} 
          onChange={handleChange} 
          modules={modules}
          className="h-full min-h-[800px]"
          placeholder="Start typing your collaborative notes here..."
        />
      </div>
    </div>
  );
}
