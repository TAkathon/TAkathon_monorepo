"use client";

import { useState, FormEvent } from "react";
import {
    Github,
    Linkedin,
    Instagram,
    Mail,
    Send,
    Heart,
} from "lucide-react";

const footerLinks = {
    Product: [
        { label: "Features", href: "#audience" },
        { label: "How it Works", href: "#workflow" },
        { label: "For Organizers", href: "#audience" },
        { label: "Pricing", href: "#" },
    ],
    Company: [
        { label: "About Us", href: "#" },
        { label: "Blog", href: "#" },
        { label: "Careers", href: "#" },
        { label: "Contact", href: "#contact" },
    ],
    Legal: [
        { label: "Privacy Policy", href: "#" },
        { label: "Terms of Service", href: "#" },
        { label: "Cookie Policy", href: "#" },
    ],
};

const socialLinks = [
    { icon: Github, href: "https://github.com/TAkathon", label: "GitHub" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Mail, href: "mailto:contact@takathon.tn", label: "Email" },
];

export default function Footer() {
    const [email, setEmail] = useState("");
    const [subscribed, setSubscribed] = useState(false);

    const handleSubscribe = (e: FormEvent) => {
        e.preventDefault();
        if (email) {
            setSubscribed(true);
            setEmail("");
            setTimeout(() => setSubscribed(false), 3000);
        }
    };

    return (
        <footer className="relative pt-16 pb-8 border-t border-white/[0.06]">
            <div className="absolute inset-0 bg-dark" />

            <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
                {/* Main footer grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
                    {/* Link columns */}
                    {Object.entries(footerLinks).map(([title, links]) => (
                        <div key={title}>
                            <h4 className="text-sm font-semibold text-white/80 uppercase tracking-wider mb-4">
                                {title}
                            </h4>
                            <ul className="space-y-3">
                                {links.map((link) => (
                                    <li key={link.label}>
                                        <a
                                            href={link.href}
                                            className="text-sm text-white/40 hover:text-primary transition-colors duration-200"
                                        >
                                            {link.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}

                    {/* Newsletter column */}
                    <div>
                        <h4 className="text-sm font-semibold text-white/80 uppercase tracking-wider mb-4">
                            Newsletter
                        </h4>
                        <p className="text-sm text-white/40 mb-4">
                            Stay updated with hackathon news and platform updates.
                        </p>
                        <form onSubmit={handleSubscribe} className="flex gap-2">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="your@email.com"
                                required
                                className="flex-1 px-3 py-2 bg-white/[0.05] border border-white/10 rounded-lg text-white placeholder-white/30 text-xs outline-none input-focus-glow transition-all duration-300"
                            />
                            <button
                                type="submit"
                                className="p-2 bg-primary rounded-lg hover:bg-primary-dark transition-colors duration-200 flex-shrink-0"
                                aria-label="Subscribe to newsletter"
                            >
                                {subscribed ? (
                                    <span className="text-xs text-white">✓</span>
                                ) : (
                                    <Send className="w-3.5 h-3.5 text-white" />
                                )}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Social links */}
                <div className="flex items-center justify-center gap-4 mb-8">
                    {socialLinks.map((social) => (
                        <a
                            key={social.label}
                            href={social.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={social.label}
                            className="w-10 h-10 rounded-full bg-white/[0.05] border border-white/[0.08] flex items-center justify-center hover:bg-primary/20 hover:border-primary/30 transition-all duration-300"
                        >
                            <social.icon className="w-4 h-4 text-white/60 hover:text-white transition-colors" />
                        </a>
                    ))}
                </div>

                {/* Bottom bar */}
                <div className="pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-white/30">
                        © {new Date().getFullYear()} TAKATHON. All rights reserved.
                    </p>
                    <p className="text-xs text-white/40 flex items-center gap-1">
                        Built with <Heart className="w-3 h-3 text-primary inline" /> by
                        Tunisian Students
                    </p>
                </div>
            </div>
        </footer>
    );
}
