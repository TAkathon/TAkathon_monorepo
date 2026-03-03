"use client";

import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Calendar, MapPin, Users, Clock, Filter, Search, ChevronDown, Globe } from "lucide-react";
import { toast } from "sonner";

const hackathons = [
    {
        id: 1,
        name: "AI INNOVATORS CHALLENGE",
        date: "MARCH 15-17, 2026",
        location: "TUNIS, TUNISIA",
        participants: 120,
        maxParticipants: 150,
        duration: "48 HOURS",
        prize: "$10,000",
        status: "IN PROGRESS",
        statusColor: "text-green-500 border-green-500 bg-green-500/10",
        tags: ["AI", "MACHINE LEARNING", "HEALTHCARE"],
        description: "Build the next generation of AI-powered solutions to solve real-world problems. Focus on healthcare, education, and sustainability.",
        organizer: "TECHHUB TUNISIA",
    },
    {
        id: 2,
        name: "WEB3 SUMMIT HACKATHON",
        date: "MARCH 22-24, 2026",
        location: "SFAX, TUNISIA",
        participants: 95,
        maxParticipants: 100,
        duration: "36 HOURS",
        prize: "$5,000",
        status: "FILLING FAST",
        statusColor: "text-primary border-primary bg-primary/10",
        tags: ["BLOCKCHAIN", "WEB3", "DEFI"],
        description: "Shape the decentralized future. Build innovative dApps, smart contracts, and Web3 infrastructure.",
        organizer: "BLOCKCHAIN TUNISIA",
    },
    {
        id: 3,
        name: "CLIMATE TECH SOLUTIONS",
        date: "APRIL 5-7, 2026",
        location: "SOUSSE, TUNISIA",
        participants: 78,
        maxParticipants: 120,
        duration: "72 HOURS",
        prize: "$8,000",
        status: "UPCOMING",
        statusColor: "text-blue-400 border-blue-400 bg-blue-400/10",
        tags: ["CLIMATE", "SUSTAINABILITY", "IMPACT"],
        description: "Create technology to combat climate change. Focus on renewable energy, waste management, and sustainable living.",
        organizer: "GREENTECH ALLIANCE",
    },
    {
        id: 4,
        name: "HEALTHTECH INNOVATION",
        date: "APRIL 12-14, 2026",
        location: "MONASTIR, TUNISIA",
        participants: 65,
        maxParticipants: 100,
        duration: "48 HOURS",
        prize: "$7,500",
        status: "UPCOMING",
        statusColor: "text-blue-400 border-blue-400 bg-blue-400/10",
        tags: ["HEALTHCARE", "AI", "MOBILE"],
        description: "Revolutionize healthcare with technology. Develop solutions for telemedicine, patient care, and medical data.",
        organizer: "MEDTECH TUNISIA",
    },
];

