"use client";

import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { 
    Search, 
    Filter, 
    MoreVertical, 
    User, 
    Mail, 
    MapPin,
    Download,
    CheckCircle2,
    XCircle,
    Clock,
    ChevronDown,
    ExternalLink
} from "lucide-react";

const participants = [
    {
        id: 1,
        name: "Alex Rivera",
        email: "alex.r@example.com",
        role: "Frontend Developer",
        location: "San Francisco, US",
        hackathon: "AI Global Summit",
        status: "Approved",
        appliedDate: "Feb 10, 2026",
    },
    {
        id: 2,
        name: "Sarah Chen",
        email: "s.chen@example.com",
        role: "Fullstack Developer",
        location: "Toronto, CA",
        hackathon: "Web3 Innovation Hack",
        status: "Pending",
        appliedDate: "Feb 11, 2026",
    },
    {
        id: 3,
        name: "James Wilson",
        email: "j.wilson@example.com",
        role: "Data Scientist",
        location: "London, UK",
        hackathon: "AI Global Summit",
        status: "Under Review",
        appliedDate: "Feb 09, 2026",
    },
    {
        id: 4,
        name: "Elena Petrova",
        email: "elena.p@example.com",
        role: "UI/UX Designer",
        location: "Berlin, DE",
        hackathon: "AI Global Summit",
        status: "Approved",
        appliedDate: "Feb 08, 2026",
    },
    {
        id: 5,
        name: "Michael Chang",
        email: "m.chang@example.com",
        role: "Backend Developer",
        location: "Singapore",
        hackathon: "Web3 Innovation Hack",
        status: "Rejected",
        appliedDate: "Feb 07, 2026",
    },
];

export default function ParticipantsPage() {
    const [searchQuery, setSearchQuery] = useState("");

    return (
        <DashboardLayout>
            <div className="space-y-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Participants</h1>
                        <p className="text-white/60 mt-1">Review applications and manage participants</p>
                    </div>
                    <button className="btn-secondary flex items-center justify-center gap-2">
                        <Download className="w-5 h-5" />
                        <span>Export CSV</span>
                    </button>
                </div>

                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search by name, email, or role..."
                            className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:border-primary/50 transition-all"
                        />
                    </div>
                    <div className="flex gap-4">
                        <div className="relative min-w-[160px]">
                            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                            <select className="w-full pl-11 pr-8 py-3 bg-white/5 border border-white/10 rounded-lg text-white appearance-none cursor-pointer focus:outline-none focus:border-primary/50 transition-all">
                                <option>All Status</option>
                                <option>Approved</option>
                                <option>Pending</option>
                                <option>Under Review</option>
                                <option>Rejected</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="glass rounded-xl overflow-hidden border border-white/10">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/10 bg-white/5">
                                    <th className="px-6 py-4 text-sm font-semibold text-white/60 uppercase tracking-wider">Participant</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-white/60 uppercase tracking-wider">Hackathon</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-white/60 uppercase tracking-wider">Role</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-white/60 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-white/60 uppercase tracking-wider text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {participants.map((p) => (
                                    <tr key={p.id} className="hover:bg-white/[0.02] transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold group-hover:scale-110 transition-transform">
                                                    {p.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="text-white font-medium flex items-center gap-1">
                                                        {p.name}
                                                        <ExternalLink className="w-3 h-3 text-white/20 group-hover:text-primary transition-colors cursor-pointer" />
                                                    </div>
                                                    <div className="text-xs text-white/40">{p.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-white/80 text-sm">{p.hackathon}</div>
                                            <div className="text-[10px] text-white/30 flex items-center gap-1 mt-0.5">
                                                <Clock className="w-3 h-3" />
                                                Applied {p.appliedDate}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-white/80 text-sm">{p.role}</div>
                                            <div className="text-[10px] text-white/30 flex items-center gap-1 mt-0.5">
                                                <MapPin className="w-3 h-3" />
                                                {p.location}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                                                p.status === "Approved" ? "bg-green-500/10 text-green-400 border-green-500/20" :
                                                p.status === "Pending" ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20" :
                                                p.status === "Rejected" ? "bg-red-500/10 text-red-400 border-red-500/20" :
                                                "bg-blue-500/10 text-blue-400 border-blue-500/20"
                                            }`}>
                                                {p.status === "Approved" ? <CheckCircle2 className="w-3.5 h-3.5" /> : 
                                                 p.status === "Rejected" ? <XCircle className="w-3.5 h-3.5" /> : 
                                                 <Clock className="w-3.5 h-3.5" />}
                                                {p.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="p-2 text-white/40 hover:text-white hover:bg-white/5 rounded-lg transition-all">
                                                <MoreVertical className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {/* Pagination Placeholder */}
                    <div className="px-6 py-4 border-t border-white/10 bg-white/5 flex items-center justify-between text-sm">
                        <div className="text-white/40">Showing 1 to 5 of 1,284 participants</div>
                        <div className="flex items-center gap-2">
                            <button className="px-3 py-1 bg-white/5 border border-white/10 rounded text-white/40 cursor-not-allowed">Previous</button>
                            <button className="px-3 py-1 bg-primary text-white rounded">1</button>
                            <button className="px-3 py-1 bg-white/5 border border-white/10 rounded text-white hover:bg-white/10">2</button>
                            <button className="px-3 py-1 bg-white/5 border border-white/10 rounded text-white hover:bg-white/10">3</button>
                            <button className="px-3 py-1 bg-white/5 border border-white/10 rounded text-white hover:bg-white/10">Next</button>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
