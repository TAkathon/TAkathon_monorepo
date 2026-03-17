"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  Filter,
  Search,
  ChevronDown,
  Loader2,
  CheckCircle2,
  Shield,
  XCircle,
  AlertCircle,
  Globe,
  Trophy,
  Zap,
  ChevronRight
} from "lucide-react";
import { studentApi } from "@takathon/shared/api";
import type { StudentHackathonSummary } from "@takathon/shared/api";
import { SkeletonHackathonList } from "@takathon/shared/ui";
import { toast } from "sonner";

// ─── Button state logic ───────────────────────────────────────────────────────

type HackathonButtonState =
  | { action: "register"; label: "DEPLOY NOW"; disabled: false }
  | { action: "withdraw"; label: "WITHDRAW"; disabled: false }
  | { action: "full"; label: "CAPACITY FULL"; disabled: true; reason: string }
  | {
      action: "ended";
      label: "OPS CLOSED";
      disabled: true;
      reason: string;
    }
  | { action: "cancelled"; label: "ABORTED"; disabled: true; reason: string }
  | {
      action: "in_progress";
      label: "IN PROGRESS";
      disabled: true;
      reason: string;
    }
  | { action: "completed"; label: "TARGET SECURED"; disabled: true; reason: string }
  | {
      action: "team_locked";
      label: "LOCK INITIATED";
      disabled: true;
      reason: string;
    };

function getHackathonButtonState(
  hackathon: StudentHackathonSummary,
): HackathonButtonState {
  if (hackathon.isRegistered) {
    if (hackathon.isInTeam) {
      return {
        action: "team_locked",
        label: "LOCK INITIATED",
        disabled: true,
        reason:
          "SQUAD ASSIGNMENT ACTIVE. LEAVE TEAM TO WITHDRAW.",
      };
    }
    return { action: "withdraw", label: "WITHDRAW", disabled: false };
  }

  if (hackathon.status === "cancelled") {
    return { action: "cancelled", label: "ABORTED", disabled: true, reason: "MISSION CANCELLED BY HQ." };
  }
  if (hackathon.status === "completed") {
    return { action: "completed", label: "TARGET SECURED", disabled: true, reason: "MISSION DATA FINALIZED." };
  }
  if (hackathon.status === "in_progress") {
    return { action: "in_progress", label: "IN PROGRESS", disabled: true, reason: "OPERATION CURRENTLY RUNNING." };
  }
  if (hackathon.status === "registration_closed") {
    return { action: "ended", label: "OPS CLOSED", disabled: true, reason: "DEPLOYMENT WINDOW EXPIRED." };
  }
  if (hackathon.maxParticipants && hackathon.participantCount >= hackathon.maxParticipants) {
    return { action: "full", label: "CAPACITY FULL", disabled: true, reason: "MAXIMUM OPERATIVE CAPACITY REACHED." };
  }

  return { action: "register", label: "DEPLOY NOW", disabled: false };
}

// ─── Status badge helper ──────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { label: string; color: string; Icon: any }> = {
    registration_open: {
      label: "RECRUITING",
      color: "text-green-400 border-green-500/30 bg-green-500/10",
      Icon: Zap,
    },
    registration_closed: {
      label: "LOCKED",
      color: "text-yellow-400 border-yellow-500/30 bg-yellow-500/10",
      Icon: Shield,
    },
    in_progress: {
      label: "ACTIVE OPS",
      color: "text-primary border-primary/30 bg-primary/10",
      Icon: Clock,
    },
    completed: {
      label: "ARCHIVED",
      color: "text-white/40 border-white/10 bg-white/5",
      Icon: CheckCircle2,
    },
    cancelled: {
      label: "ABORTED",
      color: "text-red-400 border-red-500/30 bg-red-500/10",
      Icon: XCircle,
    },
  };
  const c = config[status] || {
    label: status.toUpperCase(),
    color: "text-white/40 border-white/10 bg-white/5",
    Icon: AlertCircle,
  };
  const { Icon } = c;
  return (
    <span className={`flex items-center gap-1.5 px-3 py-1 text-[8px] font-black uppercase tracking-widest border rounded-sm ${c.color}`}>
      <Icon className="w-3 h-3" />
      {c.label}
    </span>
  );
}

