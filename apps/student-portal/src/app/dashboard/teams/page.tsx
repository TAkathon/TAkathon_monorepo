"use client";

import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import {
    Users,
    Plus,
    UserPlus,
    Crown,
    Mail,
    Search,
    Calendar,
    Target,
    MessageCircle,
    ChevronDown,
} from "lucide-react";

const myTeams = [
    {
        id: 1,
        name: "Code Wizards",
        hackathon: "AI Innovators Challenge",
        hackathonDate: "March 15-17, 2026",
        role: "Captain",
        members: [
            { name: "John Doe", role: "Captain", skills: ["React", "Python"] },
            { name: "Jane Smith", role: "Member", skills: ["UI/UX", "Figma"] },
            { name: "Mike Johnson", role: "Member", skills: ["Node.js", "MongoDB"] },
            { name: "Sarah Williams", role: "Member", skills: ["ML", "TensorFlow"] },
        ],
        maxMembers: 5,
        status: "Looking for members",
        description: "Building an AI-powered healthcare diagnostic tool",
    },
    {
        id: 2,
        name: "Tech Titans",
        hackathon: "Web3 Summit (Past)",
        hackathonDate: "Feb 10-12, 2026",
        role: "Member",
        members: [
            { name: "Alice Brown", role: "Captain", skills: ["Solidity", "Web3"] },
            { name: "John Doe", role: "Member", skills: ["React", "Python"] },
            { name: "Bob Wilson", role: "Member", skills: ["Smart Contracts"] },
            { name: "Emma Davis", role: "Member", skills: ["Backend", "Security"] },
            { name: "Chris Lee", role: "Member", skills: ["Frontend", "React"] },
        ],
        maxMembers: 5,
        status: "Complete",
        description: "Developed a decentralized voting platform - Won 2nd Place!",
    },
];

export default function TeamsPage() {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newTeam, setNewTeam] = useState({
        name: "",
        hackathon: "",
        description: "",
        maxMembers: 5,
    });

    const handleCreateTeam = () => {
        // TODO: Create team logic
        console.log("Creating team:", newTeam);
        setShowCreateModal(false);
        setNewTeam({ name: "", hackathon: "", description: "", maxMembers: 5 });
    };

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
                <div className="space-y-6">
                    {myTeams.map((team) => (
                        <div key={team.id} className="glass rounded-xl p-6">
                            {/* Team Header */}
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <h2 className="text-2xl font-bold text-white">{team.name}</h2>
                                        {team.role === "Captain" && (
                                            <Crown className="w-5 h-5 text-yellow-500" />
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2 text-white/60 text-sm mb-2">
                                        <Calendar className="w-4 h-4" />
                                        <span>{team.hackathon}</span>
                                        <span>•</span>
                                        <span>{team.hackathonDate}</span>
                                    </div>
                                    <p className="text-white/70 text-sm">{team.description}</p>
                                </div>
                                <span
                                    className={`px-3 py-1 text-sm font-semibold rounded-full ${
                                        team.status === "Complete"
                                            ? "bg-green-500/20 text-green-400"
                                            : team.status === "Looking for members"
                                            ? "bg-primary/20 text-primary"
                                            : "bg-blue-500/20 text-blue-400"
                                    }`}
                                >
                                    {team.status}
                                </span>
                            </div>

                            {/* Members Grid */}
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                        <Users className="w-5 h-5 text-primary" />
                                        Team Members ({team.members.length}/{team.maxMembers})
                                    </h3>
                                    {team.role === "Captain" && team.members.length < team.maxMembers && (
                                        <button className="text-sm text-primary hover:text-primary-light flex items-center gap-1">
                                            <UserPlus className="w-4 h-4" />
                                            Invite
                                        </button>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {team.members.map((member, idx) => (
                                        <div
                                            key={idx}
                                            className="flex items-center gap-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-all"
                                        >
                                            <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-primary font-semibold">
                                                {member.name
                                                    .split(" ")
                                                    .map((n) => n[0])
                                                    .join("")}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <p className="font-medium text-white">{member.name}</p>
                                                    {member.role === "Captain" && (
                                                        <Crown className="w-3 h-3 text-yellow-500" />
                                                    )}
                                                </div>
                                                <div className="flex flex-wrap gap-1 mt-1">
                                                    {member.skills.slice(0, 2).map((skill) => (
                                                        <span
                                                            key={skill}
                                                            className="px-2 py-0.5 bg-white/10 text-white/60 text-xs rounded-full"
                                                        >
                                                            {skill}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                            <button className="p-2 text-white/40 hover:text-white hover:bg-white/5 rounded-lg transition-all">
                                                <Mail className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}

                                    {/* Empty slots */}
                                    {team.members.length < team.maxMembers &&
                                        team.role === "Captain" && (
                                            <button className="flex items-center justify-center gap-2 p-3 bg-white/5 border-2 border-dashed border-white/20 rounded-lg hover:bg-white/10 hover:border-primary/50 transition-all group">
                                                <UserPlus className="w-5 h-5 text-white/40 group-hover:text-primary" />
                                                <span className="text-white/60 group-hover:text-white">
                                                    Find Teammate
                                                </span>
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
                    ))}
                </div>

                {/* Create Team Modal */}
                {showCreateModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        {/* Backdrop */}
                        <div
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                            onClick={() => setShowCreateModal(false)}
                        />

                        {/* Modal */}
                        <div className="relative glass rounded-2xl p-6 w-full max-w-md">
                            <h2 className="text-2xl font-bold text-white mb-4">Create New Team</h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-white/60 mb-2">
                                        Team Name
                                    </label>
                                    <input
                                        type="text"
                                        value={newTeam.name}
                                        onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
                                        placeholder="Enter team name..."
                                        className="input-field"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-white/60 mb-2">
                                        Hackathon
                                    </label>
                                    <div className="relative">
                                        <select
                                            value={newTeam.hackathon}
                                            onChange={(e) =>
                                                setNewTeam({ ...newTeam, hackathon: e.target.value })
                                            }
                                            className="input-field appearance-none pr-10"
                                        >
                                            <option value="">Select a hackathon...</option>
                                            <option value="ai-innovators">AI Innovators Challenge</option>
                                            <option value="web3-summit">Web3 Summit Hackathon</option>
                                            <option value="climate-tech">Climate Tech Solutions</option>
                                        </select>
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-white/40">
                                            <ChevronDown className="w-4 h-4" />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-white/60 mb-2">
                                        Description
                                    </label>
                                    <textarea
                                        value={newTeam.description}
                                        onChange={(e) =>
                                            setNewTeam({ ...newTeam, description: e.target.value })
                                        }
                                        placeholder="Describe your project idea..."
                                        rows={3}
                                        className="input-field resize-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-white/60 mb-2">
                                        Max Team Size
                                    </label>
                                    <input
                                        type="number"
                                        min="2"
                                        max="10"
                                        value={newTeam.maxMembers}
                                        onChange={(e) =>
                                            setNewTeam({ ...newTeam, maxMembers: parseInt(e.target.value) })
                                        }
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
                                    className="flex-1 px-4 py-2 bg-primary hover:bg-primary-dark text-white font-semibold rounded-lg transition-all"
                                >
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
