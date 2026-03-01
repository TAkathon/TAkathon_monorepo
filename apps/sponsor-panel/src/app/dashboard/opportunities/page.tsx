"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import {
    Search,
    MapPin,
    Calendar,
    DollarSign,
    ExternalLink,
    ChevronRight,
    Trophy,
    Loader2,
    Users,
    Mail,
    Building2,
    X,
} from "lucide-react";
import api from "@takathon/shared/api";
import { toast } from "sonner";

interface OrganizerSnippet {
    id: string;
    fullName: string;
    organization?: string;
    avatarUrl?: string;
}

interface HackathonItem {
    id: string;
    title: string;
    description?: string;
    status?: string;
    startDate?: string | null;
    endDate?: string | null;
    location?: string | null;
    isVirtual?: boolean;
    maxParticipants?: number | null;
    prizePool?: string | null;
    websiteUrl?: string | null;
    requiredSkills?: string[];
    organizer?: OrganizerSnippet;
    _count?: { participants?: number; teams?: number; sponsorships?: number };
}

export default function OpportunitiesPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [hackathons, setHackathons] = useState<HackathonItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [contactTarget, setContactTarget] = useState<HackathonItem | null>(null);

    useEffect(() => {
        fetchHackathons();
    }, []);

    const fetchHackathons = async () => {
        try {
            const response = await api.get("/api/v1/sponsors/hackathons");
            // API returns { hackathons: [...], pagination: {...} } nested inside data
            const data = response.data?.data;
            setHackathons(Array.isArray(data) ? data : (data?.hackathons ?? []));
        } catch (error) {
            console.error("Failed to fetch hackathons:", error);
            toast.error("Failed to load opportunities");
        } finally {
            setLoading(false);
        }
    };

    const filtered = hackathons.filter((h) =>
        (h.title ?? "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (h.organizer?.organization ?? "").toLowerCase().includes(searchTerm.toLowerCase())
    );

    const statusLabel = (s?: string) =>
        (s ?? "").replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

    const statusColor = (s?: string) => {
        if (s === "registration_open") return "bg-green-500/10 border-green-500/30 text-green-400";
        if (s === "in_progress") return "bg-blue-500/10 border-blue-500/30 text-blue-400";
        if (s === "completed") return "bg-white/5 border-white/10 text-white/40";
        return "bg-primary/10 border-primary/20 text-primary";
    };

    return (
        <DashboardLayout>
            {/* Contact organizer modal */}
            {contactTarget && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
                    onClick={() => setContactTarget(null)}
                >
                    <div
                        className="glass rounded-2xl border border-white/10 p-8 w-full max-w-md shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-start justify-between mb-6">
                            <h2 className="text-xl font-bold text-white">Contact Organizer</h2>
                            <button
                                onClick={() => setContactTarget(null)}
                                className="text-white/40 hover:text-white transition-colors"
                                aria-label="Close"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-4 mb-6">
                            <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                                <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Hackathon</p>
                                <p className="text-white font-semibold">{contactTarget.title}</p>
                            </div>

                            <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                                <p className="text-xs text-white/40 uppercase tracking-wider mb-3">Organizer</p>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                                        <span className="text-primary font-bold text-sm">
                                            {(contactTarget.organizer?.fullName ?? "?").slice(0, 2).toUpperCase()}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="text-white font-medium">{contactTarget.organizer?.fullName ?? "Unknown"}</p>
                                        {contactTarget.organizer?.organization && (
                                            <p className="text-white/50 text-sm flex items-center gap-1.5 mt-0.5">
                                                <Building2 className="w-3.5 h-3.5" />
                                                {contactTarget.organizer.organization}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            {contactTarget.websiteUrl && (
                                <a
                                    href={contactTarget.websiteUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full btn-primary flex items-center justify-center gap-2"
                                >
                                    <ExternalLink className="w-4 h-4" />
                                    Visit Event Website
                                </a>
                            )}
                            <button
                                onClick={() => {
                                    toast.success("Interest noted! The organizer will be notified.");
                                    setContactTarget(null);
                                }}
                                className="w-full flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all text-sm font-medium"
                            >
                                <Mail className="w-4 h-4" />
                                Express Interest
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {loading ? (
                <div className="flex items-center justify-center h-full min-h-[400px]">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                </div>
            ) : (
                <div className="space-y-8">
                    {/* Header */}
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">Discover Opportunities</h1>
                        <p className="text-white/60">Browse hackathons open for sponsorship and connect with organizers.</p>
                    </div>

                    {/* Search */}
                    <div className="relative max-w-xl">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                        <input
                            type="text"
                            placeholder="Search by event name or organization..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:border-primary/50 transition-all"
                        />
                    </div>

                    {/* Count */}
                    {hackathons.length > 0 && (
                        <p className="text-white/40 text-sm">
                            Showing <span className="text-white">{filtered.length}</span> of{" "}
                            <span className="text-white">{hackathons.length}</span> events
                        </p>
                    )}

                    {/* Empty state */}
                    {filtered.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-20 glass rounded-2xl border border-white/5">
                            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                                <Trophy className="w-10 h-10 text-primary/60" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">
                                {searchTerm ? "No matches found" : "No opportunities yet"}
                            </h3>
                            <p className="text-white/40 text-center max-w-sm mb-6">
                                {searchTerm
                                    ? "Try a different keyword."
                                    : "Hackathons open for sponsorship will appear here. Check back soon!"}
                            </p>
                            {searchTerm && (
                                <button
                                    onClick={() => setSearchTerm("")}
                                    className="px-5 py-2.5 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 transition-all text-sm font-medium"
                                >
                                    Clear Search
                                </button>
                            )}
                        </div>
                    )}

                    {/* Hackathon cards */}
                    <div className="grid grid-cols-1 gap-5">
                        {filtered.map((opp) => (
                            <div
                                key={opp.id}
                                className="glass p-6 rounded-2xl border border-white/5 hover:border-primary/20 transition-all duration-300 group"
                            >
                                <div className="flex flex-col lg:flex-row gap-6">
                                    {/* Info */}
                                    <div className="flex-1 space-y-4">
                                        {/* Title + organizer + badge */}
                                        <div className="flex flex-wrap items-start gap-3">
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors truncate">
                                                    {opp.title}
                                                </h3>
                                                {opp.organizer && (
                                                    <p className="text-white/40 text-sm flex items-center gap-1.5 mt-0.5">
                                                        <Building2 className="w-3.5 h-3.5 shrink-0" />
                                                        {opp.organizer.organization
                                                            ? `${opp.organizer.fullName} · ${opp.organizer.organization}`
                                                            : opp.organizer.fullName}
                                                    </p>
                                                )}
                                            </div>
                                            <span className={`px-3 py-1 rounded-full border text-xs font-medium uppercase tracking-wide shrink-0 ${statusColor(opp.status)}`}>
                                                {statusLabel(opp.status)}
                                            </span>
                                        </div>

                                        {/* Description */}
                                        {opp.description && (
                                            <p className="text-white/60 text-sm leading-relaxed line-clamp-2">
                                                {opp.description}
                                            </p>
                                        )}

                                        {/* Meta */}
                                        <div className="flex flex-wrap gap-4 text-sm text-white/40">
                                            <div className="flex items-center gap-1.5">
                                                <Calendar className="w-4 h-4 shrink-0" />
                                                {opp.startDate
                                                    ? new Date(opp.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                                                    : "Date TBD"}
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <MapPin className="w-4 h-4 shrink-0" />
                                                {opp.isVirtual ? "Virtual" : opp.location || "Location TBD"}
                                            </div>
                                            {opp.prizePool && (
                                                <div className="flex items-center gap-1.5 text-primary">
                                                    <DollarSign className="w-4 h-4 shrink-0" />
                                                    {opp.prizePool} Prize Pool
                                                </div>
                                            )}
                                            {(opp._count?.participants ?? 0) > 0 && (
                                                <div className="flex items-center gap-1.5">
                                                    <Users className="w-4 h-4 shrink-0" />
                                                    {opp._count!.participants} participants
                                                </div>
                                            )}
                                        </div>

                                        {/* Skills */}
                                        {(opp.requiredSkills ?? []).length > 0 && (
                                            <div className="flex flex-wrap gap-2">
                                                {(opp.requiredSkills ?? []).map((tag) => (
                                                    <span
                                                        key={tag}
                                                        className="px-2 py-1 rounded bg-white/5 border border-white/5 text-[10px] text-white/40 uppercase tracking-wider"
                                                    >
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <div className="flex flex-row lg:flex-col justify-end gap-3 lg:min-w-[160px]">
                                        <button
                                            onClick={() => setContactTarget(opp)}
                                            className="flex-1 lg:flex-none btn-primary flex items-center justify-center gap-2 py-2.5 text-sm"
                                        >
                                            Contact Organizer
                                            <ChevronRight className="w-4 h-4" />
                                        </button>
                                        {opp.websiteUrl && (
                                            <a
                                                href={opp.websiteUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-white/10 hover:border-white/20 text-white/60 hover:text-white transition-all text-sm"
                                            >
                                                Website
                                                <ExternalLink className="w-3.5 h-3.5" />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}
