"use client";

import Link from "next/link";
import DashboardLayout from "@/components/DashboardLayout";
import {
    Calendar,
    DollarSign,
    TrendingUp,
    ArrowUpRight,
    Clock,
    Trophy,
    Users,
    CheckCircle2,
    AlertCircle,
    ChevronRight
} from "lucide-react";
import { useAuthStore } from "@shared/utils";

const stats = [
    { name: "Sponsored Events", value: "8", change: "+2", icon: Calendar },
    { name: "Total Investment", value: "$55K", change: "+15%", icon: DollarSign },
    { name: "Active Sponsorships", value: "3", change: "0", icon: Trophy },
    { name: "Brand Impressions", value: "45.2K", change: "+28%", icon: TrendingUp },
];

const recentPerformance = [
    { event: "TechNova 2024", amount: "$15,000", status: "Completed", roi: "+340%", impressions: "12.4K" },
    { event: "AI Summit", amount: "$10,000", status: "Active", roi: "+180%", impressions: "8.7K" },
    { event: "GreenTech Challenge", amount: "$5,000", status: "Processing", roi: "Pending", impressions: "3.2K" },
];

export default function SponsorOverview() {
    const { user } = useAuthStore();
    return (
        <DashboardLayout>
            <div className="space-y-10">
                {/* Welcome */}
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">
                        Welcome back, <span className="text-primary-light">{user?.fullName?.split(' ')[0] || 'Commander'}</span>!
                    </h1>
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-primary animate-pulse rounded-full" />
                        <span className="text-[10px] text-white/40 uppercase tracking-[0.2em] font-bold">
                            System Online • Sponsor Command Center
                        </span>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {stats.map((stat) => {
                        const Icon = stat.icon;
                        return (
                            <div key={stat.name} className="glass rounded-xl p-6 hover:bg-white/10 border border-white/5 hover:border-primary/20 transition-all duration-500 group">
                                <div className="flex items-center justify-between mb-4">
                                    <Icon className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 bg-green-500/10 text-green-400 rounded-sm">
                                        <ArrowUpRight className="w-3 h-3 inline mr-0.5" />
                                        {stat.change}
                                    </span>
                                </div>
                                <p className="text-white/40 text-[10px] uppercase tracking-widest font-bold mb-1">{stat.name}</p>
                                <p className="text-3xl font-bold text-white tracking-tight">{stat.value}</p>
                            </div>
                        );
                    })}
                </div>

                {/* Performance Table */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-white uppercase tracking-tight">Sponsorship Intel</h2>
                        <Link href="/dashboard/budget" className="text-[10px] font-bold text-primary uppercase tracking-widest hover:text-primary-light transition-colors">
                            Full Report →
                        </Link>
                    </div>
                    <div className="glass rounded-xl overflow-hidden border border-white/5">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/5 bg-white/[0.02]">
                                    <th className="px-6 py-4 text-[10px] font-bold text-white/30 uppercase tracking-widest">Event</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-white/30 uppercase tracking-widest">Amount</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-white/30 uppercase tracking-widest">Status</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-white/30 uppercase tracking-widest">ROI</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-white/30 uppercase tracking-widest text-right">Impressions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {recentPerformance.map((item) => (
                                    <tr key={item.event} className="hover:bg-white/[0.02] transition-colors group">
                                        <td className="px-6 py-4 text-white font-bold text-xs uppercase tracking-wider group-hover:text-primary-light transition-colors">{item.event}</td>
                                        <td className="px-6 py-4 text-white text-sm font-bold">{item.amount}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest border ${item.status === "Completed" ? "bg-green-500/10 text-green-400 border-green-500/20" :
                                                    item.status === "Active" ? "bg-primary/10 text-primary border-primary/20" :
                                                        "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                                                }`}>
                                                {item.status === "Completed" ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                                                {item.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-green-400 font-bold text-xs uppercase tracking-wider">{item.roi}</td>
                                        <td className="px-6 py-4 text-white/60 font-bold text-xs text-right uppercase tracking-wider">{item.impressions}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="glass rounded-xl p-8 border border-white/5">
                    <h2 className="text-xl font-bold text-white mb-6 uppercase tracking-tight">Quick Actions</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <Link href="/dashboard/opportunities" className="p-6 bg-white/[0.02] border border-white/5 hover:border-primary/20 hover:bg-white/5 rounded-xl text-left transition-all duration-300 group">
                            <Calendar className="w-8 h-8 text-primary mb-4 group-hover:scale-110 transition-all" />
                            <p className="font-bold text-white mb-1 uppercase text-xs tracking-wider">Discover Ops</p>
                            <p className="text-[10px] text-white/40 uppercase tracking-widest font-medium">Find events seeking sponsors</p>
                        </Link>
                        <Link href="/dashboard/requests" className="p-6 bg-white/[0.02] border border-white/5 hover:border-primary/20 hover:bg-white/5 rounded-xl text-left transition-all duration-300 group">
                            <Users className="w-8 h-8 text-primary mb-4 group-hover:scale-110 transition-all" />
                            <p className="font-bold text-white mb-1 uppercase text-xs tracking-wider">View Requests</p>
                            <p className="text-[10px] text-white/40 uppercase tracking-widest font-medium">Manage sponsorship requests</p>
                        </Link>
                        <Link href="/dashboard/talent" className="p-6 bg-white/[0.02] border border-white/5 hover:border-primary/20 hover:bg-white/5 rounded-xl text-left transition-all duration-300 group">
                            <Trophy className="w-8 h-8 text-primary mb-4 group-hover:scale-110 transition-all" />
                            <p className="font-bold text-white mb-1 uppercase text-xs tracking-wider">Talent Radar</p>
                            <p className="text-[10px] text-white/40 uppercase tracking-widest font-medium">Browse top talent CVs</p>
                        </Link>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
