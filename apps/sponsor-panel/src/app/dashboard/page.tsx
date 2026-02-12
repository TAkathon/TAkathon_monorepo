"use client";

import DashboardLayout from "@/components/DashboardLayout";
import { 
    Users, 
    Calendar, 
    Clock, 
    TrendingUp,
    ChevronRight,
    Target
} from "lucide-react";

const stats = [
    {
        name: "Total Sponsored Events",
        value: "12",
        change: "+2",
        changeType: "increase",
        icon: Calendar,
    },
    {
        name: "Active Sponsorships",
        value: "5",
        change: "0",
        changeType: "neutral",
        icon: Target,
    },
    {
        name: "Pending Requests",
        value: "8",
        change: "+3",
        changeType: "increase",
        icon: Clock,
    },
    {
        name: "Engagement Metrics",
        value: "24.5k",
        change: "+12%",
        changeType: "increase",
        icon: TrendingUp,
    },
];

const quickActions = [
    {
        title: "Find Events",
        description: "Browse upcoming hackathons looking for sponsors.",
        icon: Target,
        href: "/dashboard/opportunities",
        color: "bg-primary/10 text-primary",
    },
    {
        title: "Review Requests",
        description: "Check sponsorship requests from organizers.",
        icon: Users,
        href: "/dashboard/requests",
        color: "bg-blue-500/10 text-blue-500",
    },
];

export default function SponsorDashboard() {
    return (
        <DashboardLayout>
            <div className="space-y-8">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Sponsor Dashboard</h1>
                    <p className="text-white/60">Welcome back! Here's an overview of your sponsorship activities.</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat) => {
                        const Icon = stat.icon;
                        return (
                            <div key={stat.name} className="glass p-6 rounded-2xl hover:border-primary/30 transition-all duration-300">
                                <div className="flex items-start justify-between">
                                    <div className={`p-3 rounded-xl bg-white/5`}>
                                        <Icon className="w-6 h-6 text-primary" />
                                    </div>
                                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                                        stat.changeType === "increase" ? "bg-green-500/10 text-green-500" : "bg-white/10 text-white/60"
                                    }`}>
                                        {stat.change}
                                    </span>
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
                    {/* Recent Activity / Notifications */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="glass rounded-2xl p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-white">Recent Sponsorship Performance</h2>
                                <button className="text-sm text-primary hover:text-primary-light transition-colors">View All</button>
                            </div>
                            <div className="space-y-4">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                                                T
                                            </div>
                                            <div>
                                                <h4 className="text-white font-medium">TechNova Hackathon 2024</h4>
                                                <p className="text-xs text-white/40">Sponsorship Tier: Platinum • 2 days ago</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm text-white font-medium">1.2k Reach</p>
                                            <p className="text-xs text-green-500">+15% vs target</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="space-y-6">
                        <h2 className="text-xl font-bold text-white">Quick Actions</h2>
                        <div className="space-y-4">
                            {quickActions.map((action) => {
                                const Icon = action.icon;
                                return (
                                    <a
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
                                    </a>
                                );
                            })}
                        </div>

                        {/* Summary Card */}
                        <div className="glass rounded-2xl p-6 bg-gradient-to-br from-primary/10 to-transparent border-primary/20">
                            <h3 className="text-white font-bold mb-2">Remaining Budget</h3>
                            <div className="flex items-end gap-2 mb-4">
                                <span className="text-3xl font-bold text-white">$45,000</span>
                                <span className="text-sm text-white/40 mb-1">/ $100k</span>
                            </div>
                            <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                                <div className="bg-primary h-full rounded-full" style={{ width: "45%" }} />
                            </div>
                            <p className="text-xs text-white/40 mt-3">Next budget refresh in 42 days</p>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
