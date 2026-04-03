"use client";

import { motion } from "framer-motion";
import { LogIn } from "lucide-react";
import TextPressure from "./TextPressure";
import Orb from "./Orb";
import { useRef } from "react";

export default function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-[#0A0A0A]"
    >
      <div className="absolute inset-0 z-0 opacity-60">
        <Orb hoverIntensity={0.5} rotateOnHover={true} hue={0} forceHoverState={false} backgroundColor="#0A0A0A" />
      </div>
      
      <div 
        ref={containerRef} 
        className="relative z-10 flex flex-col items-center justify-center pointer-events-auto gap-8"
      >
        <div className="relative w-[300px] h-[80px] flex items-center justify-center pointer-events-none">
          {/* @ts-ignore */}
          <TextPressure
            text="SYNQ"
            flex
            alpha={false}
            stroke={false}
            width
            weight
            italic
            textColor="#FFFFFF"
            strokeColor="#5227FF"
            minFontSize={70}
          />
        </div>
        
        <motion.button
          onClick={onLogin}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-3 px-8 py-4 bg-[#1A1A1A] text-white shadow-lg rounded-full hover:shadow-xl transition-shadow font-medium tracking-wide mt-4 border border-white/10"
        >
          <LogIn size={20} className="text-[#CCC]" />
          Sign in with Google
        </motion.button>
      </div>
    </motion.div>
  );
}
