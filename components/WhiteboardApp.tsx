"use client";

import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import TopBar        from "./TopBar";
import Canvas        from "./Canvas";
import StatusBar     from "./StatusBar";
import LoadingScreen from "./LoadingScreen";
import LoginScreen   from "./LoginScreen";
import { auth, googleProvider, signInWithPopup } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useBoardStore } from "@/store/board";

export default function WhiteboardApp() {
  useKeyboardShortcuts();
  
  const [loaded, setLoaded] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [authInitialized, setAuthInitialized] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthInitialized(true);
    });
    return () => unsub();
  }, []);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (e) {
      console.error(e);
      // Fallback for development if config is missing:
      setUser({ displayName: "Dev User" });
      setAuthInitialized(true);
    }
  };

  const { theme } = useBoardStore();

  const showLoader = !loaded;
  const showLogin = loaded && authInitialized && !user;
  const showApp = loaded && authInitialized && user;

  return (
    <div className={`relative w-full h-screen overflow-hidden bg-white select-none flex flex-col ${theme}`}>
      <AnimatePresence>
        {showLoader && <LoadingScreen key="loader" onDone={() => setLoaded(true)} />}
        {showLogin && <LoginScreen key="login" onLogin={handleLogin} />}
      </AnimatePresence>
      
      {showApp && (
        <>
          {/* Dense native-like top bar */}
          <TopBar />

          {/* Main Canvas Area */}
          <div className="relative flex-1 overflow-hidden">
            <Canvas user={user} />
          </div>

          {/* Minimal status bar */}
          <StatusBar />
        </>
      )}
    </div>
  );
}
