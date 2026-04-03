"use client";

import { motion, AnimatePresence } from "framer-motion";
import { User, Users, FilePlus, LogOut, ArrowRight, X, Sun, Moon, Menu, Github, Linkedin, Instagram, Globe } from "lucide-react";
import { useState, useRef } from "react";
import Noise from "./Noise";
import TextPressure from "./TextPressure";
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
  const [localMode, setLocalMode] = useState<'notebook' | 'board'>('notebook');
  const [showConnectPanel, setShowConnectPanel] = useState(false);
  
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
    <div ref={containerRef} className="absolute inset-0 flex flex-col bg-[var(--bg-primary)] z-40 transition-colors overflow-hidden">
      <Noise 
        patternSize={250}
        patternScaleX={2}
        patternScaleY={2}
        patternRefreshInterval={2}
        patternAlpha={15}
      />
      {/* Noise Overlay for Human-Crafted Texture */}
      <div 
        className="absolute inset-0 z-[1] pointer-events-none mix-blend-overlay opacity-30 dark:opacity-[0.05]" 
        style={{ backgroundImage: "url('https://grainy-gradients.vercel.app/noise.svg')", backgroundRepeat: 'repeat' }}
      />

      {/* Cinematic Animated Orbs */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-[120px] pointer-events-none animate-pulse-slow" />
      <div className="absolute top-[40%] right-[-10%] w-[600px] h-[600px] bg-orange-500/10 dark:bg-orange-500/5 rounded-full blur-[150px] pointer-events-none mix-blend-lighten" />

      {/* Background ShapeGrid (Faint) */}
      <div className="absolute inset-0 z-0 overflow-hidden opacity-10 pointer-events-none">
        <ShapeGrid 
          speed={0.3}
          squareSize={60}
          direction='diagonal'
          borderColor='var(--border-secondary)'
          hoverFillColor='var(--bg-tertiary)'
          shape='square'
          hoverTrailAmount={1}
        />
      </div>

      {/* Top Header - Micro-Interaction Profile */}
      <header className="absolute top-0 right-0 z-50 p-6 lg:p-10 pointer-events-none flex items-center justify-end gap-3">
        
        {/* Theme Toggle Button (Standalone, No Circle) */}
        <button 
          onClick={toggleTheme}
          className="text-[var(--text-primary)] hover:scale-110 pointer-events-auto transition-all p-2 drop-shadow-lg"
        >
          {theme === 'light' ? <Moon size={32} /> : <Sun size={32} />}
        </button>

        <div className="relative group pointer-events-auto">
          <button 
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-3 pl-4 pr-5 py-2.5 bg-[var(--bg-primary)]/80 backdrop-blur-md border border-[var(--border-secondary)] hover:bg-[var(--bg-secondary)] rounded-full transition-all duration-300 text-[var(--text-secondary)] hover:text-[var(--text-primary)] shadow-xl hover:shadow-2xl"
          >
            <span className="font-semibold tracking-wide text-xs uppercase">
              {user?.displayName || "Guest"}
            </span>
            <ArrowRight size={14} className={`transition-transform duration-300 ${menuOpen ? 'rotate-90' : 'rotate-0'}`} />
          </button>

          <AnimatePresence>
            {menuOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute top-14 right-0 w-48 bg-[var(--bg-primary)]/90 backdrop-blur-xl border border-[var(--border-secondary)] shadow-2xl rounded-2xl p-2 flex flex-col gap-1 overflow-hidden"
              >
                <button 
                  onClick={onSignOut}
                  className="w-full flex items-center justify-start gap-3 px-3 py-3 rounded-xl hover:bg-[#e74c3c]/10 text-sm font-bold text-[#e74c3c] transition-colors"
                >
                  <LogOut size={16} />
                  Sign Out
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* Asymmetrical Main Layout */}
      <main className="relative z-10 flex-1 flex flex-col lg:flex-row items-center justify-center gap-16 lg:gap-32 w-full max-w-[1400px] mx-auto px-8 lg:px-16 overflow-y-auto no-scrollbar pb-24">
        
        {/* Left Col: Expressive Typography Hero */}
        <div className="flex-1 flex flex-col items-start justify-center min-w-[300px] pt-12 lg:pt-0">
          <div className="relative w-full overflow-visible h-[280px] pointer-events-auto mb-10">
            {/* The dramatic background glow for the title */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[150%] bg-white/5 dark:bg-white/10 blur-[80px] rounded-[100%] pointer-events-none" />
            
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
              minFontSize={120}
            />
          </div>
          
          <div className="mt-8 ml-2 border-l-2 border-[var(--border-secondary)] pl-6 py-2">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-[var(--text-primary)]">
              Thoughts, uncontained.
            </h2>
            <p className="mt-4 text-[15px] md:text-[17px] text-[var(--text-muted)] max-w-sm font-medium leading-[1.8]">
              A fluid dual-reality engine. Structured notes meet infinite spatial canvases. Designed for humans, built for speed.
            </p>
          </div>
        </div>

        {/* Right Col: Offset Interactive Cards */}
        <div className="flex-1 w-full max-w-md lg:max-w-lg lg:pt-20">
          <AnimatePresence mode="wait">
            {step === 'mode' ? (
              <motion.div
                key="mode-selection"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
                transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                className="flex flex-col items-center gap-10 w-full"
              >
                {/* Premium Restyled Distinct Buttons */}
                <div className="w-full flex items-center justify-center gap-4 max-w-md mx-auto">
                  <button
                    onClick={() => setLocalMode('notebook')}
                    className={`flex-1 relative overflow-hidden flex flex-col items-center justify-center gap-2 p-6 rounded-[2rem] transition-all duration-300 border-2 ${
                      localMode === 'notebook' 
                        ? 'bg-orange-500/10 border-orange-500/50 shadow-inner' 
                        : 'bg-black/5 dark:bg-white/5 border-transparent hover:border-black/10 dark:hover:border-white/10'
                    }`}
                  >
                    <svg className={localMode === 'notebook' ? 'text-orange-500' : 'text-gray-400'} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/><path d="M8 7h6"/><path d="M8 11h8"/></svg>
                    <span className={`text-sm font-bold tracking-wide ${localMode === 'notebook' ? 'text-orange-600 dark:text-orange-400 drop-shadow-sm' : 'text-gray-500 dark:text-gray-400'}`}>Notebook</span>
                  </button>

                  <button
                    onClick={() => setLocalMode('board')}
                    className={`flex-1 relative overflow-hidden flex flex-col items-center justify-center gap-2 p-6 rounded-[2rem] transition-all duration-300 border-2 ${
                      localMode === 'board' 
                        ? 'bg-teal-500/10 border-teal-500/50 shadow-inner' 
                        : 'bg-black/5 dark:bg-white/5 border-transparent hover:border-black/10 dark:hover:border-white/10'
                    }`}
                  >
                    <svg className={localMode === 'board' ? 'text-teal-500' : 'text-gray-400'} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72Z"/><path d="m14 7 3 3"/><path d="M5 6v4"/><path d="M19 14v4"/><path d="M10 2v2"/><path d="M7 8H3"/><path d="M21 16h-4"/><path d="M11 3H9"/></svg>
                    <span className={`text-sm font-bold tracking-wide ${localMode === 'board' ? 'text-teal-600 dark:text-teal-400 drop-shadow-sm' : 'text-gray-500 dark:text-gray-400'}`}>Whiteboard</span>
                  </button>
                </div>

                {/* Mode Description */}
                <div className="text-center max-w-md mx-auto h-20">
                  <motion.p
                    key={localMode}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-gray-500 dark:text-[#A1A1AA] text-[15px] font-medium leading-relaxed"
                  >
                    {localMode === 'notebook' 
                      ? "A distraction-free, rich-text environment. Built for deep coordination and editorial alignment."
                      : "An uncontained visual workspace. Map complex architectures, draw freehand, and plan the infinite."}
                  </motion.p>
                </div>

                {/* Launch Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSelectMode(localMode)}
                  className={`mt-4 px-12 py-5 rounded-full font-black text-lg tracking-wide uppercase transition-all duration-500 shadow-xl border ${
                    localMode === 'notebook' 
                    ? 'bg-orange-600 hover:bg-orange-500 text-white shadow-orange-500/30 border-orange-500' 
                    : 'bg-teal-600 hover:bg-teal-500 text-white shadow-teal-500/30 border-teal-500'
                  }`}
                >
                  Enter Workspace
                </motion.button>
              </motion.div>
            ) : !showJoin ? (
              <motion.div
                key="list"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30, filter: "blur(10px)" }}
                transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                className="flex flex-col gap-4"
              >
                <div className="flex items-center gap-3 mb-4 pl-2 text-[var(--text-primary)]">
                  <button onClick={() => setStep('mode')} className="p-2 -ml-2 rounded-full hover:bg-[var(--bg-secondary)] transition-colors group">
                    <ArrowRight className="rotate-180 text-[var(--text-muted)] group-hover:text-[var(--text-primary)]" size={20} />
                  </button>
                  <span className="font-semibold tracking-wide">Select Gateway</span>
                </div>

                <button
                  onClick={onSolo}
                  className="group flex items-center justify-between w-full py-4 px-5 rounded-2xl border border-[var(--border-secondary)] bg-[var(--bg-primary)] hover:bg-[var(--bg-secondary)] hover:border-[var(--text-primary)] transition-all shadow-sm"
                >
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 shrink-0 rounded-xl bg-[var(--bg-tertiary)] flex items-center justify-center text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">
                      <User size={20} className="group-hover:scale-110 transition-transform"/>
                    </div>
                    <div className="flex flex-col items-start justify-center text-left">
                      <h3 className="text-[17px] font-bold text-[var(--text-primary)] leading-none mb-1.5 tracking-tight">Solo Local</h3>
                      <p className="text-[10px] text-[var(--text-muted)] font-mono uppercase tracking-[0.2em] leading-none">Private Env</p>
                    </div>
                  </div>
                  <ArrowRight size={20} className="text-[var(--text-muted)] group-hover:text-[var(--text-primary)] transition-colors opacity-0 group-hover:opacity-100 group-hover:translate-x-1" />
                </button>

                <button
                  onClick={onCreateRoom}
                  className="group flex items-center justify-between w-full py-4 px-5 rounded-2xl border border-[var(--border-primary)] bg-orange-600 hover:bg-orange-500 text-white transition-all shadow-xl shadow-orange-500/20"
                >
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 shrink-0 rounded-xl bg-orange-700/50 flex items-center justify-center text-white">
                      <FilePlus size={20} className="group-hover:scale-110 transition-transform"/>
                    </div>
                    <div className="flex flex-col items-start justify-center text-left">
                      <h3 className="text-[17px] font-bold text-white leading-none mb-1.5 tracking-tight">Create Room</h3>
                      <p className="text-[10px] text-orange-200 font-mono uppercase tracking-[0.2em] leading-none">Multiplayer Node</p>
                    </div>
                  </div>
                  <ArrowRight size={20} className="text-orange-200 group-hover:text-white transition-colors opacity-0 group-hover:opacity-100 group-hover:translate-x-1" />
                </button>

                <button
                  onClick={() => setShowJoin(true)}
                  className="group flex items-center justify-between w-full py-4 px-5 rounded-2xl border border-[var(--border-secondary)] bg-[var(--bg-primary)] hover:bg-[var(--bg-secondary)] hover:border-[var(--text-primary)] transition-all shadow-sm"
                >
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 shrink-0 rounded-xl bg-[var(--bg-tertiary)] flex items-center justify-center text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">
                      <Users size={20} className="group-hover:scale-110 transition-transform"/>
                    </div>
                    <div className="flex flex-col items-start justify-center text-left">
                      <h3 className="text-[17px] font-bold text-[var(--text-primary)] leading-none mb-1.5 tracking-tight">Join Session</h3>
                      <p className="text-[10px] text-[var(--text-muted)] font-mono uppercase tracking-[0.2em] leading-none">Via Code</p>
                    </div>
                  </div>
                  <ArrowRight size={20} className="text-[var(--text-muted)] group-hover:text-[var(--text-primary)] transition-colors opacity-0 group-hover:opacity-100 group-hover:translate-x-1" />
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="join-form"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                className="w-full flex justify-center mt-12"
              >
                <div className="w-full relative shadow-2xl rounded-[2rem] overflow-hidden">
                  <div className="absolute inset-0 bg-blue-500/10 backdrop-blur-md" />
                  <div className="relative border border-blue-500/30 p-8 rounded-[2rem] bg-[var(--bg-secondary)]/80 backdrop-blur-2xl">
                    <div className="flex items-center justify-between mb-8">
                      <button 
                        onClick={() => setShowJoin(false)}
                        className="text-[var(--text-muted)] hover:text-white transition-colors p-2 -ml-2 rounded-full hover:bg-white/10"
                      >
                        <X size={20} />
                      </button>
                      <h3 className="text-xs tracking-widest uppercase font-mono text-[var(--text-muted)]">
                        Terminal Access
                      </h3>
                    </div>

                    <form onSubmit={handleJoinSubmit} className="flex flex-col gap-6">
                      <input
                        type="text"
                        maxLength={7}
                        value={joinCode}
                        onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                        placeholder="7-DIGIT CODE"
                        className="w-full px-4 py-6 text-center text-4xl font-mono font-bold tracking-[0.3em] bg-[#000] border border-[#222] rounded-2xl focus:border-blue-500 focus:shadow-[0_0_30px_rgba(59,130,246,0.3)] focus:outline-none text-white placeholder-gray-800 uppercase transition-all"
                        autoFocus
                      />
                      <motion.button
                        whileHover={{ scale: joinCode.trim().length === 7 ? 1.02 : 1 }}
                        whileTap={{ scale: joinCode.trim().length === 7 ? 0.98 : 1 }}
                        type="submit"
                        disabled={joinCode.trim().length !== 7}
                        className="w-full py-5 bg-white text-black font-extrabold tracking-widest text-sm rounded-xl disabled:opacity-20 disabled:cursor-not-allowed flex justify-center items-center gap-3 hover:shadow-2xl hover:shadow-white/20 transition-all font-mono"
                      >
                        CONNECT <ArrowRight size={18} />
                      </motion.button>
                    </form>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Minimalistic Connect With Me Modal */}
      <AnimatePresence>
        {showConnectPanel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] select-none"
          >
            {/* Dark crisp backdrop */}
            <div 
              className="absolute inset-0 bg-black/70 backdrop-blur-sm pointer-events-auto" 
              onClick={() => setShowConnectPanel(false)}
            />
            
            {/* Centered Modal Content precisely via absolute positioning instead of flex */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[360px] pointer-events-none px-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                transition={{ type: "spring", damping: 30, stiffness: 400 }}
                className="bg-[var(--bg-primary)] border border-[var(--border-secondary)] shadow-2xl rounded-3xl p-8 relative overflow-hidden pointer-events-auto"
              >
                <div className="flex flex-col items-center mb-8 relative z-10">
                  <div className="w-20 h-20 rounded-full overflow-hidden shadow-sm mb-4 border border-[var(--border-secondary)]">
                    <img 
                      src="/profile.png" 
                      alt="Swagata Ganguly" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=Swagata+Ganguly&background=111&color=fff&size=128`;
                      }}
                    />
                  </div>
                  <h2 className="text-xl font-bold text-[var(--text-primary)] tracking-tight">Swagata Ganguly</h2>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <p className="text-xs text-[var(--text-muted)] font-semibold uppercase tracking-widest">Available for hire</p>
                  </div>
                </div>

                <div className="flex flex-col gap-2 relative z-10">
                  <SocialLink href="https://github.com/Cyberclutch" icon={<Github size={16}/>} label="GitHub" />
                  <SocialLink href="https://www.linkedin.com/in/swagata-ganguly" icon={<Linkedin size={16}/>} label="LinkedIn" />
                  <SocialLink href="https://instagram.com/blazing_stxrx" icon={<Instagram size={16}/>} label="Instagram" />
                  <SocialLink href="https://swagata-ganguly.vercel.app/" icon={<Globe size={16}/>} label="Portfolio" />
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Elegant Footer glass panel */}
      <footer className="absolute bottom-6 left-0 right-0 z-50 px-8 lg:px-16 pointer-events-none">
        <div className="flex flex-col sm:flex-row justify-between items-center w-full max-w-[1400px] mx-auto gap-4 relative">
          <div 
            onClick={() => setShowConnectPanel(true)}
            className="text-[11px] font-bold tracking-[0.2em] uppercase text-[var(--text-muted)] pointer-events-auto hover:text-[var(--text-primary)] transition-colors cursor-pointer relative group flex items-center gap-2 bg-[var(--bg-primary)]/50 backdrop-blur-md px-4 py-2 rounded-full border border-[var(--border-primary)] shadow-sm hover:-translate-y-1"
          >
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            Designed by Swagata Ganguly
          </div>
          
          <div className="flex items-center gap-2 pointer-events-auto bg-[var(--bg-primary)]/50 backdrop-blur-md px-4 py-2 rounded-full border border-[var(--border-primary)] shadow-sm">
            <motion.a whileHover={{ scale: 1.15, y: -2 }} href="https://github.com/Cyberclutch" target="_blank" rel="noreferrer" className="text-[var(--text-muted)] hover:text-white transition-all p-2 mx-1"><Github size={18} strokeWidth={2.5}/></motion.a>
            <motion.a whileHover={{ scale: 1.15, y: -2 }} href="https://www.linkedin.com/in/swagata-ganguly" target="_blank" rel="noreferrer" className="text-[var(--text-muted)] hover:text-[#0a66c2] transition-all p-2 mx-1"><Linkedin size={18} strokeWidth={2.5}/></motion.a>
            <motion.a whileHover={{ scale: 1.15, y: -2 }} href="https://instagram.com/blazing_stxrx" target="_blank" rel="noreferrer" className="text-[var(--text-muted)] hover:text-[#e1306c] transition-all p-2 mx-1"><Instagram size={18} strokeWidth={2.5}/></motion.a>
            <motion.a whileHover={{ scale: 1.15, y: -2 }} href="https://swagata-ganguly.vercel.app/" target="_blank" rel="noreferrer" className="text-[var(--text-muted)] hover:text-[#2ecc71] transition-all p-2 mx-1"><Globe size={18} strokeWidth={2.5}/></motion.a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function SocialLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <a 
      href={href} 
      target="_blank" 
      rel="noreferrer" 
      className="flex items-center justify-between px-5 py-4 rounded-xl bg-[var(--bg-secondary)] hover:bg-[var(--border-secondary)] transition-colors group"
    >
      <span className="text-sm font-semibold text-[var(--text-primary)]">{label}</span>
      <div className="text-[var(--text-muted)] group-hover:text-[var(--text-primary)] transition-colors group-hover:scale-110 duration-300">
        {icon}
      </div>
    </a>
  );
}
