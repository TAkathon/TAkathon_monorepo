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
                        <h1 className="text-3xl font-bold text-white mb-2">Sponsor Profile</h1>
                        <p className="text-white/60">Manage your brand identity and contact information.</p>
                    </div>
                    <button 
                        onClick={() => setIsEditing(!isEditing)}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold transition-all ${
                            isEditing 
                            ? "bg-green-500 hover:bg-green-600 text-white" 
                            : "btn-primary"
                        }`}
                    >
                        {isEditing ? <Save className="w-4 h-4" /> : "Edit Profile"}
                        {isEditing ? "Save Changes" : ""}
                    </button>
                </div>

                {/* Profile Card */}
                <div className="glass rounded-2xl overflow-hidden border border-white/10">
                    <div className="h-32 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent" />
                    <div className="px-8 pb-8">
                        <div className="relative -mt-12 mb-6 flex items-end justify-between">
                            <div className="relative group">
                                <div className="w-24 h-24 rounded-2xl bg-dark border-4 border-dark overflow-hidden glass flex items-center justify-center">
                                    <Building2 className="w-12 h-12 text-primary" />
                                </div>
                                {isEditing && (
                                    <button className="absolute inset-0 bg-black/60 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Camera className="w-6 h-6 text-white" />
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Basic Info */}
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-white/40 mb-2">Company Name</label>
                                    <input 
                                        type="text" 
                                        defaultValue={user?.fullName || "TechCorp Solutions"}
                                        disabled={!isEditing}
                                        className="input-field disabled:opacity-50 disabled:cursor-not-allowed"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-white/40 mb-2">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                                        <input 
                                            type="email" 
                                            defaultValue={user?.email || "contact@techcorp.com"}
                                            disabled={!isEditing}
                                            className="input-field pl-10 disabled:opacity-50 disabled:cursor-not-allowed"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-white/40 mb-2">Website</label>
                                    <div className="relative">
                                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                                        <input 
                                            type="text" 
                                            defaultValue="www.techcorp.com"
                                            disabled={!isEditing}
                                            className="input-field pl-10 disabled:opacity-50 disabled:cursor-not-allowed"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Bio & Socials */}
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-white/40 mb-2">Brand Description</label>
                                    <textarea 
                                        rows={4}
                                        defaultValue="Empowering developers through high-impact technical events and resources. We believe in the power of open innovation."
                                        disabled={!isEditing}
                                        className="input-field resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-white/40 mb-2">Social Links</label>
                                    <div className="flex gap-4">
                                        <button className="p-3 rounded-xl glass border-white/5 hover:border-primary/50 text-white/40 hover:text-primary transition-all">
                                            <Twitter className="w-5 h-5" />
                                        </button>
                                        <button className="p-3 rounded-xl glass border-white/5 hover:border-primary/50 text-white/40 hover:text-primary transition-all">
                                            <Linkedin className="w-5 h-5" />
                                        </button>
                                        <button className="p-3 rounded-xl glass border-white/5 hover:border-primary/50 text-white/40 hover:text-primary transition-all">
                                            <Github className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Location & Contact Info */}
                <div className="glass rounded-2xl p-8 border border-white/10">
                    <h2 className="text-xl font-bold text-white mb-6">HQ Location & Contact</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex items-start gap-4 p-4 rounded-xl bg-white/5">
                            <MapPin className="w-6 h-6 text-primary mt-1" />
                            <div>
                                <h4 className="text-white font-medium">Headquarters</h4>
                                <p className="text-sm text-white/40">Les Berges du Lac 1, Tunis 1053</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4 p-4 rounded-xl bg-white/5">
                            <Building2 className="w-6 h-6 text-primary mt-1" />
                            <div>
                                <h4 className="text-white font-medium">Industry</h4>
                                <p className="text-sm text-white/40">Information Technology</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
