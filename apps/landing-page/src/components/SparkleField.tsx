"use client";

import { useMemo } from "react";

interface SparkleProps {
    count?: number;
}

export default function SparkleField({ count = 20 }: SparkleProps) {
    const sparkles = useMemo(() => {
        return Array.from({ length: count }, (_, i) => ({
            id: i,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            size: Math.random() * 3 + 1,
            duration: Math.random() * 6 + 4,
            delay: Math.random() * 5,
            opacity: Math.random() * 0.5 + 0.2,
        }));
    }, [count]);

    return (
        <div className="sparkle-field" aria-hidden="true">
            {sparkles.map((s) => (
                <div
                    key={s.id}
                    className="sparkle"
                    style={{
                        left: s.left,
                        top: s.top,
                        width: `${s.size}px`,
                        height: `${s.size}px`,
                        animationDuration: `${s.duration}s`,
                        animationDelay: `${s.delay}s`,
                        opacity: s.opacity,
                    }}
                />
            ))}
        </div>
    );
}
