'use client'

import { AdminLayout } from '@/components/layout/AdminLayout'
import { useCases } from '@/hooks/useCases'
import {
    Shield,
    Search,
    Filter,
    ArrowUpRight,
    ChevronRight
} from 'lucide-react'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import Link from 'next/link'
import { useState } from 'react'

export default function CasesPage() {
    const { cases, isLoading, statusMap } = useCases()
    const [searchQuery, setSearchQuery] = useState('')
    const [filterStatus, setFilterStatus] = useState<number | 'all'>('all')

    const filteredCases = cases.filter(c => {
        const matchesSearch = c.id.toString().includes(searchQuery) ||
            c.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.creator.toLowerCase().includes(searchQuery.toLowerCase())

        const matchesStatus = filterStatus === 'all'
            ? c.status < 4
            : c.status === filterStatus

        return matchesSearch && matchesStatus
    })

    return (
        <AdminLayout>
            <div className="space-y-8">
                <div>
                    <h1 className="text-3xl font-bold text-text-main tracking-tight mb-2">Internal Registry</h1>
                    <p className="text-text-muted">Complete archive of all whistleblower submissions and legal proceedings.</p>
                </div>

                {/* Search & Filter Bar */}
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl border border-border-subtle shadow-sm">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                        <input
                            type="text"
                            placeholder="Search Case ID, Dept, or Address..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-bg-page border border-border-subtle rounded-xl pl-12 pr-4 py-2.5 text-sm text-text-main focus:border-brand-primary/40 focus:outline-none transition-all"
                        />
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <Filter className="w-4 h-4 text-text-muted hidden md:block" />
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                            className="flex-1 md:w-48 bg-bg-page border border-border-subtle rounded-xl px-4 py-2.5 text-sm text-text-main transition-all outline-none"
                        >
                            <option value="all">All Statuses</option>
                            {statusMap.map((label, i) => (
                                <option key={i} value={i}>{label}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Cases Grid */}
                <div className="grid grid-cols-1 gap-4">
                    {isLoading ? (
                        [...Array(5)].map((_, i) => (
                            <div key={i} className="h-24 bg-bg-page rounded-2xl animate-pulse border border-border-subtle" />
                        ))
                    ) : (
                        filteredCases.map((record, i) => (
                            <motion.div
                                key={record.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.05 }}
                            >
                                <Link href={`/cases/${record.id}`} className="group">
                                    <div className="glass-card p-6 flex flex-col md:flex-row items-center justify-between group-hover:border-brand-primary/30 transition-all">
                                        <div className="flex items-center gap-6 w-full md:w-auto mb-4 md:mb-0">
                                            <div className="w-12 h-12 bg-brand-primary/5 rounded-2xl flex items-center justify-center border border-brand-primary/10 group-hover:bg-brand-primary/10 group-hover:border-brand-primary/20 transition-all">
                                                <span className="text-sm font-mono font-bold text-brand-primary">#{record.id}</span>
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-text-main font-bold">{record.title || record.department}</span>
                                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition-all ${record.status === 4 ? 'bg-brand-accent/10 text-brand-accent' :
                                                        record.status === 3 ? 'bg-red-500/10 text-red-500' :
                                                            'bg-brand-primary/10 text-brand-primary'
                                                        }`}>
                                                        {statusMap[record.status]}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-4 mt-1">
                                                    <div className="text-xs text-text-muted font-mono">
                                                        Reporter: {record.creator.slice(0, 8)}...{record.creator.slice(-6)}
                                                    </div>
                                                    {record.title !== record.department && (
                                                        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-brand-primary/5 border border-brand-primary/10">
                                                            <div className="w-1 h-1 rounded-full bg-brand-primary animate-pulse" />
                                                            <span className="text-[10px] font-bold text-brand-primary uppercase tracking-tighter">IPFS Live</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-end">
                                            <div className="text-right hidden sm:block">
                                                <div className="text-[10px] text-text-muted uppercase font-bold tracking-widest mb-1">Filed Date</div>
                                                <div className="text-xs text-text-main font-medium">
                                                    {format(record.timestamp, 'MMM dd, yyyy')}
                                                </div>
                                            </div>
                                            <div className="p-2 rounded-xl bg-bg-page border border-border-subtle group-hover:bg-brand-primary group-hover:border-brand-primary text-text-muted group-hover:text-white transition-all">
                                                <ChevronRight className="w-5 h-5" />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))
                    )}

                    {!isLoading && filteredCases.length === 0 && (
                        <div className="py-20 text-center">
                            <div className="w-16 h-16 bg-bg-page rounded-2xl flex items-center justify-center mx-auto mb-4 border border-border-subtle">
                                <Shield className="w-8 h-8 text-text-muted" />
                            </div>
                            <p className="text-text-muted font-medium">No records matching your localized query.</p>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    )
}
