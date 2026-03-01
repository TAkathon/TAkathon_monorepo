"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { 
    Building2, 
    Mail, 
    Globe, 
    Save,
    Loader2,
    Edit
} from "lucide-react";
import api from "@takathon/shared/api";
import { toast } from "sonner";

export default function SponsorProfile() {
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
        api.get("/api/v1/sponsors/profile")
            .then((res) => {
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
            })
            .catch(() => toast.error("Failed to load profile"))
            .finally(() => setLoading(false));
    }, []);

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
            toast.success("Profile saved!");
            setIsEditing(false);
        } catch {
            toast.error("Failed to save profile");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center h-full min-h-[400px]">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                </div>
            </DashboardLayout>
        );
    }

    const email = profile?.user?.email || "";

    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">Sponsor Profile</h1>
                        <p className="text-white/60">Manage your brand identity and contact information.</p>
                    </div>
                    {isEditing ? (
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold bg-green-500 hover:bg-green-600 text-white transition-all disabled:opacity-50"
                        >
                            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            Save Changes
                        </button>
                    ) : (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="flex items-center gap-2 btn-primary"
                        >
                            <Edit className="w-4 h-4" />
                            Edit Profile
                        </button>
                    )}
                </div>

                {/* Profile Card */}
                <div className="glass rounded-2xl overflow-hidden border border-white/10">
                    <div className="h-32 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent" />
                    <div className="px-8 pb-8">
                        <div className="relative -mt-12 mb-6">
                            <div className="w-24 h-24 rounded-2xl bg-dark border-4 border-dark overflow-hidden glass flex items-center justify-center">
                                <Building2 className="w-12 h-12 text-primary" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Basic Info */}
                            <div className="space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-white/40 mb-2">Company Name</label>
                                    <input
                                        type="text"
                                        value={form.companyName}
                                        onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                                        disabled={!isEditing}
                                        placeholder="Your company name"
                                        className="input-field disabled:opacity-50 disabled:cursor-not-allowed"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-white/40 mb-2">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                                        <input
                                            type="email"
                                            value={email}
                                            disabled
                                            className="input-field pl-10 opacity-50 cursor-not-allowed"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-white/40 mb-2">Website</label>
                                    <div className="relative">
                                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                                        <input
                                            type="text"
                                            value={form.websiteUrl}
                                            onChange={(e) => setForm({ ...form, websiteUrl: e.target.value })}
                                            disabled={!isEditing}
                                            placeholder="https://yourcompany.com"
                                            className="input-field pl-10 disabled:opacity-50 disabled:cursor-not-allowed"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-white/40 mb-2">Industry</label>
                                    <input
                                        type="text"
                                        value={form.industry}
                                        onChange={(e) => setForm({ ...form, industry: e.target.value })}
                                        disabled={!isEditing}
                                        placeholder="e.g. Information Technology"
                                        className="input-field disabled:opacity-50 disabled:cursor-not-allowed"
                                    />
                                </div>
                            </div>

                            {/* Bio */}
                            <div className="space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-white/40 mb-2">Brand Description</label>
                                    <textarea
                                        rows={5}
                                        value={form.bio}
                                        onChange={(e) => setForm({ ...form, bio: e.target.value })}
                                        disabled={!isEditing}
                                        placeholder="Tell organizers and students about your company..."
                                        className="input-field resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-white/40 mb-2">Parent Organization</label>
                                    <input
                                        type="text"
                                        value={form.organization}
                                        onChange={(e) => setForm({ ...form, organization: e.target.value })}
                                        disabled={!isEditing}
                                        placeholder="Parent company (if any)"
                                        className="input-field disabled:opacity-50 disabled:cursor-not-allowed"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
