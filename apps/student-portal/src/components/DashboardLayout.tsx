"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore, getLandingUrl, getRedirectUrl } from "@takathon/shared/utils";
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
  Check,
  Trophy,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Hackathons", href: "/dashboard/hackathons", icon: Calendar },
  { name: "My Teams", href: "/dashboard/teams", icon: Users },
  { name: "Leaderboard", href: "/dashboard/leaderboard", icon: Trophy },
  { name: "Profile", href: "/dashboard/profile", icon: User },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
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
        // Interceptor handles 401
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

  if (!_hasHydrated || !isAuthenticated || (user?.role && user.role !== "student")) {
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
            <Link href="/" className="flex items-center gap-2 group cursor-pointer">
              <img src="/logotakathon.png" alt="Takathon Logo" className="h-8 w-auto group-hover:opacity-80 transition-opacity" />
              <span className="text-2xl font-black tracking-tighter text-white group-hover:text-primary transition-colors">
                TAKATHON
              </span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
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
            <Link href="/dashboard/profile" className="flex items-center gap-3 px-3 py-3 mb-3 hover:bg-white/5 rounded-sm transition-all group cursor-pointer border border-transparent hover:border-white/10">
              <div className="w-10 h-10 bg-white/5 border border-white/10 overflow-hidden flex items-center justify-center rounded-full shadow-glow-sm group-hover:border-primary/50 group-hover:bg-primary/10 transition-all">
                <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${user?.fullName || 'OP'}&backgroundColor=transparent`} alt="Avatar" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-white uppercase tracking-widest truncate">{user?.fullName || 'OPERATIVE'}</div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse shadow-glow-sm"></div>
                  <div className="text-[8px] text-primary font-bold tracking-[0.2em] uppercase">ONLINE</div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64 relative z-10">
        {/* Top bar */}
        <header className="sticky top-0 z-40 bg-gradient-to-b from-black/95 to-black/60 backdrop-blur-xl border-b border-white/10">
          <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center gap-4">
              <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-white/50 hover:text-white transition-all active:scale-[0.98]">
                <Menu className="w-6 h-6" />
              </button>
              <Link href="/" className="flex lg:hidden items-center gap-2 group cursor-pointer">
                <img src="/logotakathon.png" alt="Takathon Logo" className="h-6 w-auto group-hover:opacity-80 transition-opacity" />
                <span className="text-xl font-black tracking-tighter text-white group-hover:text-primary transition-colors">
                  TAKATHON
                </span>
              </Link>
            </div>

            {/* Search bar */}
            <div className="flex-1 max-w-2xl mx-4 hidden sm:block">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 group-focus-within:text-primary transition-colors" />
                <input
                  type="text"
                  placeholder="SEARCH COMMAND CENTER..."
                  className="w-full pl-12 pr-4 py-2 bg-white/[0.02] border border-white/10 text-xs font-bold uppercase tracking-widest text-white placeholder:text-white/30 focus:outline-none focus:border-primary/50 focus:bg-white/5 rounded-sm transition-all"
                />
              </div>
            </div>

            {/* Right section */}
            <div className="flex items-center gap-4">
              <div className="relative" ref={bellRef}>
                <button 
                  onClick={() => setBellOpen((o) => !o)} 
                  className="relative p-2 text-white/50 hover:text-white transition-all active:scale-[0.98]"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full border-2 border-black" />
                  )}
                </button>

                {bellOpen && (
                  <div className="absolute right-0 mt-4 w-80 bg-[#0a0a0a] border border-white/10 rounded-sm shadow-2xl overflow-hidden z-50">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-white/[0.02]">
                      <h3 className="text-[10px] font-bold text-white uppercase tracking-widest">
                        NOTIFICATIONS
                      </h3>
                      {unreadCount > 0 && (
                        <button
                          onClick={handleMarkAllRead}
                          className="text-[9px] text-primary hover:text-white font-bold uppercase tracking-widest transition-colors"
                        >
                          MARK ALL READ
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
                          NO RECENT INTEL
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
                      href="/dashboard/notifications"
                      onClick={() => setBellOpen(false)}
                      className="block text-center text-[9px] font-bold text-primary hover:bg-primary/10 py-3 border-t border-white/10 uppercase tracking-[0.2em] transition-all"
                    >
                      VIEW ALL INTEL
                    </Link>
                  </div>
                )}
              </div>
              
              <button 
                onClick={handleLogout} 
                className="text-white/50 hover:text-red-400 transition-all ml-2 pl-4 border-l border-white/10 active:scale-[0.98]" 
                title="Log Out"
              >
                <LogOut className="w-5 h-5" />
              </button>
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
                        <Link href="/" className="flex items-center gap-2 group cursor-pointer">
                            <img src="/logotakathon.png" alt="Takathon Logo" className="h-8 w-auto group-hover:opacity-80 transition-opacity" />
                            <span className="text-2xl font-black tracking-tighter text-white group-hover:text-primary transition-colors">
                                TAKATHON
                            </span>
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
                    <div className="p-4 border-t border-white/5">
                        <Link href="/dashboard/profile" onClick={() => setSidebarOpen(false)} className="flex items-center gap-3 px-3 py-3 mb-3 hover:bg-white/5 rounded-sm transition-all group cursor-pointer border border-transparent hover:border-white/10">
                            <div className="w-10 h-10 bg-white/5 border border-white/10 overflow-hidden flex items-center justify-center rounded-full shadow-glow-sm group-hover:border-primary/50 group-hover:bg-primary/10 transition-all">
                                <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${user?.fullName || 'OP'}&backgroundColor=transparent`} alt="Avatar" className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1">
                                <div className="text-xs font-bold text-white uppercase tracking-widest truncate">{user?.fullName || 'OPERATIVE'}</div>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                    <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse shadow-glow-sm"></div>
                                    <div className="text-[8px] text-primary font-bold tracking-[0.2em] uppercase">ONLINE</div>
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>
            </aside>
        </div>
      )}
    </div>
  );
}
