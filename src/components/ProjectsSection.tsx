"use client";

import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, AnimatePresence } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

// Old background: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=1600&q=85&auto=format&fit=crop"
const IMG_PARALLAX = "https://images.unsplash.com/photo-1695659867860-9133ca6fb6b9?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

import { supabase, Project } from "@/lib/supabase";

// Fallback projects if DB is empty or unreachable
const fallbackProjects: Project[] = [
  {
    id: "1",
    name: "Spatial Tracer",
    description: "Real-time object tracking with PyTorch and OpenCV. Handles spatial point mapping at 60fps with sub-centimeter precision.",
    github_url: "https://github.com/RajTewari01/spatial_tracer",
    created_at: "",
  },
  {
    id: "2",
    name: "Portfolio",
    description: "This site. Built with Next.js 16, GSAP scroll animations, and parallax effects. Pulls data from Supabase.",
    github_url: "https://github.com/RajTewari01/portfolio",
    created_at: "",
  },
  {
    id: "3",
    name: "LeetCode Grind",
    description: "My DSA solutions — arrays, trees, graphs, DP. Clean implementations with time/space analysis.",
    github_url: "https://github.com/RajTewari01/leetcode",
    created_at: "",
  },
  {
    id: "4",
    name: "Neural Citadel",
    description: "Multi-model AI platform that runs on a 4GB GPU. Uses subprocess isolation to manage VRAM across 12 services and 60+ model of different kinds.",
    github_url: "https://github.com/RajTewari01/neural_citadel",
    created_at: "",
  },
];

// ─── Math utils ─────────────────────────────────────────────────────────
const clamp = (v: number, a: number, b: number) => Math.min(Math.max(v, a), b);
const mapR = (v: number, a: number, b: number, c: number, d: number) => c + (d - c) * clamp((v - a) / (b - a), 0, 1);

