"use client";

import { useState, useMemo } from "react";
import OrganizerLayout from "@/components/OrganizerLayout";
import { toast } from "sonner";
import {
    Search,
    Filter,
    ChevronDown,
    Plus,
    Check,
    X,
    Clock,
    Trophy,
    FileText,
    Users,
    UserCheck,
    UserX,
    Mail,
    Briefcase,
    Calendar,
    ExternalLink,
    Zap,
    ShieldAlert,
    Activity
} from "lucide-react";

// ── Types ──
type ApplicationStatus = "PENDING" | "APPROVED" | "REJECTED";

interface Application {
    id: number;
    name: string;
    email: string;
    role: string;
    hackathon: string;
    appliedDate: string;
    status: ApplicationStatus;
    message: string;
}

// ── Mock Data ──
const initialApplications: Application[] = [
    {
        id: 1,
        name: "ALEX RIVERA",
        email: "ALEX.R@EXAMPLE.COM",
        role: "FRONTEND DEVELOPER",
        hackathon: "AI GLOBAL SUMMIT 2026",
        appliedDate: "FEB 28, 2026",
        status: "PENDING",
        message: "Excited to build AI-powered accessibility tools.",
    },
    {
        id: 2,
        name: "SARAH CHEN",
        email: "S.CHEN@EXAMPLE.COM",
        role: "FULLSTACK DEVELOPER",
        hackathon: "AI GLOBAL SUMMIT 2026",
        appliedDate: "FEB 27, 2026",
        status: "PENDING",
        message: "Looking to contribute to open-source AI projects.",
    },
    {
        id: 3,
        name: "JAMES WILSON",
        email: "J.WILSON@EXAMPLE.COM",
        role: "DATA SCIENTIST",
        hackathon: "WEB3 INNOVATION HACK",
        appliedDate: "FEB 25, 2026",
        status: "APPROVED",
        message: "Expert in neural networks and NLP.",
    },
    {
        id: 4,
        name: "ELENA PETROVA",
        email: "ELENA.P@EXAMPLE.COM",
        role: "UI/UX DESIGNER",
        hackathon: "AI GLOBAL SUMMIT 2026",
        appliedDate: "FEB 24, 2026",
        status: "REJECTED",
        message: "Passionate about designing intuitive interfaces.",
    },
    {
        id: 5,
        name: "MICHAEL CHANG",
        email: "M.CHANG@EXAMPLE.COM",
        role: "BACKEND DEVELOPER",
        hackathon: "WEB3 INNOVATION HACK",
        appliedDate: "FEB 23, 2026",
        status: "PENDING",
        message: "Blockchain and smart contract enthusiast.",
    },
];

const hackathonOptions = [
    "ALL MISSIONS",
    "AI GLOBAL SUMMIT 2026",
    "WEB3 INNOVATION HACK",
    "ECO-TECH CHALLENGE",
];

// ── Status Config ──
const statusConfig: Record<ApplicationStatus, { color: string; bg: string; border: string; icon: any; shadow: string }> = {
    PENDING: { color: "text-amber-400", bg: "bg-amber-400/10", border: "border-amber-400/20", icon: Clock, shadow: "shadow-[0_0_10px_rgba(251,191,36,0.3)]" },
    APPROVED: { color: "text-green-500", bg: "bg-green-500/10", border: "border-green-500/20", icon: UserCheck, shadow: "shadow-[0_0_10px_rgba(34,197,94,0.3)]" },
    REJECTED: { color: "text-red-500", bg: "bg-red-500/10", border: "border-red-500/20", icon: UserX, shadow: "shadow-[0_0_10px_rgba(239,68,68,0.3)]" },
};

