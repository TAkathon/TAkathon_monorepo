"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NotFoundPage() {
    const router = useRouter();
    return (
        <main className="relative min-h-screen flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-dark-gradient" />
            <div className="absolute inset-0 bg-hero-gradient opacity-30" />

            <div className="relative z-10 mx-auto w-full max-w-xl px-6 py-24 text-center">
                <div className="relative mx-auto mb-8 h-56 w-56 sm:h-64 sm:w-64">
                    <Image
                        src="/crying.png"
                        alt="Crying mascot"
                        fill
                        className="object-contain drop-shadow-2xl"
                        priority
                        sizes="(max-width: 640px) 224px, 256px"
                    />
                </div>

                <h1 className="mb-8 text-2xl sm:text-3xl font-semibold text-white">
                    are you lost flying ?
                </h1>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link
                        href="/"
                        className="group relative px-8 py-3.5 bg-primary text-white font-semibold rounded-full text-lg overflow-hidden transition-all duration-300 hover:shadow-glow-white"
                    >
                        <span className="relative z-10">Go Home</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-primary-dark to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </Link>
                    <button
                        onClick={() => router.back()}
                        className="px-8 py-3.5 bg-white/5 text-white font-semibold rounded-full text-lg border-2 border-primary/60 hover:border-primary hover:bg-primary/10 transition-all duration-300"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        </main>
    );
}
