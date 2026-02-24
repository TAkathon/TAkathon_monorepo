"use client";

import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Bell, Lock, Globe, Eye, Mail, Shield, Trash2, ChevronDown } from "lucide-react";

export default function SettingsPage() {
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [pushNotifications, setPushNotifications] = useState(true);
    const [teamInvites, setTeamInvites] = useState(true);
    const [hackathonUpdates, setHackathonUpdates] = useState(true);
    const [profileVisibility, setProfileVisibility] = useState("public");

    return (
        <DashboardLayout>
            <div className="space-y-6 max-w-4xl">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2 uppercase tracking-tight">System Configuration</h1>
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-primary animate-pulse rounded-full" />
                        <span className="text-xs text-white/40 uppercase tracking-[0.2em] font-bold">
                            Customize your tactical dashboard and security protocols
                        </span>
                    </div>
                </div>

                <div className="glass rounded-2xl p-8 border border-white/10 shadow-glow-primary/5">
                    <div className="flex items-center gap-3 mb-6">
                        <Bell className="w-6 h-6 text-primary drop-shadow-glow-sm" />
                        <h2 className="text-sm font-bold text-white uppercase tracking-widest">Intelligence Feed</h2>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-5 bg-white/[0.02] border border-white/5 rounded-xl hover:bg-white/5 transition-all duration-300">
                            <div>
                                <p className="text-xs font-bold text-white uppercase tracking-wider">Email Intel</p>
                                <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold mt-1">Receive mission updates via secure mail</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={emailNotifications}
                                    onChange={(e) => setEmailNotifications(e.target.checked)}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary shadow-inner"></div>
                            </label>
                        </div>

                        <div className="flex items-center justify-between p-5 bg-white/[0.02] border border-white/5 rounded-xl hover:bg-white/5 transition-all duration-300">
                            <div>
                                <p className="text-xs font-bold text-white uppercase tracking-wider">Push Alerts</p>
                                <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold mt-1">Real-time tactical notifications on your device</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={pushNotifications}
                                    onChange={(e) => setPushNotifications(e.target.checked)}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary shadow-inner"></div>
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
                <div className="glass rounded-2xl p-8 border border-white/10 shadow-glow-primary/5">
                    <div className="flex items-center gap-3 mb-6">
                        <Eye className="w-6 h-6 text-primary drop-shadow-glow-sm" />
                        <h2 className="text-sm font-bold text-white uppercase tracking-widest">Privacy Protocols</h2>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] mb-3">
                                Field Visibility
                            </label>
                            <div className="relative group">
                                <select
                                    value={profileVisibility}
                                    onChange={(e) => setProfileVisibility(e.target.value)}
                                    className="w-full pl-4 pr-10 py-3.5 bg-white/[0.02] border border-white/5 rounded-xl text-white focus:outline-none focus:border-primary/50 focus:bg-white/5 transition-all appearance-none cursor-pointer text-xs uppercase tracking-[0.15em] font-bold"
                                >
                                    <option value="public" className="bg-dark text-white">PUBLIC - OPEN NETWORK</option>
                                    <option value="members" className="bg-dark text-white">SECURE - REGISTERED ONLY</option>
                                    <option value="teams" className="bg-dark text-white">SQUAD - TEAMMATES ONLY</option>
                                    <option value="private" className="bg-dark text-white">STEALTH - HIDDEN FROM GRID</option>
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/40 group-focus-within:text-primary transition-colors">
                                    <ChevronDown className="w-4 h-4" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Security */}
                <div className="glass rounded-2xl p-8 border border-white/10 shadow-glow-primary/5">
                    <div className="flex items-center gap-3 mb-6">
                        <Lock className="w-6 h-6 text-primary drop-shadow-glow-sm" />
                        <h2 className="text-sm font-bold text-white uppercase tracking-widest">Tactical Security</h2>
                    </div>
                    <div className="space-y-3">
                        <button className="w-full p-5 bg-white/[0.02] border border-white/5 hover:border-primary/20 rounded-xl text-left transition-all group">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                                        <Lock className="w-5 h-5 text-white/40 group-hover:text-primary transition-colors" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-white uppercase tracking-wider">Change Access Code</p>
                                        <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold mt-1">Update your mission authentication</p>
                                    </div>
                                </div>
                                <span className="text-white/20 group-hover:text-primary transition-all translate-x-0 group-hover:translate-x-1">→</span>
                            </div>
                        </button>

                        <button className="w-full p-5 bg-white/[0.02] border border-white/5 hover:border-primary/20 rounded-xl text-left transition-all group">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                                        <Shield className="w-5 h-5 text-white/40 group-hover:text-primary transition-colors" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-white uppercase tracking-wider">Two-Factor Encryption</p>
                                        <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold mt-1">Add redundant biometric security layer</p>
                                    </div>
                                </div>
                                <span className="text-white/20 group-hover:text-primary transition-all translate-x-0 group-hover:translate-x-1">→</span>
                            </div>
                        </button>
                    </div>
                </div>

                {/* Danger Zone */}
                <div className="glass rounded-2xl p-8 border border-red-500/10 hover:border-red-500/20 shadow-glow-red/5 transition-all">
                    <div className="flex items-center gap-3 mb-4">
                        <Trash2 className="w-6 h-6 text-red-500 drop-shadow-glow-red-sm" />
                        <h2 className="text-sm font-bold text-white uppercase tracking-widest">Self-Destruct Sequence</h2>
                    </div>
                    <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest mb-6 leading-relaxed">
                        Initiating account deletion is irreversible. All mission data and squad history will be purged.
                    </p>
                    <button className="px-6 py-2.5 bg-red-500/10 hover:bg-red-500 border border-red-500/30 hover:border-red-500 text-red-400 hover:text-white text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all duration-300">
                        Terminate Account
                    </button>
                </div>
            </div>
        </DashboardLayout>
    );
}
