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
    <div className="relative w-full h-screen overflow-hidden bg-canvas-bg select-none">
      {/* Canvas layer */}
      <Canvas />

      {/* Floating UI layer */}
      <div className="pointer-events-none absolute inset-0 z-40 overflow-hidden">
        <Navbar />
        <Toolbar />
        <RightPanel />
        <BottomBar />
      </div>
    </div>
  );
}
