"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore, getLandingUrl, getRedirectUrl } from "@shared/utils";
import api, { notificationApi } from "@takathon/shared/api";
import type { Notification } from "@takathon/shared/api";
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
} from "lucide-react";

const navigation = [
  { name: "Command Center", href: "/", icon: Home },
  { name: "Operations", href: "/hackathons", icon: Calendar },
  { name: "Applicants", href: "/participants", icon: User },
  { name: "Squads", href: "/teams", icon: Users },
  { name: "Rankings", href: "/leaderboard", icon: Trophy },
  { name: "Intel", href: "/analytics", icon: BarChart3 },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, login, logout, _hasHydrated } = useAuthStore();

  // Auth/Hydration Logic from dev
  useEffect(() => {
    if (!_hasHydrated) return;
    if (isAuthenticated && user) return;

    let cancelled = false;
    (async () => {
      try {
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
        // 401 handled by interceptor
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [_hasHydrated, isAuthenticated, user, login]);

  // Logout handler
  const handleLogout = async () => {
    try {
      await api.post("/api/v1/auth/logout");
    } catch {
      /* best-effort */
    }
    logout();
    window.location.href = `${getLandingUrl()}/login`;
  };

  // Notification logic from dev
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
        const res = await notificationApi.getNotifications({ page: 1, limit: 5 });
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

  if (!_hasHydrated || !isAuthenticated || (user?.role && user.role !== "organizer")) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505]">
      {/* Digital Dust */}
      <div className="digital-dust"></div>

      {/* Sidebar for desktop */}
      <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-[#0a0a0a] border-r border-white/5 hidden lg:block">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex flex-col gap-2 px-6 py-6 border-b border-white/5">
            <Link href="/" className="flex items-center gap-1 group">
              <span className="text-2xl font-black text-primary tracking-tighter transition-all duration-300">
                TAKA
              </span>
              <span className="text-2xl font-black text-white tracking-tighter">
                THON
              </span>
            </Link>
            <div className="flex items-center gap-2 px-1">
              <div className="w-1.5 h-1.5 bg-green-500 animate-pulse rounded-full" />
              <span className="text-[8px] text-white/30 uppercase tracking-[0.2em] font-bold">
                System Online • Organizer HQ
              </span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 transition-all duration-200 group relative ${isActive
                    ? "bg-primary/10 text-white border-l-2 border-primary"
                    : "text-white/40 border-l-2 border-transparent hover:bg-white/5 hover:text-white/70"
                    }`}
                >
                  <Icon className={`w-4 h-4 transition-all duration-200 ${isActive ? "text-primary" : "group-hover:text-white/60"}`} />
                  <span className={`font-bold text-[11px] uppercase tracking-widest ${isActive ? "text-white" : ""}`}>
                    {item.name}
                  </span>
                  {isActive && (
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-primary rounded-l"></div>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User section */}
          <div className="p-4 border-t border-white/5">
            <div className="flex items-center gap-3 px-3 py-2 mb-3">
              <div className="w-8 h-8 bg-primary/20 border border-primary/30 flex items-center justify-center text-primary font-black text-xs">
                {user?.fullName?.split(' ').map((n: string) => n[0]).join('') || 'O'}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-white/70 uppercase tracking-wide truncate">{user?.fullName || 'Organizer'}</div>
                <div className="text-[8px] text-white/30 font-bold tracking-widest uppercase">Organizer</div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-2.5 text-white/40 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200 w-full group"
            >
              <LogOut className="w-4 h-4 group-hover:text-red-400" />
              <span className="font-bold text-[10px] uppercase tracking-widest">Log Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64 relative z-10">
        {/* Top bar */}
        <header className="sticky top-0 z-40 bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-white/5">
          <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-white/50 hover:text-white transition-all">
              <Menu className="w-5 h-5" />
            </button>

            {/* Search bar */}
            <div className="flex-1 max-w-2xl mx-4 hidden sm:block">
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-primary transition-colors" />
                <input
                  type="text"
                  placeholder="Search operations, cadres..."
                  className="w-full pl-10 pr-4 py-2 bg-black border border-white/5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-primary/30 transition-all font-medium tracking-wide uppercase text-[10px]"
                />
              </div>
            </div>

            {/* Right section */}
            <div className="flex items-center gap-3">
              {/* Verification Badge */}
              <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full">
                <ShieldCheck className="w-3.5 h-3.5 text-green-400" />
                <span className="text-[9px] font-bold uppercase tracking-widest text-green-400">
                  VERIFIED ORGANIZER
                </span>
              </div>

              <div className="relative" ref={bellRef}>
                <button 
                  onClick={() => setBellOpen((o) => !o)} 
                  className="relative p-2 text-white/40 hover:text-white hover:bg-white/5 transition-all active:scale-[0.98]"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-primary rounded-full shadow-glow-sm" />
                  )}
                </button>

                {bellOpen && (
                  <div className="absolute right-0 mt-4 w-80 bg-[#0a0a0a] border border-white/10 rounded-sm shadow-2xl overflow-hidden z-50">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-white/[0.02]">
                      <h3 className="text-[10px] font-bold text-white uppercase tracking-widest">
                        COMMAND NOTIFICATIONS
                      </h3>
                      {unreadCount > 0 && (
                        <button
                          onClick={handleMarkAllRead}
                          className="text-[9px] text-primary hover:text-white font-bold uppercase tracking-widest transition-colors"
                        >
                          CLEAR ALL
                        </button>
                      )}
                    </div>

                    <div className="max-h-80 overflow-y-auto">
                      {loadingNotifs ? (
                        <div className="p-8 text-center text-white/20 text-[10px] font-bold uppercase tracking-widest">
                          ESTABLISHING UPLINK...
                        </div>
                      ) : recentNotifs.length === 0 ? (
                        <div className="p-8 text-center text-white/20 text-[10px] font-bold uppercase tracking-widest">
                          NO RECENT COMMANDS
                        </div>
                      ) : (
                        recentNotifs.map((n) => (
                          <button
                            key={n.id}
                            onClick={() => handleNotifClick(n)}
                            className={`w-full text-left px-4 py-4 hover:bg-white/5 transition-all border-b border-white/5 last:border-0 ${!n.isRead ? "bg-primary/5" : ""}`}
                          >
                            <div className="flex items-start gap-3">
                              {!n.isRead && (
                                <div className="mt-1.5 w-1.5 h-1.5 bg-primary rounded-full shrink-0 shadow-glow-sm" />
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="text-[11px] font-bold text-white uppercase tracking-wide truncate">
                                  {n.title}
                                </p>
                                <p className="text-[10px] text-white/40 mt-1 leading-relaxed line-clamp-2">
                                  {n.message}
                                </p>
                                <p className="text-[8px] text-white/20 mt-2 font-bold uppercase tracking-widest">
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
                      className="block text-center text-[9px] font-bold text-primary hover:bg-primary/10 py-3 border-t border-white/10 uppercase tracking-[0.2em] transition-all"
                    >
                      VIEW FULL REGISTRY
                    </Link>
                  </div>
                )}
              </div>

              <div className="w-8 h-8 bg-primary/20 border border-primary/30 flex items-center justify-center text-primary font-black text-xs rounded-sm shadow-glow-sm ml-1">
                {user?.fullName?.split(' ').map((n: string) => n[0]).join('') || 'O'}
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>

      {/* Mobile sidebar (simplified integration) */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
            <aside className="absolute inset-y-0 left-0 w-64 bg-[#0a0a0a] border-r border-white/5">
                <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between px-6 py-6 border-b border-white/5">
                        <Link href="/" className="flex items-center gap-1">
                            <span className="text-2xl font-black text-primary tracking-tighter">TAKA</span>
                            <span className="text-2xl font-black text-white tracking-tighter">THON</span>
                        </Link>
                        <button onClick={() => setSidebarOpen(false)} className="text-white/50 hover:text-white active:scale-[0.98] transition-all">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    <nav className="flex-1 px-3 py-4 space-y-1">
                        {navigation.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    onClick={() => setSidebarOpen(false)}
                                    className={`flex items-center gap-3 px-4 py-3 transition-all duration-200 ${isActive
                                        ? "bg-primary/10 text-white border-l-2 border-primary"
                                        : "text-white/40 border-l-2 border-transparent hover:bg-white/5 hover:text-white/70"
                                        }`}
                                >
                                    <Icon className={`w-4 h-4 ${isActive ? "text-primary" : ""}`} />
                                    <span className="font-bold text-[11px] uppercase tracking-widest">{item.name}</span>
                                </Link>
                            );
                        })}
                    </nav>
                </div>
            </aside>
        </div>
      )}
    </div>
  );
}
