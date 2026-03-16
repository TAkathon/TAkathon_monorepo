"use client";

import { useState, useEffect } from "react";
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
    Loader2,
    Info
} from "lucide-react";
import { organizerApi } from "@takathon/shared/api";
import { toast } from "sonner";

// ── Mock data for Global Rankings (since backend global stats are pending) ──
const playersData = [
    { rank: 1, name: "AHMED BENALI", level: 24, xp: 48200, hackathons: 12, change: "up", badge: "gold" },
    { rank: 2, name: "SARAH KOUKI", level: 22, xp: 44100, hackathons: 10, change: "up", badge: "silver" },
    { rank: 3, name: "YASSINE DRIDI", level: 21, xp: 42300, hackathons: 11, change: "down", badge: "bronze" },
    { rank: 4, name: "LINA HADDAD", level: 19, xp: 38500, hackathons: 9, change: "same", badge: null },
    { rank: 5, name: "OMAR JEBALI", level: 18, xp: 36200, hackathons: 8, change: "up", badge: null },
];

const orgsData = [
    { rank: 1, name: "INSAT TECH HUB", level: 30, xp: 124500, members: 86, change: "up", badge: "gold" },
    { rank: 2, name: "ESPRIT INNOVATORS", level: 28, xp: 118200, members: 72, change: "up", badge: "silver" },
    { rank: 3, name: "ENSI CODELAB", level: 26, xp: 109800, members: 64, change: "same", badge: "bronze" },
    { rank: 4, name: "ENIT BUILDERS", level: 24, xp: 98400, members: 53, change: "down", badge: null },
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
    const [activeTab, setActiveTab] = useState<"players" | "orgs" | "teams">("players");
    const [hackathons, setHackathons] = useState<any[]>([]);
    const [selectedHackathonId, setSelectedHackathonId] = useState("");
    const [loading, setLoading] = useState(true);
    const [teams, setTeams] = useState<any[]>([]);
    const [teamsLoading, setTeamsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    /* Load hackathons */
    useEffect(() => {
        (async () => {
            try {
                const data = await organizerApi.listMyHackathons();
                setHackathons(data);
                const preferred = data.find((h: any) => h.status === "completed" || h.status === "in_progress");
                setSelectedHackathonId(preferred?.id ?? data[0]?.id ?? "");
            } catch {
                toast.error("Failed to load hackathons");
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    /* Load teams for selected hackathon */
    useEffect(() => {
        if (!selectedHackathonId || activeTab !== "teams") return;
        (async () => {
            try {
                setTeamsLoading(true);
                const data = await organizerApi.getTeams(selectedHackathonId);
                setTeams(data);
            } catch {
                toast.error("Failed to load operation teams");
            } finally {
                setTeamsLoading(false);
            }
        })();
    }, [selectedHackathonId, activeTab]);

    const stats = activeTab === "orgs" ? orgStats : playerStats;
    const globalData = activeTab === "orgs" ? orgsData : playersData;
    
    return (
        <DashboardLayout>
            <div className="max-w-6xl mx-auto space-y-8 pb-12 relative">
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

                {/* Toggle Group */}
                <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-0 bg-[#080808] border border-white/10 rounded-sm p-1">
                        <button
                            onClick={() => setActiveTab("players")}
                            className={`flex items-center gap-2 px-5 py-2.5 text-[10px] font-black uppercase tracking-widest transition-all duration-300 rounded-sm ${activeTab === "players"
                                    ? "bg-primary text-black shadow-glow-sm"
                                    : "text-white/40 hover:text-white/70"
                                }`}
                        >
                            <Swords className="w-3.5 h-3.5" />
                            PLAYERS
                        </button>
                        <button
                            onClick={() => setActiveTab("orgs")}
                            className={`flex items-center gap-2 px-5 py-2.5 text-[10px] font-black uppercase tracking-widest transition-all duration-300 rounded-sm ${activeTab === "orgs"
                                    ? "bg-primary text-black shadow-glow-sm"
                                    : "text-white/40 hover:text-white/70"
                                }`}
                        >
                            <Building2 className="w-3.5 h-3.5" />
                            ORGANIZATIONS
                        </button>
                        <button
                            onClick={() => setActiveTab("teams")}
                            className={`flex items-center gap-2 px-5 py-2.5 text-[10px] font-black uppercase tracking-widest transition-all duration-300 rounded-sm ${activeTab === "teams"
                                    ? "bg-primary text-black shadow-glow-sm"
                                    : "text-white/40 hover:text-white/70"
                                }`}
                        >
                            <Trophy className="w-3.5 h-3.5" />
                            TEAMS BY OP
                        </button>
                    </div>

                    {activeTab === "teams" && hackathons.length > 0 && (
                        <div className="relative min-w-[240px]">
                            <select
                                value={selectedHackathonId}
                                onChange={(e) => setSelectedHackathonId(e.target.value)}
                                className="w-full pl-4 pr-10 py-2.5 bg-[#080808] border border-white/10 text-[10px] font-bold uppercase tracking-widest text-white focus:outline-none focus:border-primary/50 transition-all appearance-none cursor-pointer rounded-sm"
                            >
                                {hackathons.map((h: any) => (
                                    <option key={h.id} value={h.id}>{h.title.toUpperCase()}</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
                        </div>
                    )}
                </div>

                {/* Content based on Active Tab */}
                {activeTab !== "teams" ? (
                    <>
                        {/* Stats Grid */}
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
                                        {globalData.map((entry) => (
                                            <tr key={entry.rank} className="hover:bg-white/[0.02] transition-colors group">
                                                <td className="px-6 py-4">
                                                    <div className={`w-8 h-8 flex items-center justify-center font-black text-xs rounded-sm ${
                                                        entry.badge === 'gold' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 shadow-[0_0_10px_rgba(234,179,8,0.2)]' :
                                                        entry.badge === 'silver' ? 'bg-gray-400/20 text-gray-300 border border-gray-400/30' :
                                                        entry.badge === 'bronze' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' :
                                                        'bg-[#050505] text-white/40 border border-white/10'
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
                                                                <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${entry.name}&backgroundColor=transparent`} alt={entry.name} className="w-full h-full object-cover" />
                                                            </div>
                                                        ) : (
                                                            <div className="w-8 h-8 rounded-sm bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                                                                <Building2 className="w-4 h-4 text-primary" />
                                                            </div>
                                                        )}
                                                        <span className="text-white font-bold text-xs uppercase tracking-wider group-hover:text-primary transition-colors">
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
                                                        {'hackathons' in entry ? entry.hackathons : 'members' in entry ? entry.members : 0}
                                                    </span>
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
                    </>
                ) : (
                    /* Operation Specific Teams Tab */
                    <div className="space-y-6">
                        {teamsLoading ? (
                            <div className="flex flex-col items-center justify-center py-20 border border-white/5 bg-[#080808] rounded-sm">
                                <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
                                <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest">GATHERING TEAM INTEL...</div>
                            </div>
                        ) : teams.length === 0 ? (
                            <div className="bg-[#080808] rounded-sm border border-white/5 p-20 text-center">
                                <Users className="w-12 h-12 text-white/10 mx-auto mb-4" />
                                <div className="text-sm font-bold text-white/30 uppercase tracking-widest">
                                    NO TEAMS DEPLOYED FOR THIS MISSION
                                </div>
                            </div>
                        ) : (
                            <div className="bg-[#080808] rounded-sm overflow-hidden border border-white/5">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="border-b border-primary/20 bg-primary/5">
                                                <th className="px-6 py-4 text-[10px] font-black italic text-primary uppercase tracking-widest w-16">RANK</th>
                                                <th className="px-6 py-4 text-[10px] font-black italic text-primary uppercase tracking-widest">TEAM SQUAD</th>
                                                <th className="px-6 py-4 text-[10px] font-black italic text-primary uppercase tracking-widest text-center">MEMBERS</th>
                                                <th className="px-6 py-4 text-[10px] font-black italic text-primary uppercase tracking-widest text-center">STATUS</th>
                                                <th className="px-6 py-4 text-[10px] font-black italic text-primary uppercase tracking-widest text-right">SCORE</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5">
                                            {teams.map((team: any, idx: number) => (
                                                <tr key={team.id} className="hover:bg-white/[0.02] transition-colors group">
                                                    <td className="px-6 py-4">
                                                        <div className="w-8 h-8 bg-[#050505] text-white/40 border border-white/10 flex items-center justify-center font-black text-xs rounded-sm">
                                                            {idx + 1}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="text-white font-bold text-xs uppercase tracking-wider group-hover:text-primary transition-colors">
                                                            {team.name}
                                                        </div>
                                                        {team.description && (
                                                            <div className="text-[9px] text-white/20 font-bold uppercase tracking-[0.2em] mt-1 truncate max-w-xs">{team.description}</div>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        <span className="text-white/60 font-bold text-xs tracking-wider">
                                                            {team.currentSize ?? team.members?.length ?? "—"} / {team.maxSize ?? "—"}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        <span className="text-[10px] bg-white/5 border border-white/10 px-2 py-0.5 text-white/40 font-bold uppercase tracking-widest rounded-sm">
                                                            {team.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <span className="text-white/20 font-black italic text-lg tracking-tighter">—</span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="px-6 py-3 bg-white/[0.02] text-[9px] text-white/20 flex items-center gap-2 font-bold uppercase tracking-widest">
                                    <Info size={12} className="text-primary/60" />
                                    SCORING PROTOCOLS WILL BE INITIALIZED UPON MISSION COMPLETION
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
