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
    {
        id: 6,
        name: "PRIYA SHARMA",
        email: "P.SHARMA@EXAMPLE.COM",
        role: "ML ENGINEER",
        hackathon: "ECO-TECH CHALLENGE",
        appliedDate: "FEB 22, 2026",
        status: "PENDING",
        message: "Want to apply ML to climate change solutions.",
    },
    {
        id: 7,
        name: "LUCAS MARTIN",
        email: "L.MARTIN@EXAMPLE.COM",
        role: "DEVOPS ENGINEER",
        hackathon: "ECO-TECH CHALLENGE",
        appliedDate: "FEB 20, 2026",
        status: "APPROVED",
        message: "Experienced in CI/CD and Kubernetes orchestration.",
    },
    {
        id: 8,
        name: "YUKI TANAKA",
        email: "Y.TANAKA@EXAMPLE.COM",
        role: "SMART CONTRACT DEV",
        hackathon: "WEB3 INNOVATION HACK",
        appliedDate: "FEB 19, 2026",
        status: "PENDING",
        message: "Solidity expert with DeFi protocol experience.",
    },
];

const hackathonOptions = [
    "ALL HACKATHONS",
    "AI GLOBAL SUMMIT 2026",
    "WEB3 INNOVATION HACK",
    "ECO-TECH CHALLENGE",
];

// ── Helpers ──
const statusConfig: Record<ApplicationStatus, { color: string; bg: string; border: string; icon: typeof Clock }> = {
    PENDING: { color: "text-amber-400", bg: "bg-amber-400/10", border: "border-amber-400/30", icon: Clock },
    APPROVED: { color: "text-green-500", bg: "bg-green-500/10", border: "border-green-500/30", icon: UserCheck },
    REJECTED: { color: "text-red-500", bg: "bg-red-500/10", border: "border-red-500/30", icon: UserX },
};

