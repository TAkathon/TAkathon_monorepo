"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import {
  Bell,
  Lock,
  Globe,
  Eye,
  Shield,
  ChevronDown,
  Clock,
  Loader2,
  Save,
  Mail,
  Trash2,
  EyeOff,
  AlertTriangle,
  X,
  ChevronRight,
  ShieldCheck,
  Zap
} from "lucide-react";
import { studentApi } from "@takathon/shared/api";
import type { AvailabilitySlot } from "@takathon/shared/api";
import { useAuthStore } from "@takathon/shared/utils";
import { toast } from "sonner";

// ─── Availability config ──────────────────────────────────────────────────────

const SLOT_LABELS: Record<AvailabilitySlot, string> = {
  weekday_morning: "Weekday Mornings (6 AM – 12 PM)",
  weekday_afternoon: "Weekday Afternoons (12 PM – 6 PM)",
  weekday_evening: "Weekday Evenings (6 PM – 11 PM)",
  weekend_morning: "Weekend Mornings (6 AM – 12 PM)",
  weekend_afternoon: "Weekend Afternoons (12 PM – 6 PM)",
  weekend_evening: "Weekend Evenings (6 PM – 11 PM)",
};

const ALL_SLOTS = Object.keys(SLOT_LABELS) as AvailabilitySlot[];

const COMMON_TIMEZONES = [
  "UTC-12", "UTC-11", "UTC-10", "UTC-9", "UTC-8", "UTC-7", "UTC-6", "UTC-5",
  "UTC-4", "UTC-3", "UTC-2", "UTC-1", "UTC", "UTC+1", "UTC+2", "UTC+3",
  "UTC+4", "UTC+5", "UTC+5:30", "UTC+6", "UTC+7", "UTC+8", "UTC+9",
  "UTC+10", "UTC+11", "UTC+12",
];

