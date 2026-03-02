"use client";

import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import {
    Search,
    Filter,
    MoreVertical,
    Users,
    User,
    Trophy,
    MessageSquare,
    ChevronDown,
    Plus,
    CheckCircle2,
    Shield
} from "lucide-react";

const teams = [
    {
        id: 1,
        name: "CyberSentinels",
        hackathon: "AI Global Summit",
        members: 4,
        maxMembers: 4,
        captain: "Alex Rivera",
        project: "AI-Powered Threat Detection",
        status: "Complete",
    },
    {
        id: 2,
        name: "Web3 Wizards",
        hackathon: "Web3 Innovation Hack",
        members: 2,
        maxMembers: 4,
        captain: "Sarah Chen",
        project: "Decentralized Governance",
        status: "Recruiting",
    },
    {
        id: 3,
        name: "Neural Ninjas",
        hackathon: "AI Global Summit",
        members: 3,
        maxMembers: 4,
        captain: "James Wilson",
        project: "Health-Tech AI",
        status: "Complete",
    },
];

export default function TeamsPage() {
    const [searchQuery, setSearchQuery] = useState("");

    return (
        <DashboardLayout>
            <div className="space-y-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-white uppercase tracking-tight">Squad Cadre</h1>
                        <div className="flex items-center gap-2 mt-2">
                            <div className="w-1.5 h-1.5 bg-primary animate-pulse rounded-full" />
                            <span className="text-[10px] text-white/40 uppercase tracking-[0.2em] font-bold">
                                Manage squad formations and mission assignments
                            </span>
                        </div>
                    </div>
                    <button className="btn-primary flex items-center justify-center gap-2 text-[10px] uppercase tracking-widest font-bold">
                        <Plus className="w-4 h-4" />
                        <span>Deploy Manual Squad</span>
                    </button>
                </div>

                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search by squad name or mission..."
                            className="w-full pl-10 pr-4 py-3 bg-black border border-white/5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-primary/30 transition-all font-medium tracking-wide"
                        />
                    </div>
                    <div className="relative min-w-[200px]">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                        <select className="w-full pl-10 pr-8 py-3 bg-black border border-white/5 text-sm text-white appearance-none cursor-pointer focus:outline-none focus:border-primary/30 transition-all font-medium tracking-wide">
                            <option>All Operations</option>
                            <option>AI Global Summit</option>
                            <option>Web3 Innovation Hack</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
                    </div>
                </div>

                {/* Teams Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {teams.map((team) => (
                        <div key={team.id} className="glass rounded-xl p-6 border border-white/5 hover:border-primary/20 transition-all duration-300 group flex flex-col">
                            <div className="flex items-start justify-between">
                                <div className="p-3 bg-primary/10 border border-primary/20 text-primary">
                                    <Users className="w-6 h-6" />
                                </div>
                                <button className="p-2 text-white/30 hover:text-white hover:bg-white/5 transition-all">
                                    <MoreVertical className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="mt-4">
                                <h3 className="text-lg font-bold text-white group-hover:text-primary-light transition-colors uppercase tracking-wider">{team.name}</h3>
                                <p className="text-[10px] text-white/40 mt-1 uppercase tracking-widest font-bold">{team.hackathon}</p>
                            </div>

                            <div className="mt-6 space-y-4 flex-1">
                                <div className="flex items-center justify-between text-[10px] uppercase tracking-widest font-bold">
                                    <span className="text-white/40">Members</span>
                                    <div className="flex items-center gap-1.5">
                                        <div className="flex -space-x-2">
                                            {[...Array(team.members)].map((_, i) => (
                                                <div key={i} className="w-6 h-6 bg-primary/20 border border-[#050505] flex items-center justify-center text-[8px] text-primary font-black">
                                                    {i === 0 ? team.captain.charAt(0) : <User className="w-3 h-3" />}
                                                </div>
                                            ))}
                                            {[...Array(team.maxMembers - team.members)].map((_, i) => (
                                                <div key={i} className="w-6 h-6 bg-white/5 border border-[#050505] flex items-center justify-center text-[8px] text-white/20">
                                                    +
                                                </div>
                                            ))}
                                        </div>
                                        <span className="text-white font-bold ml-1">{team.members}/{team.maxMembers}</span>
                                    </div>
                                </div>

                                <div className="p-3 bg-white/[0.02] border border-white/5">
                                    <div className="text-[8px] uppercase tracking-[0.2em] text-white/30 font-bold mb-1">Current Mission</div>
                                    <div className="text-xs text-white/80 font-bold uppercase tracking-wider line-clamp-1">{team.project}</div>
                                </div>

                                <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold">
                                    <Shield className="w-3.5 h-3.5 text-primary" />
                                    <span className="text-white/40">Captain:</span>
                                    <span className="text-white">{team.captain}</span>
                                </div>
                            </div>

                            <div className="mt-6 pt-6 border-t border-white/5 flex items-center justify-between">
                                <span className={`flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest border ${team.status === "Complete" ? "bg-green-500/10 text-green-400 border-green-500/20" : "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                                    }`}>
                                    {team.status === "Complete" ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Users className="w-3.5 h-3.5" />}
                                    {team.status}
                                </span>
                                <button className="text-white/30 hover:text-white transition-all">
                                    <MessageSquare className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </DashboardLayout>
    );
}
