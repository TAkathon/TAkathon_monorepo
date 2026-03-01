"use client";

import DashboardLayout from "@/components/DashboardLayout";
import { BarChart3, Lock, ArrowLeft, TrendingUp, Users, Calendar } from "lucide-react";
import Link from "next/link";

const placeholderStats = [
    { label: "Total Participants", value: "—", icon: Users },
    { label: "Active Hackathons", value: "—", icon: Calendar },
    { label: "Avg. Team Size", value: "—", icon: TrendingUp },
];

export default function AnalyticsPage() {
    return (
        <DashboardLayout>
            <div className="space-y-8">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-white">Analytics</h1>
                    <p className="text-white/40 mt-1">Performance insights across your events</p>
                </div>

                {/* Placeholder stat cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {placeholderStats.map(({ label, value, icon: Icon }) => (
                        <div
                            key={label}
                            className="glass rounded-xl p-6 border border-white/5 flex items-center gap-4 opacity-40 select-none"
                        >
                            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                <Icon className="w-6 h-6 text-primary/60" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-white">{value}</p>
                                <p className="text-xs text-white/50 mt-0.5">{label}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Main unavailable panel */}
                <div className="glass rounded-2xl border border-white/5 flex flex-col items-center justify-center py-24 text-center px-4">
                    {/* Icon stack */}
                    <div className="relative mb-8">
                        <div className="w-28 h-28 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                            <BarChart3 className="w-14 h-14 text-primary/50" />
                        </div>
                        <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                            <Lock className="w-5 h-5 text-white/40" />
                        </div>
                    </div>

                    <h2 className="text-2xl font-bold text-white mb-2">Stats Currently Unavailable</h2>
                    <p className="text-white/40 max-w-md leading-relaxed mb-8">
                        Detailed analytics will appear here after your first hackathon is published and participants begin registering.
                    </p>

                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/20 text-primary/70 text-xs font-medium tracking-wide uppercase mb-10">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-pulse" />
                        Coming soon
                    </div>

                    <Link href="/hackathons/create">
                        <button className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary/10 hover:bg-primary/20 border border-primary/20 text-primary transition-all text-sm font-medium">
                            <Calendar className="w-4 h-4" />
                            Create your first hackathon
                        </button>
                    </Link>
                </div>

                {/* Back link */}
                <Link href="/" className="inline-flex items-center gap-2 text-white/40 hover:text-white/70 transition-colors text-sm">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Overview
                </Link>
            </div>
        </DashboardLayout>
    );
}
