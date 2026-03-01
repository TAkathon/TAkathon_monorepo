"use client";

import DashboardLayout from "@/components/DashboardLayout";
import { Trophy, Lock, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function LeaderboardPage() {
    return (
        <DashboardLayout>
            <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
                {/* Icon stack */}
                <div className="relative mb-8">
                    <div className="w-28 h-28 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                        <Trophy className="w-14 h-14 text-primary/50" />
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                        <Lock className="w-5 h-5 text-white/40" />
                    </div>
                </div>

                {/* Text */}
                <h1 className="text-4xl font-bold text-white mb-3">Leaderboard</h1>
                <p className="text-lg text-white/40 mb-2">Currently unavailable</p>
                <p className="text-sm text-white/30 max-w-sm leading-relaxed mb-8">
                    Rankings will appear here once a hackathon is in progress and teams have submitted their projects.
                </p>

                {/* Pill badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/20 text-primary/70 text-xs font-medium tracking-wide uppercase mb-10">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-pulse" />
                    Coming soon
                </div>

                <Link href="/">
                    <button className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white/70 hover:text-white transition-all text-sm font-medium">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Overview
                    </button>
                </Link>
            </div>
        </DashboardLayout>
    );
}
