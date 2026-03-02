"use client";

import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import {
    Building2,
    Mail,
    Globe,
    MapPin,
    Camera,
    Save,
    Twitter,
    Linkedin,
    Github
} from "lucide-react";
import { useAuthStore } from "@shared/utils";

export default function SponsorProfile() {
    const { user } = useAuthStore();
    const [isEditing, setIsEditing] = useState(false);

    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-white uppercase tracking-tight">Brand Profile</h1>
                        <div className="flex items-center gap-2 mt-2">
                            <div className="w-1.5 h-1.5 bg-primary animate-pulse rounded-full" />
                            <span className="text-[10px] text-white/40 uppercase tracking-[0.2em] font-bold">
                                Manage your brand identity and contact intel
                            </span>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsEditing(!isEditing)}
                        className={`flex items-center gap-2 px-6 py-2.5 font-bold text-[10px] uppercase tracking-widest transition-all ${isEditing
                                ? "bg-green-500 hover:bg-green-600 text-white"
                                : "btn-primary"
                            }`}
                    >
                        {isEditing ? <Save className="w-4 h-4" /> : null}
                        {isEditing ? "Save Changes" : "Edit Profile"}
                    </button>
                </div>

                {/* Profile Card */}
                <div className="glass rounded-xl overflow-hidden border border-white/5">
                    <div className="h-32 bg-gradient-to-r from-primary/20 via-primary/5 to-transparent" />
                    <div className="px-8 pb-8">
                        <div className="relative -mt-12 mb-6 flex items-end justify-between">
                            <div className="relative group">
                                <div className="w-24 h-24 bg-[#050505] border-4 border-[#050505] overflow-hidden glass flex items-center justify-center">
                                    <Building2 className="w-12 h-12 text-primary" />
                                </div>
                                {isEditing && (
                                    <button className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Camera className="w-6 h-6 text-white" />
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-[10px] font-bold text-white/40 mb-2 uppercase tracking-widest">Company Name</label>
                                    <input
                                        type="text"
                                        defaultValue={user?.fullName || "TechCorp Solutions"}
                                        disabled={!isEditing}
                                        className="w-full px-4 py-3 bg-black border border-white/5 text-sm text-white focus:outline-none focus:border-primary/30 transition-all font-medium tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-white/40 mb-2 uppercase tracking-widest">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                                        <input
                                            type="email"
                                            defaultValue={user?.email || "contact@techcorp.com"}
                                            disabled={!isEditing}
                                            className="w-full pl-10 pr-4 py-3 bg-black border border-white/5 text-sm text-white focus:outline-none focus:border-primary/30 transition-all font-medium tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-white/40 mb-2 uppercase tracking-widest">Website</label>
                                    <div className="relative">
                                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                                        <input
                                            type="text"
                                            defaultValue="www.techcorp.com"
                                            disabled={!isEditing}
                                            className="w-full pl-10 pr-4 py-3 bg-black border border-white/5 text-sm text-white focus:outline-none focus:border-primary/30 transition-all font-medium tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-[10px] font-bold text-white/40 mb-2 uppercase tracking-widest">Brand Description</label>
                                    <textarea
                                        rows={4}
                                        defaultValue="Empowering developers through high-impact technical events and resources. We believe in the power of open innovation."
                                        disabled={!isEditing}
                                        className="w-full px-4 py-3 bg-black border border-white/5 text-sm text-white focus:outline-none focus:border-primary/30 transition-all font-medium tracking-wide resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-white/40 mb-2 uppercase tracking-widest">Social Links</label>
                                    <div className="flex gap-4">
                                        <button className="p-3 bg-white/[0.02] border border-white/5 hover:border-primary/30 text-white/30 hover:text-primary transition-all">
                                            <Twitter className="w-5 h-5" />
                                        </button>
                                        <button className="p-3 bg-white/[0.02] border border-white/5 hover:border-primary/30 text-white/30 hover:text-primary transition-all">
                                            <Linkedin className="w-5 h-5" />
                                        </button>
                                        <button className="p-3 bg-white/[0.02] border border-white/5 hover:border-primary/30 text-white/30 hover:text-primary transition-all">
                                            <Github className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Location */}
                <div className="glass rounded-xl p-8 border border-white/5">
                    <h2 className="text-sm font-bold text-white mb-6 uppercase tracking-widest">HQ Location & Contact</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex items-start gap-4 p-4 bg-white/[0.02] border border-white/5">
                            <MapPin className="w-6 h-6 text-primary mt-1" />
                            <div>
                                <h4 className="text-white font-bold text-xs uppercase tracking-wider">Headquarters</h4>
                                <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Les Berges du Lac 1, Tunis 1053</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4 p-4 bg-white/[0.02] border border-white/5">
                            <Building2 className="w-6 h-6 text-primary mt-1" />
                            <div>
                                <h4 className="text-white font-bold text-xs uppercase tracking-wider">Industry</h4>
                                <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Information Technology</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
