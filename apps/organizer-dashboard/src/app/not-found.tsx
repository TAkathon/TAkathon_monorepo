"use client";

import Link from "next/link";
import { ShieldAlert, ArrowLeft, Zap } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-500/5 rounded-full blur-[120px] pointer-events-none"></div>
      
      <div className="max-w-md w-full text-center relative z-10">
        <div className="mb-8 flex justify-center">
            <div className="w-20 h-20 bg-primary/10 border border-primary/20 rounded-sm flex items-center justify-center relative">
                <ShieldAlert className="w-10 h-10 text-primary animate-pulse" />
                <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-primary/50"></div>
                <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-primary/50"></div>
            </div>
        </div>

        <h1 className="text-8xl font-black italic tracking-tighter text-white mb-2 leading-none">
            404
        </h1>
        <div className="flex items-center justify-center gap-2 mb-6">
            <div className="h-px bg-white/10 flex-1"></div>
            <span className="text-[10px] text-primary/60 font-black uppercase tracking-[0.3em]">SECTOR SIGNAL LOST</span>
            <div className="h-px bg-white/10 flex-1"></div>
        </div>

        <p className="text-[11px] text-white/40 font-bold uppercase tracking-widest leading-relaxed mb-10 max-w-[280px] mx-auto">
            THE REQUESTED COORDINATES DO NOT EXIST WITHIN THE ACTIVE COMMAND RADIUS.
        </p>

        <Link
          href="/"
          className="group relative inline-flex items-center gap-3 px-10 py-4 bg-primary text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-sm hover:bg-primary-dark transition-all shadow-glow-sm overflow-hidden"
        >
          <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500"></div>
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>RETURN TO HQ</span>
        </Link>

        {/* Tactical Footer */}
        <div className="mt-16 flex items-center justify-center gap-4 opacity-20">
            <div className="w-1 h-1 bg-white rounded-full"></div>
            <div className="w-16 h-[1px] bg-white"></div>
            <Zap className="w-3 h-3 text-white" />
            <div className="w-16 h-[1px] bg-white"></div>
            <div className="w-1 h-1 bg-white rounded-full"></div>
        </div>
      </div>
    </div>
  );
}
