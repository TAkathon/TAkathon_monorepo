"use client";

import Link from "next/link";
import DashboardLayout from "@/components/DashboardLayout";
import {
    Users,
    Calendar,
    Trophy,
    TrendingUp,
    Clock,
    ArrowUpRight,
    ArrowDownRight,
    Plus,
    MoreVertical,
    CheckCircle2,
    AlertCircle
} from "lucide-react";
import { useAuthStore } from "@shared/utils";

const stats = [
    {
        name: "Total Operatives",
        value: "1,284",
        change: "+12%",
        changeType: "increase",
        icon: Users,
        trend: "vs last month",
    },
    {
        name: "Active Operations",
        value: "3",
        change: "0",
        changeType: "neutral",
        icon: Calendar,
        trend: "in progress",
    },
    {
        name: "Squads Deployed",
        value: "342",
        change: "+18%",
        changeType: "increase",
        icon: Trophy,
        trend: "formed this cycle",
    },
    {
        name: "Engagement Rate",
        value: "84%",
        change: "-2%",
        changeType: "decrease",
        icon: TrendingUp,
        trend: "avg. participation",
    },
];

const activeHackathons = [
    {
        id: 1,
        name: "AI Global Summit 2026",
        status: "In Progress",
        participants: 540,
        daysLeft: 2,
        progress: 75,
    },
    {
        id: 2,
        name: "Web3 Innovation Hack",
        status: "Registration Open",
        participants: 210,
        daysLeft: 12,
        progress: 30,
    },
];

const recentApplications = [
    {
        id: 1,
        name: "Alex Rivera",
        hackathon: "AI Global Summit",
        role: "Frontend Developer",
        status: "Approved",
        time: "2 hours ago",
    },
    {
        id: 2,
        name: "Sarah Chen",
        hackathon: "Web3 Innovation Hack",
        role: "Smart Contract dev",
        status: "Pending",
        time: "5 hours ago",
    },
    {
        id: 3,
        name: "James Wilson",
        hackathon: "AI Global Summit",
        role: "Data Scientist",
        status: "Under Review",
        time: "8 hours ago",
    },
    {
        id: 4,
        name: "Elena Petrova",
        hackathon: "AI Global Summit",
        role: "UI/UX Designer",
        status: "Approved",
        time: "1 day ago",
    },
];

