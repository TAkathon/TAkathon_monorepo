"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Loader2,
  ArrowLeft,
  AlertCircle,
  Users,
  Trophy,
  Calendar,
  MapPin,
  DollarSign,
  Building2,
  Award,
  BarChart3,
} from "lucide-react";
import { sponsorApi } from "@takathon/shared/api";
import type { HackathonOverview } from "@takathon/shared/api";
import DashboardLayout from "@/components/DashboardLayout";
import { Breadcrumbs } from "@takathon/shared/ui";

function tierColor(tier: string): string {
  switch (tier) {
    case "platinum":
      return "bg-purple-500/20 text-purple-400 border-purple-500/30";
    case "gold":
      return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
    case "silver":
      return "bg-gray-400/20 text-gray-300 border-gray-400/30";
    case "bronze":
      return "bg-orange-500/20 text-orange-400 border-orange-500/30";
    default:
      return "bg-white/10 text-white/60 border-white/20";
  }
}

function statusBadge(status: string): {
  bg: string;
  text: string;
  label: string;
} {
  const s = status.replace("_", " ");
  switch (status) {
    case "draft":
      return { bg: "bg-white/10", text: "text-white/50", label: s };
    case "registration_open":
      return {
        bg: "bg-green-500/20",
        text: "text-green-400",
        label: "Registration Open",
      };
    case "registration_closed":
      return {
        bg: "bg-yellow-500/20",
        text: "text-yellow-400",
        label: "Registration Closed",
      };
    case "in_progress":
      return {
        bg: "bg-blue-500/20",
        text: "text-blue-400",
        label: "In Progress",
      };
    case "completed":
      return {
        bg: "bg-purple-500/20",
        text: "text-purple-400",
        label: "Completed",
      };
    case "cancelled":
      return { bg: "bg-red-500/20", text: "text-red-400", label: "Cancelled" };
    default:
      return { bg: "bg-white/10", text: "text-white/50", label: s };
  }
}

