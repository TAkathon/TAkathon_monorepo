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
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">My Profile</h1>
                        <p className="text-white/60">Manage your personal information and skills</p>
                    </div>
                    <button
                        onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
                        className="px-4 py-2 bg-primary hover:bg-primary-dark text-white font-semibold rounded-lg transition-all duration-200 flex items-center gap-2"
                    >
                        {isEditing ? (
                            <>
                                <Save className="w-4 h-4" />
                                Save Changes
                            </>
                        ) : (
                            <>
                                <Edit2 className="w-4 h-4" />
                                Edit Profile
                            </>
                        )}
                    </button>
                </div>

                {/* Profile Card */}
                <div className="glass rounded-xl p-6">
                    <div className="flex flex-col sm:flex-row gap-6">
                        {/* Avatar */}
                        <div className="flex-shrink-0">
                            <div className="w-32 h-32 bg-primary/20 rounded-full flex items-center justify-center text-primary text-4xl font-bold">
                                JD
                            </div>
                            {isEditing && (
                                <button className="mt-3 text-sm text-primary hover:text-primary-light">
                                    Change Photo
                                </button>
                            )}
                        </div>

                        {/* Basic Info */}
                        <div className="flex-1 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Full Name */}
                                <div>
                                    <label className="block text-sm font-medium text-white/60 mb-2">
                                        Full Name
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={profile.fullName}
                                            onChange={(e) =>
                                                setProfile({ ...profile, fullName: e.target.value })
                                            }
                                            className="input-field"
                                        />
                                    ) : (
                                        <p className="text-white font-semibold">{profile.fullName}</p>
                                    )}
                                </div>

                                {/* Email */}
                                <div>
                                    <label className="block text-sm font-medium text-white/60 mb-2">
                                        Email
                                    </label>
                                    <div className="flex items-center gap-2 text-white/70">
                                        <Mail className="w-4 h-4" />
                                        <span>{profile.email}</span>
                                    </div>
                                </div>

                                {/* Location */}
                                <div>
                                    <label className="block text-sm font-medium text-white/60 mb-2">
                                        Location
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={profile.location}
                                            onChange={(e) =>
                                                setProfile({ ...profile, location: e.target.value })
                                            }
                                            className="input-field"
                                        />
                                    ) : (
                                        <div className="flex items-center gap-2 text-white/70">
                                            <MapPin className="w-4 h-4" />
                                            <span>{profile.location}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Graduation Year */}
                                <div>
                                    <label className="block text-sm font-medium text-white/60 mb-2">
                                        Graduation Year
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={profile.graduationYear}
                                            onChange={(e) =>
                                                setProfile({ ...profile, graduationYear: e.target.value })
                                            }
                                            className="input-field"
                                        />
                                    ) : (
                                        <div className="flex items-center gap-2 text-white/70">
                                            <Calendar className="w-4 h-4" />
                                            <span>{profile.graduationYear}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Bio */}
                            <div>
                                <label className="block text-sm font-medium text-white/60 mb-2">Bio</label>
                                {isEditing ? (
                                    <textarea
                                        value={profile.bio}
                                        onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                                        rows={3}
                                        className="input-field resize-none"
                                    />
                                ) : (
                                    <p className="text-white/70">{profile.bio}</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Education */}
                <div className="glass rounded-xl p-6">
                    <h2 className="text-xl font-bold text-white mb-4">Education</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-white/60 mb-2">
                                University
                            </label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={profile.university}
                                    onChange={(e) =>
                                        setProfile({ ...profile, university: e.target.value })
                                    }
                                    className="input-field"
                                />
                            ) : (
                                <p className="text-white font-semibold">{profile.university}</p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-white/60 mb-2">Major</label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={profile.major}
                                    onChange={(e) => setProfile({ ...profile, major: e.target.value })}
                                    className="input-field"
                                />
                            ) : (
                                <p className="text-white font-semibold">{profile.major}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Skills */}
                <div className="glass rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-white">Skills</h2>
                        {isEditing && (
                            <button
                                onClick={() => {
                                    const name = prompt("Enter skill name:");
                                    if (name) setSkills([...skills, { name, level: "Beginner" }]);
                                }}
                                className="text-sm text-primary hover:text-primary-light"
                            >
                                + Add Skill
                            </button>
                        )}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {skills.map((skill, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between p-3 bg-white/5 rounded-lg group"
                            >
                                <span className="text-white font-medium">{skill.name}</span>
                                <div className="flex items-center gap-2">
                                    <span
                                        className={`px-2 py-1 text-xs rounded-full ${
                                            skill.level === "Advanced"
                                                ? "bg-green-500/20 text-green-400"
                                                : skill.level === "Intermediate"
                                                ? "bg-blue-500/20 text-blue-400"
                                                : "bg-yellow-500/20 text-yellow-400"
                                        }`}
                                    >
                                        {skill.level}
                                    </span>
                                    {isEditing && (
                                        <button
                                            onClick={() => setSkills(skills.filter((_, i) => i !== index))}
                                            className="p-1 text-white/40 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Social Links */}
                <div className="glass rounded-xl p-6">
                    <h2 className="text-xl font-bold text-white mb-4">Social Links</h2>
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <Github className="w-5 h-5 text-white/40" />
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={profile.github}
                                    onChange={(e) => setProfile({ ...profile, github: e.target.value })}
                                    placeholder="GitHub username"
                                    className="input-field flex-1"
                                />
                            ) : (
                                <a
                                    href={`https://github.com/${profile.github}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary hover:text-primary-light"
                                >
                                    github.com/{profile.github}
                                </a>
                            )}
                        </div>
                        <div className="flex items-center gap-3">
                            <Linkedin className="w-5 h-5 text-white/40" />
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={profile.linkedin}
                                    onChange={(e) =>
                                        setProfile({ ...profile, linkedin: e.target.value })
                                    }
                                    placeholder="LinkedIn username"
                                    className="input-field flex-1"
                                />
                            ) : (
                                <a
                                    href={`https://linkedin.com/in/${profile.linkedin}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary hover:text-primary-light"
                                >
                                    linkedin.com/in/{profile.linkedin}
                                </a>
                            )}
                        </div>
                        <div className="flex items-center gap-3">
                            <LinkIcon className="w-5 h-5 text-white/40" />
                            {isEditing ? (
                                <input
                                    type="url"
                                    value={profile.website}
                                    onChange={(e) =>
                                        setProfile({ ...profile, website: e.target.value })
                                    }
                                    placeholder="Personal website"
                                    className="input-field flex-1"
                                />
                            ) : (
                                <a
                                    href={profile.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary hover:text-primary-light"
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
