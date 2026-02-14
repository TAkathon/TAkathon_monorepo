"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

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
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      _hasHydrated: false,
      accessToken: null,
      setHasHydrated: (state) => set({ _hasHydrated: state }),
      login: (user) => set({ user, isAuthenticated: true }),
      logout: () => {
        if (typeof document !== "undefined") {
          document.cookie = "auth-storage=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax";
        }
        set({ user: null, isAuthenticated: false, accessToken: null });
      },
      setAccessToken: (token) => set({ accessToken: token }),
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
          const isSecure = typeof window !== "undefined" && window.location.protocol === "https:";
          const attrs = [`path=/`, `max-age=${7 * 24 * 60 * 60}`, `SameSite=Lax`, isSecure ? `Secure` : ``]
            .filter(Boolean)
            .join("; ");
          document.cookie = `${name}=${stringifiedValue}; ${attrs}`;
        },
        removeItem: (name) => {
          if (typeof document === "undefined") return;
          const isSecure = typeof window !== "undefined" && window.location.protocol === "https:";
          const attrs = [`expires=Thu, 01 Jan 1970 00:00:00 UTC`, `path=/`, `SameSite=Lax`, isSecure ? `Secure` : ``]
            .filter(Boolean)
            .join("; ");
          document.cookie = `${name}=; ${attrs}`;
        },
      },
    }
  )
);
