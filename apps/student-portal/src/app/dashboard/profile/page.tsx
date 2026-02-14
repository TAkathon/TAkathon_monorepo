"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Mail, Calendar, Link as LinkIcon, Save, Edit2, Github, Linkedin, Trash2, Loader2, Plus, X } from "lucide-react";
import { studentService, publicService } from "@/lib/api";

interface ProfileData {
    fullName: string;
    email: string;
    bio: string;
    avatarUrl: string;
    githubUrl: string;
    linkedinUrl: string;
    portfolioUrl: string;
    university: string;
    degree: string;
    graduationYear: number | null;
}

interface SkillData {
    id: string;
    skillId: string;
    skillName: string;
    category: string;
    proficiencyLevel: string;
    yearsOfExperience: number | null;
}

export default function ProfilePage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [profile, setProfile] = useState<ProfileData>({
        fullName: "",
        email: "",
        bio: "",
        avatarUrl: "",
        githubUrl: "",
        linkedinUrl: "",
        portfolioUrl: "",
        university: "",
        degree: "",
        graduationYear: null,
    });
    const [skills, setSkills] = useState<SkillData[]>([]);
    const [allSkills, setAllSkills] = useState<any[]>([]);
    const [showSkillPicker, setShowSkillPicker] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        setLoading(true);
        try {
            const res = await studentService.getProfile();
            const d = res.data?.data;
            if (d) {
                setProfile({
                    fullName: d.fullName || "",
                    email: d.email || "",
                    bio: d.bio || "",
                    avatarUrl: d.avatarUrl || "",
                    githubUrl: d.githubUrl || "",
                    linkedinUrl: d.linkedinUrl || "",
                    portfolioUrl: d.portfolioUrl || "",
                    university: d.university || "",
                    degree: d.degree || "",
                    graduationYear: d.graduationYear,
                });
                setSkills(d.skills || []);
            }
        } catch {
            /* empty */
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await studentService.updateProfile({
                fullName: profile.fullName,
                bio: profile.bio,
                githubUrl: profile.githubUrl,
                linkedinUrl: profile.linkedinUrl,
                portfolioUrl: profile.portfolioUrl,
                university: profile.university,
                degree: profile.degree,
                graduationYear: profile.graduationYear ?? undefined,
            });
            setIsEditing(false);
        } catch (err: any) {
            alert(err.response?.data?.error?.message || "Failed to save profile");
        } finally {
            setSaving(false);
        }
    };

    const handleAddSkill = async (skill: any) => {
        try {
            await studentService.addSkill({
                skillId: skill.id,
                proficiencyLevel: "beginner",
            });
            setShowSkillPicker(false);
            fetchProfile();
        } catch (err: any) {
            alert(err.response?.data?.error?.message || "Failed to add skill");
        }
    };

    const handleRemoveSkill = async (userSkillId: string) => {
        try {
            await studentService.removeSkill(userSkillId);
            setSkills(skills.filter((s) => s.id !== userSkillId));
        } catch (err: any) {
            alert(err.response?.data?.error?.message || "Failed to remove skill");
        }
    };

    const openSkillPicker = async () => {
        if (allSkills.length === 0) {
            try {
                const res = await publicService.listSkills();
                setAllSkills(res.data?.data?.skills || []);
            } catch {
                /* empty */
            }
        }
        setShowSkillPicker(true);
    };

    const existingSkillIds = new Set(skills.map((s) => s.skillId));

    if (loading) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                </div>
            </DashboardLayout>
        );
    }

    const initials = profile.fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

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
                        {isEditing ? (
                            <>
                                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                {saving ? "Saving..." : "Save Changes"}
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
                                {initials || "?"}
                            </div>
                        </div>

                        <div className="flex-1 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-white/60 mb-2">Full Name</label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={profile.fullName}
                                            onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                                            className="input-field"
                                        />
                                    ) : (
                                        <p className="text-white font-semibold">{profile.fullName}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-white/60 mb-2">Email</label>
                                    <div className="flex items-center gap-2 text-white/70">
                                        <Mail className="w-4 h-4" />
                                        <span>{profile.email}</span>
                                    </div>
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
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-white/60 mb-2">University</label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={profile.university}
                                    onChange={(e) => setProfile({ ...profile, university: e.target.value })}
                                    className="input-field"
                                />
                            ) : (
                                <p className="text-white font-semibold">{profile.university || "—"}</p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-white/60 mb-2">Degree</label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={profile.degree}
                                    onChange={(e) => setProfile({ ...profile, degree: e.target.value })}
                                    className="input-field"
                                />
                            ) : (
                                <p className="text-white font-semibold">{profile.degree || "—"}</p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-white/60 mb-2">Graduation Year</label>
                            {isEditing ? (
                                <input
                                    type="number"
                                    value={profile.graduationYear ?? ""}
                                    onChange={(e) => setProfile({ ...profile, graduationYear: e.target.value ? parseInt(e.target.value) : null })}
                                    className="input-field"
                                />
                            ) : (
                                <div className="flex items-center gap-2 text-white/70">
                                    <Calendar className="w-4 h-4" />
                                    <span>{profile.graduationYear || "—"}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Skills */}
                <div className="glass rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-white">Skills</h2>
                        <button onClick={openSkillPicker} className="text-sm text-primary hover:text-primary-light flex items-center gap-1">
                            <Plus className="w-4 h-4" />
                            Add Skill
                        </button>
                    </div>
                    {skills.length === 0 ? (
                        <p className="text-white/40 text-sm">No skills added yet. Click &ldquo;Add Skill&rdquo; to get started.</p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {skills.map((skill) => (
                                <div key={skill.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg group">
                                    <div>
                                        <span className="text-white font-medium">{skill.skillName}</span>
                                        <span className="text-white/40 text-xs ml-2">{skill.category}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span
                                            className={`px-2 py-1 text-xs rounded-full capitalize ${
                                                skill.proficiencyLevel === "advanced" || skill.proficiencyLevel === "expert"
                                                    ? "bg-green-500/20 text-green-400"
                                                    : skill.proficiencyLevel === "intermediate"
                                                    ? "bg-blue-500/20 text-blue-400"
                                                    : "bg-yellow-500/20 text-yellow-400"
                                            }`}
                                        >
                                            {skill.proficiencyLevel}
                                        </span>
                                        <button
                                            onClick={() => handleRemoveSkill(skill.id)}
                                            className="p-1 text-white/40 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
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
                                    value={profile.githubUrl}
                                    onChange={(e) => setProfile({ ...profile, githubUrl: e.target.value })}
                                    placeholder="GitHub URL"
                                    className="input-field flex-1"
                                />
                            ) : profile.githubUrl ? (
                                <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary-light">
                                    {profile.githubUrl}
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
                                    value={profile.linkedinUrl}
                                    onChange={(e) => setProfile({ ...profile, linkedinUrl: e.target.value })}
                                    placeholder="LinkedIn URL"
                                    className="input-field flex-1"
                                />
                            ) : profile.linkedinUrl ? (
                                <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary-light">
                                    {profile.linkedinUrl}
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
                                    value={profile.portfolioUrl}
                                    onChange={(e) => setProfile({ ...profile, portfolioUrl: e.target.value })}
                                    placeholder="Personal website"
                                    className="input-field flex-1"
                                />
                            ) : profile.portfolioUrl ? (
                                <a href={profile.portfolioUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary-light">
                                    {profile.portfolioUrl}
                                </a>
                            ) : (
                                <span className="text-white/40">Not set</span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Skill Picker Modal */}
            {showSkillPicker && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowSkillPicker(false)} />
                    <div className="relative glass rounded-2xl p-6 w-full max-w-md max-h-[70vh] flex flex-col">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-white">Add Skill</h2>
                            <button onClick={() => setShowSkillPicker(false)} className="p-1 text-white/40 hover:text-white">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="overflow-y-auto flex-1 space-y-2">
                            {allSkills
                                .filter((s) => !existingSkillIds.has(s.id))
                                .map((skill) => (
                                    <button
                                        key={skill.id}
                                        onClick={() => handleAddSkill(skill)}
                                        className="w-full text-left p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-all"
                                    >
                                        <span className="text-white font-medium">{skill.name}</span>
                                        <span className="text-white/40 text-xs ml-2">{skill.category}</span>
                                    </button>
                                ))}
                            {allSkills.filter((s) => !existingSkillIds.has(s.id)).length === 0 && (
                                <p className="text-white/40 text-center py-4">No more skills available</p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}
