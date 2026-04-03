"use client";

import { motion, AnimatePresence } from "framer-motion";
import { User, Users, FilePlus, LogOut, ArrowRight, X } from "lucide-react";
import { useState } from "react";
import VariableProximity from "./VariableProximity";
import { useRef } from "react";

interface DashboardProps {
  user: any;
  onSignOut: () => void;
  onJoinRoom: (roomId: string) => void;
  onCreateRoom: () => void;
  onSolo: () => void;
}

export default function Dashboard({ user, onSignOut, onJoinRoom, onCreateRoom, onSolo }: DashboardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showJoin, setShowJoin] = useState(false);
  const [joinCode, setJoinCode] = useState("");

  const handleJoinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (joinCode.trim().length === 7) {
      onJoinRoom(joinCode.trim().toUpperCase());
    }
  };

  return (
    <div ref={containerRef} className="absolute inset-0 flex flex-col items-center justify-center bg-[var(--bg-primary)] p-6 z-40 transition-colors">
      
      {/* Top Right Profile Menu */}
      <div className="absolute top-6 right-6 flex items-center gap-4 bg-[var(--bg-secondary)] px-4 py-2 rounded-full shadow-sm border border-[var(--border-secondary)]">
        <div className="flex items-center gap-3">
          {user?.photoURL ? (
            <img src={user.photoURL} alt="Avatar" className="w-8 h-8 rounded-full border border-[var(--border-secondary)]" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-[var(--bg-tertiary)] flex items-center justify-center text-[var(--text-secondary)]">
              <User size={16} />
            </div>
          )}
          <span className="text-sm font-medium text-[var(--text-primary)] hidden sm:block">
            {user?.displayName || "Guest Writer"}
          </span>
        </div>
        <div className="w-px h-6 bg-[var(--border-secondary)]" />
        <button 
          onClick={onSignOut}
          className="text-[var(--text-secondary)] hover:text-[#e74c3c] transition-colors p-1"
          title="Sign Out"
        >
          <LogOut size={16} />
        </button>
      </div>

      {/* Main Logo */}
      <div className="mb-16 text-[var(--text-primary)] text-6xl font-extrabold tracking-widest cursor-default">
        {/* @ts-ignore */}
        <VariableProximity
          label="FLUX"
          fromFontVariationSettings="'wght' 400"
          toFontVariationSettings="'wght' 900"
          containerRef={containerRef}
          radius={150}
          falloff="linear"
        />
      </div>

      {/* Main Action Cards */}
      <div className="flex flex-col sm:flex-row gap-6 w-full max-w-3xl justify-center items-stretch relative">
        <AnimatePresence mode="wait">
          {!showJoin ? (
            <motion.div
              key="buttons"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col sm:flex-row gap-6 w-full justify-center"
            >
              {/* Solo Card */}
              <motion.button
                whileHover={{ scale: 1.02, y: -4 }}
                whileTap={{ scale: 0.98 }}
                onClick={onSolo}
                className="flex-1 flex flex-col items-center justify-center gap-4 p-8 bg-[var(--bg-secondary)] border border-[var(--border-secondary)] shadow-sm hover:shadow-md rounded-2xl transition-all group"
              >
                <div className="w-16 h-16 rounded-full bg-[var(--bg-tertiary)] flex items-center justify-center text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] group-hover:scale-110 transition-transform">
                  <User size={32} />
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-bold text-[var(--text-primary)]">Continue Solo</h3>
                  <p className="text-sm text-[var(--text-muted)] mt-1">Local only, no sharing</p>
                </div>
              </motion.button>

              {/* Create Room Card */}
              <motion.button
                whileHover={{ scale: 1.02, y: -4 }}
                whileTap={{ scale: 0.98 }}
                onClick={onCreateRoom}
                className="flex-1 flex flex-col items-center justify-center gap-4 p-8 bg-[#1A1A1A] border border-[#333] shadow-lg hover:shadow-xl rounded-2xl transition-all group text-white relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-[rgba(255,255,255,0.05)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="w-16 h-16 rounded-full bg-[#333] flex items-center justify-center text-[#CCC] group-hover:text-white group-hover:scale-110 transition-transform relative z-10">
                  <FilePlus size={32} />
                </div>
                <div className="text-center relative z-10">
                  <h3 className="text-lg font-bold text-white">Create Room</h3>
                  <p className="text-sm text-[#888] mt-1">Start a fresh multiplayer session</p>
                </div>
              </motion.button>

              {/* Join Room Card */}
              <motion.button
                whileHover={{ scale: 1.02, y: -4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowJoin(true)}
                className="flex-1 flex flex-col items-center justify-center gap-4 p-8 bg-[var(--bg-secondary)] border border-[var(--border-secondary)] shadow-sm hover:shadow-md rounded-2xl transition-all group"
              >
                <div className="w-16 h-16 rounded-full bg-[var(--bg-tertiary)] flex items-center justify-center text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] group-hover:scale-110 transition-transform">
                  <Users size={32} />
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-bold text-[var(--text-primary)]">Join Room</h3>
                  <p className="text-sm text-[var(--text-muted)] mt-1">Enter a 7-digit code</p>
                </div>
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              key="join-form"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md p-8 bg-[var(--bg-secondary)] border border-[var(--border-secondary)] shadow-lg rounded-2xl mx-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-[var(--text-primary)]">Join a Room</h3>
                <button 
                  onClick={() => setShowJoin(false)}
                  className="text-[var(--text-muted)] hover:text-[var(--text-primary)] bg-[var(--bg-tertiary)] p-1.5 rounded-full"
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleJoinSubmit} className="flex flex-col gap-4">
                <div className="relative">
                  <input
                    type="text"
                    maxLength={7}
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                    placeholder="7-Digit Code (e.g. A4B9Q2Z)"
                    className="w-full px-4 py-4 text-center text-2xl font-mono font-bold tracking-widest bg-[var(--bg-primary)] border-2 border-[var(--border-primary)] rounded-xl focus:border-[var(--text-primary)] focus:outline-none text-[var(--text-primary)] placeholder-[var(--text-muted)] uppercase transition-colors"
                    autoFocus
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={joinCode.trim().length !== 7}
                  className="w-full py-4 bg-[#1A1A1A] text-white font-bold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 hover:shadow-lg transition-all"
                >
                  Join Session <ArrowRight size={18} />
                </motion.button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
