"use client";

import Link from "next/link";
import DashboardLayout from "@/components/DashboardLayout";
import { Calendar, Users, Trophy, TrendingUp } from "lucide-react";
import { useAuthStore } from "@shared/utils";

const stats = [
    { name: "Hackathons Joined", value: "3", icon: Calendar, trend: "+1 this month" },
    { name: "Active Teams", value: "2", icon: Users, trend: "2 looking for members" },
    { name: "Completed Projects", value: "5", icon: Trophy, trend: "+2 this month" },
    { name: "Skill Level", value: "Intermediate", icon: TrendingUp, trend: "Growing" },
];

const upcomingHackathons = [
    {
        id: 1,
        name: "AI Innovators Challenge",
        date: "March 15-17, 2026",
        participants: 120,
        status: "Registered",
    },
    {
        id: 2,
        name: "Web3 Summit Hackathon",
        date: "March 22-24, 2026",
        participants: 95,
        status: "Interested",
    },
    {
        id: 3,
        name: "Climate Tech Solutions",
        date: "April 5-7, 2026",
        participants: 78,
        status: "Open",
    },
];

const myTeams = [
    {
        id: 1,
        name: "Code Wizards",
        hackathon: "AI Innovators Challenge",
        members: 4,
        maxMembers: 5,
        status: "Looking for 1 more",
    },
    {
        id: 2,
        name: "Tech Titans",
        hackathon: "Past Event",
        members: 5,
        maxMembers: 5,
        status: "Complete",
    },
];

