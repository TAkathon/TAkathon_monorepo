"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import {
  Calendar,
  Users,
  Trophy,
  DollarSign,
  Globe,
  MapPin,
  Clock,
  Edit2,
  Loader2,
  AlertCircle,
  Play,
  Send,
  XCircle,
  CheckCircle2,
  Shield,
} from "lucide-react";
import { organizerApi } from "@takathon/shared/api";
import type { Hackathon } from "@takathon/shared/types";
import { toast } from "sonner";
import Link from "next/link";
import { Breadcrumbs } from "@takathon/shared/ui";

const STATUS_CONFIG: Record<
  string,
  { label: string; color: string; bg: string }
> = {
  draft: { label: "Draft", color: "text-gray-400", bg: "bg-gray-500/20" },
  registration_open: {
    label: "Registration Open",
    color: "text-primary",
    bg: "bg-primary/20",
  },
  registration_closed: {
    label: "Registration Closed",
    color: "text-yellow-400",
    bg: "bg-yellow-500/20",
  },
  in_progress: {
    label: "In Progress",
    color: "text-green-400",
    bg: "bg-green-500/20",
  },
  completed: {
    label: "Completed",
    color: "text-blue-400",
    bg: "bg-blue-500/20",
  },
  cancelled: {
    label: "Cancelled",
    color: "text-red-400",
    bg: "bg-red-500/20",
  },
};

