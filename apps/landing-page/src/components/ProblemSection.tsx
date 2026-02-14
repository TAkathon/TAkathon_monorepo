"use client";

import { useRef, useCallback, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { Shuffle, FileSpreadsheet, Table2, UserX, ChevronLeft, ChevronRight } from "lucide-react";

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
            className={`tilt-card overflow-visible ${className || ""}`}
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
    const [selected, setSelected] = useState<number>(0);
    const trackRef = useRef<HTMLDivElement>(null);
    const itemRefs = useRef<HTMLDivElement[]>([]);

    const extendedPainPoints = [...painPoints, ...painPoints, ...painPoints];
    const total = painPoints.length;

    const setItemRef = (el: HTMLDivElement | null, idx: number) => {
        if (el) itemRefs.current[idx] = el;
    };

    const updateCenterIndex = () => {
        const track = trackRef.current;
        if (!track) return;
        const rect = track.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        let minDist = Infinity;
        let closestIdx = 0;
        for (let i = 0; i < itemRefs.current.length; i++) {
            const el = itemRefs.current[i];
            if (!el) continue;
            const elRect = el.getBoundingClientRect();
            const elCenter = elRect.left + elRect.width / 2;
            const dist = Math.abs(elCenter - centerX);
            if (dist < minDist) {
                minDist = dist;
                closestIdx = i;
            }
        }
        setSelected(closestIdx);

        // 无缝循环逻辑
        if (closestIdx < total) {
            // 如果滚动到第一组，瞬间跳转到第二组对应位置
            const targetIdx = closestIdx + total;
            instantScrollToIndex(targetIdx);
        } else if (closestIdx >= total * 2) {
            // 如果滚动到第三组，瞬间跳转到第二组对应位置
            const targetIdx = closestIdx - total;
            instantScrollToIndex(targetIdx);
        }
    };

    const instantScrollToIndex = (idx: number) => {
        const target = itemRefs.current[idx];
        const track = trackRef.current;
        if (!target || !track) return;
        const trackRect = track.getBoundingClientRect();
        const itemRect = target.getBoundingClientRect();
        const trackCenter = trackRect.left + trackRect.width / 2;
        const itemCenter = itemRect.left + itemRect.width / 2;
        const delta = itemCenter - trackCenter;
        track.scrollBy({ left: delta, behavior: "auto" }); // instant
        setSelected(idx);
    };

    const scrollToIndex = (idx: number) => {
        const target = itemRefs.current[idx];
        const track = trackRef.current;
        if (!target || !track) return;
        const trackRect = track.getBoundingClientRect();
        const itemRect = target.getBoundingClientRect();
        const trackCenter = trackRect.left + trackRect.width / 2;
        const itemCenter = itemRect.left + itemRect.width / 2;
        const delta = itemCenter - trackCenter;
        track.scrollBy({ left: delta, behavior: "smooth" });
        setSelected(idx);
    };

    const handlePrev = () => {
        scrollToIndex(selected - 1);
    };

    const handleNext = () => {
        scrollToIndex(selected + 1);
    };

    useEffect(() => {
        updateCenterIndex();
        const onScroll = () => updateCenterIndex();
        const onResize = () => updateCenterIndex();
        const track = trackRef.current;
        track?.addEventListener("scroll", onScroll, { passive: true } as AddEventListenerOptions);
        window.addEventListener("resize", onResize, { passive: true } as AddEventListenerOptions);
        return () => {
            track?.removeEventListener("scroll", onScroll as any);
            window.removeEventListener("resize", onResize as any);
        };
    }, [total]);

    // 初始将中间组的第一个项目居中
    useEffect(() => {
        if (itemRefs.current.length > 0) {
            instantScrollToIndex(total);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [total]);

    return (
        <section
            id="problem"
            ref={sectionRef}
            className="relative py-24 sm:py-32 overflow-visible"
        >
            <div className="absolute inset-0 bg-gradient-to-b from-dark via-dark-50 to-dark-100" />

            <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
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
                        The current state of hackathon management is broken. Here&apos;s what
                        organizers and participants face every single time.
                    </p>
                  </div>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </motion.div>

                <motion.div variants={containerVariants} initial="hidden" animate={isInView ? "visible" : "hidden"}>
                    <div className="relative overflow-visible">
                        <div
                            ref={trackRef}
                            className="overflow-x-auto no-scrollbar px-1 py-12"
                        >
                            <div className="flex gap-6 overflow-visible snap-x snap-mandatory">
                                {extendedPainPoints.map((point, i) => (
                                    <motion.div
                                        key={`${i}-${point.title}`}
                                        variants={cardVariants}
                                        ref={(el) => setItemRef(el, i)}
                                        onClick={() => scrollToIndex(i)}
                                        className="snap-center overflow-visible"
                                        animate={
                                            selected === i
                                                ? { scale: 1.22, opacity: 1, zIndex: 10, y: 0 }
                                                : { scale: 0.9, opacity: 0.7, zIndex: 1, y: 0 }
                                        }
                                        transition={{ type: "spring", stiffness: 260, damping: 20 }}
                                    >
                                        <TiltCard className={`group p-8 sm:p-10 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:border-primary/30 hover:bg-white/[0.06] transition-colors duration-300 h-full min-w-[340px] sm:min-w-[440px] md:min-w-[540px] ${selected === i ? "ring-2 ring-primary/50" : ""}`}>
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
                            </div>
                        </div>
                        <button
                            aria-label="Previous"
                            onClick={handlePrev}
                            className="flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-white/10 border border-white/20 hover:bg-white/15 transition-colors items-center justify-center backdrop-blur"
                        >
                            <ChevronLeft className="w-6 h-6 text-white" />
                        </button>
                        <button
                            aria-label="Next"
                            onClick={handleNext}
                            className="flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-12 h-12 rounded-full bg-white/10 border border-white/20 hover:bg-white/15 transition-colors items-center justify-center backdrop-blur"
                        >
                            <ChevronRight className="w-6 h-6 text-white" />
                        </button>
                    </div>
                </motion.div>

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
