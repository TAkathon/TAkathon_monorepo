"use client";

import { useState, useEffect } from "react";
import OrganizerLayout from "@/components/OrganizerLayout";
import {
  Search,
  Filter,
  Users,
  CheckCircle2,
  Shield,
  ChevronDown,
  Loader2,
  Users2,
  ExternalLink,
  MessageSquare,
  Trophy,
  Target,
  Zap
} from "lucide-react";
import { organizerApi } from "@takathon/shared/api";
import { toast } from "sonner";

export default function TeamsPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [hackathons, setHackathons] = useState<any[]>([]);
    const [selectedHackathonId, setSelectedHackathonId] = useState<string>("");
    const [teams, setTeams] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [teamsLoading, setTeamsLoading] = useState(false);

    useEffect(() => {
        fetchHackathons();
    }, []);

    useEffect(() => {
        if (selectedHackathonId) {
            fetchTeams(selectedHackathonId);
        }
    }, [selectedHackathonId]);

    const fetchHackathons = async () => {
        try {
            const data = await organizerApi.listMyHackathons();
            setHackathons(data);
            if (data.length > 0) {
                setSelectedHackathonId(data[0].id);
            }
        } catch (error) {
            toast.error("FAILED TO LOAD OPERATIONAL MISSIONS");
        } finally {
            setLoading(false);
        }
    };

    const fetchTeams = async (hackathonId: string) => {
        setTeamsLoading(true);
        try {
            const data = await organizerApi.getTeams(hackathonId);
            setTeams(data);
        } catch (error) {
            toast.error("FAILED TO RETRIEVE SQUAD DATA");
            setTeams([]);
        } finally {
            setTeamsLoading(false);
        }
    };

    const filteredTeams = teams.filter(
        (team: any) =>
            team.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            team.description?.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    return (
        <OrganizerLayout>
            <div className="max-w-6xl mx-auto space-y-8 pb-12 relative">
                {/* Background Floating Objects */}
                <div className="absolute top-20 right-10 w-32 h-32 bg-primary/20 rounded-full blur-[80px] pointer-events-none"></div>
                <div className="absolute top-60 left-10 w-24 h-24 bg-blue-500/10 rounded-full blur-[60px] pointer-events-none"></div>

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div>
                        <div className="flex items-center relative mb-1">
                            <h1 className="text-5xl md:text-6xl font-black italic tracking-tighter uppercase text-white">
                                <span className="text-white">SQUAD DEPOT</span>
                            </h1>
                            <div className="flex ml-4 gap-1 opacity-60 mt-2">
                                <div className="w-8 h-1 bg-primary"></div>
                                <div className="w-2 h-1 bg-primary"></div>
                                <div className="w-1 h-1 bg-primary"></div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 mt-4 mb-2">
                            <div className="w-2 h-2 bg-primary rounded-sm shadow-[0_0_8px_rgba(255,92,0,0.5)]" />
                            <span className="text-[10px] text-white/60 uppercase tracking-[0.2em] font-bold">
                                MONITOR SQUAD FORMATIONS, PROJECT INTEL, AND READY STATES
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 mt-4">
                        <div className="px-4 py-2 bg-black border border-white/5 rounded-sm flex items-center gap-3">
                            <div className="text-right">
                                <div className="text-[8px] text-white/40 font-bold uppercase tracking-widest">TOTAL SQUADS</div>
                                <div className="text-xl font-black italic tracking-tighter text-white leading-none">{teams.length}</div>
                            </div>
                            <div className="w-8 h-8 bg-white/5 flex items-center justify-center rounded-sm">
                                <Users className="w-4 h-4 text-primary" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters Row */}
                <div className="flex flex-col md:flex-row gap-4 pt-4 border-t border-white/5">
                    <div className="relative min-w-[280px]">
                        <Target className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                        <select
                            value={selectedHackathonId}
                            onChange={(e) => setSelectedHackathonId(e.target.value)}
                            className="w-full pl-12 pr-10 py-3 bg-[#080808] border border-white/10 text-[10px] font-bold uppercase tracking-widest text-white focus:outline-none focus:border-primary/50 transition-all appearance-none cursor-pointer rounded-sm"
                        >
                            {loading ? (
                                <option>SYNCING OPERATIONS...</option>
                            ) : hackathons.length === 0 ? (
                                <option>NO ACTIVE OPERATIONS</option>
                            ) : (
                                hackathons.map((h) => (
                                    <option key={h.id} value={h.id}>
                                        {h.title}
                                    </option>
                                ))
                            )}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
                    </div>
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="SEARCH BY SQUAD CALLSIGN OR PROJECT INTEL..."
                            className="w-full pl-12 pr-4 py-3 bg-[#080808] border border-white/10 text-[10px] font-bold uppercase tracking-widest text-white placeholder:text-white/30 focus:outline-none focus:border-primary/50 transition-all rounded-sm"
                        />
                    </div>
                </div>

                {/* Content Grid */}
                {teamsLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="h-64 bg-white/5 border border-white/10 rounded-sm animate-pulse" />
                        ))}
                    </div>
                ) : filteredTeams.length === 0 ? (
                    <div className="bg-[#080808] border border-white/5 border-dashed rounded-sm p-16 text-center flex flex-col items-center gap-4">
                        <Users2 className="w-12 h-12 text-white/10" />
                        <div className="text-sm font-black italic text-white/40 uppercase tracking-tighter">NO SQUADS DETECTED</div>
                        <p className="text-[10px] text-white/20 uppercase tracking-[0.2em] font-bold">AWAITING PERSONNEL FORMATION OR MISSION DEPLOYMENT</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredTeams.map((team: any) => {
                            const memberCount = team.currentSize || team.members?.length || 0;
                            const maxSize = team.maxSize || 4;
                            const progress = (memberCount / maxSize) * 100;
                            const captain = team.members?.find((m: any) => m.role === "captain")?.user || {};
                            const isComplete = team.status === "complete" || memberCount >= maxSize;

                            return (
                                <div
                                    key={team.id}
                                    className="bg-[#080808] border border-white/5 group hover:border-primary/30 transition-all rounded-sm relative overflow-hidden flex flex-col"
                                >
                                    {/* Corner accents */}
                                    <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/10 group-hover:border-primary/50 transition-colors"></div>
                                    <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/5 group-hover:border-primary/30 transition-colors"></div>

                                    {/* Card Header */}
                                    <div className="p-6 pb-0 flex items-start justify-between">
                                        <div className="w-12 h-12 bg-white/5 border border-white/10 flex items-center justify-center rounded-sm group-hover:border-primary/20 transition-all">
                                            <Trophy className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
                                        </div>
                                        <div className={`flex items-center gap-1.5 px-3 py-1 text-[8px] font-black uppercase tracking-widest border rounded-sm ${
                                            isComplete ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-primary/10 text-primary border-primary/20'
                                        }`}>
                                            {isComplete ? <CheckCircle2 className="w-3 h-3" /> : <Zap className="w-3 h-3 animate-pulse" />}
                                            {isComplete ? 'DEPLOYMENT READY' : 'FORMING'}
                                        </div>
                                    </div>

                                    {/* Card Body */}
                                    <div className="p-6 flex-1">
                                        <h3 className="text-xl font-black text-white italic tracking-tighter uppercase mb-2 group-hover:text-primary transition-colors line-clamp-1">
                                            {team.name}
                                        </h3>
                                        <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest leading-relaxed line-clamp-2 mb-6 h-8">
                                            {team.description || "NO MISSION DESCRIPTION PROVIDED BY COMMANDER."}
                                        </p>

                                        {/* Deployment Gauge */}
                                        <div className="space-y-2 mb-6">
                                            <div className="flex justify-between text-[9px] font-bold uppercase tracking-widest">
                                                <span className="text-white/40">OPERATIVES</span>
                                                <span className="text-white">{memberCount} / {maxSize}</span>
                                            </div>
                                            <div className="h-1 bg-white/5 rounded-full overflow-hidden flex">
                                                <div 
                                                    className={`h-full transition-all duration-500 shadow-glow-sm ${isComplete ? 'bg-green-500' : 'bg-primary'}`}
                                                    style={{ width: `${progress}%` }}
                                                />
                                            </div>
                                        </div>

                                        {/* Meta Intel */}
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-6 h-6 rounded-full bg-black border border-white/10 flex items-center justify-center shrink-0">
                                                    <Shield className="w-3 h-3 text-primary" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="text-[8px] text-white/40 font-bold uppercase tracking-[0.1em]">SQUAD CAPTAIN</div>
                                                    <div className="text-[10px] text-white font-black truncate">{captain.fullName?.toUpperCase() || "UNASSIGNED"}</div>
                                                </div>
                                            </div>
                                            {team.projectIdea && (
                                                <div className="p-3 bg-white/[0.02] border border-white/5 rounded-sm">
                                                    <div className="text-[8px] text-primary/60 font-bold uppercase tracking-widest mb-1 flex items-center gap-1">
                                                        <MessageSquare className="w-3 h-3" />
                                                        PROJECT INTEL
                                                    </div>
                                                    <p className="text-[10px] text-white/60 font-medium italic line-clamp-2 leading-relaxed">
                                                        "{team.projectIdea}"
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Card Actions */}
                                    <div className="p-6 pt-0 mt-auto">
                                        <button className="w-full flex items-center justify-center gap-2 py-3 bg-transparent text-white border border-white/10 hover:border-primary/50 hover:bg-primary/5 transition-all text-[9px] font-bold uppercase tracking-widest rounded-sm active:scale-[0.98]">
                                            <ExternalLink className="w-3.5 h-3.5" />
                                            <span>VIEW FULL SQUAD INTEL</span>
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </OrganizerLayout>
    );
}
