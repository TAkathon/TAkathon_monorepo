"use client";

import { useRef } from "react";
import { useScrollProgress, useMagnetic } from "@/lib/hooks";

export default function Navbar() {
    const scrollProgress = useScrollProgress();
    const loginRef = useRef<HTMLButtonElement>(null);
    const signUpRef = useRef<HTMLButtonElement>(null);

    useMagnetic(loginRef);
    useMagnetic(signUpRef);

    return (
        <>
            {/* Progress Scroll Bar */}
            <div
                className="scroll-progress"
                style={{ width: `${scrollProgress}%` }}
                aria-hidden="true"
            />

            {/* Navbar */}
            <nav className="fixed top-[3px] left-0 right-0 z-50 glass-dark">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <a href="#" className="flex items-center gap-2 group">
                            <span className="text-2xl font-bold text-primary transition-all duration-300 group-hover:text-glow-sm">
                                T
                            </span>
                            <span className="text-lg font-semibold text-white/90 tracking-wide">
                                AKATHON
                            </span>
                        </a>

                        {/* Navigation Buttons */}
                        <div className="flex items-center gap-3">
                            <button
                                ref={loginRef}
                                className="btn-magnetic px-5 py-2 text-sm font-medium text-white/90 rounded-full border border-white/20 hover:border-primary/50 hover:text-white transition-all duration-300"
                            >
                                Log In
                            </button>
                            <button
                                ref={signUpRef}
                                className="btn-magnetic px-5 py-2 text-sm font-medium text-white bg-primary rounded-full hover:bg-primary-dark transition-all duration-300"
                            >
                                Sign Up
                            </button>
                        </div>
                    </div>
                </div>
            </nav>
        </>
    );
}
