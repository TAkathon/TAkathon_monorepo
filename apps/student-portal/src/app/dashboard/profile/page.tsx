"use client";

import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { UserSquare, Trophy, Plus, Code } from "lucide-react";

export default function ProfilePage() {
    const [profile, setProfile] = useState({
        fullName: "John Doe",
        username: "@johndoe_dev",
        bio: "Full-stack developer obsessed with clean code and cybernetic interfaces. Building the future of the web one div at a time. Level 5 Takathon veteran.",
    });

    const [skills, setSkills] = useState([
        "Python", "React.js", "TensorFlow", "UI/UX Design", "Rust", "Node.js", "Cybersecurity"
    ]);

    return (
        <DashboardLayout>
            <div className="max-w-6xl mx-auto pb-12">
                {/* Header section */}
                <div className="mb-12">
                    <div className="flex items-center relative mb-2">
                        <h1 className="text-5xl md:text-6xl font-black italic tracking-tighter uppercase text-white">
                            PLAYER <span className="text-white text-glow-sm">PROFILE</span>
                        </h1>
                        <div className="flex ml-4 gap-1 opacity-60 mt-4">
                            <div className="w-12 h-1 bg-primary"></div>
                            <div className="w-2 h-1 bg-primary"></div>
                            <div className="w-1 h-1 bg-primary"></div>
                        </div>
                    </div>
                    <div className="max-w-3xl mt-4">
                        <p className="text-[10px] text-white/50 uppercase tracking-[0.2em] font-bold leading-relaxed">
                            MANAGE YOUR IDENTITY, SHOWCASE YOUR SKILLS, AND TRACK YOUR ACHIEVEMENTS IN THE TAKATHON UNIVERSE.
                        </p>
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Top Identity Card */}
                    <div className="relative p-8 bg-[#080808] border border-white/5 rounded-sm overflow-hidden flex flex-col md:flex-row gap-10 items-start">
                        {/* Corner Accents */}
                        <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-primary"></div>
                        <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-primary"></div>

                        {/* ID Card Watermark */}
                        <div className="absolute top-8 right-8 text-white/5 pointer-events-none hidden md:block">
                            <UserSquare className="w-48 h-48" strokeWidth={1} />
                        </div>

                        {/* Avatar Section */}
                        <div className="flex flex-col items-center gap-6 z-10 shrunk-0">
                            <div className="relative">
                                {/* Outer glowing ring */}
                                <div className="absolute -inset-2 rounded-full border border-primary/40 shadow-[0_0_20px_rgba(255,92,0,0.3)] pointer-events-none"></div>
                                <div className="w-40 h-40 rounded-full bg-white/5 border border-white/10 overflow-hidden flex items-center justify-center text-4xl font-black text-white/20">
                                    <img src="https://api.dicebear.com/7.x/notionists/svg?seed=John&backgroundColor=transparent" alt="Avatar" className="w-full h-full object-cover" />
                                </div>
                                {/* Online Status Dot */}
                                <div className="absolute bottom-2 right-2 w-5 h-5 bg-green-500 rounded-full border-2 border-black shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                            </div>
                            <button className="px-6 py-2.5 bg-transparent border border-primary/30 text-primary text-[10px] font-bold uppercase tracking-widest hover:bg-primary/5 hover:border-primary transition-all rounded-sm w-full">
                                CHANGE AVATAR
                            </button>
                        </div>

                        {/* Input Fields Section */}
                        <div className="flex-1 w-full z-10 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Full Name */}
                                <div>
                                    <label className="block text-[10px] font-bold text-white/50 uppercase tracking-[0.15em] mb-2">
                                        FULL NAME
                                    </label>
                                    <input
                                        type="text"
                                        value={profile.fullName}
                                        onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                                        className="w-full px-4 py-4 bg-black border border-white/5 text-white focus:outline-none focus:border-primary/50 transition-all text-sm font-medium rounded-sm"
                                    />
                                </div>

                                {/* Username */}
                                <div>
                                    <label className="block text-[10px] font-bold text-white/50 uppercase tracking-[0.15em] mb-2">
                                        USERNAME
                                    </label>
                                    <input
                                        type="text"
                                        value={profile.username}
                                        onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                                        className="w-full px-4 py-4 bg-black border border-white/5 text-white/70 focus:outline-none focus:border-primary/50 transition-all text-sm font-medium rounded-sm"
                                    />
                                </div>
                            </div>

                            {/* Bio */}
                            <div>
                                <label className="block text-[10px] font-bold text-white/50 uppercase tracking-[0.15em] mb-2">
                                    BIO / MISSION STATEMENT
                                </label>
                                <textarea
                                    value={profile.bio}
                                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                                    rows={4}
                                    className="w-full px-4 py-4 bg-black border border-white/5 text-white/80 focus:outline-none focus:border-primary/50 transition-all text-sm font-medium resize-none leading-relaxed rounded-sm"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Bottom Row Area */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Skillset Matrix - Takes up 2 cols */}
                        <div className="lg:col-span-2 relative p-8 bg-[#080808] border border-white/5 rounded-sm">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-xl font-black text-white uppercase tracking-tighter flex items-center gap-2">
                                    <Code className="w-5 h-5 text-primary" /> SKILLSET MATRIX
                                </h2>
                                <button className="flex items-center gap-1 px-4 py-2 border border-white/10 hover:border-primary text-primary text-[10px] font-bold uppercase tracking-widest transition-all rounded-sm bg-black">
                                    <Plus className="w-3 h-3" /> ADD SKILL
                                </button>
                            </div>

                            <div className="flex flex-wrap gap-3">
                                {skills.map((skill, index) => (
                                    <div
                                        key={index}
                                        className="px-4 py-2.5 bg-white/[0.03] border border-white/10 hover:border-primary/50 hover:bg-white/[0.05] transition-all cursor-default relative w-fit overflow-hidden"
                                    >
                                        <div className="absolute top-0 right-0 w-2 h-2 border-b border-l border-black bg-black/50 transform translate-x-1 -translate-y-1 rotate-45"></div>
                                        <div className="absolute bottom-0 right-0 w-2 h-2 border-t border-l border-black bg-black/50 transform translate-x-1 translate-y-1 rotate-45"></div>
                                        <span className="text-xs font-medium text-white/80">{skill}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Experience Level - Takes 1 col */}
                        <div className="relative p-8 bg-[#080808] border border-white/5 rounded-sm">
                            <h2 className="text-xl font-black text-white italic tracking-tighter uppercase flex items-center gap-3 mb-6">
                                <Trophy className="w-5 h-5 text-primary" /> EXPERIENCE<br />LEVEL
                            </h2>

                            <div className="flex justify-between items-baseline mb-2">
                                <span className="text-4xl font-black text-primary italic tracking-tighter">LVL<br />05</span>
                                <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest text-right">3,450 / 5,000<br />XP</span>
                            </div>

                            <div className="h-4 bg-black border border-white/10 rounded-sm relative mt-4 overflow-hidden p-0.5">
                                <div className="h-full bg-gradient-to-r from-primary/50 to-primary w-[69%] relative">
                                    {/* Stripes pattern on progress bar */}
                                    <div className="absolute inset-0 opacity-20 bg-[repeating-linear-gradient(45deg,transparent,transparent_2px,#000_2px,#000_4px)]"></div>
                                </div>
                            </div>

                            <div className="flex justify-between mt-3 text-[8px] font-bold uppercase tracking-[0.2em] text-white/30">
                                <span>ROOKIE</span>
                                <span>VETERAN</span>
                                <span>ELITE</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

