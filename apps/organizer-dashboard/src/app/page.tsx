"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import Link from "next/link";
import { 
    Users, 
    Calendar, 
    Trophy, 
    TrendingUp, 
    Clock, 
    ArrowUpRight, 
    Plus,
    MoreVertical,
    CheckCircle2,
    AlertCircle,
    Loader2
} from "lucide-react";
import api from "@takathon/shared/api";
import { toast } from "sonner";

export default function OverviewPage() {
    const [loading, setLoading] = useState(true);
    const [hackathons, setHackathons] = useState<any[]>([]);
    const [profileName, setProfileName] = useState("Organizer");

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [hackRes, profileRes] = await Promise.all([
                api.get("/api/v1/organizers/hackathons").catch(() => ({ data: { data: [] } })),
                api.get("/api/v1/organizers/profile").catch(() => null),
            ]);
            setHackathons(hackRes.data.data || []);
            if (profileRes?.data?.data) {
                setProfileName(profileRes.data.data.fullName || profileRes.data.data.user?.fullName || "Organizer");
            }
        } catch (error) {
            console.error("Failed to fetch dashboard data:", error);
            toast.error("Failed to load dashboard data");
        } finally {
            setLoading(false);
        }
    };

    const activeHackathons = hackathons.filter((h: any) => ["registration_open", "in_progress"].includes(h.status));
    const totalParticipants = hackathons.reduce((sum: number, h: any) => sum + (h._count?.participants || 0), 0);
    const totalTeams = hackathons.reduce((sum: number, h: any) => sum + (h._count?.teams || 0), 0);

    const stats = [
        { name: "Total Participants", value: String(totalParticipants), change: "across all events", changeType: "increase", icon: Users },
        { name: "Active Hackathons", value: String(activeHackathons.length), change: `${hackathons.length} total`, changeType: "neutral", icon: Calendar },
        { name: "Teams Formed", value: String(totalTeams), change: "across all events", changeType: "increase", icon: Trophy },
        { name: "Total Events", value: String(hackathons.length), change: "managed by you", changeType: "neutral", icon: TrendingUp },
    ];

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
                        <h1 className="text-3xl font-bold text-white">Dashboard Overview</h1>
                        <p className="text-white/60 mt-1">Welcome back, {profileName}</p>
                    </div>
                    <Link href="/hackathons/create">
                        <button className="btn-primary flex items-center justify-center gap-2">
                            <Plus className="w-5 h-5" />
                            <span>Create New Hackathon</span>
                        </button>
                    </Link>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat) => {
                        const Icon = stat.icon;
                        return (
                            <div key={stat.name} className="glass p-6 rounded-xl hover:bg-white/10 transition-all group">
                                <div className="flex items-start justify-between">
                                    <div className="p-3 bg-primary/10 rounded-lg text-primary group-hover:scale-110 transition-transform">
                                        <Icon className="w-6 h-6" />
                                    </div>
                                    {stat.changeType === "increase" && (
                                        <div className="flex items-center gap-1 text-sm font-medium text-green-400">
                                            <ArrowUpRight className="w-4 h-4" />
                                        </div>
                                    )}
                                </div>
                                <div className="mt-4">
                                    <h3 className="text-white/60 text-sm font-medium">{stat.name}</h3>
                                    <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                                    <p className="text-xs text-white/40 mt-1">{stat.change}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Active Hackathons */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold text-white">Active Hackathons</h2>
                            <Link href="/hackathons" className="text-primary hover:text-primary-light text-sm font-medium">View All</Link>
                        </div>
                        <div className="grid grid-cols-1 gap-4">
                            {activeHackathons.length === 0 ? (
                                <div className="glass p-8 rounded-xl text-center">
                                    <Calendar className="w-10 h-10 text-white/20 mx-auto mb-3" />
                                    <p className="text-white/60">No active hackathons</p>
                                    <Link href="/hackathons/create">
                                        <button className="mt-4 btn-primary text-sm">Create Your First Hackathon</button>
                                    </Link>
                                </div>
                            ) : (
                                activeHackathons.slice(0, 3).map((hackathon: any) => {
                                    const start = hackathon.startDate ? new Date(hackathon.startDate) : null;
                                    const end = hackathon.endDate ? new Date(hackathon.endDate) : null;
                                    const daysLeft = end ? Math.max(0, Math.ceil((end.getTime() - Date.now()) / (1000 * 60 * 60 * 24))) : null;
                                    return (
                                        <div key={hackathon.id} className="glass p-6 rounded-xl border border-white/10 hover:border-primary/30 transition-all">
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                                <div className="space-y-1">
                                                    <h3 className="text-lg font-bold text-white">{hackathon.title}</h3>
                                                    <div className="flex items-center gap-3 text-sm text-white/60">
                                                        <span className="flex items-center gap-1">
                                                            <Users className="w-4 h-4" /> {hackathon._count?.participants || 0} participants
                                                        </span>
                                                        {daysLeft !== null && (
                                                            <span className="flex items-center gap-1">
                                                                <Clock className="w-4 h-4" /> {daysLeft} days left
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                        hackathon.status === "in_progress" ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-primary/10 text-primary border border-primary/20"
                                                    }`}>
                                                        {hackathon.status?.replace(/_/g, " ")}
                                                    </span>
                                                    <Link href={`/hackathons/${hackathon.id}`}>
                                                        <button className="p-2 text-white/40 hover:text-white hover:bg-white/5 rounded-lg transition-all">
                                                            <MoreVertical className="w-5 h-5" />
                                                        </button>
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>

                    {/* Upcoming Hackathons / Quick Info */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold text-white">All Events</h2>
                            <Link href="/hackathons" className="text-primary hover:text-primary-light text-sm font-medium">Manage</Link>
                        </div>
                        <div className="glass rounded-xl overflow-hidden divide-y divide-white/10">
                            {hackathons.length === 0 ? (
                                <div className="p-6 text-center text-white/40 text-sm">No events yet</div>
                            ) : (
                                hackathons.slice(0, 5).map((h: any) => (
                                    <div key={h.id} className="p-4 hover:bg-white/5 transition-all group">
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                                    {h.title?.charAt(0)}
                                                </div>
                                                <div>
                                                    <h4 className="text-white font-medium text-sm group-hover:text-primary transition-colors line-clamp-1">{h.title}</h4>
                                                    <p className="text-xs text-white/40">{h._count?.participants || 0} participants</p>
                                                </div>
                                            </div>
                                            <span className={`flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider ${
                                                h.status === "completed" ? "text-green-400" :
                                                h.status === "in_progress" ? "text-blue-400" :
                                                h.status === "registration_open" ? "text-primary" : "text-white/40"
                                            }`}>
                                                {h.status === "completed" ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                                                {h.status?.replace(/_/g, " ")}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                        
                        <div className="bg-primary/10 border border-primary/20 rounded-xl p-5 space-y-2">
                            <h4 className="text-primary font-bold text-sm flex items-center gap-2">
                                <AlertCircle className="w-4 h-4" />
                                Organizer Tip
                            </h4>
                            <p className="text-xs text-white/70 leading-relaxed">
                                Keep your hackathon descriptions updated and publish them early to attract more participants!
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            )}
        </DashboardLayout>
    );
}
