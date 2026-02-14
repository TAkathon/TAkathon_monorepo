"use client";

import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import {
  UserPlus,
  ClipboardCheck,
  Users,
  Zap,
  Settings,
  BarChart3,
  Trophy,
  Share2,
} from "lucide-react";

const userSteps = [
  {
    icon: UserPlus,
    title: "Create Your Profile",
    description:
      "Sign up and fill in your skills, experience level, and availability.",
  },
  {
    icon: ClipboardCheck,
    title: "Join a Hackathon",
    description:
      "Browse upcoming hackathons and register for the ones that interest you.",
  },
  {
    icon: Users,
    title: "Build Your Team",
    description:
      "Invite friends or get AI-powered teammate suggestions to fill open spots.",
  },
  {
    icon: Zap,
    title: "Compete & Win",
    description:
      "Collaborate with your balanced team and bring your best ideas to life.",
  },
];

const organizerSteps = [
  {
    icon: Settings,
    title: "Create a Hackathon",
    description:
      "Set up your hackathon with details, rules, dates, and team requirements.",
  },
  {
    icon: BarChart3,
    title: "Track Registrations",
    description:
      "View participants, skill distributions, and team formation progress in real-time.",
  },
  {
    icon: Trophy,
    title: "Manage Judging",
    description:
      "Structured scoring system replaces the chaos of spreadsheets and manual tallying.",
  },
  {
    icon: Share2,
    title: "Export & Analyze",
    description:
      "Export team data, results, and analytics for sponsors and post-event reports.",
  },
];

const stepVariants = {
  hidden: { opacity: 0, x: -30 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      delay: i * 0.15,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  }),
};

function StepPath({ inView }: { inView: boolean }) {
  return (
    <svg
      className="absolute left-7 top-20 w-px hidden sm:block"
      style={{ height: "calc(100% - 80px)" }}
      viewBox="0 0 2 300"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <line
        x1="1"
        y1="0"
        x2="1"
        y2="300"
        stroke="#D94C1A"
        strokeWidth="2"
        strokeDasharray="6 4"
        strokeDashoffset={inView ? 0 : 300}
        style={{
          transition: "stroke-dashoffset 1.5s ease-out",
        }}
      />
    </svg>
  );
}

function StepsColumn({
  title,
  steps,
  inView,
}: {
  title: string;
  steps: typeof userSteps;
  inView: boolean;
}) {
  return (
    <div className="relative">
      <h3 className="text-lg sm:text-xl font-bold text-dark-100 mb-8 text-center">
        {title}
      </h3>

      <div className="relative space-y-8 pl-0 sm:pl-16">
        <StepPath inView={inView} />

        {steps.map((step, i) => (
          <motion.div
            key={i}
            custom={i}
            variants={stepVariants}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            className="relative flex items-start gap-4"
          >
            {/* Number circle */}
            <div className="hidden sm:flex absolute left-[-64px] w-14 h-14 rounded-full bg-primary text-white font-bold text-lg items-center justify-center shadow-lg flex-shrink-0 z-10">
              {i + 1}
            </div>

            {/* Card */}
            <div className="flex-1 p-5 rounded-xl bg-white shadow-sm border border-gray-100 hover:shadow-md hover:border-primary/20 transition-all duration-300 group">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors sm:hidden">
                  <span className="text-primary font-bold text-sm">
                    {i + 1}
                  </span>
                </div>
                <step.icon className="w-5 h-5 text-primary" />
                <h4 className="font-semibold text-gray-900">{step.title}</h4>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed">
                {step.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default function WorkflowSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  return (
    <section
      id="workflow"
      ref={sectionRef}
      className="relative py-24 sm:py-32 overflow-hidden bg-cream"
    >
      {/* Subtle pattern */}
      <motion.div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #D94C1A 1px, transparent 0)`,
          backgroundSize: "32px 32px",
          y: backgroundY,
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            How <span className="text-primary">TAKATHON</span> Works
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Whether you&apos;re a participant or an organizer, the experience is
            streamlined from start to finish.
          </p>
        </motion.div>

        {/* Two-column workflow */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          <StepsColumn
            title="🎓 Normal User"
            steps={userSteps}
            inView={isInView}
          />
          <StepsColumn
            title="🏢 Hackathon Organizer"
            steps={organizerSteps}
            inView={isInView}
          />
        </div>
      </div>
    </section>
  );
}