export default function ApplicationsPage() {
    const [applications, setApplications] = useState<Application[]>(initialApplications);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedHackathon, setSelectedHackathon] = useState("ALL MISSIONS");
    const [selectedStatus, setSelectedStatus] = useState("ALL STATUS");
    const [showCreateModal, setShowCreateModal] = useState(false);

    const [newApp, setNewApp] = useState({
        name: "",
        email: "",
        role: "",
        hackathon: "AI GLOBAL SUMMIT 2026",
        message: "",
    });

    const stats = useMemo(() => {
        const total = applications.length;
        const pending = applications.filter((a) => a.status === "PENDING").length;
        const approved = applications.filter((a) => a.status === "APPROVED").length;
        const rejected = applications.filter((a) => a.status === "REJECTED").length;
        return { total, pending, approved, rejected };
    }, [applications]);

    const filtered = useMemo(() => {
        return applications.filter((app) => {
            const matchesSearch = searchQuery === "" || 
                app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                app.email.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesHackathon = selectedHackathon === "ALL MISSIONS" || app.hackathon === selectedHackathon;
            const matchesStatus = selectedStatus === "ALL STATUS" || app.status === selectedStatus;
            return matchesSearch && matchesHackathon && matchesStatus;
        });
    }, [applications, searchQuery, selectedHackathon, selectedStatus]);

    const handleAccept = (id: number) => {
        setApplications(prev => prev.map(a => a.id === id ? { ...a, status: "APPROVED" } : a));
        toast.success("OPERATIVE CLEARED", { description: "APPLICATION APPROVED AND LOGGED." });
    };

    const handleReject = (id: number) => {
        setApplications(prev => prev.map(a => a.id === id ? { ...a, status: "REJECTED" } : a));
        toast.error("APPLICATION ABORTED", { description: "OPERATIVE ACCESS DENIED." });
    };

    const handleCreate = () => {
        const app: Application = {
            id: Date.now(),
            ...newApp,
            appliedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).toUpperCase(),
            status: "PENDING"
        };
        setApplications(prev => [app, ...prev]);
        setShowCreateModal(false);
        toast.success("INTAKE REGISTERED", { description: "NEW OPERATIVE DATA LOGGED." });
    };

    return (
        <OrganizerLayout>
            <div className="max-w-6xl mx-auto space-y-8 pb-12 relative">
                {/* Background Floating Objects */}
                <div className="absolute top-20 right-10 w-32 h-32 bg-primary/20 rounded-full blur-[80px] pointer-events-none"></div>
                <div className="absolute top-60 left-10 w-24 h-24 bg-amber-500/10 rounded-full blur-[60px] pointer-events-none"></div>

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div>
                        <div className="flex items-center relative mb-1">
                            <h1 className="text-5xl md:text-6xl font-black italic tracking-tighter uppercase text-white">
                                <span className="text-white">MISSION INTAKE</span>
                            </h1>
                            <div className="flex ml-4 gap-1 opacity-60 mt-2">
                                <div className="w-8 h-1 bg-primary"></div>
                                <div className="w-2 h-1 bg-primary"></div>
                                <div className="w-1 h-1 bg-primary"></div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 mt-4 mb-2">
                            <div className="w-2 h-2 bg-amber-400 rounded-sm shadow-[0_0_8px_rgba(251,191,36,0.5)]" />
                            <span className="text-[10px] text-white/60 uppercase tracking-[0.2em] font-bold">
                                VETTING OPERATIVE APPLICATIONS & ACCESS CLEARANCE
                            </span>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white border border-primary hover:bg-primary-dark hover:shadow-glow-sm transition-all rounded-sm text-[10px] font-bold tracking-widest uppercase mt-4"
                    >
                        <Plus className="w-4 h-4" />
                        <span>INITIALIZE INTAKE</span>
                    </button>
                </div>

                {/* Tactical Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: "TOTAL SIGNAL", value: stats.total, color: "text-white", bg: "bg-white/5", border: "border-white/10", icon: Activity },
                        { label: "PENDING REVIEW", value: stats.pending, color: "text-amber-400", bg: "bg-amber-400/5", border: "border-amber-400/20", icon: Clock },
                        { label: "CLEARED", value: stats.approved, color: "text-green-500", bg: "bg-green-500/5", border: "border-green-500/20", icon: UserCheck },
                        { label: "DENIED", value: stats.rejected, color: "text-red-500", bg: "bg-red-500/5", border: "border-red-500/20", icon: UserX },
                    ].map((stat) => (
                        <div key={stat.label} className={`${stat.bg} border ${stat.border} rounded-sm p-5 relative group overflow-hidden`}>
                            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/20"></div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-[8px] text-white/40 font-bold uppercase tracking-widest mb-1">{stat.label}</div>
                                    <div className={`text-3xl font-black italic tracking-tighter ${stat.color}`}>{stat.value}</div>
                                </div>
                                <stat.icon className={`w-8 h-8 ${stat.color} opacity-20 group-hover:opacity-40 transition-opacity`} />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-4 pt-4 border-t border-white/5">
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="SEARCH BY CALLSIGN, COMMS, OR SPECIALIZATION..."
                            className="w-full pl-12 pr-4 py-3 bg-[#080808] border border-white/10 text-[10px] font-bold uppercase tracking-widest text-white placeholder:text-white/30 focus:outline-none focus:border-primary/50 transition-all rounded-sm"
                        />
                    </div>
                    <div className="flex gap-4">
                        <div className="relative min-w-[200px]">
                            <Trophy className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                            <select
                                value={selectedHackathon}
                                onChange={(e) => setSelectedHackathon(e.target.value)}
                                className="w-full pl-12 pr-8 py-3 bg-[#080808] border border-white/10 text-[10px] font-bold uppercase tracking-widest text-white appearance-none cursor-pointer rounded-sm"
                            >
                                {hackathonOptions.map(h => <option key={h} value={h}>{h}</option>)}
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
                        </div>
                    </div>
                </div>

                {/* Applications Grid */}
                <div className="space-y-4">
                    {filtered.map((app) => {
                        const cfg = statusConfig[app.status];
                        const StatusIcon = cfg.icon;
                        return (
                            <div key={app.id} className="bg-[#080808] border border-white/5 rounded-sm hover:border-white/10 transition-all group relative">
                                <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-white/10 group-hover:border-primary/50 transition-colors"></div>
                                
                                <div className="flex flex-col md:flex-row items-center p-6 gap-6">
                                    {/* Identity */}
                                    <div className="flex items-center gap-6 flex-1 w-full">
                                        <div className="relative">
                                            <div className="w-16 h-16 bg-black border border-white/10 flex items-center justify-center shrink-0 group-hover:border-primary/20 transition-all rounded-sm overflow-hidden">
                                                <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${app.name}&backgroundColor=transparent`} alt="" className="w-full h-full object-cover opacity-60 group-hover:opacity-100" />
                                            </div>
                                            <div className={`absolute -bottom-1 -right-1 w-4 h-4 border-2 border-[#080808] rounded-sm transform rotate-45 ${cfg.shadow} ${app.status === 'APPROVED' ? 'bg-green-500' : app.status === 'REJECTED' ? 'bg-red-500' : 'bg-amber-400'}`}></div>
                                        </div>
                                        
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-3 mb-1 flex-wrap">
                                                <h3 className="text-lg font-black italic text-white tracking-tighter uppercase group-hover:text-primary transition-colors">{app.name}</h3>
                                                <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-sm border ${cfg.bg} ${cfg.border} ${cfg.color} text-[8px] font-black uppercase tracking-widest`}>
                                                    <StatusIcon className="w-3 h-3" />
                                                    {app.status}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4 flex-wrap">
                                                <div className="flex items-center gap-1.5 min-w-0">
                                                    <Mail className="w-3.5 h-3.5 text-primary/40" />
                                                    <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest truncate">{app.email}</span>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <Briefcase className="w-3.5 h-3.5 text-primary/40" />
                                                    <span className="text-[10px] text-white/60 font-bold uppercase tracking-widest">{app.role}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Mission Details */}
                                    <div className="flex flex-col md:w-64 border-l border-white/5 pl-6 gap-2 w-full">
                                        <div className="flex items-center gap-2">
                                            <Trophy className="w-3.5 h-3.5 text-primary" />
                                            <span className="text-[10px] text-white/80 font-black uppercase tracking-widest truncate">{app.hackathon}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-3.5 h-3.5 text-white/20" />
                                            <span className="text-[10px] text-white/30 font-bold uppercase tracking-widest">SUBMITTED: {app.appliedDate}</span>
                                        </div>
                                    </div>

                                    {/* Intelligence */}
                                    <div className="flex-1 max-w-sm hidden lg:block italic text-[10px] text-white/40 leading-relaxed border-l border-white/5 pl-6">
                                        "{app.message || 'NO INTEL PROVIDED.'}"
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-2 w-full md:w-auto">
                                        {app.status === 'PENDING' ? (
                                            <>
                                                <button onClick={() => handleAccept(app.id)} className="flex-1 md:w-10 md:h-10 bg-green-500/10 border border-green-500/20 text-green-500 hover:bg-green-500 hover:text-white transition-all rounded-sm flex items-center justify-center">
                                                    <Check className="w-5 h-5" />
                                                </button>
                                                <button onClick={() => handleReject(app.id)} className="flex-1 md:w-10 md:h-10 bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-all rounded-sm flex items-center justify-center">
                                                    <X className="w-5 h-5" />
                                                </button>
                                            </>
                                        ) : (
                                            <button className="flex-1 md:w-10 md:h-10 bg-white/5 border border-white/10 text-white/40 hover:bg-white/10 transition-all rounded-sm flex items-center justify-center">
                                                <ExternalLink className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </OrganizerLayout>
    );
}
