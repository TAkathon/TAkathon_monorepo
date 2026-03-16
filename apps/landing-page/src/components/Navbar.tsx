"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-8 py-5 bg-gradient-to-b from-black/90 to-transparent">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group cursor-pointer">
                <img src="/logotakathon.png" alt="Takathon Logo" className="h-8 w-auto group-hover:opacity-80 transition-opacity" />
                <span className="text-2xl font-black tracking-tighter text-white group-hover:text-primary transition-colors">
                    TAKATHON
                </span>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-10">
                <a href="#problems" className="text-xs font-bold tracking-widest hover:text-primary transition-colors uppercase">
                    Why?
                </a>
                <a href="#audience" className="text-xs font-bold tracking-widest hover:text-primary transition-colors uppercase">
                    For Who?
                </a>
                <a href="#workflow" className="text-xs font-bold tracking-widest hover:text-primary transition-colors uppercase">
                    How?
                </a>
                <a href="#contact" className="text-xs font-bold tracking-widest hover:text-primary transition-colors uppercase">
                    Contact
                </a>
            </div>

            {/* Desktop Buttons */}
            <div className="hidden md:flex items-center gap-4">
                <Link
                    href="/login"
                    className="px-6 py-2 text-xs font-bold tracking-widest bg-white text-black hover:bg-gray-200 transition-colors uppercase rounded-sm border border-white"
                >
                    Login
                </Link>
                <Link
                    href="/signup"
                    className="px-6 py-2 text-xs font-bold tracking-widest bg-primary text-white hover:bg-orange-600 transition-colors uppercase rounded-sm flex items-center gap-2 border border-primary"
                >
                    Sign Up
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                    </svg>
                </Link>
            </div>

            {/* Mobile Menu Toggle */}
            <button
                className="md:hidden text-white p-2"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Toggle menu"
            >
                {mobileOpen ? (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                ) : (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                )}
            </button>

            {/* Mobile Menu */}
            {mobileOpen && (
                <div className="absolute top-full left-0 right-0 bg-black/95 backdrop-blur-lg border-b border-white/10 md:hidden">
                    <div className="flex flex-col px-6 py-4 gap-4">
                        <a href="#problems" onClick={() => setMobileOpen(false)} className="text-xs font-bold tracking-widest hover:text-primary transition-colors uppercase py-2">Why?</a>
                        <a href="#audience" onClick={() => setMobileOpen(false)} className="text-xs font-bold tracking-widest hover:text-primary transition-colors uppercase py-2">For Who?</a>
                        <a href="#workflow" onClick={() => setMobileOpen(false)} className="text-xs font-bold tracking-widest hover:text-primary transition-colors uppercase py-2">How?</a>
                        <a href="#contact" onClick={() => setMobileOpen(false)} className="text-xs font-bold tracking-widest hover:text-primary transition-colors uppercase py-2">Contact</a>
                        <div className="flex gap-3 pt-2">
                            <Link href="/login" className="px-6 py-2 text-xs font-bold tracking-widest bg-white text-black uppercase rounded-sm border border-white">Login</Link>
                            <Link href="/signup" className="px-6 py-2 text-xs font-bold tracking-widest bg-primary text-white uppercase rounded-sm border border-primary">Sign Up</Link>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}
