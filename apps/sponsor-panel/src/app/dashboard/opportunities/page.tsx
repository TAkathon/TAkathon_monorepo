"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { 
    Search, 
    Filter, 
    MapPin, 
    Calendar, 
    DollarSign,
    ExternalLink,
    ChevronRight,
    Trophy,
    Loader2
} from "lucide-react";
import api from "@takathon/shared/api";
import { Hackathon } from "@takathon/shared/types";
import { toast } from "sonner";

export default function OpportunitiesPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [hackathons, setHackathons] = useState<Hackathon[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchHackathons();
    }, []);

    const fetchHackathons = async () => {
        try {
            const response = await api.get("/api/v1/sponsors/hackathons");
            setHackathons(response.data.data || []);
        } catch (error) {
            console.error("Failed to fetch hackathons:", error);
            toast.error("Failed to load opportunities");
        } finally {
            setLoading(false);
        }
    };

    const filteredHackathons = hackathons.filter((h) => {
        const matchesSearch = h.title.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
    });

    return (
        <DashboardLayout>
            {loading ? (
                <div className="flex items-center justify-center h-full min-h-[400px]">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                </div>
            ) : (
            <div className="space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">Discover Opportunities</h1>
                        <p className="text-white/60">Find upcoming events looking for sponsorships.</p>
                    </div>
                </div>

                {/* Filters & Search */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="md:col-span-2 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                        <input
                            type="text"
                            placeholder="Search by name, category, or organizer..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="input-field pl-11"
                        />
                    </div>
                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                        <select className="input-field pl-11 appearance-none bg-dark">
                            <option>All Categories</option>
                            <option>AI</option>
                            <option>Web3</option>
                            <option>FinTech</option>
                        </select>
                    </div>
                    <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                        <select className="input-field pl-11 appearance-none bg-dark">
                            <option>Any Budget</option>
                            <option>$0 - $1k</option>
                            <option>$1k - $5k</option>
                            <option>$5k+</option>
                        </select>
                    </div>
                </div>

                {/* Opportunities List */}
                <div className="grid grid-cols-1 gap-6">
                    {filteredHackathons.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-20 glass rounded-2xl border border-white/5">
                            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                                <Trophy className="w-10 h-10 text-primary/60" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">
                                {searchTerm ? "No opportunities match your search" : "No opportunities available yet"}
                            </h3>
                            <p className="text-white/40 text-center max-w-sm mb-6">
                                {searchTerm
                                    ? "Try a different keyword to find more events."
                                    : "Hackathons seeking sponsors will appear here. Check back soon!"}
                            </p>
                            {searchTerm && (
                                <button
                                    onClick={() => setSearchTerm("")}
                                    className="px-5 py-2.5 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 transition-all text-sm font-medium"
                                >
                                    Clear Search
                                </button>
                            )}
                        </div>
                    )}
                    {filteredHackathons.map((opp) => (
                        <div key={opp.id} className="glass p-6 rounded-2xl hover:border-primary/30 transition-all duration-300 group">
                            <div className="flex flex-col lg:flex-row gap-6">
                                {/* Event Info */}
                                <div className="flex-1 space-y-4">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors">
                                                {opp.title}
                                            </h3>
                                            <p className="text-white/40 text-sm">Organizer ID: {(opp.organizerId || '--------').substring(0, 8)}...</p>
                                        </div>
                                        <div className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium uppercase">
                                            {(opp.status || '').replace(/_/g, ' ')}
                                        </div>
                                    </div>
                                    
                                    <p className="text-white/70 text-sm leading-relaxed max-w-2xl line-clamp-2">
                                        {opp.description}
                                    </p>

                                    <div className="flex flex-wrap gap-4 text-sm text-white/40">
                                        <div className="flex items-center gap-1.5">
                                            <Calendar className="w-4 h-4" />
                                            {opp.startDate ? new Date(opp.startDate).toLocaleDateString() : "TBD"}
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <MapPin className="w-4 h-4" />
                                            {opp.isVirtual ? "Virtual" : opp.location || "TBD"}
                                        </div>
                                        <div className="flex items-center gap-1.5 text-primary">
                                            <DollarSign className="w-4 h-4" />
                                            {opp.prizePool || "TBD"}
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        {(opp.requiredSkills || []).map(tag => (
                                            <span key={tag} className="px-2 py-1 rounded bg-white/5 border border-white/5 text-[10px] text-white/40 uppercase tracking-wider">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex flex-row lg:flex-col justify-center gap-3 min-w-[160px]">
                                    <button className="flex-1 lg:flex-none btn-primary flex items-center justify-center gap-2 py-2.5">
                                        Interested
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                    <button className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg border border-white/10 hover:border-white/20 transition-all text-white/70 hover:text-white">
                                        View Details
                                        <ExternalLink className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            )}
        </DashboardLayout>
    );
}
