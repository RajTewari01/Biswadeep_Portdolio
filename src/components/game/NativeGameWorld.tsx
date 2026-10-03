"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useGame } from "./GameContext";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const PLAYER_SPEED = 400; // pixels per second
const MAP_WIDTH = 3000;
const MAP_HEIGHT = 3000;

const ZONES = [
  { id: "about", x: 1000, y: 1000, radius: 180, color: "#4ade80", label: "ABOUT", path: "/#about", icon: "M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" },
  { id: "work", x: 2000, y: 1000, radius: 200, color: "#60a5fa", label: "WORK", path: "/#work", icon: "M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z" },
  { id: "credentials", x: 1000, y: 2000, radius: 190, color: "#c084fc", label: "CREDENTIALS", path: "/#credentials", icon: "M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72l5 2.73 5-2.73v3.72z" },
  { id: "contact", x: 2000, y: 2000, radius: 180, color: "#f87171", label: "CONTACT", path: "/#contact", icon: "M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" },
  { id: "hire", x: 1500, y: 1500, radius: 220, color: "#C9A96E", label: "HIRE ME", path: "/hire", icon: "M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm4.24 16L12 15.45 7.77 18l1.12-4.81-3.73-3.23 4.92-.42L12 5l1.92 4.53 4.92.42-3.73 3.23L16.23 18z" },
];

