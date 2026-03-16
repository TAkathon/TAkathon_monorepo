"use client";

import Link from "next/link";

export default function CTASection() {
    return (
        <section className="bg-vibrantOrange py-48 px-8 relative overflow-hidden flex flex-col items-center justify-center">
            {/* Floating Elements */}
            <div className="absolute top-[10%] left-[5%] floating-fast rotate-12 z-0">
                <div className="w-24 h-24 bg-black rounded-xl rotate-12 flex items-center justify-center border-4 border-white shadow-2xl overflow-hidden">
                    <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67zM11.71 19c-1.78 0-3.22-1.4-3.22-3.14 0-1.62 1.05-2.76 2.81-3.12 1.77-.36 3.6-1.21 4.62-2.58.39 1.29.59 2.65.59 4.04 0 2.65-2.15 4.8-4.8 4.8z" />
                    </svg>
                </div>
            </div>

            <div className="absolute bottom-[10%] right-[5%] floating-delayed -rotate-12 z-0">
                <div className="w-24 h-24 bg-white rounded-xl -rotate-12 flex items-center justify-center border-4 border-black shadow-2xl">
                    <svg className="w-16 h-16 text-black" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2z" />
                    </svg>
                </div>
            </div>

            <div className="absolute top-[20%] right-[10%] floating rotate-[45deg] z-0">
                <div className="w-16 h-16 bg-black flex items-center justify-center rounded shadow-xl border border-white/20">
                    <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM7.5 18c-.83 0-1.5-.67-1.5-1.5S6.67 15 7.5 15s1.5.67 1.5 1.5S8.33 18 7.5 18zm0-9C6.67 9 6 8.33 6 7.5S6.67 6 7.5 6 9 6.67 9 7.5 8.33 9 7.5 9zm4.5 4.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm4.5 4.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm0-9c-.83 0-1.5-.67-1.5-1.5S15.67 6 16.5 6s1.5.67 1.5 1.5S17.33 9 16.5 9z" />
                    </svg>
                </div>
            </div>

            <div className="absolute bottom-[20%] left-[12%] floating-fast z-0">
                <div className="p-4 bg-white rounded-lg border-2 border-black/10 shadow-2xl -rotate-6">
                    <svg className="w-8 h-8 text-black" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20 18c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2H0v2h24v-2h-4zM4 6h16v10H4V6z" />
                    </svg>
                </div>
            </div>

            <div className="absolute top-[5%] right-[30%] floating-delayed z-0 opacity-20">
                <svg className="w-20 h-20 text-black" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 17.59L7.41 19 12 14.42 16.59 19 18 17.59l-6-6z M6 11l1.41 1.41L12 7.83l4.59 4.58L18 11l-6-6z" />
                </svg>
            </div>

            {/* Main Content */}
            <div className="relative z-10 text-center max-w-5xl">
                <div className="flex items-center justify-center gap-2 text-[12px] font-black tracking-[0.4em] text-black mb-6">
                    ■ TAKATHON
                </div>
                <h2 className="huge-title text-6xl md:text-[140px] text-black mb-12 tight-kern leading-[0.85]">
                    READY TO<br />LAUNCH
                </h2>
                <div className="flex justify-center">
                    <Link
                        href="/signup"
                        className="px-12 py-4 bg-black text-white font-black tracking-widest text-[14px] border-2 border-black hover:bg-white hover:text-black transition-all uppercase flex items-center gap-2 shadow-[0_10px_30px_rgba(0,0,0,0.3)]"
                    >
                        EXPLORE
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                        </svg>
                    </Link>
                </div>
            </div>
        </section>
    );
}
