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
                        <h1 className="text-3xl font-bold text-white">Settings</h1>
                        <p className="text-white/60 mt-1">Manage your organization and account preferences</p>
                    </div>
                    <button className="btn-primary flex items-center justify-center gap-2">
                        <Save className="w-5 h-5" />
                        <span>Save Changes</span>
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Navigation */}
                    <div className="space-y-2">
                        {[
                            { id: "profile", label: "Org Profile", icon: User },
                            { id: "notifications", label: "Notifications", icon: Bell },
                            { id: "security", label: "Security", icon: Shield },
                            { id: "billing", label: "Subscription", icon: CreditCard },
                        ].map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all ${
                                        activeTab === tab.id 
                                            ? "bg-primary/10 text-primary border border-primary/20" 
                                            : "text-white/60 hover:bg-white/5 hover:text-white"
                                    }`}
                                >
                                    <div className="flex items-center gap-3 font-medium">
                                        <Icon className="w-5 h-5" />
                                        {tab.label}
                                    </div>
                                    <ChevronRight className={`w-4 h-4 transition-transform ${activeTab === tab.id ? "rotate-90" : ""}`} />
                                </button>
                            );
                        })}
                    </div>

                    {/* Content */}
                    <div className="lg:col-span-3 space-y-6">
                        {/* Org Profile */}
                        <div className="glass p-6 rounded-xl space-y-6">
                            <div className="flex items-center gap-6">
                                <div className="relative group">
                                    <div className="w-24 h-24 rounded-2xl bg-primary/10 flex items-center justify-center text-primary text-3xl font-bold border border-primary/20">
                                        TH
                                    </div>
                                    <button className="absolute inset-0 bg-black/60 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all text-white">
                                        <Camera className="w-6 h-6" />
                                    </button>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                        Tech Hub Global
                                        <ShieldCheck className="w-5 h-5 text-green-400" />
                                    </h3>
                                    <p className="text-white/40 text-sm">Organization account since January 2025</p>
                                    <div className="flex items-center gap-2 mt-2">
                                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-500/10 text-green-400 border border-green-500/20 uppercase">Verified</span>
                                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-primary/10 text-primary border border-primary/20 uppercase">Enterprise Plan</span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-white/60">Organization Name</label>
                                    <input 
                                        type="text" 
                                        defaultValue="Tech Hub Global"
                                        className="input-field" 
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-white/60">Official Website</label>
                                    <input 
                                        type="url" 
                                        defaultValue="https://techhub.global"
                                        className="input-field" 
                                    />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-sm font-medium text-white/60">About Organization</label>
                                    <textarea 
                                        rows={4}
                                        defaultValue="Tech Hub Global is a leading community for developers and tech enthusiasts, organizing world-class hackathons and innovation challenges."
                                        className="input-field resize-none" 
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-white/60">Primary Contact Email</label>
                                    <input 
                                        type="email" 
                                        defaultValue="events@techhub.global"
                                        className="input-field" 
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-white/60">Timezone</label>
                                    <select className="input-field appearance-none cursor-pointer">
                                        <option>UTC (Greenwich Mean Time)</option>
                                        <option>EST (Eastern Standard Time)</option>
                                        <option>PST (Pacific Standard Time)</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Public Link */}
                        <div className="glass p-6 rounded-xl border-l-4 border-primary">
                            <h4 className="text-white font-bold mb-2">Organizer Public Page</h4>
                            <p className="text-sm text-white/60 mb-4">
                                This is the public page where participants can see all your active hackathons and organization details.
                            </p>
                            <div className="flex items-center gap-2">
                                <div className="flex-1 px-4 py-2 bg-white/5 rounded-lg text-white/40 text-sm border border-white/10 font-mono">
                                    takathon.com/org/tech-hub-global
                                </div>
                                <button className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all text-sm font-medium">
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
