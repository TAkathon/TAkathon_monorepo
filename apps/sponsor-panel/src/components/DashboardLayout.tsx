"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";
import { useAuthStore, getRedirectUrl, getLandingUrl } from "@shared/utils";
import {
    Home,
    Search,
    Inbox,
    Wallet,
    Building2,
    LogOut,
    Bell,
    Menu,
    X,
    Settings,
    UserSearch,
} from "lucide-react";

const navigation = [
    { name: "Command Center", href: "/dashboard", icon: Home },
    { name: "Discover Ops", href: "/dashboard/opportunities", icon: Search },
    { name: "Request Intel", href: "/dashboard/requests", icon: Inbox },
    { name: "Budget Ops", href: "/dashboard/budget", icon: Wallet },
    { name: "Talent Radar", href: "/dashboard/talent", icon: UserSearch },
    { name: "Brand Profile", href: "/dashboard/profile", icon: Building2 },
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
    const { user, isAuthenticated, logout, _hasHydrated } = useAuthStore();

    useEffect(() => {
        if (!_hasHydrated) return;
        if (!isAuthenticated) {
            window.location.href = `${getLandingUrl()}/login`;
        } else if (user?.role && user.role !== "sponsor") {
            const url = getRedirectUrl(user.role);
            window.location.href = url;
        }
    }, [isAuthenticated, user, router, _hasHydrated]);

    const handleLogout = () => {
        logout();
        window.location.href = `${getLandingUrl()}/login`;
    };

    if (!_hasHydrated || !isAuthenticated || user?.role !== "sponsor") {
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
                            const isActive = pathname === item.href;
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
                            <div className="flex-1">
                                <div className="text-xs font-bold text-white uppercase tracking-widest truncate">{user?.fullName || 'OPERATIVE'}</div>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                    <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse shadow-glow-sm"></div>
                                    <div className="text-[8px] text-primary font-bold tracking-[0.2em] uppercase">ONLINE</div>
                                </div>
                            </div>
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 px-4 py-2.5 text-white/40 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200 w-full group hidden" /* Hiding this as it's cleaner without, but keeping logic*/
                        >
                            <LogOut className="w-4 h-4 group-hover:text-red-400" />
                            <span className="font-bold text-[10px] uppercase tracking-widest">Log Out</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Mobile sidebar */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        onClick={() => setSidebarOpen(false)}
                    />
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
                                <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2.5 text-white/40 hover:text-red-400 transition-all w-full hidden">
                                    <LogOut className="w-4 h-4" />
                                    <span className="font-bold text-[10px] uppercase tracking-widest">Log Out</span>
                                </button>
                            </div>
                        </div>
                    </aside>
                </div>
            )}

            {/* Main content */}
            <div className="lg:pl-64 relative z-10">
                {/* Top bar */}
                <header className="sticky top-0 z-40 bg-gradient-to-b from-black/95 to-black/60 backdrop-blur-xl border-b border-white/10">
                    <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4">
                        <div className="flex items-center gap-4">
                            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-white/50 hover:text-white transition-all active:scale-[0.98]">
                                <Menu className="w-6 h-6" />
                            </button>

                            {/* Logo for mobile - same style as landing page */}
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
                            <button onClick={() => toast.info('No new notifications', { description: 'You are all caught up.' })} className="relative p-2 text-white/50 hover:text-white transition-all active:scale-[0.98]">
                                <Bell className="w-5 h-5" />
                                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full border-2 border-black" />
                            </button>
                            <button onClick={handleLogout} className="text-white/50 hover:text-red-400 transition-all ml-2 pl-4 border-l border-white/10 active:scale-[0.98]" title="Log Out">
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
        </div>
    );
}
