"use client";

import Image from "next/image";
import { useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useScrollProgress, useMagnetic } from "@/lib/hooks";

export default function Navbar() {
    const router = useRouter();
    const scrollProgress = useScrollProgress();
    const loginRef = useRef<HTMLButtonElement>(null);
    const signUpRef = useRef<HTMLButtonElement>(null);

    useMagnetic(loginRef);
    useMagnetic(signUpRef);

    return (
        <>
            <div
                className="scroll-progress"
                style={{ width: `${scrollProgress}%` }}
                aria-hidden="true"
            />

            <nav className="fixed top-[3px] left-0 right-0 z-50 glass-dark">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <a href="#" className="flex items-center gap-2 group">
                            <Image
                                src="/logotakathon.png"
                                alt="TAKATHON Logo"
                                width={80}
                                height={22}
                                className="object-contain"
                                priority
                            />
                        </a>

                        <div className="flex items-center gap-3">
                            <button
                                ref={loginRef}
                                onClick={() => router.push("/login")}
                                className="btn-magnetic px-5 py-2 text-sm font-medium text-white/90 rounded-full border border-white/20 hover:border-primary/50 hover:text-white transition-all duration-300"
                            >
                                Log In
                            </button>
                            <button
                                ref={signUpRef}
                                onClick={() => router.push("/signup")}
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
