"use client";

import { useState, useMemo } from "react";
import OrganizerLayout from "@/components/OrganizerLayout";
import {
    Search,
    Filter,
    MoreVertical,
    MapPin,
    Download,
    Clock,
    ChevronDown,
    ChevronRight,
    ExternalLink,
    Crown,
    Users,
    Trophy,
} from "lucide-react";

const participants = [
    {
        id: 1,
        name: "ALEX RIVERA",
        email: "ALEX.R@EXAMPLE.COM",
        role: "FRONTEND DEVELOPER",
        location: "SAN FRANCISCO, US",
        hackathon: "AI GLOBAL SUMMIT",
        team: "NEURAL NEXUS",
        isLeader: true,
        status: "APPROVED",
        appliedDate: "FEB 10, 2026",
        statusColor: "text-green-500",
    },
    {
        id: 2,
        name: "SARAH CHEN",
        email: "S.CHEN@EXAMPLE.COM",
        role: "FULLSTACK DEVELOPER",
        location: "TORONTO, CA",
        hackathon: "AI GLOBAL SUMMIT",
        team: "NEURAL NEXUS",
        isLeader: false,
        status: "APPROVED",
        appliedDate: "FEB 11, 2026",
        statusColor: "text-green-500",
    },
    {
        id: 3,
        name: "JAMES WILSON",
        email: "J.WILSON@EXAMPLE.COM",
        role: "DATA SCIENTIST",
        location: "LONDON, UK",
        hackathon: "AI GLOBAL SUMMIT",
        team: "DEEP THINKERS",
        isLeader: true,
        status: "APPROVED",
        appliedDate: "FEB 09, 2026",
        statusColor: "text-green-500",
    },
    {
        id: 4,
        name: "ELENA PETROVA",
        email: "ELENA.P@EXAMPLE.COM",
        role: "UI/UX DESIGNER",
        location: "BERLIN, DE",
        hackathon: "AI GLOBAL SUMMIT",
        team: "DEEP THINKERS",
        isLeader: false,
        status: "APPROVED",
        appliedDate: "FEB 08, 2026",
        statusColor: "text-green-500",
    },
    {
        id: 5,
        name: "MICHAEL CHANG",
        email: "M.CHANG@EXAMPLE.COM",
        role: "BACKEND DEVELOPER",
        location: "SINGAPORE",
        hackathon: "WEB3 INNOVATION",
        team: "CHAIN BREAKERS",
        isLeader: true,
        status: "APPROVED",
        appliedDate: "FEB 07, 2026",
        statusColor: "text-green-500",
    },
    {
        id: 6,
        name: "PRIYA SHARMA",
        email: "P.SHARMA@EXAMPLE.COM",
        role: "SMART CONTRACT DEV",
        location: "MUMBAI, IN",
        hackathon: "WEB3 INNOVATION",
        team: "CHAIN BREAKERS",
        isLeader: false,
        status: "PENDING",
        appliedDate: "FEB 12, 2026",
        statusColor: "text-primary",
    },
    {
        id: 7,
        name: "LUCAS MARTIN",
        email: "L.MARTIN@EXAMPLE.COM",
        role: "ML ENGINEER",
        location: "PARIS, FR",
        hackathon: "WEB3 INNOVATION",
        team: "DEFI WARRIORS",
        isLeader: true,
        status: "APPROVED",
        appliedDate: "FEB 06, 2026",
        statusColor: "text-green-500",
    },
    {
        id: 8,
        name: "YUKI TANAKA",
        email: "Y.TANAKA@EXAMPLE.COM",
        role: "DEVOPS ENGINEER",
        location: "TOKYO, JP",
        hackathon: "WEB3 INNOVATION",
        team: "DEFI WARRIORS",
        isLeader: false,
        status: "APPROVED",
        appliedDate: "FEB 13, 2026",
        statusColor: "text-green-500",
    },
];

const hackathonOptions = ["ALL HACKATHONS", "AI GLOBAL SUMMIT", "WEB3 INNOVATION"];

