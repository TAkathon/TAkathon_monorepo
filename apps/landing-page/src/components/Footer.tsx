"use client";

export default function Footer() {
    return (
        <>
            {/* Bottom Bar */}
            <div className="bg-background-dark border-t border-white/5 py-6 px-8 relative z-10">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-[8px] text-zinc-600 tracking-widest uppercase">
                        © 2024 TAKATHON TUNISIA. OPERATION SECURED. PRIVACY PROTOCOL / TERMS OF ENGAGEMENT
                    </p>
                    <div className="flex items-center gap-4">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        <span className="text-[8px] font-bold tracking-widest text-zinc-400 uppercase">
                            SYSTEM ONLINE
                        </span>
                    </div>
                </div>
            </div>

            {/* Fixed Bottom Pill */}
            <div className="fixed bottom-0 left-0 right-0 p-6 flex justify-between items-center z-50 pointer-events-none">
                <div className="flex items-center gap-4 bg-black/50 backdrop-blur-xl px-4 py-2 rounded-full border border-white/10 pointer-events-auto">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    <span className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase">
                        ACTIF PLAYERS : 73
                    </span>
                </div>
            </div>
        </>
    );
}
