import { useEffect, useState, useRef } from "react";
import * as Y from "yjs";
import { WebrtcProvider } from "y-webrtc";
import { WhiteboardElement } from "@/types";

export function useYjsWhiteboard(roomId: string | null) {
  const [elements, setElements] = useState<WhiteboardElement[]>([]);
  const ydocRef = useRef<Y.Doc | null>(null);
  const elementsArrayRef = useRef<Y.Array<Y.Map<any>> | null>(null);

  useEffect(() => {
    if (!roomId) return;

    const doc = new Y.Doc();
    ydocRef.current = doc;
    
    // We connect to WebrtcProvider with explicit global signaling servers
    const provider = new WebrtcProvider(`synq-board-${roomId}`, doc, {
      signaling: [
        "wss://signaling.yjs.dev",
        "wss://y-webrtc-signaling-eu.herokuapp.com",
        "wss://y-webrtc-signaling-ru.herokuapp.com"
      ]
    });

    const yElements = doc.getArray<Y.Map<any>>("elements");
    elementsArrayRef.current = yElements;

    let timeoutId: NodeJS.Timeout | null = null;
    const syncElements = () => {
      if (timeoutId) return;
      timeoutId = setTimeout(() => {
        timeoutId = null;
        const data: WhiteboardElement[] = yElements.map(yMap => {
          const el: any = yMap.toJSON();
          return el as WhiteboardElement;
        });
        setElements(data);
      }, 16); // ~60fps
    };

    yElements.observeDeep(syncElements);
    syncElements(); // Initial flush

    return () => {
      yElements.unobserveDeep(syncElements);
      provider.destroy();
      doc.destroy();
    };
  }, [roomId]);

  return { yElements: elementsArrayRef.current, yjsElements: elements, yDoc: ydocRef.current };
}
