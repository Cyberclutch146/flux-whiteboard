"use client";

import React, { useRef, useState, useEffect } from "react";
import { Stage, Layer, Rect, Circle, Line, Text, Image as KonvaImage } from "react-konva";
import useImage from "use-image";
import { useBoardStore } from "@/store/board";
import { v4 as uuidv4 } from "uuid";
import type { ElementType, WhiteboardElement } from "@/types";
import { useMultiplayer } from "@/hooks/useMultiplayer";
import { useYjsWhiteboard } from "@/hooks/useYjsWhiteboard";
import * as Y from "yjs";

export default function Canvas({ user, roomId }: { user: any; roomId: string | null }) {
  const {
    elements,
    addElement,
    updateElement,
    selectedTool,
    selectedElementId,
    selectElement,
    zoom,
    panOffset,
    setPanOffset,
    setZoom,
    pushHistory,
    currentColor,
    currentWidth,
  } = useBoardStore();

  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<any>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  
  // Drawing state (Now integrated with Yjs)
  const { yElements, yjsElements } = useYjsWhiteboard(roomId);
  const isDrawing = useRef(false);
  const activeYMapRef = useRef<Y.Map<any> | null>(null);
  const [currentLine, setCurrentLine] = useState<WhiteboardElement | null>(null);
  
  // Panning state
  const isPanning = useRef(false);
  const lastPanPos = useRef({ x: 0, y: 0 });

  // Text Editing State
  const [editingText, setEditingText] = useState<{ id: string, x: number, y: number, text: string } | null>(null);

  // Multiplayer Hook
  const { emitElement, otherCursors, emitClear } = useMultiplayer(roomId, user?.uid || null, user?.displayName || "Guest");

  useEffect(() => {
    const checkSize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };
    checkSize();
    window.addEventListener("resize", checkSize);
    return () => window.removeEventListener("resize", checkSize);
  }, []);

  // Zoom handling via wheel
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        setZoom(zoom + (e.deltaY < 0 ? 10 : -10));
      } else if (selectedTool === "hand" || e.buttons === 4) {
        setPanOffset({
          x: panOffset.x - e.deltaX,
          y: panOffset.y - e.deltaY
        });
      }
    };
    const node = containerRef.current;
    if (node) {
      node.addEventListener("wheel", handleWheel, { passive: false });
    }
    return () => {
      if (node) node.removeEventListener("wheel", handleWheel);
    };
  }, [zoom, panOffset, selectedTool, setZoom, setPanOffset]);

  // Window listener for exporting
  useEffect(() => {
    const handleExport = (e: any) => {
      if (!stageRef.current) return;
      const dataURL = stageRef.current.toDataURL({ pixelRatio: 2 });
      if (e.detail === 'png') {
        const link = document.createElement("a");
        link.download = "SYNQ-board.png";
        link.href = dataURL;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else if (e.detail === 'pdf') {
        import('jspdf').then((jsPDF) => {
          const pdf = new jsPDF.jsPDF('landscape', 'px', [stageRef.current.width() / 2, stageRef.current.height() / 2]);
          pdf.addImage(dataURL, 'PNG', 0, 0, stageRef.current.width() / 2, stageRef.current.height() / 2);
          pdf.save('SYNQ-board.pdf');
        });
      }
    };
    window.addEventListener('export-board', handleExport);
    return () => window.removeEventListener('export-board', handleExport);
  }, []);

  // Window listener for importing images
  useEffect(() => {
    const handleImportImage = (e: any) => {
      const dataUrl = e.detail;
      const elProps = {
        id: uuidv4(), type: "image" as any, x: Math.random() * 100 - panOffset.x, y: Math.random() * 100 - panOffset.y, width: 300, height: 300, rotation: 0,
        opacity: 100, fill: "transparent", stroke: "transparent", strokeWidth: 0, locked: false,
        visible: true, label: "Image", text: dataUrl 
      };
      
      const yMap = new Y.Map();
      for (const [k, v] of Object.entries(elProps)) {
        yMap.set(k, v);
      }
      yElements?.push([yMap]);
      pushHistory();
    };
    window.addEventListener('import-image', handleImportImage);
    
    const handleClear = () => {
      useBoardStore.getState().clearBoard();
      emitClear();
      yElements?.delete(0, yElements.length);
    };
    window.addEventListener('clear-board', handleClear);

    return () => {
      window.removeEventListener('import-image', handleImportImage);
      window.removeEventListener('clear-board', handleClear);
    };
  }, [addElement, panOffset, pushHistory, emitElement, emitClear]);

  const commitText = () => {
    if (editingText && editingText.text.trim()) {
      const f = currentColor === "transparent" ? "#333333" : currentColor;
      const el: WhiteboardElement = {
        id: editingText.id, type: "text", x: editingText.x, y: editingText.y, width: 200, height: 50, rotation: 0,
        opacity: 100, fill: f, stroke: "transparent", strokeWidth: 0, locked: false,
        visible: true, label: "Text", text: editingText.text
      };
      
      const yMap = new Y.Map();
      for (const [k, v] of Object.entries(el)) {
        yMap.set(k, v);
      }
      yElements?.push([yMap]);
      pushHistory();
    }
    setEditingText(null);
  };

  const handlePointerDown = (e: any) => {
    // If we click the stage while editing text, commit it.
    if (editingText) {
      commitText();
      return;
    }

    const pos = e.target.getStage().getPointerPosition();
    if (!pos) return;
    const worldX = (pos.x - panOffset.x) / (zoom / 100);
    const worldY = (pos.y - panOffset.y) / (zoom / 100);

    // Pan
    if (selectedTool === "hand" || e.evt.button === 1 || e.evt.button === 2) {
      isPanning.current = true;
      lastPanPos.current = { x: pos.x, y: pos.y };
      return;
    }

    if (selectedTool === "select") {
      if (e.target === e.target.getStage()) selectElement(null);
      return;
    }

    if (selectedTool === "pencil" || selectedTool === "line" || selectedTool === "eraser") {
      isDrawing.current = true;
      const initialProps = {
        id: uuidv4(),
        type: (selectedTool === "pencil" || selectedTool === "eraser") ? "path" : "line",
        x: 0, y: 0, width: 0, height: 0, rotation: 0, opacity: 100,
        fill: "transparent",
        stroke: selectedTool === "eraser" ? "#FCFCFA" : currentColor,
        strokeWidth: currentWidth,
        locked: false, visible: true, label: selectedTool,
        globalCompositeOperation: selectedTool === "eraser" ? "destination-out" : "source-over"
      };
      
      const yMap = new Y.Map();
      for (const [k, v] of Object.entries(initialProps)) {
        if (v !== undefined) yMap.set(k, v);
      }
      
      // Use Y.Array for path points to get atomic updates
      if (initialProps.type === "path") {
        const yPoints = new Y.Array<number>();
        yPoints.push([worldX, worldY]);
        yMap.set("points", yPoints);
      } else {
        yMap.set("points", [worldX, worldY]);
      }

      yElements?.push([yMap]);
      activeYMapRef.current = yMap;
      
      setCurrentLine({ ...initialProps, points: [worldX, worldY] } as any);
    } else if (selectedTool === "rect" || selectedTool === "circle") {
      isDrawing.current = true;
      const initialProps = {
        id: uuidv4(),
        type: selectedTool as ElementType,
        x: worldX, y: worldY, width: 0, height: 0, rotation: 0, opacity: 100,
        fill: "transparent", stroke: currentColor, strokeWidth: currentWidth,
        locked: false, visible: true, label: selectedTool,
        globalCompositeOperation: "source-over"
      };
      
      const yMap = new Y.Map();
      for (const [k, v] of Object.entries(initialProps)) {
        if (v !== undefined) yMap.set(k, v);
      }
      
      yElements?.push([yMap]);
      activeYMapRef.current = yMap;
      setCurrentLine(initialProps as any);
    } else if (selectedTool === "text") {
      setEditingText({ id: uuidv4(), x: worldX, y: worldY, text: "" });
    }
  };

  const handlePointerMove = (e: any) => {
    const pos = e.target.getStage().getPointerPosition();
    if (!pos) return;
    
    if (isPanning.current) {
      const dx = pos.x - lastPanPos.current.x;
      const dy = pos.y - lastPanPos.current.y;
      setPanOffset({ x: panOffset.x + dx, y: panOffset.y + dy });
      lastPanPos.current = { x: pos.x, y: pos.y };
      return;
    }

    if (!isDrawing.current || !activeYMapRef.current) return;

    const worldX = (pos.x - panOffset.x) / (zoom / 100);
    const worldY = (pos.y - panOffset.y) / (zoom / 100);

    const elType = activeYMapRef.current.get("type");

    // Yjs Transaction enables multiple updates to dispatch at once efficiently
    yElements?.doc?.transact(() => {
      if (elType === "path") {
        const yPoints = activeYMapRef.current!.get("points");
        if (yPoints instanceof Y.Array) {
          yPoints.push([worldX, worldY]);
        }
      } else if (elType === "line") {
        const oldPoints = activeYMapRef.current!.get("points") || [];
        activeYMapRef.current!.set("points", [oldPoints[0], oldPoints[1], worldX, worldY]);
      } else if (elType === "rect" || elType === "circle") {
        const startX = activeYMapRef.current!.get("x");
        const startY = activeYMapRef.current!.get("y");
        activeYMapRef.current!.set("width", worldX - startX);
        activeYMapRef.current!.set("height", worldY - startY);
      }
    });

    setCurrentLine((prev) => {
      if (!prev) return prev;
      if (prev.type === "path") {
        return { ...prev, points: [...(prev.points || []), worldX, worldY] };
      } else if (prev.type === "line") {
        const oldPoints = prev.points || [];
        return { ...prev, points: [oldPoints[0], oldPoints[1], worldX, worldY] };
      } else if (prev.type === "rect" || prev.type === "circle") {
        const startX = prev.x;
        const startY = prev.y;
        return { ...prev, width: worldX - startX, height: worldY - startY };
      }
      return prev;
    });
  };

  const handlePointerUp = () => {
    isPanning.current = false;
    isDrawing.current = false;
    
    if (activeYMapRef.current) {
      pushHistory();
      if (currentLine) {
        emitElement(currentLine);
      }
      activeYMapRef.current = null;
      setCurrentLine(null);
    }
  };

  // --- EARLY RETURN MUST HAPPEN AFTER ALL HOOKS ---
  if (dimensions.width === 0) return <div ref={containerRef} className="w-full h-full" />;

  const scale = zoom / 100;
  
  // Dynamic background grid using CSS vars
  const gridBackgroundStyle: React.CSSProperties = {
    backgroundImage: `
      linear-gradient(var(--grid-line) 1px, transparent 1px),
      linear-gradient(90deg, var(--grid-line) 1px, transparent 1px)
    `,
    backgroundSize: `${40 * scale}px ${40 * scale}px`,
    backgroundPosition: `${panOffset.x}px ${panOffset.y}px`,
    backgroundColor: 'var(--bg-primary)',
    touchAction: 'none'
  };

  const renderElement = (el: WhiteboardElement) => {
    const isSelected = selectedElementId === el.id;
    const stroke = isSelected ? "#3498db" : el.stroke;
    const shadow = isSelected ? { shadowColor: '#3498db', shadowBlur: 10, shadowOpacity: 0.3 } : {};
    const gco = el.globalCompositeOperation || "source-over";

    switch (el.type) {
      case "path":
      case "line":
        return <Line key={el.id} points={el.points || []} stroke={stroke} strokeWidth={el.strokeWidth} tension={0.5} lineCap="round" lineJoin="round" globalCompositeOperation={gco as any} {...shadow} />;
      case "rect":
        return <Rect key={el.id} x={el.x} y={el.y} width={el.width} height={el.height} stroke={stroke} strokeWidth={el.strokeWidth} fill={el.fill} globalCompositeOperation={gco as any} {...shadow} />;
      case "circle":
        return <Circle key={el.id} x={el.x + el.width/2} y={el.y + el.width/2} radius={Math.abs(el.width)/2} stroke={stroke} strokeWidth={el.strokeWidth} fill={el.fill} globalCompositeOperation={gco as any} {...shadow} />;
      case "text":
        const f = el.fill === "transparent" ? "#333333" : el.fill;
        return <Text key={el.id} x={el.x} y={el.y} text={el.text || ""} fontSize={24} fill={f} globalCompositeOperation={gco as any} {...shadow} />;
      // @ts-ignore
      case "image":
        return <AsyncImage key={el.id} el={el} isSelected={isSelected} />;
      default:
        return null;
    }
  };

  const cursorCss = selectedTool === "hand" ? "cursor-grab active:cursor-grabbing" : selectedTool === "select" ? "cursor-default" : "cursor-crosshair";

  return (
    <div 
      ref={containerRef} 
      className={`absolute inset-0 ${cursorCss}`}
      style={gridBackgroundStyle}
      onContextMenu={(e) => e.preventDefault()}
    >
      <Stage
        width={dimensions.width}
        height={dimensions.height}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        ref={stageRef}
      >
        <Layer x={panOffset.x} y={panOffset.y} scaleX={scale} scaleY={scale}>
          {elements.map((el) => {
            if (!el.visible) return null;
            // Avoid duplicate rendering if element is also in Yjs
            if (yjsElements.some(yEl => yEl.id === el.id)) return null;
            return <React.Fragment key={el.id}>{renderElement(el)}</React.Fragment>;
          })}
          
          {/* Render new Yjs-streamed elements */}
          {yjsElements.map((el) => {
            if (!el.visible) return null;
            if (currentLine && el.id === currentLine.id) return null;
            return <React.Fragment key={el.id}>{renderElement(el)}</React.Fragment>;
          })}
          
          {currentLine && renderElement(currentLine)}
          
          {/* Render Other Users' Cursors */}
          {Object.entries(otherCursors).map(([uid, cursor]) => (
            <React.Fragment key={uid}>
              <Circle x={cursor.x} y={cursor.y} radius={4} fill="#e74c3c" />
              <Text x={cursor.x + 8} y={cursor.y + 8} text={cursor.name} fontSize={12} fill="#e74c3c" />
            </React.Fragment>
          ))}
        </Layer>
      </Stage>

      {/* Floating Text Editor */}
      {editingText && (
        <textarea
          autoFocus
          className="absolute bg-transparent border-none outline-none resize-none overflow-hidden m-0 p-0"
          style={{
            left: editingText.x * scale + panOffset.x,
            top: editingText.y * scale + panOffset.y,
            fontSize: `${24 * scale}px`,
            color: currentColor,
            fontFamily: "sans-serif",
            lineHeight: 1,
            zIndex: 100,
            whiteSpace: "pre-wrap"
          }}
          value={editingText.text}
          onChange={(e) => setEditingText({ ...editingText, text: e.target.value })}
          onBlur={commitText}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              commitText();
            }
          }}
        />
      )}
    </div>
  );
}

// Helper to render Konva Image from data URL
function AsyncImage({ el, isSelected }: { el: WhiteboardElement, isSelected: boolean }) {
  const [image] = useImage(el.text || '');
  const shadow = isSelected ? { shadowColor: '#3498db', shadowBlur: 10, shadowOpacity: 0.3 } : {};
  return <KonvaImage key={el.id} x={el.x} y={el.y} image={image} width={el.width} height={el.height} globalCompositeOperation={el.globalCompositeOperation as any} {...shadow} />;
}
