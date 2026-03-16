"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import {
  Mail,
  MapPin,
  Calendar,
  Link as LinkIcon,
  Save,
  Edit2,
  Github,
  Linkedin,
  Loader2,
  Trash2,
  Plus,
  X,
  UserSquare,
  Trophy,
  Code,
  Activity,
  ChevronRight
} from "lucide-react";
import { studentApi, hackathonApi } from "@takathon/shared/api";
import { useAuthStore } from "@takathon/shared/utils";
import { SkeletonProfileSection } from "@takathon/shared/ui";
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
  id?: string; // userSkill id (used for deletion)
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
  const [newSkillLevel, setNewSkillLevel] = useState<
    "beginner" | "intermediate" | "advanced" | "expert"
  >("beginner");
  const [addingSkill, setAddingSkill] = useState(false);

  useEffect(() => {
    fetchProfile();
    hackathonApi
      .listSkills()
      .then(setAvailableSkills)
      .catch(() => {});
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await studentApi.getMyProfile();
      setProfile({
        fullName: data.fullName || user?.fullName || "",
        email: data.email || user?.email || "",
        bio: data.bio || "",
        location: "", // Backend might need to provide this, defaulting to empty for now
        university: data.university || "",
        major: data.degree || "",
        graduationYear: data.graduationYear?.toString() || "",
        github: data.githubUrl || "",
        linkedin: data.linkedinUrl || "",
        website: data.portfolioUrl || "",
      });
      if (data.skills) {
        setSkills(
          data.skills.map((s: any) => ({
            id: s.id,
            skillId: s.skillId,
            name: s.skillName || s.skill?.name || s.name || "",
            level: s.proficiencyLevel || "beginner",
          })),
        );
      }
    } catch (error) {
      console.error("Failed to load profile:", error);
      toast.error("Failed to load profile");
      if (user) {
        setProfile((prev) => ({
          ...prev,
          fullName: user.fullName,
          email: user.email,
        }));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddSkill = async () => {
    if (!newSkillId) {
      toast.error("PLEASE SELECT A SKILL");
      return;
    }
    setAddingSkill(true);
    try {
      await studentApi.addSkill({
        skillId: newSkillId,
        proficiencyLevel: newSkillLevel,
      });
      await fetchProfile();
      setShowAddSkill(false);
      setNewSkillId("");
      setNewSkillLevel("beginner");
      const added = availableSkills.find((s) => s.id === newSkillId);
      toast.success(`${added?.name ?? "Skill"} registered to matrix!`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "FAILED TO ADD SKILL");
    } finally {
      setAddingSkill(false);
    }
  };

  const handleRemoveSkill = async (skill: SkillData, index: number) => {
    if (!skill.id) {
      setSkills((prev) => prev.filter((_, i) => i !== index));
      return;
    }
    try {
      await studentApi.removeSkill(skill.id);
      setSkills((prev) => prev.filter((_, i) => i !== index));
      toast.success(`${skill.name} removed from matrix`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "FAILED TO REMOVE SKILL");
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await studentApi.updateMyProfile({
        fullName: profile.fullName || undefined,
        bio: profile.bio || undefined,
        university: profile.university || undefined,
        degree: profile.major || undefined,
        graduationYear: profile.graduationYear
          ? parseInt(profile.graduationYear)
          : undefined,
        githubUrl: profile.github || undefined,
        linkedinUrl: profile.linkedin || undefined,
        portfolioUrl: profile.website || undefined,
      });
      await fetchProfile();
      toast.success("PROFILE INTEL UPDATED");
      setIsEditing(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "FAILED TO SAVE PROFILE");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
          <div className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">DECRYPTING PLAYER INTEL...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
        <div className="max-w-6xl mx-auto pb-12">
            {/* Header section */}
            <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
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
                <button
                    onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
                    disabled={saving}
                    className="flex items-center gap-2 px-8 py-4 bg-primary text-white border border-primary hover:bg-primary-dark hover:shadow-glow-sm transition-all rounded-sm text-[10px] font-black tracking-[0.2em] uppercase disabled:opacity-50"
                >
                    {saving ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>SAVING...</span>
                        </>
                    ) : isEditing ? (
                        <>
                            <Save className="w-4 h-4" />
                            <span>SAVE DATA</span>
                        </>
                    ) : (
                        <>
                            <Edit2 className="w-4 h-4" />
                            <span>MODIFY INTEL</span>
                        </>
                    )}
                </button>
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
                    <div className="flex flex-col items-center gap-6 z-10 shrink-0">
                        <div className="relative">
                            <div className="absolute -inset-2 rounded-full border border-primary/40 shadow-[0_0_20px_rgba(255,92,0,0.3)] pointer-events-none"></div>
                            <div className="w-40 h-40 rounded-full bg-white/5 border border-white/10 overflow-hidden flex items-center justify-center text-4xl font-black text-white/20">
                                <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${profile.fullName || 'User'}&backgroundColor=transparent`} alt="Avatar" className="w-full h-full object-cover" />
                            </div>
                            <div className="absolute bottom-2 right-2 w-5 h-5 bg-green-500 rounded-full border-2 border-black shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                        </div>
                    </div>

                    {/* Input Fields Section */}
                    <div className="flex-1 w-full z-10 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-[10px] font-bold text-white/50 uppercase tracking-[0.15em] mb-2">FULL NAME</label>
                                <input
                                    type="text"
                                    value={profile.fullName}
                                    readOnly={!isEditing}
                                    onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                                    className={`w-full px-4 py-4 bg-black border border-white/5 text-white focus:outline-none focus:border-primary/50 transition-all text-sm font-medium rounded-sm ${!isEditing ? 'opacity-70 cursor-not-allowed' : ''}`}
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-white/50 uppercase tracking-[0.15em] mb-2">EMAIL IDENTITY</label>
                                <input
                                    type="email"
                                    value={profile.email}
                                    readOnly
                                    className="w-full px-4 py-4 bg-black border border-white/5 text-white/40 focus:outline-none transition-all text-sm font-medium rounded-sm cursor-not-allowed"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-white/50 uppercase tracking-[0.15em] mb-2">UNIVERSITY / INSTITUTION</label>
                                <input
                                    type="text"
                                    value={profile.university}
                                    readOnly={!isEditing}
                                    onChange={(e) => setProfile({ ...profile, university: e.target.value })}
                                    className={`w-full px-4 py-4 bg-black border border-white/5 text-white focus:outline-none focus:border-primary/50 transition-all text-sm font-medium rounded-sm ${!isEditing ? 'opacity-70 cursor-not-allowed' : ''}`}
                                    placeholder="ENTER INSTITUTION..."
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-white/50 uppercase tracking-[0.15em] mb-2">MAJOR / DEGREE</label>
                                <input
                                    type="text"
                                    value={profile.major}
                                    readOnly={!isEditing}
                                    onChange={(e) => setProfile({ ...profile, major: e.target.value })}
                                    className={`w-full px-4 py-4 bg-black border border-white/5 text-white focus:outline-none focus:border-primary/50 transition-all text-sm font-medium rounded-sm ${!isEditing ? 'opacity-70 cursor-not-allowed' : ''}`}
                                    placeholder="ENTER MAJOR..."
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold text-white/50 uppercase tracking-[0.15em] mb-2">BIO / MISSION STATEMENT</label>
                            <textarea
                                value={profile.bio}
                                readOnly={!isEditing}
                                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                                rows={4}
                                className={`w-full px-4 py-4 bg-black border border-white/5 text-white/80 focus:outline-none focus:border-primary/50 transition-all text-sm font-medium resize-none leading-relaxed rounded-sm ${!isEditing ? 'opacity-70 cursor-not-allowed' : ''}`}
                                placeholder="TELL THE WORLD ABOUT YOUR MISSION..."
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
                            {isEditing && (
                                <button onClick={() => setShowAddSkill(true)} className="flex items-center gap-1 px-4 py-2 border border-white/10 hover:border-primary text-primary text-[10px] font-bold uppercase tracking-widest transition-all active:scale-[0.98] rounded-sm bg-black">
                                    <Plus className="w-3 h-3" /> ADD SKILL
                                </button>
                            )}
                        </div>

                        {showAddSkill && (
                            <div className="mb-6 p-6 bg-white/[0.02] border border-white/10 rounded-sm space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-bold text-white/40 uppercase tracking-widest">SELECT SKILL</label>
                                        <select
                                            value={newSkillId}
                                            onChange={(e) => setNewSkillId(e.target.value)}
                                            className="w-full px-4 py-3 bg-black border border-white/10 text-white text-[11px] font-bold uppercase tracking-widest focus:border-primary transition-all rounded-sm"
                                        >
                                            <option value="">-- SELECT --</option>
                                            {availableSkills.filter(s => !skills.some(es => es.skillId === s.id)).map(s => (
                                                <option key={s.id} value={s.id}>{s.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-bold text-white/40 uppercase tracking-widest">LEVEL</label>
                                        <select
                                            value={newSkillLevel}
                                            onChange={(e) => setNewSkillLevel(e.target.value as any)}
                                            className="w-full px-4 py-3 bg-black border border-white/10 text-white text-[11px] font-bold uppercase tracking-widest focus:border-primary transition-all rounded-sm"
                                        >
                                            <option value="beginner">BEGINNER</option>
                                            <option value="intermediate">INTERMEDIATE</option>
                                            <option value="advanced">ADVANCED</option>
                                            <option value="expert">EXPERT</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="flex justify-end gap-3 pt-2">
                                    <button onClick={() => setShowAddSkill(false)} className="px-6 py-2.5 text-white/40 text-[10px] font-bold uppercase tracking-widest border border-white/5 hover:border-white/10 transition-all rounded-sm">CANCEL</button>
                                    <button onClick={handleAddSkill} disabled={addingSkill || !newSkillId} className="px-6 py-2.5 bg-primary text-white text-[10px] font-bold uppercase tracking-widest hover:bg-primary-dark transition-all rounded-sm disabled:opacity-50">
                                        {addingSkill ? <Loader2 className="w-4 h-4 animate-spin" /> : "REGISTER SKILL"}
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="flex flex-wrap gap-3">
                            {skills.length === 0 ? (
                                <div className="w-full py-12 flex flex-col items-center justify-center opacity-20">
                                    <Code className="w-12 h-12 mb-4" strokeWidth={1} />
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em]">MATRIX EMPTY</p>
                                </div>
                            ) : (
                                skills.map((skill, index) => (
                                    <div
                                        key={index}
                                        className="group px-4 py-2.5 bg-white/[0.03] border border-white/10 hover:border-primary/50 hover:bg-white/[0.05] transition-all cursor-default relative w-fit overflow-hidden flex items-center gap-3"
                                    >
                                        <div className="absolute top-0 right-0 w-2 h-2 border-b border-l border-black bg-black/50 transform translate-x-1 -translate-y-1 rotate-45"></div>
                                        <span className="text-xs font-medium text-white/80">{skill.name}</span>
                                        <span className={`text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-sm border ${
                                            skill.level === 'expert' ? 'text-purple-400 border-purple-400/20 bg-purple-400/5' :
                                            skill.level === 'advanced' ? 'text-green-400 border-green-400/20 bg-green-400/5' :
                                            skill.level === 'intermediate' ? 'text-blue-400 border-blue-400/20 bg-blue-400/5' :
                                            'text-amber-400 border-amber-400/20 bg-amber-400/5'
                                        }`}>{skill.level}</span>
                                        {isEditing && (
                                            <button onClick={() => handleRemoveSkill(skill, index)} className="p-1 text-white/20 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                                                <X className="w-3 h-3" />
                                            </button>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Experience Level - Takes 1 col */}
                    <div className="relative p-8 bg-[#080808] border border-white/5 rounded-sm">
                        <h2 className="text-xl font-black text-white italic tracking-tighter uppercase flex items-center gap-3 mb-6">
                            <Trophy className="w-5 h-5 text-primary" /> EXPERIENCE<br />LEVEL
                        </h2>

                        <div className="flex justify-between items-baseline mb-2">
                            <span className="text-4xl font-black text-primary italic tracking-tighter">LVL<br />01</span>
                            <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest text-right">0 / 1,000<br />XP</span>
                        </div>

                        <div className="h-4 bg-black border border-white/10 rounded-sm relative mt-4 overflow-hidden p-0.5">
                            <div className="h-full bg-gradient-to-r from-primary/50 to-primary w-[5%] relative">
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

                {/* Mission History Roadmap */}
                <div className="relative p-8 bg-[#080808] border border-white/5 rounded-sm">
                    <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-primary"></div>
                    <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-primary"></div>

                    <div className="flex items-center gap-4 mb-10 pb-4 border-b border-white/5">
                        <Activity className="w-6 h-6 text-primary" />
                        <h2 className="text-xl font-black text-white italic tracking-tighter uppercase">MISSION HISTORY ROADMAP</h2>
                    </div>

                    <div className="relative pl-8 md:pl-0">
                        <div className="absolute left-10 md:left-1/2 top-0 bottom-0 w-px bg-white/10 -translate-x-1/2 md:-translate-x-1/2 hidden md:block"></div>
                        <div className="absolute left-0 top-0 bottom-0 w-px bg-white/10 block md:hidden"></div>

                        <div className="py-12 flex flex-col items-center justify-center opacity-20 text-center">
                            <Trophy className="w-12 h-12 mb-4" strokeWidth={1} />
                            <p className="text-[10px] font-black uppercase tracking-[0.2em]">NO MISSIONS LOGGED YET</p>
                            <p className="text-[9px] font-bold text-white/40 mt-2 uppercase tracking-widest leading-relaxed max-w-[200px]">DEPLOIMENTS AND COMPETITIONS WILL BE TRACKED IN REAL-TIME.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </DashboardLayout>
  );
}
