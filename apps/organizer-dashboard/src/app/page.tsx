"use client";

import { useEffect, useState } from "react";
import OrganizerLayout from "@/components/OrganizerLayout";
import Link from "next/link";
import {
  Users,
  Calendar,
  Trophy,
  TrendingUp,
  Clock,
  ArrowUpRight,
  Plus,
  MoreVertical,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ChevronRight,
} from "lucide-react";
import api from "@takathon/shared/api";
import { toast } from "sonner";
import { SkeletonStatsRow, SkeletonHackathonCard } from "@takathon/shared/ui";
import { useAuthStore } from "@shared/utils";

export default function OverviewPage() {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [hackathons, setHackathons] = useState<any[]>([]);
  const [profileName, setProfileName] = useState(user?.fullName || "Organizer");

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      const [hackRes, profileRes] = await Promise.all([
        api
          .get("/api/v1/organizers/hackathons")
          .catch(() => ({ data: { data: [] } })),
        api.get("/api/v1/organizers/profile").catch(() => null),
      ]);
      setHackathons(hackRes.data.data || []);
      if (profileRes?.data?.data) {
        const p = profileRes.data.data;
        setProfileName(p.fullName || p.user?.fullName || user?.fullName || "Organizer");
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const activeHackathons = hackathons.filter((h: any) =>
    ["registration_open", "in_progress"].includes(h.status),
  );
  const totalParticipants = hackathons.reduce(
    (sum: number, h: any) => sum + (h._count?.participants || 0),
    0,
  );
  const totalTeams = hackathons.reduce(
    (sum: number, h: any) => sum + (h._count?.teams || 0),
    0,
  );

  const stats = [
    {
      name: "TOTAL OPERATIVES",
      value: String(totalParticipants),
      icon: Users,
    },
    {
      name: "ACTIVE OPERATIONS",
      value: String(activeHackathons.length),
      icon: Calendar,
    },
    {
      name: "SQUADS DEPLOYED",
      value: String(totalTeams),
      icon: Trophy,
    },
    {
      name: "TOTAL EVENTS",
      value: String(hackathons.length),
      icon: TrendingUp,
    },
  ];

  return (
    <OrganizerLayout>
      {loading ? (
        <div className="max-w-6xl mx-auto space-y-8 pb-12">
          <div className="space-y-2">
            <div className="h-12 w-96 bg-white/10 rounded animate-pulse" />
            <div className="h-4 w-64 bg-white/10 rounded animate-pulse" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-24 bg-white/5 rounded-sm animate-pulse" />
            ))}
          </div>
          <div className="h-40 bg-white/5 rounded-sm animate-pulse" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="h-8 w-48 bg-white/5 rounded animate-pulse" />
              <div className="h-48 bg-white/5 rounded-sm animate-pulse" />
            </div>
            <div className="space-y-4">
              <div className="h-8 w-48 bg-white/5 rounded animate-pulse" />
              <div className="h-32 bg-white/5 rounded-sm animate-pulse" />
              <div className="h-32 bg-white/5 rounded-sm animate-pulse" />
            </div>
          </div>
        </div>
      ) : (
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
                  WELCOME BACK, <span className="text-primary">{profileName.split(' ')[0] || 'COMMANDER'}!</span>
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
                  SYSTEM ONLINE • ORGANIZER COMMAND CENTER
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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

          {/* Authority Level Banner */}
          <div className="relative p-8 border border-primary/20 bg-[#080808] rounded-sm shadow-[0_0_15px_rgba(255,92,0,0.05)] overflow-hidden">
            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-primary"></div>
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-primary"></div>

            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-64 h-64 bg-primary/10 blur-[80px] rounded-full pointer-events-none"></div>

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <div>
                  <p className="text-[10px] text-primary font-bold uppercase tracking-widest mb-1">AUTHORITY LEVEL</p>
                  <p className="text-5xl font-black text-white italic tracking-tighter">GLOBAL ADMIN</p>
                </div>
                <div className="hidden sm:block border-l border-white/10 h-12 mx-2"></div>
                <div className="hidden sm:block">
                  <p className="text-sm font-bold text-white uppercase tracking-wider mb-1">SYSTEM OVERRIDE ENABLED</p>
                  <p className="text-[10px] text-white/40 uppercase tracking-widest">ALL REGIONS ACTIVE</p>
                </div>
              </div>

              <div className="flex-1 max-w-md w-full">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] text-white/60 font-bold uppercase tracking-widest">SERVER LOAD</span>
                  <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
                    <span className="text-primary text-glow">84%</span> CAPACITY
                  </span>
                </div>
                <div className="h-2.5 bg-white/5 rounded-sm overflow-hidden flex relative border border-white/10">
                  <div className="h-full bg-gradient-to-r from-primary/60 to-primary w-[84%] shadow-[0_0_10px_rgba(255,92,0,0.5)]"></div>
                </div>
              </div>

              <div className="hidden md:flex text-primary/20 ml-4">
                <Trophy className="w-16 h-16 drop-shadow-[0_0_15px_rgba(255,92,0,0.5)]" />
              </div>
            </div>
          </div>

          {/* Dual Column Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4">
            {/* Active Operations Column */}
            <div>
              <div className="flex items-baseline justify-between mb-6 pb-2 border-b border-white/5">
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 rotate-45 bg-primary mt-1.5" />
                  <h2 className="text-2xl font-black text-white tracking-tighter uppercase leading-none">
                    ACTIVE <span className="text-white/70">OPERATIONS</span>
                  </h2>
                </div>
                <Link href="/hackathons" className="text-[10px] font-bold text-primary flex items-center gap-1 uppercase tracking-widest hover:text-primary-light transition-colors group">
                  VIEW ALL <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              <div className="space-y-4">
                {activeHackathons.length === 0 ? (
                  <div className="relative p-8 bg-[#080808] border border-dashed border-white/10 rounded-sm text-center">
                    <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">NO ACTIVE OPERATIONS FOUND</p>
                    <Link href="/hackathons/create" className="mt-4 inline-block px-6 py-2 border border-primary text-primary text-[10px] font-bold uppercase tracking-widest hover:bg-primary hover:text-white transition-all">
                      INITIATE OPERATION
                    </Link>
                  </div>
                ) : (
                  activeHackathons.slice(0, 2).map((hackathon: any) => {
                    const progress = hackathon.status === 'registration_open' ? 30 : 75; // Mock progress based on status
                    return (
                      <div key={hackathon.id} className="relative p-6 bg-[#080808] border border-white/5 rounded-sm hover:border-white/10 transition-all group">
                        <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/20"></div>
                        <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r flex items-end justify-end group-hover:border-primary/50 transition-colors"></div>

                        <h3 className="text-lg font-black text-white italic tracking-tighter uppercase mb-2 line-clamp-2">{hackathon.title}</h3>

                        <div className="flex items-center gap-6 mb-6 mt-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-primary" />
                            <span className="text-[10px] text-white/60 font-bold uppercase tracking-widest">
                              {hackathon.startDate ? new Date(hackathon.startDate).toLocaleDateString() : 'TBD'}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-primary" />
                            <span className="text-[10px] text-white/60 font-bold uppercase tracking-widest">
                              {hackathon._count?.participants || 0} OPERATIVES
                            </span>
                          </div>
                        </div>

                        <div className="absolute top-6 right-6 flex items-center gap-2">
                          <div className="w-2 h-2 bg-primary mt-0.5 rounded-sm rotate-45" />
                          <span className={`text-[10px] font-bold tracking-widest uppercase ${hackathon.status === 'in_progress' ? 'text-green-500' : 'text-primary'}`}>
                            {hackathon.status.replace(/_/g, " ")}
                          </span>
                        </div>

                        <div className="mt-4 pt-3 border-t border-white/5">
                          <div className="flex justify-between text-[10px] uppercase tracking-widest font-bold mb-2">
                            <span className="text-white/40">MISSION PROGRESS</span>
                            <span className="text-white">{progress}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-white/5 rounded-sm overflow-hidden flex relative border border-white/10">
                            <div
                              className="h-full bg-gradient-to-r from-primary/60 to-primary shadow-[0_0_10px_rgba(255,92,0,0.5)]"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>

                        <div className="flex gap-4 mt-6">
                          <Link href={`/hackathons/${hackathon.id}`} className="flex-1 py-3 text-center text-[10px] font-bold tracking-widest uppercase bg-transparent text-white border border-white/20 hover:border-white/40 hover:bg-white/5 transition-all active:scale-[0.98] rounded-sm">
                            MANAGE
                          </Link>
                          <button onClick={() => toast.success('Accessing metrics...')} className="flex-1 py-3 text-center text-[10px] font-bold tracking-widest uppercase bg-primary text-white border border-primary hover:bg-primary-dark hover:shadow-[0_0_15px_rgba(255,92,0,0.4)] transition-all active:scale-[0.98] rounded-sm drop-shadow-md">
                            ANALYTICS
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Recent All Events Column (Merging with Recent Applications UI pattern) */}
            <div>
              <div className="flex items-baseline justify-between mb-6 pb-2 border-b border-white/5">
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 rotate-45 bg-primary mt-1.5" />
                  <h2 className="text-2xl font-black text-white tracking-tighter uppercase leading-none">
                    EVENT <span className="text-white/70">REGISTRY</span>
                  </h2>
                </div>
                <Link href="/hackathons" className="text-[10px] font-bold text-primary flex items-center gap-1 uppercase tracking-widest hover:text-primary-light transition-colors group">
                  VIEW ALL <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              <div className="space-y-4">
                {hackathons.length === 0 ? (
                  <div className="relative p-8 bg-[#080808] border border-dashed border-white/10 rounded-sm text-center">
                    <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">NO EVENTS REGISTERED</p>
                  </div>
                ) : (
                  hackathons.slice(0, 5).map((h: any) => (
                    <div key={h.id} className="relative p-5 bg-[#080808] border border-white/5 rounded-sm hover:border-white/10 transition-all group">
                      <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-white/10 group-hover:border-primary/50 transition-colors"></div>

                      <div className="flex items-start gap-4">
                        <div className="relative flex-shrink-0 mr-2">
                          <div className="w-10 h-10 rounded-full bg-black border-2 border-[#080808] flex items-center justify-center overflow-hidden shrink-0">
                            <span className="text-primary font-black text-xl italic">{h.title?.charAt(0)}</span>
                          </div>
                          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-primary rounded-sm transform rotate-45 border-2 border-[#080808] z-20 shadow-[0_0_10px_rgba(255,92,0,0.5)]" />
                        </div>

                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="text-sm font-black text-white tracking-wider uppercase mb-1 line-clamp-1">{h.title}</h3>
                              <p className="text-[10px] text-primary/80 font-bold uppercase tracking-widest">
                                {h._count?.participants || 0} OPERATIVES
                              </p>
                            </div>
                            <div className="text-right">
                              <span className={`text-[10px] font-bold uppercase tracking-widest ${
                                h.status === 'completed' ? 'text-green-500' : 
                                h.status === 'in_progress' ? 'text-blue-400' : 
                                h.status === 'registration_open' ? 'text-primary' : 'text-white/40'
                              }`}>
                                {h.status.replace(/_/g, " ")}
                              </span>
                            </div>
                          </div>

                          <div className="mt-4 pt-3 border-t border-white/5 flex items-center gap-2">
                            <div className={`w-0 h-0 border-t-4 border-b-4 border-l-6 border-transparent ${
                              h.status === 'completed' ? 'border-l-green-500' : 
                              h.status === 'in_progress' ? 'border-l-blue-400' : 
                              h.status === 'registration_open' ? 'border-l-primary' : 'border-l-white/40'
                            }`} />
                            <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest">
                              SIGNAL STATUS: {h.status === 'registration_open' ? 'ACTIVE' : h.status.toUpperCase()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </OrganizerLayout>
  );
}
