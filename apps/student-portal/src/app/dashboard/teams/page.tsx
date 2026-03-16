"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import {
  Users,
  Plus,
  UserPlus,
  Crown,
  Calendar,
  Target,
  MessageCircle,
  ChevronDown,
  Loader2,
  Trash2,
  Sparkles,
  X,
  Send,
  Activity,
  Trophy,
  ChevronRight,
  ShieldCheck,
  Zap
} from "lucide-react";
import { teamApi, studentApi, matchingApi } from "@takathon/shared/api";
import type { MatchSuggestion, MatchResult } from "@takathon/shared/api";
import { SkeletonTeamList } from "@takathon/shared/ui";
import { toast } from "sonner";

interface TeamMemberData {
  id: string;
  userId: string;
  role: string;
  user?: {
    fullName: string;
    email: string;
    skills?: { skill: { name: string } }[];
  };
}

interface TeamData {
  id: string;
  name: string;
  description?: string;
  status: string;
  maxSize: number;
  currentSize: number;
  hackathon?: { title: string; startDate: string; endDate: string };
  hackathonId: string;
  members?: TeamMemberData[];
  myRole?: string;
}

interface HackathonOption {
  id: string;
  title: string;
  minTeamSize: number;
  maxTeamSize: number;
}

// ─── Suggestion Card ──────────────────────────────────────────────────────────

function ScoreBadge({ score }: { score: number }) {
  const pct = Math.round(score * 100);
  const color =
    pct >= 75
      ? "text-green-400 bg-green-500/15 border-green-500/30"
      : pct >= 50
        ? "text-primary bg-primary/15 border-primary/30"
        : "text-white/60 bg-white/10 border-white/20";
  return (
    <span
      className={`px-2 py-0.5 text-[10px] font-black uppercase tracking-widest rounded-sm border ${color}`}
    >
      {pct}% MATCH
    </span>
  );
}

