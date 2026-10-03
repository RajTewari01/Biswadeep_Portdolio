"use client";

import { useEffect, useState } from "react";
import { useGame } from "./GameContext";

export default function LegacyGameWorld() {
  const { isGameMode, exitGameMode } = useGame();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isGameMode || !mounted) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] bg-[#e8f5e9] animate-in fade-in duration-700"
      style={{ isolation: "isolate" }}
    >
      {/* 
        We use an iframe to perfectly sandbox Bruno Simon's Vanilla JS / Vite application.
        This prevents his global CSS, Canvas manipulations, and Cannon.js loops 
        from colliding with Next.js, React Three Fiber, or Framer Motion.
      */}
      <iframe 
        src="/bruno-game/index.html" 
        style={{
          width: "100%",
          height: "100%",
          border: "none",
          outline: "none",
          background: "#161514", // Matches Bruno's default clear color
        }}
        title="Bruno Simon Game Engine"
        allow="autoplay; fullscreen; xr-spatial-tracking"
      />
      
      {/* Exit Button overlay */}
      <button 
        onClick={exitGameMode}
        className="absolute top-6 right-8 z-[110] flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-mono text-[10px] font-bold tracking-widest uppercase rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95 border-none"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
        EXIT GAME
      </button>
    </div>
  );
}
