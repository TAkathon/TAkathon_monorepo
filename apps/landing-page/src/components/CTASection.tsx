"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Rocket, Users } from "lucide-react";

export default function CTASection() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

    return (
        <section
            id="cta"
            ref={sectionRef}
            className="relative py-24 sm:py-32 overflow-hidden"
        >
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-dark to-dark-50" />

            {/* Radial glow */}
            <div className="absolute inset-0 bg-hero-gradient opacity-20" />

            <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.7 }}
                >
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                        Ready to Launch Your Next{" "}
                        <span className="text-primary text-glow-sm">Hackathon</span>?
                    </h2>
                    <p className="text-white/50 text-lg mb-10 max-w-xl mx-auto">
                        Join the growing community of student innovators and hackathon
                        organizers across Tunisia.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.98 }}
                            className="group flex items-center gap-2 px-8 py-4 bg-primary text-white font-semibold rounded-full text-lg hover:shadow-glow-white transition-shadow duration-300"
                        >
                            <Rocket className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                            Host a Hackathon
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex items-center gap-2 px-8 py-4 bg-white/5 text-white font-semibold rounded-full text-lg border-2 border-primary/50 hover:border-primary hover:bg-primary/10 transition-all duration-300"
                        >
                            <Users className="w-5 h-5" />
                            Participate in a Hackathon
                        </motion.button>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
