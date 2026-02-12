"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type UserRole = "student" | "organizer" | null;

interface User {
    id: string;
    email: string;
    fullName: string;
    role: UserRole;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    login: (user: User) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            isAuthenticated: false,
            login: (user) => set({ user, isAuthenticated: true }),
            logout: () => set({ user: null, isAuthenticated: false }),
        }),
        {
            name: "auth-storage",
            storage: createJSONStorage(() => localStorage),
        }
    )
);
