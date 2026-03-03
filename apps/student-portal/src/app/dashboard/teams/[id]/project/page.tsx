"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import {
    ArrowLeft,
    Target,
    Layers,
    CheckCircle2,
    Circle,
    Clock,
    GitBranch,
    Rocket,
    Code2,
    FileText,
    ExternalLink,
    Edit2,
    Calendar,
    Users,
    Crown,
} from "lucide-react";
import { teamApi } from "@takathon/shared/api";

interface TeamMember {
    id: string;
    userId: string;
    role: string;
    user?: { fullName: string; email: string };
}

interface TeamData {
    id: string;
    name: string;
    description?: string;
    hackathon?: { title: string; startDate: string; endDate: string };
    members?: TeamMember[];
    projectIdea?: string;
    status: string;
}

// ─── Placeholder milestone data ───────────────────────────────────────────────
const MILESTONES = [
    { id: 1, title: "Team Formation & Ideation", status: "done", due: "Day 1" },
    { id: 2, title: "Architecture & Tech Stack Decision", status: "done", due: "Day 1" },
    { id: 3, title: "MVP Prototype", status: "in_progress", due: "Day 2" },
    { id: 4, title: "Core Features Implementation", status: "pending", due: "Day 3" },
    { id: 5, title: "UI/UX Polish & Testing", status: "pending", due: "Day 3" },
    { id: 6, title: "Demo Preparation & Submission", status: "pending", due: "Day 4" },
];

const TECH_STACK = [
    { label: "Frontend", value: "Next.js 15, Tailwind CSS", icon: Code2 },
    { label: "Backend", value: "FastAPI, PostgreSQL", icon: Layers },
    { label: "AI / ML", value: "OpenAI API, Python", icon: Rocket },
    { label: "DevOps", value: "Docker, GitHub Actions", icon: GitBranch },
];

function MilestoneIcon({ status }: { status: string }) {
    if (status === "done") return <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />;
    if (status === "in_progress") return <Clock className="w-5 h-5 text-primary flex-shrink-0 animate-pulse" />;
    return <Circle className="w-5 h-5 text-white/25 flex-shrink-0" />;
}

function MilestoneStatusBadge({ status }: { status: string }) {
    if (status === "done") return <span className="px-2 py-0.5 bg-green-500/15 text-green-400 border border-green-500/30 rounded-full text-xs font-semibold">Done</span>;
    if (status === "in_progress") return <span className="px-2 py-0.5 bg-primary/15 text-primary border border-primary/30 rounded-full text-xs font-semibold">In Progress</span>;
    return <span className="px-2 py-0.5 bg-white/5 text-white/40 border border-white/10 rounded-full text-xs">Pending</span>;
}

