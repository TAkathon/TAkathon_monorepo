"use client";

import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { GraduationCap, ClipboardList, Briefcase, X } from "lucide-react";

const audiences = [
    {
        icon: GraduationCap,
        title: "For Students",
        description:
            "Stop searching for teams and start building them. Get matched with compatible teammates based on your skills, experience, and availability.",
        extendedDescription:
            "Join a vibrant community of innovators! As a student, you'll have access to mentorship from industry experts, workshops to sharpen your skills, and the chance to win amazing prizes. Whether you're a coder, designer, or business enthusiast, there's a place for you to shine and launch your career.",
        features: ["Skill-based matching", "Team invitations", "AI suggestions"],
        gradient: "from-primary/20 via-primary-dark/10 to-transparent",
    },
    {
        icon: ClipboardList,
        title: "For Organizers",
        description:
            "Eliminate the administrative chaos and focus on the innovation. Get a structured overview of all participants, teams, and progress.",
        extendedDescription:
            "Streamline your hackathon management with our comprehensive toolkit. Track registration numbers in real-time, manage team formations effortlessly, and communicate updates instantly to all participants. Our platform handles the logistics so you can focus on creating an unforgettable experience.",
        features: ["Dashboard overview", "Team management", "Export data"],
        gradient: "from-orange-500/15 via-amber-600/10 to-transparent",
    },
    {
        icon: Briefcase,
        title: "For Sponsors",
        description:
            "Invest your money in a framework. Find top teams, showcase your brand, and discover the next generation of talent in Tunisia.",
        extendedDescription:
            "Connect with the brightest minds and future leaders. Sponsoring TAKATHON isn't just about brand visibility; it's about direct engagement with top talent. Get access to detailed analytics on participant demographics, judge projects, and host exclusive side-events to showcase your company culture.",
        features: ["Talent discovery", "Brand visibility", "Team analytics"],
        gradient: "from-yellow-500/15 via-orange-500/10 to-transparent",
    },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

export default function AudienceSection() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
    const [selectedAudience, setSelectedAudience] = useState<(typeof audiences)[0] | null>(null);

  return (
    <section
      id="audience"
      ref={sectionRef}
      className="relative py-24 sm:py-32 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-dark-100 via-dark to-dark" />

            <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
                {/* Title */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
                        Who is <span className="text-primary">TAKATHON</span> Built For?
                    </h2>
                    <p className="text-white/50 text-lg max-w-xl mx-auto">
                        Every stakeholder in the hackathon ecosystem benefits from a
                        structured, data-driven approach.
                    </p>
                </motion.div>

                {/* Cards */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    className="grid grid-cols-1 md:grid-cols-3 gap-6"
                >
                    {audiences.map((item, i) => (
                        <motion.div
                            key={i}
                            variants={cardVariants}
                            className="group relative rounded-2xl border border-white/[0.1] hover:border-primary/30 bg-white/[0.02] overflow-hidden transition-all duration-500 hover:shadow-glow flex flex-col h-full"
                        >
                            {/* Internal mesh gradient */}
                            <div
                                className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                            />

                            <div className="relative p-6 sm:p-8 flex flex-col h-full">
                                {/* Icon */}
                                <div className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-5 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                                    <item.icon className="w-7 h-7 text-primary" />
                                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-white mb-3">
                  {item.title}
                </h3>

                                {/* Description */}
                                <p className="text-white/50 text-sm leading-relaxed mb-5 flex-grow">
                                    {item.description}
                                </p>

                                {/* Feature tags */}
                                <div className="flex flex-wrap gap-2 mb-5">
                                    {item.features.map((feature, j) => (
                                        <span
                                            key={j}
                                            className="px-3 py-1 text-xs text-primary/80 bg-primary/[0.08] rounded-full border border-primary/10"
                                        >
                                            {feature}
                                        </span>
                                    ))}
                                </div>

                                {/* See More button - pushed to bottom */}
                                <button
                                    onClick={() => setSelectedAudience(item)}
                                    className="mt-auto text-sm text-primary/70 group-hover:text-primary transition-colors duration-300 flex items-center gap-1 cursor-pointer hover:gap-2"
                                >
                                    See More <span>→</span>
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>

            {/* Modal */}
            <AnimatePresence>
                {selectedAudience && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedAudience(null)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />

                        {/* Modal Content */}
                        <motion.div
                            layoutId={`card-${selectedAudience.title}`}
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="relative w-full max-w-lg bg-[#0F0F1A] border border-primary/20 rounded-2xl p-6 sm:p-8 shadow-2xl overflow-hidden"
                        >
                            {/* Gradient Background */}
                            <div
                                className={`absolute inset-0 bg-gradient-to-br ${selectedAudience.gradient} opacity-20 pointer-events-none`}
                            />

                            {/* Close Button */}
                            <button
                                onClick={() => setSelectedAudience(null)}
                                className="absolute top-4 right-4 p-2 text-white/50 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-colors z-10"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <div className="relative z-10">
                                {/* Header */}
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-12 h-12 rounded-xl bg-primary/20 border border-primary/20 flex items-center justify-center">
                                        <selectedAudience.icon className="w-6 h-6 text-primary" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white">
                                        {selectedAudience.title}
                                    </h3>
                                </div>

                                {/* Extended Description */}
                                <div className="prose prose-invert max-w-none">
                                    <p className="text-white/80 text-base leading-relaxed">
                                        {selectedAudience.extendedDescription}
                                    </p>
                                </div>

                                {/* Features List in Modal */}
                                <div className="mt-8">
                                    <h4 className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">
                                        Key Benefits
                                    </h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {selectedAudience.features.map((feature, idx) => (
                                            <div
                                                key={idx}
                                                className="flex items-center gap-2 text-white/70 text-sm"
                                            >
                                                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                                {feature}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Action Button */}
                                <button
                                    onClick={() => setSelectedAudience(null)}
                                    className="w-full mt-8 py-3 px-4 bg-primary hover:bg-primary-dark text-black font-semibold rounded-xl transition-colors duration-300"
                                >
                                    Close Details
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </section>
    );
}
