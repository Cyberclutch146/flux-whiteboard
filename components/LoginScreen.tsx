"use client";

import { motion } from "framer-motion";
import { LogIn } from "lucide-react";
import VariableProximity from "./VariableProximity";
import { useRef } from "react";

export default function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-[100] bg-[#FCFCFA] flex flex-col items-center justify-center overflow-hidden"
    >
      <div 
        ref={containerRef} 
        className="relative z-10 flex flex-col items-center pointer-events-auto gap-8"
      >
        <div className="text-[#333] text-5xl font-extrabold tracking-widest cursor-default">
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
        
        <button
          onClick={onLogin}
          className="flex items-center gap-3 px-6 py-3 bg-white border border-[#e5e0d8] shadow-sm rounded-lg hover:bg-[#f9f8f6] hover:shadow transition-all text-[#333] font-medium"
        >
          <LogIn size={20} className="text-[#888]" />
          Continue with Google
        </button>
      </div>
    </motion.div>
  );
}
