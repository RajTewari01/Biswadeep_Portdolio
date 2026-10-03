"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGame } from "./game/GameContext";

const NAV_LINKS = [
  {
    label: "Work",
    href: "/#work",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      </svg>
    ),
  },
  {
    label: "About",
    href: "/#about",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
  {
    label: "Credentials",
    href: "/#credentials",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="7" /><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
      </svg>
    ),
  },
  {
    label: "Contact",
    href: "/#contact",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
      </svg>
    ),
  },
  {
    label: "Hire",
    href: "/hire",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
  },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [loadingGame, setLoadingGame] = useState(false);
  const [flashActive, setFlashActive] = useState(false);
  const { isGameMode, enterGameMode } = useGame();

  const handleEnterGameMode = () => {
    setLoadingGame(true);
    // After 2s show yellow flash, then enter game mode
    setTimeout(() => {
      setFlashActive(true);
      setTimeout(() => {
        setLoadingGame(false);
        setFlashActive(false);
        enterGameMode();
      }, 600);
    }, 2000);
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  // Hide full navbar in game mode (GameHUD takes over)
  if (isGameMode) return null;

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 0.3, ease: "circOut" }}
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          scrolled ? "py-2" : "py-4"
        }`}
        style={scrolled ? {
          background: "rgba(232, 245, 233, 0.92)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(0,0,0,0.06)",
          boxShadow: "0 4px 30px rgba(0, 0, 0, 0.04)",
        } : undefined}
      >
        {/* Accent line on scroll */}
        <div
          className={`absolute top-0 left-0 w-full h-[1px] transition-opacity duration-500 ${
            scrolled ? "opacity-100" : "opacity-0"
          }`}
          style={{ background: "linear-gradient(90deg, transparent, rgba(201,169,110,0.6) 50%, transparent)" }}
        />

        <div className="px-4 md:px-6 w-full flex items-center justify-between">

          {/* Logo */}
          <a href="/" className="relative group flex items-center gap-2.5 no-underline">
            <div className="w-9 h-9 rounded-lg bg-[#111] flex items-center justify-center group-hover:bg-[#C9A96E] transition-colors duration-400">
              <span className="text-white font-syne font-bold text-sm leading-none">BT</span>
            </div>
            <span className="font-syne font-bold text-xl tracking-wide text-[#111]">
              Portfolio
            </span>
          </a>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => {
                  if (link.href.startsWith("/#")) {
                    e.preventDefault();
                    const targetId = link.href.replace("/#", "");
                    const targetEl = document.getElementById(targetId);
                    if (targetEl) {
                      window.scrollTo({ top: targetEl.offsetTop, behavior: "auto" });
                    }
                  }
                }}
                className="relative group px-3 py-2 rounded-lg flex items-center gap-2 hover:bg-[#111]/5 transition-all duration-300 no-underline"
              >
                <span className="text-[#C9A96E] group-hover:text-[#111] transition-colors duration-300">
                  {link.icon}
                </span>
                <span className="font-syne text-[15px] uppercase tracking-[0.05em] text-[#111] group-hover:text-[#C9A96E] transition-colors duration-300 font-bold">
                  {link.label}
                </span>
              </a>
            ))}

            {/* Divider */}
            <div className="w-px h-5 bg-[#111]/10 mx-1" />

            {/* Gamified button */}
            <button
              onClick={handleEnterGameMode}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[#111]/5 transition-all duration-300 cursor-pointer border-none bg-transparent group"
            >
              <span className="text-[#C9A96E] group-hover:text-[#111] transition-colors duration-300">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="6" width="20" height="12" rx="2" />
                  <line x1="6" y1="12" x2="10" y2="12" /><line x1="8" y1="10" x2="8" y2="14" />
                  <circle cx="15" cy="11" r="0.5" fill="currentColor" /><circle cx="17" cy="13" r="0.5" fill="currentColor" />
                </svg>
              </span>
              <span className="font-syne text-[15px] uppercase tracking-[0.05em] text-[#111] group-hover:text-[#C9A96E] transition-colors duration-300 font-bold">
                Gamified
              </span>
            </button>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden flex flex-col gap-[5px] w-9 h-9 items-center justify-center rounded-lg z-[60] border-none bg-transparent cursor-pointer"
            aria-label="Toggle menu"
          >
            <span className={`block w-5 h-[2px] rounded-full transition-all duration-400 ease-out ${
              menuOpen ? "rotate-45 translate-y-[7px] bg-[#111]" : "bg-[#111]"
            }`} />
            <span className={`block w-3.5 h-[2px] rounded-full bg-[#111] transition-all duration-300 ${
              menuOpen ? "opacity-0 scale-0" : "opacity-100"
            }`} />
            <span className={`block w-5 h-[2px] rounded-full transition-all duration-400 ease-out ${
              menuOpen ? "-rotate-45 -translate-y-[7px] bg-[#111]" : "bg-[#111]"
            }`} />
          </button>
        </div>
      </motion.nav>

      {/* Full Screen Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="fixed inset-0 z-40 bg-[#e8f5e9] flex flex-col"
          >
            {/* Menu content - centered */}
            <div className="flex-1 flex flex-col items-start justify-center px-8 gap-2">
              {NAV_LINKS.map((link, i) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => {
                    setMenuOpen(false);
                    if (link.href.startsWith("/#")) {
                      e.preventDefault();
                      setTimeout(() => {
                        const targetId = link.href.replace("/#", "");
                        const targetEl = document.getElementById(targetId);
                        if (targetEl) {
                          window.scrollTo({ top: targetEl.offsetTop, behavior: "auto" });
                        }
                      }, 400);
                    }
                  }}
                  initial={{ x: -40, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 + i * 0.06, duration: 0.5, ease: "circOut" }}
                  className="flex items-center gap-4 py-3 no-underline group"
                >
                  <span className="w-10 h-10 rounded-xl bg-[#111]/5 flex items-center justify-center text-[#C9A96E] group-hover:bg-[#C9A96E] group-hover:text-white transition-all duration-300">
                    {link.icon}
                  </span>
                  <span className="font-playfair text-[clamp(32px,8vw,56px)] font-bold text-[#111] group-hover:text-[#C9A96E] transition-colors duration-300">
                    {link.label}
                  </span>
                </motion.a>
              ))}

              {/* Gamified in mobile menu */}
              <motion.button
                onClick={() => { setMenuOpen(false); handleEnterGameMode(); }}
                initial={{ x: -40, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 + NAV_LINKS.length * 0.06, duration: 0.5, ease: "circOut" }}
                className="flex items-center gap-4 py-3 bg-transparent border-none cursor-pointer group"
              >
                <span className="w-10 h-10 rounded-xl bg-[#C9A96E]/15 flex items-center justify-center text-[#C9A96E] group-hover:bg-[#C9A96E] group-hover:text-white transition-all duration-300">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="6" width="20" height="12" rx="2" />
                    <line x1="6" y1="12" x2="10" y2="12" /><line x1="8" y1="10" x2="8" y2="14" />
                    <circle cx="15" cy="11" r="0.5" fill="currentColor" /><circle cx="17" cy="13" r="0.5" fill="currentColor" />
                  </svg>
                </span>
                <span className="font-playfair text-[clamp(32px,8vw,56px)] font-bold text-[#C9A96E]">
                  Gamified
                </span>
              </motion.button>
            </div>

            {/* Bottom credit */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="px-8 pb-8 flex items-center justify-between"
            >
              <span className="font-mono text-[9px] tracking-[0.3em] uppercase text-[#111]/20">
                Biswadeep Tewari
              </span>
              <span className="font-mono text-[9px] tracking-[0.3em] uppercase text-[#111]/20">
                Portfolio
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Gamified Loading Overlay */}
      <AnimatePresence>
        {loadingGame && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0a1f15]/95 backdrop-blur-md"
          >
            <style>{`
              @keyframes catArmWave {
                0% { transform: rotate(0); }
                2.5% { transform: rotate(15deg); }
                7.5% { transform: rotate(-15deg); }
                12.5% { transform: rotate(15deg); }
                17.5% { transform: rotate(-15deg); }
                20% { transform: rotate(0); }
                100% { transform: rotate(0); }
              }
              @keyframes gameDotBlink {
                0% { opacity: 0; }
                20% { opacity: 1; }
                100% { opacity: 1; }
              }
            `}</style>
            <div className="w-full max-w-sm flex flex-col items-center md:scale-125 lg:scale-[1.4] transform-gpu origin-center">
              {/* Cat Avatar */}
              <div className="mb-4 relative w-[132px] h-[118px] overflow-hidden" style={{ pointerEvents: 'none' }}>
                <div className="absolute top-0 left-0 w-[112px] h-[100%]">
                  <div 
                    className="absolute top-0 left-0 w-full h-full"
                    style={{ background: 'url(/bruno-game/assets/boyHiBody-DHJ5Gzs3.png) no-repeat center/contain' }}
                  />
                  <div 
                    className="absolute bottom-0 right-0 w-[49px] h-[69px]"
                    style={{ 
                      background: 'url(data:image/png;base64,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) no-repeat center/contain',
                      transformOrigin: '30% 90%',
                      animation: 'catArmWave 3s infinite ease-in-out'
                    }}
                  />
                </div>
              </div>

              {/* Message Bubble */}
              <div className="bg-[#111111] rounded-full px-8 py-4 shadow-2xl relative border-2 border-[#C9A96E] w-auto inline-block max-w-[95%]">
                <p className="text-white text-center font-bold text-[15px] md:text-[17px] tracking-wide flex justify-center items-center gap-[2px] whitespace-nowrap" style={{ fontFamily: "'Comic Neue', cursive" }}>
                  Loading the gamified world of Biswadeep
                  <span style={{ animation: "gameDotBlink 1.5s infinite" }}>.</span>
                  <span style={{ animation: "gameDotBlink 1.5s infinite", animationDelay: "0.2s" }}>.</span>
                  <span style={{ animation: "gameDotBlink 1.5s infinite", animationDelay: "0.4s" }}>.</span>
                </p>
                <div 
                  className="absolute w-[16px] h-[12px] -top-[12px] left-1/2 -translate-x-1/2"
                  style={{
                    background: `url("data:image/svg+xml,%3Csvg width='16' height='12' viewBox='0 0 16 12' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M8 0L0 12H16L8 0Z' fill='%23C9A96E'/%3E%3Cpath d='M8 3L2.5 12H13.5L8 3Z' fill='%23111111'/%3E%3C/svg%3E") no-repeat center/contain`
                  }}
                />
              </div>
            </div>

            {/* Yellow Flash */}
            {flashActive && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 1, 0] }}
                transition={{ duration: 0.6, times: [0, 0.1, 0.5, 1] }}
                className="fixed inset-0 z-[10000] bg-[#C9A96E] pointer-events-none"
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
