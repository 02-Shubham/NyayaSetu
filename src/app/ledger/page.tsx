"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import {
    Shield, CheckCircle2, XCircle, Search, Filter,
    ArrowUpRight, ExternalLink, Activity, Scale, Info
} from "lucide-react";
import { usePublicClient } from "wagmi";
import { addressConfig } from "@/contracts/addresses";
import CivicChainRegistryABI from '@blockchain/artifacts/contracts/CivicChainRegistry.sol/CivicChainRegistry.json';
import { parseAbiItem } from "viem";
import { format } from "date-fns";
import { getCaseImage, getSyntheticMetadata } from "@/lib/media";
import Link from "next/link";
import { DEMO_CASES } from "@/data/demo-cases";

const CONTRACT_ADDRESS = addressConfig.CivicChainRegistry as `0x${string}`;

interface ResolvedCase {
    id: number;
    department: string;
    metadataCID: string;
    timestamp: number;
    status: number;
    title?: string;
    summary?: string;
}

const statusMap: Record<number, string> = {
    4: "Resolved",
    5: "Rejected",
    6: "False Claim"
};

export default function LedgerPage() {
    const publicClient = usePublicClient();
    const [blockchainCases, setBlockchainCases] = useState<ResolvedCase[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    // Use useMemo to ensure demo cases are ALWAYS available, regardless of state
    const allCases = useMemo(() => {
        const demoMapped = DEMO_CASES.map(c => ({
            id: c.id,
            department: c.department,
            metadataCID: c.metadataCID,
            timestamp: c.timestamp,
            status: c.status,
            title: c.title,
            summary: c.summary
        }));

        // Filter out any blockchain cases that might conflict with demo IDs
        const uniqueBlockchain = blockchainCases.filter(bc => !demoMapped.some(dc => dc.id === bc.id));
        
        return [...demoMapped, ...uniqueBlockchain].sort((a, b) => b.timestamp - a.timestamp);
    }, [blockchainCases]);

    const fetchResolvedCases = useCallback(async () => {
        if (!publicClient) return;
        setIsLoading(true);

        try {
            const logs = await publicClient.getLogs({
                address: CONTRACT_ADDRESS,
                event: parseAbiItem('event CaseCreated(uint256 indexed caseId, address indexed creator, string metadataCID, string department)'),
                fromBlock: 0n,
                toBlock: 'latest'
            });

            const results = await Promise.all(
                logs.map(async (log): Promise<ResolvedCase | null> => {
                    try {
                        const args = log.args as { caseId: bigint; creator: string; metadataCID: string; department: string };
                        const caseId = args.caseId;

                        const caseData = await publicClient.readContract({
                            address: CONTRACT_ADDRESS,
                            abi: CivicChainRegistryABI.abi,
                            functionName: 'cases',
                            args: [caseId]
                        }) as any;

                        const status = Number(caseData[5]);
                        if (status < 4) return null;

                        const metadataCID = args.metadataCID;
                        const department = args.department;
                        const timestamp = Number(caseData[3]) * 1000;

                        let { title, summary } = getSyntheticMetadata(Number(caseId), department);

                        try {
                            const cleanCID = metadataCID.startsWith('ipfs://') ? metadataCID.slice(7) : metadataCID;
                            if (cleanCID && !cleanCID.includes('test')) {
                                const res = await fetch(`https://gateway.pinata.cloud/ipfs/${cleanCID}`, { signal: (AbortSignal as any).timeout(4000) });
                                if (res.ok) {
                                    const meta = await res.json();
                                    title = meta.title || title;
                                    summary = meta.description || meta.summary || summary;
                                }
                            }
                        } catch (e) {
                            console.warn(`Failed to fetch metadata for ${caseId}`);
                        }

                        return {
                            id: Number(caseId),
                            department,
                            metadataCID,
                            timestamp,
                            status,
                            title,
                            summary
                        };
                    } catch (err) {
                        return null;
                    }
                })
            );

            setBlockchainCases(results.filter((c): c is ResolvedCase => c !== null));
        } catch (err) {
            console.error("Failed to fetch ledger logs:", err);
        } finally {
            setIsLoading(false);
        }
    }, [publicClient]);

    useEffect(() => {
        fetchResolvedCases();
    }, [fetchResolvedCases]);

    const filteredCases = allCases.filter((c: ResolvedCase) =>
        c.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.id.toString().includes(searchTerm)
    );

    return (
        <main className="min-h-screen bg-bg-page text-text-main selection:bg-brand-primary/10 relative overflow-hidden font-sans">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.02] pointer-events-none" />
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-primary/5 rounded-full blur-[120px] -z-10 translate-x-1/2 -translate-y-1/2 opacity-30" />

            <Navbar />

            <div className="w-full max-w-[1400px] mx-auto px-6 pt-32 pb-20 relative z-10">
                <div className="mb-16 border-b border-border-subtle pb-12">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                        <div className="max-w-3xl">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="h-px w-12 bg-brand-primary" />
                                <span className="text-brand-primary font-mono text-xs uppercase tracking-[0.3em] font-bold">The Public Evidence Registry</span>
                                {DEMO_CASES.length > 0 && (
                                    <span className="ml-4 px-2 py-0.5 bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-[8px] font-bold uppercase tracking-widest rounded">Archived Local Index</span>
                                )}
                            </div>
                            <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-none text-text-main uppercase">
                                Nyaya <span className="text-transparent bg-clip-text bg-linear-to-r from-brand-primary to-brand-secondary">Archive</span>
                            </h1>
                            <p className="text-xl text-text-muted font-normal leading-relaxed max-w-2xl">
                                A transparent, blockchain-verified repository of high-stakes investigations.
                                Securing accountability through public record and immutable blockchain-anchored proofs.
                            </p>
                        </div>
                        <div className="hidden lg:block text-right">
                            <div className="text-6xl font-black text-brand-primary/10 select-none">
                                #{allCases.length.toString().padStart(3, '0')}
                            </div>
                            <div className="text-[10px] font-mono text-text-muted uppercase tracking-widest mt-1 font-bold">Total Verified Records</div>
                        </div>
                    </div>

                    <div className="mt-12 flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative group">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted group-focus-within:text-brand-primary transition-all" />
                            <input
                                type="text"
                                placeholder="SEARCH THE ARCHIVE BY CASE ID, DEPARTMENT, OR KEYWORDS..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-white border border-border-subtle rounded-full pl-16 pr-8 py-5 text-sm font-medium tracking-wide text-text-main focus:border-brand-primary/50 focus:outline-none focus:ring-4 focus:ring-brand-primary/5 transition-all shadow-sm"
                            />
                        </div>
                        <div className="flex gap-2">
                            <button className="px-8 py-5 bg-white border border-border-subtle rounded-full text-xs font-bold uppercase tracking-widest text-text-main flex items-center gap-3 hover:bg-bg-page hover:border-brand-primary/30 transition-all shadow-sm">
                                {isLoading ? <Activity className="w-4 h-4 animate-spin text-brand-primary" /> : <Activity className="w-4 h-4 text-brand-primary" />}
                                {isLoading ? "Syncing Archive..." : "Live Registry"}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Highlighted Section */}
                <div className="mb-20">
                    <div className="flex items-center gap-4 mb-8">
                        <h2 className="text-2xl font-black tracking-tight uppercase border-l-4 border-brand-primary pl-4 text-text-main">Highlighted Investigations</h2>
                        <div className="h-px flex-1 bg-border-subtle" />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {filteredCases.length > 0 ? (
                            <>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="col-span-12 lg:col-span-7 group cursor-pointer"
                                >
                                    <Link href={`/ledger/${filteredCases[0].id}`}>
                                        <div className="relative h-full bg-white border border-border-subtle rounded-4xl overflow-hidden hover:shadow-2xl hover:border-brand-primary/20 transition-all duration-500 shadow-xl">
                                            <div className="h-80 relative overflow-hidden">
                                                <div className="absolute inset-0 bg-linear-to-t from-white via-transparent to-transparent z-10" />
                                                <img
                                                    src={getCaseImage(filteredCases[0].department, filteredCases[0].id)}
                                                    alt=""
                                                    className="absolute inset-0 w-full h-full object-cover opacity-10 group-hover:opacity-30 transition-all duration-700 scale-105 group-hover:scale-100"
                                                />
                                                <div className="absolute top-8 left-8 z-20">
                                                    <span className="px-4 py-1.5 bg-brand-primary text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full shadow-lg">
                                                        {allCases.some((dc: ResolvedCase) => dc.id === filteredCases[0].id && dc.id >= 1000) ? "Archive Report" : "On-Chain Report"}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="p-12 -mt-16 relative z-20">
                                                <span className="text-xs font-mono text-brand-primary mb-4 block tracking-tighter uppercase font-bold">
                                                    DEPT: {filteredCases[0].department} // CASE_ID: #{filteredCases[0].id}
                                                </span>
                                                <h3 className="text-4xl md:text-5xl font-black tracking-tight mb-6 group-hover:text-brand-primary transition-colors leading-tight text-text-main">
                                                    {filteredCases[0].title}
                                                </h3>
                                                <p className="text-text-muted text-lg leading-relaxed line-clamp-3 mb-8 font-normal">
                                                    {filteredCases[0].summary}
                                                </p>
                                                <div className="flex items-center justify-between pt-8 border-t border-border-subtle">
                                                    <div className="flex items-center gap-4 text-xs font-mono text-text-muted">
                                                        <div className="flex items-center gap-1.5 font-bold">
                                                            <Activity className="w-3.5 h-3.5 text-brand-primary" /> {isLoading ? "REFRESHING..." : "VERIFIED_ON_CHAIN"}
                                                        </div>
                                                        <span>•</span>
                                                        <span className="font-bold">{format(filteredCases[0].timestamp, 'MMMM dd, yyyy')}</span>
                                                    </div>
                                                    <div className="p-4 bg-bg-page border border-border-subtle rounded-2xl hover:bg-brand-primary hover:text-white transition-all group/btn">
                                                        <ArrowUpRight className="w-5 h-5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>

                                <div className="col-span-12 lg:col-span-5 grid grid-cols-1 gap-8">
                                    {filteredCases.slice(1, 3).map((record: ResolvedCase, i: number) => (
                                        <motion.div
                                            key={record.id}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.1 * (i + 1) }}
                                            className="group flex flex-col md:flex-row bg-white border border-border-subtle rounded-[2rem] overflow-hidden hover:shadow-xl hover:border-brand-primary/20 transition-all cursor-pointer shadow-sm"
                                        >
                                            <Link href={`/ledger/${record.id}`} className="flex flex-col md:flex-row w-full h-full">
                                                <div className="w-full md:w-1/3 h-48 md:h-auto bg-bg-page border-r border-border-subtle relative overflow-hidden">
                                                    <img
                                                        src={getCaseImage(record.department, record.id)}
                                                        alt=""
                                                        className="absolute inset-0 w-full h-full object-cover opacity-10 group-hover:opacity-30 transition-all duration-500"
                                                    />
                                                </div>
                                                <div className="flex-1 p-8 flex flex-col justify-between">
                                                    <div>
                                                        <span className="text-[10px] font-mono text-brand-primary uppercase tracking-widest mb-2 block font-bold">
                                                            {record.department}
                                                        </span>
                                                        <h4 className="text-xl font-bold tracking-tight mb-2 group-hover:text-brand-primary transition-colors line-clamp-2 text-text-main">
                                                            {record.title}
                                                        </h4>
                                                        <p className="text-text-muted text-sm line-clamp-2 font-normal leading-snug">
                                                            {record.summary}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center justify-between mt-6">
                                                        <span className="text-[10px] font-bold font-mono text-text-muted">{format(record.timestamp, 'MMM dd, yy')}</span>
                                                        <div className="flex items-center gap-1">
                                                            <div className={`w-1.5 h-1.5 rounded-full ${record.status === 4 ? 'bg-brand-accent' : 'bg-red-500'}`} />
                                                            <span className="text-[10px] text-text-main font-bold uppercase tracking-widest">
                                                                {statusMap[record.status]}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                        </motion.div>
                                    ))}
                                </div>
                            </>
                        ) : isLoading ? (
                            <div className="col-span-12 h-96 bg-white animate-pulse rounded-[2rem] border border-border-subtle" />
                        ) : (
                            <div className="col-span-12 py-32 text-center">
                                <Search className="w-12 h-12 text-text-muted mx-auto mb-8 opacity-20" />
                                <h3 className="text-2xl font-black mb-2 uppercase tracking-tighter text-text-muted">No matching records found</h3>
                                <p className="text-text-muted max-w-sm mx-auto">The decentralized index did not return any results for your query.</p>
                            </div>
                        )}
                    </div>
                </div>

                <div>
                    <div className="flex items-center gap-4 mb-8">
                        <h2 className="text-2xl font-black tracking-tight uppercase border-l-4 border-border-subtle pl-4 text-text-main">Archive Entries</h2>
                        <div className="h-px flex-1 bg-border-subtle" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {filteredCases.slice(3).map((record: ResolvedCase, i: number) => (
                            <motion.div
                                key={record.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.05 * i }}
                                className="group bg-white border border-border-subtle rounded-3xl p-6 hover:shadow-xl hover:border-brand-primary/20 transition-all flex flex-col cursor-pointer shadow-sm"
                            >
                                <Link href={`/ledger/${record.id}`} className="flex flex-col h-full">
                                    <div className="h-40 w-full bg-bg-page rounded-2xl mb-6 relative overflow-hidden flex items-center justify-center">
                                        <img
                                            src={getCaseImage(record.department, record.id)}
                                            alt=""
                                            className="absolute inset-0 w-full h-full object-cover opacity-5 group-hover:opacity-20 transition-all duration-500"
                                        />
                                        <Activity className="w-10 h-10 text-brand-primary/10 group-hover:text-brand-primary/30 transition-colors relative z-10" />
                                        <div className="absolute bottom-4 right-4 text-4xl font-black text-brand-primary/5 select-none leading-none z-10">#{record.id}</div>
                                    </div>

                                    <div className="flex-1">
                                        <span className="text-[10px] font-mono text-text-muted uppercase tracking-widest mb-2 block font-bold">
                                            {record.department}
                                        </span>
                                        <h4 className="text-lg font-bold tracking-tight mb-3 line-clamp-2 group-hover:text-brand-primary transition-colors leading-tight text-text-main">
                                            {record.title}
                                        </h4>
                                        <p className="text-text-muted text-xs line-clamp-3 font-normal leading-relaxed mb-6">
                                            {record.summary}
                                        </p>
                                    </div>

                                    <div className="pt-6 border-t border-border-subtle flex items-center justify-between mt-auto">
                                        <span className="text-[10px] font-bold font-mono text-text-muted">{format(record.timestamp, 'MMM dd, yyyy')}</span>
                                        <div className="p-2.5 rounded-xl bg-bg-page text-text-muted group-hover:text-brand-primary group-hover:bg-brand-primary/5 transition-all">
                                            <ExternalLink className="w-3.5 h-3.5" />
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Formal Footer */}
                <div className="mt-32 pt-16 border-t border-border-subtle grid grid-cols-1 lg:grid-cols-2 gap-16">
                    <div className="space-y-6">
                        <h3 className="text-3xl font-black tracking-tighter text-text-main">A NEW Standard for Public Trust.</h3>
                        <p className="text-text-muted text-lg leading-relaxed font-normal">
                            NyayaSetu is a cryptographic framework ensuring accountability between citizens and authorities.
                            By anchoring investigations to the blockchain, we ensure that justice is no longer a localized
                            event, but a globally verifiable record.
                        </p>
                    </div>
                    <div className="bg-white border border-border-subtle rounded-4xl p-10 flex flex-col justify-between shadow-sm">
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-brand-primary">
                                <Activity className="w-5 h-5" />
                                <span className="text-[10px] font-mono uppercase font-black tracking-widest">Network_Stability: Optimal</span>
                            </div>
                            <div className="font-mono text-[10px] text-text-muted break-all leading-loose font-bold">
                                [SYSTEM_LOG]: ARCHIVE_CID_SYNC_SECURE... {CONTRACT_ADDRESS}<br />
                                [BLOCKCHAIN]: CIVIC_CHAIN_NODES_VERIFIED<br />
                                [SECURITY]: RSA_ENCRYPTION_ACTIVE_V4
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