export default function NativeGameWorld() {
  const { isGameMode, exitGameMode } = useGame();
  const router = useRouter();

  const [started, setStarted] = useState(false);
  const [showExit, setShowExit] = useState(false);

  const playerRef = useRef<SVGGElement>(null);
  const playerVisualRef = useRef<SVGGElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  const pos = useRef({ x: 1500, y: 2800 });
  const keys = useRef({ w: false, a: false, s: false, d: false });
  const joystick = useRef({ x: 0, y: 0 }); 

  const activeZone = useRef<string | null>(null);
  
  useEffect(() => {
    if (!isGameMode || !started) return;

    let lastTime = performance.now();
    let reqId: number;

    const loop = (time: number) => {
      const dt = Math.min((time - lastTime) / 1000, 0.1); // cap dt to prevent huge jumps
      lastTime = time;

      let dx = joystick.current.x;
      let dy = joystick.current.y;

      if (keys.current.w) dy = -1;
      if (keys.current.s) dy = 1;
      if (keys.current.a) dx = -1;
      if (keys.current.d) dx = 1;

      const mag = Math.sqrt(dx * dx + dy * dy);
      if (mag > 0) {
        dx /= mag;
        dy /= mag;
      }

      pos.current.x += dx * PLAYER_SPEED * dt;
      pos.current.y += dy * PLAYER_SPEED * dt;

      pos.current.x = Math.max(50, Math.min(MAP_WIDTH - 50, pos.current.x));
      pos.current.y = Math.max(50, Math.min(MAP_HEIGHT - 50, pos.current.y));

      if (playerRef.current) {
        playerRef.current.setAttribute("transform", `translate(${pos.current.x}, ${pos.current.y})`);
      }

      if (playerVisualRef.current && mag > 0) {
        const angle = (Math.atan2(dy, dx) * 180) / Math.PI + 90;
        playerVisualRef.current.setAttribute("transform", `rotate(${angle})`);
      }

      if (mapRef.current) {
        const cx = window.innerWidth / 2 - pos.current.x;
        const cy = window.innerHeight / 2 - pos.current.y;
        mapRef.current.style.transform = `translate(${cx}px, ${cy}px)`;
      }

      let touchingZone = null;
      for (const z of ZONES) {
        const dist = Math.sqrt(Math.pow(pos.current.x - z.x, 2) + Math.pow(pos.current.y - z.y, 2));
        if (dist < z.radius - 20) {
          touchingZone = z;
          break;
        }
      }

      if (touchingZone && activeZone.current !== touchingZone.id) {
        activeZone.current = touchingZone.id;
        
        if (touchingZone.path.startsWith('/#')) {
           window.location.hash = touchingZone.path.split('#')[1];
           exitGameMode();
        } else {
           router.push(touchingZone.path);
           exitGameMode();
        }
      } else if (!touchingZone) {
        activeZone.current = null;
      }

      reqId = requestAnimationFrame(loop);
    };

    reqId = requestAnimationFrame(loop);
    
    const showExitTimer = setTimeout(() => setShowExit(true), 3000);
    
    return () => {
      cancelAnimationFrame(reqId);
      clearTimeout(showExitTimer);
    };
  }, [isGameMode, started, exitGameMode, router]);

  useEffect(() => {
    if (!isGameMode || !started) return;
    const kd = (e: KeyboardEvent) => {
      if (e.key === 'w' || e.key === 'ArrowUp') keys.current.w = true;
      if (e.key === 'a' || e.key === 'ArrowLeft') keys.current.a = true;
      if (e.key === 's' || e.key === 'ArrowDown') keys.current.s = true;
      if (e.key === 'd' || e.key === 'ArrowRight') keys.current.d = true;
    };
    const ku = (e: KeyboardEvent) => {
      if (e.key === 'w' || e.key === 'ArrowUp') keys.current.w = false;
      if (e.key === 'a' || e.key === 'ArrowLeft') keys.current.a = false;
      if (e.key === 's' || e.key === 'ArrowDown') keys.current.s = false;
      if (e.key === 'd' || e.key === 'ArrowRight') keys.current.d = false;
    };
    window.addEventListener('keydown', kd);
    window.addEventListener('keyup', ku);
    return () => {
      window.removeEventListener('keydown', kd);
      window.removeEventListener('keyup', ku);
    }
  }, [isGameMode, started]);

  // Floating Joystick State
  const [joystickCenter, setJoystickCenter] = useState<{x: number, y: number} | null>(null);
  const [joystickThumb, setJoystickThumb] = useState<{x: number, y: number} | null>(null);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (!started) return;
    const touch = e.targetTouches[0];
    setJoystickCenter({ x: touch.clientX, y: touch.clientY });
    setJoystickThumb({ x: touch.clientX, y: touch.clientY });
  }, [started]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!joystickCenter || !started) return;
    const touch = e.targetTouches[0];
    let dx = touch.clientX - joystickCenter.x;
    let dy = touch.clientY - joystickCenter.y;
    const dist = Math.sqrt(dx*dx + dy*dy);
    const maxDist = 40;
    
    if (dist > maxDist) {
      dx = (dx / dist) * maxDist;
      dy = (dy / dist) * maxDist;
    }
    
    setJoystickThumb({ x: joystickCenter.x + dx, y: joystickCenter.y + dy });
    
    joystick.current.x = dx / maxDist;
    joystick.current.y = dy / maxDist;
  }, [joystickCenter, started]);

  const handleTouchEnd = useCallback(() => {
    setJoystickCenter(null);
    setJoystickThumb(null);
    joystick.current = { x: 0, y: 0 };
  }, []);

  if (!isGameMode) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] bg-[#111] overflow-hidden touch-none select-none text-white font-syne"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
    >
      <AnimatePresence>
        {!started && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#111]/95 backdrop-blur-xl p-6 text-center"
          >
            <div className="w-32 h-32 mb-8 relative">
              <svg viewBox="0 0 100 100" className="w-full h-full animate-bounce drop-shadow-[0_0_15px_rgba(201,169,110,0.8)]">
                 <circle cx="50" cy="50" r="40" fill="none" stroke="#C9A96E" strokeWidth="4" strokeDasharray="10 10">
                   <animateTransform attributeName="transform" type="rotate" from="0 50 50" to="360 50 50" dur="10s" repeatCount="indefinite" />
                 </circle>
                 <path d="M50 20 L80 70 L50 60 L20 70 Z" fill="#C9A96E" />
              </svg>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-[0.2em] uppercase">Digital Realm</h2>
            <p className="text-white/60 mb-10 max-w-sm font-light text-sm md:text-base leading-relaxed font-mono">
              Explore the portfolio interactively.
              <br/><br/>
              <span className="hidden md:inline">Use WASD or Arrow Keys to move.</span>
              <span className="inline md:hidden">Use the floating virtual joystick to move.</span>
            </p>
            <button 
              onClick={(e) => { e.stopPropagation(); setStarted(true); }}
              className="px-12 py-5 bg-[#C9A96E] text-[#111] font-bold tracking-[0.2em] uppercase rounded-full hover:scale-105 transition-all shadow-[0_0_30px_rgba(201,169,110,0.4)]"
            >
              Start Exploring
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Map View */}
      <div ref={mapRef} className="absolute top-0 left-0 transition-transform duration-0 ease-linear" style={{ width: MAP_WIDTH, height: MAP_HEIGHT, transformOrigin: '0 0' }}>
         <svg width={MAP_WIDTH} height={MAP_HEIGHT} className="absolute top-0 left-0">
            {/* Dark Grid Background */}
            <defs>
              <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
                <path d="M 80 0 L 0 0 0 80" fill="none" stroke="#ffffff" strokeOpacity="0.04" strokeWidth="1" />
              </pattern>
              <radialGradient id="glow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#C9A96E" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#C9A96E" stopOpacity="0" />
              </radialGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />

            {/* Stars/Dots scattered */}
            {Array.from({ length: 100 }).map((_, i) => (
              <circle key={i} cx={Math.random() * MAP_WIDTH} cy={Math.random() * MAP_HEIGHT} r={Math.random() * 2 + 1} fill="#ffffff" fillOpacity={Math.random() * 0.5 + 0.1} />
            ))}

            {/* Zones */}
            {ZONES.map(z => (
               <g key={z.id} transform={`translate(${z.x}, ${z.y})`}>
                 {/* Aura */}
                 <circle r={z.radius + 50} fill={`url(#glow)`} />
                 
                 {/* Rotating dashed ring */}
                 <circle r={z.radius} fill="none" stroke={z.color} strokeOpacity="0.4" strokeWidth="2" strokeDasharray="12 12">
                   <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="30s" repeatCount="indefinite" />
                 </circle>
                 
                 {/* Inner core */}
                 <circle r={z.radius - 20} fill={z.color} fillOpacity="0.1" stroke={z.color} strokeWidth="1" />
                 
                 {/* Icon */}
                 <g transform="translate(-24, -40) scale(2)">
                    <path d={z.icon} fill={z.color} />
                 </g>
                 
                 {/* Label */}
                 <text y="40" textAnchor="middle" fill="#fff" fontSize="22" fontFamily="sans-serif" fontWeight="800" letterSpacing="4" opacity="0.9">{z.label}</text>
               </g>
            ))}

            {/* Player */}
            <g ref={playerRef} transform={`translate(1500, 2800)`}>
               {/* Player Aura */}
               <circle r="40" fill="#C9A96E" fillOpacity="0.15">
                  <animate attributeName="r" values="40;45;40" dur="2s" repeatCount="indefinite" />
               </circle>
               
               {/* Player SVG Vector */}
               <g ref={playerVisualRef}>
                 <circle r="18" fill="#C9A96E" stroke="#fff" strokeWidth="2" />
                 <path d="M 0,-12 L -8,6 L 0,2 L 8,6 Z" fill="#111" />
               </g>
            </g>
         </svg>
      </div>

      {/* Floating Joystick (Mobile Only) */}
      {joystickCenter && joystickThumb && (
        <div className="fixed z-[200] pointer-events-none md:hidden" style={{ left: 0, top: 0, width: '100%', height: '100%' }}>
          {/* Base */}
          <div 
            className="absolute rounded-full border-2 border-[#C9A96E]/40 bg-black/20 backdrop-blur-sm"
            style={{ 
              left: joystickCenter.x - 50, 
              top: joystickCenter.y - 50, 
              width: 100, 
              height: 100 
            }} 
          />
          {/* Thumb */}
          <div 
            className="absolute rounded-full bg-[#C9A96E] shadow-[0_0_15px_rgba(201,169,110,0.6)]"
            style={{ 
              left: joystickThumb.x - 25, 
              top: joystickThumb.y - 25, 
              width: 50, 
              height: 50 
            }} 
          />
        </div>
      )}

      {/* Exit Button */}
      <AnimatePresence>
        {started && showExit && (
          <motion.button
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={(e) => { e.stopPropagation(); exitGameMode(); }}
            className="fixed top-6 right-6 z-[200] px-6 py-3 bg-red-500/10 border border-red-500/30 text-red-400 font-bold tracking-widest uppercase rounded-full backdrop-blur-md hover:bg-red-500/20 transition-colors text-xs"
          >
            ✕ Exit Realm
          </motion.button>
        )}
      </AnimatePresence>

      {/* Overlay Instructions */}
      {started && (
        <div className="fixed bottom-8 left-0 w-full text-center pointer-events-none z-[150] opacity-50">
          <p className="text-[10px] tracking-widest uppercase font-mono">Navigate to a zone to enter</p>
        </div>
      )}
    </div>
  );
}
