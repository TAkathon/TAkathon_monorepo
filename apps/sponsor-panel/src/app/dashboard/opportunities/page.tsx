"use client";

import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import {
    Search,
    Filter,
    MapPin,
    Calendar,
    DollarSign,
    ExternalLink,
    ChevronRight,
    Trophy
} from "lucide-react";

const opportunities = [
    {
        id: 1,
        name: "Global AI Hackathon 2024",
        organizer: "AI Society",
        date: "Oct 15-17, 2024",
        location: "Tunis, Tunisia (Hybrid)",
        category: "Artificial Intelligence",
        budgetRange: "$1,000 - $10,000",
        description: "Join 500+ developers building the next generation of AI tools.",
        tags: ["AI", "Web3", "Machine Learning"],
    },
    {
        id: 2,
        name: "GreenTech Challenge",
        organizer: "Eco Innovators",
        date: "Nov 5-6, 2024",
        location: "Sousse, Tunisia",
        category: "Sustainability",
        budgetRange: "$500 - $5,000",
        description: "Solving environmental challenges through sustainable technology.",
        tags: ["Sustainability", "IoT", "Clean Energy"],
    },
    {
        id: 3,
        name: "FinTech Forge",
        organizer: "Banking Group",
        date: "Dec 10-12, 2024",
        location: "Online",
        category: "FinTech",
        budgetRange: "$2,000 - $15,000",
        description: "Revolutionizing digital banking and financial inclusion.",
        tags: ["Finance", "Blockchain", "Security"],
    },
];

export default function OpportunitiesPage() {
    const [searchTerm, setSearchTerm] = useState("");

    return (
        <DashboardLayout>
            <div className="space-y-8">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-white uppercase tracking-tight">Discover Operations</h1>
                    <div className="flex items-center gap-2 mt-2">
                        <div className="w-1.5 h-1.5 bg-primary animate-pulse rounded-full" />
                        <span className="text-[10px] text-white/40 uppercase tracking-[0.2em] font-bold">
                            Find upcoming events seeking sponsorship
                        </span>
                    </div>
                </div>

                {/* Filters */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="md:col-span-2 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                        <input
                            type="text"
                            placeholder="Search by name, category, or organizer..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-black border border-white/5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-primary/30 transition-all font-medium tracking-wide"
                        />
                    </div>
                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                        <select className="w-full pl-10 pr-4 py-3 bg-black border border-white/5 text-sm text-white appearance-none font-medium tracking-wide focus:outline-none focus:border-primary/30">
                            <option>All Categories</option>
                            <option>AI</option>
                            <option>Web3</option>
                            <option>FinTech</option>
                        </select>
                    </div>
                    <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                        <select className="w-full pl-10 pr-4 py-3 bg-black border border-white/5 text-sm text-white appearance-none font-medium tracking-wide focus:outline-none focus:border-primary/30">
                            <option>Any Budget</option>
                            <option>$0 - $1k</option>
                            <option>$1k - $5k</option>
                            <option>$5k+</option>
                        </select>
                    </div>
                </div>

                {/* Opportunities List */}
                <div className="grid grid-cols-1 gap-6">
                    {opportunities.map((opp) => (
                        <div key={opp.id} className="glass p-6 rounded-xl border border-white/5 hover:border-primary/20 transition-all duration-300 group">
                            <div className="flex flex-col lg:flex-row gap-6">
                                <div className="flex-1 space-y-4">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h3 className="text-lg font-bold text-white group-hover:text-primary-light transition-colors uppercase tracking-wider">
                                                {opp.name}
                                            </h3>
                                            <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">by {opp.organizer}</p>
                                        </div>
                                        <div className="px-3 py-1 bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest">
                                            {opp.category}
                                        </div>
                                    </div>

                                    <p className="text-white/60 text-xs leading-relaxed max-w-2xl uppercase tracking-wider font-medium">
                                        {opp.description}
                                    </p>

                                    <div className="flex flex-wrap gap-4 text-[10px] text-white/40 uppercase tracking-widest font-bold">
                                        <div className="flex items-center gap-1.5">
                                            <Calendar className="w-3.5 h-3.5 text-primary" />
                                            {opp.date}
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <MapPin className="w-3.5 h-3.5 text-primary" />
                                            {opp.location}
                                        </div>
                                        <div className="flex items-center gap-1.5 text-primary">
                                            <DollarSign className="w-3.5 h-3.5" />
                                            {opp.budgetRange}
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        {opp.tags.map(tag => (
                                            <span key={tag} className="px-2 py-1 bg-white/[0.02] border border-white/5 text-[8px] text-white/40 uppercase tracking-[0.2em] font-bold">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex flex-row lg:flex-col justify-center gap-3 min-w-[160px]">
                                    <button className="flex-1 lg:flex-none btn-primary flex items-center justify-center gap-2 py-2.5 text-[10px] uppercase tracking-widest font-bold">
                                        Interested
                                        <ChevronRight className="w-3.5 h-3.5" />
                                    </button>
                                    <button className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-2.5 border border-white/5 hover:border-white/20 transition-all text-white/50 hover:text-white text-[10px] uppercase tracking-widest font-bold">
                                        Details
                                        <ExternalLink className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </DashboardLayout>
    );
}
