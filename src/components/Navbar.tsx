"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGame } from "./game/GameContext";
import GamifiedPopup from "./GamifiedPopup";

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
  
  const [showPopup, setShowPopup] = useState(false);
  const [popupConfig, setPopupConfig] = useState({ title: "", message: "", href: "", confirmText: "", cancelText: "" });

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
                  if (link.label === "Hire") {
                    e.preventDefault();
                    setPopupConfig({
                      title: "Hire Me",
                      message: "Are you ready to discuss a project and hire me?",
                      href: link.href,
                      confirmText: "PROCEED",
                      cancelText: "NOT YET"
                    });
                    setShowPopup(true);
                  } else if (link.href.startsWith("/#")) {
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
                    if (link.label === "Hire") {
                      e.preventDefault();
                      setMenuOpen(false);
                      setPopupConfig({
                        title: "Hire Me",
                        message: "Are you ready to discuss a project and hire me?",
                        href: link.href,
                        confirmText: "PROCEED",
                        cancelText: "NOT YET"
                      });
                      setShowPopup(true);
                    } else if (link.href.startsWith("/#")) {
                      e.preventDefault();
                      setMenuOpen(false);
                      setTimeout(() => {
                        const targetId = link.href.replace("/#", "");
                        const targetEl = document.getElementById(targetId);
                        if (targetEl) {
                          window.scrollTo({ top: targetEl.offsetTop, behavior: "auto" });
                        }
                      }, 400);
                    } else {
                      setMenuOpen(false);
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

      
      {loadingGame && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md"
        >
          <GamifiedPopup
            isOpen={true}
            title="Initializing..."
            message="Loading the Gamified World..."
            confirmText="PLEASE WAIT"
            cancelText=""
            onConfirm={() => {}}
            onCancel={() => {}}
          />
        </motion.div>
      )}

      <AnimatePresence>
        {flashActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[110] bg-[#C9A96E]"
          />
        )}
      </AnimatePresence>

      <GamifiedPopup
        isOpen={showPopup}
        title={popupConfig.title}
        message={popupConfig.message}
        confirmText={popupConfig.confirmText}
        cancelText={popupConfig.cancelText}
        onConfirm={() => {
          setShowPopup(false);
          window.location.href = popupConfig.href;
        }}
        onCancel={() => setShowPopup(false)}
      />
    </>
  );
}