export default function HackathonsPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("ALL STATUS");
    const [selectedRegion, setSelectedRegion] = useState("ALL REGIONS");

    const filteredHackathons = hackathons.filter((h) => {
        const matchesSearch = h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            h.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

        let matchesStatus = true;
        if (selectedStatus !== "ALL STATUS") {
            matchesStatus = h.status === selectedStatus;
        }

        let matchesRegion = true;
        if (selectedRegion !== "ALL REGIONS") {
            matchesRegion = h.location.toLowerCase().includes(selectedRegion.toLowerCase().replace(" ", "")); // simplified matching
        }

        return matchesSearch && matchesStatus && matchesRegion;
    });

    return (
        <DashboardLayout>
            <div className="max-w-6xl mx-auto pb-12">
                {/* Header section */}
                <div className="mb-12">
                    <div className="flex items-center relative mb-2">
                        <h1 className="text-5xl md:text-6xl font-black italic tracking-tighter uppercase text-white">
                            HACKATHON <span className="text-white text-glow-sm">MISSIONS</span>
                        </h1>
                        <div className="flex ml-4 gap-1 opacity-60 mt-4">
                            <div className="w-12 h-1 bg-primary"></div>
                            <div className="w-2 h-1 bg-primary"></div>
                            <div className="w-1 h-1 bg-primary"></div>
                        </div>
                    </div>
                    <div className="max-w-3xl mt-4">
                        <p className="text-[10px] text-white/50 uppercase tracking-[0.2em] font-bold leading-relaxed">
                            DISCOVER AND JOIN EXCITING HACKATHONS ACROSS TUNISIA AND BEYOND.
                        </p>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-4 mb-4">
                    {/* Search */}
                    <div className="flex-1 relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 group-focus-within:text-primary transition-colors" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="SEARCH OPERATIONS..."
                            className="w-full pl-12 pr-4 py-3 bg-black border border-white/5 rounded-sm text-white focus:outline-none focus:border-primary/50 transition-all text-xs font-bold uppercase tracking-widest placeholder:text-white/20"
                        />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                        {/* Region Filter */}
                        <div className="relative min-w-[200px] group">
                            <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 group-focus-within:text-primary transition-colors z-10" />
                            <select
                                value={selectedRegion}
                                onChange={(e) => setSelectedRegion(e.target.value)}
                                className="w-full pl-12 pr-10 py-3 bg-black border border-white/5 rounded-sm text-white focus:outline-none focus:border-primary/50 transition-all appearance-none cursor-pointer text-xs font-bold uppercase tracking-widest relative"
                            >
                                <option value="ALL REGIONS" className="bg-dark text-white">ALL REGIONS</option>
                                <option value="TUNIS" className="bg-dark text-white">TUNIS</option>
                                <option value="SFAX" className="bg-dark text-white">SFAX</option>
                                <option value="SOUSSE" className="bg-dark text-white">SOUSSE</option>
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/40">
                                <ChevronDown className="w-4 h-4" />
                            </div>
                        </div>

                        {/* Status Filter */}
                        <div className="relative min-w-[200px] group">
                            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 group-focus-within:text-primary transition-colors z-10" />
                            <select
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                                className="w-full pl-12 pr-10 py-3 bg-black border border-white/5 rounded-sm text-white focus:outline-none focus:border-primary/50 transition-all appearance-none cursor-pointer text-xs font-bold uppercase tracking-widest relative"
                            >
                                <option value="ALL STATUS" className="bg-dark text-white">ALL STATUS</option>
                                <option value="UPCOMING" className="bg-dark text-white">UPCOMING</option>
                                <option value="IN PROGRESS" className="bg-dark text-white">IN PROGRESS</option>
                                <option value="FILLING FAST" className="bg-dark text-white">FILLING FAST</option>
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/40">
                                <ChevronDown className="w-4 h-4" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Results count */}
                <p className="text-[10px] text-white/40 uppercase font-bold tracking-[0.2em] mb-8">
                    DISPLAYING {filteredHackathons.length} OF {hackathons.length} ACTIVE OPERATIONS
                </p>

                {/* Hackathons List */}
                <div className="flex flex-col gap-6">
                    {filteredHackathons.map((hackathon) => (
                        <div
                            key={hackathon.id}
                            className="relative bg-[#080808] border border-white/5 rounded-sm hover:border-primary/30 transition-all duration-300 flex flex-col md:flex-row group overflow-hidden"
                        >
                            {/* Corner Accents */}
                            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-primary opacity-50 group-hover:opacity-100 transition-opacity z-20"></div>
                            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-primary opacity-50 group-hover:opacity-100 transition-opacity z-20"></div>

                            {/* subtle background glow */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/0 group-hover:bg-primary/5 rounded-full blur-[80px] transition-all duration-700 pointer-events-none z-0"></div>

                            {/* Left Content Area */}
                            <div className="p-8 flex flex-col flex-1 z-10">
                                {/* Header */}
                                <div className="flex items-start justify-between mb-6">
                                    <div className="pr-4">
                                        <h3 className="text-2xl font-black italic text-white uppercase tracking-tighter mb-1 pb-1">
                                            {hackathon.name}
                                        </h3>
                                        <p className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">{hackathon.organizer}</p>
                                    </div>
                                    <span
                                        className={`px-3 py-1 text-[8px] uppercase font-bold tracking-widest border rounded-sm whitespace-nowrap ${hackathon.statusColor}`}
                                    >
                                        {hackathon.status}
                                    </span>
                                </div>

                                {/* Description */}
                                <p className="text-sm text-white/60 leading-relaxed mb-6 flex-1">
                                    {hackathon.description}
                                </p>

                                {/* Tags */}
                                <div className="flex flex-wrap gap-2 mb-8">
                                    {hackathon.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="px-2 py-1 bg-white/[0.03] border border-white/10 text-white/50 text-[9px] font-bold uppercase tracking-widest rounded-sm"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                {/* Info Grid */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-y-4 gap-x-6 mb-8">
                                    <div>
                                        <p className="text-[9px] text-white/40 uppercase tracking-widest font-bold mb-1">DATE</p>
                                        <div className="flex items-center gap-2 text-xs text-white font-medium uppercase tracking-widest">
                                            <Calendar className="w-3.5 h-3.5 text-primary" />
                                            <span>{hackathon.date}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-[9px] text-white/40 uppercase tracking-widest font-bold mb-1">LOCATION</p>
                                        <div className="flex items-center gap-2 text-xs text-white font-medium uppercase tracking-widest">
                                            <MapPin className="w-3.5 h-3.5 text-primary" />
                                            <span>{hackathon.location}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-[9px] text-white/40 uppercase tracking-widest font-bold mb-1">CAPACITY</p>
                                        <div className="flex items-center gap-2 text-xs text-white font-medium uppercase tracking-widest">
                                            <Users className="w-3.5 h-3.5 text-primary" />
                                            <span>
                                                {hackathon.participants} / {hackathon.maxParticipants} OPs
                                            </span>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-[9px] text-white/40 uppercase tracking-widest font-bold mb-1">DURATION</p>
                                        <div className="flex items-center gap-2 text-xs text-white font-medium uppercase tracking-widest">
                                            <Clock className="w-3.5 h-3.5 text-primary" />
                                            <span>{hackathon.duration}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Footer */}
                                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pt-6 border-t border-white/10 mt-auto">
                                    <div>
                                        <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-bold mb-1">PRIZE POOL</p>
                                        <span className="text-3xl font-black italic tracking-tighter text-white">{hackathon.prize}</span>
                                    </div>
                                    <button onClick={() => toast.success('Accessing mission intel...', { description: 'Decrypting operation dossier.' })} className="px-8 py-3 bg-primary/20 border border-primary/40 hover:bg-primary/30 hover:border-primary text-primary text-xs font-bold uppercase tracking-widest transition-all active:scale-[0.98] rounded-sm w-full sm:w-auto text-center">
                                        VIEW INTEL
                                    </button>
                                </div>
                            </div>

                            {/* Right Image Area */}
                            <div className="w-full md:w-1/3 min-h-[200px] md:min-h-full relative border-l border-white/5 shrink-0 bg-[#050505]">
                                <img
                                    src={`https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&seed=${hackathon.id}`}
                                    alt={`${hackathon.name} visual`}
                                    className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-500 mix-blend-overlay grayscale group-hover:grayscale-0"
                                />
                                {/* Overlay Gradient to fade into content on desktop*/}
                                <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#080808] to-transparent pointer-events-none w-full md:w-1/2"></div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Empty State */}
                {filteredHackathons.length === 0 && (
                    <div className="text-center py-16 bg-[#080808] border border-white/5 rounded-sm flex flex-col items-center justify-center">
                        <Search className="w-10 h-10 text-white/20 mb-4" />
                        <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-2">NO MISSIONS FOUND</h3>
                        <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-white/40">Adjust your search parameters or filter criteria</p>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
