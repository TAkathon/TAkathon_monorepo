"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Users,
  Calendar,
  Clock,
  MapPin,
  Globe,
  ChevronDown,
  Edit2,
  Trash2,
  Eye,
  Loader2,
} from "lucide-react";
import { organizerApi } from "@takathon/shared/api";
import type { OrganizerHackathonSummary } from "@takathon/shared/api";
import { toast } from "sonner";
import { SkeletonHackathonList } from "@takathon/shared/ui";
import Link from "next/link";

export default function HackathonsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [hackathons, setHackathons] = useState<OrganizerHackathonSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchHackathons();
  }, []);

  const fetchHackathons = async () => {
    try {
      const data = await organizerApi.listMyHackathons();
      setHackathons(data);
    } catch (error) {
      console.error("Failed to fetch hackathons:", error);
      toast.error("Failed to load hackathons");
    } finally {
      setLoading(false);
    }
  };

  const handleLifecycleAction = async (
    hackathonId: string,
    action: "publish" | "start" | "complete" | "cancel",
  ) => {
    setActionLoading(hackathonId + action);
    try {
      if (action === "publish")
        await organizerApi.publishHackathon(hackathonId);
      else if (action === "start")
        await organizerApi.startHackathon(hackathonId);
      else if (action === "complete")
        await organizerApi.completeHackathon(hackathonId);
      else if (action === "cancel")
        await organizerApi.cancelHackathon(hackathonId);
      toast.success(`Hackathon ${action}ed successfully!`);
      await fetchHackathons();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || `Failed to ${action} hackathon`,
      );
    } finally {
      setActionLoading(null);
    }
  };

  const filteredHackathons = hackathons.filter((h) => {
    const matchesSearch = h.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus =
      selectedStatus === "All" || h.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <DashboardLayout>
      {loading ? (
        <div className="space-y-8" aria-hidden="true">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="h-8 w-48 bg-white/10 rounded animate-pulse" />
              <div className="h-4 w-64 bg-white/10 rounded animate-pulse mt-2" />
            </div>
            <div className="h-10 w-44 bg-white/10 rounded animate-pulse" />
          </div>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 h-10 bg-white/10 rounded animate-pulse" />
            <div className="h-10 w-36 bg-white/10 rounded animate-pulse" />
          </div>
          <SkeletonHackathonList count={4} />
        </div>
      ) : (
        <div className="space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white">My Hackathons</h1>
              <p className="text-white/60 mt-1">
                Manage and monitor your organized events
              </p>
            </div>
            <Link href="/hackathons/create">
              <button className="btn-primary flex items-center justify-center gap-2">
                <Plus className="w-5 h-5" />
                <span>Create Hackathon</span>
              </button>
            </Link>
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
                placeholder="Search hackathons..."
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
                <option value="draft">Draft</option>
                <option value="registration_open">Registration Open</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-white/40">
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Hackathons Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHackathons.length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center py-20 glass rounded-2xl border border-white/5">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                  <Calendar className="w-10 h-10 text-primary/60" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  {searchQuery || selectedStatus !== "All"
                    ? "No hackathons match your filters"
                    : "No hackathons yet"}
                </h3>
                <p className="text-white/40 text-center max-w-sm mb-6">
                  {searchQuery || selectedStatus !== "All"
                    ? "Try clearing your search or changing the status filter."
                    : "Create your first hackathon and start bringing people together."}
                </p>
                {searchQuery || selectedStatus !== "All" ? (
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedStatus("All");
                    }}
                    className="px-5 py-2.5 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 transition-all text-sm font-medium"
                  >
                    Clear Filters
                  </button>
                ) : (
                  <Link href="/hackathons/create">
                    <button className="btn-primary flex items-center gap-2">
                      <Plus className="w-4 h-4" />
                      Create Your First Hackathon
                    </button>
                  </Link>
                )}
              </div>
            )}
            {filteredHackathons.map((hackathon) => (
              <div
                key={hackathon.id}
                className="glass rounded-xl overflow-hidden border border-white/10 hover:border-primary/30 transition-all group flex flex-col"
              >
                {/* Image Placeholder */}
                <div className="relative h-48 bg-white/5 overflow-hidden">
                  {hackathon.bannerUrl ? (
                    <img
                      src={hackathon.bannerUrl}
                      alt={hackathon.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-60 group-hover:opacity-80"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-white/5 text-white/20">
                      <Calendar className="w-12 h-12" />
                    </div>
                  )}
                  <div className="absolute top-4 left-4">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        hackathon.status === "in_progress"
                          ? "bg-green-500 text-white shadow-[0_0_10px_rgba(34,197,94,0.5)]"
                          : hackathon.status === "registration_open"
                            ? "bg-primary text-white"
                            : "bg-white/20 text-white backdrop-blur-md"
                      }`}
                    >
                      {hackathon.status.replace("_", " ")}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4 flex-1 flex flex-col">
                  <div>
                    <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors line-clamp-1">
                      {hackathon.title}
                    </h3>
                    <div className="flex items-center gap-4 mt-2 text-sm text-white/40">
                      <span className="flex items-center gap-1">
                        {hackathon.isVirtual ? (
                          <Globe className="w-4 h-4" />
                        ) : (
                          <MapPin className="w-4 h-4" />
                        )}
                        {hackathon.isVirtual
                          ? "Virtual"
                          : hackathon.location || "TBD"}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {hackathon.startDate
                          ? new Date(hackathon.startDate).toLocaleDateString()
                          : "TBD"}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-white/40">Max Participants</span>
                      <span className="text-white font-medium">
                        {hackathon.maxParticipants || "Unlimited"}
                      </span>
                    </div>
                  </div>

                  <div className="pt-4 mt-auto space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <Link
                        href={`/hackathons/${hackathon.id}`}
                        className="w-full"
                      >
                        <button className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-all text-sm font-medium border border-white/10">
                          <Eye className="w-4 h-4" />
                          View
                        </button>
                      </Link>
                      {[
                        "draft",
                        "registration_open",
                        "registration_closed",
                      ].includes(hackathon.status) && (
                        <Link
                          href={`/hackathons/${hackathon.id}/edit`}
                          className="w-full"
                        >
                          <button className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-all text-sm font-medium border border-primary/20">
                            <Edit2 className="w-4 h-4" />
                            Edit
                          </button>
                        </Link>
                      )}
                    </div>
                    {/* Lifecycle action buttons */}
                    <div className="flex flex-wrap gap-2">
                      {hackathon.status === "draft" && (
                        <button
                          disabled={actionLoading === hackathon.id + "publish"}
                          onClick={() =>
                            handleLifecycleAction(hackathon.id, "publish")
                          }
                          className="flex-1 px-3 py-1.5 bg-green-500/10 hover:bg-green-500/20 text-green-400 rounded-lg transition-all text-xs font-medium border border-green-500/20 disabled:opacity-50"
                        >
                          {actionLoading === hackathon.id + "publish" ? (
                            <Loader2 className="w-3 h-3 animate-spin mx-auto" />
                          ) : (
                            "Publish"
                          )}
                        </button>
                      )}
                      {["registration_open", "registration_closed"].includes(
                        hackathon.status,
                      ) && (
                        <button
                          disabled={actionLoading === hackathon.id + "start"}
                          onClick={() =>
                            handleLifecycleAction(hackathon.id, "start")
                          }
                          className="flex-1 px-3 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-lg transition-all text-xs font-medium border border-blue-500/20 disabled:opacity-50"
                        >
                          {actionLoading === hackathon.id + "start" ? (
                            <Loader2 className="w-3 h-3 animate-spin mx-auto" />
                          ) : (
                            "Start"
                          )}
                        </button>
                      )}
                      {hackathon.status === "in_progress" && (
                        <button
                          disabled={actionLoading === hackathon.id + "complete"}
                          onClick={() =>
                            handleLifecycleAction(hackathon.id, "complete")
                          }
                          className="flex-1 px-3 py-1.5 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 rounded-lg transition-all text-xs font-medium border border-purple-500/20 disabled:opacity-50"
                        >
                          {actionLoading === hackathon.id + "complete" ? (
                            <Loader2 className="w-3 h-3 animate-spin mx-auto" />
                          ) : (
                            "Complete"
                          )}
                        </button>
                      )}
                      {!["completed", "cancelled"].includes(
                        hackathon.status,
                      ) && (
                        <button
                          disabled={actionLoading === hackathon.id + "cancel"}
                          onClick={() =>
                            handleLifecycleAction(hackathon.id, "cancel")
                          }
                          className="flex-1 px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-all text-xs font-medium border border-red-500/20 disabled:opacity-50"
                        >
                          {actionLoading === hackathon.id + "cancel" ? (
                            <Loader2 className="w-3 h-3 animate-spin mx-auto" />
                          ) : (
                            "Cancel"
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Create New Card */}
            <Link href="/hackathons/create">
              <button className="w-full h-full glass rounded-xl border-2 border-dashed border-white/10 hover:border-primary/50 hover:bg-primary/5 transition-all group flex flex-col items-center justify-center p-8 gap-4 min-h-[400px]">
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-white/40 group-hover:text-primary group-hover:bg-primary/10 transition-all">
                  <Plus className="w-8 h-8" />
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-bold text-white group-hover:text-primary transition-all">
                    Host New Event
                  </h3>
                  <p className="text-sm text-white/40 mt-1">
                    Start organizing your next big hackathon
                  </p>
                </div>
              </button>
            </Link>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
