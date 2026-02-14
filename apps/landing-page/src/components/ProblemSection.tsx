"use client";

import { useRef, useCallback } from "react";
import { motion, useInView } from "framer-motion";
import { Shuffle, FileSpreadsheet, Table2, UserX } from "lucide-react";

const painPoints = [
  {
    icon: Shuffle,
    title: "Random Team Formation",
    description:
      "Students pick teammates randomly, leading to unbalanced teams, skill gaps, and frustrating experiences.",
  },
  {
    icon: FileSpreadsheet,
    title: "Manual Google Forms",
    description:
      "Organizers still rely on Google Forms for registration — tedious to manage, parse, and act upon.",
  },
  {
    icon: Table2,
    title: "Excel Scoring Nightmares",
    description:
      "Judges score on spreadsheets with no validation, leading to errors, conflicts, and manual aggregation.",
  },
  {
    icon: UserX,
    title: "Fragmented Talent Data",
    description:
      "Student skills and availability are scattered across platforms, making matching impossible.",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

function TiltCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;
    card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  }, []);

  const handleMouseLeave = useCallback(() => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform =
      "perspective(800px) rotateX(0) rotateY(0) scale3d(1, 1, 1)";
  }, []);

  return (
    <div
      ref={cardRef}
      className={`tilt-card ${className || ""}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  );
}

export default function ProblemSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      id="problem"
      ref={sectionRef}
      className="relative py-24 sm:py-32 overflow-hidden"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-dark via-dark-50 to-dark-100" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            <span className="text-white">Hackathons in Tunisia</span>{" "}
            <span className="text-primary">Today</span>
          </h2>
          <p className="text-white/50 text-lg max-w-2xl mx-auto">
            The current state of hackathon management is broken. Here&apos;s
            what organizers and participants face every single time.
          </p>
        </motion.div>

        {/* Bento Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 sm:grid-cols-2 gap-5"
        >
          {painPoints.map((point, i) => (
            <motion.div key={i} variants={cardVariants}>
              <TiltCard className="group p-6 sm:p-8 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:border-primary/30 hover:bg-white/[0.06] transition-colors duration-300 cursor-default h-full">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
                    <point.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                      <span className="text-red-400 text-xl">✕</span>
                      {point.title}
                    </h3>
                    <p className="text-white/50 text-sm leading-relaxed">
                      {point.description}
                    </p>
                  </div>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </motion.div>

        {/* Divider */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={isInView ? { opacity: 1, scaleX: 1 } : {}}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-20 text-center"
        >
          <div className="divider-glow mx-auto max-w-xl mb-6" />
          <p className="text-xl sm:text-2xl font-semibold text-white/80 italic">
            &quot;Hackathons deserve better.&quot;
          </p>
          <div className="divider-glow mx-auto max-w-xl mt-6" />
        </motion.div>
      </div>
    </section>
  );
}
