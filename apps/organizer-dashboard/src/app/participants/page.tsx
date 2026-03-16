"use client";

import { useState, useEffect, useMemo } from "react";
import DashboardLayout from "@/components/DashboardLayout";
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
    Loader2,
    Mail,
    CheckCircle2,
    XCircle
} from "lucide-react";
import { organizerApi } from "@takathon/shared/api";
import api from "@takathon/shared/api";
import { toast } from "sonner";

export default function ParticipantsPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("ALL STATUS");
    const [hackathons, setHackathons] = useState<any[]>([]);
    const [selectedHackathonId, setSelectedHackathonId] = useState<string>("");
    const [participants, setParticipants] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [participantsLoading, setParticipantsLoading] = useState(false);
    const [collapsedTeams, setCollapsedTeams] = useState<Record<string, boolean>>({});

    useEffect(() => {
        fetchHackathons();
    }, []);

    useEffect(() => {
        if (selectedHackathonId) {
            fetchParticipants(selectedHackathonId);
        }
    }, [selectedHackathonId]);

    const fetchHackathons = async () => {
        try {
            const data = await organizerApi.listMyHackathons();
            setHackathons(data);
            if (data.length > 0) {
                // Find first non-draft if possible, otherwise first
                const active = data.find(h => h.status !== 'draft') || data[0];
                setSelectedHackathonId(active.id);
            }
        } catch (error) {
            toast.error("Failed to load hackathons");
        } finally {
            setLoading(false);
        }
    };

    const fetchParticipants = async (hackathonId: string) => {
        setParticipantsLoading(true);
        try {
            const data = await organizerApi.getParticipants(hackathonId);
            setParticipants(data);
        } catch (error) {
            toast.error("Failed to load participants");
            setParticipants([]);
        } finally {
            setParticipantsLoading(false);
        }
    };

    const handleExport = async () => {
        if (!selectedHackathonId) return;
        try {
            const res = await api.get(`/api/v1/organizers/hackathons/${selectedHackathonId}/export`);
            const data = (res as any).data?.data ?? (res as any).data;
            if (data?.csv) {
                const blob = new Blob([data.csv], { type: "text/csv" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `hackathon-${selectedHackathonId}-export.csv`;
                a.click();
                URL.revokeObjectURL(url);
                toast.success("Deployment roster exported!");
            } else {
                toast.success("Export package generated");
            }
        } catch (error) {
            toast.error("Failed to export communication logs");
        }
    };

    const toggleTeam = (team: string) => {
        setCollapsedTeams((prev) => ({ ...prev, [team]: !prev[team] }));
    };

    const filtered = useMemo(() => {
        return participants.filter((p) => {
            const name = (p.user?.fullName || p.fullName || "").toLowerCase();
            const email = (p.user?.email || p.email || "").toLowerCase();
            const role = (p.role || "").toLowerCase();
            const status = (p.status || "").toUpperCase();
            
            const matchesSearch =
                searchQuery === "" ||
                name.includes(searchQuery.toLowerCase()) ||
                email.includes(searchQuery.toLowerCase()) ||
                role.includes(searchQuery.toLowerCase());
            
            const matchesStatus =
                selectedStatus === "ALL STATUS" || status === selectedStatus;
            
            return matchesSearch && matchesStatus;
        });
    }, [participants, searchQuery, selectedStatus]);

    // Group by team
    const teamGroups = useMemo(() => {
        const groups: Record<string, any[]> = {};
        filtered.forEach((p) => {
            const tName = p.teamName || p.team?.name || "UNASSIGNED ASSETS";
            if (!groups[tName]) groups[tName] = [];
            groups[tName].push(p);
        });
        // Sort so leaders come first within each team
        Object.values(groups).forEach((members) =>
            members.sort((a, b) => (a.isLeader === b.isLeader ? 0 : a.isLeader ? -1 : 1))
        );
        return groups;
    }, [filtered]);

    const activeHackathon = hackathons.find(h => h.id === selectedHackathonId);

    return (
        <DashboardLayout>
            <div className="max-w-6xl mx-auto space-y-8 pb-12 relative">
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
                    <button 
                        onClick={handleExport}
                        disabled={!selectedHackathonId}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-transparent text-white border border-white/20 hover:border-white/40 hover:bg-white/5 transition-all active:scale-[0.98] rounded-sm text-[10px] font-bold tracking-widest uppercase mt-4 disabled:opacity-50"
                    >
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
                                value={selectedHackathonId}
                                onChange={(e) => setSelectedHackathonId(e.target.value)}
                                className="w-full pl-12 pr-8 py-3 bg-[#080808] border border-white/10 text-[10px] font-bold uppercase tracking-widest text-white focus:outline-none focus:border-primary/50 transition-all appearance-none cursor-pointer rounded-sm"
                            >
                                {hackathons.map((h) => (
                                    <option key={h.id} value={h.id}>
                                        {h.title.toUpperCase()}
                                    </option>
                                ))}
                                {hackathons.length === 0 && <option value="">NO MISSIONS FOUND</option>}
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
                                <option value="ALL STATUS">ALL STATUS</option>
                                <option value="REGISTERED">REGISTERED</option>
                                <option value="IN_TEAM">IN TEAM</option>
                                <option value="APPROVED">APPROVED</option>
                                <option value="PENDING">PENDING</option>
                                <option value="REJECTED">REJECTED</option>
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                <div className="space-y-6">
                    {participantsLoading ? (
                        <div className="flex flex-col items-center justify-center py-20 border border-white/5 bg-[#080808] rounded-sm">
                            <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
                            <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest">GATHERING INTEL...</div>
                        </div>
                    ) : Object.keys(teamGroups).length === 0 ? (
                        <div className="bg-[#080808] rounded-sm border border-white/5 p-12 text-center">
                            <Users className="w-12 h-12 text-white/10 mx-auto mb-4" />
                            <div className="text-sm font-bold text-white/30 uppercase tracking-widest">
                                NO OPERATIVES FOUND
                            </div>
                            <div className="text-[10px] text-white/20 uppercase tracking-widest mt-1">
                                TRY ADJUSTING YOUR RADAR PARAMETERS
                            </div>
                        </div>
                    ) : (
                        Object.entries(teamGroups).map(([teamName, members]) => {
                            const isCollapsed = collapsedTeams[teamName] ?? false;
                            const leader = members.find((m) => m.isLeader);

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
                                                    <h3 className="text-sm font-black italic tracking-tighter uppercase text-white group-hover:text-primary transition-colors">
                                                        {teamName}
                                                    </h3>
                                                    <span className="text-[9px] bg-white/5 border border-white/10 px-2 py-0.5 text-white/50 font-bold uppercase tracking-widest rounded-sm">
                                                        {members.length} MEMBERS
                                                    </span>
                                                </div>
                                                <div className="text-[10px] text-white/40 font-bold uppercase tracking-widest mt-0.5">
                                                    <span className="text-primary/60">{activeHackathon?.title || 'GENERAL OPERATION'}</span>
                                                    {leader && (
                                                        <>
                                                            <span className="mx-2 text-white/10">|</span>
                                                            <span className="text-yellow-500/80">
                                                                <Crown className="w-3 h-3 inline-block mr-1 -mt-0.5" />
                                                                {leader.user?.fullName || leader.fullName}
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
                                                    {members.map((p) => {
                                                        const pName = p.user?.fullName || p.fullName || "UNKNOWN";
                                                        const pEmail = p.user?.email || p.email;
                                                        const pStatus = (p.status || "REGISTERED").toUpperCase();
                                                        return (
                                                        <tr
                                                            key={p.id}
                                                            className="hover:bg-white/[0.02] transition-colors group/row"
                                                        >
                                                            <td className="px-6 py-4">
                                                                <div className="flex items-center gap-4">
                                                                    <div className="relative flex-shrink-0">
                                                                        <div className="w-10 h-10 rounded-full bg-black border-2 border-[#080808] flex items-center justify-center overflow-hidden">
                                                                            <img
                                                                                src={`https://api.dicebear.com/7.x/notionists/svg?seed=${pName}&backgroundColor=transparent`}
                                                                                alt={pName}
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
                                                                        <div className="text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1 group-hover/row:text-primary transition-colors">
                                                                            {pName}
                                                                            <ExternalLink className="w-3 h-3 text-white/20 group-hover/row:text-primary transition-colors cursor-pointer" />
                                                                        </div>
                                                                        <div className="text-[10px] text-white/40 uppercase tracking-widest font-bold mt-0.5">
                                                                            {pEmail}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <div className="text-white/80 text-xs uppercase tracking-wider font-bold">
                                                                    {p.role || "GENERALIST"}
                                                                </div>
                                                                <div className="text-[10px] text-white/40 flex items-center gap-1 mt-1 uppercase tracking-widest font-bold">
                                                                    <MapPin className="w-3 h-3 text-primary/60" />
                                                                    {p.location || "REMOTE"}
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <div className="flex items-center gap-2">
                                                                    <div
                                                                        className={`w-0 h-0 border-t-4 border-b-4 border-l-[6px] border-transparent ${
                                                                            pStatus === "APPROVED" || pStatus === "IN_TEAM"
                                                                                ? "border-l-green-500 shadow-glow-sm"
                                                                                : pStatus === "PENDING" || pStatus === "REGISTERED"
                                                                                    ? "border-l-primary shadow-glow-sm"
                                                                                    : pStatus === "REJECTED" || pStatus === "WITHDRAWN"
                                                                                        ? "border-l-red-500 shadow-glow-sm"
                                                                                        : "border-l-white/40"
                                                                            }`}
                                                                    />
                                                                    <span
                                                                        className={`text-[10px] font-bold uppercase tracking-widest ${
                                                                            pStatus === "APPROVED" || pStatus === "IN_TEAM" ? "text-green-500" :
                                                                            pStatus === "PENDING" || pStatus === "REGISTERED" ? "text-primary" :
                                                                            pStatus === "REJECTED" || pStatus === "WITHDRAWN" ? "text-red-500" : "text-white/40"
                                                                        }`}
                                                                    >
                                                                        {pStatus.replace('_', ' ')}
                                                                    </span>
                                                                </div>
                                                                <div className="text-[10px] text-white/40 flex items-center gap-1 mt-1 uppercase tracking-widest font-bold">
                                                                    <Clock className="w-3 h-3 text-primary/60" />
                                                                    {p.registeredAt ? `JOINED ${new Date(p.registeredAt).toLocaleDateString().toUpperCase()}` : 'DATE UNKNOWN'}
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 text-right border-l border-white/5">
                                                                <button className="p-2 text-white/30 hover:text-white hover:bg-white/5 transition-all rounded-sm border border-transparent hover:border-white/10">
                                                                    <MoreVertical className="w-4 h-4" />
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    )})}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Summary Footer */}
                {!participantsLoading && Object.keys(teamGroups).length > 0 && (
                    <div className="px-6 py-4 bg-[#080808] border border-white/5 rounded-sm flex items-center justify-between">
                        <div className="text-[10px] text-white/40 uppercase tracking-widest font-bold">
                            SHOWING {Object.keys(teamGroups).length} TEAMS · {filtered.length} OPERATIVES
                        </div>
                        <div className="flex items-center gap-2">
                            <button className="px-3 py-1 bg-white/5 border border-white/10 text-white/30 cursor-not-allowed text-[10px] font-bold uppercase tracking-widest rounded-sm">
                                PREV
                            </button>
                            <button className="px-3 py-1 bg-primary text-white text-[10px] font-bold rounded-sm border border-primary shadow-glow-sm">
                                1
                            </button>
                            <button className="px-3 py-1 bg-white/5 border border-white/10 text-white hover:border-white/20 hover:bg-white/10 transition-all text-[10px] font-bold uppercase tracking-widest rounded-sm">
                                NEXT
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
