"use client";

import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle2, ArrowRight } from "lucide-react";

const problems = [
  {
    issue: "Whistleblowers face severe retaliation or threats to their livelihood.",
    solution: "Zero-knowledge cryptographic anonymity ensures identities are never exposed, making retaliation impossible.",
  },
  {
    issue: "Evidence submitted to traditional portals is often quietly deleted or altered.",
    solution: "Decentralized IPFS storage and blockchain hashing make it physically impossible to alter or destroy evidence.",
  },
  {
    issue: "Agencies indefinitely delay investigations, letting cases die in bureaucracy.",
    solution: "Smart-contract SLAs force action within 15 days, escalating ignored cases to public dashboards automatically.",
  },
  {
    issue: "The public has no visibility into whether justice is actually being served.",
    solution: "Public verifiable ledgers allow citizens to track accountability metrics without compromising sensitive data.",
  }
];

export function ProblemSolvingSection() {
  return (
    <section className="relative w-full max-w-7xl mx-auto py-24 px-6 z-10">
      <div className="text-center mb-16">
        <span className="text-brand-primary font-mono text-[10px] uppercase tracking-[0.4em] font-bold mb-4 block">
          Structural Solutions
        </span>
        <h2 className="text-4xl md:text-5xl font-heading font-black tracking-tight text-text-main mb-4 uppercase">
          Real Problems. <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-amber-500">Solved.</span>
        </h2>
        <p className="text-text-muted max-w-2xl mx-auto text-lg">
          We analyzed the critical failure points of current justice and reporting systems and engineered decentralized solutions for each.
        </p>
      </div>

      <div className="flex flex-col gap-6 max-w-4xl mx-auto">
        {problems.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className="flex flex-col md:flex-row items-stretch bg-white rounded-2xl border border-border-subtle overflow-hidden shadow-sm hover:shadow-md transition-shadow group"
          >
            {/* Problem Side */}
            <div className="flex-1 p-6 md:p-8 bg-slate-50 border-b md:border-b-0 md:border-r border-border-subtle relative">
              <div className="flex items-center gap-3 mb-3 text-red-600/80">
                <AlertTriangle className="w-5 h-5" />
                <h3 className="font-bold text-sm uppercase tracking-wider">The Problem</h3>
              </div>
              <p className="text-text-main font-medium leading-relaxed">
                {item.issue}
              </p>
            </div>

            {/* Transition Arrow (Mobile hidden) */}
            <div className="hidden md:flex items-center justify-center -ml-4 -mr-4 z-10">
              <div className="w-8 h-8 rounded-full bg-white border border-border-subtle flex items-center justify-center text-text-muted shadow-sm">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>

            {/* Solution Side */}
            <div className="flex-1 p-6 md:p-8 bg-brand-primary/5 relative">
              <div className="flex items-center gap-3 mb-3 text-brand-primary">
                <CheckCircle2 className="w-5 h-5" />
                <h3 className="font-bold text-sm uppercase tracking-wider">NyayaSetu Solution</h3>
              </div>
              <p className="text-text-main font-medium leading-relaxed">
                {item.solution}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
