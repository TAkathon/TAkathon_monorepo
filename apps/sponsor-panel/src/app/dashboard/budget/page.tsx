"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { 
    Wallet, 
    TrendingUp, 
    TrendingDown, 
    Calendar,
    Loader2,
    DollarSign
} from "lucide-react";
import api from "@takathon/shared/api";
import { toast } from "sonner";

export default function SponsorBudget() {
    const [sponsorships, setSponsorships] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get("/api/v1/sponsors/hackathons/sponsorships")
            .then((res) => {
                const data = res.data.data?.sponsorships || res.data.data || [];
                setSponsorships(Array.isArray(data) ? data : []);
            })
            .catch(() => toast.error("Failed to load budget data"))
            .finally(() => setLoading(false));
    }, []);

    const totalAllocated = sponsorships.reduce((sum: number, s: any) => sum + (Number(s.amount) || 0), 0);
    const activeAmount = sponsorships
        .filter((s: any) => (s.status || "").toLowerCase() === "active")
        .reduce((sum: number, s: any) => sum + (Number(s.amount) || 0), 0);
    const pendingAmount = sponsorships
        .filter((s: any) => (s.status || "").toLowerCase() === "pending")
        .reduce((sum: number, s: any) => sum + (Number(s.amount) || 0), 0);

    const budgetStats = [
        { name: "Total Allocated", value: `$${totalAllocated.toLocaleString()}`, icon: Wallet, color: "text-blue-400" },
        { name: "Active Sponsorships", value: `$${activeAmount.toLocaleString()}`, icon: TrendingUp, color: "text-primary" },
        { name: "Pending Confirmation", value: `$${pendingAmount.toLocaleString()}`, icon: TrendingDown, color: "text-amber-400" },
    ];

    if (loading) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center h-full min-h-[400px]">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="space-y-8">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-white">Budget Overview</h1>
                    <p className="text-white/60 mt-1">Track your sponsorship spending across all events</p>
                </div>

                {/* Budget Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {budgetStats.map((stat) => {
                        const Icon = stat.icon;
                        return (
                            <div key={stat.name} className="glass p-6 rounded-2xl hover:border-primary/30 transition-all">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="p-3 rounded-xl bg-white/5">
                                        <Icon className={`w-6 h-6 ${stat.color}`} />
                                    </div>
                                    <p className="text-sm text-white/60">{stat.name}</p>
                                </div>
                                <h3 className="text-3xl font-bold text-white">{stat.value}</h3>
                            </div>
                        );
                    })}
                </div>

                {/* Transactions */}
                <div className="glass rounded-2xl overflow-hidden border border-white/10">
                    <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
                        <h2 className="text-xl font-bold text-white">Sponsorship Transactions</h2>
                    </div>
                    {sponsorships.length === 0 ? (
                        <div className="p-12 text-center">
                            <DollarSign className="w-12 h-12 text-white/20 mx-auto mb-4" />
                            <p className="text-white/40">No transactions yet</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-white/5 border-b border-white/10">
                                        <th className="px-6 py-4 text-sm font-semibold text-white/60 uppercase tracking-wider">Event</th>
                                        <th className="px-6 py-4 text-sm font-semibold text-white/60 uppercase tracking-wider">Tier</th>
                                        <th className="px-6 py-4 text-sm font-semibold text-white/60 uppercase tracking-wider">Amount</th>
                                        <th className="px-6 py-4 text-sm font-semibold text-white/60 uppercase tracking-wider">Date</th>
                                        <th className="px-6 py-4 text-sm font-semibold text-white/60 uppercase tracking-wider">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {sponsorships.map((s: any) => {
                                        const title = s.hackathon?.title || "Hackathon";
                                        const tier = s.tier || s.tierName || "-";
                                        const amount = s.amount ? `$${Number(s.amount).toLocaleString()}` : "-";
                                        const date = s.createdAt ? new Date(s.createdAt).toLocaleDateString() : "N/A";
                                        const status = (s.status || "pending").toLowerCase();
                                        return (
                                            <tr key={s.id} className="hover:bg-white/[0.02] transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm font-bold">
                                                            {title.charAt(0)}
                                                        </div>
                                                        <span className="text-white font-medium">{title}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-white/60 text-sm">{tier}</td>
                                                <td className="px-6 py-4 text-white font-semibold">{amount}</td>
                                                <td className="px-6 py-4 text-white/40 text-sm flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" />{date}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                                                        status === "active" ? "bg-green-500/10 text-green-400" :
                                                        status === "cancelled" ? "bg-red-500/10 text-red-400" :
                                                        "bg-amber-500/10 text-amber-400"
                                                    }`}>{status}</span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                    <div className="px-6 py-4 border-t border-white/10 bg-white/5 flex items-center justify-between text-sm">
                        <span className="text-white/40">{sponsorships.length} transactions</span>
                        <span className="text-white font-semibold">Total: ${totalAllocated.toLocaleString()}</span>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
