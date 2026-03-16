"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import {
    Wallet,
    TrendingUp,
    TrendingDown,
    ArrowUpRight,
    PieChart,
    BarChart3,
    Download,
    Loader2,
    Calendar,
    DollarSign
} from "lucide-react";
import api from "@takathon/shared/api";
import { toast } from "sonner";

export default function SponsorBudget() {
    const [sponsorships, setSponsorships] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBudgetData();
    }, []);

    const fetchBudgetData = async () => {
        try {
            const res = await api.get("/api/v1/sponsors/hackathons/sponsorships");
            const data = res.data.data?.sponsorships || res.data.data || [];
            setSponsorships(Array.isArray(data) ? data : []);
        } catch {
            toast.error("FAILED TO SYNCHRONIZE BUDGET INTEL");
        } finally {
            setLoading(false);
        }
    };

    const totalAllocated = sponsorships.reduce((sum: number, s: any) => sum + (Number(s.amount) || 0), 0);
    const activeAmount = sponsorships
        .filter((s: any) => (s.status || "").toLowerCase() === "active" || (s.status || "").toLowerCase() === "approved")
        .reduce((sum: number, s: any) => sum + (Number(s.amount) || 0), 0);
    const pendingAmount = sponsorships
        .filter((s: any) => (s.status || "").toLowerCase() === "pending")
        .reduce((sum: number, s: any) => sum + (Number(s.amount) || 0), 0);

    const budgetStats = [
        { 
            name: "TOTAL BOUNTY ALLOCATED", 
            value: `$${totalAllocated.toLocaleString()}`, 
            icon: Wallet, 
            color: "text-primary", 
            bg: "bg-primary/10", 
            border: "border-primary/20" 
        },
        { 
            name: "ACTIVE DEPLOYMENT", 
            value: `$${activeAmount.toLocaleString()}`, 
            icon: TrendingUp, 
            color: "text-green-400", 
            bg: "bg-green-500/10", 
            border: "border-green-500/20" 
        },
        { 
            name: "PENDING AUTHORIZATION", 
            value: `$${pendingAmount.toLocaleString()}`, 
            icon: TrendingDown, 
            color: "text-amber-400", 
            bg: "bg-amber-500/10", 
            border: "border-amber-500/20" 
        },
    ];

    if (loading) {
        return (
            <DashboardLayout>
                <div className="py-20 flex flex-col items-center justify-center gap-4">
                    <Loader2 className="w-10 h-10 text-primary animate-spin" />
                    <span className="text-[10px] font-black text-white/20 uppercase tracking-[.3em]">SYNCHRONIZING FINANCIAL INTEL...</span>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="space-y-10 max-w-6xl mx-auto pb-12">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div>
                        <h1 className="text-5xl md:text-6xl font-black italic tracking-tighter uppercase text-white mb-2">
                            BUDGET <span className="text-primary text-glow-sm">OPERATIONS</span>
                        </h1>
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-primary animate-pulse rounded-full shadow-glow-sm" />
                            <span className="text-[10px] text-white/40 uppercase tracking-[0.2em] font-bold">
                                MONITOR SPONSORSHIP SPENDING AND FINANCIAL ALLOCATIONS
                            </span>
                        </div>
                    </div>
                    
                    <button className="px-8 py-3 bg-white/5 border border-white/10 hover:border-primary/50 text-white text-[10px] font-black uppercase tracking-widest transition-all rounded-sm flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        EXPORT FINANCIAL LOG
                    </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {budgetStats.map((stat) => {
                        const Icon = stat.icon;
                        return (
                            <div key={stat.name} className="relative bg-[#080808] border border-white/5 p-8 rounded-sm hover:border-primary/30 transition-all duration-500 group overflow-hidden">
                                <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-primary/40 group-hover:border-primary"></div>
                                <div className="flex items-center gap-6">
                                    <div className={`p-4 ${stat.bg} ${stat.color} border ${stat.border} rounded-sm`}>
                                        <Icon className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-white/40 uppercase tracking-[0.2em] font-black mb-1">{stat.name}</p>
                                        <h3 className="text-4xl font-black text-white italic tracking-tighter">{stat.value}</h3>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="relative bg-[#080808] border border-white/5 p-8 rounded-sm group overflow-hidden">
                        <div className="flex items-center justify-between mb-10">
                            <h2 className="text-xs font-black text-white flex items-center gap-2 uppercase tracking-[0.2em] italic">
                                <BarChart3 className="w-4 h-4 text-primary" />
                                SPENDING TRAJECTORY
                            </h2>
                            <select className="bg-black border border-white/10 text-[9px] text-white/40 px-3 py-1.5 outline-none uppercase tracking-[0.2em] font-black rounded-sm focus:border-primary/50 transition-all">
                                <option>LAST 6 MONTHS</option>
                                <option>ANNUAL OVERVIEW</option>
                            </select>
                        </div>
                        <div className="h-56 flex items-end justify-between gap-3 px-2">
                            {[40, 70, 45, 90, 65, 80].map((height, i) => (
                                <div key={i} className="flex-1 space-y-3">
                                    <div
                                        className="w-full bg-primary/10 border-t border-primary/30 hover:bg-primary/30 transition-all duration-500 relative group"
                                        style={{ height: `${height}%` }}
                                    >
                                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-primary text-white text-[9px] font-black px-2 py-1 opacity-0 group-hover:opacity-100 transition-all shadow-glow-sm">
                                            ${height/10}K
                                        </div>
                                    </div>
                                    <p className="text-[8px] text-center text-white/20 uppercase tracking-[0.2em] font-black italic">PH-{i+1}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="relative bg-[#080808] border border-white/5 p-8 rounded-sm group overflow-hidden">
                        <div className="flex items-center justify-between mb-10">
                            <h2 className="text-xs font-black text-white flex items-center gap-2 uppercase tracking-[0.2em] italic">
                                <PieChart className="w-4 h-4 text-primary" />
                                ALLOCATION SPECTRUM
                            </h2>
                        </div>
                        <div className="space-y-8">
                            {[
                                { name: "FIELD HACKATHONS", percent: 65, color: "bg-primary" },
                                { name: "TECHNICAL SUMMITS", percent: 20, color: "bg-blue-500" },
                                { name: "OPERATIVE WORKSHOPS", percent: 15, color: "bg-green-500" },
                            ].map((cat) => (
                                <div key={cat.name} className="space-y-3">
                                    <div className="flex justify-between text-[10px] uppercase tracking-[0.2em] font-black">
                                        <span className="text-white/30">{cat.name}</span>
                                        <span className="text-white italic">{cat.percent}%</span>
                                    </div>
                                    <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                                        <div className={`${cat.color} h-full shadow-glow-sm`} style={{ width: `${cat.percent}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Transactions */}
                <div className="relative bg-[#080808] border border-white/5 rounded-sm overflow-hidden">
                    <div className="px-8 py-6 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
                        <h2 className="text-xs font-black text-white uppercase tracking-[0.2em] italic">FINANCIAL LOG ENTRIES</h2>
                        <button className="text-[10px] text-primary hover:text-primary-light font-black uppercase tracking-[0.2em] transition-colors">VIEW FULL REGISTRY</button>
                    </div>
                    {sponsorships.length === 0 ? (
                         <div className="p-16 text-center">
                            <DollarSign className="w-12 h-12 text-white/10 mx-auto mb-4" />
                            <p className="text-xs font-black text-white/30 uppercase tracking-[0.2em]">NO FINANCIAL DATA RECORDED</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-white/5">
                            {sponsorships.slice(0, 5).map((s: any) => {
                                const title = s.hackathon?.title || "FIELD MISSION";
                                const amount = s.amount ? `$${Number(s.amount).toLocaleString()}` : "-";
                                const date = s.createdAt ? new Date(s.createdAt).toLocaleDateString() : "N/A";
                                const status = (s.status || "pending").toLowerCase();
                                const id = s.id?.slice(-8).toUpperCase() || "LOG-ENTRY";

                                return (
                                    <div key={s.id} className="px-8 py-6 flex items-center justify-between hover:bg-white/[0.02] transition-all group">
                                        <div className="flex items-center gap-6">
                                            <div className="p-3 bg-white/[0.02] border border-white/10 rounded-sm group-hover:border-primary/50 transition-all">
                                                <ArrowUpRight className="w-5 h-5 text-white/20 group-hover:text-primary" />
                                            </div>
                                            <div>
                                                <h4 className="text-white font-black text-sm uppercase tracking-tighter italic group-hover:text-primary transition-colors">{title}</h4>
                                                <p className="text-[9px] text-white/30 uppercase tracking-[0.2em] font-black mt-1">{date} • REF: {id}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-white font-black text-lg italic tracking-tighter">{amount}</p>
                                            <p className={`text-[9px] uppercase tracking-[0.2em] font-black mt-1 ${
                                                status === "active" || status === "approved" ? "text-green-400" : 
                                                status === "cancelled" ? "text-red-400" :
                                                "text-amber-400"
                                            }`}>{status}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
