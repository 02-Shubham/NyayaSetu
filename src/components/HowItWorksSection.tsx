"use client";

import { motion } from "framer-motion";
import { UploadCloud, Link as LinkIcon, Timer, Eye, ArrowRight } from "lucide-react";

const steps = [
  {
    id: "01",
    title: "Secure Evidence Upload",
    description: "Submit reports anonymously through an AES-256 encrypted tunnel, stripping all metadata and protecting your identity.",
    icon: UploadCloud,
    color: "text-blue-500",
    bg: "bg-blue-500/10"
  },
  {
    id: "02",
    title: "Blockchain Anchoring",
    description: "The evidence is cryptographically hashed and anchored to a decentralized ledger. It cannot be altered, deleted, or suppressed.",
    icon: LinkIcon,
    color: "text-indigo-500",
    bg: "bg-indigo-500/10"
  },
  {
    id: "03",
    title: "Enforced SLA Deadlines",
    description: "Smart contracts assign the case to authorities with a strict 15-day resolution window, forcing timely government action.",
    icon: Timer,
    color: "text-amber-500",
    bg: "bg-amber-500/10"
  },
  {
    id: "04",
    title: "Public Escalation",
    description: "If authorities fail to act within the SLA, a zero-knowledge proof of the incident automatically escalates to a public dashboard.",
    icon: Eye,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10"
  }
];

export function HowItWorksSection() {
  return (
    <section className="relative w-full max-w-7xl mx-auto py-24 px-6 z-10">
      <div className="flex flex-col items-center mb-20 text-center">
        <span className="text-brand-primary font-mono text-[10px] uppercase tracking-[0.4em] font-bold mb-4">
          Protocol Workflow
        </span>
        <h2 className="text-4xl md:text-6xl font-heading font-black tracking-tight text-text-main mb-6 uppercase">
          How <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-secondary">NyayaSetu</span> Works
        </h2>
        <p className="text-text-muted max-w-2xl font-normal leading-relaxed text-lg">
          A seamless pipeline from secure submission to guaranteed accountability. 
          The protocol ensures that truth can never be silenced or ignored by bureaucratic friction.
        </p>
      </div>

      <div className="relative">
        {/* Connection Line */}
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-border-subtle -translate-y-1/2 hidden lg:block z-0" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.6 }}
              className="relative bg-white border border-border-subtle rounded-3xl p-8 hover:shadow-2xl hover:shadow-brand-primary/5 transition-all duration-500 group"
            >
              <div className="font-heading absolute -top-4 -right-4 text-6xl font-black text-slate-300 group-hover:text-slate-900 transition-colors z-0 select-none">
                {step.id}
              </div>
              
              <div className="relative z-10">
                <div className={`w-14 h-14 ${step.bg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}>
                  <step.icon className={`w-6 h-6 ${step.color}`} />
                </div>
                
                <h3 className="text-xl font-bold text-text-main mb-4 group-hover:text-brand-primary transition-colors">
                  {step.title}
                </h3>
                
                <p className="text-sm text-text-muted leading-relaxed">
                  {step.description}
                </p>
              </div>

              {index < steps.length - 1 && (
                <div className="absolute top-1/2 -right-6 -translate-y-1/2 hidden lg:flex items-center justify-center w-8 h-8 bg-white border border-border-subtle rounded-full z-20 text-brand-primary shadow-sm">
                  <ArrowRight className="w-4 h-4" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
