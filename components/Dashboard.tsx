"use client";

import { motion, AnimatePresence } from "framer-motion";
import { User, Users, FilePlus, LogOut, ArrowRight, X, Sun, Moon, Menu } from "lucide-react";
import { useState, useRef } from "react";
import VariableProximity from "./VariableProximity";
import ShapeGrid from "./ShapeGrid";
import { useBoardStore } from "@/store/board";

interface DashboardProps {
  user: any;
  onSignOut: () => void;
  onJoinRoom: (roomId: string) => void;
  onCreateRoom: () => void;
  onSolo: () => void;
}

export default function Dashboard({ user, onSignOut, onJoinRoom, onCreateRoom, onSolo }: DashboardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState<'mode' | 'lobby'>('mode');
  const [showJoin, setShowJoin] = useState(false);
  const [joinCode, setJoinCode] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  
  const { theme, toggleTheme, setMode } = useBoardStore();

  const handleSelectMode = (mode: 'board' | 'notebook') => {
    setMode(mode);
    setStep('lobby');
  };

  const handleJoinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (joinCode.trim().length === 7) {
      onJoinRoom(joinCode.trim().toUpperCase());
    }
  };

  return (
    <div ref={containerRef} className="absolute inset-0 flex flex-col bg-[var(--bg-primary)] p-6 z-40 transition-colors">
      
      {/* Background ShapeGrid */}
      <div className="absolute inset-0 z-0 overflow-hidden opacity-30 pointer-events-none">
        <ShapeGrid 
          speed={0.5}
          squareSize={40}
          direction='diagonal'
          borderColor='var(--border-secondary)'
          hoverFillColor='var(--bg-tertiary)'
          shape='square'
          hoverTrailAmount={2}
        />
      </div>

      {/* Top Header - Minimalist */}
      <header className="relative z-50 flex justify-between items-center w-full max-w-6xl mx-auto pt-4">
        {/* Empty left space to balance */}
        <div className="w-8" />
        
        {/* Right Menu */}
        <div className="relative">
          <button 
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-3 px-4 py-2 hover:bg-[var(--bg-tertiary)] rounded-full transition-colors text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          >
            <span className="font-medium tracking-wide text-sm hidden sm:block">
              {user?.displayName || "Guest"}
            </span>
            <Menu size={20} />
          </button>

          <AnimatePresence>
            {menuOpen && (
              <motion.div 
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                className="absolute top-12 right-0 w-48 bg-[var(--bg-secondary)] border border-[var(--border-primary)] shadow-2xl rounded-xl p-2 flex flex-col gap-1 overflow-hidden"
              >
                <button 
                  onClick={toggleTheme}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-[var(--bg-tertiary)] text-sm font-medium text-[var(--text-primary)] transition-colors"
                >
                  <span className="flex items-center gap-2">
                    {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
                    Theme
                  </span>
                  <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">{theme}</span>
                </button>
                <div className="w-full h-px bg-[var(--border-secondary)] my-1" />
                <button 
                  onClick={onSignOut}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-[#e74c3c]/10 text-sm font-medium text-[#e74c3c] transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <LogOut size={16} />
                    Sign Out
                  </span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center w-full max-w-xl mx-auto">
        {/* Main Logo */}
        <div className="mb-20 text-[var(--text-primary)] text-6xl md:text-8xl font-extrabold tracking-[0.2em] cursor-default text-center">
          {/* @ts-ignore */}
          <VariableProximity
            label="FLUX"
            fromFontVariationSettings="'wght' 400"
            toFontVariationSettings="'wght' 900"
            containerRef={containerRef}
            radius={180}
            falloff="linear"
          />
        </div>

        {/* Mode or Lobby Selection */}
        <div className="w-full px-4">
          <AnimatePresence mode="wait">
            {step === 'mode' ? (
              <motion.div
                key="mode-selection"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex flex-col sm:flex-row items-stretch justify-center gap-6 w-full max-w-3xl mx-auto"
              >
                <button
                  onClick={() => handleSelectMode('notebook')}
                  className="group relative flex-1 flex flex-col items-start justify-between p-8 rounded-3xl border border-[var(--border-primary)] bg-[var(--bg-primary)] hover:border-blue-500/50 hover:bg-blue-500/5 transition-all duration-500 shadow-sm hover:shadow-xl hover:shadow-blue-500/10 overflow-hidden text-left min-h-[220px]"
                >
                  <div className="absolute -right-8 -top-8 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-all duration-500" />
                  
                  <div className="w-14 h-14 rounded-2xl bg-[var(--bg-tertiary)] flex items-center justify-center text-[var(--text-secondary)] group-hover:text-blue-500 group-hover:scale-110 transition-all duration-500 shadow-sm relative z-10">
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/><path d="M8 7h6"/><path d="M8 11h8"/></svg>
                  </div>
                  
                  <div className="relative z-10 mt-8">
                    <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-2 tracking-tight">Collaborative Notebook</h3>
                    <p className="text-sm text-[var(--text-muted)] font-medium leading-relaxed">Structured dual-pane text editing for teams. Perfect for brainstorming and meeting notes.</p>
                  </div>
                </button>

                <button
                  onClick={() => handleSelectMode('board')}
                  className="group relative flex-1 flex flex-col items-start justify-between p-8 rounded-3xl border border-[var(--border-primary)] bg-[#0d0d0d] hover:border-orange-500/50 transition-all duration-500 shadow-md hover:shadow-2xl hover:shadow-orange-500/20 overflow-hidden text-left min-h-[220px]"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-[rgba(255,255,255,0.02)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute -right-8 -top-8 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl group-hover:bg-orange-500/20 transition-all duration-500" />
                  
                  <div className="relative z-10 w-14 h-14 rounded-2xl bg-[#1a1a1a] border border-[#333] flex items-center justify-center text-white group-hover:text-orange-400 group-hover:scale-110 transition-all duration-500 shadow-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72Z"/><path d="m14 7 3 3"/><path d="M5 6v4"/><path d="M19 14v4"/><path d="M10 2v2"/><path d="M7 8H3"/><path d="M21 16h-4"/><path d="M11 3H9"/></svg>
                  </div>
                  
                  <div className="relative z-10 mt-8">
                    <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">Spatial Whiteboard</h3>
                    <p className="text-sm text-gray-400 font-medium leading-relaxed">Infinite spatial canvas for freeform drawing, mind-mapping, and architectural planning.</p>
                  </div>
                </button>
              </motion.div>
            ) : !showJoin ? (
              <motion.div
                key="list"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex flex-col gap-3 w-full"
              >
                <button
                  onClick={onSolo}
                  className="group flex items-center justify-between w-full p-4 rounded-xl border border-[var(--border-primary)] bg-[var(--bg-primary)] hover:bg-[var(--bg-secondary)] hover:border-[var(--text-primary)] transition-all shadow-sm"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-[var(--bg-tertiary)] flex items-center justify-center text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] group-hover:scale-105 transition-all">
                      <User size={20} />
                    </div>
                    <div className="text-left">
                      <h3 className="text-lg font-semibold text-[var(--text-primary)]">Continue Solo</h3>
                      <p className="text-xs text-[var(--text-muted)] font-mono uppercase tracking-widest mt-0.5">Local Environment</p>
                    </div>
                  </div>
                  <ArrowRight size={20} className="text-[var(--text-muted)] group-hover:text-[var(--text-primary)] transition-colors group-hover:translate-x-1" />
                </button>

                <button
                  onClick={onCreateRoom}
                  className="group flex items-center justify-between w-full p-4 rounded-xl border border-[var(--border-primary)] bg-[#111] hover:bg-black transition-all shadow-md relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[rgba(255,255,255,0.05)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="flex items-center gap-4 relative z-10">
                    <div className="w-10 h-10 rounded-lg bg-[#222] flex items-center justify-center text-white group-hover:scale-105 transition-all">
                      <FilePlus size={20} />
                    </div>
                    <div className="text-left">
                      <h3 className="text-lg font-semibold text-white">Create Room</h3>
                      <p className="text-xs text-gray-400 font-mono uppercase tracking-widest mt-0.5">Multiplayer Cloud</p>
                    </div>
                  </div>
                  <ArrowRight size={20} className="text-gray-400 group-hover:text-white transition-colors group-hover:translate-x-1 relative z-10" />
                </button>

                <button
                  onClick={() => setShowJoin(true)}
                  className="group flex items-center justify-between w-full p-4 rounded-xl border border-[var(--border-primary)] bg-[var(--bg-primary)] hover:bg-[var(--bg-secondary)] hover:border-[var(--text-primary)] transition-all shadow-sm"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-[var(--bg-tertiary)] flex items-center justify-center text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] group-hover:scale-105 transition-all">
                      <Users size={20} />
                    </div>
                    <div className="text-left">
                      <h3 className="text-lg font-semibold text-[var(--text-primary)]">Join Room</h3>
                      <p className="text-xs text-[var(--text-muted)] font-mono uppercase tracking-widest mt-0.5">By Invite Code</p>
                    </div>
                  </div>
                  <ArrowRight size={20} className="text-[var(--text-muted)] group-hover:text-[var(--text-primary)] transition-colors group-hover:translate-x-1" />
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="join-form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full flex justify-center"
              >
                <div className="w-full p-6 bg-[var(--bg-primary)] border border-[var(--border-primary)] shadow-2xl rounded-2xl">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-[var(--text-primary)] flex items-center gap-2">
                      <Users size={20} /> Join Session
                    </h3>
                    <button 
                      onClick={() => setShowJoin(false)}
                      className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors hover:rotate-90"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  <form onSubmit={handleJoinSubmit} className="flex flex-col gap-4">
                    <input
                      type="text"
                      maxLength={7}
                      value={joinCode}
                      onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                      placeholder="ENTER CODE"
                      className="w-full px-4 py-4 text-center text-3xl font-mono font-bold tracking-[0.2em] bg-[var(--bg-secondary)] border border-[var(--border-secondary)] rounded-xl focus:border-[var(--text-primary)] focus:bg-[var(--bg-primary)] focus:outline-none text-[var(--text-primary)] placeholder-[var(--text-muted)] uppercase transition-all"
                      autoFocus
                    />
                    <motion.button
                      whileHover={{ scale: joinCode.trim().length === 7 ? 1.02 : 1 }}
                      whileTap={{ scale: joinCode.trim().length === 7 ? 0.98 : 1 }}
                      type="submit"
                      disabled={joinCode.trim().length !== 7}
                      className="w-full py-4 bg-[#111] text-white font-bold tracking-widest text-sm rounded-xl disabled:opacity-30 disabled:cursor-not-allowed flex justify-center items-center gap-3 hover:shadow-lg transition-all"
                    >
                      CONNECT <ArrowRight size={18} />
                    </motion.button>
                  </form>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          {step === 'lobby' && (
            <div className="mt-6 flex justify-center">
              <button onClick={() => setStep('mode')} className="text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
                ← Back to Mode Selection
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
