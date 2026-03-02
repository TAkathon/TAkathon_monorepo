"use client";

import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
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
        <DashboardLayout>
            <div className="space-y-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-white uppercase tracking-tight">System Configuration</h1>
                        <div className="flex items-center gap-2 mt-2">
                            <div className="w-1.5 h-1.5 bg-primary animate-pulse rounded-full" />
                            <span className="text-[10px] text-white/40 uppercase tracking-[0.2em] font-bold">
                                Manage organization and account parameters
                            </span>
                        </div>
                    </div>
                    <button className="btn-primary flex items-center justify-center gap-2 text-[10px] uppercase tracking-widest font-bold">
                        <Save className="w-4 h-4" />
                        <span>Save Config</span>
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Navigation */}
                    <div className="space-y-2">
                        {[
                            { id: "profile", label: "Org Profile", icon: User },
                            { id: "notifications", label: "Alerts", icon: Bell },
                            { id: "security", label: "Security", icon: Shield },
                            { id: "billing", label: "Subscription", icon: CreditCard },
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
                        {/* Org Profile */}
                        <div className="glass p-6 rounded-xl space-y-6 border border-white/5">
                            <div className="flex items-center gap-6">
                                <div className="relative group">
                                    <div className="w-24 h-24 bg-primary/10 border border-primary/20 flex items-center justify-center text-primary text-3xl font-black">
                                        TH
                                    </div>
                                    <button className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all text-white">
                                        <Camera className="w-6 h-6" />
                                    </button>
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white flex items-center gap-2 uppercase tracking-wider">
                                        Tech Hub Global
                                        <ShieldCheck className="w-5 h-5 text-green-400" />
                                    </h3>
                                    <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Organization account since January 2025</p>
                                    <div className="flex items-center gap-2 mt-2">
                                        <span className="px-2 py-0.5 text-[8px] font-bold bg-green-500/10 text-green-400 border border-green-500/20 uppercase tracking-widest">Verified</span>
                                        <span className="px-2 py-0.5 text-[8px] font-bold bg-primary/10 text-primary border border-primary/20 uppercase tracking-widest">Enterprise Plan</span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Organization Name</label>
                                    <input
                                        type="text"
                                        defaultValue="Tech Hub Global"
                                        className="w-full px-4 py-3 bg-black border border-white/5 text-sm text-white focus:outline-none focus:border-primary/30 transition-all font-medium tracking-wide"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Official Website</label>
                                    <input
                                        type="url"
                                        defaultValue="https://techhub.global"
                                        className="w-full px-4 py-3 bg-black border border-white/5 text-sm text-white focus:outline-none focus:border-primary/30 transition-all font-medium tracking-wide"
                                    />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">About Organization</label>
                                    <textarea
                                        rows={4}
                                        defaultValue="Tech Hub Global is a leading community for developers and tech enthusiasts, organizing world-class hackathons and innovation challenges."
                                        className="w-full px-4 py-3 bg-black border border-white/5 text-sm text-white focus:outline-none focus:border-primary/30 transition-all font-medium tracking-wide resize-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Primary Contact Email</label>
                                    <input
                                        type="email"
                                        defaultValue="events@techhub.global"
                                        className="w-full px-4 py-3 bg-black border border-white/5 text-sm text-white focus:outline-none focus:border-primary/30 transition-all font-medium tracking-wide"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Timezone</label>
                                    <select className="w-full px-4 py-3 bg-black border border-white/5 text-sm text-white focus:outline-none focus:border-primary/30 transition-all appearance-none cursor-pointer font-medium tracking-wide">
                                        <option>UTC (Greenwich Mean Time)</option>
                                        <option>EST (Eastern Standard Time)</option>
                                        <option>PST (Pacific Standard Time)</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Public Link */}
                        <div className="glass p-6 rounded-xl border-l-4 border-primary">
                            <h4 className="text-white font-bold text-xs uppercase tracking-widest mb-2">Organizer Public Page</h4>
                            <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold mb-4">
                                This is the public page where participants can see all your active hackathons and organization details.
                            </p>
                            <div className="flex items-center gap-2">
                                <div className="flex-1 px-4 py-2 bg-black border border-white/5 text-white/40 text-xs font-mono tracking-wider">
                                    takathon.com/org/tech-hub-global
                                </div>
                                <button className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-[10px] font-bold uppercase tracking-widest transition-all border border-white/5">
                                    Copy Link
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
