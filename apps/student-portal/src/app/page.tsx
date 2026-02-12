"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      if (user?.role === "student") {
        router.replace("/dashboard");
      } else {
        window.location.href = "http://localhost:3002/";
      }
    } else {
      router.replace("/login");
    }
  }, [router, isAuthenticated, user]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 mb-4">
          <span className="text-4xl font-bold text-primary transition-all duration-300">
            T
          </span>
          <span className="text-2xl font-semibold text-white/90">AKATHON</span>
        </div>
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto"></div>
        <p className="text-white/60 mt-4">Redirecting...</p>
      </div>
    </div>
  );
}
