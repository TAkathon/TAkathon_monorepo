"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { User, Settings, LogOut, Loader2, ChevronDown } from "lucide-react";

/* ---------- Types ---------- */

export interface AvatarMenuUser {
  id: string;
  fullName?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: string;
  avatarUrl?: string | null;
}

export interface AvatarMenuProps {
  /** Current user (null if not loaded yet) */
  user: AvatarMenuUser | null;
  /** Has zustand finished hydrating? */
  hydrated: boolean;
  /** Path prefix for profile/settings links */
  profilePath?: string;
  settingsPath?: string;
  /** Called for sign-out. Must handle API call + Zustand clear + redirect. */
  onSignOut: () => Promise<void>;
}

/* ---------- Helpers ---------- */

const AVATAR_COLORS = [
  "bg-red-500/80",
  "bg-blue-500/80",
  "bg-green-500/80",
  "bg-purple-500/80",
  "bg-yellow-500/80",
  "bg-pink-500/80",
  "bg-teal-500/80",
  "bg-indigo-500/80",
];

function deterministicColor(userId: string): string {
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = (hash * 31 + userId.charCodeAt(i)) | 0;
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function getInitials(user: AvatarMenuUser): string {
  const name =
    user.fullName || `${user.firstName || ""} ${user.lastName || ""}`.trim();
  if (!name) return "?";
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function roleBadge(role?: string): { label: string; className: string } | null {
  switch (role) {
    case "STUDENT":
      return { label: "Student", className: "bg-blue-500/20 text-blue-400" };
    case "ORGANIZER":
      return {
        label: "Organizer",
        className: "bg-green-500/20 text-green-400",
      };
    case "SPONSOR":
      return {
        label: "Sponsor",
        className: "bg-purple-500/20 text-purple-400",
      };
    default:
      return null;
  }
}

/* ---------- Component ---------- */

export function AvatarMenu({
  user,
  hydrated,
  profilePath = "/dashboard/profile",
  settingsPath = "/dashboard/settings",
  onSignOut,
}: AvatarMenuProps) {
  const [open, setOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await onSignOut();
    } catch {
      /* best-effort */
    } finally {
      setSigningOut(false);
    }
  };

  const initials = hydrated && user ? getInitials(user) : null;
  const bgColor = user ? deterministicColor(user.id) : "bg-primary/20";
  const badge = user ? roleBadge(user.role) : null;
  const displayName =
    user?.fullName ||
    `${user?.firstName || ""} ${user?.lastName || ""}`.trim() ||
    "User";

  return (
    <div className="relative" ref={ref}>
      {/* Trigger button */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 p-1.5 hover:bg-white/5 rounded-lg transition-all"
        aria-label="User menu"
      >
        {user?.avatarUrl ? (
          <img
            src={user.avatarUrl}
            alt={displayName}
            className="w-8 h-8 rounded-full object-cover"
          />
        ) : (
          <div
            className={`w-8 h-8 ${bgColor} rounded-full flex items-center justify-center text-white text-xs font-semibold`}
          >
            {initials ?? (
              <span className="w-4 h-4 rounded-full bg-white/30 animate-pulse block" />
            )}
          </div>
        )}
        <ChevronDown
          size={14}
          className={`text-white/40 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-full mt-2 w-64 glass border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden">
          {/* User info header */}
          <div className="p-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              {user?.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={displayName}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div
                  className={`w-10 h-10 ${bgColor} rounded-full flex items-center justify-center text-white text-sm font-semibold`}
                >
                  {initials ?? "?"}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {displayName}
                </p>
                {user?.email && (
                  <p className="text-xs text-white/50 truncate">{user.email}</p>
                )}
              </div>
              {badge && (
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${badge.className}`}
                >
                  {badge.label}
                </span>
              )}
            </div>
          </div>

          {/* Menu items */}
          <div className="py-1">
            <Link
              href={profilePath}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-white/80 hover:bg-white/5 transition-colors"
            >
              <User size={16} className="text-white/50" />
              View Profile
            </Link>
            <Link
              href={settingsPath}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-white/80 hover:bg-white/5 transition-colors"
            >
              <Settings size={16} className="text-white/50" />
              Settings
            </Link>
          </div>

          {/* Sign out */}
          <div className="border-t border-white/10 py-1">
            <button
              onClick={handleSignOut}
              disabled={signingOut}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 w-full transition-colors disabled:opacity-50"
            >
              {signingOut ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <LogOut size={16} />
              )}
              {signingOut ? "Signing out..." : "Sign Out"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
