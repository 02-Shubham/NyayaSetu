"use client";

import { motion } from "framer-motion";
import { ShieldCheck, UserCheck, Network, FileCode2 } from "lucide-react";

const features = [
  {
    id: "01",
    icon: ShieldCheck,
    title: "100% Tamper-Proof Evidence",
    description: "Unlike standard databases where admins can silently edit or delete records, NyayaSetu anchors all evidence to an immutable blockchain. Once submitted, no one — not even we — can erase the truth.",
  },
  {
    id: "02",
    icon: UserCheck,
    title: "Mathematical Anonymity",
    description: "We do not just promise privacy — we guarantee it mathematically using AES-256 and zero-knowledge proofs. Your identity is structurally decoupled from your report at the protocol level.",
  },
  {
    id: "03",
    icon: Network,
    title: "Decentralised Infrastructure",
    description: "By utilising decentralised storage (IPFS), the platform has no single point of failure. It cannot be taken down by malicious actors, corrupt officials, or political pressure from any quarter.",
  },
  {
    id: "04",
    icon: FileCode2,
    title: "Automated Justice via Smart Contracts",
    description: "We eliminate the human bottleneck entirely. Smart contracts automatically enforce deadlines and publicly escalate unaddressed reports — no waiting, no begging, no delays.",
  }
];

export function WhyBestSection() {
  return (
    <section className="relative w-full max-w-[1200px] mx-auto min-h-[90vh] flex flex-col justify-center py-12 px-6 z-10">
      
      {/* Header Area */}
      <div className="mb-12 max-w-3xl">
        <h2 className="text-4xl md:text-5xl font-heading font-black tracking-tight text-text-main mb-4 leading-[1.1]">
          The Architecture <br className="hidden md:block" /> of True Accountability
        </h2>
        <p className="text-text-muted text-lg font-medium leading-relaxed">
          Traditional reporting portals are centralised black boxes. NyayaSetu replaces blind trust with cryptographic guarantees — engineering justice at the protocol level.
        </p>
      </div>

      {/* Grid Area */}
      <div className="grid grid-cols-1 md:grid-cols-2 border border-border-subtle rounded-[2rem] bg-white shadow-sm overflow-hidden">
        {features.map((feature, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1, duration: 0.5 }}
            className={`p-8 md:p-10 flex flex-col items-start hover:bg-brand-primary/[0.02] transition-colors duration-500 ${
              idx === 0 ? "border-b md:border-r border-border-subtle" :
              idx === 1 ? "border-b border-border-subtle" :
              idx === 2 ? "border-b md:border-b-0 md:border-r border-border-subtle" :
              ""
            }`}
          >
            {/* Number Indicator */}
            <span className="text-brand-primary font-mono text-sm font-bold tracking-widest mb-4">
              {feature.id}
            </span>
            
            {/* Icon Container */}
            <div className="w-12 h-12 bg-brand-primary/10 border border-brand-primary/20 rounded-2xl flex items-center justify-center mb-6">
              <feature.icon className="w-5 h-5 text-brand-primary" />
            </div>
            
            {/* Title & Desc */}
            <h3 className="text-lg md:text-xl font-bold text-text-main mb-3 tracking-tight">
              {feature.title}
            </h3>
            <p className="text-sm md:text-base text-text-muted leading-relaxed">
              {feature.description}
            </p>
          </motion.div>
        ))}
      </div>
      
    </section>
  );
}
