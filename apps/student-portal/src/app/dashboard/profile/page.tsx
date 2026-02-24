"use client";

import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { User, Mail, MapPin, Calendar, Link as LinkIcon, Save, Edit2, Github, Linkedin, Trash2 } from "lucide-react";

export default function ProfilePage() {
    const [isEditing, setIsEditing] = useState(false);
    const [profile, setProfile] = useState({
        fullName: "John Doe",
        email: "john.doe@example.com",
        bio: "Passionate developer and hackathon enthusiast. Love building innovative solutions with AI and web technologies.",
        location: "Tunis, Tunisia",
        university: "INSAT - National Institute of Applied Science and Technology",
        major: "Computer Science",
        graduationYear: "2026",
        github: "johndoe",
        linkedin: "johndoe",
        website: "https://johndoe.dev",
    });

    const [skills, setSkills] = useState([
        { name: "React", level: "Advanced" },
        { name: "Node.js", level: "Intermediate" },
        { name: "Python", level: "Advanced" },
        { name: "Machine Learning", level: "Beginner" },
        { name: "TypeScript", level: "Intermediate" },
        { name: "UI/UX Design", level: "Beginner" },
    ]);

    const handleSave = () => {
        // TODO: Save to backend
        setIsEditing(false);
        console.log("Saving profile:", profile);
    };

    return (
        <DashboardLayout>
            <div className="space-y-6 max-w-4xl">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2 uppercase tracking-tight">Personal Intel</h1>
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-primary animate-pulse rounded-full" />
                            <span className="text-xs text-white/40 uppercase tracking-[0.2em] font-bold">
                                Manage your identity and field expertise
                            </span>
                        </div>
                    </div>
                    <button
                        onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
                        className="px-6 py-2.5 bg-primary/20 hover:bg-primary border border-primary/40 hover:border-primary text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all duration-300 shadow-glow-primary/10 hover:shadow-glow-primary/20 flex items-center gap-2"
                    >
                        {isEditing ? (
                            <>
                                <Save className="w-4 h-4" />
                                Save Profile
                            </>
                        ) : (
                            <>
                                <Edit2 className="w-4 h-4" />
                                Edit Bio
                            </>
                        )}
                    </button>
                </div>

                <div className="glass rounded-2xl p-8 border border-white/10 shadow-glow-primary/5">
                    <div className="flex flex-col sm:flex-row gap-8">
                        {/* Avatar */}
                        <div className="flex-shrink-0 text-center">
                            <div className="w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center text-primary text-4xl font-bold border-2 border-primary/20 shadow-glow-primary/10">
                                JD
                            </div>
                            {isEditing && (
                                <button className="mt-4 text-[10px] font-bold text-primary uppercase tracking-widest hover:text-primary-light transition-colors">
                                    Refresh Avatar
                                </button>
                            )}
                        </div>

                        {/* Basic Info */}
                        <div className="flex-1 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Full Name */}
                                <div>
                                    <label className="block text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] mb-2">
                                        Agent Name
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={profile.fullName}
                                            onChange={(e) =>
                                                setProfile({ ...profile, fullName: e.target.value })
                                            }
                                            className="w-full px-4 py-3 bg-white/[0.02] border border-white/5 rounded-xl text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 focus:bg-white/5 transition-all text-sm uppercase tracking-widest font-medium"
                                        />
                                    ) : (
                                        <p className="text-white font-bold text-lg uppercase tracking-tight">{profile.fullName}</p>
                                    )}
                                </div>

                                {/* Email */}
                                <div>
                                    <label className="block text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] mb-2">
                                        Secure Link
                                    </label>
                                    <div className="flex items-center gap-2 text-primary-light font-medium bg-primary/5 px-4 py-3 rounded-xl border border-primary/10">
                                        <Mail className="w-4 h-4" />
                                        <span className="text-sm">{profile.email}</span>
                                    </div>
                                </div>

                                {/* Location */}
                                <div>
                                    <label className="block text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] mb-2">
                                        Operational Base
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={profile.location}
                                            onChange={(e) =>
                                                setProfile({ ...profile, location: e.target.value })
                                            }
                                            className="w-full px-4 py-3 bg-white/[0.02] border border-white/5 rounded-xl text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 focus:bg-white/5 transition-all text-sm uppercase tracking-widest font-medium"
                                        />
                                    ) : (
                                        <div className="flex items-center gap-2 text-white/60 font-medium bg-white/[0.02] px-4 py-3 rounded-xl border border-white/5">
                                            <MapPin className="w-4 h-4 text-primary" />
                                            <span className="text-sm">{profile.location}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Graduation Year */}
                                <div>
                                    <label className="block text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] mb-2">
                                        Deployment Year
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={profile.graduationYear}
                                            onChange={(e) =>
                                                setProfile({ ...profile, graduationYear: e.target.value })
                                            }
                                            className="w-full px-4 py-3 bg-white/[0.02] border border-white/5 rounded-xl text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 focus:bg-white/5 transition-all text-sm uppercase tracking-widest font-medium"
                                        />
                                    ) : (
                                        <div className="flex items-center gap-2 text-white/60 font-medium bg-white/[0.02] px-4 py-3 rounded-xl border border-white/5">
                                            <Calendar className="w-4 h-4 text-primary" />
                                            <span className="text-sm">{profile.graduationYear}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Bio */}
                            <div>
                                <label className="block text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] mb-2">Mission Briefing</label>
                                {isEditing ? (
                                    <textarea
                                        value={profile.bio}
                                        onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                                        rows={3}
                                        className="w-full px-4 py-3 bg-white/[0.02] border border-white/5 rounded-xl text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 focus:bg-white/5 transition-all text-sm tracking-widest font-medium resize-none leading-relaxed"
                                    />
                                ) : (
                                    <div className="bg-white/[0.02] p-5 rounded-xl border border-white/5">
                                        <p className="text-white/70 text-sm leading-relaxed">{profile.bio}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Education */}
                <div className="glass rounded-2xl p-8 border border-white/10 shadow-glow-primary/5">
                    <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-6 flex items-center gap-2">
                        <div className="w-1.5 h-4 bg-primary rounded-full" />
                        Academic Records
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] mb-2">
                                Headquarters
                            </label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={profile.university}
                                    onChange={(e) =>
                                        setProfile({ ...profile, university: e.target.value })
                                    }
                                    className="w-full px-4 py-3 bg-white/[0.02] border border-white/5 rounded-xl text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 focus:bg-white/5 transition-all text-sm uppercase tracking-widest font-medium"
                                />
                            ) : (
                                <p className="text-white font-bold uppercase tracking-tight">{profile.university}</p>
                            )}
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] mb-2">Field of Op</label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={profile.major}
                                    onChange={(e) => setProfile({ ...profile, major: e.target.value })}
                                    className="w-full px-4 py-3 bg-white/[0.02] border border-white/5 rounded-xl text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 focus:bg-white/5 transition-all text-sm uppercase tracking-widest font-medium"
                                />
                            ) : (
                                <p className="text-white font-bold uppercase tracking-tight">{profile.major}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Skills */}
                <div className="glass rounded-2xl p-8 border border-white/10 shadow-glow-primary/5">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                            <div className="w-1.5 h-4 bg-primary rounded-full" />
                            Technical Arsenal
                        </h2>
                        {isEditing && (
                            <button
                                onClick={() => {
                                    const name = prompt("Enter skill name:");
                                    if (name) setSkills([...skills, { name, level: "Beginner" }]);
                                }}
                                className="text-[10px] font-bold text-primary uppercase tracking-widest hover:text-primary-light transition-colors"
                            >
                                + Add Asset
                            </button>
                        )}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {skills.map((skill, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-xl group hover:border-primary/20 transition-all duration-300"
                            >
                                <span className="text-white font-bold uppercase tracking-widest text-xs">{skill.name}</span>
                                <div className="flex items-center gap-3">
                                    <span
                                        className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full border ${skill.level === "Advanced"
                                                ? "bg-green-500/10 text-green-400 border-green-500/20"
                                                : skill.level === "Intermediate"
                                                    ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                                                    : "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                                            }`}
                                    >
                                        {skill.level}
                                    </span>
                                    {isEditing && (
                                        <button
                                            onClick={() => setSkills(skills.filter((_, i) => i !== index))}
                                            className="p-1 text-white/20 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Social Links */}
                <div className="glass rounded-2xl p-8 border border-white/10 shadow-glow-primary/5">
                    <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-6 flex items-center gap-2">
                        <div className="w-1.5 h-4 bg-primary rounded-full" />
                        Network Protocols
                    </h2>
                    <div className="space-y-4">
                        <div className="flex items-center gap-4 bg-white/[0.02] p-4 rounded-xl border border-white/5">
                            <Github className="w-5 h-5 text-primary" />
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={profile.github}
                                    onChange={(e) => setProfile({ ...profile, github: e.target.value })}
                                    placeholder="GitHub username"
                                    className="bg-transparent border-none text-white focus:outline-none flex-1 text-sm uppercase tracking-widest font-medium"
                                />
                            ) : (
                                <a
                                    href={`https://github.com/${profile.github}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-white/60 hover:text-primary transition-colors text-sm font-bold uppercase tracking-widest"
                                >
                                    github.com/{profile.github}
                                </a>
                            )}
                        </div>
                        <div className="flex items-center gap-4 bg-white/[0.02] p-4 rounded-xl border border-white/5">
                            <Linkedin className="w-5 h-5 text-primary" />
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={profile.linkedin}
                                    onChange={(e) =>
                                        setProfile({ ...profile, linkedin: e.target.value })
                                    }
                                    placeholder="LinkedIn username"
                                    className="bg-transparent border-none text-white focus:outline-none flex-1 text-sm uppercase tracking-widest font-medium"
                                />
                            ) : (
                                <a
                                    href={`https://linkedin.com/in/${profile.linkedin}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-white/60 hover:text-primary transition-colors text-sm font-bold uppercase tracking-widest"
                                >
                                    linkedin.com/in/{profile.linkedin}
                                </a>
                            )}
                        </div>
                        <div className="flex items-center gap-4 bg-white/[0.02] p-4 rounded-xl border border-white/5">
                            <LinkIcon className="w-5 h-5 text-primary" />
                            {isEditing ? (
                                <input
                                    type="url"
                                    value={profile.website}
                                    onChange={(e) =>
                                        setProfile({ ...profile, website: e.target.value })
                                    }
                                    placeholder="Personal website"
                                    className="bg-transparent border-none text-white focus:outline-none flex-1 text-sm uppercase tracking-widest font-medium"
                                />
                            ) : (
                                <a
                                    href={profile.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-white/60 hover:text-primary transition-colors text-sm font-bold uppercase tracking-widest"
                                >
                                    {profile.website}
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
