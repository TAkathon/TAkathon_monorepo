"use client";

import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Bell, Eye, ChevronDown, ChevronRight } from "lucide-react";

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState("NOTIFICATIONS");
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [pushNotifications, setPushNotifications] = useState(true);
    const [teamChatAlerts, setTeamChatAlerts] = useState(false);

    const tabs = ["NOTIFICATIONS", "PRIVACY", "SECURITY"];

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
                                className={`w-full flex items-center justify-between px-5 py-4 text-[10px] font-bold tracking-widest uppercase transition-all
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
                        {/* System Alerts */}
                        <div className="relative p-8 bg-[#080808] border border-white/5 rounded-sm">
                            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-primary"></div>
                            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-primary"></div>

                            <div className="flex items-center gap-4 mb-8 pb-4 border-b border-white/5">
                                <Bell className="w-6 h-6 text-primary" />
                                <h2 className="text-lg font-black text-white italic tracking-tighter uppercase">SYSTEM ALERTS</h2>
                            </div>

                            <div className="space-y-4">
                                {/* Email Notifications */}
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

                                {/* Push Notifications */}
                                <div className="flex items-center justify-between p-5 bg-white/[0.02] border border-white/5 rounded-sm">
                                    <div>
                                        <p className="text-xs font-black text-white uppercase tracking-wider mb-1">PUSH NOTIFICATIONS</p>
                                        <p className="text-[10px] text-white/40 font-bold">Real-time alerts on your device for immediate action.</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" checked={pushNotifications} onChange={(e) => setPushNotifications(e.target.checked)} className="sr-only peer" />
                                        <div className="w-12 h-6 bg-white/10 peer-focus:outline-none rounded-full peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary border border-white/10"></div>
                                    </label>
                                </div>

                                {/* Team Chat Alerts */}
                                <div className="flex items-center justify-between p-5 bg-white/[0.02] border border-white/5 rounded-sm">
                                    <div>
                                        <p className="text-xs font-black text-white uppercase tracking-wider mb-1">TEAM CHAT ALERTS</p>
                                        <p className="text-[10px] text-white/40 font-bold">Get notified when team members message you.</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" checked={teamChatAlerts} onChange={(e) => setTeamChatAlerts(e.target.checked)} className="sr-only peer" />
                                        <div className="w-12 h-6 bg-white/10 peer-focus:outline-none rounded-full peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white/50 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary border border-white/10"></div>
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Privacy Protocols */}
                        <div className="relative p-8 bg-[#080808] border border-white/5 rounded-sm">
                            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-primary"></div>

                            <div className="flex items-center gap-4 mb-8 pb-4 border-b border-white/5">
                                <Eye className="w-6 h-6 text-primary" />
                                <h2 className="text-lg font-black text-white italic tracking-tighter uppercase">PRIVACY PROTOCOLS</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-[10px] font-bold text-primary uppercase tracking-widest mb-3">
                                        PROFILE VISIBILITY
                                    </label>
                                    <div className="relative group">
                                        <select
                                            className="w-full pl-4 pr-10 py-4 bg-black border border-white/10 rounded-sm text-white focus:outline-none focus:border-primary/50 transition-all appearance-none cursor-pointer text-xs font-bold"
                                        >
                                            <option>Public (Visible to all players)</option>
                                            <option>Secure (Registered only)</option>
                                            <option>Private (Hidden)</option>
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-primary group-focus-within:text-primary-light transition-colors">
                                            <ChevronDown className="w-4 h-4" />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[10px] font-bold text-primary uppercase tracking-widest mb-3">
                                        DATA SHARING
                                    </label>
                                    <div className="relative group">
                                        <select
                                            className="w-full pl-4 pr-10 py-4 bg-black border border-white/10 rounded-sm text-white focus:outline-none focus:border-primary/50 transition-all appearance-none cursor-pointer text-xs font-bold"
                                        >
                                            <option>Performance Only</option>
                                            <option>Full Metrics</option>
                                            <option>None</option>
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-primary group-focus-within:text-primary-light transition-colors">
                                            <ChevronDown className="w-4 h-4" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

