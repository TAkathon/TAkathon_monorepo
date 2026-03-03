"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import {
    ArrowLeft,
    Send,
    Users,
    MessageCircle,
    Loader2,
    Smile,
    Paperclip,
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
    hackathon?: { title: string };
    members?: TeamMember[];
}

// ─── Placeholder messages ─────────────────────────────────────────────────────
const PLACEHOLDER_MESSAGES = [
    {
        id: "1",
        sender: "Alice Johnson",
        initials: "AJ",
        role: "captain",
        content: "Hey team! Welcome to our team chat 👋 Let's coordinate here.",
        time: "2 hours ago",
        isMe: false,
    },
    {
        id: "2",
        sender: "Bob Smith",
        initials: "BS",
        role: "member",
        content: "Great! I'm thinking we should start with the backend API design first.",
        time: "1 hour ago",
        isMe: false,
    },
    {
        id: "3",
        sender: "You",
        initials: "ME",
        role: "member",
        content: "Agreed. I can handle the frontend components once the API contract is defined.",
        time: "45 min ago",
        isMe: true,
    },
    {
        id: "4",
        sender: "Alice Johnson",
        initials: "AJ",
        role: "captain",
        content: "Perfect. Let's have our first standup tomorrow at 10am UTC?",
        time: "30 min ago",
        isMe: false,
    },
];

export default function TeamMessagesPage() {
    const params = useParams();
    const router = useRouter();
    const teamId = params.id as string;

    const [team, setTeam] = useState<TeamData | null>(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchTeam();
    }, [teamId]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, []);

    const fetchTeam = async () => {
        try {
            const data = await teamApi.getTeam(teamId);
            setTeam(data as any);
        } catch {
            // fallback — team data not critical for the layout
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout>
            <div className="flex flex-col h-[calc(100vh-120px)] max-h-[800px]">
                {/* Header */}
                <div className="glass rounded-xl p-4 mb-4 flex items-center gap-4">
                    <button
                        onClick={() => router.push("/dashboard/teams")}
                        className="p-2 hover:bg-white/10 rounded-lg transition-all text-white/60 hover:text-white"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                        <MessageCircle className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                        {loading ? (
                            <div className="h-5 w-32 bg-white/10 rounded animate-pulse" />
                        ) : (
                            <>
                                <h1 className="text-white font-bold text-lg leading-tight">
                                    {team?.name ?? "Team Chat"}
                                </h1>
                                {team?.hackathon && (
                                    <p className="text-white/50 text-sm">{team.hackathon.title}</p>
                                )}
                            </>
                        )}
                    </div>
                    {team?.members && (
                        <div className="flex items-center gap-1.5 text-white/50 text-sm">
                            <Users className="w-4 h-4" />
                            <span>{team.members.length} members</span>
                        </div>
                    )}

                    {/* Coming Soon Badge */}
                    <span className="px-2.5 py-1 bg-yellow-500/15 border border-yellow-500/30 text-yellow-400 text-xs font-semibold rounded-full">
                        Coming Soon
                    </span>
                </div>

                {/* Chat area */}
                <div className="glass rounded-xl flex-1 flex flex-col overflow-hidden">
                    {/* Messages list */}
                    <div className="flex-1 overflow-y-auto p-5 space-y-4">
                        {/* Date divider */}
                        <div className="flex items-center gap-3">
                            <div className="flex-1 h-px bg-white/10" />
                            <span className="text-white/30 text-xs">Today</span>
                            <div className="flex-1 h-px bg-white/10" />
                        </div>

                        {PLACEHOLDER_MESSAGES.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex items-start gap-3 ${msg.isMe ? "flex-row-reverse" : ""}`}
                            >
                                {/* Avatar */}
                                <div className={`w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center text-sm font-bold ${msg.isMe ? "bg-primary/30 text-primary" : "bg-white/10 text-white"}`}>
                                    {msg.initials}
                                </div>

                                {/* Bubble */}
                                <div className={`max-w-[70%] ${msg.isMe ? "items-end" : "items-start"} flex flex-col gap-1`}>
                                    {!msg.isMe && (
                                        <div className="flex items-center gap-1.5">
                                            <span className="text-white/70 text-xs font-semibold">{msg.sender}</span>
                                            {msg.role === "captain" && (
                                                <Crown className="w-3 h-3 text-yellow-500" />
                                            )}
                                        </div>
                                    )}
                                    <div
                                        className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                                            msg.isMe
                                                ? "bg-primary/30 text-white rounded-tr-sm"
                                                : "bg-white/8 text-white/90 rounded-tl-sm"
                                        }`}
                                        style={!msg.isMe ? { backgroundColor: "rgba(255,255,255,0.08)" } : {}}
                                    >
                                        {msg.content}
                                    </div>
                                    <span className="text-white/30 text-xs">{msg.time}</span>
                                </div>
                            </div>
                        ))}
                        <div ref={bottomRef} />
                    </div>

                    {/* Input bar */}
                    <div className="border-t border-white/10 p-4">
                        <div className="flex items-center gap-3 relative">
                            <button
                                disabled
                                className="p-2 text-white/30 rounded-lg cursor-not-allowed"
                                title="Attachments coming soon"
                            >
                                <Paperclip className="w-5 h-5" />
                            </button>
                            <div className="flex-1 relative">
                                <input
                                    type="text"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Messaging is coming soon…"
                                    disabled
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white/40 text-sm placeholder-white/25 cursor-not-allowed focus:outline-none"
                                />
                            </div>
                            <button
                                disabled
                                className="p-2 text-white/30 rounded-lg cursor-not-allowed"
                            >
                                <Smile className="w-5 h-5" />
                            </button>
                            <button
                                disabled
                                className="p-2 bg-primary/30 text-primary/40 rounded-lg cursor-not-allowed"
                            >
                                <Send className="w-5 h-5" />
                            </button>
                        </div>
                        <p className="text-center text-white/25 text-xs mt-2">
                            Real-time messaging with WebSockets will be available in a future release.
                        </p>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
