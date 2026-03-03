"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Calendar, MapPin, Users, Clock, Filter, Search, ChevronDown, Loader2, CheckCircle, Shield } from "lucide-react";
import { studentApi } from "@takathon/shared/api";
import type { StudentHackathonSummary } from "@takathon/shared/api";
import { toast } from "sonner";

export default function HackathonsPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("All");
    const [hackathons, setHackathons] = useState<StudentHackathonSummary[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchHackathons();
    }, []);

    const fetchHackathons = async () => {
        try {
            const data = await studentApi.browseHackathons();
            setHackathons(data);
        } catch (error) {
            console.error("Failed to fetch hackathons:", error);
            toast.error("Failed to load hackathons");
        } finally {
            setLoading(false);
        }
    };

    const handleJoin = async (hackathonId: string) => {
        try {
            await studentApi.registerForHackathon(hackathonId);
            toast.success("Successfully registered!");
            setHackathons(prev => prev.map(h => h.id === hackathonId ? { ...h, isRegistered: true, participantCount: h.participantCount + 1 } : h));
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to register");
        }
    };

    const handleWithdraw = async (hackathonId: string) => {
        try {
            await studentApi.withdrawFromHackathon(hackathonId);
            toast.success("Withdrawn successfully");
            setHackathons(prev => prev.map(h => h.id === hackathonId ? { ...h, isRegistered: false, participantCount: Math.max(0, h.participantCount - 1) } : h));
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to withdraw");
        }
    };

    const filteredHackathons = hackathons.filter((h) => {
        const matchesSearch = h.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (h.requiredSkills || []).some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
        
        // Map backend status to frontend filter options if needed
        // For now, simple matching
        const matchesStatus = selectedStatus === "All" || h.status === selectedStatus;
        
        return matchesSearch && matchesStatus;
    });

    return (
        <DashboardLayout>
            {loading ? (
                <div className="flex items-center justify-center h-full min-h-[400px]">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                </div>
            ) : (
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Browse Hackathons</h1>
                    <p className="text-white/60">
                        Discover and join exciting hackathons across Tunisia
                    </p>
                </div>

                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Search */}
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search hackathons by name or tag..."
                            className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:border-primary/50 transition-all"
                        />
                    </div>

                    {/* Status Filter */}
                    <div className="relative min-w-[200px]">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                        <select
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            className="w-full pl-11 pr-8 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary/50 transition-all appearance-none cursor-pointer"
                        >
                            <option value="All">All Status</option>
                            <option value="registration_open">Open</option>
                            <option value="registration_closed">Closed</option>
                            <option value="in_progress">In Progress</option>
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-white/40">
                            <ChevronDown className="w-4 h-4" />
                        </div>
                    </div>
                </div>

                {/* Results count */}
                <p className="text-white/60 text-sm">
                    Showing {filteredHackathons.length} of {hackathons.length} hackathons
                </p>

                {/* Hackathons Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {filteredHackathons.map((hackathon) => (
                        <div
                            key={hackathon.id}
                            className="glass rounded-xl p-6 hover:bg-white/10 transition-all duration-300 cursor-pointer group"
                        >
                            {/* Header */}
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-1 group-hover:text-primary transition-colors">
                                        {hackathon.title}
                                    </h3>
                                    {/* Organizer info */}
                                    <p className="text-sm text-white/60">{hackathon.isVirtual ? "Virtual Event" : hackathon.location || "TBD"}</p>
                                </div>
                                <span
                                    className={`px-3 py-1 text-xs font-semibold rounded-full ${
                                        hackathon.status === "registration_open"
                                            ? "bg-green-500/20 text-green-400"
                                            : "bg-white/10 text-white/60"
                                    }`}
                                >
                                    {(hackathon.status || '').replace(/_/g, " ").toUpperCase()}
                                </span>
                            </div>

                            {/* Description */}
                            <p className="text-white/70 text-sm mb-4 line-clamp-2">{hackathon.description}</p>

                            {/* Tags */}
                            <div className="flex flex-wrap gap-2 mb-4">
                                {(hackathon.requiredSkills || []).map((tag) => (
                                    <span
                                        key={tag}
                                        className="px-2 py-1 bg-white/5 text-white/60 text-xs rounded-full"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            {/* Info Grid */}
                            <div className="grid grid-cols-2 gap-3 mb-4">
                                <div className="flex items-center gap-2 text-sm text-white/60">
                                    <Calendar className="w-4 h-4 text-primary" />
                                    <span>{hackathon.startDate ? new Date(hackathon.startDate).toLocaleDateString() : "TBD"}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-white/60">
                                    <MapPin className="w-4 h-4 text-primary" />
                                    <span>{hackathon.location || (hackathon.isVirtual ? "Virtual" : "TBD")}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-white/60">
                                    <Clock className="w-4 h-4 text-primary" />
                                    <span>
                                        {hackathon.startDate && hackathon.endDate
                                            ? `${Math.ceil((new Date(hackathon.endDate).getTime() - new Date(hackathon.startDate).getTime()) / (1000 * 60 * 60 * 24))} Days`
                                            : "TBD"}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-white/60">
                                    <Users className="w-4 h-4 text-primary" />
                                    <span>
                                        Max {hackathon.maxParticipants || "Unlimited"}
                                    </span>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="flex items-center justify-between pt-4 border-t border-white/10">
                                <div>
                                    <span className="text-primary font-bold text-lg">{hackathon.participantCount}</span>
                                    <span className="text-white/40 text-sm ml-1">Participants</span>
                                </div>
                                {hackathon.isRegistered ? (
                                    <div className="flex items-center gap-2">
                                        {hackathon.isInTeam ? (
                                            // Blocked — user is in a team for this hackathon
                                            <div className="flex items-center gap-1.5" title="Leave your team from My Teams before withdrawing">
                                                <span className="flex items-center gap-1 text-primary text-sm font-medium">
                                                    <Shield className="w-4 h-4" /> In Team
                                                </span>
                                                <span className="text-white/30 text-xs">(leave team to withdraw)</span>
                                            </div>
                                        ) : (
                                            <>
                                                <span className="flex items-center gap-1 text-green-400 text-sm font-medium">
                                                    <CheckCircle className="w-4 h-4" /> Registered
                                                </span>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleWithdraw(hackathon.id); }}
                                                    className="px-3 py-1.5 bg-white/5 hover:bg-red-500/20 text-white/60 hover:text-red-400 text-sm font-medium rounded-lg transition-all duration-200 border border-white/10 hover:border-red-500/30"
                                                >
                                                    Withdraw
                                                </button>
                                            </>
                                        )}
                                    </div>
                                ) : (
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleJoin(hackathon.id); }}
                                        disabled={hackathon.status !== "registration_open"}
                                        className="px-4 py-2 bg-primary hover:bg-primary-dark text-white font-semibold rounded-lg transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                                    >
                                        Join Now
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Empty State */}
                {filteredHackathons.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 glass rounded-2xl border border-white/5">
                        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                            <Calendar className="w-10 h-10 text-primary/60" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">
                            {searchQuery || selectedStatus !== "All" ? "No hackathons match your filters" : "No hackathons available yet"}
                        </h3>
                        <p className="text-white/40 text-center max-w-sm">
                            {searchQuery || selectedStatus !== "All"
                                ? "Try clearing your search or changing the status filter."
                                : "Check back soon — exciting events are on their way!"}
                        </p>
                        {(searchQuery || selectedStatus !== "All") && (
                            <button
                                onClick={() => { setSearchQuery(""); setSelectedStatus("All"); }}
                                className="mt-6 px-5 py-2.5 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 transition-all text-sm font-medium"
                            >
                                Clear Filters
                            </button>
                        )}
                    </div>
                )}
            </div>
            )}
        </DashboardLayout>
    );
}
