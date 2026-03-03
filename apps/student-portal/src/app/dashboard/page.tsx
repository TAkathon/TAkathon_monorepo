"use client";

import Link from "next/link";
import DashboardLayout from "@/components/DashboardLayout";
import { Calendar, Users, Trophy, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@shared/utils";

const stats = [
    { name: "HACKATHONS JOINED", value: "3", icon: Calendar },
    { name: "ACTIVE TEAMS", value: "2", icon: Users },
    { name: "COMPLETED PROJECTS", value: "5", icon: Trophy },
];

const myTeams = [
    {
        id: 1,
        name: "CODE WIZARDS",
        hackathon: "AI INNOVATORS CHALLENGE",
        members: 4,
        maxMembers: 5,
        status: "LOOKING FOR 1 MORE",
        statusColor: "text-primary",
        teamMembers: ["John", "Jane", "Mike", "Sarah"],
    },
    {
        id: 2,
        name: "TECH TITANS",
        hackathon: "PAST EVENT",
        members: 5,
        maxMembers: 5,
        status: "PROJECT SUBMITTED",
        statusColor: "text-green-500",
        teamMembers: ["Alex", "Sam", "Chris", "Taylor", "Jordan"],
    },
];

export default function DashboardPage() {
    const { user } = useAuthStore();
    return (
        <DashboardLayout>
            <div className="max-w-6xl mx-auto space-y-8 pb-12">
                {/* Background Floating Objects */}
                <div className="absolute top-20 right-10 w-32 h-32 bg-primary/20 rounded-full blur-[80px] pointer-events-none"></div>
                <div className="absolute top-40 left-10 w-24 h-24 bg-blue-500/20 rounded-full blur-[60px] pointer-events-none"></div>
                <div className="absolute -top-10 right-1/3 w-40 h-40 bg-purple-500/20 rounded-full blur-[100px] pointer-events-none"></div>

                {/* Header section */}
                <div className="flex items-start justify-between">
                    <div>
                        <div className="flex items-center relative mb-1">
                            <h1 className="text-5xl md:text-6xl font-black italic tracking-tighter uppercase text-white">
                                WELCOME BACK, <span className="text-primary">{user?.fullName?.split(' ')[0] || 'JOHN'}!</span>
                            </h1>
                            <div className="flex ml-4 gap-1 opacity-60">
                                <div className="w-8 h-1 bg-primary"></div>
                                <div className="w-2 h-1 bg-primary"></div>
                                <div className="w-1 h-1 bg-primary"></div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 mt-4 mb-2">
                            <div className="w-2 h-2 bg-green-500 rounded-sm" />
                            <span className="text-[10px] text-white/60 uppercase tracking-[0.2em] font-bold">
                                IT'S BEEN 3 WEEKS SINCE YOUR LAST HACKATHON
                            </span>
                        </div>
                    </div>
                    {/* Waving Image */}
                    <div className="hidden md:block w-32 h-32 relative shrink-0">
                        <img src="/waving.png" alt="Waving Hand" className="w-full h-full object-contain -scale-x-100" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] to-transparent pointer-events-none"></div>
                    </div>
                </div>

                {/* Top Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {stats.map((stat) => {
                        const Icon = stat.icon;
                        return (
                            <div key={stat.name} className="relative p-6 border border-white/5 bg-black rounded-sm">
                                {/* Corner accents */}
                                <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-primary"></div>
                                <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-primary"></div>

                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-[10px] text-white/50 font-bold uppercase tracking-widest mb-3">
                                            {stat.name}
                                        </p>
                                        <p className="text-4xl font-black text-white tracking-tighter">{stat.value}</p>
                                    </div>
                                    <div className="w-10 h-10 bg-white/5 border border-white/10 flex items-center justify-center rounded-sm">
                                        <Icon className="w-4 h-4 text-primary" />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Level / Rank Banner */}
                <div className="relative p-8 border border-primary/20 bg-[#080808] rounded-sm shadow-[0_0_15px_rgba(255,92,0,0.05)] overflow-hidden">
                    <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-primary"></div>
                    <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-primary"></div>

                    {/* Background glow for rank banner */}
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-64 h-64 bg-primary/10 blur-[80px] rounded-full pointer-events-none"></div>

                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-center gap-6">
                            <div>
                                <p className="text-[10px] text-primary font-bold uppercase tracking-widest mb-1">CURRENT RANK</p>
                                <p className="text-5xl font-black text-white italic tracking-tighter">LEVEL 5</p>
                            </div>
                            <div className="hidden sm:block border-l border-white/10 h-12 mx-2"></div>
                            <div className="hidden sm:block">
                                <p className="text-sm font-bold text-white uppercase tracking-wider mb-1">ELITE DEVELOPER</p>
                                <p className="text-[10px] text-white/40 uppercase tracking-widest">NEXT RANK: CODE MASTER</p>
                            </div>
                        </div>

                        <div className="flex-1 max-w-md w-full">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-[10px] text-white/60 font-bold uppercase tracking-widest">XP PROGRESS</span>
                                <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
                                    <span className="text-primary text-glow">2450</span> / 3000 XP
                                </span>
                            </div>
                            <div className="h-2.5 bg-white/5 rounded-sm overflow-hidden flex relative border border-white/10">
                                <div className="h-full bg-gradient-to-r from-primary/60 to-primary w-[81%] shadow-[0_0_10px_rgba(255,92,0,0.5)]"></div>
                            </div>
                        </div>

                        <div className="hidden md:flex text-primary/20 ml-4">
                            <Trophy className="w-16 h-16 drop-shadow-[0_0_15px_rgba(255,92,0,0.5)]" />
                        </div>
                    </div>
                </div>

                {/* Dual Column Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4">
                    {/* Hackathons Column */}
                    <div>
                        <div className="flex items-baseline justify-between mb-6 pb-2 border-b border-white/5">
                            <div className="flex items-start gap-2">
                                <div className="w-2 h-2 rotate-45 bg-primary mt-1.5" />
                                <h2 className="text-2xl font-black text-white tracking-tighter uppercase leading-none">
                                    REGISTERED<br /><span className="text-white/70">HACKATHONS</span>
                                </h2>
                            </div>
                            <Link href="/dashboard/hackathons" className="text-[10px] font-bold text-primary flex items-center gap-1 uppercase tracking-widest hover:text-primary-light transition-colors group">
                                VIEW ALL <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>

                        <div className="relative p-6 bg-[#080808] border border-white/5 rounded-sm">
                            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/20"></div>
                            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r flex items-end justify-end">
                                <div className="w-3 h-3 bg-white/5"></div>
                            </div>

                            <h3 className="text-lg font-black text-white italic tracking-tighter uppercase mb-2">AI INNOVATORS<br />CHALLENGE</h3>
                            <p className="text-xs text-white/50 mb-6">Build the future of generative AI.</p>

                            <div className="flex items-center gap-6 mb-8 mt-4">
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-primary" />
                                    <span className="text-[10px] text-white/60 font-bold uppercase tracking-widest">MAR 15-17</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Users className="w-4 h-4 text-primary" />
                                    <span className="text-[10px] text-white/60 font-bold uppercase tracking-widest">120 PARTICIPANTS</span>
                                </div>
                            </div>

                            <div className="absolute top-6 right-6 px-3 py-1 bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold tracking-widest uppercase rounded-sm">
                                REGISTERED
                            </div>

                            <div className="flex gap-4">
                                <button onClick={() => toast.loading('Loading details...')} className="flex-1 py-3 text-[10px] font-bold tracking-widest uppercase bg-transparent text-white border border-white/20 hover:border-white/40 hover:bg-white/5 transition-all active:scale-[0.98] rounded-sm">
                                    VIEW DETAILS
                                </button>
                                <button onClick={() => toast.success('Accessing Hackathon Hub...')} className="flex-1 py-3 text-[10px] font-bold tracking-widest uppercase bg-primary text-white border border-primary hover:bg-primary-dark hover:shadow-[0_0_15px_rgba(255,92,0,0.4)] transition-all active:scale-[0.98] rounded-sm drop-shadow-md">
                                    ACCESS HUB
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Teams Column */}
                    <div>
                        <div className="flex items-baseline justify-between mb-6 pb-2 border-b border-white/5">
                            <div className="flex items-start gap-2">
                                <div className="w-2 h-2 rotate-45 bg-primary mt-1.5" />
                                <h2 className="text-2xl font-black text-white tracking-tighter uppercase leading-none">
                                    MY <span className="text-white/70">TEAMS</span>
                                </h2>
                            </div>
                            <Link href="/dashboard/teams" className="text-[10px] font-bold text-primary flex items-center gap-1 uppercase tracking-widest hover:text-primary-light transition-colors group">
                                VIEW ALL <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>

                        <div className="space-y-4">
                            {myTeams.map((team) => (
                                <div key={team.id} className="relative p-5 bg-[#080808] border border-white/5 rounded-sm hover:border-white/10 transition-all group">
                                    {/* Corner tick */}
                                    <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-white/10 group-hover:border-primary/50 transition-colors"></div>

                                    <div className="flex items-start gap-4">
                                        <div className="relative flex-shrink-0 mr-2">
                                            <div className="flex -space-x-3">
                                                {team.teamMembers.slice(0, 3).map((member, idx) => (
                                                    <div
                                                        key={idx}
                                                        className="w-10 h-10 rounded-full bg-black border-2 border-[#080808] flex items-center justify-center overflow-hidden shrink-0"
                                                        style={{ zIndex: 10 - idx }}
                                                    >
                                                        <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${member}&backgroundColor=transparent`} alt={member} className="w-full h-full object-cover opacity-80" />
                                                    </div>
                                                ))}
                                                {team.teamMembers.length > 3 && (
                                                    <div
                                                        className="w-10 h-10 rounded-full bg-white/5 border-2 border-[#080808] flex items-center justify-center shrink-0"
                                                        style={{ zIndex: 0 }}
                                                    >
                                                        <span className="text-[10px] font-bold text-white/70">+{team.teamMembers.length - 3}</span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-primary rounded-sm transform rotate-45 border-2 border-[#080808] z-20 shadow-[0_0_10px_rgba(255,92,0,0.5)]" />
                                        </div>

                                        <div className="flex-1">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <h3 className="text-sm font-black text-white tracking-wider uppercase mb-1">{team.name}</h3>
                                                    <p className="text-[10px] text-primary/80 font-bold uppercase tracking-widest">{team.hackathon}</p>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-[10px] text-white/60 font-bold uppercase tracking-widest mb-1.5">
                                                        {team.members}/{team.maxMembers} OPERATIVES
                                                    </div>
                                                    <div className="flex items-center gap-0.5 mt-1 justify-end">
                                                        {[...Array(team.maxMembers)].map((_, i) => (
                                                            <div
                                                                key={i}
                                                                className={`w-4 h-1.5 rounded-sm ${i < team.members ? "bg-primary" : "bg-white/10"}`}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mt-4 pt-3 border-t border-white/5 flex items-center gap-2">
                                                {team.statusColor === 'text-primary' ? (
                                                    <div className="w-0 h-0 border-t-4 border-b-4 border-l-6 border-transparent border-l-primary" />
                                                ) : (
                                                    <div className="w-0 h-0 border-t-4 border-b-4 border-l-6 border-transparent border-l-green-500" />
                                                )}
                                                <span className={`text-[10px] font-bold uppercase tracking-widest ${team.statusColor}`}>
                                                    {team.status}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