export default function ApplicationsPage() {
    const [applications, setApplications] = useState<Application[]>(initialApplications);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedHackathon, setSelectedHackathon] = useState("ALL HACKATHONS");
    const [selectedStatus, setSelectedStatus] = useState("ALL STATUS");
    const [showCreateModal, setShowCreateModal] = useState(false);

    // Create form state
    const [newApp, setNewApp] = useState({
        name: "",
        email: "",
        role: "",
        hackathon: "AI GLOBAL SUMMIT 2026",
        message: "",
    });

    // ── Stats ──
    const stats = useMemo(() => {
        const total = applications.length;
        const pending = applications.filter((a) => a.status === "PENDING").length;
        const approved = applications.filter((a) => a.status === "APPROVED").length;
        const rejected = applications.filter((a) => a.status === "REJECTED").length;
        return { total, pending, approved, rejected };
    }, [applications]);

    // ── Filtered ──
    const filtered = useMemo(() => {
        return applications.filter((app) => {
            const matchesSearch =
                searchQuery === "" ||
                app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                app.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                app.role.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesHackathon =
                selectedHackathon === "ALL HACKATHONS" || app.hackathon === selectedHackathon;
            const matchesStatus =
                selectedStatus === "ALL STATUS" || app.status === selectedStatus;
            return matchesSearch && matchesHackathon && matchesStatus;
        });
    }, [applications, searchQuery, selectedHackathon, selectedStatus]);

    // ── Actions ──
    const handleAccept = (id: number) => {
        setApplications((prev) =>
            prev.map((a) => (a.id === id ? { ...a, status: "APPROVED" as ApplicationStatus } : a))
        );
        const app = applications.find((a) => a.id === id);
        toast.success("APPLICATION APPROVED", {
            description: `${app?.name} has been accepted into ${app?.hackathon}.`,
        });
    };

    const handleReject = (id: number) => {
        setApplications((prev) =>
            prev.map((a) => (a.id === id ? { ...a, status: "REJECTED" as ApplicationStatus } : a))
        );
        const app = applications.find((a) => a.id === id);
        toast.error("APPLICATION REJECTED", {
            description: `${app?.name}'s application has been declined.`,
        });
    };

    const handleCreate = () => {
        if (!newApp.name || !newApp.email || !newApp.role) {
            toast.warning("MISSING FIELDS", { description: "Please fill in all required fields." });
            return;
        }
        const newApplication: Application = {
            id: Date.now(),
            name: newApp.name.toUpperCase(),
            email: newApp.email.toUpperCase(),
            role: newApp.role.toUpperCase(),
            hackathon: newApp.hackathon,
            appliedDate: new Date().toLocaleDateString("en-US", {
                month: "short",
                day: "2-digit",
                year: "numeric",
            }).toUpperCase(),
            status: "PENDING",
            message: newApp.message,
        };
        setApplications((prev) => [newApplication, ...prev]);
        setNewApp({ name: "", email: "", role: "", hackathon: "AI GLOBAL SUMMIT 2026", message: "" });
        setShowCreateModal(false);
        toast.success("APPLICATION CREATED", {
            description: `New application for ${newApplication.name} has been submitted.`,
        });
    };

    return (
        <OrganizerLayout>
            <div className="max-w-6xl mx-auto space-y-8 pb-12">
                {/* Background Floating Objects */}
                <div className="absolute top-20 right-10 w-32 h-32 bg-primary/20 rounded-full blur-[80px] pointer-events-none"></div>
                <div className="absolute top-60 left-10 w-24 h-24 bg-amber-500/10 rounded-full blur-[60px] pointer-events-none"></div>

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div>
                        <div className="flex items-center relative mb-1">
                            <h1 className="text-5xl md:text-6xl font-black italic tracking-tighter uppercase text-white">
                                <span className="text-white">APPLICATIONS</span>
                            </h1>
                            <div className="flex ml-4 gap-1 opacity-60 mt-2">
                                <div className="w-8 h-1 bg-primary"></div>
                                <div className="w-2 h-1 bg-primary"></div>
                                <div className="w-1 h-1 bg-primary"></div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 mt-4 mb-2">
                            <div className="w-2 h-2 bg-amber-400 rounded-sm" />
                            <span className="text-[10px] text-white/60 uppercase tracking-[0.2em] font-bold">
                                REVIEW, APPROVE, AND MANAGE OPERATIVE APPLICATIONS
                            </span>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white border border-primary hover:bg-primary-dark hover:shadow-[0_0_15px_rgba(255,92,0,0.4)] transition-all active:scale-[0.98] rounded-sm drop-shadow-md text-[10px] font-bold tracking-widest uppercase mt-4"
                    >
                        <Plus className="w-4 h-4" />
                        <span>CREATE APPLICATION</span>
                    </button>
                </div>

                {/* Stats Bar */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: "TOTAL", value: stats.total, color: "text-white", bg: "bg-white/5", border: "border-white/10", icon: FileText },
                        { label: "PENDING", value: stats.pending, color: "text-amber-400", bg: "bg-amber-400/5", border: "border-amber-400/20", icon: Clock },
                        { label: "APPROVED", value: stats.approved, color: "text-green-500", bg: "bg-green-500/5", border: "border-green-500/20", icon: UserCheck },
                        { label: "REJECTED", value: stats.rejected, color: "text-red-500", bg: "bg-red-500/5", border: "border-red-500/20", icon: UserX },
                    ].map((stat) => (
                        <div
                            key={stat.label}
                            className={`${stat.bg} border ${stat.border} rounded-sm p-4 relative overflow-hidden group hover:border-opacity-60 transition-all`}
                        >
                            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/20"></div>
                            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/10"></div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-[9px] text-white/40 font-bold uppercase tracking-widest mb-1">{stat.label}</div>
                                    <div className={`text-3xl font-black italic tracking-tighter ${stat.color}`}>
                                        {stat.value}
                                    </div>
                                </div>
                                <stat.icon className={`w-8 h-8 ${stat.color} opacity-20`} />
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
                            placeholder="SEARCH BY CALLSIGN, EMAIL, OR SPECIALIZATION..."
                            className="w-full pl-12 pr-4 py-3 bg-[#080808] border border-white/10 text-[10px] font-bold uppercase tracking-widest text-white placeholder:text-white/30 focus:outline-none focus:border-primary/50 transition-all rounded-sm"
                        />
                    </div>
                    <div className="flex gap-4">
                        <div className="relative min-w-[220px]">
                            <Trophy className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                            <select
                                value={selectedHackathon}
                                onChange={(e) => setSelectedHackathon(e.target.value)}
                                className="w-full pl-12 pr-8 py-3 bg-[#080808] border border-white/10 text-[10px] font-bold uppercase tracking-widest text-white focus:outline-none focus:border-primary/50 transition-all appearance-none cursor-pointer rounded-sm"
                            >
                                {hackathonOptions.map((h) => (
                                    <option key={h} value={h}>{h}</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
                        </div>
                        <div className="relative min-w-[200px]">
                            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                            <select
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                                className="w-full pl-12 pr-8 py-3 bg-[#080808] border border-white/10 text-[10px] font-bold uppercase tracking-widest text-white focus:outline-none focus:border-primary/50 transition-all appearance-none cursor-pointer rounded-sm"
                            >
                                <option>ALL STATUS</option>
                                <option>PENDING</option>
                                <option>APPROVED</option>
                                <option>REJECTED</option>
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
                        </div>
                    </div>
                </div>

                {/* Application Cards */}
                <div className="space-y-4">
                    {filtered.map((app) => {
                        const cfg = statusConfig[app.status];
                        const StatusIcon = cfg.icon;
                        return (
                            <div
                                key={app.id}
                                className="relative bg-[#080808] border border-white/5 rounded-sm hover:border-white/10 transition-all duration-300 group"
                            >
                                {/* Corner decorations */}
                                <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/20 z-10"></div>
                                <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r group-hover:border-primary/50 transition-colors z-10"></div>

                                <div className="flex flex-col md:flex-row">
                                    {/* Left: Avatar + Info */}
                                    <div className="flex-1 p-6">
                                        <div className="flex items-start gap-4">
                                            {/* Avatar */}
                                            <div className="relative flex-shrink-0">
                                                <div className="w-12 h-12 rounded-full bg-black border-2 border-white/10 flex items-center justify-center overflow-hidden group-hover:border-primary/30 transition-all">
                                                    <img
                                                        src={`https://api.dicebear.com/7.x/notionists/svg?seed=${app.name}&backgroundColor=transparent`}
                                                        alt={app.name}
                                                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                                                    />
                                                </div>
                                                <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-sm transform rotate-45 border-2 border-[#080808] ${app.status === "APPROVED" ? "bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" : app.status === "REJECTED" ? "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]" : "bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.5)]"}`} />
                                            </div>

                                            {/* Details */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <h3 className="text-sm font-black italic tracking-tighter uppercase text-white group-hover:text-primary-light transition-colors">
                                                        {app.name}
                                                    </h3>
                                                    <div className={`flex items-center gap-1 px-2 py-0.5 ${cfg.bg} border ${cfg.border} rounded-sm`}>
                                                        <StatusIcon className={`w-3 h-3 ${cfg.color}`} />
                                                        <span className={`text-[9px] font-bold uppercase tracking-widest ${cfg.color}`}>
                                                            {app.status}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-4 mt-2 flex-wrap">
                                                    <div className="flex items-center gap-1.5">
                                                        <Mail className="w-3 h-3 text-primary/60" />
                                                        <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest">{app.email}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5">
                                                        <Briefcase className="w-3 h-3 text-primary/60" />
                                                        <span className="text-[10px] text-white/60 font-bold uppercase tracking-widest">{app.role}</span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-4 mt-2 flex-wrap">
                                                    <div className="flex items-center gap-1.5">
                                                        <Trophy className="w-3 h-3 text-primary/60" />
                                                        <span className="text-[10px] text-primary/80 font-bold uppercase tracking-widest">{app.hackathon}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5">
                                                        <Calendar className="w-3 h-3 text-white/20" />
                                                        <span className="text-[10px] text-white/30 font-bold uppercase tracking-widest">APPLIED {app.appliedDate}</span>
                                                    </div>
                                                </div>

                                                {app.message && (
                                                    <div className="mt-3 px-3 py-2 bg-white/[0.02] border-l-2 border-primary/30 rounded-r-sm">
                                                        <span className="text-[10px] text-white/50 font-medium italic leading-relaxed">
                                                            &quot;{app.message}&quot;
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right: Actions */}
                                    <div className="flex md:flex-col items-center justify-end gap-2 p-4 md:p-6 md:pl-0 border-t md:border-t-0 md:border-l border-white/5 md:min-w-[180px]">
                                        {app.status === "PENDING" ? (
                                            <>
                                                <button
                                                    onClick={() => handleAccept(app.id)}
                                                    className="flex items-center justify-center gap-2 px-4 py-2.5 bg-green-500/10 text-green-500 border border-green-500/20 hover:border-green-500 hover:bg-green-500 hover:text-white hover:shadow-[0_0_15px_rgba(34,197,94,0.4)] text-[10px] uppercase tracking-widest font-bold transition-all rounded-sm flex-1 md:w-full active:scale-[0.98]"
                                                >
                                                    <Check className="w-4 h-4" />
                                                    ACCEPT
                                                </button>
                                                <button
                                                    onClick={() => handleReject(app.id)}
                                                    className="flex items-center justify-center gap-2 px-4 py-2.5 bg-red-500/10 text-red-500 border border-red-500/20 hover:border-red-500 hover:bg-red-500 hover:text-white hover:shadow-[0_0_15px_rgba(239,68,68,0.4)] text-[10px] uppercase tracking-widest font-bold transition-all rounded-sm flex-1 md:w-full active:scale-[0.98]"
                                                >
                                                    <X className="w-4 h-4" />
                                                    REFUSE
                                                </button>
                                            </>
                                        ) : (
                                            <div className={`flex items-center gap-2 px-4 py-2.5 ${cfg.bg} border ${cfg.border} rounded-sm md:w-full justify-center`}>
                                                <StatusIcon className={`w-4 h-4 ${cfg.color}`} />
                                                <span className={`text-[10px] font-bold uppercase tracking-widest ${cfg.color}`}>
                                                    {app.status}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    {/* Empty State */}
                    {filtered.length === 0 && (
                        <div className="bg-[#080808] rounded-sm border border-white/5 p-12 text-center">
                            <FileText className="w-12 h-12 text-white/10 mx-auto mb-4" />
                            <div className="text-sm font-bold text-white/30 uppercase tracking-widest">
                                NO APPLICATIONS FOUND
                            </div>
                            <div className="text-[10px] text-white/20 uppercase tracking-widest mt-1">
                                TRY ADJUSTING YOUR FILTERS
                            </div>
                        </div>
                    )}
                </div>

                {/* Summary Footer */}
                <div className="px-6 py-4 bg-[#080808] border border-white/5 rounded-sm flex items-center justify-between">
                    <div className="text-[10px] text-white/40 uppercase tracking-widest font-bold">
                        SHOWING {filtered.length} OF {applications.length} APPLICATIONS
                    </div>
                    <div className="flex items-center gap-4 text-[10px] text-white/30 uppercase tracking-widest font-bold">
                        <span className="text-amber-400">{stats.pending} PENDING</span>
                        <span className="text-white/10">|</span>
                        <span className="text-green-500">{stats.approved} APPROVED</span>
                        <span className="text-white/10">|</span>
                        <span className="text-red-500">{stats.rejected} REJECTED</span>
                    </div>
                </div>
            </div>

            {/* Create Application Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center">
                    <div
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        onClick={() => setShowCreateModal(false)}
                    />
                    <div className="relative w-full max-w-lg mx-4 bg-[#0a0a0a] border border-white/10 rounded-sm shadow-2xl shadow-primary/10 animate-in fade-in zoom-in-95 duration-200">
                        {/* Corner decorations */}
                        <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-primary/50"></div>
                        <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-primary/50"></div>
                        <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-primary/50"></div>
                        <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-primary/50"></div>

                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
                            <div>
                                <h2 className="text-lg font-black italic tracking-tighter uppercase text-white">
                                    CREATE APPLICATION
                                </h2>
                                <div className="text-[9px] text-white/40 font-bold uppercase tracking-widest mt-0.5">
                                    INITIALIZE NEW OPERATIVE INTAKE
                                </div>
                            </div>
                            <button
                                onClick={() => setShowCreateModal(false)}
                                className="p-2 text-white/30 hover:text-white hover:bg-white/5 transition-all rounded-sm border border-transparent hover:border-white/10"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Form */}
                        <div className="p-6 space-y-4">
                            {/* Hackathon */}
                            <div>
                                <label className="text-[9px] text-white/50 font-bold uppercase tracking-widest block mb-2">
                                    TARGET OPERATION *
                                </label>
                                <div className="relative">
                                    <Trophy className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                                    <select
                                        value={newApp.hackathon}
                                        onChange={(e) => setNewApp({ ...newApp, hackathon: e.target.value })}
                                        className="w-full pl-12 pr-8 py-3 bg-[#080808] border border-white/10 text-[10px] font-bold uppercase tracking-widest text-white focus:outline-none focus:border-primary/50 transition-all appearance-none cursor-pointer rounded-sm"
                                    >
                                        {hackathonOptions.filter((h) => h !== "ALL HACKATHONS").map((h) => (
                                            <option key={h} value={h}>{h}</option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
                                </div>
                            </div>

                            {/* Name */}
                            <div>
                                <label className="text-[9px] text-white/50 font-bold uppercase tracking-widest block mb-2">
                                    OPERATIVE CALLSIGN *
                                </label>
                                <div className="relative">
                                    <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                                    <input
                                        type="text"
                                        value={newApp.name}
                                        onChange={(e) => setNewApp({ ...newApp, name: e.target.value })}
                                        placeholder="ENTER FULL NAME..."
                                        className="w-full pl-12 pr-4 py-3 bg-[#080808] border border-white/10 text-[10px] font-bold uppercase tracking-widest text-white placeholder:text-white/30 focus:outline-none focus:border-primary/50 transition-all rounded-sm"
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div>
                                <label className="text-[9px] text-white/50 font-bold uppercase tracking-widest block mb-2">
                                    COMMS CHANNEL *
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                                    <input
                                        type="email"
                                        value={newApp.email}
                                        onChange={(e) => setNewApp({ ...newApp, email: e.target.value })}
                                        placeholder="ENTER EMAIL ADDRESS..."
                                        className="w-full pl-12 pr-4 py-3 bg-[#080808] border border-white/10 text-[10px] font-bold uppercase tracking-widest text-white placeholder:text-white/30 focus:outline-none focus:border-primary/50 transition-all rounded-sm"
                                    />
                                </div>
                            </div>

                            {/* Role */}
                            <div>
                                <label className="text-[9px] text-white/50 font-bold uppercase tracking-widest block mb-2">
                                    SPECIALIZATION *
                                </label>
                                <div className="relative">
                                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                                    <input
                                        type="text"
                                        value={newApp.role}
                                        onChange={(e) => setNewApp({ ...newApp, role: e.target.value })}
                                        placeholder="E.G. FRONTEND DEVELOPER..."
                                        className="w-full pl-12 pr-4 py-3 bg-[#080808] border border-white/10 text-[10px] font-bold uppercase tracking-widest text-white placeholder:text-white/30 focus:outline-none focus:border-primary/50 transition-all rounded-sm"
                                    />
                                </div>
                            </div>

                            {/* Message */}
                            <div>
                                <label className="text-[9px] text-white/50 font-bold uppercase tracking-widest block mb-2">
                                    MISSION STATEMENT
                                </label>
                                <textarea
                                    value={newApp.message}
                                    onChange={(e) => setNewApp({ ...newApp, message: e.target.value })}
                                    placeholder="WHY DO THEY WANT TO JOIN THIS OPERATION..."
                                    rows={3}
                                    className="w-full px-4 py-3 bg-[#080808] border border-white/10 text-[10px] font-bold uppercase tracking-widest text-white placeholder:text-white/30 focus:outline-none focus:border-primary/50 transition-all rounded-sm resize-none"
                                />
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-white/5">
                            <button
                                onClick={() => setShowCreateModal(false)}
                                className="flex items-center justify-center gap-2 px-5 py-2.5 bg-transparent text-white/50 border border-white/10 hover:border-white/30 hover:text-white text-[10px] uppercase tracking-widest font-bold transition-all rounded-sm active:scale-[0.98]"
                            >
                                CANCEL
                            </button>
                            <button
                                onClick={handleCreate}
                                className="flex items-center justify-center gap-2 px-6 py-2.5 bg-primary text-white border border-primary hover:bg-primary-dark hover:shadow-[0_0_15px_rgba(255,92,0,0.4)] text-[10px] uppercase tracking-widest font-bold transition-all rounded-sm active:scale-[0.98]"
                            >
                                <Plus className="w-4 h-4" />
                                SUBMIT APPLICATION
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </OrganizerLayout>
    );
}
