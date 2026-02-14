"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { 
    Wallet, 
    TrendingUp, 
    ArrowUpRight,
    BarChart3,
    Calendar,
    Loader2,
    CheckCircle2,
    Clock
} from "lucide-react";
import { sponsorService } from "@/lib/api";

export default function BudgetPage() {
    const [sponsorships, setSponsorships] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const res = await sponsorService.mySponsorships();
                setSponsorships(res.data?.data?.sponsorships || res.data?.data || []);
            } catch {
                setSponsorships([]);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const totalSpent = sponsorships
        .filter((s: any) => s.status !== "cancelled")
        .reduce((acc: number, s: any) => acc + (Number(s.amount) || 0), 0);
    const activeSpent = sponsorships
        .filter((s: any) => s.status === "active" || s.status === "confirmed")
        .reduce((acc: number, s: any) => acc + (Number(s.amount) || 0), 0);
    const pendingSpent = sponsorships
        .filter((s: any) => s.status === "pending")
        .reduce((acc: number, s: any) => acc + (Number(s.amount) || 0), 0);

    const budgetStats = [
        { name: "Total Committed", value: `$${totalSpent.toLocaleString()}`, icon: Wallet, color: "text-blue-500", bg: "bg-blue-500/10" },
        { name: "Active / Confirmed", value: `$${activeSpent.toLocaleString()}`, icon: TrendingUp, color: "text-primary", bg: "bg-primary/10" },
        { name: "Pending", value: `$${pendingSpent.toLocaleString()}`, icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10" },
    ];

    // Group by tier
    const tierBreakdown: Record<string, number> = {};
    sponsorships.filter((s: any) => s.status !== "cancelled").forEach((s: any) => {
        const tier = (s.tier || "other").charAt(0).toUpperCase() + (s.tier || "other").slice(1);
        tierBreakdown[tier] = (tierBreakdown[tier] || 0) + (Number(s.amount) || 0);
    });

    return (
        <DashboardLayout>
            <div className="space-y-8">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Budget Overview</h1>
                    <p className="text-white/60">Monitor your sponsorship spending and allocations.</p>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center h-48">
                        <Loader2 className="w-8 h-8 text-primary animate-spin" />
                    </div>
                ) : (
                    <>
                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {budgetStats.map((stat) => {
                                const Icon = stat.icon;
                                return (
                                    <div key={stat.name} className="glass p-6 rounded-2xl">
                                        <div className="flex items-center gap-4">
                                            <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                                                <Icon className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-white/40">{stat.name}</p>
                                                <h3 className="text-2xl font-bold text-white">{stat.value}</h3>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Tier Breakdown */}
                        <div className="glass rounded-2xl p-6">
                            <div className="flex items-center gap-2 mb-8">
                                <BarChart3 className="w-5 h-5 text-primary" />
                                <h2 className="text-xl font-bold text-white">Spending by Tier</h2>
                            </div>
                            {Object.keys(tierBreakdown).length === 0 ? (
                                <p className="text-white/40 text-sm text-center py-8">No spending data yet.</p>
                            ) : (
                                <div className="space-y-6">
                                    {Object.entries(tierBreakdown).map(([tier, amount]) => {
                                        const percent = totalSpent > 0 ? Math.round((amount / totalSpent) * 100) : 0;
                                        return (
                                            <div key={tier} className="space-y-2">
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-white/60">{tier}</span>
                                                    <span className="text-white font-medium">${amount.toLocaleString()} ({percent}%)</span>
                                                </div>
                                                <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                                                    <div className="bg-primary h-full rounded-full transition-all" style={{ width: `${percent}%` }} />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Recent Transactions */}
                        <div className="glass rounded-2xl overflow-hidden">
                            <div className="px-6 py-4 border-b border-white/10 bg-white/5">
                                <h2 className="text-xl font-bold text-white">Sponsorship History</h2>
                            </div>
                            {sponsorships.length === 0 ? (
                                <p className="text-white/40 text-sm text-center py-8">No transactions yet.</p>
                            ) : (
                                <div className="divide-y divide-white/5">
                                    {sponsorships.map((s: any) => (
                                        <div key={s.id} className="px-6 py-4 flex items-center justify-between hover:bg-white/5 transition-all">
                                            <div className="flex items-center gap-4">
                                                <div className="p-2 rounded-lg bg-white/5">
                                                    <ArrowUpRight className="w-5 h-5 text-white/40" />
                                                </div>
                                                <div>
                                                    <h4 className="text-white font-medium">{s.hackathon?.title || "Hackathon"}</h4>
                                                    <p className="text-xs text-white/40">
                                                        {s.createdAt ? new Date(s.createdAt).toLocaleDateString() : ""} • {s.tier} tier
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-white font-bold">${Number(s.amount || 0).toLocaleString()}</p>
                                                <p className={`text-[10px] uppercase tracking-widest font-bold capitalize ${
                                                    s.status === "active" || s.status === "confirmed" ? "text-green-500" :
                                                    s.status === "cancelled" ? "text-red-500" : "text-amber-500"
                                                }`}>{s.status}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </DashboardLayout>
    );
}
