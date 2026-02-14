"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import {
  Users,
  Calendar,
  Trophy,
  TrendingUp,
  Clock,
  Plus,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { organizerService } from "@/lib/api";
import { useAuthStore } from "@shared/utils/authStore";
import Link from "next/link";

export default function OverviewPage() {
  const user = useAuthStore((s) => s.user);
  const [hackathons, setHackathons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await organizerService.myHackathons();
        setHackathons(res.data?.data || []);
      } catch {
        /* empty */
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const totalParticipants = hackathons.reduce(
    (sum: number, h: any) => sum + (h._count?.participants || 0),
    0,
  );
  const totalTeams = hackathons.reduce(
    (sum: number, h: any) => sum + (h._count?.teams || 0),
    0,
  );
  const activeCount = hackathons.filter(
    (h: any) => h.status === "in_progress" || h.status === "registration_open",
  ).length;

  const stats = [
    { name: "Total Participants", value: totalParticipants, icon: Users },
    { name: "Active Hackathons", value: activeCount, icon: Calendar },
    { name: "Teams Formed", value: totalTeams, icon: Trophy },
    { name: "Total Events", value: hackathons.length, icon: TrendingUp },
  ];

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">
              Dashboard Overview
            </h1>
            <p className="text-white/60 mt-1">
              Welcome back, {user?.fullName || "Organizer"}
            </p>
          </div>
          <Link
            href="/hackathons"
            className="btn-primary flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            <span>Create New Hackathon</span>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.name}
                className="glass p-6 rounded-xl hover:bg-white/10 transition-all group"
              >
                <div className="flex items-start justify-between">
                  <div className="p-3 bg-primary/10 rounded-lg text-primary group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="text-white/60 text-sm font-medium">
                    {stat.name}
                  </h3>
                  <p className="text-2xl font-bold text-white mt-1">
                    {stat.value}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Active Hackathons */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">
                Active Hackathons
              </h2>
              <Link
                href="/hackathons"
                className="text-primary hover:text-primary-light text-sm font-medium"
              >
                View All
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {hackathons
                .filter(
                  (h: any) =>
                    h.status === "in_progress" ||
                    h.status === "registration_open",
                )
                .slice(0, 3)
                .map((hackathon: any) => {
                  const participants = hackathon._count?.participants || 0;
                  const maxP = hackathon.maxParticipants || 100;
                  const progress = Math.round((participants / maxP) * 100);
                  const daysLeft = Math.max(
                    0,
                    Math.ceil(
                      (new Date(hackathon.endDate).getTime() - Date.now()) /
                        86400000,
                    ),
                  );
                  return (
                    <div
                      key={hackathon.id}
                      className="glass p-6 rounded-xl border border-white/10 hover:border-primary/30 transition-all"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-1">
                          <h3 className="text-lg font-bold text-white">
                            {hackathon.title}
                          </h3>
                          <div className="flex items-center gap-3 text-sm text-white/60">
                            <span className="flex items-center gap-1">
                              <Users className="w-4 h-4" /> {participants}{" "}
                              participants
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" /> {daysLeft} days left
                            </span>
                          </div>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                            hackathon.status === "in_progress"
                              ? "bg-green-500/10 text-green-400 border border-green-500/20"
                              : "bg-primary/10 text-primary border border-primary/20"
                          }`}
                        >
                          {hackathon.status?.replace(/_/g, " ")}
                        </span>
                      </div>
                      <div className="mt-6 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-white/60">Registration</span>
                          <span className="text-white font-medium">
                            {progress}%
                          </span>
                        </div>
                        <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full shadow-[0_0_10px_rgba(217,76,26,0.5)]"
                            style={{ width: `${Math.min(100, progress)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              {hackathons.filter(
                (h: any) =>
                  h.status === "in_progress" ||
                  h.status === "registration_open",
              ).length === 0 && (
                <div className="text-center py-8 glass rounded-xl">
                  <Calendar className="w-12 h-12 text-white/20 mx-auto mb-3" />
                  <p className="text-white/40">No active hackathons</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Info */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white">Quick Summary</h2>
            <div className="glass rounded-xl p-5 space-y-4">
              {hackathons.slice(0, 4).map((h: any) => (
                <div
                  key={h.id}
                  className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                >
                  <div>
                    <p className="text-white font-medium text-sm">{h.title}</p>
                    <p className="text-white/40 text-xs capitalize">
                      {h.status?.replace(/_/g, " ")}
                    </p>
                  </div>
                  <span className="text-primary text-sm font-bold">
                    {h._count?.participants || 0}
                  </span>
                </div>
              ))}
            </div>

            <div className="bg-primary/10 border border-primary/20 rounded-xl p-5 space-y-2">
              <h4 className="text-primary font-bold text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Organizer Tip
              </h4>
              <p className="text-xs text-white/70 leading-relaxed">
                Keep your hackathon descriptions and requirements up to date to
                attract the right participants!
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