function formatDate(date: string | null | undefined): string {
  if (!date) return "TBD";
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function daysUntil(date: string | null | undefined): string {
  if (!date) return "—";
  const diff = Math.ceil(
    (new Date(date).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
  );
  if (diff < 0) return "Past";
  if (diff === 0) return "Today";
  return `${diff} day${diff === 1 ? "" : "s"}`;
}

export default function SponsoredHackathonDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [overview, setOverview] = useState<HackathonOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    fetchOverview();
  }, [id]);

  async function fetchOverview() {
    try {
      setLoading(true);
      setError(null);
      const data = await sponsorApi.getHackathonOverview(id);
      setOverview(data);
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Failed to load hackathon overview.",
      );
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  if (error || !overview) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto space-y-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
          >
            <ArrowLeft size={16} /> Back
          </button>
          <div className="glass border border-red-500/20 p-6 text-red-400 flex items-center gap-2">
            <AlertCircle size={16} />
            {error || "Overview not available"}
            <button
              onClick={fetchOverview}
              className="ml-auto text-sm underline"
            >
              Retry
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const { hackathon, mySponsorship, stats, leaderboard, universityBreakdown } =
    overview;
  const sb = statusBadge(hackathon.status);
  const maxSkillCount = Math.max(...stats.topSkills.map((s) => s.count), 1);
  const maxUniCount = Math.max(...universityBreakdown.map((u) => u.count), 1);

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: "My Sponsorships", href: "/dashboard/sponsored" },
            { label: hackathon.title },
          ]}
          showBack
        />

        {/* Header */}
        <div className="glass p-6 border border-white/10 rounded-xl">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl font-bold text-white">
                  {hackathon.title}
                </h1>
                <span
                  className={`text-xs px-2 py-1 rounded-full font-medium ${sb.bg} ${sb.text}`}
                >
                  {sb.label}
                </span>
                <span
                  className={`text-xs px-2 py-1 rounded-full font-medium capitalize border ${tierColor(mySponsorship.tier)}`}
                >
                  {mySponsorship.tier} Sponsor
                </span>
              </div>
              <div className="flex items-center gap-4 mt-2 text-sm text-white/60 flex-wrap">
                <span className="flex items-center gap-1">
                  <Calendar size={14} />
                  {formatDate(hackathon.startDate)} —{" "}
                  {formatDate(hackathon.endDate)}
                </span>
                {hackathon.location && (
                  <span className="flex items-center gap-1">
                    <MapPin size={14} />
                    {hackathon.location}
                  </span>
                )}
                {hackathon.isVirtual && (
                  <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full">
                    Virtual
                  </span>
                )}
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-white/40">Organized by</p>
              <p className="text-sm text-white/80">
                {hackathon.organizer.fullName}
              </p>
              {hackathon.organizer.organization && (
                <p className="text-xs text-white/50">
                  {hackathon.organizer.organization}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Key Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="glass p-4 border border-white/10 rounded-xl text-center">
            <Users size={24} className="mx-auto mb-2 text-primary" />
            <p className="text-2xl font-bold text-white">
              {stats.totalParticipants}
            </p>
            <p className="text-xs text-white/50">Participants</p>
          </div>
          <div className="glass p-4 border border-white/10 rounded-xl text-center">
            <Trophy size={24} className="mx-auto mb-2 text-primary" />
            <p className="text-2xl font-bold text-white">{stats.totalTeams}</p>
            <p className="text-xs text-white/50">Teams</p>
          </div>
          <div className="glass p-4 border border-white/10 rounded-xl text-center">
            <BarChart3 size={24} className="mx-auto mb-2 text-primary" />
            <p className="text-2xl font-bold text-white">
              {stats.topSkills.length > 0 ? stats.topSkills[0].name : "—"}
            </p>
            <p className="text-xs text-white/50">Top Skill</p>
          </div>
          <div className="glass p-4 border border-white/10 rounded-xl text-center">
            <Calendar size={24} className="mx-auto mb-2 text-primary" />
            <p className="text-2xl font-bold text-white">
              {daysUntil(hackathon.startDate)}
            </p>
            <p className="text-xs text-white/50">Until Event</p>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Top Skills Bar Chart */}
          <div className="glass p-6 border border-white/10 rounded-xl">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <BarChart3 size={18} className="text-primary" />
              Top Skills
            </h2>
            {stats.topSkills.length === 0 ? (
              <p className="text-white/40 text-sm">
                No skill data available yet.
              </p>
            ) : (
              <div className="space-y-3">
                {stats.topSkills.map((skill) => (
                  <div key={skill.name}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-white/80">{skill.name}</span>
                      <span className="text-white/50">{skill.count}</span>
                    </div>
                    <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-500"
                        style={{
                          width: `${(skill.count / maxSkillCount) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* University Breakdown */}
          <div className="glass p-6 border border-white/10 rounded-xl">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Building2 size={18} className="text-primary" />
              University Breakdown
            </h2>
            {universityBreakdown.length === 0 ? (
              <p className="text-white/40 text-sm">
                No university data available yet.
              </p>
            ) : (
              <div className="space-y-3">
                {universityBreakdown.slice(0, 8).map((uni) => (
                  <div key={uni.university}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-white/80 truncate flex-1">
                        {uni.university}
                      </span>
                      <span className="text-white/50 ml-2">{uni.count}</span>
                    </div>
                    <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full transition-all duration-500"
                        style={{ width: `${(uni.count / maxUniCount) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Leaderboard */}
        <div className="glass p-6 border border-white/10 rounded-xl">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Trophy size={18} className="text-primary" />
            Leaderboard
          </h2>
          {hackathon.status !== "completed" ? (
            <div className="text-center py-8 text-white/40">
              <Trophy size={32} className="mx-auto mb-3 opacity-40" />
              <p className="text-sm">
                Leaderboard will be revealed after the hackathon ends.
              </p>
            </div>
          ) : leaderboard.length === 0 ? (
            <p className="text-white/40 text-sm">No teams to display.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-white/50 border-b border-white/10">
                    <th className="pb-3 pr-4">Rank</th>
                    <th className="pb-3 pr-4">Team</th>
                    <th className="pb-3 pr-4">Project</th>
                    <th className="pb-3 text-right">Members</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((entry) => (
                    <tr key={entry.rank} className="border-b border-white/5">
                      <td className="py-3 pr-4">
                        <span
                          className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${
                            entry.rank === 1
                              ? "bg-yellow-500/20 text-yellow-400"
                              : entry.rank === 2
                                ? "bg-gray-400/20 text-gray-300"
                                : entry.rank === 3
                                  ? "bg-orange-500/20 text-orange-400"
                                  : "bg-white/5 text-white/50"
                          }`}
                        >
                          {entry.rank}
                        </span>
                      </td>
                      <td className="py-3 pr-4 text-white font-medium">
                        {entry.teamName}
                      </td>
                      <td className="py-3 pr-4 text-white/60">
                        {entry.projectIdea || "—"}
                      </td>
                      <td className="py-3 text-right text-white/60">
                        {entry.memberCount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* My Sponsorship Details */}
        <div className="glass p-6 border border-white/10 rounded-xl">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Award size={18} className="text-primary" />
            My Sponsorship Details
          </h2>
          <div className="grid md:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-white/40 mb-1">Tier</p>
              <span
                className={`text-sm px-3 py-1 rounded-full font-medium capitalize border ${tierColor(mySponsorship.tier)}`}
              >
                {mySponsorship.tier}
              </span>
            </div>
            <div>
              <p className="text-xs text-white/40 mb-1">Budget Committed</p>
              <p className="text-white font-semibold flex items-center gap-1">
                <DollarSign size={14} />
                {Number(mySponsorship.amount).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-xs text-white/40 mb-1">Status</p>
              <span
                className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${
                  mySponsorship.status === "approved"
                    ? "bg-green-500/20 text-green-400"
                    : mySponsorship.status === "paid"
                      ? "bg-blue-500/20 text-blue-400"
                      : "bg-white/10 text-white/50"
                }`}
              >
                {mySponsorship.status}
              </span>
            </div>
            <div>
              <p className="text-xs text-white/40 mb-1">Approved Date</p>
              <p className="text-white/80 text-sm">
                {formatDate(mySponsorship.createdAt)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
