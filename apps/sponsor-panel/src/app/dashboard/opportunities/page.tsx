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
                    {opportunities.map((opp) => (
                        <div key={opp.id} className="glass p-6 rounded-2xl hover:border-primary/30 transition-all duration-300 group">
                            <div className="flex flex-col lg:flex-row gap-6">
                                {/* Event Info */}
                                <div className="flex-1 space-y-4">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors">
                                                {opp.name}
                                            </h3>
                                            <p className="text-white/40 text-sm">by {opp.organizer}</p>
                                        </div>
                                        <div className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium uppercase">
                                            {opp.category}
                                        </div>
                                    </div>
                                    
                                    <p className="text-white/70 text-sm leading-relaxed max-w-2xl">
                                        {opp.description}
                                    </p>

                                    <div className="flex flex-wrap gap-4 text-sm text-white/40">
                                        <div className="flex items-center gap-1.5">
                                            <Calendar className="w-4 h-4" />
                                            {opp.date}
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <MapPin className="w-4 h-4" />
                                            {opp.location}
                                        </div>
                                        <div className="flex items-center gap-1.5 text-primary">
                                            <DollarSign className="w-4 h-4" />
                                            {opp.budgetRange}
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        {opp.tags.map(tag => (
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
        </DashboardLayout>
    );
}
