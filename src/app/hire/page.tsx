"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import Image from "next/image";

const ThreeCanvas = dynamic(() => import("@/components/ThreeCanvas"), { ssr: false });

export default function HirePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({ name: "", email: "", budget: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".hire-stagger",
        { y: 30, opacity: 0, filter: "blur(10px)" },
        { y: 0, opacity: 1, filter: "blur(0px)", duration: 1, stagger: 0.1, ease: "power3.out", delay: 0.2 }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send message");
      setStatus("success");
      setFormData({ name: "", email: "", budget: "", message: "" });
      setTimeout(() => setStatus("idle"), 5000);
    } catch (err: unknown) {
      console.error(err);
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "An unexpected error occurred");
    }
  };

  return (
    <>
      <ThreeCanvas />
      <div className="fixed inset-0 z-[1] bg-[#e8f5e9]/40 pointer-events-none" />
      <Navbar />

      <main ref={containerRef} className="relative z-10 min-h-[100vh] pt-20 pb-4 px-4 md:px-8 flex flex-col items-center justify-center overflow-hidden">
        <div className="w-full max-w-[1100px] grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 items-center origin-center mt-8">
          
          {/* ─── Left: Copy & Links ─── */}
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-6 hire-stagger">
              <div className="w-1.5 h-1.5 bg-[#C9A96E] rounded-full animate-pulse shadow-[0_0_8px_#C9A96E]" />
              <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#111]/40">Available for Work</p>
            </div>

            <h1 className="hire-stagger font-playfair text-[clamp(32px,5vw,60px)] font-black uppercase tracking-tighter leading-[0.95] text-[#111]">
              Let&apos;s <br/>
              Build <br/>
              <em style={{ color: "#C9A96E", fontStyle: "italic", fontWeight: 400, textTransform: "none" }}>Something</em><br/>
              Incredible.
            </h1>

            <p className="hire-stagger mt-6 text-[#111]/60 font-light leading-relaxed max-w-[400px] text-xs sm:text-sm">
              Need a backend built, a mobile app shipped, or an ML pipeline integrated? I'm open for freelance and contract work. Reach out below or send a message through the form.
            </p>

            {/* Direct Connect */}
            <div className="hire-stagger mt-8 w-full max-w-sm bg-white p-6 rounded-3xl border border-[#111]/10 shadow-lg">
              <div className="flex items-center justify-between border-b border-[#111]/10 pb-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="relative w-10 h-10 rounded-full border border-[#111]/10 overflow-hidden shrink-0">
                    <Image src="/profile.jpg" alt="Profile" width={40} height={40} className="object-cover w-full h-full" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#111] leading-none">Biswadeep Tewari</p>
                    <p className="text-[10px] text-[#C9A96E] font-mono mt-1 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-[#C9A96E] rounded-full animate-pulse" />Available for Work
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2">
                <a href="https://wa.me/916297446078" target="_blank" rel="noreferrer"
                  className="bg-[#f9fafb] hover:bg-[#C9A96E]/10 border border-[#111]/10 hover:border-[#C9A96E] text-[#111]/70 hover:text-[#C9A96E] font-mono uppercase tracking-[0.1em] text-[10px] px-6 py-3 rounded-full transition-all w-full flex justify-center items-center gap-2">
                  Start on WhatsApp
                </a>
                <a href="mailto:mericans24@gmail.com"
                  className="bg-[#f9fafb] hover:bg-[#C9A96E]/10 border border-[#111]/10 hover:border-[#C9A96E] text-[#111]/70 hover:text-[#C9A96E] font-mono uppercase tracking-[0.1em] text-[10px] px-6 py-3 rounded-full transition-all w-full flex justify-center items-center gap-2">
                  Write an email
                </a>
                <a href="https://www.linkedin.com/in/raj-tewari-9a93212a3/" target="_blank" rel="noreferrer"
                  className="bg-[#f9fafb] hover:bg-[#C9A96E]/10 border border-[#111]/10 hover:border-[#C9A96E] text-[#111]/70 hover:text-[#C9A96E] font-mono uppercase tracking-[0.1em] text-[10px] px-6 py-3 rounded-full transition-all w-full flex justify-center items-center gap-2">
                  Connect on LinkedIn
                </a>
              </div>
            </div>
          </div>

          {/* ─── Right: Contact Form ─── */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="relative mt-6 md:mt-0"
          >
            <form onSubmit={handleSubmit} className="relative p-5 sm:p-6 rounded-3xl flex flex-col gap-4 w-full border border-[#111]/10 shadow-lg bg-white">

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label htmlFor="name" className="font-mono text-[10px] tracking-widest uppercase text-[#111]/50 ml-1">Name</label>
                  <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required placeholder="Your Name"
                    className="bg-[#f9fafb] border border-[#111]/10 rounded-lg p-3 text-[#111] text-sm focus:border-[#C9A96E]/50 focus:bg-white outline-none transition-all" />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="email" className="font-mono text-[10px] tracking-widest uppercase text-[#111]/50 ml-1">Email Address</label>
                  <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required placeholder="hello@yourcompany.com"
                    className="bg-[#f9fafb] border border-[#111]/10 rounded-lg p-3 text-[#111] text-sm focus:border-[#C9A96E]/50 focus:bg-white outline-none transition-all" />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="budget" className="font-mono text-[10px] tracking-widest uppercase text-[#111]/50 ml-1">Budget (Optional)</label>
                <input type="text" id="budget" name="budget" value={formData.budget} onChange={handleChange} list="budget-options" placeholder="Select or type your budget"
                  className="bg-[#f9fafb] border border-[#111]/10 rounded-lg p-3 text-[#111] text-sm focus:border-[#C9A96E]/50 focus:bg-white outline-none transition-all" />
                <datalist id="budget-options">
                  <option value="Less than $1,000" />
                  <option value="$1,000 - $5,000" />
                  <option value="$5,000 - $10,000" />
                  <option value="$10,000+" />
                </datalist>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="message" className="font-mono text-[9px] tracking-widest uppercase text-[#111]/50 ml-1">Message</label>
                <textarea id="message" name="message" value={formData.message} onChange={handleChange} required placeholder="Describe your project requirements..." rows={3}
                  className="bg-[#f9fafb] border border-[#111]/10 rounded-lg p-2.5 text-[#111] text-xs focus:border-[#C9A96E]/50 focus:bg-white outline-none transition-all resize-none" />
              </div>

              {status === "error" && (
                <div className="p-2 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-xs font-light">{errorMessage}</div>
              )}
              {status === "success" && (
                <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400 text-xs font-light flex items-center gap-2">
                  <span className="text-base">✓</span> Message sent successfully. I&apos;ll get back to you soon!
                </div>
              )}

              <button type="submit" disabled={status === "loading" || status === "success"}
                className="mt-1 w-full relative overflow-hidden text-[#C9A96E] bg-[#C9A96E]/10 border border-[#C9A96E] font-syne font-bold tracking-[0.2em] py-3 rounded-full transition-all hover:bg-[#C9A96E]/20 hover:shadow-[0_0_30px_rgba(201,169,110,0.15)] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed">
                <span className="relative z-10 block transition-colors duration-300 text-xs">
                  {status === "loading" ? "SENDING..." : status === "success" ? "MESSAGE SENT" : "SEND MESSAGE"}
                </span>
              </button>
            </form>
          </motion.div>
        </div>
      </main>
    </>
  );
}
