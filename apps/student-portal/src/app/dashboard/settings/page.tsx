"use client";

import { useState, useEffect } from "react";
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
} from "lucide-react";
import { studentApi } from "@takathon/shared/api";
import type { AvailabilitySlot } from "@takathon/shared/api";
import { toast } from "sonner";

// ─── Availability config ──────────────────────────────────────────────────────

const SLOT_LABELS: Record<AvailabilitySlot, string> = {
    weekday_morning:   "Weekday Mornings (6 AM – 12 PM)",
    weekday_afternoon: "Weekday Afternoons (12 PM – 6 PM)",
    weekday_evening:   "Weekday Evenings (6 PM – 11 PM)",
    weekend_morning:   "Weekend Mornings (6 AM – 12 PM)",
    weekend_afternoon: "Weekend Afternoons (12 PM – 6 PM)",
    weekend_evening:   "Weekend Evenings (6 PM – 11 PM)",
};

const ALL_SLOTS = Object.keys(SLOT_LABELS) as AvailabilitySlot[];

const COMMON_TIMEZONES = [
    "UTC-12", "UTC-11", "UTC-10", "UTC-9", "UTC-8", "UTC-7", "UTC-6",
    "UTC-5", "UTC-4", "UTC-3", "UTC-2", "UTC-1",
    "UTC", "UTC+1", "UTC+2", "UTC+3", "UTC+4", "UTC+5", "UTC+5:30",
    "UTC+6", "UTC+7", "UTC+8", "UTC+9", "UTC+10", "UTC+11", "UTC+12",
];

