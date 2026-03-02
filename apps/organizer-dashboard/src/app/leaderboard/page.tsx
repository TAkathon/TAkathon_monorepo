"use client";

import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import {
    Trophy,
    Medal,
    Search,
    Filter,
    ChevronDown,
    Crown,
    Star,
    TrendingUp,
    Users,
    ArrowUp,
    ArrowDown,
    Minus
} from "lucide-react";

const leaderboardData = [
    { rank: 1, team: "CyberSentinels", hackathon: "AI Global Summit", score: 9450, members: 4, change: "up", badge: "gold" },
    { rank: 2, team: "Neural Ninjas", hackathon: "AI Global Summit", score: 9120, members: 3, change: "up", badge: "silver" },
    { rank: 3, team: "DataForge", hackathon: "AI Global Summit", score: 8890, members: 4, change: "down", badge: "bronze" },
    { rank: 4, team: "QuantumLeap", hackathon: "Web3 Innovation Hack", score: 8540, members: 4, change: "same", badge: null },
    { rank: 5, team: "Web3 Wizards", hackathon: "Web3 Innovation Hack", score: 8210, members: 2, change: "up", badge: null },
    { rank: 6, team: "ByteBusters", hackathon: "AI Global Summit", score: 7980, members: 4, change: "down", badge: null },
    { rank: 7, team: "CodeCrafters", hackathon: "Web3 Innovation Hack", score: 7650, members: 3, change: "same", badge: null },
    { rank: 8, team: "PixelPioneers", hackathon: "AI Global Summit", score: 7320, members: 4, change: "up", badge: null },
];

const stats = [
    { label: "Total Squads", value: "342", icon: Users },
    { label: "Average Score", value: "7,890", icon: TrendingUp },
    { label: "Top Score", value: "9,450", icon: Trophy },
    { label: "Active Competitions", value: "3", icon: Star },
];

export default function LeaderboardPage() {
    const [selectedHackathon, setSelectedHackathon] = useState("All");

    return (
        <DashboardLayout>
            <div className="space-y-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-white uppercase tracking-tight">Rankings</h1>
                        <div className="flex items-center gap-2 mt-2">
                            <div className="w-1.5 h-1.5 bg-primary animate-pulse rounded-full" />
                            <span className="text-[10px] text-white/40 uppercase tracking-[0.2em] font-bold">
                                Global scoring and squad performance metrics
                            </span>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {stats.map((stat) => {
                        const Icon = stat.icon;
                        return (
                            <div key={stat.label} className="glass rounded-xl p-5 border border-white/5 hover:border-primary/20 transition-all duration-300">
                                <Icon className="w-5 h-5 text-primary mb-3" />
                                <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold mb-1">{stat.label}</p>
                                <p className="text-2xl font-bold text-white">{stat.value}</p>
                            </div>
                        );
                    })}
                </div>

                {/* Filter */}
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                        <input
                            type="text"
                            placeholder="Search squads..."
                            className="w-full pl-10 pr-4 py-3 bg-black border border-white/5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-primary/30 transition-all font-medium tracking-wide"
                        />
                    </div>
                    <div className="relative min-w-[200px]">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                        <select
                            value={selectedHackathon}
                            onChange={(e) => setSelectedHackathon(e.target.value)}
                            className="w-full pl-10 pr-8 py-3 bg-black border border-white/5 text-sm text-white appearance-none cursor-pointer focus:outline-none focus:border-primary/30 transition-all font-medium tracking-wide"
                        >
                            <option value="All">All Operations</option>
                            <option>AI Global Summit</option>
                            <option>Web3 Innovation Hack</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
                    </div>
                </div>

                {/* Leaderboard Table */}
                <div className="glass rounded-xl overflow-hidden border border-white/5">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/5 bg-white/[0.02]">
                                    <th className="px-6 py-4 text-[10px] font-bold text-white/30 uppercase tracking-widest w-16">Rank</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-white/30 uppercase tracking-widest">Squad</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-white/30 uppercase tracking-widest">Operation</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-white/30 uppercase tracking-widest">Members</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-white/30 uppercase tracking-widest text-right">Score</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-white/30 uppercase tracking-widest text-center">Trend</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {leaderboardData.map((entry) => (
                                    <tr key={entry.rank} className="hover:bg-white/[0.02] transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className={`w-8 h-8 flex items-center justify-center font-black text-xs ${entry.badge === "gold" ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30" :
                                                    entry.badge === "silver" ? "bg-gray-400/20 text-gray-300 border border-gray-400/30" :
                                                        entry.badge === "bronze" ? "bg-orange-500/20 text-orange-400 border border-orange-500/30" :
                                                            "bg-white/5 text-white/40 border border-white/5"
                                                }`}>
                                                {entry.badge === "gold" ? <Crown className="w-4 h-4" /> :
                                                    entry.badge === "silver" ? <Medal className="w-4 h-4" /> :
                                                        entry.badge === "bronze" ? <Medal className="w-4 h-4" /> :
                                                            entry.rank}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-white font-bold text-xs uppercase tracking-wider group-hover:text-primary-light transition-colors">{entry.team}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold">{entry.hackathon}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex -space-x-1.5">
                                                {[...Array(entry.members)].map((_, i) => (
                                                    <div key={i} className="w-5 h-5 bg-primary/20 border border-[#050505] flex items-center justify-center text-[8px] text-primary font-black">
                                                        {i + 1}
                                                    </div>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <span className="text-white font-bold text-sm tracking-tight">{entry.score.toLocaleString()}</span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {entry.change === "up" ? <ArrowUp className="w-4 h-4 text-green-400 mx-auto" /> :
                                                entry.change === "down" ? <ArrowDown className="w-4 h-4 text-red-400 mx-auto" /> :
                                                    <Minus className="w-4 h-4 text-white/30 mx-auto" />}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
