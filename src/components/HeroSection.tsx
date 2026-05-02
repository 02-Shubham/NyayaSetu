"use client";

import { motion } from "framer-motion";
import { Shield, Lock, Activity, ArrowRight, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useState, useRef, MouseEvent } from "react";

export function HeroSection() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const handleMouseMove = (e: MouseEvent<HTMLElement>) => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };
  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className="relative w-full min-h-[95vh] flex flex-col items-center justify-center overflow-hidden pt-20 pb-16">

      {/* Background Glows */}
      <div 
        className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-700"
        style={{
          opacity: isHovering ? 1 : 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='69' viewBox='0 0 40 69' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%236366f1' fill-opacity='0.15' fill-rule='evenodd'%3E%3Cpath d='M20 13.84l18.45 10.65v21.3L20 56.44 1.55 45.79v-21.3L20 13.84zM3.45 26.9v15.2l16.55 9.55 16.55-9.55v-15.2L20 17.35 3.45 26.9zM0 21.3l18.45-10.65V0h-3v8.52L0 17.84v3.46zm0 26.4L18.45 58.35v10.65h-3V60.48L0 51.16v-3.46zM21.55 0v10.65L40 21.3h-3v-3.46l-15.45-8.92V0h-3zm0 69v-10.65L40 47.7h-3v3.46l-15.45 8.92V69h-3z'/%3E%3C/g%3E%3C/svg%3E")`,
          maskImage: `radial-gradient(400px circle at ${mousePosition.x}px ${mousePosition.y}px, black, transparent)`,
          WebkitMaskImage: `radial-gradient(400px circle at ${mousePosition.x}px ${mousePosition.y}px, black, transparent)`
        }}
      />

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.75, ease: "easeOut" }}
        className="relative z-10 flex flex-col items-center text-center w-full max-w-4xl px-6"
      >

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15, duration: 0.45 }}
          className="inline-flex items-center gap-2.5 px-4 py-2 mb-10 bg-white border border-border-subtle rounded-full shadow-sm cursor-default group hover:shadow-md transition-shadow"
        >
          <div className="w-6 h-6 rounded-full bg-brand-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Shield className="w-3.5 h-3.5 text-brand-primary" />
          </div>
          <span className="text-text-main font-semibold text-xs tracking-wide flex items-center gap-1">
            The Decentralized Justice Registry
            <ChevronRight className="w-3 h-3 text-text-muted" />
          </span>
        </motion.div>

        {/* Headline */}
        <h1 className="text-[clamp(2.8rem,7vw,5.25rem)] font-heading font-black tracking-tighter leading-[1.04] mb-7 text-text-main">
          Silence is broken.{" "}
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary via-brand-secondary to-indigo-600">
            Truth is immutable.
          </span>
        </h1>

        {/* Subheadline */}
        <p className="text-base md:text-lg text-text-muted font-normal leading-relaxed max-w-xl mb-12">
          NyayaSetu provides a mathematically guaranteed, zero-trust infrastructure
          to protect whistleblowers, anchor evidence on-chain, and force accountability.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto mb-20">
          <Link href="/submit" className="w-full sm:w-auto">
            <button className="w-full sm:w-auto group flex items-center justify-center gap-2.5 px-7 py-4 bg-text-main text-white text-xs font-bold uppercase tracking-widest rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 hover:bg-black transition-all duration-200">
              <Lock className="w-3.5 h-3.5 shrink-0" />
              Submit Secure Report
              <ArrowRight className="w-3.5 h-3.5 shrink-0 group-hover:translate-x-0.5 transition-transform duration-150" />
            </button>
          </Link>
          <Link href="/ledger" className="w-full sm:w-auto">
            <button className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-7 py-4 bg-white border border-border-subtle text-xs font-bold uppercase tracking-widest text-text-main rounded-xl shadow-sm hover:shadow-md hover:border-brand-primary/40 hover:-translate-y-0.5 hover:bg-slate-50 transition-all duration-200">
              <Activity className="w-3.5 h-3.5 text-brand-primary shrink-0" />
              Access Public Ledger
            </button>
          </Link>
        </div>

        {/* Trust Indicators */}
        <div className="w-full flex flex-wrap justify-center items-center gap-x-8 gap-y-3 pt-8 border-t border-border-subtle/60">
          {[
            { color: "bg-emerald-500", label: "AES-256 Encryption" },
            { color: "bg-brand-primary", label: "Decentralized IPFS" },
            { color: "bg-indigo-500", label: "Smart Contract SLAs" },
          ].map(({ color, label }) => (
            <div key={label} className="flex items-center gap-2">
              <div className={`w-1.5 h-1.5 rounded-full ${color} animate-pulse`} />
              <span className="text-[11px] font-semibold text-text-muted uppercase tracking-widest">
                {label}
              </span>
            </div>
          ))}
        </div>

      </motion.div>
    </section>
  );
}