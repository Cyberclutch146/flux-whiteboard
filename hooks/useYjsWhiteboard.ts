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
    
    // We connect to WebrtcProvider
    const provider = new WebrtcProvider(`synq-board-${roomId}`, doc);

    const yElements = doc.getArray<Y.Map<any>>("elements");
    elementsArrayRef.current = yElements;

    const syncElements = () => {
      const data: WhiteboardElement[] = yElements.map(yMap => {
        const el: any = yMap.toJSON();
        return el as WhiteboardElement;
      });
      setElements(data);
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
