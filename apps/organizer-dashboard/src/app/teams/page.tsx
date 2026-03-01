"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { 
    Search, 
    Filter, 
    Users, 
    User, 
    CheckCircle2,
    Shield,
    ChevronDown,
    Loader2,
    Users2
} from "lucide-react";
import api from "@takathon/shared/api";
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
            const res = await api.get("/api/v1/organizers/hackathons");
            const data = res.data.data || [];
            setHackathons(data);
            if (data.length > 0) {
                setSelectedHackathonId(data[0].id);
            }
        } catch (error) {
            toast.error("Failed to load hackathons");
        } finally {
            setLoading(false);
        }
    };

    const fetchTeams = async (hackathonId: string) => {
        setTeamsLoading(true);
        try {
            const res = await api.get(`/api/v1/organizers/hackathons/${hackathonId}/teams`);
            setTeams(res.data.data || res.data.teams || []);
        } catch (error) {
            toast.error("Failed to load teams");
            setTeams([]);
        } finally {
            setTeamsLoading(false);
        }
    };

    const filteredTeams = teams.filter((team: any) =>
        team.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        team.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <DashboardLayout>
            {loading ? (
                <div className="flex items-center justify-center min-h-[400px]">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                </div>
            ) : (
            <div className="space-y-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Teams</h1>
                        <p className="text-white/60 mt-1">Manage team formations and projects</p>
                    </div>
                </div>

                {/* Hackathon Selector + Search */}
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative min-w-[240px]">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                        <select
                            value={selectedHackathonId}
                            onChange={(e) => setSelectedHackathonId(e.target.value)}
                            className="w-full pl-11 pr-8 py-3 bg-white/5 border border-white/10 rounded-lg text-white appearance-none cursor-pointer focus:outline-none focus:border-primary/50 transition-all"
                        >
                            {hackathons.length === 0 ? (
                                <option value="">No hackathons</option>
                            ) : (
                                hackathons.map((h) => (
                                    <option key={h.id} value={h.id}>{h.title}</option>
                                ))
                            )}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
                    </div>
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
                </div>

                {/* Teams Grid */}
                {teamsLoading ? (
                    <div className="flex items-center justify-center min-h-[200px]">
                        <Loader2 className="w-6 h-6 text-primary animate-spin" />
                    </div>
                ) : hackathons.length === 0 ? (
                    <div className="glass rounded-xl p-12 text-center">
                        <Users className="w-12 h-12 text-white/20 mx-auto mb-4" />
                        <p className="text-white/60">No hackathons found. Create a hackathon first.</p>
                    </div>
                ) : filteredTeams.length === 0 ? (
                    <div className="glass rounded-xl p-12 text-center">
                        <Users2 className="w-12 h-12 text-white/20 mx-auto mb-4" />
                        <p className="text-white/60">No teams found for this hackathon yet.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredTeams.map((team: any) => {
                            const memberCount = team.currentSize || team.members?.length || 0;
                            const maxSize = team.maxSize || 4;
                            const captainMember = team.members?.find((m: any) => m.role === "captain");
                            const captainName = captainMember?.user?.fullName || "Unknown";
                            return (
                                <div key={team.id} className="glass rounded-xl p-6 border border-white/10 hover:border-primary/30 transition-all group flex flex-col">
                                    <div className="flex items-start justify-between">
                                        <div className="p-3 bg-primary/10 rounded-lg text-primary">
                                            <Users className="w-6 h-6" />
                                        </div>
                                        <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                                            team.status === "complete" ? "bg-green-500/10 text-green-400" : "bg-yellow-500/10 text-yellow-400"
                                        }`}>
                                            {team.status === "complete" ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Users className="w-3.5 h-3.5" />}
                                            {team.status}
                                        </span>
                                    </div>

                                    <div className="mt-4">
                                        <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors">{team.name}</h3>
                                        {team.description && <p className="text-sm text-white/60 mt-1 line-clamp-2">{team.description}</p>}
                                    </div>

                                    <div className="mt-6 space-y-3 flex-1">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-white/60">Members</span>
                                            <span className="text-white font-medium">{memberCount}/{maxSize}</span>
                                        </div>
                                        {team.projectIdea && (
                                            <div className="p-3 bg-white/5 rounded-lg border border-white/5">
                                                <div className="text-[10px] uppercase tracking-wider text-white/40 font-bold mb-1">Project Idea</div>
                                                <div className="text-sm text-white/80 font-medium line-clamp-2">{team.projectIdea}</div>
                                            </div>
                                        )}
                                        <div className="flex items-center gap-2 text-xs">
                                            <Shield className="w-3.5 h-3.5 text-primary" />
                                            <span className="text-white/60">Captain:</span>
                                            <span className="text-white font-medium">{captainName}</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
            )}
        </DashboardLayout>
    );
}
