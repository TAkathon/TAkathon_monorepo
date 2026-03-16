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
    Minus,
    Zap,
    Building2,
    Swords,
} from "lucide-react";

// ── Player leaderboard data ──────────────────────────────────────────
const playersData = [
    { rank: 1, name: "AHMED BENALI", level: 24, xp: 48200, hackathons: 12, change: "up", badge: "gold" },
    { rank: 2, name: "SARAH KOUKI", level: 22, xp: 44100, hackathons: 10, change: "up", badge: "silver" },
    { rank: 3, name: "YASSINE DRIDI", level: 21, xp: 42300, hackathons: 11, change: "down", badge: "bronze" },
    { rank: 4, name: "LINA HADDAD", level: 19, xp: 38500, hackathons: 9, change: "same", badge: null },
    { rank: 5, name: "OMAR JEBALI", level: 18, xp: 36200, hackathons: 8, change: "up", badge: null },
    { rank: 6, name: "NOUR SLIM", level: 17, xp: 34800, hackathons: 7, change: "down", badge: null },
    { rank: 7, name: "KARIM MAALEJ", level: 16, xp: 32100, hackathons: 9, change: "same", badge: null },
    { rank: 8, name: "AMIRA TRABELSI", level: 15, xp: 30500, hackathons: 6, change: "up", badge: null },
    { rank: 9, name: "MEHDI CHAABANE", level: 14, xp: 28900, hackathons: 7, change: "down", badge: null },
    { rank: 10, name: "FATMA AYED", level: 13, xp: 26400, hackathons: 5, change: "up", badge: null },
];

// ── Organization leaderboard data ────────────────────────────────────
const orgsData = [
    { rank: 1, name: "INSAT TECH HUB", level: 30, xp: 124500, members: 86, change: "up", badge: "gold" },
    { rank: 2, name: "ESPRIT INNOVATORS", level: 28, xp: 118200, members: 72, change: "up", badge: "silver" },
    { rank: 3, name: "ENSI CODELAB", level: 26, xp: 109800, members: 64, change: "same", badge: "bronze" },
    { rank: 4, name: "ENIT BUILDERS", level: 24, xp: 98400, members: 53, change: "down", badge: null },
    { rank: 5, name: "FST DIGITAL", level: 22, xp: 89200, members: 48, change: "up", badge: null },
    { rank: 6, name: "SUPCOM NEXUS", level: 21, xp: 84600, members: 41, change: "same", badge: null },
    { rank: 7, name: "ISI DEVS", level: 19, xp: 76300, members: 35, change: "up", badge: null },
    { rank: 8, name: "ISIMM CODERS", level: 18, xp: 71100, members: 29, change: "down", badge: null },
];

const playerStats = [
    { label: "TOTAL OPERATIVES", value: "1,247", icon: Users },
    { label: "AVERAGE LEVEL", value: "14", icon: TrendingUp },
    { label: "TOP XP", value: "48,200", icon: Zap },
    { label: "ACTIVE REGIONS", value: "5", icon: Star },
];

const orgStats = [
    { label: "TOTAL ORGS", value: "38", icon: Building2 },
    { label: "AVERAGE LEVEL", value: "18", icon: TrendingUp },
    { label: "TOP XP", value: "124,500", icon: Zap },
    { label: "TOTAL MEMBERS", value: "428", icon: Users },
];

