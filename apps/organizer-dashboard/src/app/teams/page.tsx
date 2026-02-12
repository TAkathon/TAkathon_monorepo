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
                        <h1 className="text-3xl font-bold text-white">Teams</h1>
                        <p className="text-white/60 mt-1">Manage team formations and projects</p>
                    </div>
                    <button className="btn-primary flex items-center justify-center gap-2">
                        <Plus className="w-5 h-5" />
                        <span>Create Manual Team</span>
                    </button>
                </div>

                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search by team name or project..."
                            className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:border-primary/50 transition-all"
                        />
                    </div>
                    <div className="relative min-w-[200px]">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                        <select className="w-full pl-11 pr-8 py-3 bg-white/5 border border-white/10 rounded-lg text-white appearance-none cursor-pointer focus:outline-none focus:border-primary/50 transition-all">
                            <option>All Hackathons</option>
                            <option>AI Global Summit</option>
                            <option>Web3 Innovation Hack</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
                    </div>
                </div>

                {/* Teams Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {teams.map((team) => (
                        <div key={team.id} className="glass rounded-xl p-6 border border-white/10 hover:border-primary/30 transition-all group flex flex-col">
                            <div className="flex items-start justify-between">
                                <div className="p-3 bg-primary/10 rounded-lg text-primary">
                                    <Users className="w-6 h-6" />
                                </div>
                                <button className="p-2 text-white/40 hover:text-white hover:bg-white/5 rounded-lg transition-all">
                                    <MoreVertical className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="mt-4">
                                <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors">{team.name}</h3>
                                <p className="text-sm text-white/40 mt-1">{team.hackathon}</p>
                            </div>

                            <div className="mt-6 space-y-4 flex-1">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-white/60">Members</span>
                                    <div className="flex items-center gap-1.5">
                                        <div className="flex -space-x-2">
                                            {[...Array(team.members)].map((_, i) => (
                                                <div key={i} className="w-6 h-6 rounded-full bg-primary/20 border border-dark flex items-center justify-center text-[10px] text-primary font-bold">
                                                    {i === 0 ? team.captain.charAt(0) : <User className="w-3 h-3" />}
                                                </div>
                                            ))}
                                            {[...Array(team.maxMembers - team.members)].map((_, i) => (
                                                <div key={i} className="w-6 h-6 rounded-full bg-white/5 border border-dark flex items-center justify-center text-[10px] text-white/20">
                                                    +
                                                </div>
                                            ))}
                                        </div>
                                        <span className="text-white font-medium ml-1">{team.members}/{team.maxMembers}</span>
                                    </div>
                                </div>

                                <div className="p-3 bg-white/5 rounded-lg border border-white/5">
                                    <div className="text-[10px] uppercase tracking-wider text-white/40 font-bold mb-1">Current Project</div>
                                    <div className="text-sm text-white/80 font-medium line-clamp-1">{team.project}</div>
                                </div>

                                <div className="flex items-center gap-2 text-xs">
                                    <Shield className="w-3.5 h-3.5 text-primary" />
                                    <span className="text-white/60">Captain:</span>
                                    <span className="text-white font-medium">{team.captain}</span>
                                </div>
                            </div>

                            <div className="mt-6 pt-6 border-t border-white/10 flex items-center justify-between">
                                <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                                    team.status === "Complete" ? "bg-green-500/10 text-green-400" : "bg-yellow-500/10 text-yellow-400"
                                }`}>
                                    {team.status === "Complete" ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Users className="w-3.5 h-3.5" />}
                                    {team.status}
                                </span>
                                <button className="text-white/40 hover:text-white transition-all">
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
