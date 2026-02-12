"use client";

import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Calendar, MapPin, Users, Clock, Filter, Search } from "lucide-react";

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
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Browse Hackathons</h1>
                    <p className="text-white/60">
                        Discover and join exciting hackathons across Tunisia
                    </p>
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4">
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
                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                        <select
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            className="pl-11 pr-8 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary/50 transition-all appearance-none cursor-pointer"
                        >
                            <option value="All">All Status</option>
                            <option value="Open">Open</option>
                            <option value="Filling Fast">Filling Fast</option>
                            <option value="Closed">Closed</option>
                        </select>
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
                                        {hackathon.name}
                                    </h3>
                                    <p className="text-sm text-white/60">{hackathon.organizer}</p>
                                </div>
                                <span
                                    className={`px-3 py-1 text-xs font-semibold rounded-full ${
                                        hackathon.status === "Open"
                                            ? "bg-green-500/20 text-green-400"
                                            : hackathon.status === "Filling Fast"
                                            ? "bg-primary/20 text-primary"
                                            : "bg-white/10 text-white/60"
                                    }`}
                                >
                                    {hackathon.status}
                                </span>
                            </div>

                            {/* Description */}
                            <p className="text-white/70 text-sm mb-4">{hackathon.description}</p>

                            {/* Tags */}
                            <div className="flex flex-wrap gap-2 mb-4">
                                {hackathon.tags.map((tag) => (
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
                                    <span>{hackathon.date}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-white/60">
                                    <MapPin className="w-4 h-4 text-primary" />
                                    <span>{hackathon.location}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-white/60">
                                    <Clock className="w-4 h-4 text-primary" />
                                    <span>{hackathon.duration}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-white/60">
                                    <Users className="w-4 h-4 text-primary" />
                                    <span>
                                        {hackathon.participants}/{hackathon.maxParticipants}
                                    </span>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="flex items-center justify-between pt-4 border-t border-white/10">
                                <div>
                                    <span className="text-primary font-bold text-lg">{hackathon.prize}</span>
                                    <span className="text-white/40 text-sm ml-1">Prize Pool</span>
                                </div>
                                <button className="px-4 py-2 bg-primary hover:bg-primary-dark text-white font-semibold rounded-lg transition-all duration-200">
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
