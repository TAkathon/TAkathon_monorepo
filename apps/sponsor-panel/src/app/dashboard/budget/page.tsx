"use client";

import DashboardLayout from "@/components/DashboardLayout";
import { 
    Wallet, 
    TrendingUp, 
    TrendingDown, 
    ArrowUpRight,
    PieChart,
    BarChart3,
    Calendar,
    Download
} from "lucide-react";

const budgetStats = [
    {
        name: "Total Budget",
        value: "$100,000",
        icon: Wallet,
        color: "text-blue-500",
        bg: "bg-blue-500/10",
    },
    {
        name: "Allocated",
        value: "$55,000",
        icon: TrendingUp,
        color: "text-primary",
        bg: "bg-primary/10",
    },
    {
        name: "Remaining",
        value: "$45,000",
        icon: TrendingDown,
        color: "text-green-500",
        bg: "bg-green-500/10",
    },
];

const transactions = [
    {
        id: "TX-101",
        event: "TechNova 2024",
        amount: "$15,000",
        date: "2024-06-12",
        status: "Completed",
    },
    {
        id: "TX-102",
        event: "AI Summit",
        amount: "$10,000",
        date: "2024-05-28",
        status: "Completed",
    },
    {
        id: "TX-103",
        event: "GreenTech Challenge",
        amount: "$5,000",
        date: "2024-05-15",
        status: "Processing",
    },
];

export default function BudgetPage() {
    return (
        <DashboardLayout>
            <div className="space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">Budget Tracking</h1>
                        <p className="text-white/60">Monitor your sponsorship spending and allocations.</p>
                    </div>
                    <button className="btn-secondary flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        Export Report
                    </button>
                </div>

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

                {/* Charts & Breakdown */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="glass rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <BarChart3 className="w-5 h-5 text-primary" />
                                Spending Over Time
                            </h2>
                            <select className="bg-white/5 border border-white/10 rounded-lg text-xs text-white/60 px-2 py-1 outline-none">
                                <option>Last 6 Months</option>
                                <option>This Year</option>
                            </select>
                        </div>
                        <div className="h-64 flex items-end justify-between gap-2 px-2">
                            {[40, 70, 45, 90, 65, 80].map((height, i) => (
                                <div key={i} className="flex-1 space-y-2">
                                    <div 
                                        className="w-full bg-primary/20 hover:bg-primary/40 rounded-t-lg transition-all duration-300 relative group"
                                        style={{ height: `${height}%` }}
                                    >
                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-dark text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                            ${height/10}k
                                        </div>
                                    </div>
                                    <p className="text-[10px] text-center text-white/40">Month {i+1}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="glass rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <PieChart className="w-5 h-5 text-primary" />
                                Allocation by Category
                            </h2>
                        </div>
                        <div className="space-y-6">
                            {[
                                { name: "Hackathons", percent: 65, color: "bg-primary" },
                                { name: "Conferences", percent: 20, color: "bg-blue-500" },
                                { name: "Workshops", percent: 15, color: "bg-green-500" },
                            ].map((cat) => (
                                <div key={cat.name} className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-white/60">{cat.name}</span>
                                        <span className="text-white font-medium">{cat.percent}%</span>
                                    </div>
                                    <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                                        <div className={`${cat.color} h-full rounded-full`} style={{ width: `${cat.percent}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Recent Transactions */}
                <div className="glass rounded-2xl overflow-hidden">
                    <div className="px-6 py-4 border-b border-white/10 bg-white/5 flex items-center justify-between">
                        <h2 className="text-xl font-bold text-white">Recent Transactions</h2>
                        <button className="text-sm text-primary hover:underline">View All</button>
                    </div>
                    <div className="divide-y divide-white/5">
                        {transactions.map((tx) => (
                            <div key={tx.id} className="px-6 py-4 flex items-center justify-between hover:bg-white/5 transition-all">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 rounded-lg bg-white/5">
                                        <ArrowUpRight className="w-5 h-5 text-white/40" />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-medium">{tx.event}</h4>
                                        <p className="text-xs text-white/40">{tx.date} • {tx.id}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-white font-bold">{tx.amount}</p>
                                    <p className={`text-[10px] uppercase tracking-widest font-bold ${
                                        tx.status === "Completed" ? "text-green-500" : "text-amber-500"
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
