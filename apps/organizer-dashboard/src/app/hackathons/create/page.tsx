"use client";

import { useState, useEffect } from "react";
import OrganizerLayout from "@/components/OrganizerLayout";
import {
  Calendar,
  MapPin,
  Globe,
  DollarSign,
  Users,
  Image as ImageIcon,
  Loader2,
  ChevronRight,
  ChevronLeft,
  Check,
  AlertCircle,
  Shield,
  Target,
  Zap,
  Activity,
  Trophy,
  Dna
} from "lucide-react";
import { organizerApi, hackathonApi } from "@takathon/shared/api";
import { Breadcrumbs } from "@takathon/shared/ui";
import type { Skill } from "@takathon/shared/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const STEPS = ["MISSION INTEL", "DEPLOYMENT LOGISTICS", "OPERATIVE SKILLS"];

export default function CreateHackathonPage() {
    const router = useRouter();
    const [step, setStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [skills, setSkills] = useState<Skill[]>([]);
    const [skillsLoading, setSkillsLoading] = useState(true);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        theme: "",
        prizesDescription: "",
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
        requiredSkillIds: [] as string[],
    });

    useEffect(() => {
        hackathonApi
            .listSkills()
            .then((s) => setSkills(s))
            .catch(() => toast.error("FAILED TO LOAD SKILL DATABASE"))
            .finally(() => setSkillsLoading(false));
    }, []);

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >,
    ) => {
        const { name, value, type } = e.target;
        if (type === "checkbox") {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData((prev) => ({ ...prev, [name]: checked }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
        if (errors[name]) {
            setErrors((prev) => {
                const copy = { ...prev };
                delete copy[name];
                return copy;
            });
        }
    };

    const toggleSkill = (skillId: string) => {
        setFormData((prev) => ({
            ...prev,
            requiredSkillIds: prev.requiredSkillIds.includes(skillId)
                ? prev.requiredSkillIds.filter((id) => id !== skillId)
                : [...prev.requiredSkillIds, skillId],
        }));
    };

    const validateStep = (s: number): boolean => {
        const errs: Record<string, string> = {};
        if (s === 0) {
            if (!formData.title.trim() || formData.title.trim().length < 3)
                errs.title = "TITLE MUST BE AT LEAST 3 CHARACTERS";
            if (!formData.description.trim())
                errs.description = "DESCRIPTION IS MANDATORY";
            else if (formData.description.trim().length < 10)
                errs.description = "DESCRIPTION TOO BRIEF";
        }

        if (s === 1) {
            if (!formData.startDate) errs.startDate = "START DATE REQUIRED";
            if (!formData.endDate) errs.endDate = "END DATE REQUIRED";
            if (!formData.registrationDeadline)
                errs.registrationDeadline = "DEADLINE REQUIRED";

            if (formData.startDate && formData.endDate) {
                if (new Date(formData.endDate) <= new Date(formData.startDate))
                    errs.endDate = "END MUST BE AFTER START";
            }
            if (formData.registrationDeadline && formData.startDate) {
                if (new Date(formData.registrationDeadline) >= new Date(formData.startDate))
                    errs.registrationDeadline = "DEADLINE MUST PRECEDE START";
            }
        }

        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const nextStep = () => {
        if (validateStep(step)) setStep((s) => Math.min(s + 1, 2));
    };

    const prevStep = () => setStep((s) => Math.max(s - 1, 0));

    const handleSubmit = async () => {
        if (!validateStep(step)) return;
        setLoading(true);
        try {
            const payload: Record<string, unknown> = {
                title: formData.title.trim(),
                description: formData.description.trim(),
                startDate: new Date(formData.startDate).toISOString(),
                endDate: new Date(formData.endDate).toISOString(),
                registrationDeadline: new Date(formData.registrationDeadline).toISOString(),
                location: formData.location || undefined,
                isVirtual: formData.isVirtual,
                maxParticipants: formData.maxParticipants ? parseInt(formData.maxParticipants) : undefined,
                maxTeamSize: formData.maxTeamSize ? parseInt(formData.maxTeamSize) : undefined,
                minTeamSize: formData.minTeamSize ? parseInt(formData.minTeamSize) : undefined,
                prizePool: formData.prizePool || undefined,
                bannerUrl: formData.bannerUrl || undefined,
                websiteUrl: formData.websiteUrl || undefined,
                requiredSkills: formData.requiredSkillIds.length ? formData.requiredSkillIds : undefined,
            };
            if (formData.theme) payload.theme = formData.theme;
            if (formData.prizesDescription) payload.prizesDescription = formData.prizesDescription;

            const hackathon = await organizerApi.createHackathon(payload as any);
            toast.success("MISSION INITIALIZED", { description: "OPERATION LOGGED AS DRAFT." });
            router.push(`/hackathons/${(hackathon as any).id ?? ""}`);
        } catch (error: any) {
            toast.error("INITIALIZATION FAILED", { description: "CHECK SYSTEM ERRORS." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <OrganizerLayout>
            <div className="max-w-4xl mx-auto space-y-8 pb-12 relative">
                {/* Background Floating Objects */}
                <div className="absolute top-20 right-10 w-32 h-32 bg-primary/20 rounded-full blur-[80px] pointer-events-none"></div>
                <div className="absolute top-60 left-10 w-24 h-24 bg-blue-500/10 rounded-full blur-[60px] pointer-events-none"></div>

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div>
                        <div className="flex items-center relative mb-1">
                            <h1 className="text-5xl md:text-6xl font-black italic tracking-tighter uppercase text-white">
                                <span className="text-white">INITIALIZE MISSION</span>
                            </h1>
                            <div className="flex ml-4 gap-1 opacity-60 mt-2">
                                <div className="w-8 h-1 bg-primary"></div>
                                <div className="w-2 h-1 bg-primary"></div>
                                <div className="w-1 h-1 bg-primary"></div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 mt-4 mb-2">
                            <div className="w-2 h-2 bg-primary rounded-sm shadow-[0_0_8px_rgba(255,92,0,0.5)]" />
                            <span className="text-[10px] text-white/60 uppercase tracking-[0.2em] font-bold">
                                CONFIGURE OPERATIONAL PARAMETERS AND MISSION LOGISTICS
                            </span>
                        </div>
                    </div>
                </div>

                {/* Step Progress Container */}
                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/5">
                    {STEPS.map((label, i) => (
                        <div key={label} className="relative">
                            <div className={`h-1 rounded-full mb-3 transition-all duration-500 ${i <= step ? "bg-primary shadow-glow-sm" : "bg-white/5"}`} />
                            <div className={`text-[10px] font-black uppercase tracking-widest transition-colors ${i === step ? "text-white" : "text-white/20"}`}>
                                {label}
                            </div>
                        </div>
                    ))}
                </div>

                {/* ── Step 1: MISSION INTEL ─────────────────────────────────────────── */}
                {step === 0 && (
                    <div className="bg-[#080808] border border-white/5 rounded-sm p-8 space-y-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-16 h-16 bg-primary/5 rounded-bl-[80px] -mr-8 -mt-8 blur-2xl pointer-events-none"></div>
                        
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-10 h-10 bg-primary/10 border border-primary/20 flex items-center justify-center rounded-sm">
                                <Target className="w-5 h-5 text-primary" />
                            </div>
                            <h2 className="text-xl font-black italic text-white uppercase tracking-tighter">MISSION DATA</h2>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] text-white/40 font-bold uppercase tracking-widest">MISSION TITLE <span className="text-primary">*</span></label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    className="w-full bg-[#0a0a0a] border border-white/10 p-3 text-[11px] font-bold uppercase tracking-widest text-white focus:outline-none focus:border-primary/50 transition-all rounded-sm"
                                    placeholder="COMMAND TITLE..."
                                />
                                {errors.title && <p className="text-[9px] text-red-500 font-bold uppercase tracking-widest flex items-center gap-1 mt-1"><AlertCircle size={10} /> {errors.title}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] text-white/40 font-bold uppercase tracking-widest">OPERATIONAL DESCRIPTION <span className="text-primary">*</span></label>
                                <textarea
                                    name="description"
                                    rows={4}
                                    value={formData.description}
                                    onChange={handleChange}
                                    className="w-full bg-[#0a0a0a] border border-white/10 p-3 text-[11px] font-bold uppercase tracking-widest text-white focus:outline-none focus:border-primary/50 transition-all rounded-sm resize-none"
                                    placeholder="DETAIL THE MISSION OBJECTIVES..."
                                />
                                {errors.description && <p className="text-[9px] text-red-500 font-bold uppercase tracking-widest flex items-center gap-1 mt-1"><AlertCircle size={10} /> {errors.description}</p>}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] text-white/40 font-bold uppercase tracking-widest">MISSION THEME</label>
                                    <input
                                        type="text"
                                        name="theme"
                                        value={formData.theme}
                                        onChange={handleChange}
                                        className="w-full bg-[#0a0a0a] border border-white/10 p-3 text-[11px] font-bold uppercase tracking-widest text-white rounded-sm focus:outline-none focus:border-primary/50"
                                        placeholder="CORE SECTOR..."
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] text-white/40 font-bold uppercase tracking-widest">VALOR POOL (PRIZES)</label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                                        <input
                                            type="text"
                                            name="prizePool"
                                            value={formData.prizePool}
                                            onChange={handleChange}
                                            className="w-full bg-[#0a0a0a] border border-white/10 p-3 pl-10 text-[11px] font-bold uppercase tracking-widest text-white rounded-sm focus:outline-none focus:border-primary/50"
                                            placeholder="REWARD ALLOCATION..."
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ── Step 2: DEPLOYMENT LOGISTICS ──────────────────────────────────────────── */}
                {step === 1 && (
                    <div className="bg-[#080808] border border-white/5 rounded-sm p-8 space-y-8">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-10 h-10 bg-primary/10 border border-primary/20 flex items-center justify-center rounded-sm">
                                <Calendar className="w-5 h-5 text-primary" />
                            </div>
                            <h2 className="text-xl font-black italic text-white uppercase tracking-tighter">DEPLOYMENT LOGISTICS</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] text-white/40 font-bold uppercase tracking-widest">START SEQUENCE <span className="text-primary">*</span></label>
                                    <input type="datetime-local" name="startDate" value={formData.startDate} onChange={handleChange} className="w-full bg-[#0a0a0a] border border-white/10 p-3 text-[10px] font-bold uppercase tracking-widest text-white focus:outline-none focus:border-primary/50 rounded-sm" />
                                    {errors.startDate && <p className="text-[9px] text-red-500 font-bold uppercase tracking-widest flex items-center gap-1 mt-1"><AlertCircle size={10} /> {errors.startDate}</p>}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] text-white/40 font-bold uppercase tracking-widest">ABORT/END SEQUENCE <span className="text-primary">*</span></label>
                                    <input type="datetime-local" name="endDate" value={formData.endDate} onChange={handleChange} className="w-full bg-[#0a0a0a] border border-white/10 p-3 text-[10px] font-bold uppercase tracking-widest text-white focus:outline-none focus:border-primary/50 rounded-sm" />
                                    {errors.endDate && <p className="text-[9px] text-red-500 font-bold uppercase tracking-widest flex items-center gap-1 mt-1"><AlertCircle size={10} /> {errors.endDate}</p>}
                                </div>
                            </div>
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] text-white/40 font-bold uppercase tracking-widest">INTAKE DEADLINE <span className="text-primary">*</span></label>
                                    <input type="datetime-local" name="registrationDeadline" value={formData.registrationDeadline} onChange={handleChange} className="w-full bg-[#0a0a0a] border border-white/10 p-3 text-[10px] font-bold uppercase tracking-widest text-white focus:outline-none focus:border-primary/50 rounded-sm" />
                                    {errors.registrationDeadline && <p className="text-[9px] text-red-500 font-bold uppercase tracking-widest flex items-center gap-1 mt-1"><AlertCircle size={10} /> {errors.registrationDeadline}</p>}
                                </div>
                                <div className="flex items-center gap-3 p-4 bg-white/5 border border-white/5 rounded-sm">
                                    <input type="checkbox" name="isVirtual" checked={formData.isVirtual} onChange={handleChange} className="w-4 h-4 bg-black border-white/20 text-primary rounded-sm focus:ring-0" />
                                    <label className="text-[10px] text-white/60 font-black uppercase tracking-widest flex items-center gap-2">
                                        <Globe className="w-3 h-3" /> VIRTUAL OPERATION
                                    </label>
                                </div>
                            </div>
                        </div>

                        {!formData.isVirtual && (
                            <div className="space-y-2">
                                <label className="text-[10px] text-white/40 font-bold uppercase tracking-widest">MISSION COMMAND HUB (LOCATION)</label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                                    <input type="text" name="location" value={formData.location} onChange={handleChange} className="w-full bg-[#0a0a0a] border border-white/10 p-3 pl-10 text-[11px] font-bold uppercase tracking-widest text-white rounded-sm focus:outline-none focus:border-primary/50" placeholder="SECTOR GRID..." />
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* ── Step 3: OPERATIVE SKILLS ────────────────────────────────────── */}
                {step === 2 && (
                    <div className="bg-[#080808] border border-white/5 rounded-sm p-8 space-y-8">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-10 h-10 bg-primary/10 border border-primary/20 flex items-center justify-center rounded-sm">
                                <Dna className="w-5 h-5 text-primary" />
                            </div>
                            <h2 className="text-xl font-black italic text-white uppercase tracking-tighter">OPERATIVE REQUIREMENTS</h2>
                        </div>

                        {skillsLoading ? (
                            <div className="flex flex-col items-center justify-center py-12 gap-4">
                                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                                <div className="text-[10px] font-bold text-white/20 uppercase tracking-widest">SYNCING SKILL DATABASE...</div>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {Object.entries(skills.reduce<Record<string, Skill[]>>((acc, s) => {
                                    const cat = s.category || "GENERAL";
                                    if (!acc[cat]) acc[cat] = [];
                                    acc[cat].push(s);
                                    return acc;
                                }, {})).map(([category, catSkills]) => (
                                    <div key={category} className="space-y-3">
                                        <div className="text-[8px] text-white/30 font-bold uppercase tracking-[0.2em] flex items-center gap-2">
                                            <div className="w-1 h-1 bg-white/20 rounded-full" /> {category}
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {catSkills.map(skill => {
                                                const active = formData.requiredSkillIds.includes(skill.id);
                                                return (
                                                    <button key={skill.id} onClick={() => toggleSkill(skill.id)} className={`px-4 py-2 text-[9px] font-bold uppercase tracking-widest border transition-all rounded-sm ${active ? 'bg-primary/20 border-primary text-primary shadow-glow-sm' : 'bg-black border-white/5 text-white/40 hover:border-white/20'}`}>
                                                        {skill.name}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* ── Navigation ─────────────────────────────────────────── */}
                <div className="flex justify-between items-center pt-8">
                    <button onClick={step === 0 ? () => router.back() : prevStep} className="flex items-center gap-2 px-8 py-3 bg-transparent border border-white/10 text-white/40 hover:text-white hover:border-white/30 transition-all rounded-sm text-[10px] font-bold uppercase tracking-widest">
                        <ChevronLeft className="w-4 h-4" /> {step === 0 ? "CANCEL" : "BACK"}
                    </button>
                    
                    {step < 2 ? (
                        <button onClick={nextStep} className="flex items-center gap-2 px-10 py-3 bg-primary text-white border border-primary hover:bg-primary-dark hover:shadow-glow-sm transition-all rounded-sm text-[10px] font-bold uppercase tracking-widest">
                            NEXT PHASE <ChevronRight className="w-4 h-4" />
                        </button>
                    ) : (
                        <button onClick={handleSubmit} disabled={loading} className="flex items-center gap-2 px-10 py-3 bg-primary text-white border border-primary hover:bg-primary-dark hover:shadow-glow-sm transition-all rounded-sm text-[10px] font-bold uppercase tracking-widest disabled:opacity-50">
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                            INITIALIZE OPERATION
                        </button>
                    )}
                </div>
            </div>
        </OrganizerLayout>
    );
}
