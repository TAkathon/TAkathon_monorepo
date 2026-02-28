"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Calendar, MapPin, Users, Clock, Filter, Search, ChevronDown, Loader2 } from "lucide-react";
import api from "@takathon/shared/api";
import { Hackathon } from "@takathon/shared/types";
import { toast } from "sonner";

export default function HackathonsPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("All");
    const [hackathons, setHackathons] = useState<Hackathon[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchHackathons();
    }, []);

    const fetchHackathons = async () => {
        try {
            const response = await api.get("/api/v1/students/hackathons");
            setHackathons(response.data.data);
        } catch (error) {
            console.error("Failed to fetch hackathons:", error);
            toast.error("Failed to load hackathons");
        } finally {
            setLoading(false);
        }
    };

    const handleJoin = async (hackathonId: string) => {
        try {
            await api.post(`/api/v1/students/hackathons/${hackathonId}/register`);
            toast.success("Successfully registered for hackathon!");
            fetchHackathons(); // Refresh list to update status if needed
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to register");
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

    if (loading) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center h-full min-h-[400px]">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
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
                                    {/* Organizer name would ideally come from backend expansion */}
                                    <p className="text-sm text-white/60">Organizer ID: {hackathon.organizerId.substring(0, 8)}...</p>
                                </div>
                                <span
                                    className={`px-3 py-1 text-xs font-semibold rounded-full ${
                                        hackathon.status === "registration_open"
                                            ? "bg-green-500/20 text-green-400"
                                            : "bg-white/10 text-white/60"
                                    }`}
                                >
                                    {hackathon.status.replace("_", " ").toUpperCase()}
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
                                    <span>{new Date(hackathon.startDate).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-white/60">
                                    <MapPin className="w-4 h-4 text-primary" />
                                    <span>{hackathon.location || (hackathon.isVirtual ? "Virtual" : "TBD")}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-white/60">
                                    <Clock className="w-4 h-4 text-primary" />
                                    <span>
                                        {Math.ceil((new Date(hackathon.endDate).getTime() - new Date(hackathon.startDate).getTime()) / (1000 * 60 * 60 * 24))} Days
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
                                    <span className="text-primary font-bold text-lg">{hackathon.prizePool || "TBD"}</span>
                                    {hackathon.prizePool && <span className="text-white/40 text-sm ml-1">Prize Pool</span>}
                                </div>
                                <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleJoin(hackathon.id);
                                    }}
                                    className="px-4 py-2 bg-primary hover:bg-primary-dark text-white font-semibold rounded-lg transition-all duration-200"
                                >
                                    Join Now
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Empty State */}
                {filteredHackathons.length === 0 && (
                    <div className="text-center py-12 glass rounded-xl">
                        <Calendar className="w-16 h-16 text-white/20 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-white/60 mb-2">No hackathons found</h3>
                        <p className="text-white/40">Try adjusting your search or filters</p>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
