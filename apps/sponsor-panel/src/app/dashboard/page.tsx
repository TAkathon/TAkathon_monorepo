"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import {
  Users,
  Calendar,
  Clock,
  TrendingUp,
  ChevronRight,
  Target,
  Loader2,
  DollarSign,
} from "lucide-react";
import { sponsorService } from "@/lib/api";
import { useAuthStore } from "@shared/utils";

export default function SponsorDashboard() {
  const { user } = useAuthStore();
  const [sponsorships, setSponsorships] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await sponsorService.mySponsorships();
        setSponsorships(res.data?.data?.sponsorships || res.data?.data || []);
      } catch {
        /* empty */
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const activeCount = sponsorships.filter(
    (s: any) => s.status === "active" || s.status === "confirmed",
  ).length;
  const pendingCount = sponsorships.filter(
    (s: any) => s.status === "pending",
  ).length;
  const totalAmount = sponsorships.reduce(
    (acc: number, s: any) => acc + (Number(s.amount) || 0),
    0,
  );

  const stats = [
    {
      name: "Total Sponsorships",
      value: String(sponsorships.length),
      icon: Calendar,
      change: "",
    },
    { name: "Active", value: String(activeCount), icon: Target, change: "" },
    { name: "Pending", value: String(pendingCount), icon: Clock, change: "" },
    {
      name: "Total Invested",
      value: `$${totalAmount.toLocaleString()}`,
      icon: DollarSign,
      change: "",
    },
  ];

  const quickActions = [
    {
      title: "Find Events",
      description: "Browse upcoming hackathons looking for sponsors.",
      icon: Target,
      href: "/dashboard/opportunities",
      color: "bg-primary/10 text-primary",
    },
    {
      title: "Review Sponsorships",
      description: "Check your active and past sponsorships.",
      icon: Users,
      href: "/dashboard/requests",
      color: "bg-blue-500/10 text-blue-500",
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome back{user?.fullName ? `, ${user.fullName}` : ""}!
          </h1>
          <p className="text-white/60">
            Here's an overview of your sponsorship activities.
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-48">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={stat.name}
                    className="glass p-6 rounded-2xl hover:border-primary/30 transition-all duration-300"
                  >
                    <div className="flex items-start justify-between">
                      <div className="p-3 rounded-xl bg-white/5">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                    </div>
                    <div className="mt-4">
                      <p className="text-sm text-white/60">{stat.name}</p>
                      <h3 className="text-2xl font-bold text-white mt-1">
                        {stat.value}
                      </h3>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Recent Sponsorships */}
              <div className="lg:col-span-2 space-y-6">
                <div className="glass rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-white">
                      Recent Sponsorships
                    </h2>
                    <a
                      href="/dashboard/requests"
                      className="text-sm text-primary hover:text-primary-light transition-colors"
                    >
                      View All
                    </a>
                  </div>
                  {sponsorships.length === 0 ? (
                    <p className="text-white/40 text-sm py-8 text-center">
                      No sponsorships yet. Browse opportunities to get started.
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {sponsorships.slice(0, 4).map((s: any) => (
                        <div
                          key={s.id}
                          className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-all"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                              {(s.hackathon?.title || "H").charAt(0)}
                            </div>
                            <div>
                              <h4 className="text-white font-medium">
                                {s.hackathon?.title || "Hackathon"}
                              </h4>
                              <p className="text-xs text-white/40">
                                {s.tier} tier • $
                                {Number(s.amount || 0).toLocaleString()}
                              </p>
                            </div>
                          </div>
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${
                              s.status === "active" || s.status === "confirmed"
                                ? "bg-green-500/10 text-green-400"
                                : s.status === "pending"
                                  ? "bg-amber-500/10 text-amber-400"
                                  : "bg-white/10 text-white/60"
                            }`}
                          >
                            {s.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-white">Quick Actions</h2>
                <div className="space-y-4">
                  {quickActions.map((action) => {
                    const Icon = action.icon;
                    return (
                      <a
                        key={action.title}
                        href={action.href}
                        className="flex items-center gap-4 p-4 rounded-2xl glass hover:border-primary/30 group transition-all"
                      >
                        <div className={`p-3 rounded-xl ${action.color}`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-white font-medium">
                            {action.title}
                          </h3>
                          <p className="text-xs text-white/40">
                            {action.description}
                          </p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-white/20 group-hover:text-primary transition-colors" />
                      </a>
                    );
                  })}
                </div>

                {/* Summary Card */}
                <div className="glass rounded-2xl p-6 bg-gradient-to-br from-primary/10 to-transparent border-primary/20">
                  <h3 className="text-white font-bold mb-2">Total Invested</h3>
                  <div className="flex items-end gap-2 mb-4">
                    <span className="text-3xl font-bold text-white">
                      ${totalAmount.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-xs text-white/40">
                    Across {sponsorships.length} sponsorship
                    {sponsorships.length !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
