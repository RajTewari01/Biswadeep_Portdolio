"use client";

import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import GamifiedPopup from "./GamifiedPopup";
import { useGame } from "./game/GameContext";

gsap.registerPlugin(ScrollTrigger);

// ─── Math utils ────────────────────────────────────────────────────────────
const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max);
const mapRange = (value: number, inMin: number, inMax: number, outMin: number, outMax: number) =>
  outMin + (outMax - outMin) * clamp((value - inMin) / (inMax - inMin), 0, 1);

// ─── Grain SVG ─────────────────────────────────────────────────────────────
const GRAIN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23g)'/%3E%3C/svg%3E")`;

// Ultra-premium custom generated dark cinematic deep ocean scenery
const IMG_HERO = "/hero_bg.png";

export default function ParallaxHero() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const textRef1 = useRef<HTMLHeadingElement>(null);
  const textRef2 = useRef<HTMLHeadingElement>(null);
  const subtextRef = useRef<HTMLParagraphElement>(null);
  const [scrollY, setScrollY] = useState(0);

  const [showPopup, setShowPopup] = useState(false);
  const [popupConfig, setPopupConfig] = useState({ title: "", message: "", href: "", download: false, isGameTrigger: false });
  const { enterGameMode } = useGame();

  const handleConfirm = () => {
    setShowPopup(false);
    if (popupConfig.isGameTrigger) {
      enterGameMode();
    } else if (popupConfig.download) {
      const link = document.createElement("a");
      link.href = popupConfig.href;
      link.download = "Biswadeep_Tewari_CV.pdf";
      link.click();
    } else if (popupConfig.href) {
      window.location.href = popupConfig.href;
    }
  };

  const handleCancel = () => {
    setShowPopup(false);
  };

  // ─── Parallax scroll listener ─────────────────────────────────────────
  useEffect(() => {
    const onScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ─── GSAP text animations ────────────────────────────────────────────
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      const splitText1 = textRef1.current?.querySelectorAll(".char-first");
      const splitText2 = textRef2.current?.querySelectorAll(".char-last");

      if (splitText1) {
        tl.fromTo(
          splitText1,
          { y: 80, opacity: 0, filter: "blur(12px)", rotateX: 40 },
          {
            y: 0, opacity: 1, filter: "blur(0px)", rotateX: 0,
            duration: 1.2, stagger: 0.04, ease: "power3.out",
          }
        );
      }

      if (splitText2 && splitText2.length > 0) {
        // Use display: none to physically collapse letters so the cursor follows
        const typeTl = gsap.timeline({ repeat: -1, delay: 1.5 });
        typeTl.fromTo(
          splitText2,
          { opacity: 0, display: "none" },
          { opacity: 1, display: "inline-block", duration: 0.01, stagger: 0.25, ease: "none" }
        );
        typeTl.to({}, { duration: 2.5 });
        const reversedChars = Array.from(splitText2).reverse();
        typeTl.to(reversedChars, {
          opacity: 0, display: "none", duration: 0.01, stagger: 0.02, ease: "none",
        });
        typeTl.to({}, { duration: 0.3 });
      }

      if (subtextRef.current) {
        const textToType = "Full-Stack Engineer & Systems Architect. Building scalable software, APIs, and product experiences.";
        subtextRef.current.innerText = "";
        let i = 0;
        const typeWriter = () => {
          if (i < textToType.length && subtextRef.current) {
            subtextRef.current.innerHTML += textToType.charAt(i);
            i++;
            setTimeout(typeWriter, 18);
          }
        };
        tl.add(typeWriter, "-=0.6");
      }
    }, wrapRef);

    return () => ctx.revert();
  }, []);

  // ─── Perspective Sticky calculations ─────────────────────────────────
  const vh = typeof window !== "undefined" ? window.innerHeight : 800;
  const scale = mapRange(scrollY, 0, vh, 1, 0.85);
  const rotateZ = mapRange(scrollY, 0, vh, 0, 15); // Clockwise heavy rotation
  const br = mapRange(scrollY, 0, vh, 0, 32);
  const dim = mapRange(scrollY, 0, vh, 1, 0.5); // Keep it visible but darker
  const opacity = mapRange(scrollY, vh * 0.5, vh * 1.2, 1, 0.2); // Slower fade so it peaks into next page
  const blur = mapRange(scrollY, vh * 0.4, vh, 0, 4); // Subtle blur

  return (
    <div ref={wrapRef} style={{ position: "relative", height: "200vh" }}>
      {/* ── S1: STICKY HERO — shrinks + rotates away ── */}
      <div style={{
        position: "sticky", top: 0, height: "100vh",
        zIndex: 50, background: "transparent",
      }}>
        <div
          ref={heroRef}
          style={{
            width: "100%", height: "100%",
            position: "relative",
            transformOrigin: "50% 50%",
            transform: `scale(${scale}) rotate(${rotateZ}deg) translateY(${scrollY * 0.1}px)`,
            filter: `brightness(${dim}) blur(${blur}px)`,
            opacity: opacity,
            borderRadius: br,
            boxShadow: scrollY > 50 ? "0 40px 100px rgba(0,0,0,0.8)" : "none",
          }}
        >
          {/* Apple/Pinterest Soft Light Mesh Gradient */}
          <div style={{
            position: "absolute", inset: "-10% -10%",
            backgroundColor: "#F8FAFC", // Clean off-white slate base
            overflow: "hidden", zIndex: 0,
          }}>
            {/* Soft sky blue top right */}
            <div style={{
              position: "absolute", width: "80vw", height: "80vw",
              top: "-20%", right: "-10%",
              background: "#E0F2FE",
              filter: "blur(140px)", borderRadius: "50%", opacity: 0.8,
            }} />
            
            {/* Soft pastel pink bottom left */}
            <div style={{
              position: "absolute", width: "60vw", height: "60vw",
              bottom: "-10%", left: "-10%",
              background: "#FCE7F3",
              filter: "blur(120px)", borderRadius: "50%", opacity: 0.7,
            }} />

            {/* Glowing mint center */}
            <div style={{
              position: "absolute", width: "70vw", height: "70vw",
              top: "20%", left: "20%",
              background: "#D1FAE5",
              filter: "blur(140px)", borderRadius: "50%", opacity: 0.5,
            }} />
          </div>

          {/* Subtle clean grid */}
          <div style={{
            position: "absolute", inset: 0, opacity: 0.03,
            backgroundImage: "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)",
            backgroundSize: "64px 64px",
            pointerEvents: "none", zIndex: 1,
          }} />

          {/* Professional Circuit Board Pattern Overlay */}
          <div style={{
            position: "absolute", inset: 0, opacity: 0.25,
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M10 10h20v20h-20zM40 40h20v20h-20zM70 70h20v20h-20z' fill='none' stroke='%230F172A' stroke-width='1' stroke-opacity='0.1'/%3E%3Cpath d='M20 20 l 20 20 M50 50 l 20 20' stroke='%230F172A' stroke-width='1' stroke-opacity='0.1'/%3E%3Ccircle cx='10' cy='10' r='2' fill='%230F172A' fill-opacity='0.2'/%3E%3Ccircle cx='40' cy='40' r='2' fill='%230F172A' fill-opacity='0.2'/%3E%3Ccircle cx='70' cy='70' r='2' fill='%230F172A' fill-opacity='0.2'/%3E%3C/svg%3E")`,
            backgroundSize: "100px 100px",
            pointerEvents: "none", zIndex: 1,
            maskImage: "linear-gradient(to left, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 80%)",
            WebkitMaskImage: "linear-gradient(to left, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 80%)"
          }} />

          {/* Grain */}
          <div style={{
            position: "absolute", inset: 0,
            backgroundImage: GRAIN, backgroundSize: "240px 240px",
            opacity: 0.12, mixBlendMode: "overlay",
          }} />

          {/* Fine border — desktop only */}
          <div className="hidden md:block" style={{
            position: "absolute", inset: 24,
            border: "1px solid rgba(201,169,110,0.08)",
            borderRadius: 4, pointerEvents: "none",
          }} />

          {/* Hero content */}
          <div className="absolute inset-0 flex flex-col items-start justify-center px-6 md:px-[10vw] max-w-[100vw] overflow-hidden" style={{ paddingTop: "8vh" }}>
            <div className="fade-in" style={{
              display: "flex", alignItems: "center", gap: 14,
              marginBottom: 32,
              background: "#ffffff", padding: "6px 24px 6px 6px", borderRadius: 40,
              boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
              border: "1px solid rgba(0,0,0,0.03)"
            }}>
              <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0">
                <Image src="/biswadeep_google.png" alt="Biswadeep Tewari" width={64} height={64} className="object-cover w-full h-full" priority />
              </div>
              <p style={{ fontSize: 18, color: "#111", fontFamily: "var(--font-pacifico), cursive", fontWeight: 400, transform: "translateY(-1px)" }}>Biswadeep Tewari</p>
            </div>

            <h1
              ref={textRef1}
              className="font-playfair text-[clamp(48px,13vw,240px)] font-black text-[#0F172A] leading-[0.88] tracking-[-0.025em] mb-[2px] md:mb-2 flex overflow-hidden fade-in fd2 justify-start"
            >
              {"BISWADEEP".split("").map((char, i) => (
                <span key={`first-${i}`} className="char-first inline-block">{char}</span>
              ))}
            </h1>
            <h1
              ref={textRef2}
              className="font-playfair text-[clamp(48px,13vw,240px)] font-black leading-[0.88] tracking-[-0.025em] mb-4 md:mb-[40px] flex flex-wrap justify-start overflow-hidden"
            >
              {"TEWARI".split("").map((char, i) => (
                <span key={`last-${i}`} className="char-last inline-block opacity-0" style={{ display: "none", color: "#C9A96E", fontStyle: "italic", fontWeight: 400 }}>{char}</span>
              ))}
              <span className="char-last inline-block opacity-0" style={{ color: "#0F172A" }}>.</span>
              <span className="inline-block cursor-blink ml-1 font-light" style={{ color: "#0F172A" }}>|</span>
            </h1>

            <p
              ref={subtextRef}
              className="fade-in fd3"
              style={{
                color: "#222", fontSize: "clamp(16px, 1.8vw, 24px)",
                width: "100%", maxWidth: 800, boxSizing: "border-box", wordBreak: "break-word",
                fontWeight: 500, lineHeight: 1.6, textAlign: "left",
              }}
            />

            {/* Social Links - Cupertino iOS Style */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 2.5 }}
              className="flex flex-wrap justify-start items-center gap-3 md:gap-4 mt-8 md:mt-12"
            >
              {[
                { 
                  href: "https://www.linkedin.com/in/raj-tewari-9a93212a3/", 
                  label: "LinkedIn",
                  icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                },
                { 
                  href: "https://github.com/RajTewari01", 
                  label: "GitHub",
                  icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                },
                { 
                  href: "mailto:mericans24@gmail.com", 
                  label: "Email",
                  icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                },
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target={item.href.startsWith("mailto") ? undefined : "_blank"}
                  rel="noreferrer"
                  style={{
                    padding: "16px 32px", borderRadius: 40,
                    background: "#FFFFFF",
                    color: "#111", fontSize: 15,
                    fontFamily: "var(--font-syne), sans-serif", fontWeight: 600,
                    boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
                    transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                    display: "flex", alignItems: "center", gap: 10,
                  }}
                  onMouseEnter={(e) => { 
                    e.currentTarget.style.transform = "scale(1.05)";
                    e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.1)";
                  }}
                  onMouseLeave={(e) => { 
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.06)";
                  }}
                >
                  {item.icon}
                  {item.label}
                </a>
              ))}
              <a
                href="/hire"
                onClick={(e) => {
                  e.preventDefault();
                  setPopupConfig({
                    title: "",
                    message: "Are you ready to discuss a project and hire me?",
                    href: "/hire",
                    download: false,
                    isGameTrigger: false
                  });
                  setShowPopup(true);
                }}
                style={{
                  padding: "16px 32px", borderRadius: 40,
                  background: "#FFFFFF",
                  color: "#111", fontSize: 15,
                  fontFamily: "var(--font-syne), sans-serif", fontWeight: 600,
                  boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
                  transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                  display: "flex", alignItems: "center", gap: 10,
                  cursor: "pointer"
                }}
                onMouseEnter={(e) => { 
                  e.currentTarget.style.transform = "scale(1.05)";
                  e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.1)";
                }}
                onMouseLeave={(e) => { 
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.06)";
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                Hire Me
              </a>
              <a
                href="/biswadeep_tewari_cv_placeholder.pdf"
                onClick={(e) => {
                  e.preventDefault();
                  setPopupConfig({
                    title: "",
                    message: "Would you like to download my CV?",
                    href: "/biswadeep_tewari_cv_placeholder.pdf",
                    download: true,
                    isGameTrigger: false
                  });
                  setShowPopup(true);
                }}
                style={{
                  padding: "16px 32px", borderRadius: 40,
                  background: "#FFFFFF",
                  color: "#111", fontSize: 15,
                  fontFamily: "var(--font-syne), sans-serif", fontWeight: 600,
                  boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
                  transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                  display: "flex", alignItems: "center", gap: 10,
                  cursor: "pointer"
                }}
                onMouseEnter={(e) => { 
                  e.currentTarget.style.transform = "scale(1.05)";
                  e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.1)";
                }}
                onMouseLeave={(e) => { 
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.06)";
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                Download CV
              </a>
              <a
                href="https://www.buymeacoffee.com/biswadeep"
                target="_blank"
                rel="noreferrer"
                style={{
                  padding: "16px 32px", borderRadius: 40,
                  background: "#FFFFFF",
                  color: "#111", fontSize: 15,
                  fontFamily: "var(--font-syne), sans-serif", fontWeight: 600,
                  boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
                  transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                  display: "flex", alignItems: "center", gap: 10,
                }}
                onMouseEnter={(e) => { 
                  e.currentTarget.style.transform = "scale(1.05)";
                  e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.1)";
                }}
                onMouseLeave={(e) => { 
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.06)";
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                Fund The Build
              </a>
            </motion.div>

            {/* Scroll indicator — hidden on mobile to save space */}
            <div className="fade-in fd4 hidden md:flex" style={{
              alignItems: "center", gap: 10,
              marginTop: 24,
              fontFamily: "monospace", fontSize: 9,
              color: "#888", letterSpacing: "0.2em",
            }}>
              <span>SCROLL TO EXPLORE</span>
              <span style={{ color: "#C9A96E", fontSize: 14 }}>↓</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── S2: SLIDES OVER HERO ── */}
      <div style={{
        position: "relative", height: "100vh",
        background: "#e8f5e9", zIndex: 2, overflow: "hidden",
      }}>
        {/* Diagonal top */}
        <div style={{
          position: "absolute", top: -1, left: 0, right: 0, height: 100,
          background: "#e8f5e9",
          clipPath: "polygon(0 100px, 100% 0, 100% 100%, 0 100%)",
          zIndex: 5,
        }} />

        <div className="flex flex-col md:flex-row" style={{
          height: "100%", alignItems: "center",
        }}>
          {/* Text */}
          {/* Text */}
          <div className="w-full md:w-[55%] pt-[100px] md:pt-[60px]" style={{
            display: "flex", flexDirection: "column",
            justifyContent: "center",
            paddingLeft: "clamp(24px, 6vw, 10vw)",
            paddingRight: "clamp(24px, 6vw, 8vw)",
            paddingBottom: "clamp(32px, 6vw, 60px)",
          }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 10,
              fontFamily: "monospace", fontSize: "clamp(12px, 1.5vw, 15px)", letterSpacing: "0.28em",
              color: "rgba(0,0,0,0.35)", marginBottom: "clamp(12px, 2vw, 22px)",
            }}>
              <span style={{ color: "#C9A96E", fontWeight: 700 }}>01</span>
              <span style={{ width: 40, height: 1, background: "#C9A96E", opacity: 0.5, display: "inline-block" }} />
              <span>THE ARCHITECT</span>
            </div>

            <h2 style={{
              fontFamily: "var(--font-playfair), 'Playfair Display', serif",
              fontSize: "clamp(48px, 6vw, 110px)",
              fontWeight: 700, color: "#111",
              lineHeight: 1.05, letterSpacing: "-0.02em",
              marginBottom: "clamp(20px, 4vw, 40px)",
              wordBreak: "break-word",
            }}>
              Building robust<br />
              <em style={{ fontWeight: 400, color: "#C9A96E" }}>software</em><br />
              layer by layer.
            </h2>

            <p style={{
              fontFamily: "monospace", fontSize: "clamp(15px, 1.8vw, 22px)", color: "#444",
              lineHeight: 1.8, maxWidth: "100%", paddingRight: "4vw",
              borderLeft: "3px solid #C9A96E", paddingLeft: 24,
            }}>
              I build production-grade applications that scale.
              From architecting language model data pipelines and serving computer vision APIs,
              to shipping performant cross-platform mobile apps that users love.
            </p>

            {/* Location info */}
            <div style={{
              marginTop: "clamp(32px, 4vw, 48px)", fontFamily: "monospace",
              fontSize: "clamp(11px, 1.2vw, 14px)", color: "#888", letterSpacing: "0.15em",
            }}>
              <span>Location: IND · Lat: 22.5726° N · Lon: 88.3639° E</span>
            </div>
          </div>

          {/* Image — expansive on mobile, sidebar on desktop */}
          <div className="w-full md:w-auto px-6 md:px-0 mb-12 md:mb-0 relative" style={{
            flex: "0 0 45%",
          }}>
            <style>{`
              .architect-img-wrap { 
                width: 100%; aspect-ratio: 4/3; object-fit: cover; object-position: center; border-radius: 16px; box-shadow: 0 30px 60px rgba(0,0,0,0.15);
              }
              @media (min-width: 768px) {
                .architect-img-wrap { aspect-ratio: auto; height: 100vh; border-radius: 24px 0 0 24px; box-shadow: -20px 0 60px rgba(0,0,0,0.12); margin: 0; }
              }
            `}</style>

            <div className="relative overflow-hidden architect-img-container" style={{
              borderRadius: "16px",
              boxShadow: "0 24px 50px rgba(0,0,0,0.15)",
            }}>
              <style>{`
                @media (min-width: 768px) {
                  .architect-img-container { border-radius: 24px 0 0 24px !important; margin-top: 40px; margin-bottom: 80px; }
                }
              `}</style>
              <Image src="/biswadeep_google.png" alt="Biswadeep Tewari" width={800} height={600}
                className="architect-img-wrap"
              />
              <div style={{
                position: "absolute", inset: 0,
                background: "linear-gradient(135deg, transparent 60%, rgba(0,0,0,0.25))",
                pointerEvents: "none",
              }} />
              <div style={{
                position: "absolute", bottom: 16, left: 16,
                fontFamily: "monospace", fontSize: 8, color: "rgba(255,255,255,0.7)",
                letterSpacing: "0.2em", background: "rgba(0,0,0,0.4)",
                backdropFilter: "blur(12px)", padding: "6px 12px", borderRadius: 4,
              }}>MAKAUT UNIVERSITY</div>
            </div>
          </div>
        </div>

        {/* SVG wave bottom */}
        <svg viewBox="0 0 1440 90" preserveAspectRatio="none" style={{
          position: "absolute", bottom: -1, left: 0, right: 0,
          width: "100%", height: 90, zIndex: 4,
        }}>
          <path d="M0,0 C240,90 720,0 1440,60 L1440,90 L0,90 Z" fill="#e8f5e9" />
        </svg>
      </div>

      <GamifiedPopup
        isOpen={showPopup}
        title={popupConfig.title}
        message={popupConfig.message}
        confirmText="Continue"
        cancelText="Cancel"
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </div>
  );
}
