"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { 
    Search, 
    Filter, 
    User, 
    Mail, 
    Download,
    CheckCircle2,
    XCircle,
    Clock,
    ChevronDown,
    ExternalLink,
    Loader2,
    Users
} from "lucide-react";
import api from "@takathon/shared/api";
import { toast } from "sonner";

export default function ParticipantsPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("");
    const [hackathons, setHackathons] = useState<any[]>([]);
    const [selectedHackathonId, setSelectedHackathonId] = useState<string>("");
    const [participants, setParticipants] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [participantsLoading, setParticipantsLoading] = useState(false);

    useEffect(() => {
        fetchHackathons();
    }, []);

    useEffect(() => {
        if (selectedHackathonId) {
            fetchParticipants(selectedHackathonId);
        }
    }, [selectedHackathonId, selectedStatus]);

    const fetchHackathons = async () => {
        try {
            const res = await api.get("/api/v1/organizers/hackathons");
            const data = res.data.data || [];
            setHackathons(data);
            if (data.length > 0) {
                setSelectedHackathonId(data[0].id);
            }
        } catch (error) {
            toast.error("Failed to load hackathons");
        } finally {
            setLoading(false);
        }
    };

    const fetchParticipants = async (hackathonId: string) => {
        setParticipantsLoading(true);
        try {
            const params = new URLSearchParams();
            if (selectedStatus) params.append("status", selectedStatus);
            const res = await api.get(`/api/v1/organizers/hackathons/${hackathonId}/participants?${params}`);
            setParticipants(res.data.data || res.data.participants || []);
        } catch (error) {
            toast.error("Failed to load participants");
            setParticipants([]);
        } finally {
            setParticipantsLoading(false);
        }
    };

    const handleExport = async () => {
        if (!selectedHackathonId) return;
        try {
            const res = await api.get(`/api/v1/organizers/hackathons/${selectedHackathonId}/export`);
            const data = res.data.data;
            if (data?.csv) {
                const blob = new Blob([data.csv], { type: "text/csv" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `hackathon-${selectedHackathonId}-export.csv`;
                a.click();
                URL.revokeObjectURL(url);
                toast.success("Export downloaded!");
            } else {
                toast.success("Export ready");
            }
        } catch (error) {
            toast.error("Failed to export data");
        }
    };

    const filteredParticipants = participants.filter((p: any) => {
        const name = p.user?.fullName || p.fullName || "";
        const email = p.user?.email || p.email || "";
        return name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            email.toLowerCase().includes(searchQuery.toLowerCase());
    });

    return (
        <DashboardLayout>
            {loading ? (
                <div className="flex items-center justify-center min-h-[400px]">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                </div>
            ) : (
            <div className="space-y-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Participants</h1>
                        <p className="text-white/60 mt-1">Review applications and manage participants</p>
                    </div>
                    <button
                        onClick={handleExport}
                        disabled={!selectedHackathonId}
                        className="btn-secondary flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        <Download className="w-5 h-5" />
                        <span>Export CSV</span>
                    </button>
                </div>

                {/* Hackathon Selector + Filters */}
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative min-w-[240px]">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                        <select
                            value={selectedHackathonId}
                            onChange={(e) => setSelectedHackathonId(e.target.value)}
                            className="w-full pl-11 pr-8 py-3 bg-white/5 border border-white/10 rounded-lg text-white appearance-none cursor-pointer focus:outline-none focus:border-primary/50 transition-all"
                        >
                            {hackathons.length === 0 ? (
                                <option value="">No hackathons</option>
                            ) : (
                                hackathons.map((h) => (
                                    <option key={h.id} value={h.id}>{h.title}</option>
                                ))
                            )}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
                    </div>
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search by name or email..."
                            className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:border-primary/50 transition-all"
                        />
                    </div>
                    <div className="relative min-w-[160px]">
                        <select
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            className="w-full pl-4 pr-8 py-3 bg-white/5 border border-white/10 rounded-lg text-white appearance-none cursor-pointer focus:outline-none focus:border-primary/50 transition-all"
                        >
                            <option value="">All Status</option>
                            <option value="registered">Registered</option>
                            <option value="in_team">In Team</option>
                            <option value="withdrawn">Withdrawn</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
                    </div>
                </div>

                {/* Table */}
                {participantsLoading ? (
                    <div className="flex items-center justify-center min-h-[200px]">
                        <Loader2 className="w-6 h-6 text-primary animate-spin" />
                    </div>
                ) : (
                    <div className="glass rounded-xl overflow-hidden border border-white/10">
                        {filteredParticipants.length === 0 ? (
                            <div className="p-12 text-center">
                                <Users className="w-12 h-12 text-white/20 mx-auto mb-4" />
                                <p className="text-white/60">No participants found for this hackathon.</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-white/10 bg-white/5">
                                            <th className="px-6 py-4 text-sm font-semibold text-white/60 uppercase tracking-wider">Participant</th>
                                            <th className="px-6 py-4 text-sm font-semibold text-white/60 uppercase tracking-wider">Email</th>
                                            <th className="px-6 py-4 text-sm font-semibold text-white/60 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-4 text-sm font-semibold text-white/60 uppercase tracking-wider">Registered</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {filteredParticipants.map((p: any) => {
                                            const name = p.user?.fullName || p.fullName || "Unknown";
                                            const email = p.user?.email || p.email || "";
                                            const status = p.status || "registered";
                                            const registeredAt = p.registeredAt ? new Date(p.registeredAt).toLocaleDateString() : "N/A";
                                            return (
                                                <tr key={p.id} className="hover:bg-white/[0.02] transition-colors group">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                                                {name.charAt(0)}
                                                            </div>
                                                            <div className="text-white font-medium flex items-center gap-1">
                                                                {name}
                                                                <ExternalLink className="w-3 h-3 text-white/20 group-hover:text-primary transition-colors cursor-pointer" />
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="text-white/60 text-sm flex items-center gap-1">
                                                            <Mail className="w-3 h-3" />
                                                            {email}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                                                            status === "in_team" ? "bg-green-500/10 text-green-400 border-green-500/20" :
                                                            status === "withdrawn" ? "bg-red-500/10 text-red-400 border-red-500/20" :
                                                            "bg-blue-500/10 text-blue-400 border-blue-500/20"
                                                        }`}>
                                                            {status === "in_team" ? <CheckCircle2 className="w-3.5 h-3.5" /> :
                                                             status === "withdrawn" ? <XCircle className="w-3.5 h-3.5" /> :
                                                             <Clock className="w-3.5 h-3.5" />}
                                                            {status.replace(/_/g, " ")}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-white/40 text-sm">{registeredAt}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                        <div className="px-6 py-4 border-t border-white/10 bg-white/5 flex items-center justify-between text-sm">
                            <div className="text-white/40">
                                Showing {filteredParticipants.length} of {participants.length} participants
                            </div>
                        </div>
                    </div>
                )}
            </div>
            )}
        </DashboardLayout>
    );
}
