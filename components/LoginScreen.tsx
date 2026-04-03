"use client";

import { motion } from "framer-motion";
import { LogIn } from "lucide-react";
import TextPressure from "./TextPressure";
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
        <div className="relative w-[300px] h-[100px] pointer-events-auto">
          {/* @ts-ignore */}
          <TextPressure
            text="SYNQ"
            flex
            alpha={false}
            stroke={false}
            width
            weight
            italic
            textColor="#333333"
            strokeColor="#5227FF"
            minFontSize={80}
          />
        </div>
        
        <motion.button
          onClick={onLogin}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-3 px-8 py-4 bg-[#1A1A1A] text-white shadow-lg rounded-full hover:shadow-xl transition-shadow font-medium tracking-wide"
        >
          <LogIn size={20} className="text-[#CCC]" />
          Sign in with Google
        </motion.button>
      </div>
    </motion.div>
  );
}