export default function LeaderboardPage() {
    const [activeTab, setActiveTab] = useState<"players" | "orgs">("players");
    const [selectedFilter, setSelectedFilter] = useState("ALL REGIONS");

    const data = activeTab === "players" ? playersData : orgsData;
    const stats = activeTab === "players" ? playerStats : orgStats;

    return (
        <DashboardLayout>
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
                                GLOBAL RANKING AND PERFORMANCE METRICS
                            </span>
                        </div>
                    </div>
                </div>

                {/* Toggle */}
                <div className="flex items-center gap-0 bg-[#080808] border border-white/10 rounded-sm p-1 w-fit">
                    <button
                        onClick={() => setActiveTab("players")}
                        className={`flex items-center gap-2 px-5 py-2.5 text-[10px] font-black uppercase tracking-widest transition-all duration-300 rounded-sm ${activeTab === "players"
                                ? "bg-primary text-black shadow-[0_0_15px_rgba(var(--color-primary-rgb,0,255,136),0.3)]"
                                : "text-white/40 hover:text-white/70"
                            }`}
                    >
                        <Swords className="w-3.5 h-3.5" />
                        PLAYERS
                    </button>
                    <button
                        onClick={() => setActiveTab("orgs")}
                        className={`flex items-center gap-2 px-5 py-2.5 text-[10px] font-black uppercase tracking-widest transition-all duration-300 rounded-sm ${activeTab === "orgs"
                                ? "bg-primary text-black shadow-[0_0_15px_rgba(var(--color-primary-rgb,0,255,136),0.3)]"
                                : "text-white/40 hover:text-white/70"
                            }`}
                    >
                        <Building2 className="w-3.5 h-3.5" />
                        ORGANIZATIONS
                    </button>
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
                            placeholder={activeTab === "players" ? "SEARCH OPERATIVES..." : "SEARCH ORGANIZATIONS..."}
                            className="w-full pl-12 pr-4 py-3 bg-[#080808] border border-white/10 text-[10px] font-bold uppercase tracking-widest text-white placeholder:text-white/30 focus:outline-none focus:border-primary/50 transition-all rounded-sm"
                        />
                    </div>
                    <div className="relative min-w-[200px]">
                        <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                        <select
                            value={selectedFilter}
                            onChange={(e) => setSelectedFilter(e.target.value)}
                            className="w-full pl-12 pr-8 py-3 bg-[#080808] border border-white/10 text-[10px] font-bold uppercase tracking-widest text-white focus:outline-none focus:border-primary/50 transition-all appearance-none cursor-pointer rounded-sm"
                        >
                            <option value="ALL REGIONS">ALL REGIONS</option>
                            <option>TUNIS</option>
                            <option>SOUSSE</option>
                            <option>SFAX</option>
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
                                    <th className="px-6 py-4 text-[10px] font-black italic text-primary uppercase tracking-widest">
                                        {activeTab === "players" ? "OPERATIVE" : "ORGANIZATION"}
                                    </th>
                                    <th className="px-6 py-4 text-[10px] font-black italic text-primary uppercase tracking-widest">LEVEL</th>
                                    <th className="px-6 py-4 text-[10px] font-black italic text-primary uppercase tracking-widest text-right">XP</th>
                                    <th className="px-6 py-4 text-[10px] font-black italic text-primary uppercase tracking-widest text-center">
                                        {activeTab === "players" ? "HACKATHONS" : "MEMBERS"}
                                    </th>
                                    <th className="px-6 py-4 text-[10px] font-black italic text-primary uppercase tracking-widest text-center">TREND</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {data.map((entry) => (
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
                                            <div className="flex items-center gap-3">
                                                {activeTab === "players" ? (
                                                    <div className="w-8 h-8 rounded-full overflow-hidden border border-white/10 bg-white/5 flex-shrink-0">
                                                        <img
                                                            src={`https://api.dicebear.com/7.x/notionists/svg?seed=${entry.name}&backgroundColor=transparent`}
                                                            alt={entry.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className="w-8 h-8 rounded-sm bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                                                        <Building2 className="w-4 h-4 text-primary" />
                                                    </div>
                                                )}
                                                <span className="text-white font-bold text-xs uppercase tracking-wider group-hover:text-primary-light transition-colors">
                                                    {entry.name}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-primary/10 border border-primary/20 rounded-sm">
                                                <Star className="w-3 h-3 text-primary" />
                                                <span className="text-[10px] font-black text-primary tracking-widest">LVL {entry.level}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-1.5">
                                                <Zap className="w-3 h-3 text-yellow-400" />
                                                <span className="text-white font-black italic tracking-tighter text-xl">{entry.xp.toLocaleString()}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="text-white/60 font-bold text-xs tracking-wider">
                                                {activeTab === "players"
                                                    ? (entry as typeof playersData[0]).hackathons
                                                    : (entry as typeof orgsData[0]).members}
                                            </span>
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
        </DashboardLayout>
    );
}
