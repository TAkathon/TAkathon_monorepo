"use client";

import { useState, useEffect, useCallback, RefObject } from "react";

/**
 * Tracks scroll progress as a percentage (0–100).
 */
export function useScrollProgress(): number {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            const docHeight =
                document.documentElement.scrollHeight - window.innerHeight;
            const scrolled = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
            setProgress(Math.min(scrolled, 100));
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return progress;
}

/**
 * Tracks mouse position relative to the viewport.
 */
export function useMousePosition(): { x: number; y: number } {
    const [position, setPosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setPosition({ x: e.clientX, y: e.clientY });
        };

        window.addEventListener("mousemove", handleMouseMove, { passive: true });
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    return position;
}

/**
 * Detects if element is in viewport using IntersectionObserver.
 */
export function useInView(
    ref: RefObject<HTMLElement | null>,
    options?: IntersectionObserverInit
): boolean {
    const [isInView, setIsInView] = useState(false);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setIsInView(true);
            }
        }, { threshold: 0.1, ...options });

        observer.observe(element);
        return () => observer.disconnect();
    }, [ref, options]);

    return isInView;
}

/**
 * Magnetic pull effect — element follows cursor slightly when hovered.
 */
export function useMagnetic(ref: RefObject<HTMLElement | null>) {
    const handleMouseMove = useCallback(
        (e: MouseEvent) => {
            const el = ref.current;
            if (!el) return;

            const rect = el.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            const deltaX = (e.clientX - centerX) * 0.15;
            const deltaY = (e.clientY - centerY) * 0.15;

            el.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
        },
        [ref]
    );

    const handleMouseLeave = useCallback(() => {
        const el = ref.current;
        if (!el) return;
        el.style.transform = "translate(0, 0)";
    }, [ref]);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        el.addEventListener("mousemove", handleMouseMove);
        el.addEventListener("mouseleave", handleMouseLeave);

        return () => {
            el.removeEventListener("mousemove", handleMouseMove);
            el.removeEventListener("mouseleave", handleMouseLeave);
        };
    }, [ref, handleMouseMove, handleMouseLeave]);
}
