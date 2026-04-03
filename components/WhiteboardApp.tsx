"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import TopBar        from "./TopBar";
import Canvas        from "./Canvas";
import StatusBar     from "./StatusBar";
import LoadingScreen from "./LoadingScreen";

export default function WhiteboardApp() {
  useKeyboardShortcuts();
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#1A1A1A] select-none flex flex-col">
      <AnimatePresence>
        {!loaded && <LoadingScreen onDone={() => setLoaded(true)} />}
      </AnimatePresence>
      
      {/* Dense native-like top bar */}
      <TopBar />

      {/* Main Canvas Area */}
      <div className="relative flex-1 overflow-hidden">
        <Canvas />
      </div>

      {/* Minimal status bar */}
      <StatusBar />
    </div>
  );
}
