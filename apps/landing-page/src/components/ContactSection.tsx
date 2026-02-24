"use client";

import { useState } from "react";

export default function ContactSection() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    return (
        <footer id="contact" className="bg-background-dark py-32 px-8 border-t border-white/5 relative overflow-hidden">
            <div className="max-w-7xl mx-auto relative z-10">
                {/* Big Title */}
                <div className="mb-20">
                    <h2 className="huge-title text-7xl md:text-[140px] text-white leading-none mb-4 tight-kern">
                        CONTACT US
                    </h2>
                </div>

                {/* Two Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start mb-24">
                    {/* Left Column */}
                    <div className="flex flex-col gap-8">
                        <div className="relative group">
                            <h2 className="section-title text-4xl mb-4 text-white uppercase">
                                STAY NETWORKED
                            </h2>
                            <div className="w-24 h-1 bg-primary mb-6"></div>
                            <p className="text-zinc-500 text-sm font-bold tracking-widest uppercase max-w-md leading-relaxed">
                                Initialize direct communication protocols. Our team is standing by to respond to your transmission from the command center.
                            </p>
                        </div>

                        {/* Social Links */}
                        <div className="flex flex-col gap-4">
                            <h4 className="text-xs font-black tracking-[0.2em] text-primary uppercase">
                                Social Nodes
                            </h4>
                            <div className="flex gap-4">
                                <a href="#" className="w-12 h-12 bg-white/5 flex items-center justify-center rounded-sm hover:bg-primary transition-all text-white border border-white/10 hover:border-primary group">
                                    <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
                                    </svg>
                                </a>
                                <a href="#" className="w-12 h-12 bg-white/5 flex items-center justify-center rounded-sm hover:bg-primary transition-all text-white border border-white/10 hover:border-primary group">
                                    <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
                                    </svg>
                                </a>
                                <a href="#" className="w-12 h-12 bg-white/5 flex items-center justify-center rounded-sm hover:bg-primary transition-all text-white border border-white/10 hover:border-primary group">
                                    <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 2v.01L12 13 4 6.01V6h16zM4 18V8.37l7.47 6.5c.32.28.79.28 1.11 0L20 8.37V18H4z" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Terminal Box */}
                    <div className="terminal-box p-8 rounded-lg relative overflow-hidden">
                        {/* Traffic Light Dots */}
                        <div className="absolute top-0 left-0 w-full h-8 bg-zinc-900/50 border-b border-primary/30 flex items-center px-4 justify-between">
                            <div className="flex gap-1.5">
                                <div className="w-2.5 h-2.5 rounded-full bg-red-500/50"></div>
                                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50"></div>
                                <div className="w-2.5 h-2.5 rounded-full bg-green-500/50"></div>
                            </div>
                            <div className="text-[8px] font-mono text-primary/50 tracking-widest">
                                TRANSMISSION_PROTOCOL_V2.0
                            </div>
                        </div>

                        {/* Background Icon */}
                        <div className="absolute top-4 right-4 opacity-10">
                            <svg className="w-20 h-20 text-primary" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M17 1H7c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-2-2-2zm0 18H7V5h10v14z" />
                            </svg>
                        </div>

                        {/* Form */}
                        <form className="flex flex-col gap-6 mt-6" onSubmit={(e) => e.preventDefault()}>
                            <div className="relative group">
                                <label className="text-[10px] font-mono text-primary mb-1 block">
                                    IDENTIFICATION_EMAIL
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-primary text-xs font-mono">
                                        &gt;
                                    </span>
                                    <input
                                        className="w-full bg-black/50 border border-zinc-800 px-8 py-4 text-sm tracking-widest focus:outline-none focus:border-primary text-green-400 font-mono glitch-placeholder uppercase transition-all"
                                        placeholder="USER@DOMAIN.COM"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="relative group">
                                <label className="text-[10px] font-mono text-primary mb-1 block">
                                    MESSAGE_PAYLOAD
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-4 text-primary text-xs font-mono">
                                        &gt;
                                    </span>
                                    <textarea
                                        className="w-full bg-black/50 border border-zinc-800 px-8 py-4 text-sm tracking-widest focus:outline-none focus:border-primary text-green-400 h-40 resize-none font-mono glitch-placeholder uppercase transition-all"
                                        placeholder="START_TYPING_YOUR_DATA_HERE..."
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-between gap-6 pt-2">
                                <button className="bg-primary text-black px-12 py-4 font-black text-sm tracking-[0.2em] uppercase hover:bg-white transition-all border-2 border-primary relative group flex items-center gap-4 overflow-hidden">
                                    <span className="relative z-10">CONNECT</span>
                                    <svg className="w-4 h-4 relative z-10" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M11 21h-1l1-7H7.5c-.58 0-.57-.32-.38-.66.19-.34.05-.08.07-.12C8.48 10.94 10.42 7.54 13 3h1l-1 7h3.5c.49 0 .56.33.47.51l-.07.15C12.96 17.55 11 21 11 21z" />
                                    </svg>
                                    <div className="absolute inset-0 bg-white translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
                                </button>

                                <div className="hidden sm:flex items-center gap-4">
                                    <svg className="w-24 h-10 stroke-primary/50" fill="none" viewBox="0 0 100 40">
                                        <path
                                            className="arrow-draw"
                                            d="M 0,20 L 70,20 M 60,10 L 70,20 L 60,30"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                        />
                                    </svg>
                                    <span className="text-[10px] font-mono text-primary animate-pulse">
                                        TX_READY
                                    </span>
                                </div>
                            </div>
                        </form>

                        {/* Status Bar */}
                        <div className="mt-8 pt-6 border-t border-zinc-900 flex justify-between items-center text-[8px] font-mono text-zinc-600">
                            <span>LATENCY: 12ms</span>
                            <span>SECURE_CONNECTION: AES-256</span>
                            <span>STATUS: ACTIVE</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
