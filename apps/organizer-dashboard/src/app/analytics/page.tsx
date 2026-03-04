"use client";

import OrganizerLayout from "@/components/OrganizerLayout";
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
    { label: "TOTAL REGISTRATIONS", value: "1,284", change: "+12%", icon: Users },
    { label: "AVG. ENGAGEMENT", value: "84%", change: "+3%", icon: Activity },
    { label: "PAGE VIEWS", value: "45.2K", change: "+28%", icon: Eye },
    { label: "COMPLETION RATE", value: "72%", change: "+5%", icon: Target },
];

const monthlyData = [
    { month: "SEP", registrations: 120, engagement: 65 },
    { month: "OCT", registrations: 230, engagement: 72 },
    { month: "NOV", registrations: 410, engagement: 78 },
    { month: "DEC", registrations: 180, engagement: 68 },
    { month: "JAN", registrations: 540, engagement: 84 },
    { month: "FEB", registrations: 320, engagement: 80 },
];

const topCountries = [
    { name: "UNITED STATES", participants: 324, percent: 25 },
    { name: "TUNISIA", participants: 256, percent: 20 },
    { name: "CANADA", participants: 192, percent: 15 },
    { name: "UNITED KINGDOM", participants: 128, percent: 10 },
    { name: "GERMANY", participants: 96, percent: 7.5 },
];

const recentActivity = [
    { action: "NEW REGISTRATION", detail: "ALEX RIVERA JOINED AI GLOBAL SUMMIT", time: "2 MIN AGO" },
    { action: "TEAM FORMED", detail: "CYBERSENTINELS REACHED FULL CAPACITY", time: "15 MIN AGO" },
    { action: "SUBMISSION", detail: "NEURAL NINJAS SUBMITTED PROJECT DRAFT", time: "1 HOUR AGO" },
    { action: "MILESTONE", detail: "WEB3 INNOVATION HACK HIT 200 REGISTRATIONS", time: "3 HOURS AGO" },
];

