"use client";

import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import ShapeGrid from "./ShapeGrid";
import Orb from "./Orb";
import TextPressure from "./TextPressure";
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
      exit={{ opacity: 0, scale: 1.05, filter: "blur(20px)" }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="absolute inset-0 z-[100] bg-[var(--bg-primary)] flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Dynamic Grid Background - Changes based on light/dark mode css vars automatically if we use currentcolor or distinct stroke */}
      <div className="absolute inset-0 opacity-20 dark:opacity-[0.03]">
        <ShapeGrid 
          speed={0.4}
          squareSize={50}
          direction='diagonal'
          borderColor='var(--text-muted)'
          hoverFillColor='var(--border-primary)'
          shape='square'
          hoverTrailAmount={0}
        />
      </div>

      <div className="absolute inset-0 z-[1] pointer-events-none mix-blend-overlay opacity-20 dark:opacity-40" style={{ backgroundImage: "url('https://grainy-gradients.vercel.app/noise.svg')", backgroundRepeat: 'repeat' }} />
      
      {/* Orb Background - Hidden on small screens (mobile) */}
      <div className="absolute top-0 left-0 w-full h-full z-[2] hidden md:block opacity-70 pointer-events-none">
        <Orb 
          hoverIntensity={2}
          rotateOnHover
          hue={180} // Cool futuristic hue
          forceHoverState={false}
          backgroundColor="transparent"
        />
      </div>

      {/* Background Animated Orbs (Fallback) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[120px] mix-blend-screen animate-pulse-slow" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-orange-600/10 rounded-full blur-[100px] mix-blend-screen animate-pulse-slow delayed-1" />

      <div 
        ref={containerRef} 
        className="relative z-10 flex flex-col items-center pointer-events-none gap-4"
      >
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-[var(--text-primary)] text-6xl font-black mb-8 tracking-[0.1em] cursor-default flex flex-col items-center gap-6 drop-shadow-[0_0_30px_rgba(255,255,255,0.05)]"
        >
          <div style={{ position: 'relative', width: '300px', height: '120px', pointerEvents: 'auto' }}>
            {/* @ts-ignore */}
            <TextPressure
              text="SYNQ"
              flex
              alpha={false}
              stroke={false}
              width
              weight
              italic
              textColor="var(--text-primary)"
              strokeColor="#5227FF"
              minFontSize={80}
            />
          </div>
          {/* @ts-ignore */}
          <RotatingText
            texts={['SPATIAL BOARD', 'COLLECTIVE MIND', 'RICH NOTEBOOK', 'SYSTEM ARCHITECTURE']}
            mainClassName="px-6 bg-[var(--text-primary)] text-[var(--bg-primary)] overflow-hidden py-2 justify-center rounded-sm text-xl font-black uppercase tracking-[0.3em] shadow-[0_20px_40px_rgba(0,0,0,0.4)]"
            staggerFrom={"last"}
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "-120%", opacity: 0 }}
            staggerDuration={0.02}
            splitLevelClassName="overflow-hidden pb-1"
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            rotationInterval={2500}
          />
        </motion.div>

        {/* Cinematic Loading Bar */}
        <div className="w-80 h-[2px] bg-white/5 rounded-full overflow-hidden mt-6 relative shadow-[0_0_15px_rgba(255,255,255,0.1)]">
          <motion.div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 via-white to-orange-500"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 2.8, ease: [0.65, 0, 0.35, 1] }}
          />
        </div>
      </div>
    </motion.div>
  );
}
