"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type UserRole = "student" | "organizer" | "sponsor" | null;

interface User {
    id: string;
    email: string;
    fullName: string;
    role: UserRole;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    _hasHydrated: boolean;
    setHasHydrated: (state: boolean) => void;
    login: (user: User) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            isAuthenticated: false,
            _hasHydrated: false,
            setHasHydrated: (state) => set({ _hasHydrated: state }),
            login: (user) => set({ user, isAuthenticated: true }),
            logout: () => {
                // Clear cookie on logout
                if (typeof document !== "undefined") {
                    document.cookie = "auth-storage=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                }
                set({ user: null, isAuthenticated: false });
            },
        }),
        {
            name: "auth-storage",
            onRehydrateStorage: () => (state) => {
                state?.setHasHydrated(true);
            },
            storage: {
                getItem: (name) => {
                    if (typeof document === "undefined") return null;
                    const value = `; ${document.cookie}`;
                    const parts = value.split(`; ${name}=`);
                    if (parts.length === 2) {
                        const cookieValue = parts.pop()?.split(";").shift();
                        return cookieValue ? JSON.parse(decodeURIComponent(cookieValue)) : null;
                    }
                    return null;
                },
                setItem: (name, value) => {
                    if (typeof document === "undefined") return;
                    const stringifiedValue = encodeURIComponent(JSON.stringify(value));
                    // Set cookie to expire in 7 days, accessible across all subdomains/ports on localhost
                    document.cookie = `${name}=${stringifiedValue}; path=/; max-age=${7 * 24 * 60 * 60}`;
                },
                removeItem: (name) => {
                    if (typeof document === "undefined") return;
                    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
                },
            },
        }
    )
);
