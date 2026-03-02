"use client";

import DashboardLayout from "@/components/DashboardLayout";
import {
    Wallet,
    TrendingUp,
    TrendingDown,
    ArrowUpRight,
    PieChart,
    BarChart3,
    Download
} from "lucide-react";

const budgetStats = [
    { name: "Total Budget", value: "$100,000", icon: Wallet, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
    { name: "Allocated", value: "$55,000", icon: TrendingUp, color: "text-primary", bg: "bg-primary/10", border: "border-primary/20" },
    { name: "Remaining", value: "$45,000", icon: TrendingDown, color: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/20" },
];

const transactions = [
    { id: "TX-101", event: "TechNova 2024", amount: "$15,000", date: "2024-06-12", status: "Completed" },
    { id: "TX-102", event: "AI Summit", amount: "$10,000", date: "2024-05-28", status: "Completed" },
    { id: "TX-103", event: "GreenTech Challenge", amount: "$5,000", date: "2024-05-15", status: "Processing" },
];

export default function BudgetPage() {
    return (
        <DashboardLayout>
            <div className="space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-white uppercase tracking-tight">Budget Operations</h1>
                        <div className="flex items-center gap-2 mt-2">
                            <div className="w-1.5 h-1.5 bg-primary animate-pulse rounded-full" />
                            <span className="text-[10px] text-white/40 uppercase tracking-[0.2em] font-bold">
                                Monitor sponsorship spending and allocations
                            </span>
                        </div>
                    </div>
                    <button className="btn-secondary flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold">
                        <Download className="w-4 h-4" />
                        Export Report
                    </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {budgetStats.map((stat) => {
                        const Icon = stat.icon;
                        return (
                            <div key={stat.name} className="glass rounded-xl p-6 border border-white/5 hover:border-primary/20 transition-all duration-300">
                                <div className="flex items-center gap-4">
                                    <div className={`p-3 ${stat.bg} ${stat.color} border ${stat.border}`}>
                                        <Icon className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">{stat.name}</p>
                                        <h3 className="text-2xl font-bold text-white">{stat.value}</h3>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="glass rounded-xl p-6 border border-white/5">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-sm font-bold text-white flex items-center gap-2 uppercase tracking-widest">
                                <BarChart3 className="w-4 h-4 text-primary" />
                                Spending Over Time
                            </h2>
                            <select className="bg-black border border-white/5 text-[10px] text-white/40 px-2 py-1 outline-none uppercase tracking-widest font-bold">
                                <option>Last 6 Months</option>
                                <option>This Year</option>
                            </select>
                        </div>
                        <div className="h-48 flex items-end justify-between gap-2 px-2">
                            {[40, 70, 45, 90, 65, 80].map((height, i) => (
                                <div key={i} className="flex-1 space-y-2">
                                    <div
                                        className="w-full bg-primary/20 hover:bg-primary/40 transition-all duration-300 relative group"
                                        style={{ height: `${height}%` }}
                                    >
                                        <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-white text-dark text-[8px] font-bold px-1.5 py-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                            ${height / 10}k
                                        </div>
                                    </div>
                                    <p className="text-[8px] text-center text-white/30 uppercase tracking-widest font-bold">M{i + 1}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="glass rounded-xl p-6 border border-white/5">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-sm font-bold text-white flex items-center gap-2 uppercase tracking-widest">
                                <PieChart className="w-4 h-4 text-primary" />
                                Allocation by Category
                            </h2>
                        </div>
                        <div className="space-y-5">
                            {[
                                { name: "Hackathons", percent: 65, color: "bg-primary" },
                                { name: "Conferences", percent: 20, color: "bg-blue-500" },
                                { name: "Workshops", percent: 15, color: "bg-green-500" },
                            ].map((cat) => (
                                <div key={cat.name} className="space-y-2">
                                    <div className="flex justify-between text-[10px] uppercase tracking-widest font-bold">
                                        <span className="text-white/40">{cat.name}</span>
                                        <span className="text-white">{cat.percent}%</span>
                                    </div>
                                    <div className="w-full bg-white/5 h-1.5 overflow-hidden">
                                        <div className={`${cat.color} h-full shadow-[0_0_8px_rgba(255,92,0,0.3)]`} style={{ width: `${cat.percent}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Transactions */}
                <div className="glass rounded-xl overflow-hidden border border-white/5">
                    <div className="px-6 py-4 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
                        <h2 className="text-sm font-bold text-white uppercase tracking-widest">Recent Transactions</h2>
                        <button className="text-[10px] text-primary hover:text-primary-light font-bold uppercase tracking-widest">View All</button>
                    </div>
                    <div className="divide-y divide-white/5">
                        {transactions.map((tx) => (
                            <div key={tx.id} className="px-6 py-4 flex items-center justify-between hover:bg-white/[0.02] transition-all">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-white/[0.02] border border-white/5">
                                        <ArrowUpRight className="w-5 h-5 text-white/30" />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-bold text-xs uppercase tracking-wider">{tx.event}</h4>
                                        <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold">{tx.date} • {tx.id}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-white font-bold">{tx.amount}</p>
                                    <p className={`text-[8px] uppercase tracking-[0.2em] font-bold ${tx.status === "Completed" ? "text-green-400" : "text-amber-400"
                                        }`}>{tx.status}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
