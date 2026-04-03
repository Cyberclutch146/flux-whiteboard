"use client";

import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import ShapeGrid from "./ShapeGrid";
import VariableProximity from "./VariableProximity";
// @ts-ignore
import RotatingText from "./RotatingText";

export default function LoadingScreen({ onDone }: { onDone: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(onDone, 3000);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <motion.div
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="absolute inset-0 z-[100] bg-[#FCFCFA] flex flex-col items-center justify-center overflow-hidden"
    >
      <div className="absolute inset-0 opacity-40">
        <ShapeGrid 
          speed={0.5}
          squareSize={40}
          direction='diagonal'
          borderColor='#e5e0d8'
          hoverFillColor='#f0ebe1'
          shape='square'
          hoverTrailAmount={0}
        />
      </div>

      <div 
        ref={containerRef} 
        className="relative z-10 flex flex-col items-center pointer-events-auto gap-4"
      >
        <div className="text-[#333] text-5xl font-extrabold mb-4 tracking-widest cursor-default flex flex-col items-center gap-4">
          {/* @ts-ignore */}
          <VariableProximity
            label="FLUX"
            fromFontVariationSettings="'wght' 400"
            toFontVariationSettings="'wght' 900"
            containerRef={containerRef}
            radius={120}
            falloff="linear"
          />
          <RotatingText
            texts={['IDEAS', 'SYSTEMS', 'CANVAS', 'DESIGNS']}
            mainClassName="px-3 bg-[#e5e0d8] text-[#333] overflow-hidden py-1 justify-center rounded-lg text-2xl font-mono tracking-tight shadow-sm"
            staggerFrom={"last"}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-120%" }}
            staggerDuration={0.025}
            splitLevelClassName="overflow-hidden pb-1"
            transition={{ type: "spring", damping: 30, stiffness: 400 }}
            rotationInterval={2000}
          />
        </div>
        <div className="w-64 h-1 bg-[#e5e0d8] rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-[#f44336]"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 2.7, ease: "easeInOut" }}
          />
        </div>
        <p className="text-[#888] font-mono text-[10px] mt-2 uppercase tracking-[0.2em]">
          Booting environment...
        </p>
      </div>
    </motion.div>
  );
}
