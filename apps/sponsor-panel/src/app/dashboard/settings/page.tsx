"use client";

import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import {
    Bell,
    Shield,
    User,
    CreditCard,
    Save,
    ChevronRight,
    ToggleLeft,
    ToggleRight,
    Lock,
    Key
} from "lucide-react";

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState("notifications");
    const [emailNotifs, setEmailNotifs] = useState(true);
    const [pushNotifs, setPushNotifs] = useState(false);
    const [weeklyDigest, setWeeklyDigest] = useState(true);

    const Toggle = ({ enabled, onClick }: { enabled: boolean; onClick: () => void }) => (
        <button onClick={onClick} className="relative">
            {enabled ? (
                <ToggleRight className="w-10 h-6 text-primary" />
            ) : (
                <ToggleLeft className="w-10 h-6 text-white/20" />
            )}
        </button>
    );

    return (
        <DashboardLayout>
            <div className="space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-white uppercase tracking-tight">System Configuration</h1>
                        <div className="flex items-center gap-2 mt-2">
                            <div className="w-1.5 h-1.5 bg-primary animate-pulse rounded-full" />
                            <span className="text-[10px] text-white/40 uppercase tracking-[0.2em] font-bold">
                                Manage account preferences and security parameters
                            </span>
                        </div>
                    </div>
                    <button className="btn-primary flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold">
                        <Save className="w-4 h-4" />
                        Save Config
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Tabs */}
                    <div className="space-y-2">
                        {[
                            { id: "notifications", label: "Alerts Config", icon: Bell },
                            { id: "security", label: "Security", icon: Shield },
                            { id: "billing", label: "Billing", icon: CreditCard },
                            { id: "account", label: "Account", icon: User },
                        ].map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-full flex items-center justify-between px-4 py-3 transition-all border-l-2 ${activeTab === tab.id
                                            ? "bg-primary/10 text-white border-primary"
                                            : "text-white/40 border-transparent hover:bg-white/5 hover:text-white/70"
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <Icon className={`w-4 h-4 ${activeTab === tab.id ? "text-primary" : ""}`} />
                                        <span className="font-bold text-[11px] uppercase tracking-widest">{tab.label}</span>
                                    </div>
                                    <ChevronRight className={`w-4 h-4 transition-transform ${activeTab === tab.id ? "rotate-90 text-primary" : ""}`} />
                                </button>
                            );
                        })}
                    </div>

                    {/* Content */}
                    <div className="lg:col-span-3 space-y-6">
                        {/* Notifications */}
                        {activeTab === "notifications" && (
                            <div className="glass rounded-xl p-6 border border-white/5 space-y-6">
                                <h3 className="text-sm font-bold text-white uppercase tracking-widest">Alert Preferences</h3>
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between pb-6 border-b border-white/5">
                                        <div>
                                            <p className="text-white font-bold text-xs uppercase tracking-wider">Email Notifications</p>
                                            <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold">Receive alerts via email for new requests and updates</p>
                                        </div>
                                        <Toggle enabled={emailNotifs} onClick={() => setEmailNotifs(!emailNotifs)} />
                                    </div>
                                    <div className="flex items-center justify-between pb-6 border-b border-white/5">
                                        <div>
                                            <p className="text-white font-bold text-xs uppercase tracking-wider">Push Notifications</p>
                                            <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold">Browser push alerts for time-sensitive events</p>
                                        </div>
                                        <Toggle enabled={pushNotifs} onClick={() => setPushNotifs(!pushNotifs)} />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-white font-bold text-xs uppercase tracking-wider">Weekly Digest</p>
                                            <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold">Summary of all activity sent every Monday</p>
                                        </div>
                                        <Toggle enabled={weeklyDigest} onClick={() => setWeeklyDigest(!weeklyDigest)} />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Security */}
                        {activeTab === "security" && (
                            <div className="glass rounded-xl p-6 border border-white/5 space-y-6">
                                <h3 className="text-sm font-bold text-white uppercase tracking-widest">Security Parameters</h3>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest flex items-center gap-2">
                                            <Lock className="w-3.5 h-3.5" /> Current Password
                                        </label>
                                        <input type="password" className="w-full px-4 py-3 bg-black border border-white/5 text-sm text-white focus:outline-none focus:border-primary/30 transition-all font-medium tracking-wide" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest flex items-center gap-2">
                                            <Key className="w-3.5 h-3.5" /> New Password
                                        </label>
                                        <input type="password" className="w-full px-4 py-3 bg-black border border-white/5 text-sm text-white focus:outline-none focus:border-primary/30 transition-all font-medium tracking-wide" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Confirm New Password</label>
                                        <input type="password" className="w-full px-4 py-3 bg-black border border-white/5 text-sm text-white focus:outline-none focus:border-primary/30 transition-all font-medium tracking-wide" />
                                    </div>
                                    <button className="btn-primary text-[10px] uppercase tracking-widest font-bold mt-2">
                                        Update Password
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Billing */}
                        {activeTab === "billing" && (
                            <div className="glass rounded-xl p-6 border border-white/5 space-y-6">
                                <h3 className="text-sm font-bold text-white uppercase tracking-widest">Billing & Plan</h3>
                                <div className="p-6 bg-white/[0.02] border border-primary/20 border-l-4 border-l-primary">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <h4 className="text-white font-bold text-xs uppercase tracking-widest">Pro Plan</h4>
                                            <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">$99/month • Auto-renews Mar 15, 2026</p>
                                        </div>
                                        <button className="text-primary text-[10px] font-bold uppercase tracking-widest hover:text-primary-light transition-colors">
                                            Upgrade
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Account */}
                        {activeTab === "account" && (
                            <div className="glass rounded-xl p-6 border border-white/5 space-y-6">
                                <h3 className="text-sm font-bold text-white uppercase tracking-widest">Account Management</h3>
                                <div className="p-5 bg-red-500/5 border border-red-500/20 rounded-lg">
                                    <h4 className="text-red-400 font-bold text-xs uppercase tracking-widest mb-1">Danger Zone</h4>
                                    <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold mb-4">
                                        Permanently delete your sponsor account and all associated data. This action is irreversible.
                                    </p>
                                    <button className="px-4 py-2 bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-all text-[10px] uppercase tracking-widest font-bold">
                                        Delete Account
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
