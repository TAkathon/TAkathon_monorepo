"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Loader2,
  Award,
  Calendar,
  Users,
  DollarSign,
  Eye,
  AlertCircle,
} from "lucide-react";
import { sponsorApi } from "@takathon/shared/api";
import type { SponsorshipSummary } from "@takathon/shared/api";
import DashboardLayout from "@/components/DashboardLayout";

function tierColor(tier: string): string {
  switch (tier) {
    case "platinum":
      return "bg-purple-500/20 text-purple-400";
    case "gold":
      return "bg-yellow-500/20 text-yellow-400";
    case "silver":
      return "bg-gray-400/20 text-gray-300";
    case "bronze":
      return "bg-orange-500/20 text-orange-400";
    default:
      return "bg-white/10 text-white/60";
  }
}

function statusColor(status: string): string {
  switch (status) {
    case "approved":
      return "bg-green-500/20 text-green-400";
    case "paid":
      return "bg-blue-500/20 text-blue-400";
    case "pending":
      return "bg-yellow-500/20 text-yellow-400";
    case "rejected":
      return "bg-red-500/20 text-red-400";
    default:
      return "bg-white/10 text-white/60";
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

export default function SponsoredPage() {
  const router = useRouter();
  const [sponsorships, setSponsorships] = useState<SponsorshipSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    fetchSponsorships();
  }, [filter]);

  async function fetchSponsorships() {
    try {
      setLoading(true);
      setError(null);
      const statusParam = filter === "all" ? undefined : filter;
      const result = await sponsorApi.listMySponsorshipsDetailed({
        status: statusParam,
        limit: 50,
      });
      setSponsorships(result.sponsorships);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load sponsorships.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">My Sponsorships</h1>
            <p className="text-white/60 mt-1">
              Monitor the hackathons you sponsor
            </p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2">
          {["all", "approved", "paid", "pending"].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filter === tab
                  ? "bg-primary text-white"
                  : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : error ? (
          <div className="glass border border-red-500/20 p-4 text-red-400 flex items-center gap-2">
            <AlertCircle size={16} />
            {error}
            <button
              onClick={fetchSponsorships}
              className="ml-auto text-sm underline"
            >
              Retry
            </button>
          </div>
        ) : sponsorships.length === 0 ? (
          <div className="text-center py-16 text-white/40">
            <Award size={48} className="mx-auto mb-4 opacity-40" />
            <p className="text-lg">No sponsorships found</p>
            <p className="text-sm mt-2">
              Your approved sponsorships will appear here.
            </p>
            <button
              onClick={() => router.push("/dashboard/opportunities")}
              className="btn-primary mt-4"
            >
              Discover Opportunities
            </button>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {sponsorships.map((s) => (
              <div
                key={s.id}
                className="glass p-5 space-y-4 hover:border-primary/30 transition-all border border-white/10 rounded-xl"
              >
                <div className="flex items-start justify-between">
                  <h3 className="text-lg font-semibold text-white truncate flex-1">
                    {s.hackathon?.title || "Untitled Hackathon"}
                  </h3>
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-medium whitespace-nowrap ml-2 ${statusColor(s.status)}`}
                  >
                    {s.status}
                  </span>
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${tierColor(s.tier)}`}
                  >
                    {s.tier} Tier
                  </span>
                  {s.hackathon?.status && (
                    <span className="text-xs px-2 py-1 rounded-full bg-white/5 text-white/50">
                      {s.hackathon.status.replace("_", " ")}
                    </span>
                  )}
                </div>

                <div className="space-y-2 text-sm text-white/60">
                  <div className="flex items-center gap-2">
                    <DollarSign size={14} />
                    <span>${Number(s.amount).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={14} />
                    <span>
                      {formatDate(s.hackathon?.startDate)} —{" "}
                      {formatDate(s.hackathon?.endDate)}
                    </span>
                  </div>
                  {s.hackathon?._count && (
                    <div className="flex items-center gap-2">
                      <Users size={14} />
                      <span>
                        {s.hackathon._count.participants ?? 0} participants ·{" "}
                        {s.hackathon._count.teams ?? 0} teams
                      </span>
                    </div>
                  )}
                </div>

                {(s.status === "approved" || s.status === "paid") &&
                  s.hackathon?.id && (
                    <button
                      onClick={() =>
                        router.push(`/dashboard/sponsored/${s.hackathon!.id}`)
                      }
                      className="btn-primary w-full flex items-center justify-center gap-2 text-sm"
                    >
                      <Eye size={14} />
                      View Details
                    </button>
                  )}
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
