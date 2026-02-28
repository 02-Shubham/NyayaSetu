'use client'

import { AdminLayout } from '@/components/layout/AdminLayout'
import { useCases, type CaseRecord } from '@/hooks/useCases'
import { useAdmin } from '@/hooks/useAdmin'
import {
  Shield,
  Clock,
  CheckCircle,
  AlertTriangle,
  ArrowUpRight,
  Filter,
  MoreVertical,
  ExternalLink,
  Lock,
  Activity
} from 'lucide-react'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import Link from 'next/link'

export default function DashboardPage() {
  const { cases, isLoading, statusMap } = useCases()
  const { isAdmin } = useAdmin()

  const stats = [
    { name: 'Total Cases', value: cases.length, icon: Shield, color: 'text-brand-primary' },
    { name: 'Under Review', value: cases.filter(c => c.status === 1 || c.status === 2).length, icon: Clock, color: 'text-brand-secondary' },
    { name: 'Resolved', value: cases.filter(c => c.status === 4).length, icon: CheckCircle, color: 'text-brand-accent' },
    { name: 'Escalated', value: cases.filter(c => c.status === 3).length, icon: AlertTriangle, color: 'text-red-600' },
  ]

  if (!isAdmin && !isLoading) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mb-6 border border-red-100">
            <Lock className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-text-main mb-2">Access Restricted</h2>
          <p className="text-text-muted max-w-sm font-medium">
            This portal is only accessible to authorized legal authorities. Please connect an authorized wallet to continue.
          </p>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-12">
        {/* Welcome Header */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 bg-brand-primary text-white text-[8px] font-black uppercase tracking-[0.3em] rounded-full shadow-lg">
              COMMAND_CENTER
            </span>
            <span className="text-text-muted text-[8px] font-mono tracking-widest uppercase font-bold">REGISTRY_ACTIVE</span>
          </div>
          <h1 className="text-6xl md:text-7xl font-black tracking-tight text-text-main uppercase leading-none">Legal Intelligence <br /><span className="text-text-muted italic">DASHBOARD</span></h1>
          <p className="text-lg text-text-muted font-normal max-w-2xl leading-relaxed">Real-time overview of whistleblower evidence and case progression across the decentralized legal network.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-10 group hover:border-brand-primary/30 transition-all shadow-xl"
            >
              <div className="flex items-center justify-between mb-8">
                <div className={`p-4 rounded-2xl bg-bg-page border border-border-subtle group-hover:border-brand-primary/20 transition-all`}>
                  <stat.icon className={`w-8 h-8 ${stat.color} group-hover:scale-110 transition-transform`} />
                </div>
                <div className="flex items-center gap-2 text-[8px] font-black text-text-muted uppercase tracking-[0.3em]">
                  Live <div className={`w-2 h-2 rounded-full ${stat.name === 'Escalated' ? 'bg-red-600' : 'bg-brand-accent'} animate-pulse shadow-sm`} />
                </div>
              </div>
              <div className="text-7xl font-black text-text-main tracking-tighter mb-2 leading-none">{isLoading ? '...' : stat.value}</div>
              <div className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">{stat.name}</div>
            </motion.div>
          ))}
        </div>

        {/* Live Pulse & Case Registry */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Case List */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-3xl font-black text-text-main uppercase tracking-tight flex items-center gap-4">
                RECENT CASES
                <span className="px-4 py-1.5 rounded-full bg-slate-100 border border-border-subtle text-[10px] text-text-muted font-mono uppercase tracking-widest font-bold shadow-sm">
                  {cases.length} Total_Records
                </span>
              </h2>
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-3 px-6 py-3 bg-white border border-border-subtle rounded-full text-[10px] font-black uppercase tracking-widest text-text-muted hover:text-brand-primary transition-all hover:bg-slate-50 shadow-sm">
                  <Filter className="w-4 h-4 text-brand-primary" /> Filter
                </button>
              </div>
            </div>

            <div className="document-card overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-border-subtle bg-slate-50">
                      <th className="px-10 py-6 text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Hash_ID</th>
                      <th className="px-10 py-6 text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Origin</th>
                      <th className="px-10 py-6 text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Authority</th>
                      <th className="px-10 py-6 text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Lifecycle</th>
                      <th className="px-10 py-6 text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">State</th>
                      <th className="px-10 py-6 text-right"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-subtle">
                    {isLoading ? (
                      [...Array(5)].map((_, i) => (
                        <tr key={i} className="animate-pulse">
                          <td colSpan={6} className="px-6 py-6 h-16 bg-slate-50" />
                        </tr>
                      ))
                    ) : (
                      cases.map((record) => (
                        <tr key={record.id} className="group hover:bg-slate-50 transition-colors border-b border-border-subtle last:border-0">
                          <td className="px-10 py-8">
                            <span className="text-lg font-mono font-black text-brand-primary tracking-tighter">#{record.id.toString().padStart(4, '0')}</span>
                          </td>
                          <td className="px-10 py-8 whitespace-nowrap">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-2xl bg-brand-primary/5 border border-brand-primary/10 flex items-center justify-center text-[10px] font-black text-brand-primary uppercase tracking-widest">
                                {record.creator.slice(2, 4).toUpperCase()}
                              </div>
                              <span className="text-[10px] font-mono text-text-muted font-bold uppercase tracking-wider">
                                {record.creator.slice(0, 10)}...
                              </span>
                            </div>
                          </td>
                          <td className="px-10 py-8 whitespace-nowrap">
                            <span className="px-3 py-1 rounded-full bg-slate-100 border border-border-subtle text-[10px] text-text-muted font-black uppercase tracking-widest">
                              {record.department}
                            </span>
                          </td>
                          <td className="px-10 py-8 whitespace-nowrap">
                            <span className="text-[10px] font-mono text-text-muted font-bold uppercase tracking-widest">
                              {format(record.timestamp, 'dd_MM_yyyy HH:mm')}
                            </span>
                          </td>
                          <td className="px-10 py-8 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <div className={`w-2.5 h-2.5 rounded-full ${record.status === 4 ? 'bg-brand-accent shadow-sm' :
                                record.status === 3 ? 'bg-red-600 shadow-sm' :
                                  record.status === 0 ? 'bg-slate-300' : 'bg-brand-primary'
                                }`} />
                              <span className="text-[10px] font-black uppercase tracking-widest text-text-main leading-none">
                                {statusMap[record.status]}
                              </span>
                            </div>
                          </td>
                          <td className="px-10 py-8 text-right">
                            <Link
                              href={`/cases/${record.id}`}
                              className="p-3 inline-flex items-center justify-center rounded-2xl bg-slate-100 border border-border-subtle hover:border-brand-primary/30 text-text-muted hover:text-brand-primary transition-all group/btn shadow-sm"
                            >
                              <ArrowUpRight className="w-5 h-5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                            </Link>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
                {!isLoading && cases.length === 0 && (
                  <div className="p-12 text-center">
                    <p className="text-text-muted text-sm font-medium">No cases reported yet in the legal registry.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Sidebar: Live Justice Pulse */}
          <div className="space-y-6">
            <div className="document-card p-10 bg-white relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/5 blur-[60px] -mr-16 -mt-16" />
              <div className="flex items-center justify-between mb-10 border-b border-border-subtle pb-6">
                <h3 className="text-[10px] font-black text-brand-primary uppercase tracking-[0.3em] flex items-center gap-3">
                  <Activity className="w-5 h-5 animate-pulse" /> Justice Pulse
                </h3>
                <div className="text-[8px] font-mono text-text-muted uppercase tracking-widest font-bold">ENCRYPTED_FEED</div>
              </div>

              <div className="space-y-6 font-mono text-[9px]">
                {[
                  { time: '18:15:05', event: 'CONTRACT_SYNC', status: 'OK' },
                  { time: '18:12:22', event: 'NEW_CASE_FILED', status: '#128' },
                  { time: '18:10:30', event: 'METADATA_ANCHORED', status: 'IPFS' },
                  { time: '18:05:12', event: 'AUTH_KEY_ROTATED', status: 'POLICE' },
                  { time: '18:02:55', event: 'DMS_ARMED', status: 'SECURE' },
                ].map((log, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-4 border-l-2 border-slate-100 pl-4 py-1"
                  >
                    <span className="text-text-muted font-bold">{log.time}</span>
                    <span className="text-text-main font-black uppercase tracking-widest">{log.event}</span>
                    <span className="ml-auto text-brand-primary font-black">{log.status}</span>
                  </motion.div>
                ))}
              </div>

              <div className="mt-10 pt-8 border-t border-border-subtle space-y-5">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] text-text-muted font-black uppercase tracking-widest">Network Health</span>
                  <span className="text-[9px] text-brand-accent font-black tracking-widest">OPTIMAL_v4</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[9px] text-text-muted font-black uppercase tracking-widest">Registry Status</span>
                  <span className="text-[9px] text-brand-primary font-black italic tracking-widest uppercase">Synced</span>
                </div>
              </div>
            </div>

            <div className="document-card p-10 bg-slate-50 border-brand-primary/10 shadow-lg">
              <h3 className="text-[10px] font-black text-text-muted uppercase tracking-[0.3em] mb-8">SECURITY_INFRA</h3>
              <div className="space-y-5">
                <div className="flex items-center gap-4">
                  <div className="w-2.5 h-2.5 rounded-full bg-brand-accent shadow-sm" />
                  <span className="text-[10px] font-black text-text-main uppercase tracking-widest">RSA-4096 Vault Active</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-2.5 h-2.5 rounded-full bg-brand-accent shadow-sm" />
                  <span className="text-[10px] font-black text-text-main uppercase tracking-widest">AES-256 GCM Shield</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-300 shadow-sm" />
                  <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">IPFS Pins Verified</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
