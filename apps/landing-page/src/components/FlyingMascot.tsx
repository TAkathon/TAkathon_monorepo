"use client";

import { useEffect, useState } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";
import Image from "next/image";

export default function FlyingMascot() {
    const [isVisible, setIsVisible] = useState(false);

    // Spring physics for smooth following
    const springConfig = { damping: 25, stiffness: 150 };
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const x = useSpring(mouseX, springConfig);
    const y = useSpring(mouseY, springConfig);

    useEffect(() => {
        const handleScroll = () => {
            // Show mascot only after scrolling down past the hero section (approx 300px)
            // This syncs with the fade-out in HeroSection
            if (window.scrollY > 250) {
                if (!isVisible) {
                    setIsVisible(true);
                    // Start from center of screen roughly where the hero mascot was
                    // We can default to center of viewport
                    x.set(window.innerWidth / 2);
                    y.set(window.innerHeight / 3);
                }
            } else {
                setIsVisible(false);
            }
        };

        const handleMouseMove = (e: MouseEvent) => {
            if (isVisible) {
                // Update target position
                // Add slight offset so it's not directly under the cursor
                mouseX.set(e.clientX + 20);
                mouseY.set(e.clientY + 20);
            }
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        window.addEventListener("mousemove", handleMouseMove, { passive: true });

        return () => {
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("mousemove", handleMouseMove);
        };
    }, [mouseX, mouseY, isVisible, x, y]);

    return (
        <motion.div
            className="fixed pointer-events-none z-50 w-24 h-24 md:w-32 md:h-32"
            style={{
                x,
                y,
                left: 0,
                top: 0
            }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{
                opacity: isVisible ? 1 : 0,
                scale: isVisible ? 1 : 0.5,
            }}
            transition={{ duration: 0.5, ease: "easeOut" }}
        >
            <motion.div
                animate={{
                    y: [0, -10, 0],
                    rotate: [0, 5, -5, 0]
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="w-full h-full relative"
            >
                <Image
                    src="/flying.png"
                    alt="Flying Mascot"
                    fill
                    className="object-contain drop-shadow-xl"
                    priority
                />
            </motion.div>
        </motion.div>
    );
}
