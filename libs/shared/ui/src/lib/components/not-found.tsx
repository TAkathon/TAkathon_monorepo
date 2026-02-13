"use client";

import { motion } from "framer-motion";
import NextImage from "next/image";
import Link from "next/link";
import { ArrowLeft, Home } from "lucide-react";

export interface NotFoundProps {
    title?: string;
    description?: string;
    homeUrl?: string;
    mascotSrc?: string;
}

export function NotFound({
    title = "404 - Page Not Found",
    description = "The page you are looking for does not exist or has been moved.",
    homeUrl = "/",
    mascotSrc = "/mascot.png",
}: NotFoundProps) {
    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0a0a0a] text-white selection:bg-primary/30 selection:text-white">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-[#0a0a0a] to-[#0a0a0a] pointer-events-none" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none opacity-40" />
            <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-purple-500/5 rounded-full blur-[140px] pointer-events-none opacity-30" />

            {/* Grid Pattern */}
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />

            <div className="relative z-10 container px-4 md:px-6 flex flex-col md:flex-row items-center justify-center gap-12 md:gap-20">
                {/* Text Content */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    className="flex-1 max-w-lg text-center md:text-left"
                >
                    <div className="inline-block px-3 py-1 mb-6 text-xs font-semibold tracking-wider text-primary uppercase bg-primary/10 rounded-full border border-primary/20">
                        Error 404
                    </div>

                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/60">
                        Lost in <span className="text-primary">Space?</span>
                    </h1>

                    <p className="text-lg md:text-xl text-white/60 mb-8 leading-relaxed">
                        {description}
                    </p>

                    <div className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start">
                        <Link
                            href={homeUrl}
                            className="group relative px-6 py-3 bg-primary text-black font-semibold rounded-xl overflow-hidden transition-all duration-300 hover:shadow-[0_0_20px_rgba(var(--primary-rgb),0.5)] active:scale-95 flex items-center gap-2"
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                <Home className="w-4 h-4" />
                                Return Home
                            </span>
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                        </Link>

                        <button
                            onClick={() => window.history.back()}
                            className="px-6 py-3 bg-white/5 text-white font-medium rounded-xl border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 active:scale-95 flex items-center gap-2"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Go Back
                        </button>
                    </div>
                </motion.div>

                {/* Mascot Animation */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8, x: 20 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="flex-1 relative"
                >
                    <motion.div
                        animate={{
                            y: [0, -20, 0],
                            rotate: [0, 2, -2, 0]
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="relative w-72 h-72 md:w-96 md:h-96 mx-auto"
                    >
                        {/* Glow behind mascot */}
                        <div className="absolute inset-4 bg-primary/20 rounded-full blur-3xl animate-pulse" />

                        <NextImage
                            src={mascotSrc}
                            alt="Lost Mascot"
                            fill
                            className="object-contain drop-shadow-2xl z-10"
                            priority
                        />

                        {/* Floating elements */}
                        <div className="absolute -top-4 -right-4 w-12 h-12 bg-white/5 border border-white/10 backdrop-blur-md rounded-lg flex items-center justify-center animate-bounce delay-100">
                            <span className="text-xl">?</span>
                        </div>
                        <div className="absolute bottom-8 -left-8 w-16 h-10 bg-white/5 border border-white/10 backdrop-blur-md rounded-lg flex items-center justify-center animate-bounce delay-700">
                            <span className="text-sm font-mono text-primary">404</span>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}
