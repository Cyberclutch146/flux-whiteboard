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
import Notebook      from "./Notebook";
import { useBoardStore } from "@/store/board";
import { auth, googleProvider, signInWithPopup, signOut as firebaseSignOut } from "@/lib/firebase";

type AppState = 'loading' | 'login' | 'dashboard' | 'board' | 'notebook';
const generateRoomCode = () => Math.random().toString(36).substring(2, 9).toUpperCase();

export default function WhiteboardApp() {
  useKeyboardShortcuts();
  
  const [appState, setAppState] = useState<AppState>('loading');
  const [user, setUser] = useState<any>(null);
  
  useEffect(() => {
    // Listen to Firebase Auth state
    if (auth) {
      const unsubscribe = auth.onAuthStateChanged((u) => {
        if (u) {
          setUser({ uid: u.uid, displayName: u.displayName || "User", photoURL: u.photoURL });
          // If we were waiting at Login, push to dashboard
          setAppState((prev) => prev === 'login' ? 'dashboard' : prev);
        } else {
          setUser(null);
        }
      });
      return () => unsubscribe();
    }
  }, []);
  const [roomId, setRoomId] = useState<string | null>(null);

  const handleLoadingDone = () => {
    if (user) {
      setAppState('dashboard');
    } else {
      setAppState('login');
    }
  };

  const handleLogin = async () => {
    if (!auth) {
      alert("Firebase Auth configuration is missing!");
      return;
    }
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (e: any) {
      console.error(e);
      alert(`Login failed: ${e.message}\n(Did you save your .env.local file?)`);
    }
  };

  const handleSignOut = async () => {
    if (auth) {
      try {
        await firebaseSignOut(auth);
      } catch (e) {}
    }
    setUser(null);
    setRoomId(null);
    useBoardStore.getState().forceWipeBoard();
    setAppState('login');
  };

  const handleSolo = () => {
    const { mode, forceWipeBoard } = useBoardStore.getState();
    // Rule 2: Every time a user enters a solo room, data should be erased.
    forceWipeBoard();
    setRoomId(null);
    setAppState(mode === 'notebook' ? 'notebook' : 'board');
  };

  const handleCreateRoom = () => {
    const { mode, forceWipeBoard } = useBoardStore.getState();
    forceWipeBoard();
    const code = generateRoomCode();
    setRoomId(code);
    setAppState(mode === 'notebook' ? 'notebook' : 'board');
  };

  const handleJoinRoom = (code: string) => {
    const { mode, forceWipeBoard } = useBoardStore.getState();
    forceWipeBoard();
    setRoomId(code);
    setAppState(mode === 'notebook' ? 'notebook' : 'board');
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
            onBackToHome={() => {
              useBoardStore.getState().forceWipeBoard();
              setAppState('dashboard');
            }} 
            onSignOut={handleSignOut} 
          />
          <div className="relative flex-1 overflow-hidden">
            <Canvas user={user} roomId={roomId} />
          </div>
          <StatusBar />
        </>
      )}

      {appState === 'notebook' && (
        <>
          <TopBar 
            roomId={roomId} 
            user={user}
            title="Collaborative Notebook"
            onBackToHome={() => {
              useBoardStore.getState().forceWipeBoard();
              setAppState('dashboard');
            }} 
            onSignOut={handleSignOut} 
          />
          <div className="relative flex-1 overflow-hidden">
            <Notebook user={user} roomId={roomId} />
          </div>
        </>
      )}
    </div>
  );
}
