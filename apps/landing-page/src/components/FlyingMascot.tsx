"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useSpring, useMotionValue, useVelocity, useTransform } from "framer-motion";
import Image from "next/image";

export default function FlyingMascot() {
    const [isVisible, setIsVisible] = useState(false);
    const prevMouseX = useRef(0);
    const facingRight = useRef(false);

    // Spring physics for smooth following
    const springConfig = { damping: 25, stiffness: 150 };
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const x = useSpring(mouseX, springConfig);
    const y = useSpring(mouseY, springConfig);

    // Physics of the movement: lean based on velocity
    const xVelocity = useVelocity(x);
    // When moving fast right (positive velocity), it tilts back slightly to the left (negative rotate)
    // When moving fast left (negative velocity), it tilts back to the right (positive rotate)
    const tilt = useTransform(xVelocity, [-1000, 0, 1000], [15, 0, -15]);

    // Spring to smoothly flip the mascot 
    const scaleX = useSpring(1, { stiffness: 200, damping: 20 });

    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;

            // Check if we're near the bottom (contact section area)
            // The contact section is at the bottom, so if we're close to end, fade out
            const isNearBottom = (windowHeight + scrollY) >= (documentHeight - 600); // Adjust threshold as needed

            // Show mascot only after scrolling down past the hero section (approx 300px)
            // AND if we are NOT near the bottom where the contact mascot is
            if (scrollY > 250 && !isNearBottom) {
                if (!isVisible) {
                    setIsVisible(true);
                    // Start from center of screen if just appearing
                    x.set(window.innerWidth / 2);
                    y.set(window.innerHeight / 3);
                }
            } else {
                setIsVisible(false);
            }
        };

        const handleMouseMove = (e: MouseEvent) => {
            if (isVisible) {
                // Determine direction
                if (e.clientX > prevMouseX.current + 2) {
                    facingRight.current = true;
                    scaleX.set(-1); // Flip to face right
                } else if (e.clientX < prevMouseX.current - 2) {
                    facingRight.current = false;
                    scaleX.set(1); // Face left
                }
                prevMouseX.current = e.clientX;

                // Adjust offset so it moves to the opposite side of the cursor
                const mascotWidth = 120; // approx max width to avoid cutoff
                const mascotHeight = 120; // approx max height to avoid cutoff

                const offsetX = facingRight.current ? -mascotWidth + 20 : 20;
                let targetX = e.clientX + offsetX;
                let targetY = e.clientY + 20;

                // Keep mascot inside the window bounds
                targetX = Math.max(0, Math.min(targetX, window.innerWidth - mascotWidth));
                targetY = Math.max(0, Math.min(targetY, window.innerHeight - mascotHeight));

                mouseX.set(targetX);
                mouseY.set(targetY);
            }
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        window.addEventListener("mousemove", handleMouseMove, { passive: true });

        // Initial check
        handleScroll();

        return () => {
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("mousemove", handleMouseMove);
        };
    }, [mouseX, mouseY, isVisible, x, y, scaleX]);

    return (
        <motion.div
            className="fixed pointer-events-none z-50 w-24 h-24 md:w-32 md:h-32"
            style={{
                x,
                y,
                left: 0,
                top: 0,
                rotate: tilt
            }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{
                opacity: isVisible ? 1 : 0,
                scale: isVisible ? 1 : 0.5,
            }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
        >
            <motion.div
                animate={{
                    y: [0, -10, 0]
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="w-full h-full relative"
                style={{ scaleX }}
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
