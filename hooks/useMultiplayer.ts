import { useEffect, useRef, useState } from 'react';
import { useBoardStore } from '@/store/board';
import { database } from '@/lib/firebase';
import { ref, onChildAdded, onValue, set, remove, onDisconnect } from 'firebase/database';
import { WhiteboardElement } from '@/types';

export function useMultiplayer(roomId: string | null, userId: string | null, userName: string) {
  const { addElement, zoom, panOffset } = useBoardStore();
  const elementsRef = useRef<Record<string, boolean>>({});
  const [otherCursors, setOtherCursors] = useState<Record<string, { x: number, y: number, name: string }>>({});

  useEffect(() => {
    if (!roomId) return;
    
    // 1. Sync Elements
    const roomRef = ref(database, `rooms/${roomId}/elements`);
    
    // Initial fetch to populate board
    const unsubElements = onChildAdded(roomRef, (snapshot) => {
      const el = snapshot.val() as WhiteboardElement;
      if (!el || elementsRef.current[el.id]) return; // Avoid duplicates
      elementsRef.current[el.id] = true;
      addElement(el);
    });

    // 2. Sync Cursors
    const cursorsRef = ref(database, `rooms/${roomId}/cursors`);
    
    const unsubCursorUpdate = onValue(cursorsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // filter out my own cursor
        if (userId) {
           const { [userId]: myC, ...rest } = data;
           setOtherCursors(rest);
        } else {
           setOtherCursors(data);
        }
      } else {
        setOtherCursors({});
      }
    });

    if (userId) {
      const myCursorRef = ref(database, `rooms/${roomId}/cursors/${userId}`);
      onDisconnect(myCursorRef).remove();
      
      const handleMouseMove = (e: MouseEvent) => {
        const worldX = (e.clientX - panOffset.x) / (zoom / 100);
        const worldY = (e.clientY - panOffset.y) / (zoom / 100);
        set(myCursorRef, { x: worldX, y: worldY, name: userName });
      };
      
      window.addEventListener('mousemove', handleMouseMove);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        remove(myCursorRef);
      };
    }
  }, [roomId, userId, userName, zoom, panOffset, addElement]);

  // Expose a function to push elements to Firebase
  const emitElement = (el: WhiteboardElement) => {
    if (!roomId) return;
    elementsRef.current[el.id] = true;
    set(ref(database, `rooms/${roomId}/elements/${el.id}`), el);
  };
  
  const emitClear = () => {
    if (!roomId) return;
    elementsRef.current = {};
    remove(ref(database, `rooms/${roomId}/elements`));
  }

  return { emitElement, emitClear, otherCursors };
}
