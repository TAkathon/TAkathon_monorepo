"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { notificationApi } from "@takathon/shared/api";
import type { Notification } from "@takathon/shared/api";
import { toast } from "sonner";
import OrganizerLayout from "@/components/OrganizerLayout";
import {
  Bell,
  Check,
  CheckCheck,
  Trash2,
  Loader2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  Zap,
  Activity,
  Clock,
  ArrowRight
} from "lucide-react";

type Filter = "all" | "unread";

export default function NotificationsPage() {
    const router = useRouter();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [total, setTotal] = useState(0);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [filter, setFilter] = useState<Filter>("all");
    const limit = 10;

    const fetchNotifications = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await notificationApi.getNotifications({
                page,
                limit,
                unreadOnly: filter === "unread",
            });
            const d = (res as any).data ?? res;
            setNotifications(d.notifications ?? []);
            setTotal(d.total ?? 0);
            setUnreadCount(d.unreadCount ?? 0);
        } catch (err: any) {
            setError("FAILED TO RETRIEVE SIGNAL LOGS.");
        } finally {
            setLoading(false);
        }
    }, [page, filter]);

    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);

    const handleMarkAsRead = async (id: string) => {
        try {
            await notificationApi.markAsRead(id);
            setNotifications((prev) =>
                prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
            );
            setUnreadCount((c) => Math.max(0, c - 1));
        } catch {
            toast.error("SIGNAL ACKNOWLEDGEMENT FAILED");
        }
    };

    const handleMarkAllRead = async () => {
        try {
            await notificationApi.markAllAsRead();
            setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
            setUnreadCount(0);
            toast.success("ALL SIGNALS ACKNOWLEDGED");
        } catch {
            toast.error("BATCH ACKNOWLEDGEMENT FAILED");
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await notificationApi.deleteNotification(id);
            setNotifications((prev) => prev.filter((n) => n.id !== id));
            setTotal((t) => t - 1);
        } catch {
            toast.error("FAILED TO PURGE SIGNAL LOG");
        }
    };

    const handleClick = async (n: Notification) => {
        if (!n.isRead) await handleMarkAsRead(n.id);
        if (n.actionUrl) router.push(n.actionUrl);
    };

    const totalPages = Math.max(1, Math.ceil(total / limit));

    function timeAgo(dateStr: string): string {
        const diff = Date.now() - new Date(dateStr).getTime();
        const mins = Math.floor(diff / 60000);
        if (mins < 1) return "JUST NOW";
        if (mins < 60) return `${mins}M AGO`;
        const hrs = Math.floor(mins / 60);
        if (hrs < 24) return `${hrs}H AGO`;
        const days = Math.floor(hrs / 24);
        if (days < 30) return `${days}D AGO`;
        return new Date(dateStr).toLocaleDateString().toUpperCase();
    }

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
                                <span className="text-white">SIGNAL ALERTS</span>
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
                                REAL-TIME OPERATIONAL UPDATES & SYSTEM LOGS
                            </span>
                        </div>
                    </div>
                    {unreadCount > 0 && (
                        <button
                            onClick={handleMarkAllRead}
                            className="flex items-center justify-center gap-2 px-6 py-3 bg-[#080808] text-white border border-white/10 hover:border-primary/50 hover:bg-primary/5 transition-all rounded-sm text-[10px] font-bold tracking-widest uppercase mt-4"
                        >
                            <CheckCheck className="w-4 h-4" />
                            <span>ACKNOWLEDGE ALL</span>
                        </button>
                    )}
                </div>

                {/* Control Bar */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-4 border-t border-white/5">
                    <div className="flex gap-2 p-1 bg-[#080808] border border-white/5 rounded-sm">
                        {(["all", "unread"] as Filter[]).map((f) => (
                            <button
                                key={f}
                                onClick={() => {
                                    setFilter(f);
                                    setPage(1);
                                }}
                                className={`px-6 py-2 rounded-sm text-[10px] font-bold uppercase tracking-widest transition-all ${
                                    filter === f
                                        ? "bg-primary text-white shadow-glow-sm"
                                        : "text-white/40 hover:text-white/80"
                                }`}
                            >
                                {f === "all" ? "TOTAL SIGNALS" : "PENDING ONLY"}
                            </button>
                        ))}
                    </div>
                    
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-3">
                            <div className="text-right">
                                <div className="text-[8px] text-white/40 font-bold uppercase tracking-widest">PENDING SIGNALS</div>
                                <div className="text-xl font-black italic tracking-tighter text-primary leading-none">{unreadCount}</div>
                            </div>
                            <div className="w-8 h-8 bg-primary/10 flex items-center justify-center rounded-sm border border-primary/20">
                                <Bell className="w-4 h-4 text-primary" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Alerts List */}
                <div className="space-y-4">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-4">
                            <Loader2 className="w-10 h-10 animate-spin text-primary" />
                            <div className="text-[10px] font-bold text-white/20 uppercase tracking-widest">DECRYPTING SIGNAL FEED...</div>
                        </div>
                    ) : error ? (
                        <div className="bg-red-500/5 border border-red-500/20 p-6 rounded-sm text-red-500 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <ShieldAlert size={20} />
                                <span className="text-[10px] font-bold uppercase tracking-widest">{error}</span>
                            </div>
                            <button
                                onClick={fetchNotifications}
                                className="px-4 py-2 border border-red-500/30 hover:bg-red-500/10 text-[10px] font-bold uppercase tracking-widest transition-all rounded-sm"
                            >
                                RETRY SYNC
                            </button>
                        </div>
                    ) : notifications.length === 0 ? (
                        <div className="bg-[#080808] border border-white/5 border-dashed rounded-sm p-20 text-center flex flex-col items-center gap-4">
                            <Activity className="w-12 h-12 text-white/10" />
                            <div className="text-sm font-black italic text-white/40 uppercase tracking-tighter">NO SIGNAL DETECTED</div>
                            <p className="text-[10px] text-white/20 uppercase tracking-[0.2em] font-bold">THE SIGNAL FEED IS CURRENTLY SILENT</p>
                        </div>
                    ) : (
                        <>
                            <div className="space-y-3">
                                {notifications.map((n) => (
                                    <div
                                        key={n.id}
                                        className={`group relative p-6 bg-[#080808] rounded-sm transition-all hover:bg-[#0a0a0a] border cursor-pointer flex flex-col sm:flex-row items-center gap-6 ${
                                            !n.isRead ? "border-primary/30" : "border-white/5"
                                        }`}
                                        onClick={() => handleClick(n)}
                                    >
                                        <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/10 group-hover:border-primary/50"></div>
                                        
                                        <div className="relative shrink-0">
                                            <div className={`w-12 h-12 flex items-center justify-center rounded-sm border transition-all ${
                                                !n.isRead ? "bg-primary/10 border-primary/20 text-primary" : "bg-white/5 border-white/10 text-white/20"
                                            }`}>
                                                <Zap className={`w-5 h-5 ${!n.isRead ? "text-primary shadow-glow-sm" : ""}`} />
                                            </div>
                                            {!n.isRead && (
                                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-sm border-2 border-[#080808] shadow-[0_0_10px_rgba(255,92,0,0.5)]"></div>
                                            )}
                                        </div>

                                        <div className="flex-1 min-w-0 text-center sm:text-left">
                                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                                                <h3 className={`text-sm font-black italic tracking-wider uppercase ${!n.isRead ? "text-white" : "text-white/60"}`}>
                                                    {n.title}
                                                </h3>
                                                <div className="flex items-center justify-center sm:justify-start gap-2 text-[8px] font-bold text-white/20 uppercase tracking-widest">
                                                    <Clock className="w-2.5 h-2.5" />
                                                    {timeAgo(n.createdAt)}
                                                </div>
                                            </div>
                                            <p className={`text-[10px] font-medium leading-relaxed uppercase tracking-wide line-clamp-2 ${!n.isRead ? "text-white/70" : "text-white/40"}`}>
                                                {n.message}
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-3 shrink-0">
                                            {!n.isRead && (
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleMarkAsRead(n.id); }}
                                                    className="w-10 h-10 border border-white/5 hover:border-primary/50 hover:bg-primary/5 text-white/20 hover:text-primary transition-all rounded-sm flex items-center justify-center"
                                                >
                                                    <Check className="w-5 h-5" />
                                                </button>
                                            )}
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleDelete(n.id); }}
                                                className="w-10 h-10 border border-white/5 hover:border-red-500/50 hover:bg-red-500/5 text-white/20 hover:text-red-500 transition-all rounded-sm flex items-center justify-center"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                            <div className="w-10 h-10 border border-white/5 text-white/10 flex items-center justify-center rounded-sm group-hover:text-primary group-hover:border-primary/20 transition-all">
                                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {totalPages > 1 && (
                                <div className="flex items-center justify-center gap-6 pt-8">
                                    <button
                                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                                        disabled={page === 1}
                                        className="w-10 h-10 border border-white/5 flex items-center justify-center text-white/40 hover:text-white hover:border-white/20 disabled:opacity-20 transition-all rounded-sm"
                                    >
                                        <ChevronLeft size={20} />
                                    </button>
                                    <div className="text-[10px] font-black italic text-white/40 uppercase tracking-widest">
                                        SECTOR <span className="text-white">{page}</span> / {totalPages}
                                    </div>
                                    <button
                                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                        disabled={page === totalPages}
                                        className="w-10 h-10 border border-white/5 flex items-center justify-center text-white/40 hover:text-white hover:border-white/20 disabled:opacity-20 transition-all rounded-sm"
                                    >
                                        <ChevronRight size={20} />
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </OrganizerLayout>
    );
}
