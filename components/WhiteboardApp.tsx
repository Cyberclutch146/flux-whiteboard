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
import { auth, googleProvider, signInWithPopup } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useBoardStore } from "@/store/board";

type AppState = 'loading' | 'login' | 'dashboard' | 'board';
const generateRoomCode = () => Math.random().toString(36).substring(2, 9).toUpperCase();

export default function WhiteboardApp() {
  useKeyboardShortcuts();
  
  const [appState, setAppState] = useState<AppState>('loading');
  const [user, setUser] = useState<any>(null);
  const [roomId, setRoomId] = useState<string | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      // Wait for LoadingScreen to finish before transitioning
      // But if we're already past loading, transition directly
      setAppState(prev => prev === 'loading' ? prev : (u ? 'dashboard' : 'login'));
    });
    return () => unsub();
  }, []);

  const handleLoadingDone = () => {
    setAppState(user ? 'dashboard' : 'login');
  };

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (e) {
      console.error(e);
      // Fallback for development if config is missing:
      setUser({ displayName: "Dev User" });
      setAppState('dashboard');
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setRoomId(null);
      setAppState('login');
      // If we used a simulated user
      if (user?.displayName === "Dev User") setUser(null); 
    } catch (e) {
      console.error(e);
    }
  };

  const handleSolo = () => {
    setRoomId(null);
    setAppState('board');
  };

  const handleCreateRoom = () => {
    const code = generateRoomCode();
    setRoomId(code);
    setAppState('board');
  };

  const handleJoinRoom = (code: string) => {
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
