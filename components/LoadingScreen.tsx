"use client";

import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import ShapeGrid from "./ShapeGrid";
import VariableProximity from "./VariableProximity";

export default function LoadingScreen({ onDone }: { onDone: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(onDone, 2800);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <motion.div
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="absolute inset-0 z-[100] bg-[#121212] flex flex-col items-center justify-center overflow-hidden"
    >
      <div className="absolute inset-0 opacity-40">
        <ShapeGrid 
          speed={0.5}
          squareSize={40}
          direction='diagonal'
          borderColor='#271E37'
          hoverFillColor='#222'
          shape='square'
          hoverTrailAmount={0}
        />
      </div>

      <div 
        ref={containerRef} 
        className="relative z-10 flex flex-col items-center pointer-events-auto"
      >
        <div className="text-white text-5xl font-extrabold mb-8 tracking-widest cursor-default">
          {/* @ts-ignore */}
          <VariableProximity
            label="FLUX"
            fromFontVariationSettings="'wght' 400"
            toFontVariationSettings="'wght' 900"
            containerRef={containerRef}
            radius={120}
            falloff="linear"
          />
        </div>
        <div className="w-64 h-1 bg-[#222] rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-[#f44336]"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 2.5, ease: "easeInOut" }}
          />
        </div>
        <p className="text-[#666] font-mono text-[10px] mt-4 uppercase tracking-[0.2em]">
          Initializing Canvas Engine
        </p>
      </div>
    </motion.div>
  );
}
