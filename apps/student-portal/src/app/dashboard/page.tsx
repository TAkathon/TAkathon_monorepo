"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Calendar, Users, Trophy, TrendingUp, Loader2 } from "lucide-react";
import {
  SkeletonStatsRow,
  SkeletonHackathonCard,
  SkeletonTeamCard,
} from "@takathon/shared/ui";
import api from "@takathon/shared/api";
import { useAuthStore } from "@takathon/shared/utils";

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [profileName, setProfileName] = useState(user?.fullName || "");
  const [hackathons, setHackathons] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  const [skillLevel, setSkillLevel] = useState("Loading...");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [profileRes, hackathonsRes, teamsRes] = await Promise.all([
        api.get("/api/v1/students/profile").catch(() => null),
        api
          .get("/api/v1/students/hackathons")
          .catch(() => ({ data: { data: [] } })),
        api.get("/api/v1/students/teams").catch(() => ({ data: { data: [] } })),
      ]);

      if (profileRes?.data?.data) {
        const p = profileRes.data.data;
        setProfileName(p.fullName || p.user?.fullName || user?.fullName || "");
        const skills = p.skills || [];
        if (skills.length > 0) {
          const levels: Record<string, number> = {
            beginner: 1,
            intermediate: 2,
            advanced: 3,
            expert: 4,
          };
          const avg =
            skills.reduce(
              (sum: number, s: any) => sum + (levels[s.proficiencyLevel] || 1),
              0,
            ) / skills.length;
          setSkillLevel(
            avg >= 3.5
              ? "Expert"
              : avg >= 2.5
                ? "Advanced"
                : avg >= 1.5
                  ? "Intermediate"
                  : "Beginner",
          );
        } else {
          setSkillLevel("Getting Started");
        }
      }

      setHackathons(hackathonsRes?.data?.data || []);
      setTeams(teamsRes?.data?.data || []);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const registeredHackathons = hackathons.filter((h: any) => h.isRegistered);
  const activeTeams = teams.filter((t: any) => t.status === "forming");

  const stats = [
    {
      name: "Hackathons Joined",
      value: String(registeredHackathons.length),
      icon: Calendar,
      trend: `${hackathons.length} available`,
    },
    {
      name: "Active Teams",
      value: String(activeTeams.length),
      icon: Users,
      trend: `${teams.length} total teams`,
    },
    {
      name: "Completed Projects",
      value: String(teams.filter((t: any) => t.status === "complete").length),
      icon: Trophy,
      trend: "Keep it up!",
    },
    {
      name: "Skill Level",
      value: skillLevel,
      icon: TrendingUp,
      trend: "Growing",
    },
  ];

  return (
    <DashboardLayout>
      {loading ? (
        <div className="space-y-8">
          <div className="space-y-2">
            <div className="h-8 w-64 bg-white/10 rounded animate-pulse" />
            <div className="h-4 w-96 bg-white/10 rounded animate-pulse" />
          </div>
          <SkeletonStatsRow count={4} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="h-5 w-40 bg-white/10 rounded animate-pulse" />
              <SkeletonHackathonCard />
              <SkeletonHackathonCard />
            </div>
            <div className="space-y-3">
              <div className="h-5 w-32 bg-white/10 rounded animate-pulse" />
              <SkeletonTeamCard />
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Welcome Section */}
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Welcome back,{" "}
              <span className="text-primary">
                {profileName.split(" ")[0] || "Student"}
              </span>
              !
            </h1>
            <p className="text-white/60">
              Here's what's happening with your hackathons and teams
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.name}
                  className="glass rounded-xl p-6 hover:bg-white/10 transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-4">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                  <p className="text-white/60 text-sm mb-1">{stat.name}</p>
                  <p className="text-3xl font-bold text-white mb-2">
                    {stat.value}
                  </p>
                  <p className="text-xs text-primary">{stat.trend}</p>
                </div>
              );
            })}
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Upcoming Hackathons */}
            <div className="glass rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">
                  Upcoming Hackathons
                </h2>
                <Link
                  href="/dashboard/hackathons"
                  className="text-sm text-primary hover:text-primary-light"
                >
                  View All
                </Link>
              </div>
              <div className="space-y-4">
                {hackathons.slice(0, 3).length === 0 ? (
                  <div className="text-center py-6 text-white/40">
                    <Calendar size={36} className="mx-auto mb-3 opacity-40" />
                    <p className="text-sm">No hackathons available</p>
                    <Link
                      href="/dashboard/hackathons"
                      className="text-xs text-primary hover:underline mt-2 inline-block"
                    >
                      Browse Hackathons
                    </Link>
                  </div>
                ) : (
                  hackathons.slice(0, 3).map((hackathon: any) => (
                    <div
                      key={hackathon.id}
                      className="p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-all duration-200 cursor-pointer"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-white">
                          {hackathon.title}
                        </h3>
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            hackathon.isRegistered
                              ? "bg-primary/20 text-primary"
                              : hackathon.status === "registration_open"
                                ? "bg-green-500/20 text-green-400"
                                : "bg-white/10 text-white/60"
                          }`}
                        >
                          {hackathon.isRegistered
                            ? "Registered"
                            : hackathon.status?.replace(/_/g, " ") || "Open"}
                        </span>
                      </div>
                      <p className="text-sm text-white/60 mb-2">
                        {hackathon.startDate
                          ? new Date(hackathon.startDate).toLocaleDateString()
                          : "TBD"}
                      </p>
                      <p className="text-xs text-white/40">
                        {hackathon._count?.participants || 0} participants
                        registered
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* My Teams */}
            <div className="glass rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">My Teams</h2>
                <Link
                  href="/dashboard/teams"
                  className="text-sm text-primary hover:text-primary-light"
                >
                  View All
                </Link>
              </div>
              <div className="space-y-4">
                {teams.slice(0, 3).length === 0 ? (
                  <div className="text-center py-6 text-white/40">
                    <Users size={36} className="mx-auto mb-3 opacity-40" />
                    <p className="text-sm">No teams yet</p>
                    <Link
                      href="/dashboard/teams"
                      className="text-xs text-primary hover:underline mt-2 inline-block"
                    >
                      Create or Join a Team
                    </Link>
                  </div>
                ) : (
                  teams.slice(0, 3).map((team: any) => (
                    <div
                      key={team.id}
                      className="p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-all duration-200 cursor-pointer"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-white">
                            {team.name}
                          </h3>
                          <p className="text-sm text-white/60">
                            {team.hackathon?.title || "No hackathon"}
                          </p>
                        </div>
                        <span className="px-2 py-1 text-xs bg-white/10 text-white/60 rounded-full">
                          {team.currentSize}/{team.maxSize} members
                        </span>
                      </div>
                      <p className="text-xs text-primary capitalize">
                        {team.status}
                      </p>
                    </div>
                  ))
                )}
                <Link
                  href="/dashboard/teams"
                  className="block w-full p-4 bg-primary/10 border-2 border-dashed border-primary/30 rounded-lg text-primary hover:bg-primary/20 hover:border-primary/50 transition-all duration-200 font-semibold text-center"
                >
                  + Create New Team
                </Link>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="glass rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Link
                href="/dashboard/hackathons"
                className="p-4 bg-white/5 hover:bg-white/10 rounded-lg text-left transition-all duration-200 group"
              >
                <Calendar className="w-6 h-6 text-primary mb-2 group-hover:scale-110 transition-transform" />
                <p className="font-semibold text-white mb-1">
                  Browse Hackathons
                </p>
                <p className="text-xs text-white/60">
                  Find your next challenge
                </p>
              </Link>
              <Link
                href="/dashboard/teams"
                className="p-4 bg-white/5 hover:bg-white/10 rounded-lg text-left transition-all duration-200 group"
              >
                <Users className="w-6 h-6 text-primary mb-2 group-hover:scale-110 transition-transform" />
                <p className="font-semibold text-white mb-1">Manage Teams</p>
                <p className="text-xs text-white/60">Build your dream team</p>
              </Link>
              <Link
                href="/dashboard/profile"
                className="p-4 bg-white/5 hover:bg-white/10 rounded-lg text-left transition-all duration-200 group"
              >
                <Trophy className="w-6 h-6 text-primary mb-2 group-hover:scale-110 transition-transform" />
                <p className="font-semibold text-white mb-1">Update Profile</p>
                <p className="text-xs text-white/60">Showcase your skills</p>
              </Link>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
