"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import {
  Building2,
  Shield,
  Save,
  ChevronRight,
  Loader2,
  AlertCircle,
  CheckCircle,
  Trash2,
  Eye,
  EyeOff,
  User,
  Bell,
  CreditCard,
  Camera,
  ShieldCheck,
  Globe,
  Mail,
  Lock,
  Clock
} from "lucide-react";
import { organizerApi } from "@takathon/shared/api";
import { useAuthStore } from "@takathon/shared/utils";
import { toast } from "sonner";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ProfileForm {
  fullName: string;
  organizationName: string;
  organizationWebsite: string;
  position: string;
  bio: string;
  avatarUrl: string;
  githubUrl: string;
  linkedinUrl: string;
  portfolioUrl: string;
}

const INITIAL_PROFILE: ProfileForm = {
  fullName: "",
  organizationName: "",
  organizationWebsite: "",
  position: "",
  bio: "",
  avatarUrl: "",
  githubUrl: "",
  linkedinUrl: "",
  portfolioUrl: "",
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SettingsPage() {
    const router = useRouter();
    const { logout } = useAuthStore();

    // Tab state
    const [activeTab, setActiveTab] = useState<"profile" | "notifications" | "security" | "billing">("profile");

    // Profile state
    const [profile, setProfile] = useState<ProfileForm>(INITIAL_PROFILE);
    const [loadingProfile, setLoadingProfile] = useState(true);
    const [savingProfile, setSavingProfile] = useState(false);
    const [profileError, setProfileError] = useState<string | null>(null);

    // Password state
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [changingPassword, setChangingPassword] = useState(false);
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [showPw, setShowPw] = useState<Record<string, boolean>>({});

    // Delete account state
    const [deletePassword, setDeletePassword] = useState("");
    const [deleteConfirm, setDeleteConfirm] = useState("");
    const [deleting, setDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState<string | null>(null);

    useEffect(() => {
        fetchProfile();
    }, []);

    async function fetchProfile() {
        try {
            setLoadingProfile(true);
            setProfileError(null);
            const data = await organizerApi.getProfile();
            setProfile({
                fullName: data.fullName || "",
                organizationName: data.organizationName || "",
                organizationWebsite: data.organizationWebsite || "",
                position: data.position || "",
                bio: data.bio || "",
                avatarUrl: data.avatarUrl || "",
                githubUrl: data.githubUrl || "",
                linkedinUrl: data.linkedinUrl || "",
                portfolioUrl: data.portfolioUrl || "",
            });
        } catch (err: any) {
            setProfileError("FAILED TO DECRYPT PROFILE DATA.");
        } finally {
            setLoadingProfile(false);
        }
    }

    const handleProfileChange = (field: keyof ProfileForm, value: string) => {
        setProfile(prev => ({ ...prev, [field]: value }));
    };

    const handleSaveProfile = async () => {
        try {
            setSavingProfile(true);
            setProfileError(null);
            await organizerApi.updateProfile(profile);
            toast.success("SYSTEM PARAMETERS UPDATED SUCCESSFULLY");
        } catch (err: any) {
            setProfileError("FAILED TO UPDATE SYSTEM PARAMETERS.");
            toast.error("UPDATE SEQUENCE FAILED");
        } finally {
            setSavingProfile(false);
        }
    };

    const handleChangePassword = async () => {
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            setPasswordError("ENCRYPTION KEYS DO NOT MATCH.");
            return;
        }
        if (passwordForm.newPassword.length < 8) {
            setPasswordError("SECURITY KEY MUST BE AT LEAST 8 CHARACTERS.");
            return;
        }
        try {
            setChangingPassword(true);
            setPasswordError(null);
            await organizerApi.changePassword(
                passwordForm.currentPassword,
                passwordForm.newPassword,
            );
            toast.success("SECURITY PROTOCOLS UPDATED");
            setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
        } catch (err: any) {
            setPasswordError("FAILED TO OVERRIDE SECURITY KEY.");
            toast.error("SECURITY OVERRIDE FAILED");
        } finally {
            setChangingPassword(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (deleteConfirm !== "DELETE") {
            setDeleteError('PLEASE CONFIRM BY TYPING "DELETE"');
            return;
        }
        try {
            setDeleting(true);
            setDeleteError(null);
            await organizerApi.deleteAccount(deletePassword, deleteConfirm);
            toast.success("ACCOUNT PURGED SUCCESSFULLY");
            logout();
            router.push("/login");
        } catch (err: any) {
            setDeleteError("PURGE SEQUENCE FAILED. INCORRECT PARAMETERS.");
            toast.error("PURGE COMMAND REJECTED");
        } finally {
            setDeleting(false);
        }
    };

    const togglePwVisibility = (field: string) => {
        setShowPw(prev => ({ ...prev, [field]: !prev[field] }));
    };

    return (
        <DashboardLayout>
            <div className="max-w-6xl mx-auto space-y-8 pb-12 relative">
                {/* Background Floating Objects */}
                <div className="absolute top-20 right-10 w-32 h-32 bg-primary/20 rounded-full blur-[80px] pointer-events-none"></div>

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div>
                        <div className="flex items-center relative mb-1">
                            <h1 className="text-5xl md:text-6xl font-black italic tracking-tighter uppercase text-white">
                                <span className="text-white">SYSTEM CONFIG</span>
                            </h1>
                            <div className="flex ml-4 gap-1 opacity-60 mt-2">
                                <div className="w-8 h-1 bg-primary"></div>
                                <div className="w-2 h-1 bg-primary"></div>
                                <div className="w-1 h-1 bg-primary"></div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 mt-4 mb-2">
                            <div className="w-2 h-2 bg-green-500 rounded-sm" />
                            <span className="text-[10px] text-white/60 uppercase tracking-[0.2em] font-bold">
                                MANAGE ORGANIZATION AND ACCOUNT PARAMETERS
                            </span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Navigation Sidebar */}
                    <div className="space-y-1 bg-[#080808] border border-white/5 p-2 rounded-sm h-fit">
                        {[
                            { id: "profile", label: "ORG PROFILE", icon: Building2 },
                            { id: "notifications", label: "ALERTS", icon: Bell },
                            { id: "security", label: "SECURITY", icon: Shield },
                            { id: "billing", label: "SUBSCRIPTION", icon: CreditCard },
                        ].map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as any)}
                                    className={`w-full flex items-center justify-between px-4 py-4 transition-all border-l-2 rounded-sm ${activeTab === tab.id
                                        ? "bg-primary/10 text-white border-primary"
                                        : "text-white/40 border-transparent hover:bg-white/5 hover:text-white/80"
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <Icon className={`w-4 h-4 ${activeTab === tab.id ? "text-primary" : ""}`} />
                                        <span className="font-bold text-[10px] uppercase tracking-widest">{tab.label}</span>
                                    </div>
                                    <ChevronRight className={`w-4 h-4 transition-transform ${activeTab === tab.id ? "rotate-90 text-primary" : ""}`} />
                                </button>
                            );
                        })}
                    </div>

                    {/* Content Area */}
                    <div className="lg:col-span-3 space-y-6">
                        {activeTab === "profile" && (
                            <div className="space-y-6">
                                {/* Org Profile Card */}
                                <div className="bg-[#080808] p-8 rounded-sm space-y-8 border border-white/5 relative group">
                                    <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-white/20 group-hover:border-primary/50 transition-colors"></div>

                                    {/* Avatar Row */}
                                    <div className="flex flex-col md:flex-row items-center gap-8 pb-8 border-b border-white/5">
                                        <div className="relative group/avatar cursor-pointer">
                                            <div className="w-24 h-24 bg-[#050505] border border-white/10 flex items-center justify-center text-primary text-3xl font-black italic tracking-tighter rounded-sm overflow-hidden">
                                                {profile.avatarUrl ? (
                                                    <img src={profile.avatarUrl} alt="Avatar" className="w-full h-full object-cover opacity-80 group-hover/avatar:scale-110 transition-transform duration-500" />
                                                ) : (
                                                    <span>{profile.organizationName?.slice(0, 2).toUpperCase() || "TH"}</span>
                                                )}
                                            </div>
                                            <button className="absolute inset-0 bg-primary/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-all text-white border border-primary rounded-sm">
                                                <Camera className="w-6 h-6 shadow-glow-sm" />
                                            </button>
                                        </div>
                                        <div className="text-center md:text-left flex-1">
                                            <h3 className="text-2xl font-black text-white flex items-center justify-center md:justify-start gap-3 uppercase tracking-tighter italic mb-2">
                                                {profile.organizationName || "NEW ORGANIZATION"}
                                                <ShieldCheck className="w-6 h-6 text-green-400 drop-shadow-[0_0_5px_rgba(74,222,128,0.5)]" />
                                            </h3>
                                            <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">OPERATIONAL PARAMETERS & ASSET IDENTITY</p>
                                            <div className="flex items-center justify-center md:justify-start gap-3 mt-4">
                                                <span className="px-3 py-1 flex items-center gap-1.5 text-[8px] font-bold bg-green-500/10 text-green-400 border border-green-500/20 uppercase tracking-widest rounded-sm"><ShieldCheck className="w-3 h-3" /> VERIFIED ORG</span>
                                                <span className="px-3 py-1 text-[8px] font-bold bg-[#050505] text-primary border border-primary/20 uppercase tracking-widest rounded-sm">COMMANDER PLAN</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Fields Grid */}
                                    {loadingProfile ? (
                                        <div className="flex flex-col items-center justify-center py-12">
                                            <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
                                            <div className="text-[10px] font-bold text-white/20 uppercase tracking-widest">LOADING ASSETS...</div>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">ORGANIZATION NAME</label>
                                                <input
                                                    type="text"
                                                    value={profile.organizationName}
                                                    onChange={e => handleProfileChange('organizationName', e.target.value)}
                                                    className="w-full px-4 py-3 bg-[#050505] border border-white/10 text-sm text-white focus:outline-none focus:border-primary/50 transition-all font-bold tracking-wide rounded-sm"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">OFFICIAL DOMAIN</label>
                                                <input
                                                    type="url"
                                                    value={profile.organizationWebsite}
                                                    onChange={e => handleProfileChange('organizationWebsite', e.target.value)}
                                                    className="w-full px-4 py-3 bg-[#050505] border border-white/10 text-sm text-white focus:outline-none focus:border-primary/50 transition-all font-bold tracking-wide rounded-sm placeholder:text-white/10"
                                                    placeholder="HTTPS://YOUR-ORG.COM"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">COMMANDER NAME</label>
                                                <input
                                                    type="text"
                                                    value={profile.fullName}
                                                    onChange={e => handleProfileChange('fullName', e.target.value)}
                                                    className="w-full px-4 py-3 bg-[#050505] border border-white/10 text-sm text-white focus:outline-none focus:border-primary/50 transition-all font-bold tracking-wide rounded-sm"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">COMMAND POST (POSITION)</label>
                                                <input
                                                    type="text"
                                                    value={profile.position}
                                                    onChange={e => handleProfileChange('position', e.target.value)}
                                                    className="w-full px-4 py-3 bg-[#050505] border border-white/10 text-sm text-white focus:outline-none focus:border-primary/50 transition-all font-bold tracking-wide rounded-sm"
                                                    placeholder="HEAD OF OPERATIONS"
                                                />
                                            </div>
                                            <div className="space-y-2 md:col-span-2">
                                                <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">MISSION INTEL (ABOUT)</label>
                                                <textarea
                                                    rows={4}
                                                    value={profile.bio}
                                                    onChange={e => handleProfileChange('bio', e.target.value)}
                                                    className="w-full px-4 py-3 bg-[#050505] border border-white/10 text-sm text-white focus:outline-none focus:border-primary/50 transition-all font-bold tracking-wide resize-none rounded-sm"
                                                    placeholder="DESCRIBE YOUR ORGANIZATION'S MISSION OBJECTIVES..."
                                                />
                                            </div>
                                            <div className="md:col-span-2 flex justify-end pt-4">
                                                <button
                                                    onClick={handleSaveProfile}
                                                    disabled={savingProfile}
                                                    className="flex items-center gap-2 px-8 py-3 bg-primary text-white border border-primary hover:bg-primary-dark hover:shadow-glow-sm transition-all rounded-sm text-[10px] font-bold tracking-widest uppercase disabled:opacity-50"
                                                >
                                                    {savingProfile ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                                    <span>UPDATE CONFIG</span>
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="bg-[#080808] p-6 rounded-sm border border-white/5 border-l-4 border-l-primary relative overflow-hidden">
                                     <div className="absolute right-0 top-0 w-32 h-32 bg-primary/10 blur-[40px] pointer-events-none"></div>
                                     <h4 className="text-white font-black italic text-lg uppercase tracking-tighter mb-2">PUBLIC COMMAND LINK</h4>
                                     <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold mb-6">
                                         THIS IS THE EXTERNAL INTERFACE WHERE OPERATIVES CAN VIEW YOUR ACTIVE MISSIONS AND INTEL.
                                     </p>
                                     <div className="flex items-center gap-3">
                                         <div className="flex-1 px-4 py-3 bg-[#050505] border border-white/10 text-white/60 text-xs font-mono tracking-wider rounded-sm flex items-center justify-between">
                                             HTTPS://TAKATHON.COM/ORG/{profile.organizationName?.toLowerCase().replace(/\s+/g, '-') || 'YOUR-ORG'}
                                         </div>
                                         <button className="px-6 py-3 bg-transparent text-white text-[10px] font-bold uppercase tracking-widest transition-all border border-white/20 hover:border-white/50 hover:bg-white/5 rounded-sm active:scale-[0.98]">
                                             COPY BATTLE LINK
                                         </button>
                                     </div>
                                </div>
                            </div>
                        )}

                        {activeTab === "security" && (
                            <div className="space-y-6">
                                {/* Password Config */}
                                <div className="bg-[#080808] p-8 rounded-sm space-y-8 border border-white/5 relative group">
                                    <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-white/20 group-hover:border-primary/50 transition-colors"></div>
                                    <div>
                                        <h3 className="text-xl font-black text-white flex items-center gap-2 uppercase tracking-tighter italic">
                                            <Lock className="w-5 h-5 text-primary" />
                                            ENCRYPTION OVERRIDE
                                        </h3>
                                        <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold mt-1">UPDATE YOUR ACCOUNT SECURITY CLEARANCE KEYS</p>
                                    </div>

                                    {passwordError && (
                                        <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-bold uppercase tracking-widest rounded-sm">
                                            <AlertCircle className="w-4 h-4" /> {passwordError}
                                        </div>
                                    )}

                                    <div className="space-y-6 max-w-md">
                                        {[
                                            { id: 'currentPassword', label: 'CURRENT SECURITY KEY', icon: Lock },
                                            { id: 'newPassword', label: 'NEW SECURITY KEY', icon: Shield },
                                            { id: 'confirmPassword', label: 'CONFIRM SECURITY KEY', icon: ShieldCheck },
                                        ].map(field => (
                                            <div key={field.id} className="space-y-2">
                                                <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{field.label}</label>
                                                <div className="relative">
                                                    <input
                                                        type={showPw[field.id] ? "text" : "password"}
                                                        value={(passwordForm as any)[field.id]}
                                                        onChange={e => setPasswordForm(p => ({ ...p, [field.id]: e.target.value }))}
                                                        className="w-full pl-4 pr-12 py-3 bg-[#050505] border border-white/10 text-sm text-white focus:outline-none focus:border-primary/50 transition-all font-bold tracking-wide rounded-sm"
                                                    />
                                                    <button 
                                                        onClick={() => togglePwVisibility(field.id)}
                                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors"
                                                    >
                                                        {showPw[field.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                        <button
                                            onClick={handleChangePassword}
                                            disabled={changingPassword || !passwordForm.currentPassword || !passwordForm.newPassword}
                                            className="flex items-center gap-2 px-8 py-3 bg-primary text-white border border-primary hover:bg-primary-dark hover:shadow-glow-sm transition-all rounded-sm text-[10px] font-bold tracking-widest uppercase disabled:opacity-50"
                                        >
                                            {changingPassword ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                            <span>COMMIT NEW KEY</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Danger Zone */}
                                <div className="bg-red-500/5 p-8 rounded-sm space-y-6 border border-red-500/20 relative group overflow-hidden">
                                     <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-red-500/20"></div>
                                     <div>
                                        <h3 className="text-xl font-black text-red-500 flex items-center gap-2 uppercase tracking-tighter italic">
                                            <Trash2 className="w-5 h-5" />
                                            PURGE PROTOCOL
                                        </h3>
                                        <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold mt-1 max-w-lg">
                                            DELETING YOUR ACCOUNT WILL PERMANENTLY ABORT ALL DRAFT AND PUBLISHED MISSIONS AND PURGE YOUR ORGANIZER DATA FROM THE GRID.
                                        </p>
                                     </div>

                                     {deleteError && (
                                        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-bold uppercase tracking-widest rounded-sm">
                                            {deleteError}
                                        </div>
                                     )}

                                     <div className="space-y-4 max-w-md">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">ENTER SECURITY KEY TO AUTHORIZE</label>
                                            <input
                                                type="password"
                                                value={deletePassword}
                                                onChange={e => setDeletePassword(e.target.value)}
                                                className="w-full px-4 py-3 bg-[#050505] border border-red-500/20 text-sm text-white focus:outline-none focus:border-red-500/50 transition-all font-bold tracking-wide rounded-sm"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
                                                TYPE <span className="text-red-500">"DELETE"</span> TO CONFIRM PURGE
                                            </label>
                                            <input
                                                type="text"
                                                value={deleteConfirm}
                                                onChange={e => setDeleteConfirm(e.target.value)}
                                                className="w-full px-4 py-3 bg-[#050505] border border-red-500/20 text-sm text-white focus:outline-none focus:border-red-500/50 transition-all font-bold tracking-wide rounded-sm"
                                                placeholder="DELETE"
                                            />
                                        </div>
                                        <button
                                            onClick={handleDeleteAccount}
                                            disabled={deleting || deleteConfirm !== 'DELETE' || !deletePassword}
                                            className="px-8 py-3 bg-red-600 text-white border border-red-600 hover:bg-red-700 transition-all rounded-sm text-[10px] font-bold tracking-widest uppercase disabled:opacity-50"
                                        >
                                            {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>AUTHORIZE PURGE</span>}
                                        </button>
                                     </div>
                                </div>
                            </div>
                        )}

                        {(activeTab === "notifications" || activeTab === "billing") && (
                            <div className="bg-[#080808] p-16 rounded-sm border border-white/5 text-center flex flex-col items-center gap-4">
                                <Clock className="w-12 h-12 text-white/10" />
                                <div className="text-sm font-black italic text-white/40 uppercase tracking-tighter">PROTOCOLS IN DEVELOPMENT</div>
                                <p className="text-[10px] text-white/20 uppercase tracking-[0.2em] font-bold">THIS SECTOR OF THE COMMAND CENTER IS CURRENTLY UNDER CONSTRUCTION</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
