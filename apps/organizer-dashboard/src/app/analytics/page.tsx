"use client";

import DashboardLayout from "@/components/DashboardLayout";
import {
    BarChart3,
    TrendingUp,
    Users,
    Clock,
    Globe,
    ArrowUpRight,
    Activity,
    Target,
    Eye,
    Calendar
} from "lucide-react";

const overviewStats = [
    { label: "Total Registrations", value: "1,284", change: "+12%", icon: Users },
    { label: "Avg. Engagement", value: "84%", change: "+3%", icon: Activity },
    { label: "Page Views", value: "45.2K", change: "+28%", icon: Eye },
    { label: "Completion Rate", value: "72%", change: "+5%", icon: Target },
];

const monthlyData = [
    { month: "Sep", registrations: 120, engagement: 65 },
    { month: "Oct", registrations: 230, engagement: 72 },
    { month: "Nov", registrations: 410, engagement: 78 },
    { month: "Dec", registrations: 180, engagement: 68 },
    { month: "Jan", registrations: 540, engagement: 84 },
    { month: "Feb", registrations: 320, engagement: 80 },
];

const topCountries = [
    { name: "United States", participants: 324, percent: 25 },
    { name: "Tunisia", participants: 256, percent: 20 },
    { name: "Canada", participants: 192, percent: 15 },
    { name: "United Kingdom", participants: 128, percent: 10 },
    { name: "Germany", participants: 96, percent: 7.5 },
];

const recentActivity = [
    { action: "New registration", detail: "Alex Rivera joined AI Global Summit", time: "2 min ago" },
    { action: "Team formed", detail: "CyberSentinels reached full capacity", time: "15 min ago" },
    { action: "Submission", detail: "Neural Ninjas submitted project draft", time: "1 hour ago" },
    { action: "Milestone", detail: "Web3 Innovation Hack hit 200 registrations", time: "3 hours ago" },
];

export default function AnalyticsPage() {
    return (
        <DashboardLayout>
            <div className="space-y-8">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-white uppercase tracking-tight">Intel Dashboard</h1>
                    <div className="flex items-center gap-2 mt-2">
                        <div className="w-1.5 h-1.5 bg-primary animate-pulse rounded-full" />
                        <span className="text-[10px] text-white/40 uppercase tracking-[0.2em] font-bold">
                            Event analytics and performance intelligence
                        </span>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {overviewStats.map((stat) => {
                        const Icon = stat.icon;
                        return (
                            <div key={stat.label} className="glass rounded-xl p-5 border border-white/5 hover:border-primary/20 transition-all duration-300 group">
                                <div className="flex items-center justify-between mb-3">
                                    <Icon className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-green-400 bg-green-500/10 px-2 py-0.5 rounded-sm">
                                        <ArrowUpRight className="w-3 h-3 inline" /> {stat.change}
                                    </span>
                                </div>
                                <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold mb-1">{stat.label}</p>
                                <p className="text-2xl font-bold text-white">{stat.value}</p>
                            </div>
                        );
                    })}
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Registration Trend */}
                    <div className="glass rounded-xl p-6 border border-white/5">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-sm font-bold text-white flex items-center gap-2 uppercase tracking-widest">
                                <BarChart3 className="w-4 h-4 text-primary" />
                                Registration Trend
                            </h2>
                            <select className="bg-black border border-white/5 text-[10px] text-white/40 px-2 py-1 outline-none uppercase tracking-widest font-bold">
                                <option>Last 6 Months</option>
                                <option>This Year</option>
                            </select>
                        </div>
                        <div className="h-48 flex items-end justify-between gap-2 px-2">
                            {monthlyData.map((data, i) => (
                                <div key={i} className="flex-1 space-y-2">
                                    <div
                                        className="w-full bg-primary/20 hover:bg-primary/40 rounded-t transition-all duration-300 relative group"
                                        style={{ height: `${(data.registrations / 540) * 100}%` }}
                                    >
                                        <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-white text-dark text-[8px] font-bold px-1.5 py-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                            {data.registrations}
                                        </div>
                                    </div>
                                    <p className="text-[8px] text-center text-white/30 uppercase tracking-widest font-bold">{data.month}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Geographic Distribution */}
                    <div className="glass rounded-xl p-6 border border-white/5">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-sm font-bold text-white flex items-center gap-2 uppercase tracking-widest">
                                <Globe className="w-4 h-4 text-primary" />
                                Geographic Intel
                            </h2>
                        </div>
                        <div className="space-y-5">
                            {topCountries.map((country) => (
                                <div key={country.name} className="space-y-2">
                                    <div className="flex justify-between text-[10px] uppercase tracking-widest font-bold">
                                        <span className="text-white/60">{country.name}</span>
                                        <span className="text-white">{country.participants} operatives ({country.percent}%)</span>
                                    </div>
                                    <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                                        <div className="bg-primary h-full rounded-full shadow-[0_0_8px_rgba(255,92,0,0.3)]" style={{ width: `${country.percent * 4}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Activity Feed */}
                <div className="glass rounded-xl overflow-hidden border border-white/5">
                    <div className="px-6 py-4 border-b border-white/5 bg-white/[0.02]">
                        <h2 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
                            <Clock className="w-4 h-4 text-primary" />
                            Live Activity Feed
                        </h2>
                    </div>
                    <div className="divide-y divide-white/5">
                        {recentActivity.map((activity, i) => (
                            <div key={i} className="px-6 py-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                                    <div>
                                        <p className="text-white font-bold text-xs uppercase tracking-wider">{activity.action}</p>
                                        <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">{activity.detail}</p>
                                    </div>
                                </div>
                                <span className="text-[10px] text-white/30 uppercase tracking-widest font-bold whitespace-nowrap">{activity.time}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
