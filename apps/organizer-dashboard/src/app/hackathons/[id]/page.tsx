"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import OrganizerLayout from "@/components/OrganizerLayout";
import {
  Calendar,
  Users,
  Trophy,
  DollarSign,
  Globe,
  MapPin,
  Clock,
  Edit2,
  Loader2,
  AlertCircle,
  Play,
  Send,
  XCircle,
  CheckCircle2,
  Shield,
  Target,
  Zap,
  Activity,
  ArrowRight,
  BarChart3,
  ExternalLink
} from "lucide-react";
import { organizerApi } from "@takathon/shared/api";
import type { Hackathon } from "@takathon/shared/types";
import { toast } from "sonner";
import Link from "next/link";

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; border: string; icon: any; shadow: string }> = {
    draft: { label: "DRAFT INTEL", color: "text-white/40", bg: "bg-white/5", border: "border-white/10", icon: Shield, shadow: "" },
    registration_open: { label: "RECRUITMENT ACTIVE", color: "text-primary", bg: "bg-primary/10", border: "border-primary/20", icon: Users, shadow: "shadow-[0_0_15px_rgba(255,92,0,0.3)]" },
    registration_closed: { label: "RECRUITMENT SEALED", color: "text-amber-400", bg: "bg-amber-400/10", border: "border-amber-400/20", icon: Clock, shadow: "shadow-[0_0_15px_rgba(251,191,36,0.3)]" },
    in_progress: { label: "MISSION ACTIVE", color: "text-green-500", bg: "bg-green-500/10", border: "border-green-500/20", icon: Activity, shadow: "shadow-[0_0_15px_rgba(34,197,94,0.3)]" },
    completed: { label: "MISSION COMPLETED", color: "text-blue-400", bg: "bg-blue-400/10", border: "border-blue-400/20", icon: Trophy, shadow: "shadow-[0_0_15px_rgba(96,165,250,0.3)]" },
    cancelled: { label: "MISSION ABORTED", color: "text-red-500", bg: "bg-red-500/10", border: "border-red-500/20", icon: XCircle, shadow: "shadow-[0_0_15px_rgba(239,68,68,0.3)]" },
};