export default function ProjectsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLHeadingElement>(null);
  const [scrollY, setScrollY] = useState(0);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ─── Fetch from Supabase ─────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        const { data, error } = await supabase.from("projects").select("*").order("created_at", { ascending: false });
        if (error) throw error;
        if (data && data.length > 0) {
          setProjects(data as Project[]);
        } else {
          setProjects(fallbackProjects);
        }
      } catch {
        setProjects(fallbackProjects);
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header scale reveal
      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current,
          { scale: 0.6, opacity: 0.3, filter: "blur(8px)" },
          {
            scale: 1, opacity: 1, filter: "blur(0px)",
            ease: "none",
            scrollTrigger: {
              trigger: headerRef.current,
              start: "top 90%", end: "top 40%",
              scrub: 1.5,
            },
          }
        );
      }

      // Project cards stagger
      const cards = sectionRef.current?.querySelectorAll(".project-row");
      if (cards) {
        cards.forEach((card, i) => {
          gsap.fromTo(card,
            { opacity: 0, y: 60, x: i % 2 === 0 ? -30 : 30, filter: "blur(6px)", rotateY: i % 2 === 0 ? -3 : 3 },
            {
              opacity: 1, y: 0, x: 0, filter: "blur(0px)", rotateY: 0,
              duration: 1.2, ease: "expo.out",
              scrollTrigger: { trigger: card, start: "top 85%", toggleActions: "play none none none" },
            }
          );
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // ─── Parallax background calculation ─────────────────────────────────
  const vh = typeof window !== "undefined" ? window.innerHeight : 800;
  const sectionTop = vh * 4.5; // approximate position
  const bgY = mapR(scrollY, sectionTop - vh, sectionTop + vh * 2, 0, -220);

  return (
    <section id="work" ref={sectionRef} style={{
      position: "relative", minHeight: "100vh",
      background: "linear-gradient(135deg, #0f2c1f 0%, #17402a 50%, #0a1f15 100%)", overflow: "hidden",
    }}>
      {/* ── TOP WAVE from About section (cream curves into image) ── */}
      <svg viewBox="0 0 1440 90" preserveAspectRatio="none" style={{
        position: "absolute", top: -1, left: 0, right: 0,
        width: "100%", height: 90, zIndex: 10,
      }}>
        <path d="M0,0 L1440,0 L1440,60 C1080,0 360,90 0,30 Z" fill="#e8f5e9" />
      </svg>
      {/* ── GRID BG ── */}
      <div style={{
        position: "absolute", inset: 0, opacity: 0.15,
        backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
        backgroundSize: "55px 55px",
        pointerEvents: "none",
      }} />

      {/* Warm tint */}
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse 100% 60% at 70% 50%, rgba(201,169,110,0.05), transparent 70%)",
      }} />

      {/* Grain */}
      <div style={{
        position: "absolute", inset: 0, opacity: 0.08,
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23g)'/%3E%3C/svg%3E")`,
        backgroundSize: "220px 220px", pointerEvents: "none",
      }} />

      {/* Content */}
      <div className="section-pad-x" style={{ position: "relative", zIndex: 2, paddingTop: "15vh", paddingBottom: "10vh" }}>
        {/* Header */}
        <div style={{ marginBottom: 80 }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 10,
            fontFamily: "monospace", fontSize: 9, letterSpacing: "0.28em",
            color: "rgba(255,255,255,0.35)", marginBottom: 16,
          }}>
            <span style={{ color: "#C9A96E", fontWeight: 700 }}>03</span>
            <span style={{ width: 28, height: 1, background: "#C9A96E", opacity: 0.5, display: "inline-block" }} />
            <span>SELECTED ARCHIVES</span>
          </div>

          <h2
            ref={headerRef}
            style={{
              fontFamily: "var(--font-playfair), serif",
              fontSize: "clamp(54px, 11vw, 140px)",
              fontWeight: 700, letterSpacing: "-0.02em",
              lineHeight: 0.95,
              transformOrigin: "left center",
              textShadow: "0 10px 40px rgba(0,0,0,0.5)",
            }}
          >
            <div style={{ color: "#ffffff" }}>Selected</div>
            <div style={{ color: "#C9A96E", fontStyle: "italic" }}>Projects.</div>
          </h2>

          <p style={{
            marginTop: 24, maxWidth: 480,
            fontFamily: "monospace", fontSize: 12, color: "rgba(255,255,255,0.7)",
            lineHeight: 1.8,
          }}>
            A few things I've built and shipped. Backend-heavy systems, ML pipelines, and the occasional frontend that doesn't look like it was made in 2012.
          </p>
        </div>

        {/* Project List */}
        <div style={{ display: "flex", flexDirection: "column", gap: 0, perspective: 1200 }}>
          {projects.map((p, index) => (
            <a
              key={p.id}
              href={p.github_url}
              target="_blank"
              className="project-row grid grid-cols-[40px_1fr_40px] md:grid-cols-[60px_1fr_1fr_60px] gap-x-4 md:gap-x-8 gap-y-3 items-start md:items-center cursor-pointer"
              style={{
                padding: "28px 24px", position: "relative",
                textDecoration: "none", color: "inherit",
                borderTop: index === 0 ? "1px solid rgba(255,255,255,0.1)" : "none", // Only top border on first item to avoid weirdness with pills
                borderBottom: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 40, // Cylindrical hover
                transition: "all 0.5s",
              }}
              onClick={(e) => {
                e.preventDefault();
                setRedirectUrl(p.github_url);
                setTimeout(() => {
                  window.location.href = p.github_url;
                }, 1200);
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
            >
              <span style={{
                fontFamily: "monospace", fontSize: 12, color: "#fff",
                background: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)",
                padding: "6px 10px", borderRadius: 6, border: "1px solid rgba(255,255,255,0.1)",
                textAlign: "center",
              }}>0{index + 1}</span>

              <h3 className="col-start-2 col-end-3 md:col-start-2 md:col-end-3" style={{
                fontFamily: "var(--font-syne), sans-serif",
                fontSize: "clamp(22px, 4vw, 52px)",
                fontWeight: 800, letterSpacing: "-0.04em",
                textTransform: "uppercase", color: "#fff",
                lineHeight: 0.9, transition: "transform 0.5s",
                wordBreak: "break-word",
              }}>{p.name}</h3>

              <p className="col-start-2 col-end-4 md:col-start-3 md:col-end-4" style={{
                fontSize: "clamp(11px, 1.5vw, 13px)", color: "rgba(255,255,255,0.7)", fontWeight: 400,
                lineHeight: 1.7,
                background: "rgba(0,0,0,0.4)",
                backdropFilter: "blur(4px)",
                padding: "14px 18px", borderRadius: 10,
                border: "1px solid rgba(255,255,255,0.1)",
                boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
              }}>{p.description}</p>

              <div className="col-start-3 col-end-4 md:col-start-4 md:col-end-5 justify-self-end" style={{
                width: 36, height: 36, borderRadius: "50%",
                border: "1px solid rgba(201,169,110,0.4)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 16, fontWeight: 700, color: "#C9A96E",
                transition: "all 0.5s", transform: "rotate(-45deg)",
              }}>→</div>
            </a>
          ))}
        </div>
      </div>

      {/* Curved wave bottom */}
      <svg viewBox="0 0 1440 90" preserveAspectRatio="none" style={{
        position: "absolute", bottom: -1, left: 0, right: 0,
        width: "100%", height: 90, zIndex: 10,
      }}>
        <path d="M0,45 C600,0 840,90 1440,45 L1440,90 L0,90 Z" fill="#e8f5e9" />
      </svg>

      {/* Redirecting Overlay */}
      <AnimatePresence>
        {redirectUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0a1f15]/95 backdrop-blur-md"
          >
            <style>{`
              @keyframes boyArmWave {
                0% { transform: rotate(0); }
                2.5% { transform: rotate(15deg); }
                7.5% { transform: rotate(-15deg); }
                12.5% { transform: rotate(15deg); }
                17.5% { transform: rotate(-15deg); }
                20% { transform: rotate(0); }
                100% { transform: rotate(0); }
              }
              @keyframes dotBlink {
                0% { opacity: 0; }
                20% { opacity: 1; }
                100% { opacity: 1; }
              }
            `}</style>
            <div className="w-full max-w-sm flex flex-col items-center md:scale-125 lg:scale-[1.4] transform-gpu origin-center">
              {/* Mascot Avatar */}
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
                      animation: 'boyArmWave 3s infinite ease-in-out'
                    }}
                  />
                </div>
              </div>

              {/* Bubble Message */}
              <div className="bg-[#111111] rounded-full px-8 py-4 mb-8 shadow-2xl relative border-2 border-[#C9A96E] w-auto inline-block max-w-[95%]">
                <p className="text-white text-center font-bold text-[17px] tracking-wide flex justify-center items-center gap-[2px]" style={{ fontFamily: "'Comic Neue', cursive" }}>
                  Redirecting
                  <span style={{ animation: "dotBlink 1.5s infinite" }}>.</span>
                  <span style={{ animation: "dotBlink 1.5s infinite", animationDelay: "0.2s" }}>.</span>
                  <span style={{ animation: "dotBlink 1.5s infinite", animationDelay: "0.4s" }}>.</span>
                </p>
                {/* Little triangle pointing to avatar */}
                <div 
                  className="absolute w-[16px] h-[12px] -top-[12px] left-1/2 -translate-x-1/2"
                  style={{
                    background: `url("data:image/svg+xml,%3Csvg width='16' height='12' viewBox='0 0 16 12' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M8 0L0 12H16L8 0Z' fill='%23C9A96E'/%3E%3Cpath d='M8 3L2.5 12H13.5L8 3Z' fill='%23111111'/%3E%3C/svg%3E") no-repeat center/contain`
                  }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
