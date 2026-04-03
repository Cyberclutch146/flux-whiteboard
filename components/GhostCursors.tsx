"use client";

import { useEffect, useState, useRef } from "react";
import { database } from "@/lib/firebase";
import { ref, onValue, set, onDisconnect } from "firebase/database";
import { motion } from "framer-motion";

interface CursorData {
  x: number;
  y: number;
  name: string;
  color: string;
  updatedAt: number;
}

interface GhostCursorsProps {
  roomId: string;
  currentUser: any;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

const COLORS = ['#958DF1', '#F98181', '#FBCE76', '#ea4c89', '#3498db', '#2ecc71', '#9b59b6'];

export default function GhostCursors({ roomId, currentUser, containerRef }: GhostCursorsProps) {
  const [cursors, setCursors] = useState<{ [uid: string]: CursorData }>({});
  const myColor = useRef(COLORS[Math.floor(Math.random() * COLORS.length)]);
  
  useEffect(() => {
    if (!roomId) return;
    
    const cursorsRef = ref(database, `rooms/${roomId}/cursors`);
    const myUid = currentUser?.uid || Math.random().toString(36).substring(7);
    const myCursorRef = ref(database, `rooms/${roomId}/cursors/${myUid}`);

    // Cleanup on disconnect
    onDisconnect(myCursorRef).remove();

    // Listen for other cursors
    const unsubscribe = onValue(cursorsRef, (snapshot) => {
      const data = snapshot.val() || {};
      
      // Filter out stale cursors (> 30s old) and self
      const now = Date.now();
      const activeCursors: { [uid: string]: CursorData } = {};
      
      Object.keys(data).forEach(uid => {
        if (uid !== myUid && (now - data[uid].updatedAt < 30000)) {
          activeCursors[uid] = data[uid];
        }
      });
      
      setCursors(activeCursors);
    });

    // Track local mouse movements
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      
      // Calculate position relative to the container
      const rect = containerRef.current.getBoundingClientRect();
      const relativeX = e.clientX - rect.left;
      const relativeY = e.clientY - rect.top;

      // Only send if inside container bounds roughly
      if (relativeX < 0 || relativeY < 0 || relativeX > rect.width || relativeY > rect.height) {
        return;
      }

      set(myCursorRef, {
        x: relativeX,
        y: relativeY,
        name: currentUser?.displayName || "Anonymous",
        color: myColor.current,
        updatedAt: Date.now()
      });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      unsubscribe();
      set(myCursorRef, null); // remove on unmount
    };
  }, [roomId, currentUser, containerRef]);

  // Render ghost cursors
  return (
    <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
      {Object.entries(cursors).map(([uid, pos]) => (
        <motion.div
           key={uid}
           initial={{ x: pos.x, y: pos.y, opacity: 0 }}
           animate={{ x: pos.x, y: pos.y, opacity: 1 }}
           transition={{ type: "spring", stiffness: 400, damping: 25, mass: 0.5 }}
           className="absolute top-0 left-0 flex flex-col items-start gap-1"
           style={{ pointerEvents: 'none' }}
        >
          {/* Custom SVG Pointer */}
          <svg style={{ fill: pos.color, transform: 'scale(1.2)' }} width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86a.5.5 0 0 1 .35-.15h6.87a.5.5 0 0 0 .35-.85L5.85 2.86a.5.5 0 0 0-.35 1.35z"/>
          </svg>
          
          {/* Name Tag */}
          <div 
            className="px-2 py-0.5 rounded-md text-white text-[11px] font-bold tracking-wider shadow-sm ml-4 whitespace-nowrap"
            style={{ backgroundColor: pos.color }}
          >
            {pos.name}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
