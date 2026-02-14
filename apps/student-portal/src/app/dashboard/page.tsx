"use client";

import Link from "next/link";
import DashboardLayout from "@/components/DashboardLayout";
import { Calendar, Users, Trophy, TrendingUp } from "lucide-react";

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
    return (
        <DashboardLayout>
            <div className="space-y-8">
                {/* Welcome Section */}
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">
                        Welcome back, <span className="text-primary">John</span>!
                    </h1>
                    <p className="text-white/60">
                        Here's what's happening with your hackathons and teams
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
                            <h2 className="text-xl font-bold text-white">Upcoming Hackathons</h2>
                            <Link href="/dashboard/hackathons" className="text-sm text-primary hover:text-primary-light">
                                View All
                            </Link>
                        </div>
                        <div className="space-y-4">
                            {upcomingHackathons.map((hackathon) => (
                                <div
                                    key={hackathon.id}
                                    className="p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-all duration-200 cursor-pointer"
                                >
                                    <div className="flex items-start justify-between mb-2">
                                        <h3 className="font-semibold text-white">{hackathon.name}</h3>
                                        <span
                                            className={`px-2 py-1 text-xs rounded-full ${
                                                hackathon.status === "Registered"
                                                    ? "bg-primary/20 text-primary"
                                                    : hackathon.status === "Interested"
                                                    ? "bg-blue-500/20 text-blue-400"
                                                    : "bg-white/10 text-white/60"
                                            }`}
                                        >
                                            {hackathon.status}
                                        </span>
                                    </div>
                                    <p className="text-sm text-white/60 mb-2">{hackathon.date}</p>
                                    <p className="text-xs text-white/40">
                                        {hackathon.participants} participants registered
                                    </p>
                                </div>
                            ))}
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
                            {myTeams.map((team) => (
                                <div
                                    key={team.id}
                                    className="p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-all duration-200 cursor-pointer"
                                >
                                    <div className="flex items-start justify-between mb-2">
                                        <div>
                                            <h3 className="font-semibold text-white">{team.name}</h3>
                                            <p className="text-sm text-white/60">{team.hackathon}</p>
                                        </div>
                                        <span className="px-2 py-1 text-xs bg-white/10 text-white/60 rounded-full">
                                            {team.members}/{team.maxMembers} members
                                        </span>
                                    </div>
                                    <p className="text-xs text-primary">{team.status}</p>
                                </div>
                            ))}
                            <button className="w-full p-4 bg-primary/10 border-2 border-dashed border-primary/30 rounded-lg text-primary hover:bg-primary/20 hover:border-primary/50 transition-all duration-200 font-semibold">
                                + Create New Team
                            </button>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="glass rounded-xl p-6">
                    <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <button className="p-4 bg-white/5 hover:bg-white/10 rounded-lg text-left transition-all duration-200 group">
                            <Calendar className="w-6 h-6 text-primary mb-2 group-hover:scale-110 transition-transform" />
                            <p className="font-semibold text-white mb-1">Browse Hackathons</p>
                            <p className="text-xs text-white/60">Find your next challenge</p>
                        </button>
                        <button className="p-4 bg-white/5 hover:bg-white/10 rounded-lg text-left transition-all duration-200 group">
                            <Users className="w-6 h-6 text-primary mb-2 group-hover:scale-110 transition-transform" />
                            <p className="font-semibold text-white mb-1">Find Teammates</p>
                            <p className="text-xs text-white/60">Build your dream team</p>
                        </button>
                        <button className="p-4 bg-white/5 hover:bg-white/10 rounded-lg text-left transition-all duration-200 group">
                            <Trophy className="w-6 h-6 text-primary mb-2 group-hover:scale-110 transition-transform" />
                            <p className="font-semibold text-white mb-1">View Achievements</p>
                            <p className="text-xs text-white/60">Track your progress</p>
                        </button>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
