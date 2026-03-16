"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import {
    CheckCircle2,
    XCircle,
    Clock,
    MessageSquare,
    Eye,
    Building2,
    Calendar,
    Loader2,
    Target,
    DollarSign,
    ChevronRight,
    X
} from "lucide-react";
import api from "@takathon/shared/api";
import { toast } from "sonner";
import Link from "next/link";

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
            toast.error("FAILED TO SYNCHRONIZE REQUEST REGISTRY");
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async (id: string) => {
        if (!confirm("TERMINATE THIS SPONSORSHIP REQUEST?")) return;
        try {
            await api.post(`/api/v1/sponsors/hackathons/sponsorships/${id}/cancel`);
            toast.success("REQUEST NEUTRALIZED");
            fetchSponsorships();
        } catch {
            toast.error("TERMINATION SEQUENCE FAILED");
        }
    };

    const getStatusConfig = (status: string) => {
        const s = (status || "pending").toLowerCase();
        if (s === "active" || s === "approved" || s === "paid") {
            return {
                style: "bg-green-500/10 text-green-400 border-green-500/20",
                icon: <CheckCircle2 className="w-3.5 h-3.5" />,
                label: "AUTHORIZED"
            };
        }
        if (s === "cancelled" || s === "rejected") {
            return {
                style: "bg-red-500/10 text-red-400 border-red-500/20",
                icon: <XCircle className="w-3.5 h-3.5" />,
                label: "DENIED"
            };
        }
        return {
            style: "bg-amber-500/10 text-amber-400 border-amber-500/20",
            icon: <Clock className="w-3.5 h-3.5" />,
            label: "UNDER REVIEW"
        };
    };

    if (loading) {
        return (
            <DashboardLayout>
                <div className="py-20 flex flex-col items-center justify-center gap-4">
                    <Loader2 className="w-10 h-10 text-primary animate-spin" />
                    <span className="text-[10px] font-black text-white/20 uppercase tracking-[.3em]">RETRIVING REQUEST INTEL...</span>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="space-y-10 max-w-6xl mx-auto pb-12">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div>
                        <h1 className="text-5xl md:text-6xl font-black italic tracking-tighter uppercase text-white mb-2">
                            REQUEST <span className="text-primary text-glow-sm">INTEL</span>
                        </h1>
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-primary animate-pulse rounded-full shadow-glow-sm" />
                            <span className="text-[10px] text-white/40 uppercase tracking-[0.2em] font-bold">
                                MANAGE INCOMING AND OUTGOING SPONSORSHIP REQUESTS
                            </span>
                        </div>
                    </div>
                    
                    <Link 
                        href="/dashboard/opportunities"
                        className="px-8 py-4 bg-primary text-white text-[10px] font-black uppercase tracking-widest hover:bg-primary-dark transition-all rounded-sm shadow-glow-sm flex items-center justify-center gap-2"
                    >
                        NEW SPONSORSHIP MISSION
                    </Link>
                </div>

                {/* Table */}
                <div className="relative bg-[#080808] border border-white/5 rounded-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/5 bg-white/[0.02]">
                                    <th className="px-6 py-4 text-[9px] font-black text-white/30 uppercase tracking-[.2em]">MISSION ID</th>
                                    <th className="px-6 py-4 text-[9px] font-black text-white/30 uppercase tracking-[.2em]">EVENT & COMMANDER</th>
                                    <th className="px-6 py-4 text-[9px] font-black text-white/30 uppercase tracking-[.2em]">TIER & BOUNTY</th>
                                    <th className="px-6 py-4 text-[9px] font-black text-white/30 uppercase tracking-[.2em]">STATUS</th>
                                    <th className="px-6 py-4 text-[9px] font-black text-white/30 uppercase tracking-[.2em] text-right">OPS</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {sponsorships.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="py-20 text-center">
                                            <Target className="w-12 h-12 text-white/10 mx-auto mb-4" />
                                            <p className="text-xs font-black text-white/30 uppercase tracking-[0.2em]">NO MISSION REQUESTS DETECTED</p>
                                        </td>
                                    </tr>
                                ) : (
                                    sponsorships.map((s) => {
                                        const config = getStatusConfig(s.status);
                                        const eventName = s.hackathon?.title || "FIELD MISSION";
                                        const organizer = s.hackathon?.organizer?.user?.fullName || s.hackathon?.organizer?.organization || "COMMANDER";
                                        const amount = s.amount ? `$${Number(s.amount).toLocaleString()}` : "-";
                                        const tier = s.tier || s.tierName || "RECRUIT";
                                        const id = s.id?.slice(-8).toUpperCase() || "REQ-LOG";
                                        const canCancel = s.status?.toLowerCase() === "pending" || s.status?.toLowerCase() === "active";

                                        return (
                                            <tr key={s.id} className="hover:bg-white/[0.02] transition-colors group">
                                                <td className="px-6 py-5">
                                                    <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">{id}</span>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 bg-white/5 border border-white/10 flex items-center justify-center rounded-sm group-hover:border-primary/50 transition-all">
                                                            <Calendar className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
                                                        </div>
                                                        <div>
                                                            <h4 className="text-white font-black text-sm uppercase tracking-tighter italic group-hover:text-primary transition-colors">{eventName}</h4>
                                                            <p className="text-[9px] text-white/30 uppercase tracking-[.2em] font-black mt-1">{organizer}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <div>
                                                        <span className="text-white font-black text-sm italic">{amount}</span>
                                                        <p className="text-[9px] text-white/30 uppercase tracking-[.2em] font-black mt-1">{tier} TIER</p>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <div className={`inline-flex items-center gap-1.5 px-3 py-1 border text-[9px] font-black uppercase tracking-widest rounded-sm ${config.style}`}>
                                                        {config.icon}
                                                        {config.label}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5 text-right">
                                                    <div className="flex items-center justify-end gap-3">
                                                        <button className="p-2 text-white/20 hover:text-white hover:bg-white/5 transition-all rounded-sm" title="REPLAY COMMS">
                                                            <MessageSquare className="w-4 h-4" />
                                                        </button>
                                                        {canCancel && (
                                                            <button 
                                                                onClick={() => handleCancel(s.id)}
                                                                className="p-2 text-red-500/40 hover:text-red-500 hover:bg-red-500/10 transition-all rounded-sm" 
                                                                title="TERMINATE MISSION"
                                                            >
                                                                <X className="w-4 h-4" />
                                                            </button>
                                                        )}
                                                        <button className="p-2 text-white/10 hover:text-primary hover:bg-primary/10 transition-all group-hover:translate-x-1 rounded-sm">
                                                            <ChevronRight className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Empty State / Footer Callout */}
                <div className="relative p-12 bg-[#080808] border border-dashed border-white/10 rounded-sm text-center group overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-[80px] group-hover:bg-primary/10 transition-all duration-700"></div>
                    <Building2 className="w-12 h-12 text-white/5 mx-auto mb-6 group-hover:scale-110 transition-transform duration-500" />
                    <h3 className="text-xl font-black text-white italic tracking-tighter uppercase mb-2">LOOKING FOR TARGETS?</h3>
                    <p className="text-[10px] text-white/30 max-w-sm mx-auto uppercase tracking-widest font-black leading-loose">
                        BROWSE THE OPERATION GRID TO PROACTIVELY REACH OUT TO UPCOMING MISSIONS THAT ALIGN WITH YOUR BRAND INTEL.
                    </p>
                    <Link 
                        href="/dashboard/opportunities"
                        className="mt-8 text-primary hover:text-primary-light font-black flex items-center justify-center gap-2 mx-auto text-[10px] uppercase tracking-[.2em] transition-all group-hover:gap-4"
                    >
                        EXPLORE OPPORTUNITIES
                        <ChevronRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </DashboardLayout>
    );
}
