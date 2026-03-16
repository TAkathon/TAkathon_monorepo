"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import {
  Search,
  Filter,
  MapPin,
  Calendar,
  DollarSign,
  ExternalLink,
  ChevronRight,
  Trophy,
  Loader2,
  Users,
  Building2,
  X,
  CheckCircle2,
  Clock,
  XCircle,
  RotateCcw,
  Zap
} from "lucide-react";
import {
  sponsorApi,
  type SponsorshipTier,
  type SponsorshipSummary,
} from "@takathon/shared/api";
import { toast } from "sonner";

interface OrganizerSnippet {
  id: string;
  fullName: string;
  organization?: string;
  avatarUrl?: string;
}

interface HackathonItem {
  id: string;
  title: string;
  description?: string;
  status?: string;
  startDate?: string | null;
  endDate?: string | null;
  location?: string | null;
  isVirtual?: boolean;
  maxParticipants?: number | null;
  prizePool?: string | null;
  websiteUrl?: string | null;
  requiredSkills?: string[];
  organizer?: OrganizerSnippet;
  _count?: { participants?: number; teams?: number; sponsorships?: number };
}

export default function OpportunitiesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [hackathons, setHackathons] = useState<HackathonItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [contactTarget, setContactTarget] = useState<HackathonItem | null>(null);
  const [sponsorTier, setSponsorTier] = useState<SponsorshipTier>("bronze");
  const [sponsorAmount, setSponsorAmount] = useState<number>(1000);
  const [submittingSponsor, setSubmittingSponsor] = useState(false);

  // Sponsorship status map: hackathonId → sponsorship
  const [sponsorshipMap, setSponsorshipMap] = useState<Record<string, SponsorshipSummary>>({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [hackathonData, sponsorships] = await Promise.all([
        sponsorApi.listSponsorHackathons(),
        sponsorApi.listMySponsorships(),
      ]);
      setHackathons(hackathonData);

      // Build map: hackathonId → latest sponsorship
      const map: Record<string, SponsorshipSummary> = {};
      for (const s of sponsorships) {
        const hId = s.hackathon?.id;
        if (hId) map[hId] = s;
      }
      setSponsorshipMap(map);
    } catch (error) {
      toast.error("FAILED TO SYNCHRONIZE OPPORTUNITIES");
    } finally {
      setLoading(false);
    }
  };

  const filtered = hackathons.filter(
    (h) =>
      (h.title ?? "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (h.organizer?.organization ?? "").toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const openSponsorModal = (target: HackathonItem) => {
    setContactTarget(target);
    setSponsorTier("bronze");
    setSponsorAmount(1000);
  };

  const handleCreateSponsorship = async () => {
    if (!contactTarget) return;
    if (!Number.isFinite(sponsorAmount) || sponsorAmount <= 0) {
      toast.error("INVALID BOUNTY AMOUNT");
      return;
    }

    setSubmittingSponsor(true);
    try {
      await sponsorApi.createSponsorship(contactTarget.id, {
        tier: sponsorTier,
        amount: sponsorAmount,
      });
      toast.success("REQUEST DEPLOYED", { description: "Your sponsorship proposal has been transmitted to the organizer." });
      setContactTarget(null);
      await fetchData();
    } catch (error: any) {
      const code = error?.response?.data?.error;
      if (code === "ALREADY_SPONSORING") {
        setContactTarget(null);
        toast.error("REQUEST ALREADY IN REGISTRY");
        await fetchData();
      } else {
        toast.error(error?.response?.data?.message || "TRANSMISSION FAILED");
      }
    } finally {
      setSubmittingSponsor(false);
    }
  };

  const statusLabel = (s?: string) =>
    (s ?? "").replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  const statusConfig = (s?: string) => {
    if (s === "registration_open")
      return { label: "RECRUITING", color: "text-green-400 border-green-500/30 bg-green-500/10" };
    if (s === "in_progress")
      return { label: "ACTIVE OPS", color: "text-primary border-primary/30 bg-primary/10" };
    if (s === "completed") return { label: "ARCHIVED", color: "text-white/40 border-white/10 bg-white/5" };
    return { label: (s || "OPEN").toUpperCase(), color: "text-primary/70 border-primary/20 bg-primary/5" };
  };

  return (
    <DashboardLayout>
        <div className="max-w-6xl mx-auto pb-12">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                <div>
                    <h1 className="text-5xl md:text-6xl font-black italic tracking-tighter uppercase text-white mb-2">
                        DISCOVER <span className="text-primary text-glow-sm">OPERATIONS</span>
                    </h1>
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-primary animate-pulse rounded-full shadow-glow-sm" />
                        <span className="text-[10px] text-white/40 uppercase tracking-[0.2em] font-bold">
                            FIND UPCOMING EVENTS SEEKING SPONSORSHIP ENTRANCE
                        </span>
                    </div>
                </div>
                
                <div className="flex gap-1 opacity-40">
                    <div className="w-12 h-1 bg-primary"></div>
                    <div className="w-2 h-1 bg-primary"></div>
                    <div className="w-1 h-1 bg-primary"></div>
                </div>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
                <div className="md:col-span-2 relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 group-focus-within:text-primary transition-colors" />
                    <input
                        type="text"
                        placeholder="SEARCH MISSIONS, CATEGORIES, OR ORGANIZERS..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-black border border-white/10 rounded-sm text-xs font-bold uppercase tracking-widest text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 transition-all"
                    />
                </div>
                <div className="relative group">
                    <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 group-focus-within:text-primary transition-colors z-10" />
                    <select className="w-full pl-12 pr-10 py-4 bg-black border border-white/10 rounded-sm text-xs font-bold uppercase tracking-widest text-white appearance-none focus:outline-none focus:border-primary/50 cursor-pointer">
                        <option>ALL SECTORS</option>
                        <option>ARTIFICIAL INTELLIGENCE</option>
                        <option>FINTECH SYSTEMS</option>
                        <option>BLOCKCHAIN OPS</option>
                    </select>
                </div>
                <div className="relative group">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 group-focus-within:text-primary transition-colors z-10" />
                    <select className="w-full pl-12 pr-10 py-4 bg-black border border-white/10 rounded-sm text-xs font-bold uppercase tracking-widest text-white appearance-none focus:outline-none focus:border-primary/50 cursor-pointer">
                        <option>ANY BUDGET</option>
                        <option>$0 — $1K</option>
                        <option>$1K — $5K</option>
                        <option>$5K+</option>
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="py-20 flex flex-col items-center justify-center gap-4">
                    <Loader2 className="w-10 h-10 text-primary animate-spin" />
                    <span className="text-[10px] font-black text-white/20 uppercase tracking-[.3em]">SCANNING GRID FOR OPPORTUNITIES...</span>
                </div>
            ) : filtered.length === 0 ? (
                <div className="text-center py-24 border border-white/5 bg-[#080808]">
                    <Trophy className="w-16 h-16 text-white/10 mx-auto mb-6" />
                    <h3 className="text-xl font-black text-white uppercase tracking-widest">NO TARGETS ACQUIRED</h3>
                    <p className="text-[10px] text-white/40 uppercase tracking-widest mt-2">ADJUST FILTERS OR STANDBY FOR NEW MISSIONS.</p>
                </div>
            ) : (
                <div className="flex flex-col gap-6">
                    {filtered.map((opp) => {
                        const config = statusConfig(opp.status);
                        const sponsorship = sponsorshipMap[opp.id];
                        
                        return (
                            <div key={opp.id} className="relative bg-[#080808] border border-white/5 rounded-sm hover:border-primary/30 transition-all duration-300 group overflow-hidden">
                                <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-primary/50 group-hover:w-4 group-hover:h-4 transition-all"></div>
                                
                                <div className="p-8 flex flex-col lg:flex-row gap-8 items-start">
                                    <div className="flex-1 space-y-6">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h3 className="text-3xl font-black italic text-white uppercase tracking-tighter mb-1 transition-colors group-hover:text-primary">
                                                    {opp.title}
                                                </h3>
                                                <div className="flex items-center gap-2">
                                                    <Building2 className="w-3 h-3 text-primary" />
                                                    <span className="text-[10px] text-white/40 uppercase tracking-widest font-black">BY {opp.organizer?.organization || opp.organizer?.fullName || "COMMANDER HQ"}</span>
                                                </div>
                                            </div>
                                            <span className={`px-4 py-1.5 text-[9px] font-black uppercase tracking-widest border rounded-sm ${config.color}`}>
                                                {config.label}
                                            </span>
                                        </div>

                                        <p className="text-sm text-white/60 leading-relaxed max-w-3xl uppercase tracking-widest italic font-medium">
                                            {opp.description || "NO MISSION OBJECTIVES SPECIFIED."}
                                        </p>

                                        <div className="flex flex-wrap gap-6 text-[10px] font-black uppercase tracking-widest text-white/40 border-t border-white/5 pt-6">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4 text-primary" />
                                                <span>{opp.startDate ? new Date(opp.startDate).toLocaleDateString() : 'TBD'}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <MapPin className="w-4 h-4 text-primary" />
                                                <span>{opp.isVirtual ? "REMOTELY DEPLOYED" : (opp.location || "FIELD HQ")}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-primary">
                                                <DollarSign className="w-4 h-4" />
                                                <span>{opp.prizePool ? `${opp.prizePool} BOUNTY` : "BOUNTY PENDING"}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Users className="w-4 h-4 text-primary" />
                                                <span>{opp._count?.participants || 0} OPERATIVES</span>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-2">
                                            {(opp.requiredSkills || []).map(skill => (
                                                <span key={skill} className="px-2 py-1 bg-white/[0.03] border border-white/10 text-[9px] text-white/30 uppercase tracking-widest font-black rounded-sm group-hover:text-white/50 transition-colors">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="lg:w-64 w-full flex flex-col gap-3 py-2">
                                        {!sponsorship ? (
                                            <button 
                                                onClick={() => openSponsorModal(opp)}
                                                className="w-full bg-primary text-white py-4 text-[10px] font-black uppercase tracking-widest rounded-sm hover:bg-primary-dark transition-all shadow-glow-sm flex items-center justify-center gap-2"
                                            >
                                                <Zap className="w-4 h-4" />
                                                DEPLOY SPONSORSHIP
                                            </button>
                                        ) : (
                                            <div className={`w-full py-4 text-center border rounded-sm flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest ${
                                                sponsorship.status === "pending" ? "bg-amber-500/10 text-amber-500 border-amber-500/20" :
                                                sponsorship.status === "approved" || sponsorship.status === "paid" ? "bg-green-500/10 text-green-500 border-green-500/20" :
                                                "bg-red-500/10 text-red-500 border-red-500/20"
                                            }`}>
                                                {sponsorship.status === "pending" ? <Clock className="w-4 h-4" /> : 
                                                 sponsorship.status === "approved" || sponsorship.status === "paid" ? <CheckCircle2 className="w-4 h-4" /> : 
                                                 <XCircle className="w-4 h-4" />}
                                                {sponsorship.status?.toUpperCase() || "PENDING"}
                                            </div>
                                        )}
                                        {opp.websiteUrl && (
                                            <a 
                                                href={opp.websiteUrl} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="w-full border border-white/10 group-hover:border-white/20 text-white/40 hover:text-white py-3 text-[9px] font-black uppercase tracking-widest rounded-sm transition-all flex items-center justify-center gap-2"
                                            >
                                                MISSION HUB
                                                <ExternalLink className="w-3 h-3" />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>

        {/* Tactical Modal */}
        {contactTarget && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4" onClick={() => setContactTarget(null)}>
                <div className="relative bg-[#0a0a0a] border border-white/10 p-10 w-full max-w-xl rounded-sm shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
                    <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-3xl"></div>
                    
                    <div className="flex items-start justify-between mb-10">
                        <div>
                            <h2 className="text-4xl font-black italic text-white tracking-tighter uppercase mb-2">DEPLOY <span className="text-primary italic">INTEL</span></h2>
                            <p className="text-[10px] text-white/40 uppercase tracking-widest font-black">PROPOSE SPONSORSHIP FOR {contactTarget.title}</p>
                        </div>
                        <button onClick={() => setContactTarget(null)} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                            <X className="w-6 h-6 text-white/40" />
                        </button>
                    </div>

                    <div className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">MISSION SECTOR</label>
                                <div className="p-4 bg-white/[0.02] border border-white/10 text-xs font-black text-white uppercase tracking-widest rounded-sm italic">
                                    {contactTarget.title}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">MISSION HQ</label>
                                <div className="p-4 bg-white/[0.02] border border-white/10 text-xs font-black text-white uppercase tracking-widest rounded-sm italic truncate">
                                    {contactTarget.organizer?.organization || contactTarget.organizer?.fullName || "COMMANDER"}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3 group">
                                <label className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] ml-1 group-focus-within:text-primary transition-colors">SPONSORSHIP TIER</label>
                                <select 
                                    className="w-full bg-black border border-white/10 p-4 text-xs font-black text-white uppercase tracking-widest focus:outline-none focus:border-primary/50 transition-all rounded-sm"
                                    value={sponsorTier}
                                    onChange={e => setSponsorTier(e.target.value as SponsorshipTier)}
                                >
                                    <option value="platinum">PLATINUM CADRE</option>
                                    <option value="gold">GOLD ELITE</option>
                                    <option value="silver">SILVER VIRTUE</option>
                                    <option value="bronze">BRONZE RECRUIT</option>
                                    <option value="other">CUSTOM INTEL</option>
                                </select>
                            </div>
                            <div className="space-y-3 group">
                                <label className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] ml-1 group-focus-within:text-primary transition-colors">BOUNTY AMOUNT ($)</label>
                                <input 
                                    type="number"
                                    className="w-full bg-black border border-white/10 p-4 text-xs font-black text-white uppercase tracking-widest focus:outline-none focus:border-primary/50 transition-all rounded-sm"
                                    value={sponsorAmount}
                                    onChange={e => setSponsorAmount(Number(e.target.value))}
                                />
                            </div>
                        </div>

                        <div className="pt-4 flex gap-4">
                            <button 
                                onClick={() => setContactTarget(null)}
                                className="flex-1 py-4 border border-white/10 text-white/40 text-[10px] font-black uppercase tracking-widest hover:bg-white/5 transition-all rounded-sm"
                            >
                                ABORT
                            </button>
                            <button 
                                onClick={handleCreateSponsorship}
                                disabled={submittingSponsor}
                                className="flex-[2] bg-primary text-white py-4 text-[10px] font-black uppercase tracking-widest hover:bg-primary-dark transition-all rounded-sm shadow-glow-sm disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {submittingSponsor ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                                {submittingSponsor ? "TRANSMITTING..." : "DEPLOY PROPOSAL"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )}
    </DashboardLayout>
  );
}
