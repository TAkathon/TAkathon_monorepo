"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { 
    CheckCircle2, 
    XCircle, 
    Clock, 
    Building2,
    Calendar,
    Loader2,
    Target,
    DollarSign
} from "lucide-react";
import api from "@takathon/shared/api";
import { toast } from "sonner";
import Link from "next/link";

const getStatusStyles = (status: string) => {
    const s = status.toLowerCase();
    if (s === "active") return "bg-green-500/10 text-green-500 border-green-500/20";
    if (s === "cancelled" || s === "rejected") return "bg-red-500/10 text-red-500 border-red-500/20";
    return "bg-amber-500/10 text-amber-500 border-amber-500/20";
};

const getStatusIcon = (status: string) => {
    const s = status.toLowerCase();
    if (s === "active") return <CheckCircle2 className="w-4 h-4" />;
    if (s === "cancelled" || s === "rejected") return <XCircle className="w-4 h-4" />;
    return <Clock className="w-4 h-4" />;
};

export default function SponsorRequests() {
    const [sponsorships, setSponsorships] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSponsorships();
    }, []);

    const fetchSponsorships = async () => {
        try {
            const res = await api.get("/api/v1/sponsors/hackathons/sponsorships");
            const data = res.data.data?.sponsorships || res.data.data || [];
            setSponsorships(Array.isArray(data) ? data : []);
        } catch {
            toast.error("Failed to load sponsorships");
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async (id: string) => {
        if (!confirm("Cancel this sponsorship?")) return;
        try {
            await api.post(`/api/v1/sponsors/hackathons/sponsorships/${id}/cancel`);
            toast.success("Sponsorship cancelled");
            fetchSponsorships();
        } catch {
            toast.error("Failed to cancel sponsorship");
        }
    };

    if (loading) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center h-full min-h-[400px]">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="space-y-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-white">My Sponsorships</h1>
                        <p className="text-white/60 mt-1">Track all your hackathon sponsorships</p>
                    </div>
                    <Link href="/dashboard/opportunities" className="btn-primary text-center">
                        + New Sponsorship
                    </Link>
                </div>

                {/* Sponsorships List */}
                {sponsorships.length === 0 ? (
                    <div className="glass rounded-2xl p-12 text-center border border-white/10">
                        <Target className="w-12 h-12 text-white/20 mx-auto mb-4" />
                        <h3 className="text-white font-semibold mb-2">No sponsorships yet</h3>
                        <p className="text-white/40 text-sm mb-6">Browse opportunities to start sponsoring hackathons</p>
                        <Link href="/dashboard/opportunities" className="btn-primary inline-block">
                            Browse Events
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {sponsorships.map((s: any) => {
                            const title = s.hackathon?.title || "Hackathon";
                            const organizer = s.hackathon?.organizer?.user?.fullName || "Organizer";
                            const startDate = s.hackathon?.startDate ? new Date(s.hackathon.startDate).toLocaleDateString() : "TBD";
                            const tier = s.tier || s.tierName || "";
                            const amount = s.amount ? `$${Number(s.amount).toLocaleString()}` : "";
                            const status = (s.status || "pending").toLowerCase();
                            return (
                                <div key={s.id} className="glass rounded-2xl p-6 border border-white/10 hover:border-primary/20 transition-all">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3 flex-wrap">
                                                <h3 className="text-white font-semibold text-lg">{title}</h3>
                                                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusStyles(status)}`}>
                                                    {getStatusIcon(status)}
                                                    {status}
                                                </span>
                                            </div>
                                            <div className="flex flex-wrap gap-4 text-sm text-white/40">
                                                <span className="flex items-center gap-1">
                                                    <Building2 className="w-4 h-4" />
                                                    {organizer}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="w-4 h-4" />
                                                    {startDate}
                                                </span>
                                                {tier && (
                                                    <span className="flex items-center gap-1 text-primary/80">
                                                        Tier: {tier}
                                                    </span>
                                                )}
                                                {amount && (
                                                    <span className="flex items-center gap-1">
                                                        <DollarSign className="w-4 h-4" />
                                                        {amount}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            {(status === "pending" || status === "active") && (
                                                <button
                                                    onClick={() => handleCancel(s.id)}
                                                    className="px-4 py-2 rounded-lg text-sm text-red-400 border border-red-400/20 hover:bg-red-500/10 transition-colors"
                                                >
                                                    Cancel
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
