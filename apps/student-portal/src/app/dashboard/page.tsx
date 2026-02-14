"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import DashboardLayout from "@/components/DashboardLayout";
import { Calendar, Users, Trophy, TrendingUp, Loader2 } from "lucide-react";
import { studentService } from "@/lib/api";
import { useAuthStore } from "@shared/utils";

export default function DashboardPage() {
    const { user } = useAuthStore();
    const [hackathons, setHackathons] = useState<any[]>([]);
    const [teams, setTeams] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const [hackRes, teamRes] = await Promise.all([
                    studentService.myHackathons().catch(() => ({ data: { data: [] } })),
                    studentService.myTeams().catch(() => ({ data: { data: [] } })),
                ]);
                setHackathons(hackRes.data?.data || []);
                setTeams(teamRes.data?.data || []);
            } catch {
                // fail silently - show empty state
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    const activeTeams = teams.filter((t: any) => t.status === "forming" || t.status === "complete");
    const completedProjects = teams.filter((t: any) => t.status === "submitted" || t.status === "complete");

    const stats = [
        { name: "Hackathons Joined", value: String(hackathons.length), icon: Calendar, trend: "All time" },
        { name: "Active Teams", value: String(activeTeams.length), icon: Users, trend: `${activeTeams.filter((t: any) => t.status === "forming").length} forming` },
        { name: "Completed Projects", value: String(completedProjects.length), icon: Trophy, trend: "Keep going!" },
        { name: "Skill Level", value: "—", icon: TrendingUp, trend: "Growing" },
    ];

    if (loading) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                </div>
            </DashboardLayout>
        );
    }

    const firstName = user?.fullName?.split(" ")[0] || "Student";

    return (
        <DashboardLayout>
            <div className="space-y-8">
                {/* Welcome Section */}
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">
                        Welcome back, <span className="text-primary">{firstName}</span>!
                    </h1>
                    <p className="text-white/60">
                        Here&apos;s what&apos;s happening with your hackathons and teams
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {stats.map((stat) => {
                        const Icon = stat.icon;
                        return (
                            <div key={stat.name} className="glass rounded-xl p-6 hover:bg-white/10 transition-all duration-300">
                                <div className="flex items-center justify-between mb-4">
                                    <Icon className="w-8 h-8 text-primary" />
                                </div>
                                <p className="text-white/60 text-sm mb-1">{stat.name}</p>
                                <p className="text-3xl font-bold text-white mb-2">{stat.value}</p>
                                <p className="text-xs text-primary">{stat.trend}</p>
                            </div>
                        );
                    })}
                </div>

                {/* Main Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Upcoming Hackathons */}
                    <div className="glass rounded-xl p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-white">My Hackathons</h2>
                            <Link href="/dashboard/hackathons" className="text-sm text-primary hover:text-primary-light">
                                View All
                            </Link>
                        </div>
                        <div className="space-y-4">
                            {hackathons.length === 0 ? (
                                <p className="text-white/40 text-sm text-center py-6">No hackathons yet. Browse and register!</p>
                            ) : (
                                hackathons.slice(0, 3).map((h: any) => (
                                    <div
                                        key={h.id}
                                        className="p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-all duration-200 cursor-pointer"
                                    >
                                        <div className="flex items-start justify-between mb-2">
                                            <h3 className="font-semibold text-white">{h.hackathon?.title || h.title}</h3>
                                            <span className="px-2 py-1 text-xs rounded-full bg-primary/20 text-primary">
                                                {h.status}
                                            </span>
                                        </div>
                                        <p className="text-sm text-white/60 mb-2">
                                            {h.hackathon?.startDate
                                                ? new Date(h.hackathon.startDate).toLocaleDateString()
                                                : ""}
                                        </p>
                                        <p className="text-xs text-white/40">
                                            {h.hackathon?._count?.participants || 0} participants registered
                                        </p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* My Teams */}
                    <div className="glass rounded-xl p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-white">My Teams</h2>
                            <Link href="/dashboard/teams" className="text-sm text-primary hover:text-primary-light">
                                View All
                            </Link>
                        </div>
                        <div className="space-y-4">
                            {teams.length === 0 ? (
                                <p className="text-white/40 text-sm text-center py-6">No teams yet. Create or join one!</p>
                            ) : (
                                teams.slice(0, 3).map((team: any) => (
                                    <div
                                        key={team.id}
                                        className="p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-all duration-200 cursor-pointer"
                                    >
                                        <div className="flex items-start justify-between mb-2">
                                            <div>
                                                <h3 className="font-semibold text-white">{team.name}</h3>
                                                <p className="text-sm text-white/60">{team.hackathon?.title || ""}</p>
                                            </div>
                                            <span className="px-2 py-1 text-xs bg-white/10 text-white/60 rounded-full">
                                                {team.currentSize}/{team.maxSize} members
                                            </span>
                                        </div>
                                        <p className="text-xs text-primary capitalize">{team.status}</p>
                                    </div>
                                ))
                            )}
                            <Link href="/dashboard/teams" className="block w-full p-4 bg-primary/10 border-2 border-dashed border-primary/30 rounded-lg text-primary hover:bg-primary/20 hover:border-primary/50 transition-all duration-200 font-semibold text-center">
                                + Create New Team
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="glass rounded-xl p-6">
                    <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <Link href="/dashboard/hackathons" className="p-4 bg-white/5 hover:bg-white/10 rounded-lg text-left transition-all duration-200 group">
                            <Calendar className="w-6 h-6 text-primary mb-2 group-hover:scale-110 transition-transform" />
                            <p className="font-semibold text-white mb-1">Browse Hackathons</p>
                            <p className="text-xs text-white/60">Find your next challenge</p>
                        </Link>
                        <Link href="/dashboard/teams" className="p-4 bg-white/5 hover:bg-white/10 rounded-lg text-left transition-all duration-200 group">
                            <Users className="w-6 h-6 text-primary mb-2 group-hover:scale-110 transition-transform" />
                            <p className="font-semibold text-white mb-1">Find Teammates</p>
                            <p className="text-xs text-white/60">Build your dream team</p>
                        </Link>
                        <Link href="/dashboard/profile" className="p-4 bg-white/5 hover:bg-white/10 rounded-lg text-left transition-all duration-200 group">
                            <Trophy className="w-6 h-6 text-primary mb-2 group-hover:scale-110 transition-transform" />
                            <p className="font-semibold text-white mb-1">Update Profile</p>
                            <p className="text-xs text-white/60">Keep your skills up to date</p>
                        </Link>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