export default function AnalyticsPage() {
    return (
        <OrganizerLayout>
            <div className="max-w-6xl mx-auto space-y-8 pb-12">
                {/* Background Floating Objects */}
                <div className="absolute top-20 left-10 w-32 h-32 bg-primary/20 rounded-full blur-[80px] pointer-events-none"></div>

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div>
                        <div className="flex items-center relative mb-1">
                            <h1 className="text-5xl md:text-6xl font-black italic tracking-tighter uppercase text-white">
                                <span className="text-white">INTEL DASHBOARD</span>
                            </h1>
                            <div className="flex ml-4 gap-1 opacity-60 mt-2">
                                <div className="w-8 h-1 bg-primary"></div>
                                <div className="w-2 h-1 bg-primary"></div>
                                <div className="w-1 h-1 bg-primary"></div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 mt-4 mb-2">
                            <div className="w-2 h-2 bg-green-500 rounded-sm" />
                            <span className="text-[10px] text-white/60 uppercase tracking-[0.2em] font-bold">
                                EVENT ANALYTICS AND PERFORMANCE INTELLIGENCE
                            </span>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {overviewStats.map((stat) => {
                        const Icon = stat.icon;
                        return (
                            <div key={stat.label} className="relative p-6 border border-white/5 bg-[#080808] rounded-sm group hover:border-white/10 transition-all duration-300">
                                <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-primary opacity-50 group-hover:opacity-100 transition-opacity"></div>
                                <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-primary opacity-50 group-hover:opacity-100 transition-opacity"></div>

                                <div className="flex items-center justify-between mb-4">
                                    <Icon className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#050505] bg-primary px-2 py-0.5 rounded-sm shadow-[0_0_10px_rgba(255,92,0,0.3)]">
                                        <ArrowUpRight className="w-3 h-3 inline" /> {stat.change}
                                    </span>
                                </div>
                                <p className="text-[10px] text-white/50 uppercase tracking-widest font-bold mb-1">{stat.label}</p>
                                <p className="text-3xl font-black text-white tracking-tighter">{stat.value}</p>
                            </div>
                        );
                    })}
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Registration Trend */}
                    <div className="relative p-8 border border-white/5 bg-[#080808] rounded-sm group hover:border-white/10 transition-all duration-300">
                        <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
                            <h2 className="text-xl font-black italic tracking-tighter text-white flex items-center gap-2 uppercase">
                                <BarChart3 className="w-5 h-5 text-primary" />
                                REGISTRATION TREND
                            </h2>
                            <select className="bg-[#050505] border border-white/10 text-[10px] text-white px-3 py-1.5 outline-none uppercase tracking-widest font-bold rounded-sm cursor-pointer hover:border-primary/50 transition-colors">
                                <option>LAST 6 MONTHS</option>
                                <option>THIS YEAR</option>
                            </select>
                        </div>
                        <div className="h-48 flex items-end justify-between gap-3 px-2">
                            {monthlyData.map((data, i) => (
                                <div key={i} className="flex-1 space-y-3">
                                    <div
                                        className="w-full bg-primary/20 hover:bg-primary/40 transition-all duration-300 relative group border-t border-primary/50 rounded-t-sm"
                                        style={{ height: `${(data.registrations / 540) * 100}%` }}
                                    >
                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-dark text-[10px] font-bold px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap rounded-sm shadow-[0_0_10px_rgba(255,255,255,0.2)]">
                                            {data.registrations} RECRUITS
                                        </div>
                                    </div>
                                    <p className="text-[10px] text-center text-white/40 uppercase tracking-widest font-bold">{data.month}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Geographic Distribution */}
                    <div className="relative p-8 border border-white/5 bg-[#080808] rounded-sm group hover:border-white/10 transition-all duration-300">
                        <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
                            <h2 className="text-xl font-black italic tracking-tighter text-white flex items-center gap-2 uppercase">
                                <Globe className="w-5 h-5 text-primary" />
                                GEOGRAPHIC INTEL
                            </h2>
                        </div>
                        <div className="space-y-6">
                            {topCountries.map((country) => (
                                <div key={country.name} className="space-y-2">
                                    <div className="flex justify-between text-[10px] uppercase tracking-widest font-bold">
                                        <span className="text-white/80">{country.name}</span>
                                        <span className="text-white/40">{country.participants} OPERATIVES <span className="text-primary">({country.percent}%)</span></span>
                                    </div>
                                    <div className="w-full bg-[#050505] h-2 rounded-sm overflow-hidden border border-white/5">
                                        <div className="bg-gradient-to-r from-primary/60 to-primary h-full shadow-[0_0_8px_rgba(255,92,0,0.5)]" style={{ width: `${country.percent * 4}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Activity Feed */}
                <div className="relative border border-white/5 bg-[#080808] rounded-sm transition-all duration-300 overflow-hidden">
                    <div className="px-8 py-6 border-b border-white/5 bg-white/[0.02]">
                        <h2 className="text-xl font-black italic tracking-tighter text-white uppercase flex items-center gap-2">
                            <Clock className="w-5 h-5 text-primary" />
                            LIVE ACTIVITY FEED
                        </h2>
                    </div>
                    <div className="divide-y divide-white/5">
                        {recentActivity.map((activity, i) => (
                            <div key={i} className="px-8 py-5 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                                <div className="flex items-center gap-6">
                                    <div className="w-2 h-2 bg-primary rounded-sm animate-pulse shadow-[0_0_8px_rgba(255,92,0,0.5)] rotate-45" />
                                    <div>
                                        <p className="text-white font-black italic uppercase tracking-wider text-sm">{activity.action}</p>
                                        <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold mt-1">{activity.detail}</p>
                                    </div>
                                </div>
                                <span className="text-[10px] text-primary/60 uppercase tracking-widest font-bold whitespace-nowrap">{activity.time}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </OrganizerLayout>
    );
}
