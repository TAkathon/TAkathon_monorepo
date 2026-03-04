"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  Filter,
  Search,
  ChevronDown,
  Loader2,
  CheckCircle,
  CheckCircle2,
  Shield,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { studentApi } from "@takathon/shared/api";
import type { StudentHackathonSummary } from "@takathon/shared/api";
import { SkeletonHackathonList } from "@takathon/shared/ui";
import { toast } from "sonner";

// ─── Button state logic ───────────────────────────────────────────────────────

type HackathonButtonState =
  | { action: "register"; label: "Register Now"; disabled: false }
  | { action: "withdraw"; label: "Withdraw"; disabled: false }
  | { action: "full"; label: "Hackathon Full"; disabled: true; reason: string }
  | {
      action: "ended";
      label: "Registration Closed";
      disabled: true;
      reason: string;
    }
  | { action: "cancelled"; label: "Cancelled"; disabled: true; reason: string }
  | {
      action: "in_progress";
      label: "In Progress";
      disabled: true;
      reason: string;
    }
  | { action: "completed"; label: "Completed"; disabled: true; reason: string }
  | {
      action: "team_locked";
      label: "Withdraw Unavailable";
      disabled: true;
      reason: string;
    };

function getHackathonButtonState(
  hackathon: StudentHackathonSummary,
): HackathonButtonState {
  // Registered students — check team lock first
  if (hackathon.isRegistered) {
    if (hackathon.isInTeam) {
      return {
        action: "team_locked",
        label: "Withdraw Unavailable",
        disabled: true,
        reason:
          "You are currently in a team. Leave your team to withdraw from this hackathon.",
      };
    }
    return { action: "withdraw", label: "Withdraw", disabled: false };
  }

  // Not registered — determine why they can't register
  if (hackathon.status === "cancelled") {
    return {
      action: "cancelled",
      label: "Cancelled",
      disabled: true,
      reason: "This hackathon was cancelled by the organizer.",
    };
  }
  if (hackathon.status === "completed") {
    return {
      action: "completed",
      label: "Completed",
      disabled: true,
      reason: "This hackathon has ended.",
    };
  }
  if (hackathon.status === "in_progress") {
    return {
      action: "in_progress",
      label: "In Progress",
      disabled: true,
      reason: "This hackathon is currently running. Registration is closed.",
    };
  }
  if (hackathon.status === "registration_closed") {
    return {
      action: "ended",
      label: "Registration Closed",
      disabled: true,
      reason: "Registration for this hackathon has closed.",
    };
  }
  if (
    hackathon.maxParticipants &&
    hackathon.participantCount >= hackathon.maxParticipants
  ) {
    return {
      action: "full",
      label: "Hackathon Full",
      disabled: true,
      reason: "This hackathon has reached its maximum number of participants.",
    };
  }

  // Default — open for registration
  return { action: "register", label: "Register Now", disabled: false };
}