export default function SettingsPage() {
  const router = useRouter();
  const { logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState("NOTIFICATIONS");

  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [teamInvites, setTeamInvites] = useState(true);
  const [hackathonUpdates, setHackathonUpdates] = useState(true);
  const [profileVisibility, setProfileVisibility] = useState("public");

  // ── Availability state ─────────────────────────────────────────────────
  const [availLoading, setAvailLoading] = useState(true);
  const [availSaving, setAvailSaving] = useState(false);
  const [timezone, setTimezone] = useState("UTC");
  const [hoursPerWeek, setHoursPerWeek] = useState(10);
  const [selectedSlots, setSelectedSlots] = useState<Set<AvailabilitySlot>>(new Set());

  // ── Change Password state ──────────────────────────────────────────────
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // ── Delete Account state ───────────────────────────────────────────────
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [deletingAccount, setDeletingAccount] = useState(false);

  const tabs = ["NOTIFICATIONS", "AVAILABILITY", "PRIVACY", "SECURITY"];

  useEffect(() => {
    studentApi
      .getMyProfile()
      .then((profile) => {
        const avail = profile.availability;
        if (avail) {
          setTimezone(avail.timezone ?? "UTC");
          setHoursPerWeek(avail.hoursPerWeek ?? 10);
          setSelectedSlots(new Set(avail.preferredSlots ?? []));
        }
      })
      .catch(() => {})
      .finally(() => setAvailLoading(false));
  }, []);

  const toggleSlot = (slot: AvailabilitySlot) => {
    setSelectedSlots((prev) => {
      const next = new Set(prev);
      next.has(slot) ? next.delete(slot) : next.add(slot);
      return next;
    });
  };

  const handleSaveAvailability = async () => {
    if (selectedSlots.size === 0) {
      toast.error("PLEASE SELECT AT LEAST ONE TIME SLOT");
      return;
    }
    setAvailSaving(true);
    try {
      await studentApi.updateMyProfile({
        availability: {
          timezone,
          hoursPerWeek,
          preferredSlots: Array.from(selectedSlots),
        },
      });
      toast.success("AVAILABILITY PROTOCOLS SYNCHRONIZED");
    } catch {
      toast.error("FAILED TO SAVE AVAILABILITY");
    } finally {
      setAvailSaving(false);
    }
  };

  const handleChangePassword = async () => {
    setPasswordError(null);
    if (newPassword.length < 8) {
        setPasswordError("NEW PASSWORD MUST BE AT LEAST 8 CHARACTERS");
        return;
    }
    if (newPassword !== confirmPassword) {
        setPasswordError("PASSWORDS DO NOT MATCH");
        return;
    }
    setChangingPassword(true);
    try {
        await studentApi.changePassword({ currentPassword, newPassword });
        toast.success("SECURITY ACCESS KEY UPDATED. PLEASE RE-AUTHENTICATE.");
        logout();
        router.push("/login");
    } catch (err: any) {
        setPasswordError(err.response?.data?.message || "AUTHENTICATION OVERRIDE FAILED");
    } finally {
        setChangingPassword(false);
    }
  };

  return (
    <DashboardLayout>
        <div className="max-w-6xl mx-auto pb-12">
            {/* Header section */}
            <div className="mb-12">
                <div className="flex items-center relative mb-2">
                    <h1 className="text-5xl md:text-6xl font-black italic tracking-tighter uppercase text-white">
                        CORE <span className="text-white text-glow-sm">SETTINGS</span>
                    </h1>
                    <div className="flex ml-4 gap-1 opacity-60 mt-4">
                        <div className="w-12 h-1 bg-primary"></div>
                        <div className="w-2 h-1 bg-primary"></div>
                        <div className="w-1 h-1 bg-primary"></div>
                    </div>
                </div>
                <div className="max-w-2xl mt-4">
                    <p className="text-[10px] text-white/50 uppercase tracking-[0.2em] font-bold leading-relaxed">
                        CONFIGURE YOUR SYSTEM PREFERENCES, PRIVACY PROTOCOLS, AND SECURITY LAYERS.
                    </p>
                </div>
            </div>

            <div className="border-t border-white/5 pt-12 flex flex-col md:flex-row gap-12">
                {/* Vertical Tabs */}
                <div className="w-full md:w-56 space-y-2 shrink-0">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`w-full flex items-center justify-between px-5 py-4 text-[10px] font-bold tracking-widest uppercase transition-all active:scale-[0.98]
                            ${activeTab === tab
                                    ? "text-white bg-white/[0.02] border-l-2 border-primary"
                                    : "text-white/40 border-l-2 border-transparent hover:text-white/70 hover:bg-white/[0.01]"}`}
                        >
                            {tab}
                            {activeTab === tab && <ChevronRight className="w-3 h-3 text-primary" />}
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="flex-1 space-y-10">
                    {/* Notifications */}
                    {activeTab === "NOTIFICATIONS" && (
                        <div className="relative p-8 bg-[#080808] border border-white/5 rounded-sm">
                            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-primary"></div>
                            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-primary"></div>

                            <div className="flex items-center gap-4 mb-8 pb-4 border-b border-white/5">
                                <Bell className="w-6 h-6 text-primary" />
                                <h2 className="text-lg font-black text-white italic tracking-tighter uppercase">SYSTEM ALERTS</h2>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-5 bg-white/[0.02] border border-white/5 rounded-sm">
                                    <div>
                                        <p className="text-xs font-black text-white uppercase tracking-wider mb-1">EMAIL NOTIFICATIONS</p>
                                        <p className="text-[10px] text-white/40 font-bold">Receive mission updates and platform news via email.</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" checked={emailNotifications} onChange={(e) => setEmailNotifications(e.target.checked)} className="sr-only peer" />
                                        <div className="w-12 h-6 bg-white/10 peer-focus:outline-none rounded-full peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary border border-white/10"></div>
                                    </label>
                                </div>
                                <div className="flex items-center justify-between p-5 bg-white/[0.02] border border-white/5 rounded-sm">
                                    <div>
                                        <p className="text-xs font-black text-white uppercase tracking-wider mb-1">TEAM INVITATIONS</p>
                                        <p className="text-[10px] text-white/40 font-bold">Get notified when potential squad members invite you.</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" checked={teamInvites} onChange={(e) => setTeamInvites(e.target.checked)} className="sr-only peer" />
                                        <div className="w-12 h-6 bg-white/10 peer-focus:outline-none rounded-full peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary border border-white/10"></div>
                                    </label>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Availability */}
                    {activeTab === "AVAILABILITY" && (
                        <div className="relative p-8 bg-[#080808] border border-white/5 rounded-sm">
                            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-primary"></div>
                            
                            <div className="flex items-center gap-4 mb-8 pb-4 border-b border-white/5">
                                <Clock className="w-6 h-6 text-primary" />
                                <h2 className="text-lg font-black text-white italic tracking-tighter uppercase">DEPLOYMENT READINESS</h2>
                            </div>

                            {availLoading ? (
                                <div className="py-12 flex justify-center"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div>
                            ) : (
                                <div className="space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-white/40 uppercase tracking-widest">ACTIVE TIMEZONE</label>
                                            <div className="relative group">
                                                <select
                                                    value={timezone}
                                                    onChange={(e) => setTimezone(e.target.value)}
                                                    className="w-full pl-4 pr-10 py-4 bg-black border border-white/10 rounded-sm text-white focus:outline-none focus:border-primary/50 transition-all appearance-none cursor-pointer text-xs font-bold"
                                                >
                                                    {COMMON_TIMEZONES.map(tz => <option key={tz} value={tz}>{tz}</option>)}
                                                </select>
                                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary pointer-events-none" />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-white/40 uppercase tracking-widest">HOURS PER CYCLE (WEEK)</label>
                                            <input
                                                type="number"
                                                value={hoursPerWeek}
                                                onChange={(e) => setHoursPerWeek(parseInt(e.target.value) || 0)}
                                                className="w-full px-4 py-4 bg-black border border-white/10 rounded-sm text-white focus:outline-none focus:border-primary/50 transition-all text-xs font-bold"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-white/40 uppercase tracking-widest">PREFERRED OPERATION WINDOWS</label>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {ALL_SLOTS.map(slot => (
                                                <button
                                                    key={slot}
                                                    onClick={() => toggleSlot(slot)}
                                                    className={`p-4 border text-left transition-all rounded-sm group relative overflow-hidden ${
                                                        selectedSlots.has(slot) ? 'bg-primary/10 border-primary text-white' : 'bg-black border-white/5 text-white/40 hover:border-white/20'
                                                    }`}
                                                >
                                                    <div className="flex items-center gap-3 relative z-10">
                                                        <div className={`w-2 h-2 rounded-full ${selectedSlots.has(slot) ? 'bg-primary shadow-[0_0_8px_rgba(255,92,0,0.8)]' : 'bg-white/10'}`}></div>
                                                        <span className="text-[10px] font-black uppercase tracking-widest">{SLOT_LABELS[slot]}</span>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex justify-end pt-4">
                                        <button
                                            onClick={handleSaveAvailability}
                                            disabled={availSaving}
                                            className="px-8 py-3 bg-primary text-white text-[10px] font-black uppercase tracking-widest hover:bg-primary-dark transition-all rounded-sm disabled:opacity-50 flex items-center gap-2"
                                        >
                                            {availSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                            SYNC AVAILABILITY
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Privacy */}
                    {activeTab === "PRIVACY" && (
                        <div className="relative p-8 bg-[#080808] border border-white/5 rounded-sm">
                            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-primary"></div>

                            <div className="flex items-center gap-4 mb-8 pb-4 border-b border-white/5">
                                <Eye className="w-6 h-6 text-primary" />
                                <h2 className="text-lg font-black text-white italic tracking-tighter uppercase">PRIVACY PROTOCOLS</h2>
                            </div>

                            <div>
                                <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest mb-3">PROFILE VISIBILITY</label>
                                <div className="relative group">
                                    <select
                                        value={profileVisibility}
                                        onChange={(e) => setProfileVisibility(e.target.value)}
                                        className="w-full pl-4 pr-10 py-4 bg-black border border-white/10 rounded-sm text-white focus:outline-none focus:border-primary/50 transition-all appearance-none cursor-pointer text-xs font-bold"
                                    >
                                        <option value="public">Public (Visible to all players)</option>
                                        <option value="members">Secure (Registered only)</option>
                                        <option value="private">Private (Hidden)</option>
                                    </select>
                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary pointer-events-none" />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Security */}
                    {activeTab === "SECURITY" && (
                        <div className="space-y-6">
                            <div className="relative p-8 bg-[#080808] border border-white/5 rounded-sm">
                                <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-primary"></div>
                                <div className="flex items-center gap-4 mb-8 pb-4 border-b border-white/5">
                                    <ShieldCheck className="w-6 h-6 text-primary" />
                                    <h2 className="text-lg font-black text-white italic tracking-tighter uppercase">SECURITY OVERRIDE</h2>
                                </div>

                                <div className="space-y-6">
                                    {passwordError && (
                                        <div className="flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-widest">
                                            <AlertTriangle className="w-4 h-4" /> {passwordError}
                                        </div>
                                    )}
                                    <div className="grid grid-cols-1 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-white/40 uppercase tracking-widest">CURRENT ACCESS KEY</label>
                                            <input
                                                type={showCurrentPw ? "text" : "password"}
                                                value={currentPassword}
                                                onChange={(e) => setCurrentPassword(e.target.value)}
                                                className="w-full px-4 py-4 bg-black border border-white/10 text-white focus:border-primary transition-all text-xs font-bold placeholder:opacity-20"
                                                placeholder="••••••••"
                                            />
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-white/40 uppercase tracking-widest">NEW ACCESS KEY</label>
                                                <input
                                                    type={showNewPw ? "text" : "password"}
                                                    value={newPassword}
                                                    onChange={(e) => setNewPassword(e.target.value)}
                                                    className="w-full px-4 py-4 bg-black border border-white/10 text-white focus:border-primary transition-all text-xs font-bold placeholder:opacity-20"
                                                    placeholder="MIN 8 CHARS"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-white/40 uppercase tracking-widest">CONFIRM NEW KEY</label>
                                                <input
                                                    type={showConfirmPw ? "text" : "password"}
                                                    value={confirmPassword}
                                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                                    className="w-full px-4 py-4 bg-black border border-white/10 text-white focus:border-primary transition-all text-xs font-bold placeholder:opacity-20"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex justify-end pt-4">
                                        <button
                                            onClick={handleChangePassword}
                                            disabled={changingPassword || !currentPassword || !newPassword}
                                            className="px-8 py-3 bg-primary text-white text-[10px] font-black uppercase tracking-widest hover:bg-primary-dark transition-all rounded-sm disabled:opacity-50 flex items-center gap-2"
                                        >
                                            {changingPassword ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                                            ROTATE ACCESS KEYS
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="relative p-8 bg-[#080808] border border-red-900/20 rounded-sm">
                                <div className="flex items-center gap-4 mb-6">
                                    <Trash2 className="w-6 h-6 text-red-500" />
                                    <h2 className="text-lg font-black text-white italic tracking-tighter uppercase">PURGE PROTOCOL</h2>
                                </div>
                                <p className="text-[10px] text-white/40 font-bold mb-6">ALL MISSION DATA, SKILL MATRICES, AND IDENTITY LOGS WILL BE PERMANENTLY DELETED. THIS ACTION IS IRREVERSIBLE.</p>
                                <button
                                    onClick={() => toast.error('Account deletion requires multi-factor clearance. Please contact HQ.')}
                                    className="px-6 py-3 border border-red-500/30 text-red-500 text-[10px] font-black uppercase tracking-widest hover:bg-red-500/10 transition-all rounded-sm"
                                >
                                    INITIATE PURGE
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    </DashboardLayout>
  );
}
