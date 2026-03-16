"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Users,
  Calendar,
  Clock,
  MapPin,
  Globe,
  ChevronDown,
  Edit2,
  Trash2,
  Eye,
  Loader2,
} from "lucide-react";
import { organizerApi } from "@takathon/shared/api";
import type { OrganizerHackathonSummary } from "@takathon/shared/api";
import { toast } from "sonner";
import { SkeletonHackathonList } from "@takathon/shared/ui";
import Link from "next/link";

export default function HackathonsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [hackathons, setHackathons] = useState<OrganizerHackathonSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchHackathons();
  }, []);

  const fetchHackathons = async () => {
    try {
      const data = await organizerApi.listMyHackathons();
      setHackathons(data);
    } catch (error) {
      console.error("Failed to fetch hackathons:", error);
      toast.error("Failed to load operations");
    } finally {
      setLoading(false);
    }
  };

  const handleLifecycleAction = async (
    hackathonId: string,
    action: "publish" | "start" | "complete" | "cancel",
  ) => {
    setActionLoading(hackathonId + action);
    try {
      if (action === "publish")
        await organizerApi.publishHackathon(hackathonId);
      else if (action === "start")
        await organizerApi.startHackathon(hackathonId);
      else if (action === "complete")
        await organizerApi.completeHackathon(hackathonId);
      else if (action === "cancel")
        await organizerApi.cancelHackathon(hackathonId);
      toast.success(`Operation ${action}ed successfully!`);
      await fetchHackathons();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || `Failed to ${action} operation`,
      );
    } finally {
      setActionLoading(null);
    }
  };

  const filteredHackathons = hackathons.filter((h) => {
    const matchesSearch = h.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus =
      selectedStatus === "ALL" || h.status.toUpperCase() === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8 pb-12 relative">
        {/* Background Floating Objects */}
        <div className="absolute top-20 right-10 w-32 h-32 bg-primary/20 rounded-full blur-[80px] pointer-events-none"></div>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
                <div className="flex items-center relative mb-1">
                    <h1 className="text-5xl md:text-6xl font-black italic tracking-tighter uppercase text-white">
                        <span className="text-white">OPERATIONS</span>
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
                        MANAGE AND MONITOR ACTIVE MISSIONS
                    </span>
                </div>
            </div>
            <Link href="/hackathons/create">
              <button className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white border border-primary hover:bg-primary-dark hover:shadow-[0_0_15px_rgba(255,92,0,0.4)] transition-all active:scale-[0.98] rounded-sm drop-shadow-md text-[10px] font-bold tracking-widest uppercase mt-4">
                  <Plus className="w-4 h-4" />
                  <span>DEPLOY NEW OPERATION</span>
              </button>
            </Link>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 pt-4 border-t border-white/5">
            <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="SEARCH OPERATIONS..."
                    className="w-full pl-12 pr-4 py-3 bg-[#080808] border border-white/10 text-[10px] font-bold uppercase tracking-widest text-white placeholder:text-white/30 focus:outline-none focus:border-primary/50 transition-all rounded-sm"
                />
            </div>
            <div className="relative min-w-[200px]">
                <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full pl-12 pr-8 py-3 bg-[#080808] border border-white/10 text-[10px] font-bold uppercase tracking-widest text-white focus:outline-none focus:border-primary/50 transition-all appearance-none cursor-pointer rounded-sm"
                >
                    <option value="ALL">ALL STATUS</option>
                    <option value="DRAFT">DRAFT</option>
                    <option value="REGISTRATION_OPEN">REGISTRATION OPEN</option>
                    <option value="IN_PROGRESS">IN PROGRESS</option>
                    <option value="COMPLETED">COMPLETED</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
            </div>
        </div>

        {/* List Content */}
        <div className="flex flex-col gap-6">
            {loading ? (
                <div className="space-y-6">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-48 bg-white/5 animate-pulse border border-white/5 rounded-sm" />
                    ))}
                </div>
            ) : filteredHackathons.length === 0 ? (
                <div className="col-span-full flex flex-col items-center justify-center py-20 bg-[#080808] border border-white/5 rounded-sm">
                    <div className="w-16 h-16 rounded-sm bg-white/5 flex items-center justify-center mb-6 border border-white/10 rotate-45">
                        <Calendar className="w-8 h-8 text-primary/60 -rotate-45" />
                    </div>
                    <h3 className="text-xl font-black italic tracking-tighter text-white uppercase mb-2">
                        NO ACTIVE OPERATIONS FOUND
                    </h3>
                    <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest text-center max-w-sm mb-6">
                        {searchQuery || selectedStatus !== "ALL"
                        ? "ADJUST RADAR PARAMETERS TO LOCATE TARGETS"
                        : "INITIALIZE PROTOCOL TO DEPLOY FIRST MISSION"}
                    </p>
                    {searchQuery || selectedStatus !== "ALL" ? (
                    <button
                        onClick={() => {
                        setSearchQuery("");
                        setSelectedStatus("ALL");
                        }}
                        className="px-5 py-2.5 rounded-sm bg-primary text-white border border-primary hover:bg-primary-dark transition-all text-[10px] font-bold uppercase tracking-widest"
                    >
                        RESET RADAR
                    </button>
                    ) : (
                    <Link href="/hackathons/create">
                        <button className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white border border-primary rounded-sm text-[10px] font-bold tracking-widest uppercase">
                        <Plus className="w-4 h-4" />
                        INITIATE DEPLOYMENT
                        </button>
                    </Link>
                    )}
                </div>
            ) : (
                filteredHackathons.map((hackathon) => (
                    <div
                        key={hackathon.id}
                        className="relative bg-[#080808] border border-white/5 rounded-sm hover:border-white/10 transition-all duration-300 group flex flex-col md:flex-row"
                    >
                        <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/20 z-10"></div>
                        <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r flex items-end justify-end group-hover:border-primary/50 transition-colors z-10"></div>

                        {/* Image */}
                        <div className="relative md:w-80 h-48 md:h-auto bg-black overflow-hidden border-b md:border-b-0 md:border-r border-white/5 p-1 shrink-0">
                            {hackathon.bannerUrl ? (
                                <img
                                    src={hackathon.bannerUrl}
                                    alt={hackathon.title}
                                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 opacity-50 group-hover:opacity-100 rounded-[1px]"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-white/[0.02] text-white/10 rounded-[1px]">
                                    <Calendar className="w-12 h-12" />
                                </div>
                            )}
                        </div>

                        {/* Content */}
                        <div className="p-6 space-y-4 flex-1 flex flex-col relative z-20 bg-gradient-to-t md:bg-gradient-to-l from-[#050505] to-transparent">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-xl md:text-2xl font-black italic tracking-tighter uppercase text-white group-hover:text-primary transition-colors mb-2">
                                        {hackathon.title}
                                    </h3>
                                    <div className="flex items-center gap-2 bg-[#080808] px-3 py-1 border border-white/10 rounded-sm inline-flex">
                                        <div className={`w-2 h-2 mt-0.5 rounded-sm rotate-45 ${
                                            hackathon.status === 'in_progress' ? 'bg-green-500 shadow-glow-sm' : 
                                            hackathon.status === 'registration_open' ? 'bg-primary shadow-glow-sm' : 'bg-white/20'
                                        }`} />
                                        <span className={`text-[10px] font-bold tracking-widest uppercase ${
                                            hackathon.status === 'in_progress' ? 'text-green-500' : 
                                            hackathon.status === 'registration_open' ? 'text-primary' : 'text-white/40'
                                        }`}>
                                            {hackathon.status.replace('_', ' ')}
                                        </span>
                                    </div>
                                </div>

                                <button className="hidden md:flex p-2 bg-transparent border border-transparent hover:border-white/10 text-white/30 hover:text-white/80 transition-all rounded-sm">
                                    <MoreVertical className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="flex flex-col md:flex-row md:items-center gap-6 mt-4 pb-4 border-b border-white/5">
                                <div className="flex items-center gap-6">
                                    <div className="flex items-center gap-2">
                                        {hackathon.isVirtual ? <Globe className="w-4 h-4 text-primary" /> : <MapPin className="w-4 h-4 text-primary" />}
                                        <span className="text-[10px] text-white/60 font-bold uppercase tracking-widest">{hackathon.isVirtual ? 'VIRTUAL' : (hackathon.location || 'PHYSICAL')}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-primary" />
                                        <span className="text-[10px] text-white/60 font-bold uppercase tracking-widest">
                                            {hackathon.startDate ? new Date(hackathon.startDate).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).toUpperCase() : 'TBD'}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex-1 w-full md:pl-6 md:border-l md:border-white/5">
                                    <div className="flex justify-between text-[10px] uppercase tracking-widest font-bold mb-1">
                                        <span className="flex items-center gap-1.5 text-white/40"><Users className="w-3 h-3 text-white/20" /> CREW CAPACITY</span>
                                        <span className="text-white">MAX {hackathon.maxParticipants || "UNLIMITED"}</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-white/5 rounded-sm overflow-hidden border border-white/10">
                                        {/* Since summarized hackathon doesn't always have current count in some versions, we show 100% or estimated if available */}
                                        <div
                                            className="h-full bg-gradient-to-r from-primary/60 to-primary shadow-[0_0_10px_rgba(255,92,0,0.5)]"
                                            style={{ width: `100%` }}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-2 mt-auto flex flex-wrap gap-3">
                                <Link href={`/hackathons/${hackathon.id}`} className="flex-1 md:flex-none">
                                    <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-transparent text-white border border-white/20 hover:border-white/40 hover:bg-white/5 text-[10px] uppercase tracking-widest font-bold transition-all rounded-sm">
                                        <Eye className="w-3.5 h-3.5" />
                                        DETAILS
                                    </button>
                                </Link>
                                {["draft", "registration_open", "registration_closed"].includes(hackathon.status) && (
                                    <Link href={`/hackathons/${hackathon.id}/edit`} className="flex-1 md:flex-none">
                                        <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary/10 text-primary border border-primary/20 hover:border-primary hover:text-white hover:bg-primary hover:shadow-[0_0_10px_rgba(255,92,0,0.3)] text-[10px] uppercase tracking-widest font-bold transition-all rounded-sm">
                                            <Edit2 className="w-3.5 h-3.5" />
                                            MODIFY
                                        </button>
                                    </Link>
                                )}
                                
                                {/* Status Lifecycle Actions */}
                                {hackathon.status === "draft" && (
                                    <button
                                        disabled={actionLoading === hackathon.id + "publish"}
                                        onClick={() => handleLifecycleAction(hackathon.id, "publish")}
                                        className="flex-1 md:flex-none px-4 py-2 bg-green-500/10 hover:bg-green-500 text-green-400 hover:text-white border border-green-500/20 rounded-sm text-[10px] font-bold uppercase tracking-widest transition-all disabled:opacity-50"
                                    >
                                        {actionLoading === hackathon.id + "publish" ? (
                                            <Loader2 className="w-3 h-3 animate-spin mx-auto" />
                                        ) : "PUBLISH"}
                                    </button>
                                )}
                                {["registration_open", "registration_closed"].includes(hackathon.status) && (
                                    <button
                                        disabled={actionLoading === hackathon.id + "start"}
                                        onClick={() => handleLifecycleAction(hackathon.id, "start")}
                                        className="flex-1 md:flex-none px-4 py-2 bg-blue-500/10 hover:bg-blue-50 text-blue-400 hover:text-white border border-blue-500/20 rounded-sm text-[10px] font-bold uppercase tracking-widest transition-all disabled:opacity-50"
                                    >
                                        {actionLoading === hackathon.id + "start" ? (
                                            <Loader2 className="w-3 h-3 animate-spin mx-auto" />
                                        ) : "ACTIVATE"}
                                    </button>
                                )}
                                {hackathon.status === "in_progress" && (
                                    <button
                                        disabled={actionLoading === hackathon.id + "complete"}
                                        onClick={() => handleLifecycleAction(hackathon.id, "complete")}
                                        className="flex-1 md:flex-none px-4 py-2 bg-purple-500/10 hover:bg-purple-500 text-purple-400 hover:text-white border border-purple-500/20 rounded-sm text-[10px] font-bold uppercase tracking-widest transition-all disabled:opacity-50"
                                    >
                                        {actionLoading === hackathon.id + "complete" ? (
                                            <Loader2 className="w-3 h-3 animate-spin mx-auto" />
                                        ) : "FINALIZE"}
                                    </button>
                                )}
                                {!["completed", "cancelled"].includes(hackathon.status) && (
                                    <button
                                        disabled={actionLoading === hackathon.id + "cancel"}
                                        onClick={() => handleLifecycleAction(hackathon.id, "cancel")}
                                        className="flex-1 md:flex-none px-4 py-2 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/20 rounded-sm text-[10px] font-bold uppercase tracking-widest transition-all disabled:opacity-50"
                                    >
                                        {actionLoading === hackathon.id + "cancel" ? (
                                            <Loader2 className="w-3 h-3 animate-spin mx-auto" />
                                        ) : "ABORT"}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))
            )}

            {/* Create New Card */}
            <Link href="/hackathons/create">
              <button className="w-full relative bg-[#050505] border-2 border-dashed border-white/10 hover:border-primary/40 hover:bg-primary/5 transition-all group flex flex-row items-center justify-center p-8 gap-6 min-h-[160px] rounded-sm mt-4">
                  <div className="w-12 h-12 bg-white/5 border border-white/10 flex items-center justify-center text-white/30 group-hover:text-primary group-hover:bg-primary/10 group-hover:border-primary/30 transition-all rounded-sm transform group-hover:rotate-90 duration-500 shrink-0">
                      <Plus className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                      <h3 className="text-lg font-black italic tracking-tighter text-white/60 group-hover:text-white transition-all uppercase">DEPLOY NEW OPERATION</h3>
                      <p className="text-[10px] text-primary/60 mt-1 uppercase tracking-widest font-bold">INITIALIZE PROTOCOL</p>
                  </div>
              </button>
            </Link>
        </div>
      </div>
    </DashboardLayout>
  );
}
