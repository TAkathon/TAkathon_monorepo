"use client";

import { useState, useEffect } from "react";
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
    Trash2,
} from "lucide-react";
import api from "@takathon/shared/api";
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

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [teamsRes, hackathonsRes] = await Promise.all([
                api.get("/api/v1/students/teams"),
                api.get("/api/v1/students/hackathons"),
            ]);
            setTeams(teamsRes.data.data || []);
            setHackathons(hackathonsRes.data.data || []);
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
            await api.post("/api/v1/students/teams", {
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
            await api.delete(`/api/v1/students/teams/${teamId}/leave`);
            toast.success("Left team successfully");
            fetchData();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to leave team");
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
            </div>
        </DashboardLayout>
    );
}