export default function HackathonsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [hackathons, setHackathons] = useState<StudentHackathonSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState<string | null>(null);
  const [withdrawing, setWithdrawing] = useState<string | null>(null);

  useEffect(() => {
    fetchHackathons();
  }, []);

  const fetchHackathons = async () => {
    try {
      const data = await studentApi.browseHackathons();
      setHackathons(data);
    } catch {
      toast.error("DATA SYNCHRONIZATION FAILED");
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async (hackathonId: string) => {
    setRegistering(hackathonId);
    try {
      await studentApi.registerForHackathon(hackathonId);
      toast.success("DEPLOYMENT CONFIRMED", { description: "You are now an active operative for this mission." });
      fetchHackathons();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "DEPLOYMENT OVERRIDE FAILED");
    } finally {
      setRegistering(null);
    }
  };

  const handleWithdraw = async (hackathonId: string) => {
    setWithdrawing(hackathonId);
    try {
      await studentApi.withdrawFromHackathon(hackathonId);
      toast.success("WITHDRAWAL COMPLETE");
      fetchHackathons();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "EXTRACTION FAILED");
    } finally {
      setWithdrawing(null);
    }
  };

  const filteredHackathons = hackathons
    .filter((h) => {
      const matchesSearch =
        h.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (h.requiredSkills || []).some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase()),
        );
      const matchesStatus =
        selectedStatus === "All" || h.status === selectedStatus;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (a.status === "cancelled" && b.status !== "cancelled") return 1;
      if (a.status !== "cancelled" && b.status === "cancelled") return -1;
      return 0;
    });

  return (
    <DashboardLayout>
        <div className="max-w-6xl mx-auto pb-12">
            {/* Header section */}
            <div className="mb-12">
                <div className="flex items-center relative mb-2">
                    <h1 className="text-5xl md:text-6xl font-black italic tracking-tighter uppercase text-white">
                        HACKATHON <span className="text-white text-glow-sm">MISSIONS</span>
                    </h1>
                    <div className="flex ml-4 gap-1 opacity-60 mt-4">
                        <div className="w-12 h-1 bg-primary"></div>
                        <div className="w-2 h-1 bg-primary"></div>
                        <div className="w-1 h-1 bg-primary"></div>
                    </div>
                </div>
                <div className="max-w-3xl mt-4">
                    <p className="text-[10px] text-white/50 uppercase tracking-[0.2em] font-bold leading-relaxed">
                        DISCOVER AND JOIN EXCITING HACKATHONS ACROSS TUNISIA AND BEYOND.
                    </p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
                <div className="flex-1 relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 group-focus-within:text-primary transition-colors" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="SEARCH OPERATIONS..."
                        className="w-full pl-12 pr-4 py-4 bg-black border border-white/5 rounded-sm text-white focus:outline-none focus:border-primary/50 transition-all text-xs font-bold uppercase tracking-widest placeholder:text-white/20"
                    />
                </div>

                <div className="relative min-w-[200px] group">
                    <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 group-focus-within:text-primary transition-colors z-10" />
                    <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="w-full pl-12 pr-10 py-4 bg-black border border-white/5 rounded-sm text-white focus:outline-none focus:border-primary/50 transition-all appearance-none cursor-pointer text-xs font-bold uppercase tracking-widest relative"
                    >
                        <option value="All">ALL STATUS</option>
                        <option value="registration_open">OPEN OPS</option>
                        <option value="in_progress">IN PROGRESS</option>
                        <option value="completed">COMPLETED</option>
                        <option value="cancelled">ABORTED</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
                </div>
            </div>

            {loading ? (
                <div className="py-20 flex flex-col items-center justify-center gap-4">
                    <Loader2 className="w-10 h-10 text-primary animate-spin" />
                    <span className="text-[10px] font-black text-white/20 uppercase tracking-[.3em]">SYNCHRONIZING MISSIONS...</span>
                </div>
            ) : filteredHackathons.length === 0 ? (
                <div className="text-center py-20 border border-white/5 bg-[#080808]">
                    <Search className="w-12 h-12 text-white/10 mx-auto mb-4" />
                    <h3 className="text-sm font-black text-white uppercase tracking-widest">NO MISSIONS DETECTED</h3>
                    <p className="text-[10px] text-white/40 uppercase tracking-widest mt-2">{searchQuery ? "ADJUST SEARCH PARAMETERS." : "STANDBY FOR NEW OPERATIONS."}</p>
                </div>
            ) : (
                <div className="flex flex-col gap-6">
                    {filteredHackathons.map((hackathon) => {
                        const btnState = getHackathonButtonState(hackathon);
                        const isCancelled = hackathon.status === "cancelled";

                        return (
                            <div key={hackathon.id} className={`relative bg-[#080808] border border-white/5 rounded-sm hover:border-primary/30 transition-all duration-300 flex flex-col md:flex-row group overflow-hidden ${isCancelled ? 'opacity-40' : ''}`}>
                                <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-primary opacity-50 group-hover:opacity-100"></div>
                                <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-primary opacity-50 group-hover:opacity-100"></div>
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/0 group-hover:bg-primary/5 rounded-full blur-[80px] pointer-events-none transition-all duration-700"></div>

                                <div className="p-8 flex flex-col flex-1 z-10">
                                    <div className="flex items-start justify-between mb-6">
                                        <div>
                                            <h3 className="text-2xl font-black italic text-white uppercase tracking-tighter mb-1 pb-1">{hackathon.title}</h3>
                                            <p className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">MISSION AREA: {hackathon.isVirtual ? "REMOTELY DEPLOYED" : (hackathon.location || "TBD")}</p>
                                        </div>
                                        <StatusBadge status={hackathon.status} />
                                    </div>

                                    <p className="text-sm text-white/60 leading-relaxed mb-6 font-medium italic uppercase tracking-widest line-clamp-2">
                                        {hackathon.description || "NO MISSION OBJECTIVES SPECIFIED."}
                                    </p>

                                    <div className="flex flex-wrap gap-2 mb-8">
                                        {(hackathon.requiredSkills || []).map(skill => (
                                            <span key={skill} className="px-2 py-1 bg-white/[0.03] border border-white/10 text-white/50 text-[9px] font-black uppercase tracking-widest rounded-sm">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8 border-t border-white/5 pt-6">
                                        <div>
                                            <p className="text-[9px] text-white/40 uppercase tracking-widest font-black mb-1">WINDOW</p>
                                            <div className="flex items-center gap-2 text-[10px] text-white font-black uppercase tracking-widest">
                                                <Calendar className="w-3.5 h-3.5 text-primary" />
                                                <span>{new Date(hackathon.startDate).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-[9px] text-white/40 uppercase tracking-widest font-black mb-1">OPERATIVES</p>
                                            <div className="flex items-center gap-2 text-[10px] text-white font-black uppercase tracking-widest">
                                                <Users className="w-3.5 h-3.5 text-primary" />
                                                <span>{hackathon.participantCount} / {hackathon.maxParticipants || "∞"}</span>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-[9px] text-white/40 uppercase tracking-widest font-black mb-1">DURATION</p>
                                            <div className="flex items-center gap-2 text-[10px] text-white font-black uppercase tracking-widest">
                                                <Clock className="w-3.5 h-3.5 text-primary" />
                                                <span>{hackathon.startDate && hackathon.endDate ? `${Math.ceil((new Date(hackathon.endDate).getTime() - new Date(hackathon.startDate).getTime()) / (1000 * 60 * 60 * 24))} DAYS` : "TBD"}</span>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-[9px] text-white/40 uppercase tracking-widest font-black mb-1">REWARD</p>
                                            <div className="flex items-center gap-2 text-[10px] text-primary font-black uppercase tracking-widest">
                                                <Trophy className="w-3.5 h-3.5" />
                                                <span>PROJECT BOUNTY</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-end justify-between gap-4 mt-auto">
                                        <div className="flex flex-col">
                                            <p className="text-[9px] text-white/30 uppercase tracking-[0.2em] font-black mb-1">DEPLOYMENT STATUS</p>
                                            {hackathon.isRegistered ? (
                                                <span className="text-xs font-black text-green-400 uppercase tracking-widest flex items-center gap-2">
                                                    <CheckCircle2 className="w-4 h-4" /> ACTIVATED
                                                </span>
                                            ) : (
                                                <span className="text-xs font-black text-white/20 uppercase tracking-widest">AWAITING ORDERS</span>
                                            )}
                                        </div>
                                        
                                        <div className="flex items-center gap-3">
                                            {btnState.action === "withdraw" && (
                                                <button
                                                    onClick={() => handleWithdraw(hackathon.id)}
                                                    disabled={withdrawing === hackathon.id}
                                                    className="px-6 py-3 border border-red-500/30 text-red-500 text-[10px] font-black uppercase tracking-widest hover:bg-red-500/10 transition-all rounded-sm flex items-center gap-2"
                                                >
                                                    {withdrawing === hackathon.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <XCircle className="w-3.5 h-3.5" />}
                                                    ABORT
                                                </button>
                                            )}
                                            
                                            <button
                                                onClick={() => {
                                                    if (btnState.action === "register") handleJoin(hackathon.id);
                                                    else if (btnState.disabled) toast.info(btnState.reason);
                                                }}
                                                disabled={btnState.disabled || registering === hackathon.id}
                                                className={`px-8 py-3 ${btnState.action === "register" ? 'bg-primary text-white hover:bg-primary-dark shadow-glow-sm' : 'bg-white/5 text-white/40 border border-white/10'} text-[10px] font-black uppercase tracking-widest transition-all rounded-sm flex items-center gap-2`}
                                            >
                                                {registering === hackathon.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5" />}
                                                {btnState.label}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="w-full md:w-1/3 min-h-[200px] md:min-h-full relative border-l border-white/5 shrink-0 bg-[#050505] overflow-hidden">
                                     <img
                                        src={`https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&seed=${hackathon.id}`}
                                        alt="Mission"
                                        className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-60 transition-opacity duration-700 grayscale group-hover:grayscale-0 scale-100 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#080808] to-transparent"></div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    </DashboardLayout>
  );
}