function SuggestionCard({
  suggestion,
  rank,
  teamId,
  inviting,
  onInvite,
}: {
  suggestion: MatchSuggestion;
  rank: number;
  teamId: string;
  inviting: boolean;
  onInvite: (teamId: string, candidateId: string) => void;
}) {
  const initials = suggestion.fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  return (
    <div className="bg-black border border-white/5 hover:border-primary/30 rounded-sm p-5 transition-all group">
      <div className="flex items-start gap-4">
        <div className="relative flex-shrink-0">
          <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-white/20 font-black text-sm">
            <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${suggestion.fullName}&backgroundColor=transparent`} alt={suggestion.fullName} className="w-full h-full object-cover opacity-80" />
          </div>
          <span className="absolute -top-1 -left-1 w-6 h-6 bg-primary border-2 border-black rounded-full flex items-center justify-center text-white text-[10px] font-black italic">
            #{rank}
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="font-black text-white uppercase tracking-wider truncate">
              {suggestion.fullName}
            </span>
            <ScoreBadge score={suggestion.score} />
          </div>

          <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-3 leading-relaxed">
            {suggestion.explanation}
          </p>

          <div className="flex flex-wrap gap-2">
            {suggestion.complementarySkills.slice(0, 3).map((skill) => (
              <span
                key={skill}
                className="px-2 py-0.5 bg-primary/5 text-primary text-[8px] font-black uppercase tracking-widest border border-primary/20 rounded-sm"
              >
                + {skill}
              </span>
            ))}
          </div>
        </div>

        <button
          onClick={() => onInvite(teamId, suggestion.candidateId)}
          disabled={inviting}
          className="flex-shrink-0 px-4 py-3 bg-primary/10 border border-primary/30 hover:bg-primary/20 hover:border-primary disabled:opacity-50 text-primary text-[10px] font-black uppercase tracking-widest rounded-sm transition-all"
        >
          {inviting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            "INVITE"
          )}
        </button>
      </div>
    </div>
  );
}

export default function TeamsPage() {
  const router = useRouter();
  const [teams, setTeams] = useState<TeamData[]>([]);
  const [hackathons, setHackathons] = useState<HackathonOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newTeam, setNewTeam] = useState({
    name: "",
    hackathonId: "",
    description: "",
    maxSize: 5,
  });

  const [activeTab, setActiveTab] = useState("ACTIVE SQUADS");
  const tabs = [
    { id: "ACTIVE SQUADS", label: "ACTIVE SQUADS" },
    { id: "INVITATIONS", label: "INVITATIONS" },
    { id: "PAST MISSIONS", label: "PAST MISSIONS" },
  ];

  // ── AI matching state ─────────────────────────────────────────────────────
  const [matchModalTeamId, setMatchModalTeamId] = useState<string | null>(null);
  const [matchResult, setMatchResult] = useState<MatchResult | null>(null);
  const [matchLoading, setMatchLoading] = useState(false);
  const [invitingUserId, setInvitingUserId] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [rawTeams, hackathons] = await Promise.all([
        teamApi.getMyTeams(),
        studentApi.browseHackathons({ status: "registration_open" }),
      ]);
      const teams = (rawTeams as any[]).map((m: any) => ({
        ...(m.team ?? m),
        myRole: m.role ?? m.myRole,
        members: (m.team?.members ?? m.members) || [],
      }));
      setTeams(teams);
      setHackathons(
        hackathons
          .filter((h) => h.isRegistered && !h.isInTeam)
          .map((h) => ({
            id: h.id,
            title: h.title,
            minTeamSize: h.minTeamSize ?? 2,
            maxTeamSize: h.maxTeamSize ?? 10,
          })),
      );
    } catch (error) {
      console.error("Failed to fetch data:", error);
      toast.error("FAILED TO LOAD SQUAD DATA");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTeam = async () => {
    if (!newTeam.name.trim()) {
      toast.error("SQUAD DESIGNATION REQUIRED");
      return;
    }
    if (!newTeam.hackathonId) {
      toast.error("PLEASE SELECT A TARGET MISSION");
      return;
    }
    setCreating(true);
    try {
      await teamApi.createTeam({
        hackathonId: newTeam.hackathonId,
        name: newTeam.name,
        description: newTeam.description || undefined,
        maxSize: newTeam.maxSize,
      });
      toast.success("SQUAD LAUNCH INITIATED!");
      setShowCreateModal(false);
      setNewTeam({ name: "", hackathonId: "", description: "", maxSize: 5 });
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "SQUAD FORMATION FAILED");
    } finally {
      setCreating(false);
    }
  };

  const handleDisbandTeam = async (teamId: string, teamName: string) => {
    toast.error(`DISBANDING "${teamName}"... PROTOCOL REQUIRES MANUAL CLEARANCE.`);
    // In a real app, logic would go here
    try {
        await teamApi.disbandTeam(teamId);
        toast.success("SQUAD DISBANDED");
        fetchData();
    } catch (err: any) {
        toast.error("PURGE FAILED");
    }
  };

  const openMatchModal = async (teamId: string) => {
    setMatchModalTeamId(teamId);
    setMatchResult(null);
    setMatchLoading(true);
    try {
      const result = await matchingApi.suggestTeammates(teamId, 6);
      setMatchResult(result);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "AI RECRUITMENT OFFLINE");
      setMatchModalTeamId(null);
    } finally {
      setMatchLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
            <div className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">SYNCHRONIZING SQUAD DATA...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
        <div className="max-w-6xl mx-auto pb-12">
            {/* Header section */}
            <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center relative mb-2">
                        <h1 className="text-5xl md:text-6xl font-black italic tracking-tighter uppercase text-white">
                            SQUAD <span className="text-white text-glow-sm">COMMAND</span>
                        </h1>
                        <div className="flex ml-4 gap-1 opacity-60 mt-4">
                            <div className="w-12 h-1 bg-primary"></div>
                            <div className="w-2 h-1 bg-primary"></div>
                            <div className="w-1 h-1 bg-primary"></div>
                        </div>
                    </div>
                    <div className="max-w-2xl mt-4">
                        <p className="text-[10px] text-white/50 uppercase tracking-[0.2em] font-bold leading-relaxed">
                            MANAGE YOUR HACKATHON TEAMS, RECRUIT ALLIES, AND COORDINATE TACTICS.
                        </p>
                    </div>
                </div>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="px-8 py-4 bg-primary text-white text-[10px] font-black uppercase tracking-[0.2em] hover:bg-primary-dark transition-all rounded-sm flex items-center gap-2 whitespace-nowrap shadow-glow-sm"
                >
                    <Plus className="w-4 h-4" /> FORM SQUAD
                </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-white/10 mb-8 overflow-x-auto hide-scrollbar">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-8 py-4 text-[10px] font-black uppercase tracking-widest transition-all relative whitespace-nowrap active:scale-[0.98] ${activeTab === tab.id
                            ? "text-primary"
                            : "text-white/50 hover:text-white/80"
                            }`}
                    >
                        {tab.label}
                        {activeTab === tab.id && (
                            <div className="absolute bottom-0 left-0 w-full h-[2px] bg-primary shadow-[0_0_10px_rgba(255,92,0,0.5)]"></div>
                        )}
                    </button>
                ))}
            </div>

            {/* Teams List */}
            {activeTab === "ACTIVE SQUADS" && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {teams.length === 0 ? (
                        <div className="col-span-full py-20 flex flex-col items-center justify-center border border-white/5 bg-[#080808] opacity-20 text-center">
                            <Users className="w-16 h-16 mb-6" strokeWidth={1} />
                            <p className="text-[12px] font-black uppercase tracking-[0.3em]">NO ACTIVE SQUADS FOUND</p>
                            <p className="text-[10px] font-bold mt-2 uppercase tracking-widest">FORM A NEW UNIT TO COMMENCE OPERATIONS.</p>
                        </div>
                    ) : (
                        teams.map((team) => (
                            <div key={team.id} className="relative p-6 bg-[#080808] border border-white/5 rounded-sm overflow-hidden flex flex-col min-h-[500px]">
                                <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-primary"></div>
                                <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-primary"></div>

                                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
                                    <div>
                                        <h2 className="text-2xl font-black text-white italic tracking-tighter uppercase mb-2">
                                            {team.name}
                                        </h2>
                                        <div className="flex flex-col gap-1">
                                            <p className="text-[10px] font-bold text-primary uppercase tracking-widest">
                                                MISSION: {team.hackathon?.title || "UNASSIGNED"}
                                            </p>
                                            <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest">
                                                CAPACITY: {team.currentSize} / {team.maxSize} OPERATIVES
                                            </p>
                                        </div>
                                    </div>
                                    <span className={`px-3 py-1 text-[8px] font-bold uppercase tracking-widest border border-primary text-primary bg-primary/5 rounded-sm h-fit whitespace-nowrap ${team.status === 'forming' ? 'animate-pulse' : ''}`}>
                                        {team.status === 'forming' ? 'RECRUITING' : team.status.toUpperCase()}
                                    </span>
                                </div>

                                <p className="text-xs text-white/60 leading-relaxed mb-6 flex-1 italic truncate-3-lines font-bold uppercase tracking-widest">
                                    {team.description || "NO MISSION BRIEF PROVIDED."}
                                </p>

                                {/* Roster */}
                                <div className="mb-6">
                                    <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] flex items-center gap-2 mb-4">
                                        <div className="w-1.5 h-1.5 bg-white/40 rotate-45"></div>
                                        ROSTER
                                    </h3>
                                    <div className="space-y-3">
                                        {(team.members || []).map((member, idx) => (
                                            <div key={idx} className="flex items-center gap-4 bg-black border border-white/5 p-3 rounded-sm">
                                                <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
                                                    <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${member.user?.fullName || member.userId}&backgroundColor=transparent`} alt="Member" className="w-full h-full object-cover opacity-80" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="text-[11px] font-black text-white truncate uppercase tracking-widest">{member.user?.fullName}</span>
                                                        <span className={`text-[7px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-sm ${member.role === 'captain' ? 'bg-primary/20 text-primary border border-primary/30' : 'bg-white/5 text-white/50 border border-white/10'}`}>
                                                            {member.role === 'captain' ? 'CAPTAIN' : 'OPERATIVE'}
                                                        </span>
                                                    </div>
                                                    <p className="text-[8px] text-white/30 truncate tracking-widest uppercase font-bold">
                                                        {member.user?.skills?.map(s => s.skill.name).join(", ") || "LEVEL 1 OPERATIVE"}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="grid grid-cols-2 gap-4 mt-auto">
                                    {team.status === 'forming' && team.currentSize < team.maxSize && (
                                        <button onClick={() => openMatchModal(team.id)} className="px-4 py-3 bg-primary/10 border border-primary/40 hover:bg-primary/20 hover:border-primary text-primary text-[10px] font-black uppercase tracking-widest transition-all active:scale-[0.98] rounded-sm flex items-center justify-center gap-2">
                                            <Sparkles className="w-3.5 h-3.5" /> RECRUIT AI
                                        </button>
                                    )}
                                    <button onClick={() => router.push(`/dashboard/teams/${team.id}/messages`)} className="px-4 py-3 border border-white/10 hover:border-white/30 text-white text-[10px] font-black uppercase tracking-widest transition-all active:scale-[0.98] rounded-sm bg-black flex items-center justify-center gap-2 col-span-1">
                                        <MessageCircle className="w-3.5 h-3.5" /> COMMS
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* AI Recruitment Overlay */}
            {matchModalTeamId && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setMatchModalTeamId(null)} />
                    <div className="relative bg-[#080808] border border-primary/30 rounded-sm w-full max-w-4xl max-h-[85vh] overflow-hidden flex flex-col">
                        <div className="p-8 border-b border-white/5">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-4">
                                    <Sparkles className="w-8 h-8 text-primary animate-pulse" />
                                    <h2 className="text-3xl font-black italic text-white uppercase tracking-tighter text-glow-sm">AI RECRUITMENT SYSTEM</h2>
                                </div>
                                <button onClick={() => setMatchModalTeamId(null)} className="p-2 text-white/40 hover:text-white transition-colors"><X className="w-6 h-6" /></button>
                            </div>
                            <p className="text-[10px] text-white/40 font-bold uppercase tracking-[0.2em]">ANALYZING SYNERGY PROFILES AND DEPLOYMENT RECORDS TO FIND OPTIMAL OPERATIVES.</p>
                        </div>

                        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                            {matchLoading ? (
                                <div className="flex flex-col items-center justify-center py-20 gap-4">
                                    <Loader2 className="w-10 h-10 text-primary animate-spin" />
                                    <span className="text-[10px] font-black text-primary uppercase tracking-[.3em] animate-pulse">SCANNING DATABASE...</span>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {matchResult?.suggestions.map((suggestion, idx) => (
                                        <SuggestionCard
                                            key={idx}
                                            suggestion={suggestion}
                                            rank={idx+1}
                                            teamId={matchModalTeamId}
                                            inviting={invitingUserId === suggestion.candidateId}
                                            onInvite={(tid, cid) => {
                                                setInvitingUserId(cid);
                                                matchingApi.inviteMatch(tid, cid).then(() => {
                                                    toast.success("INVITATION DISPATCHED");
                                                    setMatchResult(prev => prev ? { ...prev, suggestions: prev.suggestions.filter(s => s.candidateId !== cid)} : prev);
                                                }).finally(() => setInvitingUserId(null));
                                            }}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Create Team Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        onClick={() => setShowCreateModal(false)}
                    />
                    <div className="relative bg-[#080808] rounded-sm p-8 w-full max-w-lg border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.8)]">
                        <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-primary"></div>
                        <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-primary"></div>

                        <div className="flex items-center gap-3 mb-8">
                            <Plus className="w-6 h-6 text-primary" />
                            <h2 className="text-2xl font-black italic text-white uppercase tracking-tighter text-glow-sm">FORM SQUAD</h2>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-[10px] font-bold text-white/50 uppercase tracking-[0.15em] mb-2">SQUAD DESIGNATION</label>
                                <input
                                    type="text"
                                    value={newTeam.name}
                                    onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
                                    placeholder="ENTER SQUAD NAME..."
                                    className="w-full px-4 py-4 bg-black border border-white/10 rounded-sm text-white focus:outline-none focus:border-primary/50 transition-all text-xs font-bold uppercase tracking-widest"
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] font-bold text-white/50 uppercase tracking-[0.15em] mb-2">TARGET MISSION</label>
                                <div className="relative group">
                                    <select
                                        value={newTeam.hackathonId}
                                        onChange={(e) => setNewTeam({ ...newTeam, hackathonId: e.target.value })}
                                        className="w-full pl-4 pr-10 py-4 bg-black border border-white/10 rounded-sm text-white focus:outline-none focus:border-primary/50 transition-all appearance-none cursor-pointer text-xs font-bold uppercase tracking-widest"
                                    >
                                        <option value="">SELECT MISSION...</option>
                                        {hackathons.map(h => <option key={h.id} value={h.id}>{h.title}</option>)}
                                    </select>
                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary pointer-events-none" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-bold text-white/50 uppercase tracking-[0.15em] mb-2">MISSION DESCRIPTION</label>
                                <textarea
                                    value={newTeam.description}
                                    onChange={(e) => setNewTeam({ ...newTeam, description: e.target.value })}
                                    placeholder="OUTLINE MISSION GOALS..."
                                    rows={3}
                                    className="w-full px-4 py-4 bg-black border border-white/10 rounded-sm text-white focus:outline-none focus:border-primary/50 transition-all text-xs font-bold resize-none uppercase tracking-widest"
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] font-bold text-white/50 uppercase tracking-[0.15em] mb-2">UNIT CAPACITY</label>
                                <input
                                    type="number"
                                    value={newTeam.maxSize}
                                    onChange={(e) => setNewTeam({ ...newTeam, maxSize: parseInt(e.target.value) || 2 })}
                                    className="w-full px-4 py-4 bg-black border border-white/10 rounded-sm text-white focus:outline-none focus:border-primary/50 transition-all text-sm font-bold"
                                />
                            </div>
                        </div>

                        <div className="flex gap-4 mt-8">
                            <button onClick={() => setShowCreateModal(false)} className="flex-1 px-4 py-4 bg-black text-white text-[10px] font-black uppercase tracking-widest rounded-sm border border-white/10 hover:border-white/30 transition-all">ABORT</button>
                            <button onClick={handleCreateTeam} disabled={creating} className="flex-1 px-4 py-4 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-sm shadow-glow-sm hover:bg-primary-dark transition-all disabled:opacity-50">
                                {creating ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "LAUNCH SQUAD"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    </DashboardLayout>
  );
}
