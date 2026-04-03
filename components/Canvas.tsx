"use client";

import React, { useRef, useState, useEffect } from "react";
import { Stage, Layer, Rect, Circle, Line, Text } from "react-konva";
import { useBoardStore } from "@/store/board";
import { v4 as uuidv4 } from "uuid";
import type { ElementType, WhiteboardElement } from "@/types";

export default function Canvas() {
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
  
  // Drawing state
  const isDrawing = useRef(false);
  const [currentLine, setCurrentLine] = useState<WhiteboardElement | null>(null);
  
  // Panning state
  const isPanning = useRef(false);
  const lastPanPos = useRef({ x: 0, y: 0 });

  // Text Editing State
  const [editingText, setEditingText] = useState<{ id: string, x: number, y: number, text: string } | null>(null);

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

  // Window listener for exporting (dirty hack but works cleanly for Vercel/Next client)
  useEffect(() => {
    const handleExport = (e: any) => {
      if (!stageRef.current) return;
      const dataURL = stageRef.current.toDataURL({ pixelRatio: 2 });
      if (e.detail === 'png') {
        const link = document.createElement("a");
        link.download = "flux-board.png";
        link.href = dataURL;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else if (e.detail === 'pdf') {
        import('jspdf').then((jsPDF) => {
          const pdf = new jsPDF.jsPDF('landscape', 'px', [stageRef.current.width() / 2, stageRef.current.height() / 2]);
          pdf.addImage(dataURL, 'PNG', 0, 0, stageRef.current.width() / 2, stageRef.current.height() / 2);
          pdf.save('flux-board.pdf');
        });
      }
    };
    window.addEventListener('export-board', handleExport);
    return () => window.removeEventListener('export-board', handleExport);
  }, []);

  const handlePointerDown = (e: any) => {
    // If we're editing text and click away, commit it.
    if (editingText) {
      if (editingText.text.trim()) {
        addElement({
          id: editingText.id, type: "text", x: editingText.x, y: editingText.y, width: 200, height: 50, rotation: 0,
          opacity: 100, fill: currentColor, stroke: "transparent", strokeWidth: 0, locked: false,
          visible: true, label: "Text", text: editingText.text
        });
        pushHistory();
      }
      setEditingText(null);
      return;
    }

    const pos = e.target.getStage().getPointerPosition();
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
      setCurrentLine({
        id: uuidv4(),
        type: (selectedTool === "pencil" || selectedTool === "eraser") ? "path" : "line",
        x: 0, y: 0, width: 0, height: 0, rotation: 0, opacity: 100,
        fill: "transparent",
        stroke: selectedTool === "eraser" ? "#FCFCFA" : currentColor,
        strokeWidth: currentWidth,
        locked: false, visible: true, label: selectedTool,
        points: [worldX, worldY],
        globalCompositeOperation: selectedTool === "eraser" ? "destination-out" : "source-over"
      });
    } else if (selectedTool === "rect" || selectedTool === "circle") {
      isDrawing.current = true;
      setCurrentLine({
        id: uuidv4(),
        type: selectedTool as ElementType,
        x: worldX, y: worldY, width: 0, height: 0, rotation: 0, opacity: 100,
        fill: "transparent", stroke: currentColor, strokeWidth: currentWidth,
        locked: false, visible: true, label: selectedTool,
        globalCompositeOperation: "source-over"
      });
    } else if (selectedTool === "text") {
      setEditingText({ id: uuidv4(), x: worldX, y: worldY, text: "" });
    }
  };

  const handlePointerMove = (e: any) => {
    const pos = e.target.getStage().getPointerPosition();
    
    if (isPanning.current) {
      const dx = pos.x - lastPanPos.current.x;
      const dy = pos.y - lastPanPos.current.y;
      setPanOffset({ x: panOffset.x + dx, y: panOffset.y + dy });
      lastPanPos.current = { x: pos.x, y: pos.y };
      return;
    }

    if (!isDrawing.current || !currentLine) return;

    const worldX = (pos.x - panOffset.x) / (zoom / 100);
    const worldY = (pos.y - panOffset.y) / (zoom / 100);

    if (currentLine.type === "path") {
      setCurrentLine({
        ...currentLine,
        points: [...(currentLine.points || []), worldX, worldY]
      });
    } else if (currentLine.type === "line") {
      setCurrentLine({
        ...currentLine,
        points: [(currentLine.points || [])[0], (currentLine.points || [])[1], worldX, worldY]
      });
    } else if (currentLine.type === "rect" || currentLine.type === "circle") {
      setCurrentLine({
        ...currentLine,
        width: worldX - currentLine.x,
        height: worldY - currentLine.y
      });
    }
  };

  const handlePointerUp = () => {
    isPanning.current = false;
    if (isDrawing.current && currentLine) {
      addElement(currentLine);
      setCurrentLine(null);
      pushHistory();
    }
    isDrawing.current = false;
  };

  if (dimensions.width === 0) return <div ref={containerRef} className="w-full h-full" />;

  const scale = zoom / 100;
  
  // Light mode background grid
  const gridBackgroundStyle = {
    backgroundImage: `
      linear-gradient(rgba(229,224,216,0.5) 1px, transparent 1px),
      linear-gradient(90deg, rgba(229,224,216,0.5) 1px, transparent 1px)
    `,
    backgroundSize: `${40 * scale}px ${40 * scale}px`,
    backgroundPosition: `${panOffset.x}px ${panOffset.y}px`,
    backgroundColor: '#FCFCFA'
  };

  // Window listener for importing images
  useEffect(() => {
    const handleImportImage = (e: any) => {
      const dataUrl = e.detail;
      addElement({
        id: uuidv4(), type: "image" as any, x: Math.random() * 100 - panOffset.x, y: Math.random() * 100 - panOffset.y, width: 300, height: 300, rotation: 0,
        opacity: 100, fill: "transparent", stroke: "transparent", strokeWidth: 0, locked: false,
        visible: true, label: "Image", text: dataUrl // store data URL in text temporarily or create new 'src' field, let's use text
      });
      pushHistory();
    };
    window.addEventListener('import-image', handleImportImage);
    return () => window.removeEventListener('import-image', handleImportImage);
  }, [addElement, panOffset, pushHistory]);

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
        // For actual image node, we'd need to use the useImage hook. We'll render a placeholder text or use standard Image if we load it.
        // Let's create an img element dynamically to get the konva Image working
        // But react-konva requires an HTMLImageElement object.
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
        ref={stageRef}
      >
        <Layer x={panOffset.x} y={panOffset.y} scaleX={scale} scaleY={scale}>
          {elements.map((el) => {
            if (!el.visible) return null;
            return <React.Fragment key={el.id}>{renderElement(el)}</React.Fragment>;
          })}
          {currentLine && renderElement(currentLine)}
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
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handlePointerDown({ target: { getStage: () => ({ getPointerPosition: () => ({x: 0, y: 0}) })}, evt: {} });
            }
          }}
        />
      )}
    </div>
  );
}

// Helper to render Konva Image from data URL
import { Image as KonvaImage } from 'react-konva';
import useImage from 'use-image';

function AsyncImage({ el, isSelected }: { el: WhiteboardElement, isSelected: boolean }) {
  const [image] = useImage(el.text || '');
  const shadow = isSelected ? { shadowColor: '#3498db', shadowBlur: 10, shadowOpacity: 0.3 } : {};
  return <KonvaImage key={el.id} x={el.x} y={el.y} image={image} width={el.width} height={el.height} globalCompositeOperation={el.globalCompositeOperation as any} {...shadow} />;
}