export default function OverviewPage() {
    const { user } = useAuthStore();
    return (
        <DashboardLayout>
            <div className="space-y-10">
                {/* Welcome Section */}
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">
                        Welcome back, <span className="text-primary-light drop-shadow-glow-sm transition-all duration-500">{user?.fullName?.split(' ')[0] || 'Commander'}</span>!
                    </h1>
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-primary animate-pulse rounded-full" />
                        <span className="text-xs text-white/40 uppercase tracking-[0.2em] font-medium">
                            System Online • Organizer Command Center
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
                                    <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full ${stat.changeType === "increase" ? "bg-green-500/10 text-green-400" :
                                            stat.changeType === "decrease" ? "bg-red-500/10 text-red-400" :
                                                "bg-primary/5 text-primary/60"
                                        }`}>
                                        {stat.changeType === "increase" && <ArrowUpRight className="w-3 h-3 inline mr-0.5" />}
                                        {stat.changeType === "decrease" && <ArrowDownRight className="w-3 h-3 inline mr-0.5" />}
                                        {stat.change}
                                    </span>
                                </div>
                                <p className="text-white/40 text-[10px] uppercase tracking-widest font-bold mb-1">{stat.name}</p>
                                <p className="text-3xl font-bold text-white tracking-tight">{stat.value}</p>
                            </div>
                        );
                    })}
                </div>

                {/* Main Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Active Hackathons */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold text-white tracking-tight uppercase">Active Operations</h2>
                            <Link href="/hackathons" className="text-[10px] font-bold text-primary uppercase tracking-widest hover:text-primary-light transition-colors">
                                View All →
                            </Link>
                        </div>
                        <div className="space-y-4">
                            {activeHackathons.map((hackathon) => (
                                <div key={hackathon.id} className="glass rounded-2xl p-6 border border-white/5 hover:border-primary/20 transition-all duration-300 group">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        <div className="space-y-1">
                                            <h3 className="text-lg font-bold text-white group-hover:text-primary-light transition-colors">{hackathon.name}</h3>
                                            <div className="flex items-center gap-3 text-[10px] text-white/40 uppercase tracking-widest font-bold">
                                                <span className="flex items-center gap-1">
                                                    <Users className="w-3.5 h-3.5 text-primary" /> {hackathon.participants} operatives
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Clock className="w-3.5 h-3.5 text-primary" /> {hackathon.daysLeft} days remaining
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className={`px-3 py-1 text-[10px] uppercase font-bold tracking-widest rounded-full border ${hackathon.status === "In Progress" ? "bg-green-500/10 text-green-400 border-green-500/20" : "bg-primary/10 text-primary border-primary/20"
                                                }`}>
                                                {hackathon.status}
                                            </span>
                                            <button className="p-2 text-white/40 hover:text-white hover:bg-white/5 transition-all">
                                                <MoreVertical className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="mt-6 space-y-2">
                                        <div className="flex justify-between text-[10px] uppercase tracking-widest font-bold">
                                            <span className="text-white/40">Mission Progress</span>
                                            <span className="text-white">{hackathon.progress}%</span>
                                        </div>
                                        <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-primary rounded-full shadow-[0_0_10px_rgba(255,92,0,0.5)]"
                                                style={{ width: `${hackathon.progress}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recent Applications */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold text-white tracking-tight uppercase">Recent Intel</h2>
                            <Link href="/participants" className="text-[10px] font-bold text-primary uppercase tracking-widest hover:text-primary-light transition-colors">
                                Review All →
                            </Link>
                        </div>
                        <div className="glass rounded-2xl overflow-hidden divide-y divide-white/5">
                            {recentApplications.map((app) => (
                                <div key={app.id} className="p-4 hover:bg-white/5 transition-all group">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-primary/20 border border-primary/30 flex items-center justify-center text-primary font-black text-xs">
                                                {app.name.charAt(0)}
                                            </div>
                                            <div>
                                                <h4 className="text-white font-bold text-xs uppercase tracking-wider group-hover:text-primary-light transition-colors">{app.name}</h4>
                                                <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">{app.hackathon}</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-1">
                                            <span className={`flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider ${app.status === "Approved" ? "text-green-400" :
                                                    app.status === "Pending" ? "text-yellow-400" : "text-blue-400"
                                                }`}>
                                                {app.status === "Approved" ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                                                {app.status}
                                            </span>
                                            <span className="text-[10px] text-white/20 uppercase tracking-widest font-bold">{app.time}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Quick Tip */}
                        <div className="glass rounded-2xl p-5 border border-primary/20 bg-primary/5">
                            <h4 className="text-primary font-bold text-[10px] uppercase tracking-widest flex items-center gap-2 mb-2">
                                <AlertCircle className="w-4 h-4" />
                                Tactical Advisory
                            </h4>
                            <p className="text-[10px] text-white/60 uppercase tracking-widest font-medium leading-relaxed">
                                You have 12 pending applications for "Web3 Innovation Hack". Review them today to keep operatives engaged!
                            </p>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="glass rounded-2xl p-8 border border-white/5">
                    <h2 className="text-xl font-bold text-white mb-6 uppercase tracking-tight">Quick Actions</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <Link href="/hackathons" className="p-6 bg-white/[0.02] border border-white/5 hover:border-primary/20 hover:bg-white/5 rounded-xl text-left transition-all duration-300 group">
                            <Calendar className="w-8 h-8 text-primary mb-4 group-hover:scale-110 group-hover:drop-shadow-glow-sm transition-all" />
                            <p className="font-bold text-white mb-1 uppercase text-xs tracking-wider">Create Operation</p>
                            <p className="text-[10px] text-white/40 uppercase tracking-widest font-medium">Launch a new hackathon event</p>
                        </Link>
                        <Link href="/participants" className="p-6 bg-white/[0.02] border border-white/5 hover:border-primary/20 hover:bg-white/5 rounded-xl text-left transition-all duration-300 group">
                            <Users className="w-8 h-8 text-primary mb-4 group-hover:scale-110 group-hover:drop-shadow-glow-sm transition-all" />
                            <p className="font-bold text-white mb-1 uppercase text-xs tracking-wider">Review Applicants</p>
                            <p className="text-[10px] text-white/40 uppercase tracking-widest font-medium">Manage incoming applications</p>
                        </Link>
                        <Link href="/leaderboard" className="p-6 bg-white/[0.02] border border-white/5 hover:border-primary/20 hover:bg-white/5 rounded-xl text-left transition-all duration-300 group">
                            <Trophy className="w-8 h-8 text-primary mb-4 group-hover:scale-110 group-hover:drop-shadow-glow-sm transition-all" />
                            <p className="font-bold text-white mb-1 uppercase text-xs tracking-wider">View Rankings</p>
                            <p className="text-[10px] text-white/40 uppercase tracking-widest font-medium">Check leaderboard scores</p>
                        </Link>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
