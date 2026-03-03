"use client";

import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { 
    Calendar, 
    MapPin, 
    Globe, 
    DollarSign, 
    Users, 
    Image as ImageIcon,
    Loader2
} from "lucide-react";
import { organizerApi } from "@takathon/shared/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function CreateHackathonPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        startDate: "",
        endDate: "",
        registrationDeadline: "",
        location: "",
        isVirtual: false,
        maxParticipants: "",
        maxTeamSize: "",
        minTeamSize: "",
        prizePool: "",
        bannerUrl: "",
        websiteUrl: "",
        requiredSkills: [] as string[]
    });

    const [skillInput, setSkillInput] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleAddSkill = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && skillInput.trim()) {
            e.preventDefault();
            if (!formData.requiredSkills.includes(skillInput.trim())) {
                setFormData(prev => ({
                    ...prev,
                    requiredSkills: [...prev.requiredSkills, skillInput.trim()]
                }));
            }
            setSkillInput("");
        }
    };

    const removeSkill = (skillToRemove: string) => {
        setFormData(prev => ({
            ...prev,
            requiredSkills: prev.requiredSkills.filter(skill => skill !== skillToRemove)
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Convert to API payload format
            const payload = {
                ...formData,
                maxParticipants: formData.maxParticipants ? parseInt(formData.maxParticipants) : undefined,
                maxTeamSize: formData.maxTeamSize ? parseInt(formData.maxTeamSize) : undefined,
                minTeamSize: formData.minTeamSize ? parseInt(formData.minTeamSize) : undefined,
                startDate: new Date(formData.startDate).toISOString(),
                endDate: new Date(formData.endDate).toISOString(),
                registrationDeadline: new Date(formData.registrationDeadline).toISOString(),
            };

            await organizerApi.createHackathon(payload);
            toast.success("Hackathon created successfully!");
            router.push("/hackathons");
        } catch (error: any) {
            console.error("Failed to create hackathon:", error);
            toast.error(error.response?.data?.message || "Failed to create hackathon");
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto space-y-8">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Create New Hackathon</h1>
                    <p className="text-white/60">Fill in the details to launch your event</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Basic Info */}
                    <div className="glass p-6 rounded-xl space-y-6">
                        <h2 className="text-xl font-bold text-white mb-4">Basic Information</h2>
                        
                        <div className="grid grid-cols-1 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm text-white/60">Hackathon Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    required
                                    value={formData.title}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary/50"
                                    placeholder="e.g. AI Innovation Summit 2026"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm text-white/60">Description</label>
                                <textarea
                                    name="description"
                                    required
                                    rows={4}
                                    value={formData.description}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary/50 resize-none"
                                    placeholder="Describe your hackathon..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Logistics */}
                    <div className="glass p-6 rounded-xl space-y-6">
                        <h2 className="text-xl font-bold text-white mb-4">Logistics</h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm text-white/60">Start Date</label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                                    <input
                                        type="datetime-local"
                                        name="startDate"
                                        required
                                        value={formData.startDate}
                                        onChange={handleChange}
                                        className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary/50"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm text-white/60">End Date</label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                                    <input
                                        type="datetime-local"
                                        name="endDate"
                                        required
                                        value={formData.endDate}
                                        onChange={handleChange}
                                        className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary/50"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm text-white/60">Registration Deadline</label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                                    <input
                                        type="datetime-local"
                                        name="registrationDeadline"
                                        required
                                        value={formData.registrationDeadline}
                                        onChange={handleChange}
                                        className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary/50"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm text-white/60">Event Type</label>
                                <div className="flex items-center gap-4 mt-2">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            name="isVirtual"
                                            checked={formData.isVirtual}
                                            onChange={handleChange}
                                            className="w-4 h-4 rounded border-white/10 bg-white/5 text-primary focus:ring-primary/50"
                                        />
                                        <span className="text-white">Virtual Event</span>
                                    </label>
                                </div>
                            </div>

                            {!formData.isVirtual && (
                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-sm text-white/60">Location</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                                        <input
                                            type="text"
                                            name="location"
                                            value={formData.location}
                                            onChange={handleChange}
                                            className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary/50"
                                            placeholder="Venue address or city"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Participation */}
                    <div className="glass p-6 rounded-xl space-y-6">
                        <h2 className="text-xl font-bold text-white mb-4">Participation & Requirements</h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm text-white/60">Max Participants</label>
                                <div className="relative">
                                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                                    <input
                                        type="number"
                                        name="maxParticipants"
                                        min="2"
                                        value={formData.maxParticipants}
                                        onChange={handleChange}
                                        className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary/50"
                                        placeholder="Unlimited"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm text-white/60">Min Team Size</label>
                                <input
                                    type="number"
                                    name="minTeamSize"
                                    min="1"
                                    value={formData.minTeamSize}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary/50"
                                    placeholder="1"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm text-white/60">Max Team Size</label>
                                <input
                                    type="number"
                                    name="maxTeamSize"
                                    min="1"
                                    value={formData.maxTeamSize}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary/50"
                                    placeholder="5"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm text-white/60">Required Skills (Press Enter to add)</label>
                            <input
                                type="text"
                                value={skillInput}
                                onChange={(e) => setSkillInput(e.target.value)}
                                onKeyDown={handleAddSkill}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary/50"
                                placeholder="e.g. React, Python, Design..."
                            />
                            <div className="flex flex-wrap gap-2 mt-2">
                                {formData.requiredSkills.map((skill) => (
                                    <span 
                                        key={skill}
                                        className="px-3 py-1 bg-white/10 rounded-full text-sm text-white flex items-center gap-2"
                                    >
                                        {skill}
                                        <button 
                                            type="button"
                                            onClick={() => removeSkill(skill)}
                                            className="hover:text-red-400 transition-colors"
                                        >
                                            ×
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Additional Details */}
                    <div className="glass p-6 rounded-xl space-y-6">
                        <h2 className="text-xl font-bold text-white mb-4">Additional Details</h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm text-white/60">Prize Pool</label>
                                <div className="relative">
                                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                                    <input
                                        type="text"
                                        name="prizePool"
                                        value={formData.prizePool}
                                        onChange={handleChange}
                                        className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary/50"
                                        placeholder="e.g. $10,000"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm text-white/60">Banner URL</label>
                                <div className="relative">
                                    <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                                    <input
                                        type="url"
                                        name="bannerUrl"
                                        value={formData.bannerUrl}
                                        onChange={handleChange}
                                        className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary/50"
                                        placeholder="https://..."
                                    />
                                </div>
                            </div>

                            <div className="md:col-span-2 space-y-2">
                                <label className="text-sm text-white/60">Website URL</label>
                                <div className="relative">
                                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                                    <input
                                        type="url"
                                        name="websiteUrl"
                                        value={formData.websiteUrl}
                                        onChange={handleChange}
                                        className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary/50"
                                        placeholder="https://..."
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-4 pt-4">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-lg transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-3 bg-primary hover:bg-primary-dark text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                            Create Hackathon
                        </button>
                    </div>
                </form>
            </div>
        </DashboardLayout>
    );
}