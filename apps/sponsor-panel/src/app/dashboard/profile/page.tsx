"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import {
    Building2,
    Mail,
    Globe,
    MapPin,
    Camera,
    Save,
    Twitter,
    Linkedin,
    Github,
    Loader2,
    Edit
} from "lucide-react";
import api from "@takathon/shared/api";
import { toast } from "sonner";
import { useAuthStore } from "@shared/utils";

export default function SponsorProfile() {
  const { user } = useAuthStore();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [form, setForm] = useState({
    companyName: "",
    industry: "",
    websiteUrl: "",
    bio: "",
    organization: "",
    organizationWebsite: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get("/api/v1/sponsors/profile");
      const data = res.data.data;
      setProfile(data);
      setForm({
        companyName: data?.companyName || "",
        industry: data?.industry || "",
        websiteUrl: data?.websiteUrl || "",
        bio: data?.bio || "",
        organization: data?.organization || "",
        organizationWebsite: data?.organizationWebsite || "",
      });
    } catch {
      toast.error("FAILED TO SYNCHRONIZE PROFILE");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload: any = {};
      if (form.companyName) payload.companyName = form.companyName;
      if (form.industry) payload.industry = form.industry;
      if (form.websiteUrl) payload.websiteUrl = form.websiteUrl;
      if (form.bio) payload.bio = form.bio;
      if (form.organization) payload.organization = form.organization;
      if (form.organizationWebsite) payload.organizationWebsite = form.organizationWebsite;

      const res = await api.put("/api/v1/sponsors/profile", payload);
      setProfile(res.data.data);
      toast.success("BRAND IDENTITY SECURED", { description: "Your profile has been updated in the global registry." });
      setIsEditing(false);
    } catch {
      toast.error("FAILED TO UPDATE BRAND ASSETS");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="py-20 flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
            <span className="text-[10px] font-black text-white/20 uppercase tracking-[.3em]">SYNCHRONIZING BRAND DATA...</span>
        </div>
      </DashboardLayout>
    );
  }

  const email = profile?.user?.email || user?.email || "CONTACT@HQ.COM";

  return (
    <DashboardLayout>
        <div className="max-w-4xl mx-auto space-y-8 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                <div>
                    <h1 className="text-5xl md:text-6xl font-black italic tracking-tighter uppercase text-white mb-2">
                        BRAND <span className="text-primary text-glow-sm">PROFILE</span>
                    </h1>
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-primary animate-pulse rounded-full shadow-glow-sm" />
                        <span className="text-[10px] text-white/40 uppercase tracking-[0.2em] font-bold">
                            MANAGE YOUR BRAND IDENTITY AND CONTACT INTEL
                        </span>
                    </div>
                </div>
                
                <div className="flex items-center gap-3">
                    {isEditing ? (
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="flex items-center gap-2 px-8 py-3 bg-green-500 text-white text-[10px] font-black uppercase tracking-widest hover:bg-green-600 transition-all rounded-sm shadow-glow-sm disabled:opacity-50"
                        >
                            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                            SAVE ASSETS
                        </button>
                    ) : (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="flex items-center gap-2 px-8 py-3 bg-primary text-white text-[10px] font-black uppercase tracking-widest hover:bg-primary-dark transition-all rounded-sm shadow-glow-sm"
                        >
                            <Edit className="w-3.5 h-3.5" />
                            EDIT INTEL
                        </button>
                    )}
                </div>
            </div>

            {/* Profile Card */}
            <div className="relative bg-[#080808] border border-white/5 rounded-sm overflow-hidden group">
                <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-primary group-hover:w-6 group-hover:h-6 transition-all duration-500"></div>
                
                <div className="h-40 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent relative overflow-hidden">
                    <div className="absolute inset-0 hero-pattern opacity-10"></div>
                </div>
                
                <div className="px-8 pb-12">
                    <div className="relative -mt-16 mb-8 flex items-end justify-between">
                        <div className="relative group">
                            <div className="w-32 h-32 bg-[#050505] border-4 border-[#080808] overflow-hidden flex items-center justify-center rounded-sm shadow-2xl">
                                <Building2 className="w-16 h-16 text-primary group-hover:scale-110 transition-transform duration-500" />
                            </div>
                            {isEditing && (
                                <button className="absolute inset-0 bg-primary/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                                    <Camera className="w-8 h-8 text-white" />
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-8">
                            <div className="group">
                                <label className="block text-[10px] font-black text-white/30 mb-2 uppercase tracking-[0.2em] group-focus-within:text-primary transition-colors">COMPANY NAME</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={form.companyName}
                                        onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                                        disabled={!isEditing}
                                        className="w-full px-4 py-4 bg-black border border-white/10 text-xs text-white focus:outline-none focus:border-primary/50 transition-all font-bold tracking-widest uppercase disabled:opacity-40 disabled:cursor-not-allowed placeholder:text-white/10"
                                    />
                                    <div className="absolute right-0 top-0 bottom-0 w-1 bg-white/5 group-focus-within:bg-primary transition-all"></div>
                                </div>
                            </div>
                            
                            <div className="group">
                                <label className="block text-[10px] font-black text-white/30 mb-2 uppercase tracking-[0.2em] group-focus-within:text-primary transition-colors">EMAIL ADDRESS</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-primary transition-colors" />
                                    <input
                                        type="email"
                                        value={email}
                                        disabled
                                        className="w-full pl-12 pr-4 py-4 bg-black border border-white/5 text-xs text-white/40 transition-all font-bold tracking-widest uppercase cursor-not-allowed"
                                    />
                                </div>
                            </div>

                            <div className="group">
                                <label className="block text-[10px] font-black text-white/30 mb-2 uppercase tracking-[0.2em] group-focus-within:text-primary transition-colors">WEBSITE</label>
                                <div className="relative">
                                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-primary transition-colors" />
                                    <input
                                        type="text"
                                        value={form.websiteUrl}
                                        onChange={(e) => setForm({ ...form, websiteUrl: e.target.value })}
                                        disabled={!isEditing}
                                        className="w-full pl-12 pr-4 py-4 bg-black border border-white/10 text-xs text-white focus:outline-none focus:border-primary/50 transition-all font-bold tracking-widest uppercase disabled:opacity-40 disabled:cursor-not-allowed placeholder:text-white/10"
                                    />
                                    <div className="absolute right-0 top-0 bottom-0 w-1 bg-white/5 group-focus-within:bg-primary transition-all"></div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-8">
                            <div className="group">
                                <label className="block text-[10px] font-black text-white/30 mb-2 uppercase tracking-[0.2em] group-focus-within:text-primary transition-colors">BRAND MISSION</label>
                                <div className="relative">
                                    <textarea
                                        rows={6}
                                        value={form.bio}
                                        onChange={(e) => setForm({ ...form, bio: e.target.value.slice(0, 1000) })}
                                        disabled={!isEditing}
                                        placeholder="TELL OUR OPERATIVES ABOUT YOUR MISSION..."
                                        className="w-full px-4 py-4 bg-black border border-white/10 text-xs text-white focus:outline-none focus:border-primary/50 transition-all font-bold tracking-widest uppercase resize-none disabled:opacity-40 disabled:cursor-not-allowed placeholder:text-white/10"
                                    />
                                    <div className="absolute right-0 top-0 bottom-0 w-1 bg-white/5 group-focus-within:bg-primary transition-all"></div>
                                </div>
                                <p className="text-[8px] text-white/20 text-right mt-2 font-black tracking-widest">
                                    {(form.bio || "").length} / 1000 UNTS
                                </p>
                            </div>

                            <div className="space-y-4">
                                <label className="block text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">SOCIAL UPLINKS</label>
                                <div className="flex gap-4">
                                    {[Twitter, Linkedin, Github].map((Icon, i) => (
                                        <button key={i} className="p-4 bg-black border border-white/10 hover:border-primary/50 text-white/20 hover:text-primary transition-all rounded-sm shadow-glow-sm active:scale-95">
                                            <Icon className="w-5 h-5" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Location & Industry Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="relative bg-[#080808] border border-white/5 p-8 rounded-sm group overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/0 group-hover:bg-primary/5 rounded-full blur-[60px] pointer-events-none transition-all duration-700"></div>
                    <div className="flex items-center gap-6 relative z-10">
                        <div className="p-4 bg-white/5 border border-white/10 rounded-sm">
                            <MapPin className="w-8 h-8 text-primary" />
                        </div>
                        <div>
                            <h4 className="text-white font-black text-[10px] uppercase tracking-[0.2em] mb-1">COMMAND QUARTERS</h4>
                            <p className="text-sm font-black text-white/40 uppercase tracking-tighter italic">TUNISIA OPERATIONS HQ</p>
                        </div>
                    </div>
                </div>

                <div className="relative bg-[#080808] border border-white/5 p-8 rounded-sm group overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/0 group-hover:bg-primary/5 rounded-full blur-[60px] pointer-events-none transition-all duration-700"></div>
                    <div className="flex items-center gap-6 relative z-10">
                        <div className="p-4 bg-white/5 border border-white/10 rounded-sm">
                            <Building2 className="w-8 h-8 text-primary" />
                        </div>
                        <div className="flex-1">
                            <h4 className="text-white font-black text-[10px] uppercase tracking-[0.2em] mb-1">OPERATIONAL SECTOR</h4>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={form.industry}
                                    onChange={(e) => setForm({ ...form, industry: e.target.value })}
                                    placeholder="E.G. FINTECH SECURE OPS"
                                    className="w-full bg-transparent border-b border-primary/50 text-sm font-black text-white uppercase focus:outline-none transition-all"
                                />
                            ) : (
                                <p className="text-sm font-black text-white/40 uppercase tracking-tighter italic">{form.industry || "UNKNOWN SECTOR"}</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </DashboardLayout>
  );
}
