"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { 
    CheckCircle2, 
    XCircle, 
    Clock, 
    Eye,
    Building2,
    Calendar,
    ChevronRight,
    Loader2
} from "lucide-react";
import { sponsorService } from "@/lib/api";

const getStatusStyles = (status: string) => {
    switch (status) {
        case "active":
        case "confirmed":
            return "bg-green-500/10 text-green-500 border-green-500/20";
        case "cancelled":
            return "bg-red-500/10 text-red-500 border-red-500/20";
        default:
            return "bg-amber-500/10 text-amber-500 border-amber-500/20";
    }
};

const getStatusIcon = (status: string) => {
    switch (status) {
        case "active":
        case "confirmed":
            return <CheckCircle2 className="w-4 h-4" />;
        case "cancelled":
            return <XCircle className="w-4 h-4" />;
        default:
            return <Clock className="w-4 h-4" />;
    }
};

export default function RequestsPage() {
    const [sponsorships, setSponsorships] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [cancelling, setCancelling] = useState<string | null>(null);

    useEffect(() => {
        fetchSponsorships();
    }, []);

    const fetchSponsorships = async () => {
        setLoading(true);
        try {
            const res = await sponsorService.mySponsorships();
            setSponsorships(res.data?.data?.sponsorships || res.data?.data || []);
        } catch {
            setSponsorships([]);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async (id: string) => {
        setCancelling(id);
        try {
            await sponsorService.cancelSponsorship(id);
            fetchSponsorships();
        } catch {
            /* empty */
        } finally {
            setCancelling(null);
        }
    };

    return (
        <DashboardLayout>
            <div className="space-y-8">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">My Sponsorships</h1>
                    <p className="text-white/60">Manage your active and past sponsorships.</p>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center h-48">
                        <Loader2 className="w-8 h-8 text-primary animate-spin" />
                    </div>
                ) : sponsorships.length === 0 ? (
                    <div className="text-center py-12 glass rounded-2xl border border-dashed border-white/10">
                        <Building2 className="w-12 h-12 text-white/10 mx-auto mb-4" />
                        <h3 className="text-white font-medium mb-1">No sponsorships yet</h3>
                        <p className="text-white/40 text-sm max-w-sm mx-auto">
                            Browse our Discover page to find events that match your brand.
                        </p>
                        <a href="/dashboard/opportunities" className="mt-6 text-primary hover:text-primary-light font-medium flex items-center gap-2 mx-auto justify-center">
                            Explore Opportunities
                            <ChevronRight className="w-4 h-4" />
                        </a>
                    </div>
                ) : (
                    <div className="glass rounded-2xl overflow-hidden border border-white/10">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-white/10 bg-white/5">
                                        <th className="px-6 py-4 text-xs font-bold text-white/40 uppercase tracking-widest">Event</th>
                                        <th className="px-6 py-4 text-xs font-bold text-white/40 uppercase tracking-widest">Tier & Amount</th>
                                        <th className="px-6 py-4 text-xs font-bold text-white/40 uppercase tracking-widest">Status</th>
                                        <th className="px-6 py-4 text-xs font-bold text-white/40 uppercase tracking-widest text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {sponsorships.map((s: any) => (
                                        <tr key={s.id} className="hover:bg-white/5 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                                        <Calendar className="w-5 h-5 text-primary" />
                                                    </div>
                                                    <div>
                                                        <h4 className="text-white font-medium group-hover:text-primary transition-colors">
                                                            {s.hackathon?.title || "Hackathon"}
                                                        </h4>
                                                        <p className="text-xs text-white/40">
                                                            {s.createdAt ? new Date(s.createdAt).toLocaleDateString() : ""}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div>
                                                    <span className="text-sm text-white font-medium">
                                                        ${Number(s.amount || 0).toLocaleString()}
                                                    </span>
                                                    <p className="text-xs text-white/40 capitalize">{s.tier} Tier</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-medium capitalize ${getStatusStyles(s.status)}`}>
                                                    {getStatusIcon(s.status)}
                                                    {s.status}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    {(s.status === "active" || s.status === "pending" || s.status === "confirmed") && (
                                                        <button
                                                            onClick={() => handleCancel(s.id)}
                                                            disabled={cancelling === s.id}
                                                            className="px-3 py-1.5 rounded-lg text-xs font-medium text-red-400 hover:bg-red-500/10 border border-red-500/20 transition-all"
                                                        >
                                                            {cancelling === s.id ? (
                                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                            ) : (
                                                                "Cancel"
                                                            )}
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
