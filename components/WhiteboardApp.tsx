"use client";

import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import Navbar     from "./Navbar";
import Toolbar    from "./Toolbar";
import Canvas     from "./Canvas";
import RightPanel from "./RightPanel";
import BottomBar  from "./BottomBar";

export default function WhiteboardApp() {
  useKeyboardShortcuts();

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-canvas-bg select-none">
      {/* Top */}
      <Navbar />

      {/* Middle row */}
      <div className="flex flex-1 overflow-hidden">
        <Toolbar />
        <Canvas />
        <RightPanel />
      </div>

      {/* Bottom */}
      <BottomBar />
    </div>
  );
}
