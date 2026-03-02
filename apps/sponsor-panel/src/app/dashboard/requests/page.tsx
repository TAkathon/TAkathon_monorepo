"use client";

import DashboardLayout from "@/components/DashboardLayout";
import {
    CheckCircle2,
    XCircle,
    Clock,
    MessageSquare,
    Eye,
    Building2,
    Calendar,
    ChevronRight
} from "lucide-react";

const requests = [
    {
        id: "REQ-001",
        eventName: "Deep Learning Summit",
        organizer: "Data Tunisia",
        date: "2024-09-20",
        amount: "$5,000",
        tier: "Gold",
        status: "Pending",
        message: "We'd love to have you as a Gold sponsor for our upcoming summit.",
    },
    {
        id: "REQ-002",
        eventName: "Open Source Days",
        organizer: "OSS Community",
        date: "2024-08-15",
        amount: "$2,500",
        tier: "Silver",
        status: "Approved",
        message: "Thank you for your interest in supporting open source development.",
    },
    {
        id: "REQ-003",
        eventName: "Blockchain Expo",
        organizer: "Crypto Hub",
        date: "2024-07-10",
        amount: "$10,000",
        tier: "Platinum",
        status: "Rejected",
        message: "Unfortunately, we've already filled our Platinum sponsor slots.",
    },
];

const getStatusStyles = (status: string) => {
    switch (status) {
        case "Approved": return "bg-green-500/10 text-green-400 border-green-500/20";
        case "Rejected": return "bg-red-500/10 text-red-400 border-red-500/20";
        default: return "bg-amber-500/10 text-amber-400 border-amber-500/20";
    }
};

const getStatusIcon = (status: string) => {
    switch (status) {
        case "Approved": return <CheckCircle2 className="w-3.5 h-3.5" />;
        case "Rejected": return <XCircle className="w-3.5 h-3.5" />;
        default: return <Clock className="w-3.5 h-3.5" />;
    }
};

export default function RequestsPage() {
    return (
        <DashboardLayout>
            <div className="space-y-8">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-white uppercase tracking-tight">Request Intel</h1>
                    <div className="flex items-center gap-2 mt-2">
                        <div className="w-1.5 h-1.5 bg-primary animate-pulse rounded-full" />
                        <span className="text-[10px] text-white/40 uppercase tracking-[0.2em] font-bold">
                            Manage incoming and outgoing sponsorship requests
                        </span>
                    </div>
                </div>

                {/* Table */}
                <div className="glass rounded-xl overflow-hidden border border-white/5">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/5 bg-white/[0.02]">
                                    <th className="px-6 py-4 text-[10px] font-bold text-white/30 uppercase tracking-widest">Request ID</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-white/30 uppercase tracking-widest">Event & Organizer</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-white/30 uppercase tracking-widest">Tier & Amount</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-white/30 uppercase tracking-widest">Status</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-white/30 uppercase tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {requests.map((req) => (
                                    <tr key={req.id} className="hover:bg-white/[0.02] transition-colors group">
                                        <td className="px-6 py-4">
                                            <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{req.id}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-primary/10 border border-primary/20 flex items-center justify-center">
                                                    <Calendar className="w-5 h-5 text-primary" />
                                                </div>
                                                <div>
                                                    <h4 className="text-white font-bold text-xs uppercase tracking-wider group-hover:text-primary-light transition-colors">{req.eventName}</h4>
                                                    <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">{req.organizer}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div>
                                                <span className="text-white font-bold text-sm">{req.amount}</span>
                                                <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">{req.tier} Tier</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 border text-[10px] font-bold uppercase tracking-widest ${getStatusStyles(req.status)}`}>
                                                {getStatusIcon(req.status)}
                                                {req.status}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button className="p-2 text-white/30 hover:text-white hover:bg-white/5 transition-all" title="View Message">
                                                    <MessageSquare className="w-4 h-4" />
                                                </button>
                                                <button className="p-2 text-white/30 hover:text-white hover:bg-white/5 transition-all" title="View Details">
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                <button className="p-2 text-white/30 hover:text-primary hover:bg-primary/10 transition-all group-hover:translate-x-0.5">
                                                    <ChevronRight className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Empty State */}
                <div className="text-center py-12 glass rounded-xl border border-dashed border-white/10">
                    <Building2 className="w-12 h-12 text-white/10 mx-auto mb-4" />
                    <h3 className="text-white font-bold text-xs uppercase tracking-widest mb-1">Looking for more?</h3>
                    <p className="text-[10px] text-white/40 max-w-sm mx-auto uppercase tracking-widest font-bold">
                        Check out our Discover page to proactively reach out to events that match your brand.
                    </p>
                    <button className="mt-6 text-primary hover:text-primary-light font-bold flex items-center gap-2 mx-auto text-[10px] uppercase tracking-widest">
                        Explore Opportunities
                        <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>
        </DashboardLayout>
    );
}
