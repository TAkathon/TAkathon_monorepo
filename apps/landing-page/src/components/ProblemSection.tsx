"use client";

export default function ProblemSection() {
    return (
        <section id="problems" className="bg-[#050505] py-32 overflow-hidden relative">
            <div className="max-w-7xl mx-auto px-8">
                {/* Section Header */}
                <div className="text-center mb-16 relative z-10">
                    <div className="flex items-center justify-center gap-2 text-[10px] font-black tracking-[0.3em] text-primary mb-6">
                        <span className="w-2 h-2 bg-primary"></span> CHALLENGES
                    </div>
                    <h2 className="huge-title text-4xl md:text-6xl lg:text-7xl text-white leading-[0.9] mb-8">
                        PROBLEMS IN TUNISIAN HACKATHONS
                    </h2>
                </div>

                {/* Center Bug Icon */}
                <div className="relative w-full flex justify-center mb-12 floating">
                    <div className="w-64 h-64 md:w-80 md:h-80 bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 rounded-full blur-3xl absolute opacity-30"></div>
                    <div className="relative z-10 p-6">
                        {/* Bug Report Icon */}
                        <svg className="w-48 h-48 md:w-64 md:h-64 text-white drop-shadow-[8px_8px_0px_#FF5C00] rotate-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20 8h-2.81c-.45-.78-1.07-1.45-1.82-1.96L17 4.41 15.59 3l-2.17 2.17C12.96 5.06 12.49 5 12 5c-.49 0-.96.06-1.41.17L8.41 3 7 4.41l1.62 1.63C7.88 6.55 7.26 7.22 6.81 8H4v2h2.09c-.05.33-.09.66-.09 1v1H4v2h2v1c0 .34.04.67.09 1H4v2h2.81c1.04 1.79 2.97 3 5.19 3s4.15-1.21 5.19-3H20v-2h-2.09c.05-.33.09-.66.09-1v-1h2v-2h-2v-1c0-.34-.04-.67-.09-1H20V8zm-6 8h-4v-2h4v2zm0-4h-4v-2h4v2z" />
                        </svg>
                        {/* Warning badge */}
                        <div className="absolute top-10 right-0 animate-bounce">
                            <svg className="w-12 h-12 text-yellow-400 drop-shadow-[4px_4px_0px_#000]" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
                            </svg>
                        </div>
                        {/* Error badge */}
                        <div className="absolute bottom-10 left-0 animate-bounce" style={{ animationDelay: "150ms" }}>
                            <svg className="w-10 h-10 text-red-500 drop-shadow-[4px_4px_0px_#000] -rotate-12" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Cards */}
                <div className="relative flex flex-col md:flex-row justify-center items-center gap-8 md:gap-4 md:h-[500px] w-full max-w-5xl mx-auto" style={{ perspective: "1000px" }}>
                    {/* Blue Card - Random Team Formation */}
                    <div className="cartoon-card bg-[#3B82F6] p-2 rounded-xl group cursor-pointer w-full md:w-72 md:absolute md:left-0 md:top-20 md:-rotate-6 hover:rotate-0 hover:z-30 transition-all duration-300">
                        <div className="card-inner-border bg-[#2563EB] rounded-lg p-6 h-full flex flex-col items-center text-center">
                            <div className="mb-4 relative h-24 w-full flex items-center justify-center">
                                <div className="relative flex items-center justify-center gap-1">
                                    <svg className="w-16 h-16 text-white drop-shadow-[3px_3px_0px_#1e3a8a]" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M20.5 11H19V7c0-1.1-.9-2-2-2h-4V3.5C13 2.12 11.88 1 10.5 1S8 2.12 8 3.5V5H4c-1.1 0-1.99.9-1.99 2v3.8H3.5c1.49 0 2.7 1.21 2.7 2.7s-1.21 2.7-2.7 2.7H2V20c0 1.1.9 2 2 2h3.8v-1.5c0-1.49 1.21-2.7 2.7-2.7 1.49 0 2.7 1.21 2.7 2.7V22H17c1.1 0 2-.9 2-2v-4h1.5c1.38 0 2.5-1.12 2.5-2.5S21.88 11 20.5 11z" />
                                    </svg>
                                    <svg className="w-8 h-8 text-yellow-400 absolute -top-2 -right-2 drop-shadow-[2px_2px_0px_#1e3a8a] rotate-12" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z" />
                                    </svg>
                                </div>
                            </div>
                            <div className="mt-auto">
                                <h3 className="font-archivo text-lg mb-2 text-white leading-tight drop-shadow-[2px_2px_0px_rgba(0,0,0,0.5)] uppercase">
                                    Random Team Formation
                                </h3>
                                <p className="text-blue-100 text-xs leading-relaxed font-bold">
                                    Skills mismatch leading to chaos.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Red Card - Manual Google Forms */}
                    <div className="cartoon-card bg-[#EF4444] p-2 rounded-xl group cursor-pointer w-full md:w-72 md:absolute md:left-1/2 md:-translate-x-1/2 md:top-0 md:rotate-3 hover:rotate-0 hover:z-30 transition-all duration-300 z-20">
                        <div className="card-inner-border bg-[#DC2626] rounded-lg p-6 h-full flex flex-col items-center text-center">
                            <div className="mb-4 relative h-24 w-full flex items-center justify-center">
                                <div className="relative">
                                    <svg className="w-16 h-16 text-white drop-shadow-[3px_3px_0px_#7f1d1d]" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
                                    </svg>
                                    <div className="absolute -bottom-1 -right-1 bg-yellow-400 p-1 border-2 border-red-900 rounded rotate-12">
                                        <svg className="w-3 h-3 text-red-900" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-auto">
                                <h3 className="font-archivo text-lg mb-2 text-white leading-tight drop-shadow-[2px_2px_0px_rgba(0,0,0,0.5)] uppercase">
                                    Manual Google Forms
                                </h3>
                                <p className="text-red-100 text-xs leading-relaxed font-bold">
                                    Messy data, outdated process.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Green Card - Fragmented Talent Data */}
                    <div className="cartoon-card bg-[#10B981] p-2 rounded-xl group cursor-pointer w-full md:w-72 md:absolute md:right-0 md:top-24 md:rotate-12 hover:rotate-0 hover:z-30 transition-all duration-300">
                        <div className="card-inner-border bg-[#059669] rounded-lg p-6 h-full flex flex-col items-center text-center">
                            <div className="mb-4 relative h-24 w-full flex items-center justify-center">
                                <div className="relative">
                                    <svg className="w-16 h-16 text-white drop-shadow-[3px_3px_0px_#064e3b]" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M20 2H4c-1 0-2 .9-2 2v3.01c0 .72.43 1.34 1 1.69V20c0 1.1 1.1 2 2 2h14c.9 0 2-.9 2-2V8.7c.57-.35 1-.97 1-1.69V4c0-1.1-1-2-2-2zm-5 12H9v-2h6v2zm5-7H4V4h16v3z" />
                                    </svg>
                                    <svg className="w-8 h-8 text-yellow-300 absolute -top-1 -left-1 drop-shadow-[2px_2px_0px_#064e3b] -rotate-[15deg]" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M16.5 3c-.96 0-1.9.25-2.73.69L12 9h3l-3 10 1-7h-3l1.54-5.39C10.47 7.58 9.5 8.94 9.5 10.5c0 2.21 1.79 4 4 4h.5L12 21l2.25-7.54c1.69-.35 3.25-1.56 3.25-3.46 0-1.87-1.27-3.43-3-3.87V3h2z" />
                                    </svg>
                                </div>
                            </div>
                            <div className="mt-auto">
                                <h3 className="font-archivo text-lg mb-2 text-white leading-tight drop-shadow-[2px_2px_0px_rgba(0,0,0,0.5)] uppercase">
                                    Fragmented Talent Data
                                </h3>
                                <p className="text-emerald-100 text-xs leading-relaxed font-bold">
                                    Achievements lost in the void.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
