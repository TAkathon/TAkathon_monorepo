"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
    const router = useRouter();

    useEffect(() => {
        // Redirect to login page
        router.push("/login");
    }, [router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-dark">
            <div className="text-center">
                <div className="inline-flex items-center gap-2 mb-4">
                    <span className="text-4xl font-bold text-primary">T</span>
                    <span className="text-2xl font-semibold text-white/90">AKATHON</span>
                </div>
                <p className="text-white/60">Redirecting to login...</p>
            </div>
        </div>
    );
}
