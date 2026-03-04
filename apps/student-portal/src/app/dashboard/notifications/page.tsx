"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { notificationApi } from "@takathon/shared/api";
import type { Notification } from "@takathon/shared/api";
import { toast } from "sonner";
import DashboardLayout from "@/components/DashboardLayout";
import {
  Bell,
  Check,
  CheckCheck,
  Trash2,
  Loader2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
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
      setError(err.response?.data?.message || "Failed to load notifications.");
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
      toast.error("Failed to mark as read");
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationApi.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch {
      toast.error("Failed to mark all as read");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await notificationApi.deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      setTotal((t) => t - 1);
    } catch {
      toast.error("Failed to delete notification");
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
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    if (days < 30) return `${days}d ago`;
    return new Date(dateStr).toLocaleDateString();
  }

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Bell className="w-7 h-7 text-primary" />
            <h1 className="text-2xl font-bold text-white">Notifications</h1>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 bg-primary/20 text-primary text-xs font-bold rounded-full">
                {unreadCount} unread
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="btn-secondary text-sm flex items-center gap-2"
            >
              <CheckCheck size={16} />
              Mark all read
            </button>
          )}
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6">
          {(["all", "unread"] as Filter[]).map((f) => (
            <button
              key={f}
              onClick={() => {
                setFilter(f);
                setPage(1);
              }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filter === f
                  ? "bg-primary text-white"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              {f === "all" ? "All" : "Unread"}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="glass border border-red-500/20 p-4 text-red-400 flex items-center gap-2">
            <AlertCircle size={16} />
            {error}
            <button
              onClick={fetchNotifications}
              className="ml-auto text-sm underline"
            >
              Retry
            </button>
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-20 text-white/40">
            <Bell size={48} className="mx-auto mb-4 opacity-40" />
            <p className="text-lg">
              {filter === "unread"
                ? "No unread notifications"
                : "No notifications yet"}
            </p>
            <p className="text-sm mt-2">
              You&apos;ll be notified about team invitations, hackathon updates,
              and more.
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-2">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className={`glass p-4 rounded-xl flex items-start gap-3 group transition-all hover:border-white/20 cursor-pointer ${
                    !n.isRead
                      ? "border border-primary/20 bg-primary/5"
                      : "border border-white/5"
                  }`}
                  onClick={() => handleClick(n)}
                >
                  {/* Unread dot */}
                  <div className="pt-1">
                    {!n.isRead ? (
                      <span className="w-2.5 h-2.5 bg-primary rounded-full block" />
                    ) : (
                      <span className="w-2.5 h-2.5 block" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white">
                      {n.title}
                    </p>
                    <p className="text-sm text-white/60 mt-0.5 line-clamp-2">
                      {n.message}
                    </p>
                    <p className="text-xs text-white/30 mt-1.5">
                      {timeAgo(n.createdAt)}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                    {!n.isRead && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMarkAsRead(n.id);
                        }}
                        title="Mark as read"
                        aria-label="Mark as read"
                        className="p-1.5 hover:bg-white/10 rounded-lg text-white/40 hover:text-white transition-all"
                      >
                        <Check size={14} />
                      </button>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(n.id);
                      }}
                      title="Delete"
                      aria-label="Delete notification"
                      className="p-1.5 hover:bg-red-500/10 rounded-lg text-white/40 hover:text-red-400 transition-all"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-6">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/5 disabled:opacity-30 disabled:pointer-events-none transition-all"
                  aria-label="Previous page"
                ></button>
                <span className="text-sm text-white/60">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/5 disabled:opacity-30 disabled:pointer-events-none transition-all"
                  aria-label="Next page"
                ></button>
              </div>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