export default function HackathonDetailPage() {
    const params = useParams<{ id: string }>();
    const router = useRouter();
    const [hackathon, setHackathon] = useState<Hackathon | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [confirmAction, setConfirmAction] = useState<string | null>(null);

    const fetchHackathon = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await organizerApi.getMyHackathon(params.id);
            setHackathon(data);
        } catch (err: any) {
            setError(err.response?.data?.message || "FAILED TO RETRIEVE MISSION DATA");
        } finally {
            setLoading(false);
        }
    }, [params.id]);

    useEffect(() => {
        fetchHackathon();
    }, [fetchHackathon]);

    const handleLifecycleAction = async (action: string) => {
        setConfirmAction(null);
        setActionLoading(action);
        try {
            if (action === "publish") await organizerApi.publishHackathon(params.id);
            else if (action === "start") await organizerApi.startHackathon(params.id);
            else if (action === "complete") await organizerApi.completeHackathon(params.id);
            else if (action === "cancel") await organizerApi.cancelHackathon(params.id);
            
            toast.success("COMMAND REGISTERED", { description: `MISSION ${action.toUpperCase()} SEQUENCE INITIALIZED successfully.` });
            await fetchHackathon();
        } catch (err: any) {
            toast.error("COMMAND FAILED", { description: err.response?.data?.message || `FAILED TO EXECUTE ${action.toUpperCase()} SEQUENCE.` });
        } finally {
            setActionLoading(null);
        }
    };

    const status = useMemo(() => {
        if (!hackathon) return STATUS_CONFIG.draft;
        return STATUS_CONFIG[hackathon.status] ?? STATUS_CONFIG.draft;
    }, [hackathon]);

    if (loading) {
        return (
            <OrganizerLayout>
                <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                    <Loader2 className="w-10 h-10 text-primary animate-spin" />
                    <div className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">DECRYPTING MISSION BRIEF...</div>
                </div>
            </OrganizerLayout>
        );
    }

    if (error || !hackathon) {
        return (
            <OrganizerLayout>
                <div className="flex flex-col items-center justify-center min-h-[400px] gap-6">
                    <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-sm flex items-center justify-center">
                        <AlertCircle className="w-8 h-8 text-red-500" />
                    </div>
                    <div className="text-center">
                        <h2 className="text-xl font-black italic text-white uppercase tracking-tighter mb-2">ACCESS DENIED</h2>
                        <p className="text-[10px] text-white/40 font-bold uppercase tracking-[0.2em]">{error || "MISSION DATA NOT FOUND"}</p>
                    </div>
                    <button onClick={() => router.push("/hackathons")} className="px-8 py-3 bg-[#080808] border border-white/10 text-white text-[10px] font-bold uppercase tracking-widest hover:border-primary/50 transition-all rounded-sm">
                        RETURN TO OPERATIONS
                    </button>
                </div>
            </OrganizerLayout>
        );
    }

    const startDate = new Date(hackathon.startDate);
    const endDate = new Date(hackathon.endDate);
    const regDeadline = new Date(hackathon.registrationDeadline);
    const now = new Date();
    const isEditable = ["draft", "registration_open", "registration_closed"].includes(hackathon.status);

    const timeMetrics = [
        { label: "MISSION START", value: startDate.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).toUpperCase() },
        { label: "MISSION ABORT", value: endDate.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).toUpperCase() },
        { label: "INTAKE CLOSE", value: regDeadline.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).toUpperCase() },
    ];

    return (
        <OrganizerLayout>
            <div className="max-w-6xl mx-auto space-y-8 pb-12 relative">
                {/* Background Floating Objects */}
                <div className="absolute top-20 right-10 w-32 h-32 bg-primary/20 rounded-full blur-[80px] pointer-events-none"></div>
                <div className="absolute top-60 left-10 w-24 h-24 bg-blue-500/10 rounded-full blur-[60px] pointer-events-none"></div>

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-4">
                           <div className={`px-4 py-1.5 rounded-sm border ${status.bg} ${status.border} ${status.color} text-[9px] font-black uppercase tracking-[0.2em] flex items-center gap-2 ${status.shadow}`}>
                                <status.icon className="w-3.5 h-3.5" />
                                {status.label}
                            </div>
                            <div className="h-px bg-white/10 flex-1"></div>
                        </div>
                        <div className="flex items-center relative mb-1">
                            <h1 className="text-5xl md:text-6xl font-black italic tracking-tighter uppercase text-white">
                                <span className="text-white">MISSION BRIEFING</span>
                            </h1>
                            <div className="flex ml-4 gap-1 opacity-60 mt-2">
                                <div className="w-8 h-1 bg-primary"></div>
                                <div className="w-2 h-1 bg-primary"></div>
                                <div className="w-1 h-1 bg-primary"></div>
                            </div>
                        </div>
                        <h2 className="text-xl font-black italic text-primary/80 uppercase tracking-tighter mt-1">{hackathon.title}</h2>
                        <div className="flex items-center gap-2 mt-4 mb-2">
                            <div className="w-2 h-2 bg-primary rounded-sm shadow-[0_0_8px_rgba(255,92,0,0.5)]" />
                            <span className="text-[10px] text-white/60 uppercase tracking-[0.2em] font-bold">
                                OPERATIONAL PARAMETERS AND MISSION LOGS
                            </span>
                        </div>
                    </div>
                   {isEditable && (
                        <Link href={`/hackathons/${hackathon.id}/edit`}>
                            <button className="flex items-center justify-center gap-2 px-8 py-3 bg-[#080808] text-white border border-white/10 hover:border-primary/50 hover:bg-primary/5 transition-all rounded-sm text-[10px] font-bold tracking-widest uppercase mt-4">
                                <Edit2 className="w-4 h-4" />
                                <span>MODIFY INTEL</span>
                            </button>
                        </Link>
                    )}
                </div>

                {/* Tactical Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: "PERSONNEL CAPACITY", value: hackathon.maxParticipants ?? "UNLIMITED", icon: Users },
                        { label: "SQUAD FORMATION", value: `${hackathon.minTeamSize}-${hackathon.maxTeamSize}`, icon: Activity },
                        { label: "SECTOR LOCATION", value: hackathon.isVirtual ? "VIRTUAL NETWORK" : (hackathon.location || "TBD"), icon: MapPin },
                        { label: "VALOR ALLOCATION", value: hackathon.prizePool || "—", icon: Trophy },
                    ].map((stat) => (
                        <div key={stat.label} className="bg-[#080808] border border-white/5 rounded-sm p-5 group hover:border-white/10 transition-colors">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-[8px] text-white/40 font-bold uppercase tracking-widest mb-1">{stat.label}</div>
                                    <div className="text-xl font-black italic tracking-tighter text-white uppercase">{stat.value}</div>
                                </div>
                                <stat.icon className="w-8 h-8 text-primary opacity-20 group-hover:opacity-40 transition-opacity" />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Mission Intel & Description */}
                    <div className="lg:col-span-2 space-y-8">
                        <section className="bg-[#080808] border border-white/5 rounded-sm p-8 relative overflow-hidden">
                             <div className="absolute top-0 right-0 w-16 h-16 bg-white/[0.02] rounded-bl-[80px] -mr-8 -mt-8 blur-2xl"></div>
                            <h2 className="text-xs font-black italic text-primary uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                                <Target className="w-4 h-4" /> MISSION INTEL
                            </h2>
                            <p className="text-[11px] text-white/60 font-medium leading-loose uppercase tracking-wider whitespace-pre-wrap">
                                {hackathon.description}
                            </p>
                        </section>

                        {hackathon.rules && (
                            <section className="bg-[#080808] border border-white/5 rounded-sm p-8">
                                <h2 className="text-xs font-black italic text-primary uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                                    <Shield className="w-4 h-4" /> ENGAGEMENT RULES
                                </h2>
                                <p className="text-[11px] text-white/60 font-medium leading-loose uppercase tracking-wider whitespace-pre-wrap">
                                    {hackathon.rules}
                                </p>
                            </section>
                        )}
                    </div>

                    {/* Timeline & Controls */}
                    <div className="space-y-8">
                         {/* Lifecycle Interface */}
                        <section className="bg-[#080808] border border-white/10 rounded-sm p-8">
                            <h2 className="text-xs font-black italic text-primary uppercase tracking-[0.2em] mb-6">COMMAND INTERFACE</h2>
                            
                            <div className="space-y-4">
                                {hackathon.status === "draft" && (
                                    <button onClick={() => setConfirmAction("publish")} disabled={!!actionLoading} className="w-full flex items-center justify-center gap-3 py-4 bg-primary text-white border border-primary hover:bg-primary-dark hover:shadow-glow-sm transition-all rounded-sm text-[10px] font-black tracking-[0.2em] uppercase">
                                        {actionLoading === "publish" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                        INITIATE RECRUITMENT
                                    </button>
                                )}
                                {["registration_open", "registration_closed"].includes(hackathon.status) && (
                                    <button onClick={() => setConfirmAction("start")} disabled={!!actionLoading} className="w-full flex items-center justify-center gap-3 py-4 bg-green-500 text-white border border-green-500 hover:bg-green-600 hover:shadow-[0_0_20px_rgba(34,197,94,0.3)] transition-all rounded-sm text-[10px] font-black tracking-[0.2em] uppercase">
                                        {actionLoading === "start" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                                        START OPERATION
                                    </button>
                                )}
                                {hackathon.status === "in_progress" && (
                                    <button onClick={() => setConfirmAction("complete")} disabled={!!actionLoading} className="w-full flex items-center justify-center gap-3 py-4 bg-blue-500 text-white border border-blue-500 hover:bg-blue-600 hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all rounded-sm text-[10px] font-black tracking-[0.2em] uppercase">
                                        {actionLoading === "complete" ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                                        COMPLETE MISSION
                                    </button>
                                )}
                                {!["completed", "cancelled"].includes(hackathon.status) && (
                                    <button onClick={() => setConfirmAction("cancel")} disabled={!!actionLoading} className="w-full flex items-center justify-center gap-3 py-3 bg-transparent text-red-500 border border-red-500/30 hover:bg-red-500/5 transition-all rounded-sm text-[10px] font-black tracking-[0.2em] uppercase">
                                        {actionLoading === "cancel" ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
                                        ABORT MISSION
                                    </button>
                                )}
                                {(hackathon.status === "completed" || hackathon.status === "cancelled") && (
                                    <div className="p-4 bg-white/5 border border-white/5 rounded-sm text-center">
                                        <div className="text-[10px] font-black uppercase tracking-widest text-white/40">MISSION ARCHIVED</div>
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* Deployment Timeline */}
                        <section className="bg-[#080808] border border-white/5 rounded-sm p-8">
                            <h2 className="text-xs font-black italic text-primary uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                                <Clock className="w-4 h-4" /> TIMELINE LOGS
                            </h2>
                            <div className="space-y-6">
                                {timeMetrics.map((m, i) => (
                                    <div key={m.label} className="relative pl-6 border-l border-white/10 group">
                                        <div className="absolute left-[-5px] top-0 w-2 h-2 rounded-full bg-primary/40 group-hover:bg-primary transition-colors"></div>
                                        <div className="text-[8px] text-white/40 font-bold uppercase tracking-widest mb-1">{m.label}</div>
                                        <div className="text-[10px] text-white font-black italic tracking-tighter uppercase">{m.value}</div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Quick Navigation */}
                        <div className="space-y-3">
                            {[
                                { label: "VIEW RADIUS PERSONNEL", icon: Users, href: "/participants", color: "text-blue-400" },
                                { label: "VIEW SQUAD DEPOT", icon: Trophy, href: "/teams", color: "text-amber-400" },
                                { label: "INTEL ANALYTICS", icon: BarChart3, href: "/analytics", color: "text-green-500" },
                            ].map((link) => (
                                <Link key={link.label} href={link.href}>
                                    <div className="bg-[#080808] border border-white/5 p-4 rounded-sm hover:border-primary/50 group transition-all flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <link.icon className={`w-4 h-4 ${link.color}`} />
                                            <span className="text-[9px] font-black uppercase tracking-widest text-white/60 group-hover:text-white">{link.label}</span>
                                        </div>
                                        <ArrowRight className="w-3.5 h-3.5 text-white/20 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Lifecycle Confirmation Dialog */}
            {confirmAction && (
                <div className="fixed inset-0 bg-black/95 backdrop-blur-sm flex items-center justify-center z-[100] p-6">
                    <div className="max-w-md w-full bg-[#0a0a0a] border border-white/10 p-8 rounded-sm relative shadow-2xl">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-16 -mt-16 blur-3xl pointer-events-none"></div>
                        
                        <div className="flex items-center gap-4 mb-6">
                            <div className={`w-12 h-12 flex items-center justify-center rounded-sm border ${confirmAction === 'cancel' ? 'bg-red-500/10 border-red-500/20 text-red-500' : 'bg-primary/10 border-primary/20 text-primary'}`}>
                                <Zap className="w-6 h-6 animate-pulse" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black italic text-white uppercase tracking-tighter">CONFIRM COMMAND</h3>
                                <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">{confirmAction.toUpperCase()} SEQUENCE INITIALIZATION</p>
                            </div>
                        </div>

                        <p className="text-[11px] text-white/60 font-medium leading-relaxed uppercase tracking-widest mb-8 border-l border-white/10 pl-4 py-2 italic font-sans">
                            {confirmAction === "publish" && "RECRUITMENT PROTOCOLS WILL BE ACTIVATED GLOBALLY. VERIFY ALL MISSION INTEL BEFORE PROCEEDING."}
                            {confirmAction === "start" && "MISSION EXECUTION PHASE ACTIVATED. INTAKE PROTOCOLS WILL BE SEALED AND SQUAD OPERATIONS COMMENCE."}
                            {confirmAction === "complete" && "MISSION TERMINATION SEQUENCE. ALL FINAL INTEL SHOULD BE LOGGED AND OPERATIONS ARCHIVED."}
                            {confirmAction === "cancel" && "CRITICAL: MISSION ABORT SEQUENCE. THIS ACTION CANNOT BE REVERSED BY ANY COMMAND LEVEL."}
                        </p>

                        <div className="grid grid-cols-2 gap-4">
                            <button onClick={() => setConfirmAction(null)} className="py-4 bg-transparent border border-white/10 text-white/40 hover:text-white text-[10px] font-black uppercase tracking-[0.2em] transition-all rounded-sm">
                                RETURN
                            </button>
                            <button onClick={() => handleLifecycleAction(confirmAction)} className={`py-4 shadow-glow-sm text-white text-[10px] font-black uppercase tracking-[0.2em] transition-all rounded-sm ${confirmAction === 'cancel' ? 'bg-red-500 hover:bg-red-600' : 'bg-primary hover:bg-primary-dark'}`}>
                                EXECUTE
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </OrganizerLayout>
    );
}
