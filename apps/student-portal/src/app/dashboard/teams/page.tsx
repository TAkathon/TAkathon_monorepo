"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import {
    Users,
    Plus,
    UserPlus,
    Crown,
    Mail,
    Calendar,
    Target,
    MessageCircle,
    ChevronDown,
    Loader2,
    X,
    Check,
    XCircle,
} from "lucide-react";
import { studentService } from "@/lib/api";

export default function TeamsPage() {
    const [teams, setTeams] = useState<any[]>([]);
    const [invitations, setInvitations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [creating, setCreating] = useState(false);
    const [hackathons, setHackathons] = useState<any[]>([]);
    const [newTeam, setNewTeam] = useState({
        name: "",
        hackathonId: "",
        description: "",
        maxMembers: 5,
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [teamsRes, invitationsRes] = await Promise.all([
                studentService.myTeams(),
                studentService.myInvitations(),
            ]);
            setTeams(teamsRes.data?.data || []);
            setInvitations(invitationsRes.data?.data || []);
        } catch {
            /* empty */
        } finally {
            setLoading(false);
        }
    };

    const openCreateModal = async () => {
        if (hackathons.length === 0) {
            try {
                const res = await studentService.myHackathons();
                setHackathons(res.data?.data || []);
            } catch {
                /* empty */
            }
        }
        setShowCreateModal(true);
    };

    const handleCreateTeam = async () => {
        if (!newTeam.name || !newTeam.hackathonId) return;
        setCreating(true);
        try {
            await studentService.createTeam({
                name: newTeam.name,
                hackathonId: newTeam.hackathonId,
                description: newTeam.description || undefined,
                maxMembers: newTeam.maxMembers,
            });
            setShowCreateModal(false);
            setNewTeam({ name: "", hackathonId: "", description: "", maxMembers: 5 });
            fetchData();
        } catch (err: any) {
            alert(err.response?.data?.error?.message || "Failed to create team");
        } finally {
            setCreating(false);
        }
    };

    const handleRespondInvitation = async (invitationId: string, response: "accept" | "reject") => {
        try {
            await studentService.respondToInvitation(invitationId, { response });
            fetchData();
        } catch (err: any) {
            alert(err.response?.data?.error?.message || "Failed to respond");
        }
    };

    if (loading) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center h-64">
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
                        onClick={openCreateModal}
                        className="px-4 py-2 bg-primary hover:bg-primary-dark text-white font-semibold rounded-lg transition-all duration-200 flex items-center gap-2"
                    >
                        <Plus className="w-5 h-5" />
                        Create Team
                    </button>
                </div>

                {/* Pending Invitations */}
                {invitations.length > 0 && (
                    <div className="glass rounded-xl p-6">
                        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <Mail className="w-5 h-5 text-primary" />
                            Pending Invitations ({invitations.length})
                        </h2>
                        <div className="space-y-3">
                            {invitations.map((inv: any) => (
                                <div key={inv.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                                    <div>
                                        <p className="text-white font-medium">{inv.team?.name}</p>
                                        <p className="text-white/60 text-sm">
                                            {inv.team?.hackathon?.title} &bull; Invited by {inv.inviter?.fullName}
                                        </p>
                                        {inv.message && <p className="text-white/40 text-sm mt-1">{inv.message}</p>}
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleRespondInvitation(inv.id, "accept")}
                                            className="p-2 bg-green-500/20 text-green-400 hover:bg-green-500/30 rounded-lg transition-all"
                                        >
                                            <Check className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleRespondInvitation(inv.id, "reject")}
                                            className="p-2 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-lg transition-all"
                                        >
                                            <XCircle className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Teams List */}
                {teams.length === 0 ? (
                    <div className="text-center py-12 glass rounded-xl">
                        <Users className="w-16 h-16 text-white/20 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-white/60 mb-2">No teams yet</h3>
                        <p className="text-white/40">Create a team or accept an invitation to get started</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {teams.map((team: any) => {
                            const isCaptain = team.role === "captain";
                            const members = team.members || [];
                            return (
                                <div key={team.id} className="glass rounded-xl p-6">
                                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <h2 className="text-2xl font-bold text-white">{team.name}</h2>
                                                {isCaptain && <Crown className="w-5 h-5 text-yellow-500" />}
                                            </div>
                                            <div className="flex items-center gap-2 text-white/60 text-sm mb-2">
                                                <Calendar className="w-4 h-4" />
                                                <span>{team.hackathon?.title}</span>
                                            </div>
                                            {team.description && (
                                                <p className="text-white/70 text-sm">{team.description}</p>
                                            )}
                                        </div>
                                        <span
                                            className={`px-3 py-1 text-sm font-semibold rounded-full capitalize ${
                                                team.status === "complete"
                                                    ? "bg-green-500/20 text-green-400"
                                                    : team.status === "forming"
                                                    ? "bg-primary/20 text-primary"
                                                    : "bg-blue-500/20 text-blue-400"
                                            }`}
                                        >
                                            {team.status?.replace(/_/g, " ")}
                                        </span>
                                    </div>

                                    {/* Members Grid */}
                                    <div>
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                                <Users className="w-5 h-5 text-primary" />
                                                Team Members ({members.length}/{team.maxMembers || "∞"})
                                            </h3>
                                            {isCaptain && (
                                                <button className="text-sm text-primary hover:text-primary-light flex items-center gap-1">
                                                    <UserPlus className="w-4 h-4" />
                                                    Invite
                                                </button>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {members.map((member: any, idx: number) => (
                                                <div
                                                    key={idx}
                                                    className="flex items-center gap-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-all"
                                                >
                                                    <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-primary font-semibold">
                                                        {(member.user?.fullName || "?")
                                                            .split(" ")
                                                            .map((n: string) => n[0])
                                                            .join("")}
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2">
                                                            <p className="font-medium text-white">
                                                                {member.user?.fullName || "Unknown"}
                                                            </p>
                                                            {member.role === "captain" && (
                                                                <Crown className="w-3 h-3 text-yellow-500" />
                                                            )}
                                                        </div>
                                                        <p className="text-white/40 text-xs capitalize">{member.role}</p>
                                                    </div>
                                                </div>
                                            ))}

                                            {/* Empty slot placeholder */}
                                            {isCaptain && members.length < (team.maxMembers || 999) && (
                                                <button className="flex items-center justify-center gap-2 p-3 bg-white/5 border-2 border-dashed border-white/20 rounded-lg hover:bg-white/10 hover:border-primary/50 transition-all group">
                                                    <UserPlus className="w-5 h-5 text-white/40 group-hover:text-primary" />
                                                    <span className="text-white/60 group-hover:text-white">Find Teammate</span>
                                                </button>
                                            )}
                                        </div>
                                    </div>

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
                                    </div>
                                </div>
                            );
                        })}
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
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-2xl font-bold text-white">Create New Team</h2>
                                <button onClick={() => setShowCreateModal(false)} className="p-1 text-white/40 hover:text-white">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-white/60 mb-2">Team Name</label>
                                    <input
                                        type="text"
                                        value={newTeam.name}
                                        onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
                                        placeholder="Enter team name..."
                                        className="input-field"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-white/60 mb-2">Hackathon</label>
                                    <div className="relative">
                                        <select
                                            value={newTeam.hackathonId}
                                            onChange={(e) => setNewTeam({ ...newTeam, hackathonId: e.target.value })}
                                            className="input-field appearance-none pr-10"
                                        >
                                            <option value="">Select a hackathon...</option>
                                            {hackathons.map((h: any) => (
                                                <option key={h.hackathonId || h.id} value={h.hackathonId || h.id}>
                                                    {h.hackathon?.title || h.title}
                                                </option>
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
                                        value={newTeam.maxMembers}
                                        onChange={(e) => setNewTeam({ ...newTeam, maxMembers: parseInt(e.target.value) })}
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
                                    disabled={creating || !newTeam.name || !newTeam.hackathonId}
                                    className="flex-1 px-4 py-2 bg-primary hover:bg-primary-dark text-white font-semibold rounded-lg transition-all disabled:opacity-50"
                                >
                                    {creating ? "Creating..." : "Create Team"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
