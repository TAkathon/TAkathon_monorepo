"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Mail, MapPin, Calendar, Link as LinkIcon, Save, Edit2, Github, Linkedin, Loader2, Trash2, Plus, X } from "lucide-react";
import { studentApi, hackathonApi } from "@takathon/shared/api";
import { useAuthStore } from "@takathon/shared/utils";
import { toast } from "sonner";

interface ProfileData {
    fullName: string;
    email: string;
    bio: string;
    location: string;
    university: string;
    major: string;
    graduationYear: string;
    github: string;
    linkedin: string;
    website: string;
}

interface SkillData {
    id?: string;      // userSkill id (used for deletion)
    skillId?: string; // taxonomy skill id
    name: string;
    level: string;
}

interface TaxonomySkill {
    id: string;
    name: string;
    category: string;
}

export default function ProfilePage() {
    const { user } = useAuthStore();
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [profile, setProfile] = useState<ProfileData>({
        fullName: "",
        email: "",
        bio: "",
        location: "",
        university: "",
        major: "",
        graduationYear: "",
        github: "",
        linkedin: "",
        website: "",
    });
    const [skills, setSkills] = useState<SkillData[]>([]);
    const [availableSkills, setAvailableSkills] = useState<TaxonomySkill[]>([]);
    const [showAddSkill, setShowAddSkill] = useState(false);
    const [newSkillId, setNewSkillId] = useState("");
    const [newSkillLevel, setNewSkillLevel] = useState<"beginner" | "intermediate" | "advanced" | "expert">("beginner");
    const [addingSkill, setAddingSkill] = useState(false);

    useEffect(() => {
        fetchProfile();
        hackathonApi.listSkills().then(setAvailableSkills).catch(() => {});
    }, []);

    const fetchProfile = async () => {
        try {
            const data = await studentApi.getMyProfile();
            setProfile({
                fullName: data.fullName || user?.fullName || "",
                email: data.email || user?.email || "",
                bio: data.bio || "",
                location: "",
                university: data.studentProfile?.university || "",
                major: "",
                graduationYear: data.studentProfile?.graduationYear?.toString() || "",
                github: data.githubUrl || "",
                linkedin: data.linkedinUrl || "",
                website: data.portfolioUrl || "",
            });
            if (data.skills) {
                setSkills(
                    data.skills.map((s: any) => ({
                        id: s.id,
                        skillId: s.skillId,
                        name: s.skill?.name || s.name,
                        level: s.proficiencyLevel || "beginner",
                    }))
                );
            }
        } catch (error) {
            console.error("Failed to load profile:", error);
            toast.error("Failed to load profile");
            if (user) {
                setProfile((prev) => ({ ...prev, fullName: user.fullName, email: user.email }));
            }
        } finally {
            setLoading(false);
        }
    };

    const handleAddSkill = async () => {
        if (!newSkillId) { toast.error("Please select a skill"); return; }
        setAddingSkill(true);
        try {
            await studentApi.addSkill({ skillId: newSkillId, proficiencyLevel: newSkillLevel });
            const added = availableSkills.find(s => s.id === newSkillId);
            if (added) {
                setSkills(prev => [...prev, { skillId: added.id, name: added.name, level: newSkillLevel }]);
            }
            setShowAddSkill(false);
            setNewSkillId("");
            setNewSkillLevel("beginner");
            toast.success(`${added?.name} added!`);
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Failed to add skill");
        } finally {
            setAddingSkill(false);
        }
    };

    const handleRemoveSkill = async (skill: SkillData, index: number) => {
        if (!skill.id) {
            // Skill not yet saved — just remove from local state
            setSkills(prev => prev.filter((_, i) => i !== index));
            return;
        }
        try {
            await studentApi.removeSkill(skill.id);
            setSkills(prev => prev.filter((_, i) => i !== index));
            toast.success(`${skill.name} removed`);
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Failed to remove skill");
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await studentApi.updateMyProfile({
                bio: profile.bio,
                university: profile.university,
                graduationYear: profile.graduationYear ? parseInt(profile.graduationYear) : undefined,
                githubUrl: profile.github || undefined,
                linkedinUrl: profile.linkedin || undefined,
                portfolioUrl: profile.website || undefined,
            });
            toast.success("Profile saved successfully!");
            setIsEditing(false);
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to save profile");
        } finally {
            setSaving(false);
        }
    };

    const initials = profile.fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .substring(0, 2)
        .toUpperCase() || "??";

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
            <div className="space-y-6 max-w-4xl">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">My Profile</h1>
                        <p className="text-white/60">Manage your personal information and skills</p>
                    </div>
                    <button
                        onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
                        disabled={saving}
                        className="px-4 py-2 bg-primary hover:bg-primary-dark text-white font-semibold rounded-lg transition-all duration-200 flex items-center gap-2 disabled:opacity-50"
                    >
                        {saving ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Saving...
                            </>
                        ) : isEditing ? (
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
                        <div className="flex-shrink-0">
                            <div className="w-32 h-32 bg-primary/20 rounded-full flex items-center justify-center text-primary text-4xl font-bold">
                                {initials}
                            </div>
                        </div>
                        <div className="flex-1 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-white/60 mb-2">Full Name</label>
                                    <p className="text-white font-semibold">{profile.fullName}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-white/60 mb-2">Email</label>
                                    <div className="flex items-center gap-2 text-white/70">
                                        <Mail className="w-4 h-4" />
                                        <span>{profile.email}</span>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-white/60 mb-2">Location</label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={profile.location}
                                            onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                                            className="input-field"
                                            placeholder="e.g. Tunis, Tunisia"
                                        />
                                    ) : (
                                        <div className="flex items-center gap-2 text-white/70">
                                            <MapPin className="w-4 h-4" />
                                            <span>{profile.location || "Not set"}</span>
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-white/60 mb-2">Graduation Year</label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={profile.graduationYear}
                                            onChange={(e) => setProfile({ ...profile, graduationYear: e.target.value })}
                                            className="input-field"
                                            placeholder="e.g. 2026"
                                        />
                                    ) : (
                                        <div className="flex items-center gap-2 text-white/70">
                                            <Calendar className="w-4 h-4" />
                                            <span>{profile.graduationYear || "Not set"}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-white/60 mb-2">Bio</label>
                                {isEditing ? (
                                    <textarea
                                        value={profile.bio}
                                        onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                                        rows={3}
                                        className="input-field resize-none"
                                        placeholder="Tell us about yourself..."
                                    />
                                ) : (
                                    <p className="text-white/70">{profile.bio || "No bio yet"}</p>
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
                            <label className="block text-sm font-medium text-white/60 mb-2">University</label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={profile.university}
                                    onChange={(e) => setProfile({ ...profile, university: e.target.value })}
                                    className="input-field"
                                    placeholder="Your university name"
                                />
                            ) : (
                                <p className="text-white font-semibold">{profile.university || "Not set"}</p>
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
                                    placeholder="Your major / field of study"
                                />
                            ) : (
                                <p className="text-white font-semibold">{profile.major || "Not set"}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Skills */}
                <div className="glass rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-white">Skills</h2>
                        {isEditing && !showAddSkill && (
                            <button
                                onClick={() => setShowAddSkill(true)}
                                className="flex items-center gap-1 text-sm text-primary hover:text-primary-light"
                            >
                                <Plus className="w-4 h-4" /> Add Skill
                            </button>
                        )}
                    </div>
                    {/* Inline Add Skill Form */}
                    {isEditing && showAddSkill && (
                        <div className="mb-4 p-4 bg-white/5 border border-white/10 rounded-lg flex flex-col sm:flex-row gap-3 items-end">
                            <div className="flex-1">
                                <label className="block text-xs text-white/50 mb-1">Skill</label>
                                <select
                                    value={newSkillId}
                                    onChange={e => setNewSkillId(e.target.value)}
                                    className="input-field"
                                >
                                    <option value="">Select a skill…</option>
                                    {availableSkills
                                        .filter(s => !skills.some(existing => existing.skillId === s.id))
                                        .map(s => (
                                            <option key={s.id} value={s.id}>{s.name} ({s.category})</option>
                                        ))
                                    }
                                </select>
                            </div>
                            <div className="w-full sm:w-48">
                                <label className="block text-xs text-white/50 mb-1">Level</label>
                                <select
                                    value={newSkillLevel}
                                    onChange={e => setNewSkillLevel(e.target.value as typeof newSkillLevel)}
                                    className="input-field"
                                >
                                    <option value="beginner">Beginner</option>
                                    <option value="intermediate">Intermediate</option>
                                    <option value="advanced">Advanced</option>
                                    <option value="expert">Expert</option>
                                </select>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={handleAddSkill}
                                    disabled={addingSkill || !newSkillId}
                                    className="px-4 py-3 bg-primary hover:bg-primary-dark text-white text-sm font-semibold rounded-lg disabled:opacity-50 transition-all"
                                >
                                    {addingSkill ? <Loader2 className="w-4 h-4 animate-spin" /> : "Add"}
                                </button>
                                <button
                                    onClick={() => { setShowAddSkill(false); setNewSkillId(""); }}
                                    className="px-3 py-3 text-white/50 hover:text-white rounded-lg transition-all"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    )}
                    {skills.length === 0 ? (
                        <p className="text-white/40 text-sm">No skills added yet</p>
                    ) : (
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
                                                skill.level === "expert"
                                                    ? "bg-purple-500/20 text-purple-400"
                                                    : skill.level === "advanced"
                                                    ? "bg-green-500/20 text-green-400"
                                                    : skill.level === "intermediate"
                                                    ? "bg-blue-500/20 text-blue-400"
                                                    : "bg-yellow-500/20 text-yellow-400"
                                            }`}
                                        >
                                            {skill.level}
                                        </span>
                                        {isEditing && (
                                            <button
                                                onClick={() => handleRemoveSkill(skill, index)}
                                                className="p-1 text-white/40 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
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
                            ) : profile.github ? (
                                <a href={`https://github.com/${profile.github}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary-light">
                                    github.com/{profile.github}
                                </a>
                            ) : (
                                <span className="text-white/40">Not set</span>
                            )}
                        </div>
                        <div className="flex items-center gap-3">
                            <Linkedin className="w-5 h-5 text-white/40" />
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={profile.linkedin}
                                    onChange={(e) => setProfile({ ...profile, linkedin: e.target.value })}
                                    placeholder="LinkedIn username"
                                    className="input-field flex-1"
                                />
                            ) : profile.linkedin ? (
                                <a href={`https://linkedin.com/in/${profile.linkedin}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary-light">
                                    linkedin.com/in/{profile.linkedin}
                                </a>
                            ) : (
                                <span className="text-white/40">Not set</span>
                            )}
                        </div>
                        <div className="flex items-center gap-3">
                            <LinkIcon className="w-5 h-5 text-white/40" />
                            {isEditing ? (
                                <input
                                    type="url"
                                    value={profile.website}
                                    onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                                    placeholder="Personal website URL"
                                    className="input-field flex-1"
                                />
                            ) : profile.website ? (
                                <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary-light">
                                    {profile.website}
                                </a>
                            ) : (
                                <span className="text-white/40">Not set</span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );

}
