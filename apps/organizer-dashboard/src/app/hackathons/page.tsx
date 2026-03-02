"use client";

import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import {
    Plus,
    Search,
    Filter,
    MoreVertical,
    Users,
    Calendar,
    Clock,
    MapPin,
    Globe,
    ChevronDown,
    Edit2,
    Eye
} from "lucide-react";

const hackathons = [
    {
        id: 1,
        name: "AI Global Summit 2026",
        status: "In Progress",
        type: "Online",
        participants: 540,
        maxParticipants: 1000,
        startDate: "Feb 15, 2026",
        endDate: "Feb 17, 2026",
        image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=400",
    },
    {
        id: 2,
        name: "Web3 Innovation Hack",
        status: "Registration Open",
        type: "Hybrid",
        participants: 210,
        maxParticipants: 500,
        startDate: "Mar 10, 2026",
        endDate: "Mar 12, 2026",
        image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=400",
    },
    {
        id: 3,
        name: "Eco-Tech Challenge",
        status: "Planning",
        type: "In-Person",
        participants: 0,
        maxParticipants: 200,
        startDate: "Apr 05, 2026",
        endDate: "Apr 07, 2026",
        image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=400",
    },
];

export default function HackathonsPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("All");

    return (
        <DashboardLayout>
            <div className="space-y-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-white uppercase tracking-tight">Operations</h1>
                        <div className="flex items-center gap-2 mt-2">
                            <div className="w-1.5 h-1.5 bg-primary animate-pulse rounded-full" />
                            <span className="text-[10px] text-white/40 uppercase tracking-[0.2em] font-bold">
                                Manage and monitor active missions
                            </span>
                        </div>
                    </div>
                    <button className="btn-primary flex items-center justify-center gap-2 text-xs uppercase tracking-widest font-bold">
                        <Plus className="w-4 h-4" />
                        <span>Deploy New Operation</span>
                    </button>
                </div>

                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search operations..."
                            className="w-full pl-10 pr-4 py-3 bg-black border border-white/5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-primary/30 transition-all font-medium tracking-wide"
                        />
                    </div>
                    <div className="relative min-w-[200px]">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                        <select
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            className="w-full pl-10 pr-8 py-3 bg-black border border-white/5 text-sm text-white focus:outline-none focus:border-primary/30 transition-all appearance-none cursor-pointer font-medium tracking-wide"
                        >
                            <option value="All">All Status</option>
                            <option value="Planning">Planning</option>
                            <option value="Registration Open">Registration Open</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
                    </div>
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {hackathons.map((hackathon) => (
                        <div
                            key={hackathon.id}
                            className="glass rounded-xl overflow-hidden border border-white/5 hover:border-primary/20 transition-all duration-300 group flex flex-col"
                        >
                            {/* Image */}
                            <div className="relative h-48 bg-black overflow-hidden">
                                <img
                                    src={hackathon.image}
                                    alt={hackathon.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-50 group-hover:opacity-70"
                                />
                                <div className="absolute top-4 left-4">
                                    <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest border ${hackathon.status === "In Progress" ? "bg-green-500/20 text-green-400 border-green-500/30 shadow-[0_0_10px_rgba(34,197,94,0.3)]" :
                                            hackathon.status === "Registration Open" ? "bg-primary/20 text-primary border-primary/30" :
                                                "bg-white/10 text-white/60 border-white/20 backdrop-blur-md"
                                        }`}>
                                        {hackathon.status}
                                    </span>
                                </div>
                                <div className="absolute top-4 right-4">
                                    <button className="p-2 bg-black/60 backdrop-blur-md text-white/50 hover:text-white transition-all">
                                        <MoreVertical className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6 space-y-4 flex-1 flex flex-col">
                                <div>
                                    <h3 className="text-lg font-bold text-white group-hover:text-primary-light transition-colors line-clamp-1">{hackathon.name}</h3>
                                    <div className="flex items-center gap-4 mt-2 text-[10px] text-white/40 uppercase tracking-widest font-bold">
                                        <span className="flex items-center gap-1">
                                            {hackathon.type === "Online" ? <Globe className="w-3.5 h-3.5 text-primary" /> : <MapPin className="w-3.5 h-3.5 text-primary" />}
                                            {hackathon.type}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Calendar className="w-3.5 h-3.5 text-primary" />
                                            {hackathon.startDate.split(',')[0]}
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between text-[10px] uppercase tracking-widest font-bold">
                                        <span className="text-white/40">Recruits</span>
                                        <span className="text-white">{hackathon.participants} / {hackathon.maxParticipants}</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-primary rounded-full shadow-[0_0_10px_rgba(255,92,0,0.5)]"
                                            style={{ width: `${(hackathon.participants / hackathon.maxParticipants) * 100}%` }}
                                        />
                                    </div>
                                </div>

                                <div className="pt-4 mt-auto grid grid-cols-2 gap-3">
                                    <button className="flex items-center justify-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-[10px] uppercase tracking-widest font-bold transition-all border border-white/5 hover:border-white/20">
                                        <Eye className="w-3.5 h-3.5" />
                                        Details
                                    </button>
                                    <button className="flex items-center justify-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary text-[10px] uppercase tracking-widest font-bold transition-all border border-primary/20">
                                        <Edit2 className="w-3.5 h-3.5" />
                                        Modify
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Create New Card */}
                    <button className="glass border-2 border-dashed border-white/10 hover:border-primary/40 hover:bg-primary/5 transition-all group flex flex-col items-center justify-center p-8 gap-4 min-h-[400px]">
                        <div className="w-14 h-14 bg-white/5 flex items-center justify-center text-white/30 group-hover:text-primary group-hover:bg-primary/10 transition-all">
                            <Plus className="w-7 h-7" />
                        </div>
                        <div className="text-center">
                            <h3 className="text-sm font-bold text-white/60 group-hover:text-primary transition-all uppercase tracking-widest">Deploy New Operation</h3>
                            <p className="text-[10px] text-white/30 mt-1 uppercase tracking-widest font-medium">Start organizing your next mission</p>
                        </div>
                    </button>
                </div>
            </div>
        </DashboardLayout>
    );
}
