"use client";

import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Bell, Lock, Globe, Eye, Mail, Shield, Trash2 } from "lucide-react";

export default function SettingsPage() {
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [pushNotifications, setPushNotifications] = useState(true);
    const [teamInvites, setTeamInvites] = useState(true);
    const [hackathonUpdates, setHackathonUpdates] = useState(true);
    const [profileVisibility, setProfileVisibility] = useState("public");

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
                            <select
                                value={profileVisibility}
                                onChange={(e) => setProfileVisibility(e.target.value)}
                                className="input-field"
                            >
                                <option value="public">Public - Anyone can see my profile</option>
                                <option value="members">Members Only - Only registered users</option>
                                <option value="teams">Teams Only - Only my teammates</option>
                                <option value="private">Private - Hidden from everyone</option>
                            </select>
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
