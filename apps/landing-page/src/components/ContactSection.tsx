"use client";

import { useState, useRef, FormEvent } from "react";
import NextImage from "next/image";
import { motion, useInView } from "framer-motion";
import { Send, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { submitContactForm } from "@/lib/api";

type FormStatus = "idle" | "loading" | "success" | "error";

export default function ContactSection() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(sectionRef, { once: true, amount: 0.3 });

    const [status, setStatus] = useState<FormStatus>("idle");
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        message: "",
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setStatus("loading");

        try {
            await submitContactForm(formData);
            setStatus("success");
            setFormData({ firstName: "", lastName: "", email: "", phone: "", message: "" });
        } catch {
            setStatus("error");
        }

        // Reset status after 4 seconds
        setTimeout(() => setStatus("idle"), 4000);
    };

    return (
        <section
            id="contact"
            ref={sectionRef}
            className="relative py-24 sm:py-32 overflow-hidden"
        >
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-dark-50 via-dark to-dark" />

            <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Left: Form */}
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.7 }}
                    >
                        <div className="glass rounded-2xl p-8 sm:p-10">
                            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                                Let&apos;s Fly Together!
                            </h2>
                            <p className="text-white/40 text-sm mb-8">
                                Partner with TAKATHON
                            </p>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                {/* Name row */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="relative">
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleChange}
                                            placeholder="Last Name"
                                            required
                                            className="w-full px-4 py-3 bg-white/[0.05] border border-white/10 rounded-xl text-white placeholder-white/30 text-sm input-focus-glow outline-none transition-all duration-300"
                                        />
                                    </div>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            placeholder="First Name"
                                            required
                                            className="w-full px-4 py-3 bg-white/[0.05] border border-white/10 rounded-xl text-white placeholder-white/30 text-sm input-focus-glow outline-none transition-all duration-300"
                                        />
                                    </div>
                                </div>

                                {/* Email */}
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Email"
                                    required
                                    className="w-full px-4 py-3 bg-white/[0.05] border border-white/10 rounded-xl text-white placeholder-white/30 text-sm input-focus-glow outline-none transition-all duration-300"
                                />

                                {/* Phone */}
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="Phone Number"
                                    className="w-full px-4 py-3 bg-white/[0.05] border border-white/10 rounded-xl text-white placeholder-white/30 text-sm input-focus-glow outline-none transition-all duration-300"
                                />

                                {/* Message */}
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    placeholder="Message"
                                    rows={4}
                                    required
                                    className="w-full px-4 py-3 bg-white/[0.05] border border-white/10 rounded-xl text-white placeholder-white/30 text-sm input-focus-glow outline-none transition-all duration-300 resize-none"
                                />

                                {/* Submit Button */}
                                <motion.button
                                    type="submit"
                                    disabled={status === "loading"}
                                    whileHover={status === "idle" ? { scale: 1.02 } : {}}
                                    whileTap={status === "idle" ? { scale: 0.98 } : {}}
                                    className={`w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-white transition-all duration-300 ${status === "success"
                                        ? "bg-emerald-500"
                                        : status === "error"
                                            ? "bg-red-500"
                                            : "bg-primary hover:bg-primary-dark"
                                        }`}
                                >
                                    {status === "idle" && (
                                        <>
                                            <span>Let&apos;s Fly</span>
                                            <Send className="w-4 h-4" />
                                        </>
                                    )}
                                    {status === "loading" && (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            <span>Sending...</span>
                                        </>
                                    )}
                                    {status === "success" && (
                                        <>
                                            <CheckCircle className="w-4 h-4" />
                                            <span>Message Sent!</span>
                                        </>
                                    )}
                                    {status === "error" && (
                                        <>
                                            <AlertCircle className="w-4 h-4" />
                                            <span>Try Again</span>
                                        </>
                                    )}
                                </motion.button>
                            </form>
                        </div>
                    </motion.div>

                    {/* Right: Phoenix / Falcon image with breathe animation */}
                    <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.7, delay: 0.2 }}
                        className="relative hidden lg:flex items-center justify-center"
                    >
                        <div className="relative w-96 h-96">
                            {/* Glow behind */}
                            <div className="absolute inset-[-10%] rounded-full bg-gradient-radial from-primary/30 to-transparent animate-breathe" />

                            {/* Decorative Phoenix rings */}
                            <div className="absolute inset-4 rounded-full border border-primary/20 animate-breathe" />
                            <div
                                className="absolute inset-10 rounded-full border border-primary/10"
                                style={{ animationDelay: "1s" }}
                            />

                            {/* Mascot Image with floating animation */}
                            <motion.div
                                animate={{ y: [0, -8, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute inset-0 flex items-center justify-center p-8"
                            >
                                <NextImage
                                    src="/mascot.png"
                                    alt="TAKATHON Falcon Mascot"
                                    fill
                                    className="object-contain drop-shadow-2xl brightness-110"
                                    sizes="(max-width: 768px) 100vw, 384px"
                                />
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
