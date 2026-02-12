"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useMousePosition, useMagnetic } from "@/lib/hooks";
import SparkleField from "./SparkleField";

const stats = [
    { value: "260+", label: "Students" },
    { value: "14", label: "Hackathons" },
    { value: "🇹🇳", label: "Built in Tunisia" },
];

const containerVariants = {
    hidden: {},
    visible: {
        transition: { staggerChildren: 0.15, delayChildren: 0.3 },
    },
};

const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] },
    },
};

export default function HeroSection() {
    const mouse = useMousePosition();
    const primaryRef = useRef<HTMLButtonElement>(null);
    const mascotRef = useRef<HTMLDivElement>(null);

    useMagnetic(primaryRef);

    // Calculate eye offset based on cursor position
    const eyeOffsetX = ((mouse.x / (typeof window !== "undefined" ? window.innerWidth : 1)) - 0.5) * 6;
    const eyeOffsetY = ((mouse.y / (typeof window !== "undefined" ? window.innerHeight : 1)) - 0.5) * 4;

    return (
        <section
            id="hero"
            className="relative min-h-screen flex items-center justify-center overflow-hidden"
        >
            {/* Background */}
            <div className="absolute inset-0 bg-dark-gradient" />

            {/* Radial Glow */}
            <div className="absolute inset-0 bg-hero-gradient opacity-40" />

            {/* Sparkle Particles */}
            <SparkleField count={25} />

            {/* Content */}
            <motion.div
                className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center pt-24"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Sub-headline */}
                <motion.p
                    variants={fadeUp}
                    className="text-primary-light text-sm sm:text-base uppercase tracking-[0.3em] font-medium mb-4"
                >
                    The Operating System for Hackathons in Tunisia
                </motion.p>

                {/* Title */}
                <motion.h1
                    variants={fadeUp}
                    className="text-glow text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tight mb-6"
                >
                    <span className="bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-primary-light">
                        TAKATHON
                    </span>
                </motion.h1>

                {/* Mascot with eye-follow */}
                <motion.div
                    ref={mascotRef}
                    variants={fadeUp}
                    className="relative mx-auto w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 mb-10"
                >
                    {/* Glow ring behind mascot */}
                    <div className="absolute inset-[-20%] rounded-full bg-gradient-radial from-primary-dark/40 to-transparent animate-breathe" />

                    <motion.div
                        animate={{ y: [0, -8, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="relative w-full h-full flex items-center justify-center bg-primary/10 rounded-full border border-primary/20"
                    >
                        {/* Fallback styling when mascot.png is missing */}
                        <div className="absolute inset-0 flex items-center justify-center overflow-hidden rounded-full">
                            <span className="text-8xl select-none animate-pulse">🦅</span>
                        </div>

                        <Image
                            src="/mascot.png"
                            alt="TAKATHON Falcon Mascot"
                            fill
                            className="object-contain drop-shadow-2xl z-10"
                            priority
                            sizes="(max-width: 640px) 192px, (max-width: 768px) 224px, 256px"
                            onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                                const target = e.target as HTMLElement;
                                target.style.display = 'none';
                            }}
                        />
                        {/* Eye highlight that follows cursor */}
                        <div
                            className="absolute top-[32%] left-[44%] w-2 h-2 bg-white/80 rounded-full blur-[1px] pointer-events-none transition-transform duration-200"
                            style={{
                                transform: `translate(${eyeOffsetX}px, ${eyeOffsetY}px)`,
                            }}
                        />
                        <div
                            className="absolute top-[32%] left-[56%] w-2 h-2 bg-white/80 rounded-full blur-[1px] pointer-events-none transition-transform duration-200"
                            style={{
                                transform: `translate(${eyeOffsetX}px, ${eyeOffsetY}px)`,
                            }}
                        />
                    </motion.div>
                </motion.div>

                {/* CTA Buttons */}
                <motion.div
                    variants={fadeUp}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
                >
                    <button
                        ref={primaryRef}
                        className="btn-magnetic group relative px-8 py-3.5 bg-primary text-white font-semibold rounded-full text-lg overflow-hidden transition-all duration-300 hover:shadow-glow-white"
                    >
                        <span className="relative z-10">Host a Hackathon</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-primary-dark to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </button>

                    <button className="btn-magnetic px-8 py-3.5 bg-white/5 text-white font-semibold rounded-full text-lg border-2 border-primary/60 hover:border-primary hover:bg-primary/10 transition-all duration-300">
                        Participate
                    </button>
                </motion.div>

                {/* Social Proof / Trust Row */}
                <motion.div
                    variants={fadeUp}
                    className="flex items-center justify-center gap-6 sm:gap-10"
                >
                    {stats.map((stat, i) => (
                        <div key={i} className="text-center">
                            <div className="text-2xl sm:text-3xl font-bold text-white">
                                {stat.value}
                            </div>
                            <div className="text-xs sm:text-sm text-white/60 mt-1">
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </motion.div>
            </motion.div>

            {/* Bottom fade */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-dark to-transparent" />
        </section>
    );
}
