"use client";

import React, { useRef, useState, useEffect } from "react";
import { Stage, Layer, Rect, Circle, Line, Text } from "react-konva";
import { database } from "@/lib/firebase";
import { ref, onChildAdded, set, onValue, remove } from "firebase/database";
import { v4 as uuidv4 } from "uuid";
import type { WhiteboardElement, ElementType } from "@/types";
import { MousePointer2, Pencil, Square, Circle as CircleIcon, Eraser, Trash2 } from "lucide-react";

interface MiniBoardProps {
  roomId: string;
  blockId: string;
}

export default function MiniBoard({ roomId, blockId }: MiniBoardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<any>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [elements, setElements] = useState<WhiteboardElement[]>([]);
  const elementsMapRef = useRef<Record<string, boolean>>({});

  const [selectedTool, setSelectedTool] = useState<"select"|"pencil"|"rect"|"circle"|"eraser">("pencil");
  const [currentColor, setCurrentColor] = useState("#3498db");

  const isDrawing = useRef(false);
  const [currentLine, setCurrentLine] = useState<WhiteboardElement | null>(null);

  useEffect(() => {
    const checkSize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: 400, // Fixed height for embedded boards
        });
      }
    };
    checkSize();
    window.addEventListener("resize", checkSize);
    return () => window.removeEventListener("resize", checkSize);
  }, []);

  useEffect(() => {
    if (!roomId || !blockId) return;

    const boardRef = ref(database, `rooms/${roomId}/miniboards/${blockId}/elements`);
    
    const unsub = onChildAdded(boardRef, (snapshot) => {
      const el = snapshot.val() as WhiteboardElement;
      if (!el || elementsMapRef.current[el.id]) return;
      elementsMapRef.current[el.id] = true;
      setElements(prev => [...prev, el]);
    });

    const unsubClear = onValue(boardRef, (snap) => {
      if (!snap.exists()) {
        elementsMapRef.current = {};
        setElements([]);
      }
    });

    return () => {
      unsub();
      unsubClear();
    };
  }, [roomId, blockId]);

  const emitElement = (el: WhiteboardElement) => {
    elementsMapRef.current[el.id] = true;
    setElements(prev => [...prev, el]);
    set(ref(database, `rooms/${roomId}/miniboards/${blockId}/elements/${el.id}`), el);
  };

  const handlePointerDown = (e: any) => {
    if (selectedTool === "select") return;
    isDrawing.current = true;
    const pos = e.target.getStage().getPointerPosition();
    
    if (selectedTool === "pencil" || selectedTool === "eraser") {
      setCurrentLine({
        id: uuidv4(),
        type: "path",
        x: 0, y: 0, width: 0, height: 0, rotation: 0, opacity: 100,
        fill: "transparent",
        stroke: selectedTool === "eraser" ? "transparent" : currentColor,
        strokeWidth: selectedTool === "eraser" ? 20 : 4,
        locked: false, visible: true, label: selectedTool,
        points: [pos.x, pos.y],
        globalCompositeOperation: selectedTool === "eraser" ? "destination-out" : "source-over"
      });
    } else {
      setCurrentLine({
        id: uuidv4(),
        type: selectedTool as ElementType,
        x: pos.x, y: pos.y, width: 0, height: 0, rotation: 0, opacity: 100,
        fill: "transparent", stroke: currentColor, strokeWidth: 4,
        locked: false, visible: true, label: selectedTool,
        globalCompositeOperation: "source-over"
      });
    }
  };

  const handlePointerMove = (e: any) => {
    if (!isDrawing.current || !currentLine) return;
    const pos = e.target.getStage().getPointerPosition();
    if (currentLine.type === "path") {
      setCurrentLine({ ...currentLine, points: [...(currentLine.points || []), pos.x, pos.y] });
    } else {
      setCurrentLine({ ...currentLine, width: pos.x - currentLine.x, height: pos.y - currentLine.y });
    }
  };

  const handlePointerUp = () => {
    if (isDrawing.current && currentLine) {
      emitElement(currentLine);
      setCurrentLine(null);
    }
    isDrawing.current = false;
  };

  const clearBoard = () => {
    setElements([]);
    elementsMapRef.current = {};
    remove(ref(database, `rooms/${roomId}/miniboards/${blockId}/elements`));
  };

  return (
    <div className="w-full relative rounded-2xl border border-[var(--border-secondary)] bg-[var(--bg-secondary)] overflow-hidden my-4 group shadow-sm transition-all hover:shadow-md">
      {/* Mini Toolbar */}
      <div className="absolute top-4 left-4 z-10 flex gap-2 bg-[var(--bg-primary)] p-1.5 rounded-xl border border-[var(--border-primary)] shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={() => setSelectedTool("select")} className={`p-2 rounded-lg transition-colors ${selectedTool === "select" ? 'bg-[var(--text-primary)] text-[var(--bg-primary)]' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]'}`}>
          <MousePointer2 size={16} />
        </button>
        <button onClick={() => setSelectedTool("pencil")} className={`p-2 rounded-lg transition-colors ${selectedTool === "pencil" ? 'bg-[var(--text-primary)] text-[var(--bg-primary)]' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]'}`}>
          <Pencil size={16} />
        </button>
        <button onClick={() => setSelectedTool("rect")} className={`p-2 rounded-lg transition-colors ${selectedTool === "rect" ? 'bg-[var(--text-primary)] text-[var(--bg-primary)]' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]'}`}>
          <Square size={16} />
        </button>
        <button onClick={() => setSelectedTool("circle")} className={`p-2 rounded-lg transition-colors ${selectedTool === "circle" ? 'bg-[var(--text-primary)] text-[var(--bg-primary)]' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]'}`}>
          <CircleIcon size={16} />
        </button>
        <button onClick={() => setSelectedTool("eraser")} className={`p-2 rounded-lg transition-colors ${selectedTool === "eraser" ? 'bg-[var(--text-primary)] text-[var(--bg-primary)]' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]'}`}>
          <Eraser size={16} />
        </button>
        <div className="w-px h-6 bg-[var(--border-secondary)] mx-1 self-center" />
        <input 
          type="color" 
          value={currentColor} 
          onChange={(e) => setCurrentColor(e.target.value)}
          className="w-8 h-8 rounded cursor-pointer border-0 p-0 self-center bg-transparent"
        />
        <div className="w-px h-6 bg-[var(--border-secondary)] mx-1 self-center" />
        <button onClick={clearBoard} className="p-2 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors">
          <Trash2 size={16} />
        </button>
      </div>

      <div ref={containerRef} className="w-full h-[400px] cursor-crosshair">
        {dimensions.width > 0 && (
          <Stage
            width={dimensions.width}
            height={dimensions.height}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            ref={stageRef}
          >
            <Layer>
              {/* Very faint grid specifically for isolated embedded board */}
              <Rect x={0} y={0} width={dimensions.width} height={dimensions.height} fill="transparent" />
              {elements.map((el) => {
                if (!el.visible) return null;
                const gco = el.globalCompositeOperation || "source-over";
                if (el.type === "path" || el.type === "line") {
                  return <Line key={el.id} points={el.points || []} stroke={el.stroke} strokeWidth={el.strokeWidth} tension={0.5} lineCap="round" lineJoin="round" globalCompositeOperation={gco as any} />;
                } else if (el.type === "rect") {
                  return <Rect key={el.id} x={el.x} y={el.y} width={el.width} height={el.height} stroke={el.stroke} strokeWidth={el.strokeWidth} fill={el.fill} globalCompositeOperation={gco as any} />;
                } else if (el.type === "circle") {
                  return <Circle key={el.id} x={el.x + el.width/2} y={el.y + el.width/2} radius={Math.abs(el.width)/2} stroke={el.stroke} strokeWidth={el.strokeWidth} fill={el.fill} globalCompositeOperation={gco as any} />;
                }
                return null;
              })}
              {currentLine && (currentLine.type === "path" || currentLine.type === "line" 
                ? <Line points={currentLine.points || []} stroke={currentLine.stroke} strokeWidth={currentLine.strokeWidth} tension={0.5} lineCap="round" lineJoin="round" globalCompositeOperation={currentLine.globalCompositeOperation as any} />
                : currentLine.type === "rect" 
                ? <Rect x={currentLine.x} y={currentLine.y} width={currentLine.width} height={currentLine.height} stroke={currentLine.stroke} strokeWidth={currentLine.strokeWidth} fill={currentLine.fill} />
                : <Circle x={currentLine.x + currentLine.width/2} y={currentLine.y + currentLine.width/2} radius={Math.abs(currentLine.width)/2} stroke={currentLine.stroke} strokeWidth={currentLine.strokeWidth} fill={currentLine.fill} />
              )}
            </Layer>
          </Stage>
        )}
      </div>
    </div>
  );
}
