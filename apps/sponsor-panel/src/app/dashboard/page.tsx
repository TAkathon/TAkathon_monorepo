"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { 
    Users, 
    Calendar, 
    Clock, 
    ChevronRight,
    Target,
    Loader2,
    DollarSign
} from "lucide-react";
import api from "@takathon/shared/api";
import { toast } from "sonner";
import Link from "next/link";

const quickActions = [
    {
        title: "Find Events",
        description: "Browse upcoming hackathons looking for sponsors.",
        icon: Target,
        href: "/dashboard/opportunities",
        color: "bg-primary/10 text-primary",
    },
    {
        title: "My Sponsorships",
        description: "Check your active and past sponsorships.",
        icon: Users,
        href: "/dashboard/requests",
        color: "bg-blue-500/10 text-blue-500",
    },
];

export default function SponsorDashboard() {
    const [profile, setProfile] = useState<any>(null);
    const [sponsorships, setSponsorships] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            api.get("/api/v1/sponsors/profile").catch(() => ({ data: { data: null } })),
            api.get("/api/v1/sponsors/hackathons/sponsorships").catch(() => ({ data: { data: [] } })),
        ]).then(([profileRes, sponsorshipsRes]) => {
            setProfile(profileRes.data.data);
            const sps = sponsorshipsRes.data.data?.sponsorships || sponsorshipsRes.data.data || [];
            setSponsorships(Array.isArray(sps) ? sps : []);
        }).catch(() => {
            toast.error("Failed to load dashboard data");
        }).finally(() => {
            setLoading(false);
        });
    }, []);

    const activeSponsorships = sponsorships.filter((s: any) =>
        (s.status || "").toLowerCase() === "active"
    );
    const pendingSponsorships = sponsorships.filter((s: any) =>
        (s.status || "").toLowerCase() === "pending"
    );
    const totalAmount = sponsorships.reduce((sum: number, s: any) => sum + (Number(s.amount) || 0), 0);

    const stats = [
        { name: "Total Sponsored Events", value: sponsorships.length.toString(), icon: Calendar, color: "text-primary" },
        { name: "Active Sponsorships", value: activeSponsorships.length.toString(), icon: Target, color: "text-green-400" },
        { name: "Pending Requests", value: pendingSponsorships.length.toString(), icon: Clock, color: "text-amber-400" },
        { name: "Total Invested", value: totalAmount > 0 ? `$${totalAmount.toLocaleString()}` : "$0", icon: DollarSign, color: "text-blue-400" },
    ];

    const companyName = profile?.companyName || profile?.user?.fullName || "Sponsor";

    return (
        <DashboardLayout>
            {loading ? (
                <div className="flex items-center justify-center min-h-[400px]">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                </div>
            ) : (
            <div className="space-y-8">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Welcome back, {companyName}!</h1>
                    <p className="text-white/60">Here&apos;s an overview of your sponsorship activities.</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat) => {
                        const Icon = stat.icon;
                        return (
                            <div key={stat.name} className="glass p-6 rounded-2xl hover:border-primary/30 transition-all duration-300">
                                <div className="p-3 rounded-xl bg-white/5 w-fit">
                                    <Icon className={`w-6 h-6 ${stat.color}`} />
                                </div>
                                <div className="mt-4">
                                    <p className="text-sm text-white/60">{stat.name}</p>
                                    <h3 className="text-2xl font-bold text-white mt-1">{stat.value}</h3>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Recent Sponsorships */}
                    <div className="lg:col-span-2">
                        <div className="glass rounded-2xl p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-white">Recent Sponsorships</h2>
                                <Link href="/dashboard/requests" className="text-sm text-primary hover:text-primary-light transition-colors">View All</Link>
                            </div>
                            {sponsorships.length === 0 ? (
                                <div className="text-center py-8">
                                    <Target className="w-10 h-10 text-white/20 mx-auto mb-3" />
                                    <p className="text-white/40 text-sm">No sponsorships yet.</p>
                                    <Link href="/dashboard/opportunities" className="btn-primary mt-4 inline-block text-sm">Browse Events</Link>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {sponsorships.slice(0, 3).map((s: any) => {
                                        const title = s.hackathon?.title || "Hackathon";
                                        const tier = s.tier || s.tierName || "Sponsor";
                                        const amount = s.amount ? `$${Number(s.amount).toLocaleString()}` : "";
                                        const status = (s.status || "pending").toLowerCase();
                                        return (
                                            <div key={s.id} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-all">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                                                        {title.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <h4 className="text-white font-medium">{title}</h4>
                                                        <p className="text-xs text-white/40">Tier: {tier}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    {amount && <p className="text-sm text-white font-medium">{amount}</p>}
                                                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                                                        status === "active" ? "bg-green-500/10 text-green-400" :
                                                        status === "pending" ? "bg-amber-500/10 text-amber-400" :
                                                        "bg-white/10 text-white/40"
                                                    }`}>{status}</span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="space-y-6">
                        <h2 className="text-xl font-bold text-white">Quick Actions</h2>
                        <div className="space-y-4">
                            {quickActions.map((action) => {
                                const Icon = action.icon;
                                return (
                                    <Link
                                        key={action.title}
                                        href={action.href}
                                        className="flex items-center gap-4 p-4 rounded-2xl glass hover:border-primary/30 group transition-all"
                                    >
                                        <div className={`p-3 rounded-xl ${action.color}`}>
                                            <Icon className="w-6 h-6" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-white font-medium">{action.title}</h3>
                                            <p className="text-xs text-white/40">{action.description}</p>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-white/20 group-hover:text-primary transition-colors" />
                                    </Link>
                                );
                            })}
                        </div>

                        <div className="glass rounded-2xl p-6 bg-gradient-to-br from-primary/10 to-transparent border-primary/20">
                            <h3 className="text-white font-bold mb-2">Total Invested</h3>
                            <div className="flex items-end gap-2 mb-2">
                                <span className="text-3xl font-bold text-white">${totalAmount.toLocaleString()}</span>
                            </div>
                            <p className="text-xs text-white/40">Across {sponsorships.length} sponsorships</p>
                        </div>
                    </div>
                </div>
            </div>
            )}
        </DashboardLayout>
    );
}
