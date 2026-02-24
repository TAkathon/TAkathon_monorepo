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
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2 uppercase tracking-tight">Active Squads</h1>
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-primary animate-pulse rounded-full" />
                            <span className="text-xs text-white/40 uppercase tracking-[0.2em] font-bold">
                                Manage your hackathon teams and converge with allies
                            </span>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="px-6 py-2.5 bg-primary/20 hover:bg-primary border border-primary/40 hover:border-primary text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all duration-300 shadow-glow-primary/10 hover:shadow-glow-primary/20 flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Form Squad
                    </button>
                </div>

                {/* Teams List */}
                <div className="space-y-6">
                    {myTeams.map((team) => (
                        <div key={team.id} className="glass rounded-xl p-6">
                            {/* Team Header */}
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h2 className="text-2xl font-bold text-white uppercase tracking-tight">{team.name}</h2>
                                        {team.role === "Captain" && (
                                            <Crown className="w-5 h-5 text-yellow-500 drop-shadow-glow-sm" />
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2 text-[10px] text-white/40 uppercase tracking-widest font-bold mb-3">
                                        <Calendar className="w-3.5 h-3.5 text-primary" />
                                        <span className="text-primary-light">{team.hackathon}</span>
                                        <span className="opacity-20">•</span>
                                        <span>{team.hackathonDate}</span>
                                    </div>
                                    <p className="text-white/60 text-sm leading-relaxed">{team.description}</p>
                                </div>
                                <span
                                    className={`px-3 py-1 text-[10px] uppercase font-bold tracking-widest rounded-full border ${team.status === "Complete"
                                        ? "bg-green-500/10 text-green-400 border-green-500/20"
                                        : team.status === "Looking for members"
                                            ? "bg-primary/10 text-primary border-primary/20"
                                            : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                                        }`}
                                >
                                    {team.status}
                                </span>
                            </div>

                            {/* Members Grid */}
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                                        <Users className="w-4 h-4 text-primary" />
                                        Squad Cadre ({team.members.length}/{team.maxMembers})
                                    </h3>
                                    {team.role === "Captain" && team.members.length < team.maxMembers && (
                                        <button className="text-[10px] font-bold text-primary uppercase tracking-widest hover:text-primary-light flex items-center gap-1 transition-colors">
                                            <UserPlus className="w-3.5 h-3.5" />
                                            Recruit
                                        </button>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {team.members.map((member, idx) => (
                                        <div
                                            key={idx}
                                            className="flex items-center gap-3 p-4 bg-white/[0.02] border border-white/5 rounded-xl hover:bg-white/5 hover:border-primary/20 transition-all duration-300"
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
                            <div className="flex items-center gap-3 mt-8 pt-6 border-t border-white/5">
                                <button className="flex-1 px-4 py-2.5 bg-white/[0.04] hover:bg-white/[0.08] text-white text-[10px] uppercase font-bold tracking-widest rounded-xl transition-all duration-300 flex items-center justify-center gap-2 border border-white/5 hover:border-white/10">
                                    <MessageCircle className="w-4 h-4 text-primary" />
                                    Tactical Comms
                                </button>
                                <button className="flex-1 px-4 py-2.5 bg-white/[0.04] hover:bg-white/[0.08] text-white text-[10px] uppercase font-bold tracking-widest rounded-xl transition-all duration-300 flex items-center justify-center gap-2 border border-white/5 hover:border-white/10">
                                    <Target className="w-4 h-4 text-primary" />
                                    Mission Brief
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
                        <div className="relative glass rounded-2xl p-8 w-full max-w-md border border-white/10 shadow-glow-primary/20">
                            <div className="flex items-center gap-3 mb-6">
                                <Plus className="w-6 h-6 text-primary" />
                                <h2 className="text-2xl font-bold text-white uppercase tracking-tight text-glow-sm">Initialize Squad</h2>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] mb-2">
                                        Squad Designation
                                    </label>
                                    <input
                                        type="text"
                                        value={newTeam.name}
                                        onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
                                        placeholder="ENTER SQUAD NAME..."
                                        className="w-full px-4 py-3 bg-white/[0.02] border border-white/5 rounded-xl text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 focus:bg-white/5 transition-all text-sm uppercase tracking-widest font-medium"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] mb-2">
                                        Mission Area
                                    </label>
                                    <div className="relative group">
                                        <select
                                            value={newTeam.hackathon}
                                            onChange={(e) =>
                                                setNewTeam({ ...newTeam, hackathon: e.target.value })
                                            }
                                            className="w-full pl-4 pr-10 py-3 bg-white/[0.02] border border-white/5 rounded-xl text-white focus:outline-none focus:border-primary/50 focus:bg-white/5 transition-all appearance-none cursor-pointer text-sm uppercase tracking-widest font-medium"
                                        >
                                            <option value="" className="bg-dark text-white text-xs">SELECT MISSION...</option>
                                            <option value="ai-innovators" className="bg-dark text-white text-xs">AI Innovators Challenge</option>
                                            <option value="web3-summit" className="bg-dark text-white text-xs">Web3 Summit Hackathon</option>
                                            <option value="climate-tech" className="bg-dark text-white text-xs">Climate Tech Solutions</option>
                                        </select>
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-white/40 group-focus-within:text-primary transition-colors">
                                            <ChevronDown className="w-4 h-4" />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] mb-2">
                                        Objective Brief
                                    </label>
                                    <textarea
                                        value={newTeam.description}
                                        onChange={(e) =>
                                            setNewTeam({ ...newTeam, description: e.target.value })
                                        }
                                        placeholder="OUTLINE YOUR MISSION OBJECTIVES..."
                                        rows={3}
                                        className="w-full px-4 py-3 bg-white/[0.02] border border-white/5 rounded-xl text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 focus:bg-white/5 transition-all text-sm uppercase tracking-widest font-medium resize-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] mb-2">
                                        Operational Capacity
                                    </label>
                                    <input
                                        type="number"
                                        min="2"
                                        max="10"
                                        value={newTeam.maxMembers}
                                        onChange={(e) =>
                                            setNewTeam({ ...newTeam, maxMembers: parseInt(e.target.value) })
                                        }
                                        className="w-full px-4 py-3 bg-white/[0.02] border border-white/5 rounded-xl text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 focus:bg-white/5 transition-all text-sm uppercase tracking-widest font-medium"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4 mt-8">
                                <button
                                    onClick={() => setShowCreateModal(false)}
                                    className="flex-1 px-4 py-3 bg-white/[0.04] hover:bg-white/[0.08] text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all border border-white/5"
                                >
                                    Abort
                                </button>
                                <button
                                    onClick={handleCreateTeam}
                                    className="flex-1 px-4 py-3 bg-primary/20 hover:bg-primary border border-primary/40 hover:border-primary text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all shadow-glow-primary/10 hover:shadow-glow-primary/20"
                                >
                                    Launch Squad
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