export default function ParticipantsPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedHackathon, setSelectedHackathon] = useState("ALL HACKATHONS");
    const [selectedStatus, setSelectedStatus] = useState("ALL STATUS");
    const [collapsedTeams, setCollapsedTeams] = useState<Record<string, boolean>>({});

    const toggleTeam = (team: string) => {
        setCollapsedTeams((prev) => ({ ...prev, [team]: !prev[team] }));
    };

    const filtered = useMemo(() => {
        return participants.filter((p) => {
            const matchesSearch =
                searchQuery === "" ||
                p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.role.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesHackathon =
                selectedHackathon === "ALL HACKATHONS" || p.hackathon === selectedHackathon;
            const matchesStatus =
                selectedStatus === "ALL STATUS" || p.status === selectedStatus;
            return matchesSearch && matchesHackathon && matchesStatus;
        });
    }, [searchQuery, selectedHackathon, selectedStatus]);

    // Group by team
    const teamGroups = useMemo(() => {
        const groups: Record<string, typeof participants> = {};
        filtered.forEach((p) => {
            if (!groups[p.team]) groups[p.team] = [];
            groups[p.team].push(p);
        });
        // Sort so leaders come first within each team
        Object.values(groups).forEach((members) =>
            members.sort((a, b) => (a.isLeader === b.isLeader ? 0 : a.isLeader ? -1 : 1))
        );
        return groups;
    }, [filtered]);

    return (
        <OrganizerLayout>
            <div className="max-w-6xl mx-auto space-y-8 pb-12">
                {/* Background Floating Objects */}
                <div className="absolute top-20 right-20 w-32 h-32 bg-primary/20 rounded-full blur-[80px] pointer-events-none"></div>

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div>
                        <div className="flex items-center relative mb-1">
                            <h1 className="text-5xl md:text-6xl font-black italic tracking-tighter uppercase text-white">
                                <span className="text-white">APPLICANTS</span>
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
                                REVIEW APPLICATIONS AND MANAGE OPERATIVES
                            </span>
                        </div>
                    </div>
                    <button className="flex items-center justify-center gap-2 px-6 py-3 bg-transparent text-white border border-white/20 hover:border-white/40 hover:bg-white/5 transition-all active:scale-[0.98] rounded-sm text-[10px] font-bold tracking-widest uppercase mt-4">
                        <Download className="w-4 h-4" />
                        <span>EXPORT ROSTER</span>
                    </button>
                </div>

                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-4 pt-4 border-t border-white/5">
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="SEARCH BY CALLSIGN, EMAIL, OR SPECIALIZATION..."
                            className="w-full pl-12 pr-4 py-3 bg-[#080808] border border-white/10 text-[10px] font-bold uppercase tracking-widest text-white placeholder:text-white/30 focus:outline-none focus:border-primary/50 transition-all rounded-sm"
                        />
                    </div>
                    <div className="flex gap-4">
                        {/* Hackathon filter */}
                        <div className="relative min-w-[220px]">
                            <Trophy className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                            <select
                                value={selectedHackathon}
                                onChange={(e) => setSelectedHackathon(e.target.value)}
                                className="w-full pl-12 pr-8 py-3 bg-[#080808] border border-white/10 text-[10px] font-bold uppercase tracking-widest text-white focus:outline-none focus:border-primary/50 transition-all appearance-none cursor-pointer rounded-sm"
                            >
                                {hackathonOptions.map((h) => (
                                    <option key={h} value={h}>
                                        {h}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
                        </div>
                        {/* Status filter */}
                        <div className="relative min-w-[200px]">
                            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                            <select
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                                className="w-full pl-12 pr-8 py-3 bg-[#080808] border border-white/10 text-[10px] font-bold uppercase tracking-widest text-white focus:outline-none focus:border-primary/50 transition-all appearance-none cursor-pointer rounded-sm"
                            >
                                <option>ALL STATUS</option>
                                <option>APPROVED</option>
                                <option>PENDING</option>
                                <option>UNDER REVIEW</option>
                                <option>REJECTED</option>
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
                        </div>
                    </div>
                </div>

                {/* Team Groups */}
                <div className="space-y-6">
                    {Object.entries(teamGroups).map(([teamName, members]) => {
                        const isCollapsed = collapsedTeams[teamName] ?? false;
                        const leader = members.find((m) => m.isLeader);
                        const hackathonName = members[0]?.hackathon;

                        return (
                            <div
                                key={teamName}
                                className="bg-[#080808] rounded-sm overflow-hidden border border-white/5 hover:border-white/10 transition-all"
                            >
                                {/* Team Header */}
                                <button
                                    onClick={() => toggleTeam(teamName)}
                                    className="w-full flex items-center justify-between px-6 py-4 bg-primary/5 border-b border-primary/20 hover:bg-primary/10 transition-all cursor-pointer group"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center justify-center w-8 h-8 bg-primary/10 border border-primary/30 rounded-sm">
                                            <Users className="w-4 h-4 text-primary" />
                                        </div>
                                        <div className="text-left">
                                            <div className="flex items-center gap-3">
                                                <h3 className="text-sm font-black italic tracking-tighter uppercase text-white group-hover:text-primary-light transition-colors">
                                                    {teamName}
                                                </h3>
                                                <span className="text-[9px] bg-white/5 border border-white/10 px-2 py-0.5 text-white/50 font-bold uppercase tracking-widest rounded-sm">
                                                    {members.length} MEMBERS
                                                </span>
                                            </div>
                                            <div className="text-[10px] text-white/40 font-bold uppercase tracking-widest mt-0.5">
                                                <span className="text-primary/60">{hackathonName}</span>
                                                {leader && (
                                                    <>
                                                        <span className="mx-2 text-white/10">|</span>
                                                        <span className="text-yellow-500/80">
                                                            <Crown className="w-3 h-3 inline-block mr-1 -mt-0.5" />
                                                            {leader.name}
                                                        </span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {isCollapsed ? (
                                            <ChevronRight className="w-5 h-5 text-white/30 group-hover:text-white/60 transition-colors" />
                                        ) : (
                                            <ChevronDown className="w-5 h-5 text-white/30 group-hover:text-white/60 transition-colors" />
                                        )}
                                    </div>
                                </button>

                                {/* Team Members Table */}
                                {!isCollapsed && (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="border-b border-white/5 bg-black/30">
                                                    <th className="px-6 py-3 text-[9px] font-black italic text-white/30 uppercase tracking-widest">
                                                        OPERATIVE
                                                    </th>
                                                    <th className="px-6 py-3 text-[9px] font-black italic text-white/30 uppercase tracking-widest">
                                                        SPECIALIZATION
                                                    </th>
                                                    <th className="px-6 py-3 text-[9px] font-black italic text-white/30 uppercase tracking-widest">
                                                        STATUS
                                                    </th>
                                                    <th className="px-6 py-3 text-[9px] font-black italic text-white/30 uppercase tracking-widest text-right">
                                                        ACTION
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-white/5">
                                                {members.map((p) => (
                                                    <tr
                                                        key={p.id}
                                                        className="hover:bg-white/[0.02] transition-colors group/row"
                                                    >
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center gap-4">
                                                                <div className="relative flex-shrink-0">
                                                                    <div className="w-10 h-10 rounded-full bg-black border-2 border-[#080808] flex items-center justify-center overflow-hidden">
                                                                        <img
                                                                            src={`https://api.dicebear.com/7.x/notionists/svg?seed=${p.name}&backgroundColor=transparent`}
                                                                            alt={p.name}
                                                                            className="w-full h-full object-cover opacity-80"
                                                                        />
                                                                    </div>
                                                                    {p.isLeader ? (
                                                                        <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-yellow-500 rounded-full border-2 border-[#080808] flex items-center justify-center shadow-[0_0_10px_rgba(234,179,8,0.5)]">
                                                                            <Crown className="w-3 h-3 text-black" />
                                                                        </div>
                                                                    ) : (
                                                                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-primary rounded-sm transform rotate-45 border-2 border-[#080808] shadow-[0_0_10px_rgba(255,92,0,0.5)]" />
                                                                    )}
                                                                </div>
                                                                <div>
                                                                    <div className="text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1 group-hover/row:text-primary-light transition-colors">
                                                                        {p.name}
                                                                        {p.isLeader && (
                                                                            <span className="text-[8px] bg-yellow-500/10 border border-yellow-500/30 text-yellow-500 px-1.5 py-0.5 rounded-sm font-bold tracking-widest ml-1">
                                                                                LEADER
                                                                            </span>
                                                                        )}
                                                                        <ExternalLink className="w-3 h-3 text-white/20 group-hover/row:text-primary transition-colors cursor-pointer" />
                                                                    </div>
                                                                    <div className="text-[10px] text-white/40 uppercase tracking-widest font-bold mt-0.5">
                                                                        {p.email}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="text-white/80 text-xs uppercase tracking-wider font-bold">
                                                                {p.role}
                                                            </div>
                                                            <div className="text-[10px] text-white/40 flex items-center gap-1 mt-1 uppercase tracking-widest font-bold">
                                                                <MapPin className="w-3 h-3 text-primary/60" />
                                                                {p.location}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center gap-2">
                                                                <div
                                                                    className={`w-0 h-0 border-t-4 border-b-4 border-l-[6px] border-transparent ${p.status === "APPROVED"
                                                                            ? "border-l-green-500"
                                                                            : p.status === "PENDING"
                                                                                ? "border-l-primary"
                                                                                : p.status === "REJECTED"
                                                                                    ? "border-l-red-500"
                                                                                    : "border-l-white/40"
                                                                        }`}
                                                                />
                                                                <span
                                                                    className={`text-[10px] font-bold uppercase tracking-widest ${p.statusColor}`}
                                                                >
                                                                    {p.status}
                                                                </span>
                                                            </div>
                                                            <div className="text-[10px] text-white/40 flex items-center gap-1 mt-1 uppercase tracking-widest font-bold">
                                                                <Clock className="w-3 h-3 text-primary/60" />
                                                                APPLIED {p.appliedDate}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 text-right border-l border-white/5">
                                                            <button className="p-2 text-white/30 hover:text-white hover:bg-white/5 transition-all rounded-sm border border-transparent hover:border-white/10">
                                                                <MoreVertical className="w-4 h-4" />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        );
                    })}

                    {Object.keys(teamGroups).length === 0 && (
                        <div className="bg-[#080808] rounded-sm border border-white/5 p-12 text-center">
                            <Users className="w-12 h-12 text-white/10 mx-auto mb-4" />
                            <div className="text-sm font-bold text-white/30 uppercase tracking-widest">
                                NO OPERATIVES FOUND
                            </div>
                            <div className="text-[10px] text-white/20 uppercase tracking-widest mt-1">
                                TRY ADJUSTING YOUR FILTERS
                            </div>
                        </div>
                    )}
                </div>

                {/* Summary Footer */}
                <div className="px-6 py-4 bg-[#080808] border border-white/5 rounded-sm flex items-center justify-between">
                    <div className="text-[10px] text-white/40 uppercase tracking-widest font-bold">
                        SHOWING {Object.keys(teamGroups).length} TEAMS · {filtered.length} OPERATIVES
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="px-3 py-1 bg-white/5 border border-white/10 text-white/30 cursor-not-allowed text-[10px] font-bold uppercase tracking-widest rounded-sm">
                            PREV
                        </button>
                        <button className="px-3 py-1 bg-primary text-white text-[10px] font-bold rounded-sm border border-primary">
                            1
                        </button>
                        <button className="px-3 py-1 bg-white/5 border border-white/10 text-white hover:border-white/20 hover:bg-white/10 transition-all text-[10px] font-bold uppercase tracking-widest rounded-sm">
                            NEXT
                        </button>
                    </div>
                </div>
            </div>
        </OrganizerLayout>
    );
}
