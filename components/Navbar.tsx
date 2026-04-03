"use client";

import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Share2, Bell, User, ChevronDown } from "lucide-react";
import { useBoardStore } from "@/store/board";
import type { ConnectionStatus } from "@/types";
import clsx from "clsx";

// ─── Status badge ─────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<ConnectionStatus, { label: string; dot: string }> = {
  connected: { label: "Connected",  dot: "bg-accent-green animate-pulse-dot" },
  saving:    { label: "Saving…",    dot: "bg-yellow-400 animate-pulse" },
  saved:     { label: "Saved",      dot: "bg-accent-green" },
  offline:   { label: "Offline",    dot: "bg-red-400" },
};

function StatusBadge({ status }: { status: ConnectionStatus }) {
  const { label, dot } = STATUS_CONFIG[status];
  return (
    <motion.div
      layout
      className="flex items-center gap-1.5 px-3 py-1 rounded-full
        bg-white/[0.04] border border-border-subtle text-text-secondary text-[11px] font-medium"
    >
      <span className={clsx("w-1.5 h-1.5 rounded-full flex-shrink-0", dot)} />
      <AnimatePresence mode="wait">
        <motion.span
          key={label}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.15 }}
        >
          {label}
        </motion.span>
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Avatar stack ─────────────────────────────────────────────────────────────

function AvatarStack() {
  const collaborators = useBoardStore((s) => s.collaborators);

  return (
    <div className="flex items-center">
      {collaborators.map((c, i) => (
        <motion.div
          key={c.id}
          title={c.name}
          whileHover={{ y: -2, zIndex: 10 }}
          className="relative w-7 h-7 rounded-full border-2 border-canvas-bg
            flex items-center justify-center text-[10px] font-semibold text-white cursor-pointer"
          style={{
            background: c.color,
            marginLeft: i === 0 ? 0 : -6,
            zIndex: collaborators.length - i,
          }}
        >
          {c.initials}
          {c.active && (
            <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full
              bg-accent-green border border-canvas-bg" />
          )}
        </motion.div>
      ))}
      <div
        className="w-6 h-6 rounded-full border-2 border-canvas-bg -ml-1.5
          bg-canvas-overlay flex items-center justify-center text-[9px]
          font-semibold text-text-secondary cursor-pointer hover:bg-white/10 transition-colors"
        style={{ zIndex: 0 }}
      >
        +2
      </div>
    </div>
  );
}

// ─── Main Navbar ──────────────────────────────────────────────────────────────

export default function Navbar() {
  const { name, connectionStatus, setBoardName, setConnectionStatus } = useBoardStore();
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBoardName(e.target.value);
    setConnectionStatus("saving");
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      setConnectionStatus("saved");
      setTimeout(() => setConnectionStatus("connected"), 1200);
    }, 800);
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2000);
  };

  return (
    <nav
      className="relative z-50 flex items-center h-[52px] px-4 gap-4
        bg-canvas-bg/90 border-b border-border-subtle backdrop-blur-xl"
    >
      {/* Logo */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-accent-purple to-accent-blue
          flex items-center justify-center shadow-lg shadow-accent-purple/20">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M2 8L8 2L14 8L8 14Z" fill="white" fillOpacity="0.9" />
            <circle cx="8" cy="8" r="2.5" fill="white" />
          </svg>
        </div>
        <span className="font-bold text-[15px] tracking-tight text-text-primary">Flux</span>
      </div>

      {/* Divider */}
      <div className="w-px h-5 bg-border-subtle flex-shrink-0" />

      {/* Board name */}
      <input
        value={name}
        onChange={handleNameChange}
        maxLength={40}
        spellCheck={false}
        className="bg-transparent border border-transparent text-text-primary
          font-semibold text-[13px] px-2 py-1 rounded-md outline-none
          hover:bg-white/[0.04] focus:bg-white/[0.04] focus:border-border-default
          transition-all duration-150 min-w-[80px] max-w-[200px]"
      />

      {/* Center status */}
      <div className="flex-1 flex justify-center">
        <StatusBadge status={connectionStatus} />
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2">
        <AvatarStack />

        <div className="w-px h-5 bg-border-subtle mx-1" />

        <motion.button
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => showToast("Share link copied!")}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold
            bg-gradient-to-r from-accent-purple/15 to-accent-blue/15
            border border-accent-purple/30 text-purple-300
            hover:from-accent-purple/25 hover:to-accent-blue/25 hover:border-accent-purple/50
            transition-all duration-150"
        >
          <Share2 size={12} />
          Share
        </motion.button>

        <NavIconBtn title="Notifications">
          <Bell size={14} strokeWidth={1.5} />
        </NavIconBtn>

        <NavIconBtn title="Profile">
          <User size={14} strokeWidth={1.5} />
        </NavIconBtn>
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 8, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 4, x: "-50%" }}
            className="absolute bottom-[-44px] left-1/2 z-50
              bg-canvas-overlay border border-border-default text-text-primary
              text-[12px] font-medium px-4 py-2 rounded-xl shadow-xl pointer-events-none"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

function NavIconBtn({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  return (
    <motion.button
      title={title}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.94 }}
      className="w-8 h-8 rounded-lg border border-border-subtle bg-white/[0.03]
        flex items-center justify-center text-text-secondary
        hover:bg-white/[0.07] hover:border-border-default hover:text-text-primary
        transition-all duration-150"
    >
      {children}
    </motion.button>
  );
}
