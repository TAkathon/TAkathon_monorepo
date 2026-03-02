"use client";

import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import {
    Search,
    Filter,
    Download,
    Star,
    MapPin,
    Briefcase,
    ExternalLink,
    ChevronDown,
    Mail,
    Eye,
    Bookmark,
    Code2,
    Palette,
    Database,
    Shield
} from "lucide-react";

const talentPool = [
    {
        id: 1,
        name: "Alex Rivera",
        role: "Frontend Engineer",
        location: "San Francisco, US",
        skills: ["React", "TypeScript", "Next.js"],
        hackathons: 5,
        wins: 2,
        rating: 4.8,
        icon: Code2,
        available: true,
    },
    {
        id: 2,
        name: "Sarah Chen",
        role: "Full-Stack Developer",
        location: "Toronto, CA",
        skills: ["Node.js", "Python", "Web3"],
        hackathons: 8,
        wins: 3,
        rating: 4.9,
        icon: Database,
        available: true,
    },
    {
        id: 3,
        name: "James Wilson",
        role: "Data Scientist / ML Engineer",
        location: "London, UK",
        skills: ["Python", "TensorFlow", "PyTorch"],
        hackathons: 6,
        wins: 1,
        rating: 4.5,
        icon: Shield,
        available: false,
    },
    {
        id: 4,
        name: "Elena Petrova",
        role: "UI/UX Designer",
        location: "Berlin, DE",
        skills: ["Figma", "Framer", "CSS"],
        hackathons: 4,
        wins: 2,
        rating: 4.7,
        icon: Palette,
        available: true,
    },
];

export default function TalentPage() {
    const [searchQuery, setSearchQuery] = useState("");

    return (
        <DashboardLayout>
            <div className="space-y-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-white uppercase tracking-tight">Talent Radar</h1>
                        <div className="flex items-center gap-2 mt-2">
                            <div className="w-1.5 h-1.5 bg-primary animate-pulse rounded-full" />
                            <span className="text-[10px] text-white/40 uppercase tracking-[0.2em] font-bold">
                                Browse top-performing hackathon talent and download CVs
                            </span>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button className="btn-secondary flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold py-2">
                            <Bookmark className="w-4 h-4" />
                            Saved (4)
                        </button>
                        <button className="btn-primary flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold py-2">
                            <Download className="w-4 h-4" />
                            Export List
                        </button>
                    </div>
                </div>

                {/* Filters */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="md:col-span-2 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search by name, skill, or location..."
                            className="w-full pl-10 pr-4 py-3 bg-black border border-white/5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-primary/30 transition-all font-medium tracking-wide"
                        />
                    </div>
                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                        <select className="w-full pl-10 pr-8 py-3 bg-black border border-white/5 text-sm text-white appearance-none font-medium tracking-wide focus:outline-none focus:border-primary/30">
                            <option>All Specializations</option>
                            <option>Frontend</option>
                            <option>Backend</option>
                            <option>Data Science</option>
                            <option>Design</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
                    </div>
                    <div className="relative">
                        <Star className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                        <select className="w-full pl-10 pr-8 py-3 bg-black border border-white/5 text-sm text-white appearance-none font-medium tracking-wide focus:outline-none focus:border-primary/30">
                            <option>Any Rating</option>
                            <option>4.5+ Stars</option>
                            <option>4.0+ Stars</option>
                            <option>3.0+ Stars</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
                    </div>
                </div>

                {/* Talent Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {talentPool.map((talent) => {
                        const Icon = talent.icon;
                        return (
                            <div key={talent.id} className="glass rounded-xl p-6 border border-white/5 hover:border-primary/20 transition-all duration-300 group">
                                <div className="flex items-start gap-4">
                                    <div className="w-14 h-14 bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-black text-lg group-hover:scale-105 transition-all">
                                        {talent.name.charAt(0)}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h3 className="text-lg font-bold text-white uppercase tracking-wider group-hover:text-primary-light transition-colors">{talent.name}</h3>
                                                <div className="flex items-center gap-2">
                                                    <Icon className="w-3.5 h-3.5 text-primary" />
                                                    <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">{talent.role}</p>
                                                </div>
                                            </div>
                                            <div className={`px-2 py-0.5 text-[8px] font-bold uppercase tracking-[0.2em] border ${talent.available ? "bg-green-500/10 text-green-400 border-green-500/20" : "bg-red-500/10 text-red-400 border-red-500/20"
                                                }`}>
                                                {talent.available ? "Available" : "Hired"}
                                            </div>
                                        </div>

                                        <div className="mt-4 flex items-center gap-4 text-[10px] text-white/40 uppercase tracking-widest font-bold">
                                            <span className="flex items-center gap-1.5">
                                                <MapPin className="w-3.5 h-3.5 text-primary" />
                                                {talent.location}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                                                {talent.rating}
                                            </span>
                                        </div>

                                        <div className="mt-3 flex flex-wrap gap-2">
                                            {talent.skills.map((skill) => (
                                                <span key={skill} className="px-2 py-1 bg-white/[0.02] border border-white/5 text-[8px] text-white/40 uppercase tracking-[0.2em] font-bold">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>

                                        <div className="mt-4 flex items-center justify-between">
                                            <div className="text-[10px] text-white/30 uppercase tracking-widest font-bold space-x-4">
                                                <span><Briefcase className="w-3 h-3 inline" /> {talent.hackathons} hacks</span>
                                                <span>🏆 {talent.wins} wins</span>
                                            </div>
                                            <div className="flex gap-2">
                                                <button className="p-2 text-white/30 hover:text-white hover:bg-white/5 transition-all" title="Save">
                                                    <Bookmark className="w-4 h-4" />
                                                </button>
                                                <button className="p-2 text-white/30 hover:text-primary hover:bg-primary/10 transition-all" title="View CV">
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                <button className="p-2 text-white/30 hover:text-primary hover:bg-primary/10 transition-all" title="Contact">
                                                    <Mail className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </DashboardLayout>
    );
}
