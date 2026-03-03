"use client";

import { useState, useEffect } from "react";
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
} from "lucide-react";
import { teamApi, studentApi, matchingApi } from "@takathon/shared/api";
import type { MatchSuggestion, MatchResult } from "@takathon/shared/api";
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
}

// ─── Suggestion Card ──────────────────────────────────────────────────────────

function ScoreBadge({ score }: { score: number }) {
    const pct = Math.round(score * 100);
    const color =
        pct >= 75 ? "text-green-400 bg-green-500/15 border-green-500/30" :
        pct >= 50 ? "text-primary bg-primary/15 border-primary/30" :
                    "text-white/60 bg-white/10 border-white/20";
    return (
        <span className={`px-2 py-0.5 text-xs font-bold rounded-full border ${color}`}>
            {pct}%
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
        <div className="bg-white/5 hover:bg-white/8 border border-white/10 rounded-xl p-4 transition-all">
            <div className="flex items-start gap-3">
                {/* Rank + avatar */}
                <div className="relative flex-shrink-0">
                    <div className="w-11 h-11 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold text-sm">
                        {initials || "?"}
                    </div>
                    <span className="absolute -top-1 -left-1 w-5 h-5 bg-white/10 rounded-full flex items-center justify-center text-white/60 text-[10px] font-bold">
                        {rank}
                    </span>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="font-semibold text-white truncate">{suggestion.fullName}</span>
                        <span className="text-white/40 text-sm">@{suggestion.username}</span>
                        <ScoreBadge score={suggestion.score} />
                    </div>

                    {/* Explanation */}
                    <p className="text-white/55 text-sm mb-2">{suggestion.explanation}</p>

                    {/* Score breakdown */}
                    <div className="flex items-center gap-3 text-xs text-white/40 mb-2">
                        <span>Skills {Math.round(suggestion.scoreBreakdown.skill * 100)}%</span>
                        <span>·</span>
                        <span>Exp {Math.round(suggestion.scoreBreakdown.experience * 100)}%</span>
                        <span>·</span>
                        <span>Avail {Math.round(suggestion.scoreBreakdown.availability * 100)}%</span>
                    </div>

                    {/* New skills chips */}
                    {suggestion.complementarySkills.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                            {suggestion.complementarySkills.slice(0, 5).map((skill) => (
                                <span
                                    key={skill}
                                    className="px-2 py-0.5 bg-primary/15 text-primary/90 text-xs rounded-full border border-primary/20"
                                >
                                    + {skill}
                                </span>
                            ))}
                            {suggestion.complementarySkills.length > 5 && (
                                <span className="px-2 py-0.5 bg-white/5 text-white/40 text-xs rounded-full">
                                    +{suggestion.complementarySkills.length - 5} more
                                </span>
                            )}
                        </div>
                    )}
                </div>

                {/* Invite button */}
                <button
                    onClick={() => onInvite(teamId, suggestion.candidateId)}
                    disabled={inviting}
                    className="flex-shrink-0 px-3 py-2 bg-primary hover:bg-primary-dark disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-all flex items-center gap-1"
                    title="Send invitation"
                >
                    {inviting ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <>
                            <Send className="w-3.5 h-3.5" />
                            Invite
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}

export default function TeamsPage() {
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
            const [teams, hackathons] = await Promise.all([
                teamApi.getMyTeams(),
                studentApi.browseHackathons({ status: "registration_open" }),
            ]);
            setTeams(teams as any);
            setHackathons(hackathons.map(h => ({ id: h.id, title: h.title })));
        } catch (error) {
            console.error("Failed to fetch data:", error);
            toast.error("Failed to load teams");
        } finally {
            setLoading(false);
        }
    };

    const handleCreateTeam = async () => {
        if (!newTeam.name.trim()) {
            toast.error("Team name is required");
            return;
        }
        if (!newTeam.hackathonId) {
            toast.error("Please select a hackathon");
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
            toast.success("Team created successfully!");
            setShowCreateModal(false);
            setNewTeam({ name: "", hackathonId: "", description: "", maxSize: 5 });
            fetchData();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to create team");
        } finally {
            setCreating(false);
        }
    };

    const handleLeaveTeam = async (teamId: string) => {
        if (!confirm("Are you sure you want to leave this team?")) return;
        try {
            await teamApi.leaveTeam(teamId);
            toast.success("Left team successfully");
            fetchData();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to leave team");
        }
    };

    // ── AI matching handlers ──────────────────────────────────────────────────

    const openMatchModal = async (teamId: string) => {
        setMatchModalTeamId(teamId);
        setMatchResult(null);
        setMatchLoading(true);
        try {
            const result = await matchingApi.suggestTeammates(teamId, 8);
            setMatchResult(result);
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to fetch suggestions");
            setMatchModalTeamId(null);
        } finally {
            setMatchLoading(false);
        }
    };

    const closeMatchModal = () => {
        setMatchModalTeamId(null);
        setMatchResult(null);
    };

    const handleInviteMatch = async (teamId: string, candidateId: string) => {
        setInvitingUserId(candidateId);
        try {
            await matchingApi.inviteMatch(teamId, candidateId);
            toast.success("Invitation sent!");
            // Optimistically remove the invited candidate from the list
            setMatchResult((prev) =>
                prev
                    ? {
                          ...prev,
                          suggestions: prev.suggestions.filter(
                              (s) => s.candidateId !== candidateId,
                          ),
                      }
                    : prev,
            );
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to send invitation");
        } finally {
            setInvitingUserId(null);
        }
    };

    if (loading) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center h-full min-h-[400px]">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">My Teams</h1>
                        <p className="text-white/60">Manage your hackathon teams and collaborate</p>
                    </div>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="px-4 py-2 bg-primary hover:bg-primary-dark text-white font-semibold rounded-lg transition-all duration-200 flex items-center gap-2"
                    >
                        <Plus className="w-5 h-5" />
                        Create Team
                    </button>
                </div>

                {/* Teams List */}
                {teams.length === 0 ? (
                    <div className="glass rounded-xl p-12 text-center">
                        <Users className="w-12 h-12 text-white/20 mx-auto mb-4" />
                        <p className="text-white/60 text-lg mb-2">No teams yet</p>
                        <p className="text-white/40 text-sm mb-6">Create a team or wait for an invitation</p>
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="px-4 py-2 bg-primary hover:bg-primary-dark text-white font-semibold rounded-lg transition-all"
                        >
                            Create Your First Team
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {teams.map((team) => (
                            <div key={team.id} className="glass rounded-xl p-6">
                                {/* Team Header */}
                                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <h2 className="text-2xl font-bold text-white">{team.name}</h2>
                                            {team.myRole === "captain" && (
                                                <Crown className="w-5 h-5 text-yellow-500" />
                                            )}
                                        </div>
                                        {team.hackathon && (
                                            <div className="flex items-center gap-2 text-white/60 text-sm mb-2">
                                                <Calendar className="w-4 h-4" />
                                                <span>{team.hackathon.title}</span>
                                            </div>
                                        )}
                                        {team.description && (
                                            <p className="text-white/70 text-sm">{team.description}</p>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span
                                            className={`px-3 py-1 text-sm font-semibold rounded-full ${
                                                team.status === "complete"
                                                    ? "bg-green-500/20 text-green-400"
                                                    : team.status === "forming"
                                                    ? "bg-primary/20 text-primary"
                                                    : "bg-white/10 text-white/60"
                                            }`}
                                        >
                                            {team.status}
                                        </span>
                                        <span className="px-3 py-1 text-sm bg-white/10 text-white/60 rounded-full">
                                            {team.currentSize}/{team.maxSize} members
                                        </span>
                                    </div>
                                </div>

                                {/* Members Grid */}
                                {team.members && team.members.length > 0 && (
                                    <div>
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                                <Users className="w-5 h-5 text-primary" />
                                                Team Members ({team.members.length}/{team.maxSize})
                                            </h3>
                                            {team.myRole === "captain" && team.currentSize < team.maxSize && (
                                                <button className="text-sm text-primary hover:text-primary-light flex items-center gap-1">
                                                    <UserPlus className="w-4 h-4" />
                                                    Invite
                                                </button>
                                            )}
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {team.members.map((member) => {
                                                const name = member.user?.fullName || member.userId;
                                                const initials = name.split(" ").map((n: string) => n[0]).join("").substring(0, 2);
                                                const skills = member.user?.skills?.map((s) => s.skill.name) || [];
                                                return (
                                                    <div
                                                        key={member.id}
                                                        className="flex items-center gap-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-all"
                                                    >
                                                        <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-primary font-semibold">
                                                            {initials}
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2">
                                                                <p className="font-medium text-white">{name}</p>
                                                                {member.role === "captain" && (
                                                                    <Crown className="w-3 h-3 text-yellow-500" />
                                                                )}
                                                            </div>
                                                            <div className="flex flex-wrap gap-1 mt-1">
                                                                {skills.slice(0, 2).map((skill: string) => (
                                                                    <span
                                                                        key={skill}
                                                                        className="px-2 py-0.5 bg-white/10 text-white/60 text-xs rounded-full"
                                                                    >
                                                                        {skill}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* Team Actions */}
                                <div className="flex items-center gap-3 mt-6 pt-6 border-t border-white/10">
                                    <button className="flex-1 px-4 py-2 bg-white/5 hover:bg-white/10 text-white font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2">
                                        <MessageCircle className="w-4 h-4" />
                                        Team Chat
                                    </button>
                                    <button className="flex-1 px-4 py-2 bg-white/5 hover:bg-white/10 text-white font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2">
                                        <Target className="w-4 h-4" />
                                        Project Details
                                    </button>
                                    {team.status === "forming" && team.currentSize < team.maxSize && (
                                        <button
                                            onClick={() => openMatchModal(team.id)}
                                            className="flex-1 px-4 py-2 bg-primary/20 hover:bg-primary/30 text-primary font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2 border border-primary/30"
                                        >
                                            <Sparkles className="w-4 h-4" />
                                            Find Teammates
                                        </button>
                                    )}
                                    {team.myRole !== "captain" && (
                                        <button
                                            onClick={() => handleLeaveTeam(team.id)}
                                            className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                            Leave
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Create Team Modal */}
                {showCreateModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                            onClick={() => setShowCreateModal(false)}
                        />
                        <div className="relative glass rounded-2xl p-6 w-full max-w-md">
                            <h2 className="text-2xl font-bold text-white mb-4">Create New Team</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-white/60 mb-2">Team Name *</label>
                                    <input
                                        type="text"
                                        value={newTeam.name}
                                        onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
                                        placeholder="Enter team name..."
                                        className="input-field"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-white/60 mb-2">Hackathon *</label>
                                    <div className="relative">
                                        <select
                                            value={newTeam.hackathonId}
                                            onChange={(e) => setNewTeam({ ...newTeam, hackathonId: e.target.value })}
                                            className="input-field appearance-none pr-10"
                                        >
                                            <option value="">Select a hackathon...</option>
                                            {hackathons.map((h) => (
                                                <option key={h.id} value={h.id}>{h.title}</option>
                                            ))}
                                        </select>
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-white/40">
                                            <ChevronDown className="w-4 h-4" />
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-white/60 mb-2">Description</label>
                                    <textarea
                                        value={newTeam.description}
                                        onChange={(e) => setNewTeam({ ...newTeam, description: e.target.value })}
                                        placeholder="Describe your project idea..."
                                        rows={3}
                                        className="input-field resize-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-white/60 mb-2">Max Team Size</label>
                                    <input
                                        type="number"
                                        min="2"
                                        max="10"
                                        value={newTeam.maxSize}
                                        onChange={(e) => setNewTeam({ ...newTeam, maxSize: parseInt(e.target.value) })}
                                        className="input-field"
                                    />
                                </div>
                            </div>
                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={() => setShowCreateModal(false)}
                                    className="flex-1 px-4 py-2 bg-white/5 hover:bg-white/10 text-white font-medium rounded-lg transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleCreateTeam}
                                    disabled={creating}
                                    className="flex-1 px-4 py-2 bg-primary hover:bg-primary-dark text-white font-semibold rounded-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {creating && <Loader2 className="w-4 h-4 animate-spin" />}
                                    Create Team
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* ── AI Matching Modal ───────────────────────────────────────── */}
                {matchModalTeamId && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div
                            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                            onClick={closeMatchModal}
                        />
                        <div className="relative glass rounded-2xl p-6 w-full max-w-2xl max-h-[85vh] flex flex-col">
                            {/* Modal header */}
                            <div className="flex items-center justify-between mb-5">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                                        <Sparkles className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-white">AI Teammate Suggestions</h2>
                                        <p className="text-white/50 text-sm">
                                            Ranked by skill fit, experience balance &amp; availability
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={closeMatchModal}
                                    className="p-2 hover:bg-white/10 rounded-lg transition-all text-white/50 hover:text-white"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Results */}
                            <div className="overflow-y-auto flex-1 space-y-3 pr-1">
                                {matchLoading ? (
                                    <div className="flex flex-col items-center justify-center py-16 gap-4">
                                        <Loader2 className="w-10 h-10 text-primary animate-spin" />
                                        <p className="text-white/60">Analysing skills and finding the best matches…</p>
                                    </div>
                                ) : matchResult && matchResult.suggestions.length > 0 ? (
                                    <>
                                        {matchResult.fallback && (
                                            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg px-4 py-2 text-yellow-400 text-sm mb-4">
                                                AI engine is currently offline — showing basic skill-match results.
                                            </div>
                                        )}
                                        <p className="text-white/40 text-xs mb-2">
                                            {matchResult.totalCandidates} candidate
                                            {matchResult.totalCandidates !== 1 ? "s" : ""} evaluated •{" "}
                                            showing top {matchResult.suggestions.length}
                                        </p>
                                        {matchResult.suggestions.map((s, idx) => (
                                            <SuggestionCard
                                                key={s.candidateId}
                                                suggestion={s}
                                                rank={idx + 1}
                                                teamId={matchModalTeamId}
                                                inviting={invitingUserId === s.candidateId}
                                                onInvite={handleInviteMatch}
                                            />
                                        ))}
                                    </>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-16 gap-3">
                                        <Users className="w-10 h-10 text-white/20" />
                                        <p className="text-white/60">No available candidates found.</p>
                                        <p className="text-white/40 text-sm">
                                            All registered participants may already be in a team.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
