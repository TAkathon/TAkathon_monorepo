"use client";

import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Calendar, MapPin, Users, Clock, Filter, Search, ChevronDown } from "lucide-react";

const hackathons = [
    {
        id: 1,
        name: "AI Innovators Challenge",
        date: "March 15-17, 2026",
        location: "Tunis, Tunisia",
        participants: 120,
        maxParticipants: 150,
        duration: "48 hours",
        prize: "$10,000",
        status: "Open",
        tags: ["AI", "Machine Learning", "Innovation"],
        description: "Build the next generation of AI-powered solutions",
        organizer: "TechHub Tunisia",
    },
    {
        id: 2,
        name: "Web3 Summit Hackathon",
        date: "March 22-24, 2026",
        location: "Sfax, Tunisia",
        participants: 95,
        maxParticipants: 100,
        duration: "36 hours",
        prize: "$5,000",
        status: "Filling Fast",
        tags: ["Blockchain", "Web3", "DeFi"],
        description: "Shape the decentralized future",
        organizer: "Blockchain Tunisia",
    },
    {
        id: 3,
        name: "Climate Tech Solutions",
        date: "April 5-7, 2026",
        location: "Sousse, Tunisia",
        participants: 78,
        maxParticipants: 120,
        duration: "72 hours",
        prize: "$8,000",
        status: "Open",
        tags: ["Climate", "Sustainability", "Impact"],
        description: "Create technology to combat climate change",
        organizer: "GreenTech Alliance",
    },
    {
        id: 4,
        name: "HealthTech Innovation",
        date: "April 12-14, 2026",
        location: "Monastir, Tunisia",
        participants: 65,
        maxParticipants: 100,
        duration: "48 hours",
        prize: "$7,500",
        status: "Open",
        tags: ["Healthcare", "AI", "Mobile"],
        description: "Revolutionize healthcare with technology",
        organizer: "MedTech Tunisia",
    },
];

export default function HackathonsPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("All");

    const filteredHackathons = hackathons.filter((h) => {
        const matchesSearch = h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            h.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesStatus = selectedStatus === "All" || h.status === selectedStatus;
        return matchesSearch && matchesStatus;
    });

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2 uppercase tracking-tight">Active Missions</h1>
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-primary animate-pulse rounded-full" />
                        <span className="text-xs text-white/40 uppercase tracking-[0.2em] font-bold">
                            Discover and join exciting hackathons across Tunisia
                        </span>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-4 mb-8">
                    {/* Search */}
                    <div className="flex-1 relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-primary transition-colors" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="SEARCH OPERATIONS..."
                            className="w-full pl-11 pr-4 py-3 bg-white/[0.02] border border-white/5 rounded-xl text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 focus:bg-white/5 transition-all text-sm uppercase tracking-widest font-medium"
                        />
                    </div>

                    {/* Status Filter */}
                    <div className="relative min-w-[200px] group">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-primary transition-colors" />
                        <select
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            className="w-full pl-11 pr-10 py-3 bg-white/[0.02] border border-white/5 rounded-xl text-white focus:outline-none focus:border-primary/50 focus:bg-white/5 transition-all appearance-none cursor-pointer text-sm uppercase tracking-widest font-medium"
                        >
                            <option value="All" className="bg-dark text-white">ALL STATUS</option>
                            <option value="Open" className="bg-dark text-white">OPEN</option>
                            <option value="Filling Fast" className="bg-dark text-white">FILLING FAST</option>
                            <option value="Closed" className="bg-dark text-white">CLOSED</option>
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-white/40">
                            <ChevronDown className="w-4 h-4" />
                        </div>
                    </div>
                </div>

                {/* Results count */}
                <p className="text-white/20 text-[10px] uppercase font-bold tracking-[0.2em]">
                    Displaying {filteredHackathons.length} of {hackathons.length} Active Operations
                </p>

                {/* Hackathons Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {filteredHackathons.map((hackathon) => (
                        <div
                            key={hackathon.id}
                            className="glass rounded-2xl p-8 border border-white/5 hover:border-primary/20 hover:bg-white/5 transition-all duration-500 cursor-pointer group"
                        >
                            {/* Header */}
                            <div className="flex items-start justify-between mb-6">
                                <div>
                                    <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-primary-light transition-all tracking-tight">
                                        {hackathon.name}
                                    </h3>
                                    <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">{hackathon.organizer}</p>
                                </div>
                                <span
                                    className={`px-3 py-1 text-[10px] uppercase font-bold tracking-widest rounded-full border ${hackathon.status === "Open"
                                            ? "bg-green-500/10 text-green-400 border-green-500/20"
                                            : hackathon.status === "Filling Fast"
                                                ? "bg-primary/10 text-primary border-primary/20"
                                                : "bg-white/5 text-white/40 border-white/10"
                                        }`}
                                >
                                    {hackathon.status}
                                </span>
                            </div>

                            {/* Description */}
                            <p className="text-white/70 text-sm mb-4">{hackathon.description}</p>

                            {/* Tags */}
                            <div className="flex flex-wrap gap-2 mb-6">
                                {hackathon.tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="px-2 py-1 bg-primary/5 border border-primary/10 text-primary-light text-[9px] font-bold uppercase tracking-widest rounded-md"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            {/* Info Grid */}
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="flex items-center gap-2 text-[10px] text-white/40 uppercase tracking-widest font-bold">
                                    <Calendar className="w-3.5 h-3.5 text-primary" />
                                    <span>{hackathon.date}</span>
                                </div>
                                <div className="flex items-center gap-2 text-[10px] text-white/40 uppercase tracking-widest font-bold">
                                    <MapPin className="w-3.5 h-3.5 text-primary" />
                                    <span>{hackathon.location}</span>
                                </div>
                                <div className="flex items-center gap-2 text-[10px] text-white/40 uppercase tracking-widest font-bold">
                                    <Clock className="w-3.5 h-3.5 text-primary" />
                                    <span>{hackathon.duration}</span>
                                </div>
                                <div className="flex items-center gap-2 text-[10px] text-white/40 uppercase tracking-widest font-bold">
                                    <Users className="w-3.5 h-3.5 text-primary" />
                                    <span>
                                        {hackathon.participants}/{hackathon.maxParticipants}
                                    </span>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="flex items-center justify-between pt-6 border-t border-white/5">
                                <div>
                                    <p className="text-[10px] text-white/20 uppercase tracking-[0.2em] font-bold mb-1">Prize Pool</p>
                                    <span className="text-primary-light font-bold text-2xl tracking-tight">{hackathon.prize}</span>
                                </div>
                                <button className="px-6 py-2.5 bg-primary/20 hover:bg-primary border border-primary/40 hover:border-primary text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all duration-300 shadow-glow-primary/10 hover:shadow-glow-primary/20">
                                    Join Mission
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