export default function SettingsPage() {
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

    useEffect(() => {
        studentApi.getMyProfile().then((profile) => {
            const avail = profile.availability;
            if (avail) {
                setTimezone(avail.timezone ?? "UTC");
                setHoursPerWeek(avail.hoursPerWeek ?? 10);
                setSelectedSlots(new Set(avail.preferredSlots ?? []));
            }
        }).catch(() => {/* profile may not exist yet */}).finally(() => setAvailLoading(false));
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
            toast.error("Please select at least one time slot");
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
            toast.success("Availability saved — AI matching will now use your schedule");
        } catch {
            toast.error("Failed to save availability");
        } finally {
            setAvailSaving(false);
        }
    };

    return (
        <DashboardLayout>
            <div className="space-y-6 max-w-4xl">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
                    <p className="text-white/60">Manage your account preferences and security</p>
                </div>

                {/* Notifications */}
                <div className="glass rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <Bell className="w-6 h-6 text-primary" />
                        <h2 className="text-xl font-bold text-white">Notifications</h2>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                            <div>
                                <p className="font-medium text-white">Email Notifications</p>
                                <p className="text-sm text-white/60">Receive updates via email</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={emailNotifications}
                                    onChange={(e) => setEmailNotifications(e.target.checked)}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                            </label>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                            <div>
                                <p className="font-medium text-white">Push Notifications</p>
                                <p className="text-sm text-white/60">Get push notifications on your device</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={pushNotifications}
                                    onChange={(e) => setPushNotifications(e.target.checked)}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                            </label>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                            <div>
                                <p className="font-medium text-white">Team Invitations</p>
                                <p className="text-sm text-white/60">Get notified when invited to teams</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={teamInvites}
                                    onChange={(e) => setTeamInvites(e.target.checked)}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                            </label>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                            <div>
                                <p className="font-medium text-white">Hackathon Updates</p>
                                <p className="text-sm text-white/60">Updates about registered hackathons</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={hackathonUpdates}
                                    onChange={(e) => setHackathonUpdates(e.target.checked)}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                            </label>
                        </div>
                    </div>
                </div>

                {/* ── Availability ──────────────────────────────────────────── */}
                <div className="glass rounded-xl p-6">
                    <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center gap-3">
                            <Clock className="w-6 h-6 text-primary" />
                            <div>
                                <h2 className="text-xl font-bold text-white">Availability</h2>
                                <p className="text-white/50 text-sm">
                                    Used by the AI to find teammates whose schedule matches yours
                                </p>
                            </div>
                        </div>
                    </div>

                    {availLoading ? (
                        <div className="flex items-center justify-center py-8">
                            <Loader2 className="w-6 h-6 text-primary animate-spin" />
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* Timezone + hours */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-white/60 mb-2">
                                        Timezone
                                    </label>
                                    <div className="relative">
                                        <select
                                            value={timezone}
                                            onChange={(e) => setTimezone(e.target.value)}
                                            className="input-field appearance-none pr-10"
                                        >
                                            {COMMON_TIMEZONES.map((tz) => (
                                                <option key={tz} value={tz}>{tz}</option>
                                            ))}
                                        </select>
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-white/40">
                                            <ChevronDown className="w-4 h-4" />
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-white/60 mb-2">
                                        Hours available per week
                                    </label>
                                    <input
                                        type="number"
                                        min={1}
                                        max={80}
                                        value={hoursPerWeek}
                                        onChange={(e) => setHoursPerWeek(Math.max(1, parseInt(e.target.value) || 1))}
                                        className="input-field"
                                    />
                                </div>
                            </div>

                            {/* Preferred time slots */}
                            <div>
                                <label className="block text-sm font-medium text-white/60 mb-3">
                                    Preferred time slots{" "}
                                    <span className="text-white/30">(select all that apply)</span>
                                </label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {ALL_SLOTS.map((slot) => {
                                        const active = selectedSlots.has(slot);
                                        return (
                                            <button
                                                key={slot}
                                                type="button"
                                                onClick={() => toggleSlot(slot)}
                                                className={`flex items-center gap-3 px-4 py-3 rounded-lg border text-left transition-all ${
                                                    active
                                                        ? "bg-primary/20 border-primary/50 text-white"
                                                        : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10"
                                                }`}
                                            >
                                                <div
                                                    className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 ${
                                                        active
                                                            ? "bg-primary border-primary"
                                                            : "border-white/30"
                                                    }`}
                                                >
                                                    {active && (
                                                        <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 10 10">
                                                            <path d="M1.5 5L4 7.5L8.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                        </svg>
                                                    )}
                                                </div>
                                                <span className="text-sm font-medium">{SLOT_LABELS[slot]}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Save button */}
                            <div className="flex justify-end pt-2">
                                <button
                                    onClick={handleSaveAvailability}
                                    disabled={availSaving}
                                    className="px-5 py-2 bg-primary hover:bg-primary-dark disabled:opacity-50 text-white font-semibold rounded-lg transition-all flex items-center gap-2"
                                >
                                    {availSaving ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <Save className="w-4 h-4" />
                                    )}
                                    Save Availability
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Privacy */}
                <div className="glass rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <Eye className="w-6 h-6 text-primary" />
                        <h2 className="text-xl font-bold text-white">Privacy</h2>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-white mb-2">
                                Profile Visibility
                            </label>
                            <div className="relative">
                                <select
                                    value={profileVisibility}
                                    onChange={(e) => setProfileVisibility(e.target.value)}
                                    className="input-field appearance-none pr-10"
                                >
                                    <option value="public">Public - Anyone can see my profile</option>
                                    <option value="members">Members Only - Only registered users</option>
                                    <option value="teams">Teams Only - Only my teammates</option>
                                    <option value="private">Private - Hidden from everyone</option>
                                </select>
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-white/40">
                                    <ChevronDown className="w-4 h-4" />

                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Security */}
                <div className="glass rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <Lock className="w-6 h-6 text-primary" />
                        <h2 className="text-xl font-bold text-white">Security</h2>
                    </div>
                    <div className="space-y-4">
                        <button className="w-full p-4 bg-white/5 hover:bg-white/10 rounded-lg text-left transition-all group">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Lock className="w-5 h-5 text-white/40 group-hover:text-primary transition-colors" />
                                    <div>
                                        <p className="font-medium text-white">Change Password</p>
                                        <p className="text-sm text-white/60">Update your password</p>
                                    </div>
                                </div>
                                <span className="text-white/40 group-hover:text-white transition-colors">→</span>
                            </div>
                        </button>

                        <button className="w-full p-4 bg-white/5 hover:bg-white/10 rounded-lg text-left transition-all group">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Shield className="w-5 h-5 text-white/40 group-hover:text-primary transition-colors" />
                                    <div>
                                        <p className="font-medium text-white">Two-Factor Authentication</p>
                                        <p className="text-sm text-white/60">Add extra security layer</p>
                                    </div>
                                </div>
                                <span className="text-white/40 group-hover:text-white transition-colors">→</span>
                            </div>
                        </button>

                        <button className="w-full p-4 bg-white/5 hover:bg-white/10 rounded-lg text-left transition-all group">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Mail className="w-5 h-5 text-white/40 group-hover:text-primary transition-colors" />
                                    <div>
                                        <p className="font-medium text-white">Connected Accounts</p>
                                        <p className="text-sm text-white/60">Manage linked accounts</p>
                                    </div>
                                </div>
                                <span className="text-white/40 group-hover:text-white transition-colors">→</span>
                            </div>
                        </button>
                    </div>
                </div>

                {/* Danger Zone */}
                <div className="glass rounded-xl p-6 border-2 border-red-500/20">
                    <div className="flex items-center gap-3 mb-4">
                        <Trash2 className="w-6 h-6 text-red-500" />
                        <h2 className="text-xl font-bold text-white">Danger Zone</h2>
                    </div>
                    <p className="text-white/60 text-sm mb-4">
                        Once you delete your account, there is no going back. Please be certain.
                    </p>
                    <button className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-400 font-medium rounded-lg transition-all duration-200">
                        Delete Account
                    </button>
                </div>
            </div>
        </DashboardLayout>
    );
}
