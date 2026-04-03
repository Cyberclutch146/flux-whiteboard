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
  } = useBoardStore();

  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  
  // Drawing state
  const isDrawing = useRef(false);
  const [currentLine, setCurrentLine] = useState<WhiteboardElement | null>(null);
  
  // Panning state
  const isPanning = useRef(false);
  const lastPanPos = useRef({ x: 0, y: 0 });

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

  const handlePointerDown = (e: any) => {
    const pos = e.target.getStage().getPointerPosition();
    // Convert to world pos based on zoom/pan
    const worldX = (pos.x - panOffset.x) / (zoom / 100);
    const worldY = (pos.y - panOffset.y) / (zoom / 100);

    if (selectedTool === "hand" || e.evt.button === 1 || e.evt.button === 2) {
      isPanning.current = true;
      lastPanPos.current = { x: pos.x, y: pos.y };
      return;
    }

    if (selectedTool === "select") {
      // Handled by individual element onClick, if we click stage it deselects
      if (e.target === e.target.getStage()) {
        selectElement(null);
      }
      return;
    }

    if (selectedTool === "pencil" || selectedTool === "line") {
      isDrawing.current = true;
      setCurrentLine({
        id: uuidv4(),
        type: selectedTool === "pencil" ? "path" : "line",
        x: 0, y: 0, width: 0, height: 0, rotation: 0, opacity: 100,
        fill: "transparent",
        stroke: "#ffffff",
        strokeWidth: selectedTool === "pencil" ? 4 : 2,
        locked: false, visible: true, label: selectedTool,
        points: [worldX, worldY],
      });
    } else if (selectedTool === "rect" || selectedTool === "circle") {
      isDrawing.current = true;
      setCurrentLine({
        id: uuidv4(),
        type: selectedTool as ElementType,
        x: worldX, y: worldY, width: 0, height: 0, rotation: 0, opacity: 100,
        fill: "transparent", stroke: "#ffffff", strokeWidth: 2,
        locked: false, visible: true, label: selectedTool,
      });
    } else if (selectedTool === "text") {
      const text = window.prompt("Enter text:");
      if (text) {
        addElement({
           id: uuidv4(), type: "text", x: worldX, y: worldY, width: 200, height: 50, rotation: 0,
           opacity: 100, fill: "#ffffff", stroke: "transparent", strokeWidth: 0, locked: false,
           visible: true, label: "Text", text
        });
      }
      selectElement("select");
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
  
  // Calculate grid background style based on pan/zoom
  const gridBackgroundStyle = {
    backgroundImage: `
      linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
    `,
    backgroundSize: `${40 * scale}px ${40 * scale}px`,
    backgroundPosition: `${panOffset.x}px ${panOffset.y}px`
  };

  const renderElement = (el: WhiteboardElement) => {
    const isSelected = selectedElementId === el.id;
    const stroke = isSelected ? "#3498db" : el.stroke;
    const shadow = isSelected ? { shadowColor: '#3498db', shadowBlur: 10, shadowOpacity: 0.5 } : {};

    switch (el.type) {
      case "path":
      case "line":
        return <Line key={el.id} points={el.points || []} stroke={stroke} strokeWidth={el.strokeWidth} tension={0.5} lineCap="round" lineJoin="round" {...shadow} />;
      case "rect":
        return <Rect key={el.id} x={el.x} y={el.y} width={el.width} height={el.height} stroke={stroke} strokeWidth={el.strokeWidth} fill={el.fill} {...shadow} />;
      case "circle":
        // For circle, x/y are center, width is radius * 2
        return <Circle key={el.id} x={el.x + el.width/2} y={el.y + el.width/2} radius={Math.abs(el.width)/2} stroke={stroke} strokeWidth={el.strokeWidth} fill={el.fill} {...shadow} />;
      case "text":
        return <Text key={el.id} x={el.x} y={el.y} text={el.text || ""} fontSize={16} fill={el.fill === "transparent" ? "#ffffff" : el.fill} {...shadow} />;
      default:
        return null;
    }
  };

  const cursorCss = selectedTool === "hand" ? "cursor-grab active:cursor-grabbing" : selectedTool === "select" ? "cursor-default" : "cursor-crosshair";

  return (
    <div 
      ref={containerRef} 
      className={`absolute inset-0 bg-[#1A1A1A] ${cursorCss}`}
      style={gridBackgroundStyle}
      onContextMenu={(e) => e.preventDefault()}
    >
      <Stage
        width={dimensions.width}
        height={dimensions.height}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <Layer x={panOffset.x} y={panOffset.y} scaleX={scale} scaleY={scale}>
          {elements.map((el) => {
            if (!el.visible) return null;
            return (
              <React.Fragment key={el.id}>
                {/* Invisible larger hit area for easier selection (todo) */}
                {renderElement(el)}
              </React.Fragment>
            );
          })}
          {currentLine && renderElement(currentLine)}
        </Layer>
      </Stage>
    </div>
  );
}
