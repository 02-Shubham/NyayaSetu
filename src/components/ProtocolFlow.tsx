"use client";

import { motion } from "framer-motion";
import { Shield, Lock, Database, Cloud, Layout, CheckCircle2, ArrowDown, Activity } from "lucide-react";

const steps = [
    {
        id: "ANON",
        title: "Identity Anonymization",
        desc: "Burner identity initialization via ShadowVault ZK-Mixer.",
        icon: Shield,
    },
    {
        id: "ENC",
        title: "Hybrid Encryption",
        desc: "Payload secured locally using AES-256-GCM + Public-Key Handshake.",
        icon: Lock,
    },
    {
        id: "SYNC",
        title: "IPFS Anchoring",
        desc: "Decentralized distribution of encrypted blocks across nodes.",
        icon: Cloud,
    },
    {
        id: "CHAIN",
        title: "Mutable Ledger Proof",
        desc: "Integrity hash anchored to CivicChain for public verification.",
        icon: Activity,
    }
];
const proofs = [
  { label: "Encryption",   status: "AES_256_GCM_READY",    active: true  },
  { label: "IPFS Gateway", status: "DECENTRALIZED_ACTIVE", active: false },
  { label: "CivicChain",   status: "NODE_STABLE",          active: true  },
];

export function ProtocolFlow() {
    return (
        <div className="w-full space-y-6">
            <div className="flex flex-col gap-6">
                <div className="flex items-center gap-3">
                    <span className="px-2 py-0.5 bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-[8px] font-black uppercase tracking-[0.3em] rounded">
                        Security Intelligence
                    </span>
                    <span className="text-text-muted text-[8px] font-mono tracking-widest uppercase">Protocol_v4.2</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-heading font-black tracking-tighter uppercase text-text-main leading-[0.85]">
                    THE SUBMISSION <br /> <span className="text-brand-primary">ARCHITECTURE</span>
                </h2>
            </div>

            <div className="relative">
                {/* Connection Line */}
                <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-brand-primary/20 via-border-subtle to-transparent" />

                <div className="space-y-12">
                    {steps.map((step, i) => (
                        <motion.div
                            key={step.id}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.15 }}
                            className="relative flex items-start gap-3 group"
                        >
                            <div className="relative z-10 w-16 h-16 rounded-2xl bg-white border border-border-subtle flex items-center justify-center shrink-0 group-hover:border-brand-primary/40 transition-all duration-500 shadow-sm overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <step.icon className={`w-7 h-7 ${i % 2 === 0 ? "text-brand-primary" : "text-text-muted"} group-hover:scale-110 transition-transform`} />
                            </div>

                            <div className="pt-2">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-[10px] font-mono font-bold text-brand-primary/40">0{i + 1}</span>
                                    <h3 className="text-lg font-black uppercase tracking-tight text-text-main group-hover:text-brand-primary transition-colors">
                                        {step.title}
                                    </h3>
                                </div>
                                <p className="text-xs text-text-muted font-light leading-relaxed max-w-[280px]">
                                    {step.desc}
                                </p>

                                {/* Visual Connector Pulse */}
                                {/* {i < steps.length - 1 && (
                                    <motion.div
                                        animate={{ y: [0, 5, 0], opacity: [0.2, 0.5, 0.2] }}
                                        transition={{ repeat: Infinity, duration: 2 }}
                                        className="mt-8 ml-1"
                                    >
                                        <ArrowDown className="w-3 h-3 text-brand-primary/20" />
                                    </motion.div>
                                )} */}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Live Network Proofs */}
      <div className="bg-white border border-border-subtle rounded-2xl overflow-hidden shadow-sm">
        <div className="px-4 py-2.5 border-b border-border-subtle flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-3 h-3 text-brand-primary/50" />
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-text-muted">Live Network Proofs</span>
          </div>
          {/* Pulsing "live" dot */}
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[8px] font-mono text-text-muted/50 uppercase">Live</span>
          </div>
        </div>
        <div className="divide-y divide-border-subtle/60">
          {proofs.map((item, i) => (
            <div key={i} className="flex items-center justify-between px-4 py-2.5">
              <div className="flex items-center gap-2">
                <span className={`w-1 h-1 rounded-full ${item.active ? "bg-brand-primary" : "bg-text-muted/30"}`} />
                <span className="text-[9px] font-mono text-text-muted uppercase">{item.label}</span>
              </div>
              <span className={`text-[9px] font-mono font-black uppercase tracking-tight ${item.active ? "text-brand-primary" : "text-text-main"}`}>
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>
        </div>
    );
}
 
// "use client";

// import { motion } from "framer-motion";
// import { Shield, Lock, Cloud, Activity } from "lucide-react";

// const steps = [
//   { id: "ANON",  title: "Identity Anonymization", desc: "Burner identity via ShadowVault ZK-Mixer.",        icon: Shield   },
//   { id: "ENC",   title: "Hybrid Encryption",       desc: "AES-256-GCM + Public-Key Handshake.",             icon: Lock     },
//   { id: "SYNC",  title: "IPFS Anchoring",           desc: "Encrypted blocks distributed across nodes.",      icon: Cloud    },
//   { id: "CHAIN", title: "Ledger Proof",             desc: "Integrity hash anchored to CivicChain.",          icon: Activity },
// ];

// const proofs = [
//   { label: "Encryption",   status: "AES_256_GCM_READY",    active: true  },
//   { label: "IPFS Gateway", status: "DECENTRALIZED_ACTIVE", active: false },
//   { label: "CivicChain",   status: "NODE_STABLE",          active: true  },
// ];

// export function ProtocolFlow() {
//   return (
//     <div className="w-full h-full flex flex-col gap-6">

//       {/* Header */}
//       <div className="space-y-3">
//         <div className="flex items-center gap-2">
//           <span className="px-2 py-0.5 bg-brand-primary/8 border border-brand-primary/15 text-brand-primary text-[8px] font-black uppercase tracking-[0.28em] rounded-md">
//             Security Intelligence
//           </span>
//           <span className="text-text-muted text-[8px] font-mono tracking-widest uppercase opacity-60">Protocol_v4.2</span>
//         </div>
//         <div>
//           <p className="text-3xl uppercase font-bold font-heading ">Submission</p>
//           <h2 className="text-4xl font-heading font-black tracking-tight text-text-main leading-none">
//             Architecture
//             <span className="text-brand-primary">.</span>
//           </h2>
//         </div>
//       </div>

//       {/* Steps — unified card */}
//       <div className="flex-1 bg-white border border-border-subtle rounded-2xl overflow-hidden shadow-sm">
//         {steps.map((step, i) => (
//           <motion.div
//             key={step.id}
//             initial={{ opacity: 0, x: -10 }}
//             whileInView={{ opacity: 1, x: 0 }}
//             viewport={{ once: true }}
//             transition={{ delay: i * 0.08 }}
//             className={`flex items-center gap-3.5 px-4 py-3.5 group hover:bg-brand-primary/[0.03] transition-colors cursor-default
//               ${i < steps.length - 1 ? "border-b border-border-subtle" : ""}`}
//           >
//             {/* Step number + icon combined */}
//             <div className="relative shrink-0">
//               <div className="w-9 h-9 rounded-xl bg-bg-page border border-border-subtle flex items-center justify-center group-hover:border-brand-primary/30 group-hover:bg-brand-primary/5 transition-all">
//                 <step.icon className={`w-4 h-4 ${i % 2 === 0 ? "text-brand-primary" : "text-text-muted/60"} transition-colors`} />
//               </div>
//               <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-white border border-border-subtle text-[6px] font-black text-text-muted flex items-center justify-center leading-none">
//                 {i + 1}
//               </span>
//             </div>

//             {/* Text */}
//             <div className="flex-1 min-w-0">
//               <h3 className="text-[11px] font-bold text-text-main tracking-tight group-hover:text-brand-primary transition-colors leading-none mb-0.5">
//                 {step.title}
//               </h3>
//               <p className="text-[10px] text-text-muted font-light leading-snug truncate">{step.desc}</p>
//             </div>

//             {/* ID tag */}
//             <span className="text-[8px] font-mono text-text-muted/30 uppercase tracking-widest shrink-0">{step.id}</span>
//           </motion.div>
//         ))}
//       </div>

    //   {/* Live Network Proofs */}
    //   <div className="bg-white border border-border-subtle rounded-2xl overflow-hidden shadow-sm">
    //     <div className="px-4 py-2.5 border-b border-border-subtle flex items-center justify-between">
    //       <div className="flex items-center gap-2">
    //         <Activity className="w-3 h-3 text-brand-primary/50" />
    //         <span className="text-[9px] font-black uppercase tracking-[0.2em] text-text-muted">Live Network Proofs</span>
    //       </div>
    //       {/* Pulsing "live" dot */}
    //       <div className="flex items-center gap-1.5">
    //         <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
    //         <span className="text-[8px] font-mono text-text-muted/50 uppercase">Live</span>
    //       </div>
    //     </div>
    //     <div className="divide-y divide-border-subtle/60">
    //       {proofs.map((item, i) => (
    //         <div key={i} className="flex items-center justify-between px-4 py-2.5">
    //           <div className="flex items-center gap-2">
    //             <span className={`w-1 h-1 rounded-full ${item.active ? "bg-brand-primary" : "bg-text-muted/30"}`} />
    //             <span className="text-[9px] font-mono text-text-muted uppercase">{item.label}</span>
    //           </div>
    //           <span className={`text-[9px] font-mono font-black uppercase tracking-tight ${item.active ? "text-brand-primary" : "text-text-main"}`}>
    //             {item.status}
    //           </span>
    //         </div>
    //       ))}
    //     </div>
    //   </div>

//       {/* Disclaimer */}
//       <p className="text-[8px] text-text-muted/50 font-mono uppercase leading-relaxed">
//         * Encrypted client-side. Operators have zero access to raw payloads.
//       </p>
//     </div>
//   );
// }