export default function ProjectDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const teamId = params.id as string;

    const [team, setTeam] = useState<TeamData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTeam();
    }, [teamId]);

    const fetchTeam = async () => {
        try {
            const data = await teamApi.getTeam(teamId);
            setTeam(data as any);
        } catch {
            // fallback
        } finally {
            setLoading(false);
        }
    };

    const teamName = team?.name ?? "Team Project";
    const hackathonTitle = team?.hackathon?.title ?? "";

    const completedMilestones = MILESTONES.filter((m) => m.status === "done").length;
    const progressPct = Math.round((completedMilestones / MILESTONES.length) * 100);

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="glass rounded-xl p-5 flex items-center gap-4">
                    <button
                        onClick={() => router.push("/dashboard/teams")}
                        className="p-2 hover:bg-white/10 rounded-lg transition-all text-white/60 hover:text-white"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                        <Target className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                        {loading ? (
                            <div className="h-5 w-40 bg-white/10 rounded animate-pulse" />
                        ) : (
                            <>
                                <h1 className="text-white font-bold text-xl leading-tight">{teamName} — Project</h1>
                                {hackathonTitle && (
                                    <p className="text-white/50 text-sm">{hackathonTitle}</p>
                                )}
                            </>
                        )}
                    </div>
                    <span className="px-2.5 py-1 bg-yellow-500/15 border border-yellow-500/30 text-yellow-400 text-xs font-semibold rounded-full">
                        Demo Data
                    </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left column */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Project Summary */}
                        <div className="glass rounded-xl p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                    <FileText className="w-5 h-5 text-primary" />
                                    Project Summary
                                </h2>
                                <button
                                    disabled
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 text-white/30 text-sm rounded-lg cursor-not-allowed border border-white/10"
                                    title="Editing coming soon"
                                >
                                    <Edit2 className="w-3.5 h-3.5" />
                                    Edit
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-white/40 text-xs uppercase tracking-wider font-semibold">Project Name</label>
                                    <p className="text-white font-semibold text-lg mt-1">
                                        {loading ? (
                                            <span className="h-5 w-48 bg-white/10 rounded animate-pulse inline-block" />
                                        ) : (
                                            `${teamName} — Hackathon Project`
                                        )}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-white/40 text-xs uppercase tracking-wider font-semibold">Description</label>
                                    <p className="text-white/75 text-sm mt-1 leading-relaxed">
                                        {team?.description ||
                                            "An innovative platform that leverages AI to solve real-world problems. Our solution focuses on improving team collaboration and productivity during hackathons by providing smart recommendations and automated workflows."}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-white/40 text-xs uppercase tracking-wider font-semibold">Problem Statement</label>
                                    <p className="text-white/75 text-sm mt-1 leading-relaxed">
                                        Teams often struggle to coordinate effectively during time-constrained hackathons. Our tool bridges communication gaps and helps teams focus on building rather than managing.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Milestones */}
                        <div className="glass rounded-xl p-6">
                            <div className="flex items-center justify-between mb-2">
                                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                    <CheckCircle2 className="w-5 h-5 text-primary" />
                                    Milestones
                                </h2>
                                <span className="text-white/40 text-sm">{completedMilestones}/{MILESTONES.length} complete</span>
                            </div>

                            {/* Progress bar */}
                            <div className="w-full h-2 bg-white/10 rounded-full mb-5 overflow-hidden">
                                <div
                                    className="h-full bg-primary rounded-full transition-all duration-700"
                                    style={{ width: `${progressPct}%` }}
                                />
                            </div>

                            <div className="space-y-3">
                                {MILESTONES.map((milestone) => (
                                    <div
                                        key={milestone.id}
                                        className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                                            milestone.status === "done"
                                                ? "bg-green-500/5 border-green-500/15"
                                                : milestone.status === "in_progress"
                                                ? "bg-primary/8 border-primary/20"
                                                : "bg-white/3 border-white/8"
                                        }`}
                                        style={
                                            milestone.status === "in_progress"
                                                ? { backgroundColor: "rgba(217,76,26,0.05)" }
                                                : milestone.status === "pending"
                                                ? { backgroundColor: "rgba(255,255,255,0.02)" }
                                                : {}
                                        }
                                    >
                                        <MilestoneIcon status={milestone.status} />
                                        <div className="flex-1">
                                            <p className={`text-sm font-medium ${milestone.status === "done" ? "text-white/60 line-through" : "text-white"}`}>
                                                {milestone.title}
                                            </p>
                                        </div>
                                        <span className="text-white/30 text-xs">{milestone.due}</span>
                                        <MilestoneStatusBadge status={milestone.status} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right column */}
                    <div className="space-y-6">
                        {/* Tech Stack */}
                        <div className="glass rounded-xl p-6">
                            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <Code2 className="w-5 h-5 text-primary" />
                                Tech Stack
                            </h2>
                            <div className="space-y-3">
                                {TECH_STACK.map(({ label, value, icon: Icon }) => (
                                    <div key={label} className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
                                        <Icon className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                                        <div>
                                            <p className="text-white/40 text-xs font-semibold uppercase tracking-wider">{label}</p>
                                            <p className="text-white/85 text-sm mt-0.5">{value}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Submission Links */}
                        <div className="glass rounded-xl p-6">
                            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <Rocket className="w-5 h-5 text-primary" />
                                Submission
                            </h2>
                            <div className="space-y-3">
                                {[
                                    { label: "GitHub Repository", placeholder: "github.com/team/project" },
                                    { label: "Live Demo", placeholder: "project.vercel.app" },
                                    { label: "Pitch Deck", placeholder: "slides.google.com/..." },
                                ].map(({ label, placeholder }) => (
                                    <div key={label}>
                                        <label className="text-white/40 text-xs font-semibold uppercase tracking-wider">{label}</label>
                                        <div className="flex items-center gap-2 mt-1">
                                            <input
                                                type="text"
                                                placeholder={placeholder}
                                                disabled
                                                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white/40 text-sm placeholder-white/20 cursor-not-allowed focus:outline-none"
                                            />
                                            <button
                                                disabled
                                                className="p-2 bg-white/5 text-white/25 rounded-lg cursor-not-allowed"
                                            >
                                                <ExternalLink className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                <p className="text-white/25 text-xs mt-2">
                                    Submission fields will be editable in a future release.
                                </p>
                            </div>
                        </div>

                        {/* Team */}
                        {team?.members && team.members.length > 0 && (
                            <div className="glass rounded-xl p-6">
                                <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                    <Users className="w-5 h-5 text-primary" />
                                    Team Members
                                </h2>
                                <div className="space-y-2">
                                    {team.members.map((member) => {
                                        const name = member.user?.fullName || "Member";
                                        const initials = name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase();
                                        return (
                                            <div key={member.id} className="flex items-center gap-3 p-2 bg-white/5 rounded-lg">
                                                <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center text-primary text-xs font-bold">
                                                    {initials}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-1.5">
                                                        <p className="text-white text-sm font-medium">{name}</p>
                                                        {member.role === "captain" && (
                                                            <Crown className="w-3 h-3 text-yellow-500" />
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
