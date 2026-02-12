"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
} from "lucide-react";

const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Hackathons", href: "/dashboard/hackathons", icon: Calendar },
    { name: "My Teams", href: "/dashboard/teams", icon: Users },
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
                        </Link>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 py-4 space-y-1">
                        {navigation.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.href;
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
                        <button className="flex items-center gap-3 px-4 py-3 rounded-lg text-white/70 hover:bg-white/5 hover:text-white transition-all duration-200 w-full">
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
                                    <span className="text-xl font-semibold text-white/90">AKATHON</span>
                                </Link>
                                <button
                                    onClick={() => setSidebarOpen(false)}
                                    className="text-white/70 hover:text-white"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            {/* Navigation */}
                            <nav className="flex-1 px-4 py-4 space-y-1">
                                {navigation.map((item) => {
                                    const Icon = item.icon;
                                    const isActive = pathname === item.href;
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
                                <button className="flex items-center gap-3 px-4 py-3 rounded-lg text-white/70 hover:bg-white/5 hover:text-white transition-all duration-200 w-full">
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
                        >
                            <Menu className="w-6 h-6" />
                        </button>

                        {/* Search bar */}
                        <div className="flex-1 max-w-2xl mx-4 hidden sm:block">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                                <input
                                    type="text"
                                    placeholder="Search hackathons, teams..."
                                    className="w-full pl-11 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:border-primary/50 transition-all"
                                />
                            </div>
                        </div>

                        {/* Right section */}
                        <div className="flex items-center gap-4">
                            {/* Notifications */}
                            <button className="relative p-2 text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-all">
                                <Bell className="w-6 h-6" />
                                <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
                            </button>

                            {/* User avatar */}
                            <button className="flex items-center gap-3 p-1.5 hover:bg-white/5 rounded-lg transition-all">
                                <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center text-primary font-semibold">
                                    JD
                                </div>
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
