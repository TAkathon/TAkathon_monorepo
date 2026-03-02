"use client";

import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Plus, Users, Crown, ChevronDown } from "lucide-react";

const myTeams = [
    {
        id: 1,
        name: "CODE WIZARDS",
        mission: "AI INNOVATORS CHALLENGE",
        capacity: "4 / 5",
        status: "LOOKING FOR MEMBERS",
        description: "Building an AI-powered healthcare diagnostic tool. Looking for a frontend specialist with React experience.",
        members: [
            { name: "John Doe", role: "CAPTAIN", skills: "React, Python", isCaptain: true },
            { name: "Jane Smith", role: "OPERATIVE", skills: "UI/UX, Figma" },
            { name: "Mike Johnson", role: "OPERATIVE", skills: "Node.js, MongoDB" },
            { name: "Sarah Williams", role: "OPERATIVE", skills: "ML, TensorFlow" },
        ],
        openSlots: "1 SLOT AVAILABLE - FRONTEND"
    }
];

export default function TeamsPage() {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [activeTab, setActiveTab] = useState("ACTIVE SQUADS");

    const tabs = [
        { id: "ACTIVE SQUADS", label: "ACTIVE SQUADS" },
        { id: "INVITATIONS", label: "INVITATIONS (2)" },
        { id: "PAST MISSIONS", label: "PAST MISSIONS" },
    ];

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
                        className="px-6 py-3 border border-primary text-primary text-xs font-bold uppercase tracking-widest hover:bg-primary/5 transition-all rounded-sm flex items-center gap-2 whitespace-nowrap"
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
                            className={`px-8 py-4 text-xs font-bold uppercase tracking-widest transition-all relative whitespace-nowrap ${activeTab === tab.id
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
                        {myTeams.map((team) => (
                            <div key={team.id} className="relative p-6 bg-[#080808] border border-white/5 rounded-sm overflow-hidden flex flex-col">
                                {/* Corner Accents */}
                                <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-primary"></div>
                                <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-primary"></div>

                                {/* Header */}
                                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
                                    <div>
                                        <h2 className="text-2xl font-black text-white italic tracking-tighter uppercase mb-2">
                                            {team.name}
                                        </h2>
                                        <div className="flex flex-col gap-1">
                                            <p className="text-[10px] font-bold text-primary uppercase tracking-widest">
                                                MISSION: {team.mission}
                                            </p>
                                            <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest">
                                                CAPACITY: {team.capacity} OPERATIVES
                                            </p>
                                        </div>
                                    </div>
                                    <span className="px-3 py-1 text-[8px] font-bold uppercase tracking-widest border border-primary text-primary bg-primary/5 rounded-sm h-fit whitespace-nowrap">
                                        {team.status}
                                    </span>
                                </div>

                                <p className="text-sm text-white/70 leading-relaxed mb-6 flex-1 text-medium">
                                    {team.description}
                                </p>

                                {/* Roster */}
                                <div className="mb-6">
                                    <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] flex items-center gap-2 mb-4">
                                        <div className="w-1.5 h-1.5 bg-white/40 rotate-45"></div>
                                        ROSTER
                                    </h3>
                                    <div className="space-y-3">
                                        {team.members.map((member, idx) => (
                                            <div key={idx} className="flex items-center gap-4 bg-black border border-white/5 p-3 rounded-sm">
                                                <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
                                                    <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${member.name}&backgroundColor=transparent`} alt={member.name} className="w-full h-full object-cover opacity-80" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="text-sm font-bold text-white truncate">{member.name}</span>
                                                        <span className={`text-[8px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-sm ${member.isCaptain ? 'bg-primary/20 text-primary border border-primary/30' : 'bg-white/5 text-white/50 border border-white/10'}`}>
                                                            {member.role}
                                                        </span>
                                                    </div>
                                                    <p className="text-[10px] text-white/40 truncate tracking-widest uppercase">{member.skills}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Open Slots */}
                                {team.openSlots && (
                                    <div className="mb-8 p-3 bg-primary/5 border border-primary/20 rounded-sm">
                                        <p className="text-[10px] font-bold text-primary uppercase tracking-[0.1em] text-center">
                                            {team.openSlots}
                                        </p>
                                    </div>
                                )}

                                {/* Actions */}
                                <div className="grid grid-cols-2 gap-4 mt-auto">
                                    <button className="px-4 py-3 border border-white/10 hover:border-white/30 text-white text-[10px] font-bold uppercase tracking-widest transition-all rounded-sm bg-black">
                                        MANAGE SQUAD
                                    </button>
                                    <button className="px-4 py-3 bg-primary/10 border border-primary/40 hover:bg-primary/20 hover:border-primary text-primary text-[10px] font-bold uppercase tracking-widest transition-all rounded-sm">
                                        MISSION BRIEF
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Create Team Modal */}
                {showCreateModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                            onClick={() => setShowCreateModal(false)}
                        />
                        <div className="relative bg-[#080808] rounded-sm p-8 w-full max-w-md border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.8)]">
                            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-primary"></div>
                            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-primary"></div>

                            <div className="flex items-center gap-3 mb-8">
                                <Plus className="w-6 h-6 text-primary" />
                                <h2 className="text-2xl font-black italic text-white uppercase tracking-tighter text-glow-sm">FORM SQUAD</h2>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-[10px] font-bold text-white/50 uppercase tracking-[0.15em] mb-2">
                                        SQUAD DESIGNATION
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="ENTER SQUAD NAME..."
                                        className="w-full px-4 py-3 bg-black border border-white/5 rounded-sm text-white focus:outline-none focus:border-primary/50 transition-all text-sm font-medium"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[10px] font-bold text-white/50 uppercase tracking-[0.15em] mb-2">
                                        MISSION AREA
                                    </label>
                                    <div className="relative group">
                                        <select
                                            className="w-full pl-4 pr-10 py-3 bg-black border border-white/5 rounded-sm text-white focus:outline-none focus:border-primary/50 transition-all appearance-none cursor-pointer text-sm uppercase font-medium tracking-widest"
                                        >
                                            <option value="" className="bg-dark text-white text-xs">SELECT MISSION...</option>
                                            <option value="ai-innovators" className="bg-dark text-white text-xs">AI Innovators Challenge</option>
                                            <option value="web3-summit" className="bg-dark text-white text-xs">Web3 Summit Hackathon</option>
                                        </select>
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-white/40 group-focus-within:text-primary transition-colors">
                                            <ChevronDown className="w-4 h-4" />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[10px] font-bold text-white/50 uppercase tracking-[0.15em] mb-2">
                                        OBJECTIVE BRIEF
                                    </label>
                                    <textarea
                                        placeholder="OUTLINE YOUR MISSION OBJECTIVES..."
                                        rows={3}
                                        className="w-full px-4 py-3 bg-black border border-white/5 rounded-sm text-white focus:outline-none focus:border-primary/50 transition-all text-sm font-medium resize-none uppercase tracking-widest"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[10px] font-bold text-white/50 uppercase tracking-[0.15em] mb-2">
                                        OPERATIONAL CAPACITY
                                    </label>
                                    <input
                                        type="number"
                                        min="2"
                                        max="10"
                                        defaultValue={5}
                                        className="w-full px-4 py-3 bg-black border border-white/5 rounded-sm text-white focus:outline-none focus:border-primary/50 transition-all text-sm font-medium"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4 mt-8">
                                <button
                                    onClick={() => setShowCreateModal(false)}
                                    className="flex-1 px-4 py-3 bg-black text-white text-[10px] font-bold uppercase tracking-widest rounded-sm transition-all border border-white/10 hover:border-white/30"
                                >
                                    ABORT
                                </button>
                                <button
                                    onClick={() => setShowCreateModal(false)}
                                    className="flex-1 px-4 py-3 bg-primary/20 border border-primary/40 hover:bg-primary/30 hover:border-primary text-primary text-[10px] font-bold uppercase tracking-widest rounded-sm transition-all"
                                >
                                    LAUNCH SQUAD
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
