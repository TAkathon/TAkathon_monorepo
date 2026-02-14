"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { GraduationCap, ClipboardList, Briefcase } from "lucide-react";

const audiences = [
  {
    icon: GraduationCap,
    title: "For Students",
    description:
      "Stop searching for teams and start building them. Get matched with compatible teammates based on your skills, experience, and availability.",
    features: ["Skill-based matching", "Team invitations", "AI suggestions"],
    gradient: "from-primary/20 via-primary-dark/10 to-transparent",
  },
  {
    icon: ClipboardList,
    title: "For Organizers",
    description:
      "Eliminate the administrative chaos and focus on the innovation. Get a structured overview of all participants, teams, and progress.",
    features: ["Dashboard overview", "Team management", "Export data"],
    gradient: "from-orange-500/15 via-amber-600/10 to-transparent",
  },
  {
    icon: Briefcase,
    title: "For Sponsors",
    description:
      "Invest your money in a framework. Find top teams, showcase your brand, and discover the next generation of talent in Tunisia.",
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
              className="group relative rounded-2xl border border-white/[0.1] hover:border-primary/30 bg-white/[0.02] overflow-hidden transition-all duration-500 hover:shadow-glow"
            >
              {/* Internal mesh gradient */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
              />

              <div className="relative p-6 sm:p-8">
                {/* Icon */}
                <div className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-5 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                  <item.icon className="w-7 h-7 text-primary" />
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-white mb-3">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="text-white/50 text-sm leading-relaxed mb-5">
                  {item.description}
                </p>

                {/* Feature tags */}
                <div className="flex flex-wrap gap-2">
                  {item.features.map((feature, j) => (
                    <span
                      key={j}
                      className="px-3 py-1 text-xs text-primary/80 bg-primary/[0.08] rounded-full border border-primary/10"
                    >
                      {feature}
                    </span>
                  ))}
                </div>

                {/* See More link */}
                <p className="mt-5 text-sm text-primary/70 group-hover:text-primary transition-colors duration-300 cursor-pointer">
                  See More →
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
