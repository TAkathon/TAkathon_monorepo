"use client";

import { useState } from "react";
import OrganizerLayout from "@/components/OrganizerLayout";
import {
    Plus,
    Search,
    Filter,
    MoreVertical,
    Users,
    Calendar,
    Globe,
    MapPin,
    ChevronDown,
    Edit2,
    Eye
} from "lucide-react";

const hackathons = [
    {
        id: 1,
        name: "AI GLOBAL SUMMIT 2026",
        status: "IN PROGRESS",
        type: "ONLINE",
        participants: 540,
        maxParticipants: 1000,
        startDate: "FEB 15, 2026",
        endDate: "FEB 17, 2026",
        image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=400",
        statusColor: "text-green-500"
    },
    {
        id: 2,
        name: "WEB3 INNOVATION HACK",
        status: "REGISTRATION OPEN",
        type: "HYBRID",
        participants: 210,
        maxParticipants: 500,
        startDate: "MAR 10, 2026",
        endDate: "MAR 12, 2026",
        image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=400",
        statusColor: "text-primary"
    },
    {
        id: 3,
        name: "ECO-TECH CHALLENGE",
        status: "PLANNING",
        type: "IN-PERSON",
        participants: 0,
        maxParticipants: 200,
        startDate: "APR 05, 2026",
        endDate: "APR 07, 2026",
        image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=400",
        statusColor: "text-white/40"
    },
];

