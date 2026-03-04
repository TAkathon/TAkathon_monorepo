"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore, getLandingUrl } from "@shared/utils";
import { notificationApi } from "@takathon/shared/api";
import type { Notification } from "@takathon/shared/api";
import { AvatarMenu } from "@takathon/shared/ui";
import { toast } from "sonner";
import {
  Home,
  Calendar,
  Users,
  User,
  Settings,
  LogOut,
  Bell,
  Search,
  Menu,
  X,
  Trophy,
  BarChart3,
  ShieldCheck,
  Check,
  Trash2,
} from "lucide-react";

const navigation = [
  { name: "Overview", href: "/", icon: Home },
  { name: "My Hackathons", href: "/hackathons", icon: Calendar },
  { name: "Participants", href: "/participants", icon: User },
  { name: "Teams", href: "/teams", icon: Users },
  { name: "Leaderboard", href: "/leaderboard", icon: Trophy },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { user, isAuthenticated, login, logout, _hasHydrated } = useAuthStore();

  // Middleware already guards this route via the httpOnly JWT cookie.
  // Populate Zustand from /auth/me when store is empty (cross-origin redirect).
  useEffect(() => {
    if (!_hasHydrated) return;
    if (isAuthenticated && user) return;

    let cancelled = false;
    (async () => {
      try {
        const { default: api } = await import("@takathon/shared/api");
        const res = await api.get("/api/v1/auth/me");
        const u = res.data?.data ?? res.data;
        if (!cancelled && u?.id) {
          login({
            id: u.id,
            email: u.email,
            fullName: u.fullName,
            role: u.role,
          });
        }
      } catch {
        /* 401 handled by interceptor */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [_hasHydrated, isAuthenticated, user, login]);

  const handleLogout = async () => {
    try {
      const { default: api } = await import("@takathon/shared/api");
      await api.post("/api/v1/auth/logout");
    } catch {
      /* best-effort */
    }
    logout();
    window.location.href = `${getLandingUrl()}/login`;
  };

  const initials =
    _hasHydrated && user?.fullName
      ? user.fullName
          .split(" ")
          .map((n: string) => n[0])
          .join("")
          .slice(0, 2)
          .toUpperCase()
      : null;

  // ---------- Notification bell ----------
  const router = useRouter();
  const [unreadCount, setUnreadCount] = useState(0);
  const [bellOpen, setBellOpen] = useState(false);
  const [recentNotifs, setRecentNotifs] = useState<Notification[]>([]);
  const [loadingNotifs, setLoadingNotifs] = useState(false);
  const bellRef = useRef<HTMLDivElement>(null);

  const fetchUnread = useCallback(async () => {
    try {
      const res = await notificationApi.getUnreadCount();
      setUnreadCount((res as any).data?.count ?? (res as any).count ?? 0);
    } catch {
      /* silent */
    }
  }, []);

  useEffect(() => {
    if (!_hasHydrated || !isAuthenticated) return;
    fetchUnread();
    const iv = setInterval(fetchUnread, 60_000);
    return () => clearInterval(iv);
  }, [_hasHydrated, isAuthenticated, fetchUnread]);

  useEffect(() => {
    if (!bellOpen) return;
    (async () => {
      setLoadingNotifs(true);
      try {
        const res = await notificationApi.getNotifications({
          page: 1,
          limit: 5,
        });
        const d = (res as any).data ?? res;
        setRecentNotifs(d.notifications ?? []);
      } catch {
        /* silent */
      }
      setLoadingNotifs(false);
    })();
  }, [bellOpen]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (bellRef.current && !bellRef.current.contains(e.target as Node))
        setBellOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await notificationApi.markAllAsRead();
      setRecentNotifs((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch {
      toast.error("Failed to mark all as read");
    }
  };

  const handleNotifClick = async (n: Notification) => {
    if (!n.isRead) {
      try {
        await notificationApi.markAsRead(n.id);
      } catch {
        /* silent */
      }
      setRecentNotifs((prev) =>
        prev.map((x) => (x.id === n.id ? { ...x, isRead: true } : x)),
      );
      setUnreadCount((c) => Math.max(0, c - 1));
    }
    setBellOpen(false);
    if (n.actionUrl) router.push(n.actionUrl);
  };

  function timeAgo(dateStr: string): string {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  }

  return (
    <div className="min-h-screen bg-dark">
      {/* Sidebar for desktop */}
      <aside className="fixed inset-y-0 left-0 z-50 w-64 glass-dark border-r border-white/10 hidden lg:block">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-2 px-6 py-6">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="text-3xl font-bold text-primary transition-all duration-300 group-hover:text-glow-sm">
                T
              </span>
              <span className="text-xl font-semibold text-white/90 tracking-wide">
                AKATHON
              </span>
              <span className="ml-2 px-1.5 py-0.5 rounded text-[10px] font-bold bg-primary/20 text-primary border border-primary/30">
                ORG
              </span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-primary text-white shadow-lg shadow-primary/20"
                      : "text-white/70 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* User section */}
          <div className="p-4 border-t border-white/10">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-white/70 hover:bg-white/5 hover:text-white transition-all duration-200 w-full"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Log Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />

          {/* Sidebar */}
          <aside className="absolute inset-y-0 left-0 w-64 glass-dark border-r border-white/10">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-6">
                <Link href="/" className="flex items-center gap-2">
                  <span className="text-3xl font-bold text-primary">T</span>
                  <span className="text-xl font-semibold text-white/90">
                    AKATHON
                  </span>
                </Link>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="text-white/70 hover:text-white"
                  aria-label="Close sidebar"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Navigation */}
              <nav className="flex-1 px-4 py-4 space-y-1">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    item.href === "/"
                      ? pathname === "/"
                      : pathname.startsWith(item.href);
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                        isActive
                          ? "bg-primary text-white shadow-lg shadow-primary/20"
                          : "text-white/70 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  );
                })}
              </nav>

              {/* User section */}
              <div className="p-4 border-t border-white/10">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-white/70 hover:bg-white/5 hover:text-white transition-all duration-200 w-full"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Log Out</span>
                </button>
              </div>
            </div>
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-40 glass-dark border-b border-white/10">
          <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4">
            {/* Mobile menu button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-white/70 hover:text-white"
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Search bar */}
            <div className="flex-1 max-w-2xl mx-4 hidden sm:block">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type="text"
                  placeholder="Search participants, teams, hackathons..."
                  className="w-full pl-11 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:border-primary/50 transition-all"
                />
              </div>
            </div>

            {/* Right section */}
            <div className="flex items-center gap-4">
              {/* Verification Badge */}
              <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full">
                <ShieldCheck className="w-4 h-4 text-green-400" />
                <span className="text-xs font-medium text-green-400">
                  Verified Organizer
                </span>
              </div>

              {/* Notifications */}
              <div className="relative" ref={bellRef}>
                <button
                  onClick={() => setBellOpen((o) => !o)}
                  className="relative p-2 text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                  aria-label="Toggle notifications"
                >
                  <Bell className="w-6 h-6" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center bg-primary text-white text-[10px] font-bold rounded-full px-1">
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                  )}
                </button>

                {bellOpen && (
                  <div className="absolute right-0 mt-2 w-80 glass border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
                      <h3 className="text-sm font-semibold text-white">
                        Notifications
                      </h3>
                      {unreadCount > 0 && (
                        <button
                          onClick={handleMarkAllRead}
                          className="text-xs text-primary hover:text-primary/80 flex items-center gap-1"
                        >
                          <Check size={12} /> Mark all read
                        </button>
                      )}
                    </div>

                    <div className="max-h-72 overflow-y-auto">
                      {loadingNotifs ? (
                        <div className="p-6 text-center text-white/40 text-sm">
                          Loading…
                        </div>
                      ) : recentNotifs.length === 0 ? (
                        <div className="p-6 text-center text-white/40 text-sm">
                          No notifications yet
                        </div>
                      ) : (
                        recentNotifs.map((n) => (
                          <button
                            key={n.id}
                            onClick={() => handleNotifClick(n)}
                            className={`w-full text-left px-4 py-3 hover:bg-white/5 transition-all border-b border-white/5 last:border-0 ${!n.isRead ? "bg-primary/5" : ""}`}
                          >
                            <div className="flex items-start gap-2">
                              {!n.isRead && (
                                <span className="mt-1.5 w-2 h-2 bg-primary rounded-full shrink-0" />
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-white truncate">
                                  {n.title}
                                </p>
                                <p className="text-xs text-white/50 truncate mt-0.5">
                                  {n.message}
                                </p>
                                <p className="text-[10px] text-white/30 mt-1">
                                  {timeAgo(n.createdAt)}
                                </p>
                              </div>
                            </div>
                          </button>
                        ))
                      )}
                    </div>

                    <Link
                      href="/notifications"
                      onClick={() => setBellOpen(false)}
                      className="block text-center text-xs text-primary hover:text-primary/80 py-3 border-t border-white/10"
                    >
                      View all notifications
                    </Link>
                  </div>
                )}
              </div>

              {/* User avatar menu */}
              <AvatarMenu
                user={user}
                hydrated={_hasHydrated}
                profilePath="/settings"
                settingsPath="/settings"
                onSignOut={handleLogout}
              />
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