export default function HackathonDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [hackathon, setHackathon] = useState<Hackathon | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [confirmAction, setConfirmAction] = useState<string | null>(null);

  const fetchHackathon = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await organizerApi.getMyHackathon(params.id);
      setHackathon(data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load hackathon");
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    fetchHackathon();
  }, [fetchHackathon]);

  const handleLifecycleAction = async (action: string) => {
    setConfirmAction(null);
    setActionLoading(action);
    try {
      if (action === "publish") await organizerApi.publishHackathon(params.id);
      else if (action === "start") await organizerApi.startHackathon(params.id);
      else if (action === "complete")
        await organizerApi.completeHackathon(params.id);
      else if (action === "cancel")
        await organizerApi.cancelHackathon(params.id);
      toast.success(
        `Hackathon ${action}${action.endsWith("e") ? "d" : "ed"} successfully!`,
      );
      await fetchHackathon();
    } catch (err: any) {
      toast.error(
        err.response?.data?.message || `Failed to ${action} hackathon`,
      );
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  if (error || !hackathon) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
          <AlertCircle className="w-12 h-12 text-red-400" />
          <p className="text-red-400 text-lg">
            {error || "Hackathon not found"}
          </p>
          <button
            onClick={() => router.push("/hackathons")}
            className="btn-primary"
          >
            Back to Hackathons
          </button>
        </div>
      </DashboardLayout>
    );
  }

  const status = STATUS_CONFIG[hackathon.status] ?? STATUS_CONFIG.draft;
  const startDate = new Date(hackathon.startDate);
  const endDate = new Date(hackathon.endDate);
  const regDeadline = new Date(hackathon.registrationDeadline);
  const now = new Date();
  const daysUntilStart = Math.max(
    0,
    Math.ceil((startDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)),
  );
  const isEditable = [
    "draft",
    "registration_open",
    "registration_closed",
  ].includes(hackathon.status);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Breadcrumbs + Header */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="space-y-2">
            <div className="mb-2">
              <Breadcrumbs
                items={[
                  { label: "My Hackathons", href: "/hackathons" },
                  { label: hackathon.title },
                ]}
                showBack
              />
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-3xl font-bold text-white">
                {hackathon.title}
              </h1>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${status.bg} ${status.color}`}
              >
                {status.label}
              </span>
            </div>
            <p className="text-white/50 text-sm">
              Created{" "}
              {new Date(hackathon.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          {isEditable && (
            <Link href={`/hackathons/${hackathon.id}/edit`}>
              <button className="btn-primary flex items-center gap-2">
                <Edit2 size={16} /> Edit Hackathon
              </button>
            </Link>
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              icon: <Users size={20} />,
              label: "Max Participants",
              value: hackathon.maxParticipants ?? "Unlimited",
            },
            {
              icon: <Users size={20} />,
              label: "Team Size",
              value: `${hackathon.minTeamSize} – ${hackathon.maxTeamSize}`,
            },
            {
              icon: <Clock size={20} />,
              label:
                hackathon.status === "completed" ||
                hackathon.status === "cancelled"
                  ? "Duration"
                  : "Days Until Start",
              value:
                hackathon.status === "completed" ||
                hackathon.status === "cancelled"
                  ? `${Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))} days`
                  : daysUntilStart,
            },
            {
              icon: <DollarSign size={20} />,
              label: "Prize Pool",
              value: hackathon.prizePool || "—",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="glass p-4 rounded-xl flex items-start gap-3"
            >
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                {stat.icon}
              </div>
              <div>
                <p className="text-white/50 text-xs">{stat.label}</p>
                <p className="text-white font-bold text-lg">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Lifecycle Actions */}
        <div className="glass p-6 rounded-xl">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Shield size={18} className="text-primary" /> Lifecycle Actions
          </h2>

          {(hackathon.status === "completed" ||
            hackathon.status === "cancelled") && (
            <div
              className={`p-4 rounded-lg border ${
                hackathon.status === "completed"
                  ? "bg-blue-500/10 border-blue-500/20 text-blue-400"
                  : "bg-red-500/10 border-red-500/20 text-red-400"
              }`}
            >
              This hackathon is <strong>{hackathon.status}</strong>. No further
              actions are available.
            </div>
          )}

          <div className="flex flex-wrap gap-3 mt-2">
            {hackathon.status === "draft" && (
              <button
                onClick={() => setConfirmAction("publish")}
                disabled={!!actionLoading}
                className="flex items-center gap-2 px-4 py-2 bg-green-500/10 hover:bg-green-500/20 text-green-400 rounded-lg border border-green-500/20 transition-all text-sm font-medium disabled:opacity-50"
              >
                {actionLoading === "publish" ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Send size={16} />
                )}
                Publish
              </button>
            )}

            {["registration_open", "registration_closed"].includes(
              hackathon.status,
            ) && (
              <button
                onClick={() => setConfirmAction("start")}
                disabled={!!actionLoading}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-lg border border-blue-500/20 transition-all text-sm font-medium disabled:opacity-50"
              >
                {actionLoading === "start" ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Play size={16} />
                )}
                Start Hackathon
              </button>
            )}

            {hackathon.status === "in_progress" && (
              <button
                onClick={() => setConfirmAction("complete")}
                disabled={!!actionLoading}
                className="flex items-center gap-2 px-4 py-2 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 rounded-lg border border-purple-500/20 transition-all text-sm font-medium disabled:opacity-50"
              >
                {actionLoading === "complete" ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <CheckCircle2 size={16} />
                )}
                Complete
              </button>
            )}

            {!["completed", "cancelled"].includes(hackathon.status) && (
              <button
                onClick={() => setConfirmAction("cancel")}
                disabled={!!actionLoading}
                className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg border border-red-500/20 transition-all text-sm font-medium disabled:opacity-50"
              >
                {actionLoading === "cancel" ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <XCircle size={16} />
                )}
                Cancel Hackathon
              </button>
            )}
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Description */}
          <div className="glass p-6 rounded-xl space-y-3">
            <h2 className="text-lg font-bold text-white">Description</h2>
            <p className="text-white/70 whitespace-pre-wrap leading-relaxed">
              {hackathon.description}
            </p>
          </div>

          {/* Dates & Location */}
          <div className="glass p-6 rounded-xl space-y-4">
            <h2 className="text-lg font-bold text-white">Event Details</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3 text-white/70">
                <Calendar size={16} className="text-primary shrink-0" />
                <div>
                  <span className="text-white/40">Start:</span>{" "}
                  {startDate.toLocaleString()}
                </div>
              </div>
              <div className="flex items-center gap-3 text-white/70">
                <Calendar size={16} className="text-primary shrink-0" />
                <div>
                  <span className="text-white/40">End:</span>{" "}
                  {endDate.toLocaleString()}
                </div>
              </div>
              <div className="flex items-center gap-3 text-white/70">
                <Clock size={16} className="text-primary shrink-0" />
                <div>
                  <span className="text-white/40">Registration Deadline:</span>{" "}
                  {regDeadline.toLocaleString()}
                </div>
              </div>
              <div className="flex items-center gap-3 text-white/70">
                {hackathon.isVirtual ? (
                  <Globe size={16} className="text-primary shrink-0" />
                ) : (
                  <MapPin size={16} className="text-primary shrink-0" />
                )}
                <span>
                  {hackathon.isVirtual
                    ? "Virtual Event"
                    : hackathon.location || "Location TBD"}
                </span>
              </div>
              {hackathon.websiteUrl && (
                <div className="flex items-center gap-3 text-white/70">
                  <Globe size={16} className="text-primary shrink-0" />
                  <a
                    href={hackathon.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {hackathon.websiteUrl}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Rules */}
          {hackathon.rules && (
            <div className="glass p-6 rounded-xl space-y-3 lg:col-span-2">
              <h2 className="text-lg font-bold text-white">Rules</h2>
              <p className="text-white/70 whitespace-pre-wrap leading-relaxed">
                {hackathon.rules}
              </p>
            </div>
          )}

          {/* Required Skills */}
          {hackathon.requiredSkills && hackathon.requiredSkills.length > 0 && (
            <div className="glass p-6 rounded-xl space-y-3 lg:col-span-2">
              <h2 className="text-lg font-bold text-white">Required Skills</h2>
              <div className="flex flex-wrap gap-2">
                {hackathon.requiredSkills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm border border-primary/20"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/participants"
            className="glass p-4 rounded-xl flex items-center gap-3 hover:border-primary/30 border border-white/10 transition-colors"
          >
            <Users size={20} className="text-primary" />
            <span className="text-white font-medium">View Participants</span>
          </Link>
          <Link
            href="/teams"
            className="glass p-4 rounded-xl flex items-center gap-3 hover:border-primary/30 border border-white/10 transition-colors"
          >
            <Trophy size={20} className="text-primary" />
            <span className="text-white font-medium">View Teams</span>
          </Link>
          <Link
            href="/analytics"
            className="glass p-4 rounded-xl flex items-center gap-3 hover:border-primary/30 border border-white/10 transition-colors"
          >
            <Calendar size={20} className="text-primary" />
            <span className="text-white font-medium">View Analytics</span>
          </Link>
        </div>
      </div>

      {/* ── Confirmation Dialog ──────────────────────────────────────── */}
      {confirmAction && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
          onClick={() => setConfirmAction(null)}
        >
          <div
            className="glass max-w-md w-full mx-4 p-6 rounded-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold text-white mb-2">
              Confirm{" "}
              {confirmAction.charAt(0).toUpperCase() + confirmAction.slice(1)}
            </h3>
            <p className="text-white/60 mb-6">
              {confirmAction === "publish" &&
                "This will open registration for participants. Make sure all details are correct."}
              {confirmAction === "start" &&
                "This will start the hackathon. Registration will be closed and teams should begin working."}
              {confirmAction === "complete" &&
                "This will mark the hackathon as completed. Teams should have submitted their projects."}
              {confirmAction === "cancel" &&
                "This will cancel the hackathon. This action cannot be undone."}
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setConfirmAction(null)}
                className="px-4 py-2 bg-white/5 text-white rounded-lg hover:bg-white/10 transition-all text-sm"
              >
                Go Back
              </button>
              <button
                onClick={() => handleLifecycleAction(confirmAction)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  confirmAction === "cancel"
                    ? "bg-red-500 hover:bg-red-600 text-white"
                    : "btn-primary"
                }`}
              >
                Yes,{" "}
                {confirmAction.charAt(0).toUpperCase() + confirmAction.slice(1)}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
