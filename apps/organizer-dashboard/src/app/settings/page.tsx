"use client";

import { useState } from "react";
import OrganizerLayout from "@/components/OrganizerLayout";
import {
    User,
    Bell,
    Shield,
    CreditCard,
    Save,
    ChevronRight,
    Camera,
    ShieldCheck
} from "lucide-react";

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState("profile");

    return (
        <OrganizerLayout>
            <div className="max-w-6xl mx-auto space-y-8 pb-12">
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
                    <button className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white border border-primary hover:bg-primary-dark hover:shadow-[0_0_15px_rgba(255,92,0,0.4)] transition-all active:scale-[0.98] rounded-sm drop-shadow-md text-[10px] font-bold tracking-widest uppercase mt-4">
                        <Save className="w-4 h-4" />
                        <span>SAVE CONFIG</span>
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Navigation */}
                    <div className="space-y-1 bg-[#080808] border border-white/5 p-2 rounded-sm h-fit">
                        {[
                            { id: "profile", label: "ORG PROFILE", icon: User },
                            { id: "notifications", label: "ALERTS", icon: Bell },
                            { id: "security", label: "SECURITY", icon: Shield },
                            { id: "billing", label: "SUBSCRIPTION", icon: CreditCard },
                        ].map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
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

                    {/* Content */}
                    <div className="lg:col-span-3 space-y-6">
                        {/* Org Profile */}
                        <div className="bg-[#080808] p-8 rounded-sm space-y-8 border border-white/5 relative group">
                            <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-white/20 group-hover:border-primary/50 transition-colors"></div>

                            <div className="flex items-center gap-8 pb-8 border-b border-white/5">
                                <div className="relative group/avatar cursor-pointer">
                                    <div className="w-24 h-24 bg-[#050505] border border-white/10 flex items-center justify-center text-primary text-3xl font-black italic tracking-tighter rounded-sm overflow-hidden">
                                        <span className="group-hover/avatar:scale-110 transition-transform duration-500">TH</span>
                                    </div>
                                    <button className="absolute inset-0 bg-primary/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-all text-white border border-primary rounded-sm">
                                        <Camera className="w-6 h-6 shadow-glow-sm" />
                                    </button>
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-white flex items-center gap-3 uppercase tracking-tighter italic mb-2">
                                        TECH HUB GLOBAL
                                        <ShieldCheck className="w-6 h-6 text-green-400 drop-shadow-[0_0_5px_rgba(74,222,128,0.5)]" />
                                    </h3>
                                    <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">ORGANIZATION ACCOUNT SINCE JANUARY 2025</p>
                                    <div className="flex items-center gap-3 mt-4">
                                        <span className="px-3 py-1 flex items-center gap-1.5 text-[8px] font-bold bg-green-500/10 text-green-400 border border-green-500/20 uppercase tracking-widest rounded-sm"><ShieldCheck className="w-3 h-3" /> VERIFIED</span>
                                        <span className="px-3 py-1 text-[8px] font-bold bg-[#050505] text-primary border border-primary/20 uppercase tracking-widest rounded-sm">ENTERPRISE PLAN</span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest flex items-center gap-2">
                                        ORGANIZATION NAME
                                    </label>
                                    <input
                                        type="text"
                                        defaultValue="TECH HUB GLOBAL"
                                        className="w-full px-4 py-3 bg-[#050505] border border-white/10 text-sm text-white focus:outline-none focus:border-primary/50 transition-all font-bold tracking-wide rounded-sm placeholder:text-white/20"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest flex items-center gap-2">
                                        OFFICIAL WEBSITE
                                    </label>
                                    <input
                                        type="url"
                                        defaultValue="HTTPS://TECHHUB.GLOBAL"
                                        className="w-full px-4 py-3 bg-[#050505] border border-white/10 text-sm text-white focus:outline-none focus:border-primary/50 transition-all font-bold tracking-wide rounded-sm placeholder:text-white/20"
                                    />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest flex items-center gap-2">
                                        ABOUT ORGANIZATION
                                    </label>
                                    <textarea
                                        rows={4}
                                        defaultValue="TECH HUB GLOBAL IS A LEADING COMMUNITY FOR DEVELOPERS AND TECH ENTHUSIASTS, ORGANIZING WORLD-CLASS HACKATHONS AND INNOVATION CHALLENGES."
                                        className="w-full px-4 py-3 bg-[#050505] border border-white/10 text-sm text-white focus:outline-none focus:border-primary/50 transition-all font-bold tracking-wide resize-none rounded-sm placeholder:text-white/20"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest flex items-center gap-2">
                                        PRIMARY CONTACT EMAIL
                                    </label>
                                    <input
                                        type="email"
                                        defaultValue="EVENTS@TECHHUB.GLOBAL"
                                        className="w-full px-4 py-3 bg-[#050505] border border-white/10 text-sm text-white focus:outline-none focus:border-primary/50 transition-all font-bold tracking-wide rounded-sm placeholder:text-white/20"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest flex items-center gap-2">
                                        TIMEZONE
                                    </label>
                                    <select className="w-full px-4 py-3 bg-[#050505] border border-white/10 text-[10px] text-white focus:outline-none focus:border-primary/50 transition-all appearance-none cursor-pointer font-bold tracking-widest rounded-sm">
                                        <option>UTC (GREENWICH MEAN TIME)</option>
                                        <option>EST (EASTERN STANDARD TIME)</option>
                                        <option>PST (PACIFIC STANDARD TIME)</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Public Link */}
                        <div className="bg-[#080808] p-6 rounded-sm border border-white/5 border-l-4 border-l-primary relative overflow-hidden">
                            <div className="absolute right-0 top-0 w-32 h-32 bg-primary/10 blur-[40px] pointer-events-none"></div>

                            <h4 className="text-white font-black italic text-lg uppercase tracking-tighter mb-2">ORGANIZER PUBLIC PAGE</h4>
                            <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold mb-6">
                                THIS IS THE PUBLIC PAGE WHERE PARTICIPANTS CAN SEE ALL YOUR ACTIVE HACKATHONS AND ORGANIZATION DETAILS.
                            </p>
                            <div className="flex items-center gap-3">
                                <div className="flex-1 px-4 py-3 bg-[#050505] border border-white/10 text-white/60 text-xs font-mono tracking-wider rounded-sm flex items-center justify-between">
                                    HTTPS://TAKATHON.COM/ORG/TECH-HUB-GLOBAL
                                </div>
                                <button className="px-6 py-3 bg-transparent text-white text-[10px] font-bold uppercase tracking-widest transition-all border border-white/20 hover:border-white/50 hover:bg-white/5 rounded-sm active:scale-[0.98]">
                                    COPY LINK
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </OrganizerLayout>
    );
}