export default function DashboardPage() {
    const { user } = useAuthStore();
    return (
        <DashboardLayout>
            <div className="space-y-10">
                {/* Welcome Section */}
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">
                        Welcome back, <span className="text-primary-light drop-shadow-glow-sm transition-all duration-500">{user?.fullName?.split(' ')[0] || 'John'}</span>!
                    </h1>
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-primary animate-pulse rounded-full" />
                        <span className="text-xs text-white/40 uppercase tracking-[0.2em] font-medium">
                            System Online • Ready to hack
                        </span>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {stats.map((stat) => {
                        const Icon = stat.icon;
                        return (
                            <div key={stat.name} className="glass rounded-2xl p-6 hover:bg-white/10 border border-white/5 hover:border-primary/20 transition-all duration-500 group">
                                <div className="flex items-center justify-between mb-4">
                                    <Icon className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
                                    <span className="text-[10px] text-primary/60 font-bold uppercase tracking-widest bg-primary/5 px-2 py-1 rounded-full">{stat.trend}</span>
                                </div>
                                <p className="text-white/40 text-[10px] uppercase tracking-widest font-bold mb-1">{stat.name}</p>
                                <p className="text-3xl font-bold text-white tracking-tight">{stat.value}</p>
                            </div>
                        );
                    })}
                </div>

                {/* Main Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Upcoming Hackathons */}
                    <div className="glass rounded-2xl p-6 border border-white/5">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-white tracking-tight uppercase">Registered Hackathons</h2>
                            <Link href="/dashboard/hackathons" className="text-[10px] font-bold text-primary uppercase tracking-widest hover:text-primary-light transition-colors">
                                View All →
                            </Link>
                        </div>
                        <div className="space-y-4">
                            {upcomingHackathons.map((hackathon) => (
                                <div
                                    key={hackathon.id}
                                    className="p-4 bg-white/[0.02] border border-white/5 rounded-xl hover:bg-white/5 hover:border-primary/20 transition-all duration-300 group"
                                >
                                    <div className="flex items-start justify-between mb-2">
                                        <h3 className="font-bold text-white group-hover:text-primary-light transition-colors">{hackathon.name}</h3>
                                        <span
                                            className={`px-2 py-1 text-[10px] uppercase font-bold tracking-widest rounded-full ${hackathon.status === "Registered"
                                                ? "bg-primary/10 text-primary border border-primary/20"
                                                : hackathon.status === "Interested"
                                                    ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                                                    : "bg-white/5 text-white/40 border border-white/10"
                                                }`}
                                        >
                                            {hackathon.status}
                                        </span>
                                    </div>
                                    <p className="text-[10px] text-white/40 uppercase tracking-widest font-medium mb-2">{hackathon.date}</p>
                                    <p className="text-[10px] text-primary/60 uppercase tracking-widest font-bold">
                                        {hackathon.participants} participants registered
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* My Teams */}
                    <div className="glass rounded-2xl p-6 border border-white/5">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-white tracking-tight uppercase">My Teams</h2>
                            <Link href="/dashboard/teams" className="text-[10px] font-bold text-primary uppercase tracking-widest hover:text-primary-light transition-colors">
                                View All →
                            </Link>
                        </div>
                        <div className="space-y-4">
                            {myTeams.map((team) => (
                                <div
                                    key={team.id}
                                    className="p-4 bg-white/[0.02] border border-white/5 rounded-xl hover:bg-white/5 hover:border-primary/20 transition-all duration-300 group"
                                >
                                    <div className="flex items-start justify-between mb-2">
                                        <div>
                                            <h3 className="font-bold text-white group-hover:text-primary-light transition-colors">{team.name}</h3>
                                            <p className="text-xs text-white/40 uppercase tracking-widest mt-1">{team.hackathon}</p>
                                        </div>
                                        <span className="px-2 py-1 text-[10px] bg-white/5 border border-white/10 text-white/60 rounded-full font-bold">
                                            {team.members}/{team.maxMembers}
                                        </span>
                                    </div>
                                    <p className="text-[10px] text-primary uppercase tracking-widest font-bold">{team.status}</p>
                                </div>
                            ))}
                            <button className="w-full p-4 bg-primary/5 border border-dashed border-primary/20 rounded-xl text-primary text-[10px] uppercase font-bold tracking-widest hover:bg-primary/10 hover:border-primary/40 transition-all duration-300">
                                + Create New Mission
                            </button>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="glass rounded-2xl p-8 border border-white/5">
                    <h2 className="text-xl font-bold text-white mb-6 uppercase tracking-tight">Quick Actions</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <button className="p-6 bg-white/[0.02] border border-white/5 hover:border-primary/20 hover:bg-white/5 rounded-xl text-left transition-all duration-300 group">
                            <Calendar className="w-8 h-8 text-primary mb-4 group-hover:scale-110 group-hover:drop-shadow-glow-sm transition-all" />
                            <p className="font-bold text-white mb-1 uppercase text-xs tracking-wider">Browse Hackathons</p>
                            <p className="text-[10px] text-white/40 uppercase tracking-widest font-medium">Find your next challenge</p>
                        </button>
                        <button className="p-6 bg-white/[0.02] border border-white/5 hover:border-primary/20 hover:bg-white/5 rounded-xl text-left transition-all duration-300 group">
                            <Users className="w-8 h-8 text-primary mb-4 group-hover:scale-110 group-hover:drop-shadow-glow-sm transition-all" />
                            <p className="font-bold text-white mb-1 uppercase text-xs tracking-wider">Find Teammates</p>
                            <p className="text-[10px] text-white/40 uppercase tracking-widest font-medium">Build your dream team</p>
                        </button>
                        <button className="p-6 bg-white/[0.02] border border-white/5 hover:border-primary/20 hover:bg-white/5 rounded-xl text-left transition-all duration-300 group">
                            <Trophy className="w-8 h-8 text-primary mb-4 group-hover:scale-110 group-hover:drop-shadow-glow-sm transition-all" />
                            <p className="font-bold text-white mb-1 uppercase text-xs tracking-wider">View Achievements</p>
                            <p className="text-[10px] text-white/40 uppercase tracking-widest font-medium">Track your progress</p>
                        </button>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