export default function HackathonsPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("ALL");

    return (
        <OrganizerLayout>
            <div className="max-w-6xl mx-auto space-y-8 pb-12">
                {/* Background Floating Objects */}
                <div className="absolute top-20 right-10 w-32 h-32 bg-primary/20 rounded-full blur-[80px] pointer-events-none"></div>

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div>
                        <div className="flex items-center relative mb-1">
                            <h1 className="text-5xl md:text-6xl font-black italic tracking-tighter uppercase text-white">
                                <span className="text-white">OPERATIONS</span>
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
                                MANAGE AND MONITOR ACTIVE MISSIONS
                            </span>
                        </div>
                    </div>
                    <button className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white border border-primary hover:bg-primary-dark hover:shadow-[0_0_15px_rgba(255,92,0,0.4)] transition-all active:scale-[0.98] rounded-sm drop-shadow-md text-[10px] font-bold tracking-widest uppercase mt-4">
                        <Plus className="w-4 h-4" />
                        <span>DEPLOY NEW OPERATION</span>
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
                            placeholder="SEARCH OPERATIONS..."
                            className="w-full pl-12 pr-4 py-3 bg-[#080808] border border-white/10 text-[10px] font-bold uppercase tracking-widest text-white placeholder:text-white/30 focus:outline-none focus:border-primary/50 transition-all rounded-sm"
                        />
                    </div>
                    <div className="relative min-w-[200px]">
                        <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                        <select
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            className="w-full pl-12 pr-8 py-3 bg-[#080808] border border-white/10 text-[10px] font-bold uppercase tracking-widest text-white focus:outline-none focus:border-primary/50 transition-all appearance-none cursor-pointer rounded-sm"
                        >
                            <option value="ALL">ALL STATUS</option>
                            <option value="PLANNING">PLANNING</option>
                            <option value="REGISTRATION OPEN">REGISTRATION OPEN</option>
                            <option value="IN PROGRESS">IN PROGRESS</option>
                            <option value="COMPLETED">COMPLETED</option>
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
                    </div>
                </div>

                {/* Cards List */}
                <div className="flex flex-col gap-6">
                    {hackathons.map((hackathon) => (
                        <div
                            key={hackathon.id}
                            className="relative bg-[#080808] border border-white/5 rounded-sm hover:border-white/10 transition-all duration-300 group flex flex-col md:flex-row"
                        >
                            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/20 z-10"></div>
                            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r flex items-end justify-end group-hover:border-primary/50 transition-colors z-10"></div>

                            {/* Image */}
                            <div className="relative md:w-80 h-48 md:h-auto bg-black overflow-hidden border-b md:border-b-0 md:border-r border-white/5 p-1 shrink-0">
                                <img
                                    src={hackathon.image}
                                    alt={hackathon.name}
                                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 opacity-50 group-hover:opacity-100 rounded-[1px]"
                                />
                                <div className="absolute top-4 right-4 z-20 md:hidden">
                                    <button className="p-2 bg-black/80 border border-white/10 text-white/50 hover:text-white transition-all rounded-sm">
                                        <MoreVertical className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6 space-y-4 flex-1 flex flex-col relative z-20 bg-gradient-to-t md:bg-gradient-to-l from-[#050505] to-transparent">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-xl md:text-2xl font-black italic tracking-tighter uppercase text-white group-hover:text-primary-light transition-colors mb-2">
                                            {hackathon.name}
                                        </h3>
                                        <div className="flex items-center gap-2 bg-[#080808] px-3 py-1 border border-white/10 rounded-sm inline-flex">
                                            <div className="w-2 h-2 bg-primary mt-0.5 rounded-sm rotate-45" />
                                            <span className={`text-[10px] font-bold tracking-widest uppercase ${hackathon.statusColor}`}>
                                                {hackathon.status}
                                            </span>
                                        </div>
                                    </div>

                                    <button className="hidden md:flex p-2 bg-transparent border border-transparent hover:border-white/10 text-white/30 hover:text-white/80 transition-all rounded-sm">
                                        <MoreVertical className="w-4 h-4" />
                                    </button>
                                </div>

                                <div className="flex flex-col md:flex-row md:items-center gap-6 mt-4 pb-4 border-b border-white/5">
                                    <div className="flex items-center gap-6">
                                        <div className="flex items-center gap-2">
                                            {hackathon.type === "ONLINE" ? <Globe className="w-4 h-4 text-primary" /> : <MapPin className="w-4 h-4 text-primary" />}
                                            <span className="text-[10px] text-white/60 font-bold uppercase tracking-widest">{hackathon.type}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-primary" />
                                            <span className="text-[10px] text-white/60 font-bold uppercase tracking-widest">{hackathon.startDate}</span>
                                        </div>
                                    </div>
                                    <div className="flex-1 w-full md:pl-6 md:border-l md:border-white/5">
                                        <div className="flex justify-between text-[10px] uppercase tracking-widest font-bold mb-1">
                                            <span className="flex items-center gap-1.5 text-white/40"><Users className="w-3 h-3 text-white/20" /> RECRUITS</span>
                                            <span className="text-white">{hackathon.participants} / {hackathon.maxParticipants}</span>
                                        </div>
                                        <div className="w-full h-1.5 bg-white/5 rounded-sm overflow-hidden border border-white/10">
                                            <div
                                                className="h-full bg-gradient-to-r from-primary/60 to-primary shadow-[0_0_10px_rgba(255,92,0,0.5)]"
                                                style={{ width: `${(hackathon.participants / hackathon.maxParticipants) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-2 mt-auto flex flex-wrap gap-3">
                                    <button className="flex items-center justify-center gap-2 px-4 py-2 bg-transparent text-white border border-white/20 hover:border-white/40 hover:bg-white/5 text-[10px] uppercase tracking-widest font-bold transition-all rounded-sm flex-1 md:flex-none">
                                        <Eye className="w-3.5 h-3.5" />
                                        DETAILS
                                    </button>
                                    <button className="flex items-center justify-center gap-2 px-4 py-2 bg-primary/10 text-primary border border-primary/20 hover:border-primary hover:text-white hover:bg-primary hover:shadow-[0_0_10px_rgba(255,92,0,0.3)] text-[10px] uppercase tracking-widest font-bold transition-all rounded-sm flex-1 md:flex-none">
                                        <Edit2 className="w-3.5 h-3.5" />
                                        MODIFY
                                    </button>
                                    <button className="flex items-center justify-center gap-2 px-4 py-2 bg-transparent text-white border border-white/20 hover:border-white/40 hover:bg-white/5 text-[10px] uppercase tracking-widest font-bold transition-all rounded-sm flex-1 md:flex-none">
                                        <Users className="w-3.5 h-3.5" />
                                        VIEW TEAMS
                                    </button>
                                    <button className="flex items-center justify-center gap-2 px-4 py-2 bg-transparent text-white border border-white/20 hover:border-white/40 hover:bg-white/5 text-[10px] uppercase tracking-widest font-bold transition-all rounded-sm flex-1 md:flex-none">
                                        <Globe className="w-3.5 h-3.5" />
                                        ENTER HUB
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Create New Card */}
                    <button className="relative bg-[#050505] border-2 border-dashed border-white/10 hover:border-primary/40 hover:bg-primary/5 transition-all group flex flex-row items-center justify-center p-8 gap-6 min-h-[160px] rounded-sm">
                        <div className="w-12 h-12 bg-white/5 border border-white/10 flex items-center justify-center text-white/30 group-hover:text-primary group-hover:bg-primary/10 group-hover:border-primary/30 transition-all rounded-sm transform group-hover:rotate-90 duration-500 shrink-0">
                            <Plus className="w-6 h-6" />
                        </div>
                        <div className="text-left">
                            <h3 className="text-lg font-black italic tracking-tighter text-white/60 group-hover:text-white transition-all uppercase">DEPLOY NEW OPERATION</h3>
                            <p className="text-[10px] text-primary/60 mt-1 uppercase tracking-widest font-bold">INITIALIZE PROTOCOL</p>
                        </div>
                    </button>
                </div>
            </div>
        </OrganizerLayout>
    );
}
