"use client";

import {
    Github,
    Linkedin,
    Instagram,
    Mail,
    Heart,
} from "lucide-react";

const socialLinks = [
    { icon: Github, href: "https://github.com/TAkathon", label: "GitHub" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Mail, href: "mailto:contact@takathon.tn", label: "Email" },
];

export default function Footer() {
    return (
        <footer className="relative py-12 border-t border-white/[0.06] overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-dark pointer-events-none" />

            <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 flex flex-col items-center">

                {/* Social links */}
                <div className="flex items-center justify-center gap-6 mb-8">
                    {socialLinks.map((social) => (
                        <a
                            key={social.label}
                            href={social.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={social.label}
                            className="w-12 h-12 rounded-full bg-white/[0.05] border border-white/[0.08] flex items-center justify-center hover:bg-primary/20 hover:border-primary/30 hover:scale-110 transition-all duration-300 group"
                        >
                            <social.icon className="w-5 h-5 text-white/60 group-hover:text-white transition-colors" />
                        </a>
                    ))}
                </div>

                {/* Divider */}
                <div className="w-full max-w-xs h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-8" />

                {/* Bottom info */}
                <div className="flex flex-col items-center gap-3 text-center">
                    <p className="text-sm text-white/40 flex items-center gap-1.5">
                        Built with <Heart className="w-4 h-4 text-primary fill-primary/20 animate-pulse" /> by
                        <span className="text-white/70 font-medium">Tunisian Students</span>
                    </p>
                    <p className="text-xs text-white/30">
                        © {new Date().getFullYear()} TAKATHON. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