// ─── Status badge helper ──────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const config: Record<
    string,
    { label: string; color: string; Icon: typeof Clock }
  > = {
    registration_open: {
      label: "Open",
      color: "bg-green-500/20 text-green-400 border-green-500/30",
      Icon: CheckCircle2,
    },
    registration_closed: {
      label: "Closed",
      color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      Icon: Clock,
    },
    in_progress: {
      label: "In Progress",
      color: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      Icon: Clock,
    },
    completed: {
      label: "Ended",
      color: "bg-white/10 text-white/60 border-white/20",
      Icon: CheckCircle2,
    },
    cancelled: {
      label: "Cancelled",
      color: "bg-red-500/20 text-red-400 border-red-500/30",
      Icon: XCircle,
    },
  };
  const c = config[status] ?? {
    label: status.replace(/_/g, " "),
    color: "bg-white/10 text-white/60 border-white/20",
    Icon: AlertCircle,
  };
  const { Icon } = c;
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full border ${c.color}`}
    >
      <Icon className="w-3 h-3" />
      {c.label}
    </span>
  );
}

// ─── Disabled button reason text ──────────────────────────────────────────────

function ButtonReasonIcon({ action }: { action: string }) {
  switch (action) {
    case "cancelled":
      return <XCircle className="w-4 h-4" />;
    case "completed":
    case "ended":
      return <CheckCircle2 className="w-4 h-4" />;
    case "in_progress":
      return <Clock className="w-4 h-4" />;
    case "full":
      return <Users className="w-4 h-4" />;
    case "team_locked":
      return <Shield className="w-4 h-4" />;
    default:
      return null;
  }
}

export default function HackathonsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [hackathons, setHackathons] = useState<StudentHackathonSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState<string | null>(null);
  const [withdrawing, setWithdrawing] = useState<string | null>(null);

  useEffect(() => {
    fetchHackathons();
  }, []);

  const fetchHackathons = async () => {
    try {
      const data = await studentApi.browseHackathons();
      setHackathons(data);
    } catch {
      toast.error("Failed to load hackathons");
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async (hackathonId: string) => {
    setRegistering(hackathonId);
    try {
      await studentApi.registerForHackathon(hackathonId);
      toast.success("Successfully registered!");
      setHackathons((prev) =>
        prev.map((h) =>
          h.id === hackathonId
            ? {
                ...h,
                isRegistered: true,
                participantCount: h.participantCount + 1,
              }
            : h,
        ),
      );
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to register");
    } finally {
      setRegistering(null);
    }
  };

  const handleWithdraw = async (hackathonId: string) => {
    setWithdrawing(hackathonId);
    try {
      await studentApi.withdrawFromHackathon(hackathonId);
      toast.success("Withdrawn successfully");
      setHackathons((prev) =>
        prev.map((h) =>
          h.id === hackathonId
            ? {
                ...h,
                isRegistered: false,
                participantCount: Math.max(0, h.participantCount - 1),
              }
            : h,
        ),
      );
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to withdraw");
    } finally {
      setWithdrawing(null);
    }
  };

  // Filter then sort: cancelled hackathons go to the bottom
  const filteredHackathons = hackathons
    .filter((h) => {
      const matchesSearch =
        h.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (h.requiredSkills || []).some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase()),
        );
      const matchesStatus =
        selectedStatus === "All" || h.status === selectedStatus;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      // Cancelled at the bottom
      if (a.status === "cancelled" && b.status !== "cancelled") return 1;
      if (a.status !== "cancelled" && b.status === "cancelled") return -1;
      // Completed just above cancelled
      if (a.status === "completed" && b.status !== "completed") return 1;
      if (a.status !== "completed" && b.status === "completed") return -1;
      return 0;
    });

  return (
    <DashboardLayout>
      {loading ? (
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="h-8 w-56 bg-white/10 rounded animate-pulse" />
            <div className="h-4 w-80 bg-white/10 rounded animate-pulse" />
          </div>
          <div className="flex gap-4">
            <div className="h-12 flex-1 bg-white/5 rounded-lg animate-pulse" />
            <div className="h-12 w-48 bg-white/5 rounded-lg animate-pulse" />
          </div>
          <SkeletonHackathonList count={4} />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Browse Hackathons
            </h1>
            <p className="text-white/60">
              Discover and join exciting hackathons across Tunisia
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search hackathons by name or tag..."
                className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:border-primary/50 transition-all"
              />
            </div>

            {/* Status Filter */}
            <div className="relative min-w-[200px]">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full pl-11 pr-8 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary/50 transition-all appearance-none cursor-pointer"
              >
                <option value="All">All Status</option>
                <option value="registration_open">Open</option>
                <option value="registration_closed">Closed</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-white/40">
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Results count */}
          <p className="text-white/60 text-sm">
            Showing {filteredHackathons.length} of {hackathons.length}{" "}
            hackathons
          </p>

          {/* Hackathons Grid */}
          {filteredHackathons.length === 0 ? (
            <div className="text-center py-16 text-white/40">
              <Calendar size={48} className="mx-auto mb-4 opacity-40" />
              <p className="text-lg">No hackathons found</p>
              <p className="text-sm mt-2">
                {searchQuery || selectedStatus !== "All"
                  ? "Try adjusting your search or filters."
                  : "There are no hackathons available right now. Check back later!"}
              </p>
              {(searchQuery || selectedStatus !== "All") && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedStatus("All");
                  }}
                  className="btn-secondary mt-4 text-sm"
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredHackathons.map((hackathon) => {
                const btnState = getHackathonButtonState(hackathon);
                const isCancelled = hackathon.status === "cancelled";

                return (
                  <div
                    key={hackathon.id}
                    className={`glass rounded-xl p-6 transition-all duration-300 cursor-pointer group ${
                      isCancelled ? "opacity-50" : "hover:bg-white/10"
                    }`}
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1 min-w-0">
                        <h3
                          className={`text-xl font-bold mb-1 transition-colors truncate ${
                            isCancelled
                              ? "text-white/50 line-through"
                              : "text-white group-hover:text-primary"
                          }`}
                        >
                          {hackathon.title}
                        </h3>
                        <p className="text-sm text-white/60">
                          {hackathon.isVirtual
                            ? "Virtual Event"
                            : hackathon.location || "TBD"}
                        </p>
                      </div>
                      <StatusBadge status={hackathon.status} />
                    </div>

                    {/* Description */}
                    <p className="text-white/70 text-sm mb-4 line-clamp-2">
                      {hackathon.description}
                    </p>

                    {/* Tags */}
                    {(hackathon.requiredSkills || []).length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {hackathon.requiredSkills.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-white/5 text-white/60 text-xs rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Info Grid */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="flex items-center gap-2 text-sm text-white/60">
                        <Calendar className="w-4 h-4 text-primary" />
                        <span>
                          {hackathon.startDate
                            ? new Date(hackathon.startDate).toLocaleDateString()
                            : "TBD"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-white/60">
                        <MapPin className="w-4 h-4 text-primary" />
                        <span>
                          {hackathon.location ||
                            (hackathon.isVirtual ? "Virtual" : "TBD")}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-white/60">
                        <Clock className="w-4 h-4 text-primary" />
                        <span>
                          {hackathon.startDate && hackathon.endDate
                            ? `${Math.ceil(
                                (new Date(hackathon.endDate).getTime() -
                                  new Date(hackathon.startDate).getTime()) /
                                  (1000 * 60 * 60 * 24),
                              )} Days`
                            : "TBD"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-white/60">
                        <Users className="w-4 h-4 text-primary" />
                        <span>
                          Max {hackathon.maxParticipants || "Unlimited"}
                        </span>
                      </div>
                    </div>

                    {/* Footer — button with contextual state */}
                    <div className="pt-4 border-t border-white/10">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-primary font-bold text-lg">
                            {hackathon.participantCount}
                          </span>
                          <span className="text-white/40 text-sm ml-1">
                            Participants
                          </span>
                        </div>

                        {/* Action area */}
                        <div className="flex flex-col items-end gap-1">
                          {btnState.action === "register" && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleJoin(hackathon.id);
                              }}
                              disabled={registering === hackathon.id}
                              className="px-4 py-2 bg-primary hover:bg-primary-dark text-white font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 flex items-center gap-2"
                            >
                              {registering === hackathon.id ? (
                                <>
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                  Registering...
                                </>
                              ) : (
                                "Register Now"
                              )}
                            </button>
                          )}

                          {btnState.action === "withdraw" && (
                            <div className="flex items-center gap-2">
                              <span className="flex items-center gap-1 text-green-400 text-sm font-medium">
                                <CheckCircle className="w-4 h-4" /> Registered
                              </span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleWithdraw(hackathon.id);
                                }}
                                disabled={withdrawing === hackathon.id}
                                className="px-3 py-1.5 bg-white/5 hover:bg-red-500/20 text-white/60 hover:text-red-400 text-sm font-medium rounded-lg transition-all duration-200 border border-white/10 hover:border-red-500/30 disabled:opacity-50 flex items-center gap-1"
                              >
                                {withdrawing === hackathon.id ? (
                                  <Loader2 className="w-3 h-3 animate-spin" />
                                ) : null}
                                Withdraw
                              </button>
                            </div>
                          )}

                          {btnState.action === "team_locked" && (
                            <div className="flex items-center gap-1.5">
                              <span className="flex items-center gap-1 text-primary text-sm font-medium">
                                <Shield className="w-4 h-4" /> In Team
                              </span>
                            </div>
                          )}

                          {btnState.disabled &&
                            btnState.action !== "team_locked" && (
                              <button
                                disabled
                                className="px-4 py-2 bg-white/5 text-white/40 font-medium rounded-lg border border-white/10 cursor-not-allowed flex items-center gap-2 text-sm"
                              >
                                <ButtonReasonIcon action={btnState.action} />
                                {btnState.label}
                              </button>
                            )}
                        </div>
                      </div>

                      {/* Reason text for disabled states */}
                      {btnState.disabled && "reason" in btnState && (
                        <p className="text-white/40 text-xs mt-2 text-right flex items-center justify-end gap-1">
                          <AlertCircle className="w-3 h-3 flex-shrink-0" />
                          {btnState.reason}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </DashboardLayout>
  );
}
