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
    Trash2,
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
                        <h1 className="text-3xl font-bold text-white">My Hackathons</h1>
                        <p className="text-white/60 mt-1">Manage and monitor your organized events</p>
                    </div>
                    <button className="btn-primary flex items-center justify-center gap-2">
                        <Plus className="w-5 h-5" />
                        <span>Create Hackathon</span>
                    </button>
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
                            placeholder="Search hackathons..."
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
                            <option value="Planning">Planning</option>
                            <option value="Registration Open">Registration Open</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-white/40">
                            <ChevronDown className="w-4 h-4" />
                        </div>
                    </div>
                </div>

                {/* Hackathons Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {hackathons.map((hackathon) => (
                        <div 
                            key={hackathon.id} 
                            className="glass rounded-xl overflow-hidden border border-white/10 hover:border-primary/30 transition-all group flex flex-col"
                        >
                            {/* Image Placeholder */}
                            <div className="relative h-48 bg-white/5 overflow-hidden">
                                <img 
                                    src={hackathon.image} 
                                    alt={hackathon.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-60 group-hover:opacity-80"
                                />
                                <div className="absolute top-4 left-4">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                        hackathon.status === "In Progress" ? "bg-green-500 text-white shadow-[0_0_10px_rgba(34,197,94,0.5)]" :
                                        hackathon.status === "Registration Open" ? "bg-primary text-white" :
                                        "bg-white/20 text-white backdrop-blur-md"
                                    }`}>
                                        {hackathon.status}
                                    </span>
                                </div>
                                <div className="absolute top-4 right-4">
                                    <button className="p-2 bg-black/40 backdrop-blur-md rounded-lg text-white/70 hover:text-white transition-all">
                                        <MoreVertical className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6 space-y-4 flex-1 flex flex-col">
                                <div>
                                    <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors line-clamp-1">
                                        {hackathon.name}
                                    </h3>
                                    <div className="flex items-center gap-4 mt-2 text-sm text-white/40">
                                        <span className="flex items-center gap-1">
                                            {hackathon.type === "Online" ? <Globe className="w-4 h-4" /> : <MapPin className="w-4 h-4" />}
                                            {hackathon.type}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Calendar className="w-4 h-4" />
                                            {hackathon.startDate.split(',')[0]}
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs">
                                        <span className="text-white/40">Registrations</span>
                                        <span className="text-white font-medium">{hackathon.participants} / {hackathon.maxParticipants}</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-primary rounded-full transition-all duration-500" 
                                            style={{ width: `${(hackathon.participants / hackathon.maxParticipants) * 100}%` }}
                                        />
                                    </div>
                                </div>

                                <div className="pt-4 mt-auto grid grid-cols-2 gap-3">
                                    <button className="flex items-center justify-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-all text-sm font-medium border border-white/10">
                                        <Eye className="w-4 h-4" />
                                        View Details
                                    </button>
                                    <button className="flex items-center justify-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-all text-sm font-medium border border-primary/20">
                                        <Edit2 className="w-4 h-4" />
                                        Edit
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Create New Card */}
                    <button className="glass rounded-xl border-2 border-dashed border-white/10 hover:border-primary/50 hover:bg-primary/5 transition-all group flex flex-col items-center justify-center p-8 gap-4 min-h-[400px]">
                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-white/40 group-hover:text-primary group-hover:bg-primary/10 transition-all">
                            <Plus className="w-8 h-8" />
                        </div>
                        <div className="text-center">
                            <h3 className="text-lg font-bold text-white group-hover:text-primary transition-all">Host New Event</h3>
                            <p className="text-sm text-white/40 mt-1">Start organizing your next big hackathon</p>
                        </div>
                    </button>
                </div>
            </div>
        </DashboardLayout>
    );
}
