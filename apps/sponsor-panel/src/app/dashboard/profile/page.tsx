"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { 
    Building2, 
    Mail, 
    Globe, 
    Save,
    Loader2,
    CheckCircle2,
    Briefcase
} from "lucide-react";
import { useAuthStore } from "@shared/utils";
import { sponsorService } from "@/lib/api";

export default function SponsorProfile() {
    const { user } = useAuthStore();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    const [companyName, setCompanyName] = useState("");
    const [industry, setIndustry] = useState("");
    const [websiteUrl, setWebsiteUrl] = useState("");
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");

    useEffect(() => {
        (async () => {
            try {
                const res = await sponsorService.getProfile();
                const p = res.data?.data;
                if (p) {
                    setCompanyName(p.companyName || "");
                    setIndustry(p.industry || "");
                    setWebsiteUrl(p.websiteUrl || "");
                    setFullName(p.user?.fullName || user?.fullName || "");
                    setEmail(p.user?.email || user?.email || "");
                }
            } catch {
                setFullName(user?.fullName || "");
                setEmail(user?.email || "");
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const handleSave = async () => {
        setSaving(true);
        setSaved(false);
        try {
            await sponsorService.updateProfile({ companyName, industry, websiteUrl });
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch {
            /* toast */
        } finally {
            setSaving(false);
        }
    };

    const initials = (companyName || fullName || "S")
        .split(" ")
        .map((w: string) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">Sponsor Profile</h1>
                        <p className="text-white/60">Manage your brand identity and contact information.</p>
                    </div>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold transition-all btn-primary"
                    >
                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                        {saving ? "Saving..." : saved ? "Saved!" : "Save Changes"}
                    </button>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center h-48">
                        <Loader2 className="w-8 h-8 text-primary animate-spin" />
                    </div>
                ) : (
                    <>
                        {/* Profile Card */}
                        <div className="glass rounded-2xl overflow-hidden border border-white/10">
                            <div className="h-32 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent" />
                            <div className="px-8 pb-8">
                                <div className="relative -mt-12 mb-6">
                                    <div className="w-24 h-24 rounded-2xl bg-dark border-4 border-dark overflow-hidden glass flex items-center justify-center text-primary text-3xl font-bold">
                                        {initials}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Basic Info */}
                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-medium text-white/40 mb-2">Company Name</label>
                                            <div className="relative">
                                                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                                                <input
                                                    type="text"
                                                    value={companyName}
                                                    onChange={(e) => setCompanyName(e.target.value)}
                                                    className="input-field pl-10"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-white/40 mb-2">Email Address</label>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                                                <input
                                                    type="email"
                                                    value={email}
                                                    disabled
                                                    className="input-field pl-10 opacity-60 cursor-not-allowed"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-white/40 mb-2">Full Name</label>
                                            <input
                                                type="text"
                                                value={fullName}
                                                disabled
                                                className="input-field opacity-60 cursor-not-allowed"
                                            />
                                        </div>
                                    </div>

                                    {/* Extended Info */}
                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-medium text-white/40 mb-2">Industry</label>
                                            <div className="relative">
                                                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                                                <input
                                                    type="text"
                                                    value={industry}
                                                    onChange={(e) => setIndustry(e.target.value)}
                                                    placeholder="e.g. Information Technology"
                                                    className="input-field pl-10"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-white/40 mb-2">Website</label>
                                            <div className="relative">
                                                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                                                <input
                                                    type="url"
                                                    value={websiteUrl}
                                                    onChange={(e) => setWebsiteUrl(e.target.value)}
                                                    placeholder="https://yourcompany.com"
                                                    className="input-field pl-10"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </DashboardLayout>
    );
}
