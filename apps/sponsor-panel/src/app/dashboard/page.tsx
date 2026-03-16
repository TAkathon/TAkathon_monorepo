"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import {
  Calendar,
  DollarSign,
  TrendingUp,
  ArrowUpRight,
  Clock,
  Trophy,
  Users,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Target,
  Loader2,
  BarChart3
} from "lucide-react";
import api from "@takathon/shared/api";
import { toast } from "sonner";
import { SkeletonStatsRow } from "@takathon/shared/ui";
import Link from "next/link";
import { useAuthStore } from "@shared/utils";

export default function SponsorDashboard() {
  const { user } = useAuthStore();
  const [profile, setProfile] = useState<any>(null);
  const [sponsorships, setSponsorships] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [profileRes, sponsorshipsRes] = await Promise.all([
        api.get("/api/v1/sponsors/profile").catch(() => ({ data: { data: null } })),
        api.get("/api/v1/sponsors/hackathons/sponsorships").catch(() => ({ data: { data: [] } })),
      ]);
      setProfile(profileRes.data.data);
      const sps = sponsorshipsRes.data.data?.sponsorships || sponsorshipsRes.data.data || [];
      setSponsorships(Array.isArray(sps) ? sps : []);
    } catch {
      toast.error("DATA SYNCHRONIZATION FAILED");
    } finally {
      setLoading(false);
    }
  };

  const activeSponsorships = sponsorships.filter((s: any) => (s.status || "").toLowerCase() === "active");
  const pendingSponsorships = sponsorships.filter((s: any) => (s.status || "").toLowerCase() === "pending");
  const totalAmount = sponsorships.reduce((sum: number, s: any) => sum + (Number(s.amount) || 0), 0);

  const stats = [
    { 
      name: "Sponsored Events", 
      value: sponsorships.length.toString(), 
      change: sponsorships.length > 0 ? "+100%" : "0", 
      icon: Calendar 
    },
    { 
      name: "Total Investment", 
      value: `$${(totalAmount / 1000).toFixed(1)}K`, 
      change: totalAmount > 0 ? "+12%" : "0", 
      icon: DollarSign 
    },
    { 
      name: "Active Sponsorships", 
      value: activeSponsorships.length.toString(), 
      change: "0", 
      icon: Trophy 
    },
    { 
      name: "Brand Impressions", 
      value: "45.2K", 
      change: "+28%", 
      icon: TrendingUp 
    },
  ];

  const companyName = profile?.companyName || profile?.user?.fullName || user?.fullName || "SPONSOR";

  if (loading) {
     return (
        <DashboardLayout>
            <div className="py-20 flex flex-col items-center justify-center gap-4">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
                <span className="text-[10px] font-black text-white/20 uppercase tracking-[.3em]">SYNCHRONIZING INTEL...</span>
            </div>
        </DashboardLayout>
     );
  }

  return (
    <DashboardLayout>
      <div className="space-y-10 max-w-6xl mx-auto pb-12">
        {/* Welcome */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
                <h1 className="text-5xl md:text-6xl font-black italic tracking-tighter uppercase text-white mb-2">
                    WELCOME BACK, <span className="text-primary">{companyName.split(' ')[0]}!</span>
                </h1>
                <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-primary animate-pulse rounded-full shadow-glow-sm" />
                    <span className="text-[10px] text-white/40 uppercase tracking-[0.2em] font-bold">
                        SYSTEM ONLINE • SPONSOR COMMAND CENTER
                    </span>
                </div>
            </div>
            
            <div className="flex gap-1 opacity-40">
                <div className="w-12 h-1 bg-primary"></div>
                <div className="w-2 h-1 bg-primary"></div>
                <div className="w-1 h-1 bg-primary"></div>
            </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                    <div key={stat.name} className="relative p-6 border border-white/5 bg-[#080808] rounded-sm hover:border-primary/30 transition-all duration-300 group overflow-hidden">
                        <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-primary/40 group-hover:border-primary"></div>
                        <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-primary/40 group-hover:border-primary"></div>

                        <div className="flex items-center justify-between mb-4">
                            <div className="p-2 bg-white/5 border border-white/10 rounded-sm">
                                <Icon className="w-5 h-5 text-primary" />
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 bg-green-500/10 text-green-400 rounded-sm">
                                <ArrowUpRight className="w-3 h-3 inline mr-0.5" />
                                {stat.change}
                            </span>
                        </div>
                        <p className="text-white/40 text-[10px] uppercase tracking-widest font-black mb-1">{stat.name}</p>
                        <p className="text-4xl font-black text-white tracking-tighter italic">{stat.value}</p>
                    </div>
                );
            })}
        </div>

        {/* Dual Column Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Performance Intel */}
            <div className="lg:col-span-2 space-y-4">
                <div className="flex items-baseline justify-between mb-2">
                    <h2 className="text-2xl font-black text-white tracking-tighter uppercase leading-none">
                        SPONSORSHIP <span className="text-white/70">INTEL</span>
                    </h2>
                    <Link href="/dashboard/requests" className="text-[10px] font-bold text-primary flex items-center gap-1 uppercase tracking-widest hover:text-primary-light transition-colors group">
                        FULL REGISTRY <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                <div className="relative bg-[#080808] border border-white/5 rounded-sm overflow-hidden">
                    {sponsorships.length === 0 ? (
                        <div className="p-16 text-center">
                            <BarChart3 className="w-12 h-12 text-white/10 mx-auto mb-4" />
                            <p className="text-xs font-black text-white/30 uppercase tracking-[0.2em]">NO MISSION DATA DETECTED</p>
                            <Link href="/dashboard/opportunities" className="mt-6 inline-block px-8 py-3 bg-primary text-white text-[10px] font-black uppercase tracking-widest hover:bg-primary-dark transition-all rounded-sm">
                                DISCOVER OPS
                            </Link>
                        </div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/5 bg-white/[0.02]">
                                    <th className="px-6 py-4 text-[9px] font-black text-white/30 uppercase tracking-[0.2em]">MISSION</th>
                                    <th className="px-6 py-4 text-[9px] font-black text-white/30 uppercase tracking-[0.2em]">BOUNTY</th>
                                    <th className="px-6 py-4 text-[9px] font-black text-white/30 uppercase tracking-[0.2em]">STATUS</th>
                                    <th className="px-6 py-4 text-[9px] font-black text-white/30 uppercase tracking-[0.2em] text-right">METRICS</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {sponsorships.slice(0, 5).map((item) => (
                                    <tr key={item.id} className="hover:bg-white/[0.02] transition-colors group">
                                        <td className="px-6 py-5">
                                            <p className="text-white font-black text-sm uppercase tracking-tighter group-hover:text-primary transition-colors italic">
                                                {item.hackathon?.title || "FIELD MISSION"}
                                            </p>
                                            <p className="text-[9px] text-white/30 uppercase tracking-widest mt-1">TIER: {item.tier || "CADRE"}</p>
                                        </td>
                                        <td className="px-6 py-5 text-white text-sm font-black italic">${Number(item.amount || 0).toLocaleString()}</td>
                                        <td className="px-6 py-5">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-[9px] font-black uppercase tracking-widest border rounded-sm ${
                                                item.status === "active" ? "bg-green-500/10 text-green-400 border-green-500/20" :
                                                item.status === "pending" ? "bg-primary/10 text-primary border-primary/20" :
                                                "bg-white/5 text-white/30 border-white/10"
                                            }`}>
                                                {item.status === "active" ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                                                {item.status || "PENDING"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <p className="text-green-400 font-black text-[10px] uppercase tracking-tighter italic">OPTIMAL ROI</p>
                                            <p className="text-[9px] text-white/30 uppercase tracking-widest mt-1">12.4K REACH</p>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Quick Actions & Investment */}
            <div className="space-y-8">
                <div>
                    <h2 className="text-xl font-black text-white mb-6 uppercase tracking-tight italic">QUICK OPS</h2>
                    <div className="grid grid-cols-1 gap-4">
                        <Link href="/dashboard/opportunities" className="p-6 bg-[#080808] border border-white/5 hover:border-primary/30 rounded-sm text-left transition-all duration-300 group relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-16 h-16 bg-primary/5 -translate-y-8 translate-x-8 rotate-45 group-hover:bg-primary/10 transition-colors"></div>
                            <Target className="w-8 h-8 text-primary mb-4 group-hover:scale-110 transition-all" />
                            <p className="font-black text-white mb-1 uppercase text-xs tracking-wider">DISCOVER OPS</p>
                            <p className="text-[9px] text-white/40 uppercase tracking-widest font-bold">FIND EVENTS SEEKING SPONSORS</p>
                        </Link>
                        
                        <Link href="/dashboard/requests" className="p-6 bg-[#080808] border border-white/5 hover:border-primary/30 rounded-sm text-left transition-all duration-300 group relative overflow-hidden">
                            <Users className="w-8 h-8 text-primary mb-4 group-hover:scale-110 transition-all" />
                            <p className="font-black text-white mb-1 uppercase text-xs tracking-wider">MY SQUADRON</p>
                            <p className="text-[9px] text-white/40 uppercase tracking-widest font-bold">MANAGE ACTIVE SPONSORSHIPS</p>
                        </Link>

                        <Link href="/dashboard/talent" className="p-6 bg-[#080808] border border-white/5 hover:border-primary/30 rounded-sm text-left transition-all duration-300 group relative overflow-hidden">
                            <Trophy className="w-8 h-8 text-primary mb-4 group-hover:scale-110 transition-all" />
                            <p className="font-black text-white mb-1 uppercase text-xs tracking-wider">TALENT RADAR</p>
                            <p className="text-[9px] text-white/40 uppercase tracking-widest font-bold">BROWSE TOP OPERATIVE PROFILES</p>
                        </Link>
                    </div>
                </div>

                <div className="p-6 border border-primary/20 bg-primary/5 rounded-sm relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-1 h-full bg-primary group-hover:w-2 transition-all"></div>
                    <div className="relative z-10">
                        <p className="text-[10px] text-primary font-black uppercase tracking-[0.2em] mb-2">TOTAL ENGAGEMENT</p>
                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-black text-white tracking-tighter italic">
                                ${totalAmount.toLocaleString()}
                            </span>
                        </div>
                        <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold mt-2">
                            DEPLOYED ACROSS {sponsorships.length} MISSIONS
                        </p>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
