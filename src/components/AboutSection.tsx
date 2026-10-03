"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// ─── Math utils ────────────────────────────────────────────────────────────
const clamp = (v: number, a: number, b: number) => Math.min(Math.max(v, a), b);
const map = (v: number, a: number, b: number, c: number, d: number) => c + (d - c) * clamp((v - a) / (b - a), 0, 1);
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

const GRAIN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23g)'/%3E%3C/svg%3E")`;

const skills = [
  { group: "Core Languages", tech: ["Python / Cython", "TypeScript", "Dart / Kotlin", "Java", "SQL"] },
  { group: "Artificial Intelligence", tech: ["PyTorch / TensorFlow", "LangChain / LangGraph", "RAG Systems", "Stable Diffusion"] },
  { group: "Architecture & Ops", tech: ["Docker / Kubernetes", "AWS", "FastAPI / Django", "Vector DBs"] },
];

export default function AboutSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const maskWrapRef = useRef<HTMLDivElement>(null);
  const maskRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const [maskP, setMaskP] = useState(0);

  // ─── Scroll-driven mask reveal using element position ─────────────────
  useEffect(() => {
    let raf: number;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        if (!maskWrapRef.current) return;
        const rect = maskWrapRef.current.getBoundingClientRect();
        const vh = window.innerHeight;
        // Progress: 0 when element top hits 80% of viewport,
        //           1 when element top is 20% above viewport top
        const progress = clamp((vh * 0.8 - rect.top) / (vh * 1.0), 0, 1);
        setMaskP(progress);
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // initial calculation
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(raf); };
  }, []);

  // Circle radius: 0 → 150 vmin (matching parallax-demo reference)
  const maskR = map(maskP, 0, 1, 0, 150);

  // ─── GSAP animations ────────────────────────────────────────────────
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Counter animation for stats
      if (statsRef.current) {
        const counters = statsRef.current.querySelectorAll(".stat-number");
        counters.forEach((counter) => {
          const target = parseInt(counter.getAttribute("data-target") || "0");
          gsap.fromTo(
            counter,
            { innerText: "0" },
            {
              innerText: target, duration: 2, ease: "power2.out",
              snap: { innerText: 1 },
              scrollTrigger: { trigger: counter, start: "top 85%" },
            }
          );
        });
      }

      // Skills stagger
      const skillRows = sectionRef.current?.querySelectorAll(".skill-row");
      if (skillRows) {
        gsap.fromTo(
          skillRows,
          { opacity: 0, y: 30, filter: "blur(4px)" },
          {
            opacity: 1, y: 0, filter: "blur(0px)",
            duration: 0.8, stagger: 0.12, ease: "power3.out",
            scrollTrigger: { trigger: skillRows[0], start: "top 85%" },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="about" ref={sectionRef} style={{ position: "relative" }}>
      {/* ═══ EFFECT 2: SVG MASK REVEAL ═══ */}
      <div ref={maskWrapRef} style={{ position: "relative", height: "150vh", overflow: "hidden" }}>
        {/* Base (seen before reveal) */}
        <div style={{
          position: "absolute", inset: 0,
          background: "#e8f5e9",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          {/* Pulsing rings */}
          {[56, 100, 154, 210].map((r, i) => (
            <div key={i} style={{
              position: "absolute",
              width: r, height: r, borderRadius: "50%",
              border: `1px solid rgba(201,169,110,${0.12 - i * 0.025})`,
            }} />
          ))}
          <div style={{
            fontFamily: "var(--font-playfair), 'Playfair Display', serif",
            fontSize: "clamp(72px, 16vw, 180px)",
            fontWeight: 900,
            color: "rgba(255,255,255,0.025)",
            letterSpacing: "-0.05em",
            userSelect: "none",
          }}>ABOUT</div>
        </div>

        {/* ── REVEALED LAYER ── */}
        <div
          ref={maskRef}
          style={{
            position: "absolute", inset: 0,
            clipPath: `circle(${maskR}vmin at 50% 50%)`,
            opacity: map(maskP, 0, 0.05, 0, 1),
            willChange: "clip-path, opacity",
          }}
        >
          {/* Background image */}
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(135deg, #0f2c1f 0%, #17402a 50%, #0a1f15 100%)",
          }} />

          {/* Grid */}
          <div style={{
            position: "absolute", inset: 0, opacity: 0.15,
            backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
            backgroundSize: "55px 55px",
          }} />

          {/* Grain */}
          <div style={{
            position: "absolute", inset: 0,
            backgroundImage: GRAIN, backgroundSize: "240px 240px",
            opacity: 0.1, mixBlendMode: "overlay",
          }} />

          {/* Content */}
          <div style={{
            position: "absolute", inset: 0,
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            padding: "0 24px", textAlign: "center",
            width: "100%", boxSizing: "border-box"
          }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 10,
              fontFamily: "monospace", fontSize: 9, letterSpacing: "0.28em",
              color: "rgba(255,255,255,0.35)", marginBottom: 22,
            }}>
              <span style={{ color: "#C9A96E", fontWeight: 700 }}>02</span>
              <span style={{ width: 28, height: 1, background: "#C9A96E", opacity: 0.5, display: "inline-block" }} />
              <span>THE ARCHITECT</span>
            </div>

            <h2 style={{
              fontFamily: "var(--font-playfair), 'Playfair Display', serif",
              fontSize: "clamp(48px, 10vw, 140px)",
              fontWeight: 700, color: "#fff",
              lineHeight: 1.0, letterSpacing: "-0.025em",
              textShadow: "0 4px 48px rgba(0,0,0,0.6)",
              marginBottom: "clamp(32px, 4vw, 56px)",
              width: "100%",
              overflowWrap: "break-word",
              wordWrap: "break-word",
              hyphens: "auto"
            }}>
              Building<br />
              <em style={{ fontWeight: 400, color: "#C9A96E" }}>Scalable</em><br />
              Software.
            </h2>

            <p style={{
              fontFamily: "monospace", fontSize: "clamp(16px, 1.8vw, 26px)", color: "rgba(255,255,255,0.9)",
              maxWidth: 900, lineHeight: 1.8,
              background: "rgba(0,0,0,0.4)", backdropFilter: "blur(12px)",
              padding: "clamp(24px, 4vw, 48px) clamp(24px, 4vw, 64px)", borderRadius: 16,
              border: "1px solid rgba(255,255,255,0.1)",
            }}>
              I focus on delivering clean, maintainable code and robust system architectures.
              Whether implementing complex AI infrastructure, optimizing backend APIs,
              or building highly responsive user interfaces.
            </p>
          </div>
        </div>

        {/* Wave bottom */}
        <svg viewBox="0 0 1440 90" preserveAspectRatio="none" style={{
          position: "absolute", bottom: -1, left: 0, right: 0,
          width: "100%", height: 90, zIndex: 10,
        }}>
          <path d="M0,60 C480,0 960,90 1440,30 L1440,90 L0,90 Z" fill="#e8f5e9" />
        </svg>
      </div>

      {/* ═══ SKILLS & STATS SECTION ═══ */}
      <div style={{
        background: "#e8f5e9", position: "relative",
        padding: "80px 0 160px", overflow: "hidden",
      }}>
        <div className="w-full max-w-7xl mx-auto px-6 md:px-12">
          
          <div style={{
            display: "flex", alignItems: "center", gap: 10,
            fontFamily: "monospace", fontSize: "clamp(12px, 1.5vw, 15px)", letterSpacing: "0.28em",
            color: "rgba(0,0,0,0.35)", marginBottom: 40,
          }}>
            <span style={{ color: "#C9A96E", fontWeight: 700 }}>03</span>
            <span style={{ width: 40, height: 1, background: "#C9A96E", opacity: 0.5, display: "inline-block" }} />
            <span>METRICS & CAPABILITIES</span>
          </div>

          {/* Top Row: Stats (Bento style) */}
          <div ref={statsRef} className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-6 md:gap-8 mb-8">
            <div style={{
              background: "#ffffff", borderRadius: 24, padding: "clamp(32px, 5vw, 64px)",
              boxShadow: "0 10px 40px rgba(0,0,0,0.04)", border: "1px solid rgba(0,0,0,0.02)",
              display: "flex", flexDirection: "column", justifyContent: "space-between"
            }}>
              <p style={{ fontFamily: "monospace", fontSize: 13, letterSpacing: "0.15em", color: "#888", marginBottom: 24, textTransform: "uppercase" }}>Years Active</p>
              <div>
                <span className="stat-number" data-target="3" style={{
                  fontFamily: "var(--font-playfair), 'Playfair Display', serif",
                  fontSize: "clamp(80px, 12vw, 160px)",
                  fontWeight: 900, color: "#0F172A", lineHeight: 0.9, letterSpacing: "-0.04em"
                }}>0</span>
                <span style={{ fontSize: "clamp(80px, 12vw, 160px)", fontWeight: 900, color: "#C9A96E", fontFamily: "var(--font-playfair), 'Playfair Display', serif" }}>+</span>
              </div>
            </div>
            
            <div style={{
              background: "#ffffff", borderRadius: 24, padding: "clamp(32px, 5vw, 64px)",
              boxShadow: "0 10px 40px rgba(0,0,0,0.04)", border: "1px solid rgba(0,0,0,0.02)",
              display: "flex", flexDirection: "column", justifyContent: "space-between"
            }}>
              <p style={{ fontFamily: "monospace", fontSize: 13, letterSpacing: "0.15em", color: "#888", marginBottom: 24, textTransform: "uppercase" }}>Systems Shipped</p>
              <div>
                <span className="stat-number" data-target="15" style={{
                  fontFamily: "var(--font-playfair), 'Playfair Display', serif",
                  fontSize: "clamp(80px, 12vw, 160px)",
                  fontWeight: 900, color: "#0F172A", lineHeight: 0.9, letterSpacing: "-0.04em"
                }}>0</span>
                <span style={{ fontSize: "clamp(80px, 12vw, 160px)", fontWeight: 900, color: "#C9A96E", fontFamily: "var(--font-playfair), 'Playfair Display', serif" }}>+</span>
              </div>
            </div>
          </div>

          {/* Bottom Row: Image + Skills */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
            {/* Image Bento Card */}
            <div className="col-span-12 md:col-span-5" style={{
              borderRadius: 24, overflow: "hidden",
              position: "relative", minHeight: "400px",
              boxShadow: "0 10px 40px rgba(0,0,0,0.04)",
            }}>
              <Image src="/profile.jpg" alt="Biswadeep Tewari" width={800} height={800}
                style={{ width: "100%", height: "100%", objectFit: "cover", filter: "contrast(1.1) grayscale(0.2)" }}
              />
              <div style={{
                position: "absolute", inset: 0,
                background: "linear-gradient(to top, rgba(15,23,42,0.8) 0%, transparent 40%)",
              }} />
              <div style={{
                position: "absolute", bottom: 24, left: 24, right: 24,
                fontFamily: "monospace", fontSize: 12, color: "rgba(255,255,255,0.9)",
                letterSpacing: "0.1em", textTransform: "uppercase",
              }}>
                Makaut University<br/><span style={{ color: "rgba(255,255,255,0.5)" }}>West Bengal, India</span>
              </div>
            </div>

            {/* Skills Bento Card */}
            <div className="col-span-12 md:col-span-7" style={{
              background: "#ffffff", borderRadius: 24, padding: "clamp(32px, 5vw, 56px)",
              boxShadow: "0 10px 40px rgba(0,0,0,0.04)", border: "1px solid rgba(0,0,0,0.02)",
            }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                {skills.map((s, i) => (
                  <div key={i} className="skill-row" style={{
                    display: "flex", flexDirection: "column", gap: 16,
                    borderBottom: i === skills.length - 1 ? "none" : "1px solid rgba(0,0,0,0.04)", 
                    padding: i === 0 ? "0 0 24px 0" : i === skills.length - 1 ? "24px 0 0 0" : "24px 0",
                  }}>
                    <span style={{
                      fontFamily: "monospace", fontSize: 11, letterSpacing: "0.2em",
                      color: "#888", textTransform: "uppercase",
                    }}>{s.group}</span>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px 20px" }}>
                      {s.tech.map((tech, j) => (
                        <span key={j} style={{
                          fontFamily: "var(--font-playfair), 'Playfair Display', serif",
                          fontSize: "clamp(20px, 2vw, 28px)", fontWeight: 600, color: "#0F172A",
                        }}>{tech}{j !== s.tech.length - 1 ? <span style={{ color: "#E2E8F0", marginLeft: 20, fontWeight: 300 }}>/</span> : ""}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
