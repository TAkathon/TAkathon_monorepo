"use client";

import { useState } from "react";
import OrganizerLayout from "@/components/OrganizerLayout";
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
    { rank: 1, team: "CYBERSENTINELS", hackathon: "AI GLOBAL SUMMIT", score: 9450, members: 4, change: "up", badge: "gold" },
    { rank: 2, team: "NEURAL NINJAS", hackathon: "AI GLOBAL SUMMIT", score: 9120, members: 3, change: "up", badge: "silver" },
    { rank: 3, team: "DATAFORGE", hackathon: "AI GLOBAL SUMMIT", score: 8890, members: 4, change: "down", badge: "bronze" },
    { rank: 4, team: "QUANTUMLEAP", hackathon: "WEB3 INNOVATION", score: 8540, members: 4, change: "same", badge: null },
    { rank: 5, team: "WEB3 WIZARDS", hackathon: "WEB3 INNOVATION", score: 8210, members: 2, change: "up", badge: null },
    { rank: 6, team: "BYTEBUSTERS", hackathon: "AI GLOBAL SUMMIT", score: 7980, members: 4, change: "down", badge: null },
    { rank: 7, team: "CODECRAFTERS", hackathon: "WEB3 INNOVATION", score: 7650, members: 3, change: "same", badge: null },
    { rank: 8, team: "PIXELPIONEERS", hackathon: "AI GLOBAL SUMMIT", score: 7320, members: 4, change: "up", badge: null },
];

const stats = [
    { label: "TOTAL SQUADS", value: "342", icon: Users },
    { label: "AVERAGE SCORE", value: "7,890", icon: TrendingUp },
    { label: "TOP SCORE", value: "9,450", icon: Trophy },
    { label: "ACTIVE REGIONS", value: "3", icon: Star },
];

export default function LeaderboardPage() {
    const [selectedHackathon, setSelectedHackathon] = useState("ALL OPERATIONS");

    return (
        <OrganizerLayout>
            <div className="max-w-6xl mx-auto space-y-8 pb-12">
                {/* Background Floating Objects */}
                <div className="absolute top-20 right-10 w-32 h-32 bg-primary/20 rounded-full blur-[80px] pointer-events-none"></div>

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div>
                        <div className="flex items-center relative mb-1">
                            <h1 className="text-5xl md:text-6xl font-black italic tracking-tighter uppercase text-white">
                                <span className="text-white">RANKINGS</span>
                            </h1>
                            <div className="flex ml-4 gap-1 opacity-60 mt-2">
                                <div className="w-8 h-1 bg-primary"></div>
                                <div className="w-2 h-1 bg-primary"></div>
                                <div className="w-1 h-1 bg-primary"></div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 mt-4 mb-2">
                            <div className="w-2 h-2 bg-green-500 rounded-sm" />
                            <span className="text-[10px] text-white/60 uppercase tracking-[0.2em] font-bold">
                                GLOBAL SCORING AND SQUAD PERFORMANCE METRICS
                            </span>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {stats.map((stat) => {
                        const Icon = stat.icon;
                        return (
                            <div key={stat.label} className="relative p-6 border border-white/5 bg-[#080808] rounded-sm group hover:border-white/10 transition-all duration-300">
                                <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-primary opacity-50 group-hover:opacity-100 transition-opacity"></div>
                                <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-primary opacity-50 group-hover:opacity-100 transition-opacity"></div>

                                <Icon className="w-5 h-5 text-primary mb-3" />
                                <p className="text-[10px] text-white/50 uppercase tracking-widest font-bold mb-1">{stat.label}</p>
                                <p className="text-3xl font-black text-white tracking-tighter">{stat.value}</p>
                            </div>
                        );
                    })}
                </div>

                {/* Filter */}
                <div className="flex flex-col md:flex-row gap-4 pt-4 border-t border-white/5">
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                        <input
                            type="text"
                            placeholder="SEARCH SQUADS..."
                            className="w-full pl-12 pr-4 py-3 bg-[#080808] border border-white/10 text-[10px] font-bold uppercase tracking-widest text-white placeholder:text-white/30 focus:outline-none focus:border-primary/50 transition-all rounded-sm"
                        />
                    </div>
                    <div className="relative min-w-[200px]">
                        <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                        <select
                            value={selectedHackathon}
                            onChange={(e) => setSelectedHackathon(e.target.value)}
                            className="w-full pl-12 pr-8 py-3 bg-[#080808] border border-white/10 text-[10px] font-bold uppercase tracking-widest text-white focus:outline-none focus:border-primary/50 transition-all appearance-none cursor-pointer rounded-sm"
                        >
                            <option value="ALL OPERATIONS">ALL OPERATIONS</option>
                            <option>AI GLOBAL SUMMIT</option>
                            <option>WEB3 INNOVATION HACK</option>
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
                    </div>
                </div>

                {/* Leaderboard Table */}
                <div className="bg-[#080808] rounded-sm overflow-hidden border border-white/5">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-primary/20 bg-primary/5">
                                    <th className="px-6 py-4 text-[10px] font-black italic text-primary uppercase tracking-widest w-16">RANK</th>
                                    <th className="px-6 py-4 text-[10px] font-black italic text-primary uppercase tracking-widest">SQUAD</th>
                                    <th className="px-6 py-4 text-[10px] font-black italic text-primary uppercase tracking-widest">OPERATION</th>
                                    <th className="px-6 py-4 text-[10px] font-black italic text-primary uppercase tracking-widest">MEMBERS</th>
                                    <th className="px-6 py-4 text-[10px] font-black italic text-primary uppercase tracking-widest text-right">SCORE</th>
                                    <th className="px-6 py-4 text-[10px] font-black italic text-primary uppercase tracking-widest text-center">TREND</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {leaderboardData.map((entry) => (
                                    <tr key={entry.rank} className="hover:bg-white/[0.02] transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className={`w-8 h-8 flex items-center justify-center font-black text-xs rounded-sm ${entry.badge === "gold" ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 shadow-[0_0_10px_rgba(234,179,8,0.2)]" :
                                                    entry.badge === "silver" ? "bg-gray-400/20 text-gray-300 border border-gray-400/30 shadow-[0_0_10px_rgba(156,163,175,0.2)]" :
                                                        entry.badge === "bronze" ? "bg-orange-500/20 text-orange-400 border border-orange-500/30 shadow-[0_0_10px_rgba(249,115,22,0.2)]" :
                                                            "bg-[#050505] text-white/40 border border-white/10"
                                                }`}>
                                                {entry.badge === "gold" ? <Crown className="w-4 h-4" /> :
                                                    entry.badge === "silver" || entry.badge === "bronze" ? <Medal className="w-4 h-4" /> :
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
                                                    <div key={i} className="w-5 h-5 bg-primary/20 border-2 border-[#050505] flex items-center justify-center text-[8px] text-primary font-black rounded-sm">
                                                        {i + 1}
                                                    </div>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <span className="text-white font-black italic tracking-tighter text-xl">{entry.score.toLocaleString()}</span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {entry.change === "up" ? <ArrowUp className="w-4 h-4 text-green-400 mx-auto drop-shadow-[0_0_5px_rgba(74,222,128,0.5)]" /> :
                                                entry.change === "down" ? <ArrowDown className="w-4 h-4 text-red-400 mx-auto drop-shadow-[0_0_5px_rgba(248,113,113,0.5)]" /> :
                                                    <Minus className="w-4 h-4 text-white/30 mx-auto" />}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </OrganizerLayout>
    );
}
