"use client";

import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import TopBar        from "./TopBar";
import Canvas        from "./Canvas";
import StatusBar     from "./StatusBar";
import LoadingScreen from "./LoadingScreen";
import LoginScreen   from "./LoginScreen";
import Dashboard     from "./Dashboard";
import { useBoardStore } from "@/store/board";

type AppState = 'loading' | 'login' | 'dashboard' | 'board';
const generateRoomCode = () => Math.random().toString(36).substring(2, 9).toUpperCase();

export default function WhiteboardApp() {
  useKeyboardShortcuts();
  
  const [appState, setAppState] = useState<AppState>('loading');
  const [user, setUser] = useState<any>(() => ({
    uid: "anon_" + Math.random().toString(36).substring(2, 9),
    displayName: "Guest_" + Math.random().toString(36).substring(2, 6).toUpperCase(),
    photoURL: null
  }));
  const [roomId, setRoomId] = useState<string | null>(null);

  const handleLoadingDone = () => {
    setAppState('dashboard');
  };

  const handleLogin = async () => {
    setAppState('dashboard');
  };

  const handleSignOut = async () => {
    // Generate new random guest info
    setUser({
      uid: "anon_" + Math.random().toString(36).substring(2, 9),
      displayName: "Guest_" + Math.random().toString(36).substring(2, 6).toUpperCase(),
      photoURL: null
    });
    setRoomId(null);
    useBoardStore.getState().forceWipeBoard();
    setAppState('dashboard');
  };

  const handleSolo = () => {
    setRoomId(null);
    setAppState('board');
  };

  const handleCreateRoom = () => {
    useBoardStore.getState().forceWipeBoard();
    const code = generateRoomCode();
    setRoomId(code);
    setAppState('board');
  };

  const handleJoinRoom = (code: string) => {
    useBoardStore.getState().forceWipeBoard();
    setRoomId(code);
    setAppState('board');
  };

  const { theme } = useBoardStore();

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    // Fixed Dark mode bug: removed bg-white, using bg-[var(--bg-primary)] from globals.css variables
    <div className={`relative w-full h-screen overflow-hidden bg-[var(--bg-primary)] select-none flex flex-col transition-colors`}>
      <AnimatePresence>
        {appState === 'loading' && <LoadingScreen key="loader" onDone={handleLoadingDone} />}
        {appState === 'login' && <LoginScreen key="login" onLogin={handleLogin} />}
        {appState === 'dashboard' && (
          <Dashboard 
            key="dashboard" 
            user={user} 
            onSignOut={handleSignOut} 
            onSolo={handleSolo}
            onCreateRoom={handleCreateRoom}
            onJoinRoom={handleJoinRoom}
          />
        )}
      </AnimatePresence>
      
      {appState === 'board' && (
        <>
          <TopBar 
            roomId={roomId} 
            user={user}
            onBackToHome={() => setAppState('dashboard')} 
            onSignOut={handleSignOut} 
          />
          <div className="relative flex-1 overflow-hidden">
            <Canvas user={user} roomId={roomId} />
          </div>
          <StatusBar />
        </>
      )}
    </div>
  );
}
