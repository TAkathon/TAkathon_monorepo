"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Trophy, Medal, Users, Loader2, ChevronDown, Info } from "lucide-react";
import { organizerApi } from "@takathon/shared/api";
import { toast } from "sonner";

export default function LeaderboardPage() {
  const [hackathons, setHackathons] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [loading, setLoading] = useState(true);
  const [teams, setTeams] = useState<any[]>([]);
  const [teamsLoading, setTeamsLoading] = useState(false);

  /* Load hackathons */
  useEffect(() => {
    (async () => {
      try {
        const data = await organizerApi.listMyHackathons();
        setHackathons(data);
        // auto-select the first completed or in_progress hackathon
        const preferred = data.find(
          (h: any) => h.status === "completed" || h.status === "in_progress",
        );
        setSelectedId(preferred?.id ?? data[0]?.id ?? "");
      } catch {
        toast.error("Failed to load hackathons");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* Load teams for selected hackathon */
  useEffect(() => {
    if (!selectedId) return;
    (async () => {
      try {
        setTeamsLoading(true);
        const data = await organizerApi.getTeams(selectedId);
        setTeams(data);
      } catch {
        toast.error("Failed to load teams");
      } finally {
        setTeamsLoading(false);
      }
    })();
  }, [selectedId]);

  const selected = hackathons.find((h: any) => h.id === selectedId);
  const isCompleted = selected?.status === "completed";

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="animate-spin text-primary" size={32} />
        </div>
      </DashboardLayout>
    );
  }

  if (hackathons.length === 0) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-white">Leaderboard</h1>
            <p className="text-white/40 mt-1">
              Rankings and scores for your hackathons
            </p>
          </div>
          <div className="glass rounded-2xl border border-white/5 flex flex-col items-center justify-center py-24 text-center">
            <Trophy size={48} className="text-white/20 mb-4" />
            <p className="text-lg text-white/60">No hackathons yet</p>
            <p className="text-sm text-white/30 mt-1">
              Create a hackathon to start tracking teams and scores.
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header + Selector */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">Leaderboard</h1>
            <p className="text-white/40 mt-1">
              Rankings and scores for your hackathons
            </p>
          </div>
          <div className="relative">
            <select
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
              className="input-field pr-10 min-w-[220px]"
            >
              {hackathons.map((h: any) => (
                <option key={h.id} value={h.id}>
                  {h.title}
                </option>
              ))}
            </select>
            <ChevronDown
              size={16}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none"
            />
          </div>
        </div>

        {/* Status info */}
        {!isCompleted && (
          <div className="glass rounded-lg px-4 py-3 border border-yellow-500/20 flex items-center gap-3 text-yellow-400 text-sm">
            <Info size={16} className="shrink-0" />
            Scoring is available once the hackathon is marked as completed.
            Current status:{" "}
            <span className="font-medium capitalize">
              {selected?.status?.replace(/_/g, " ")}
            </span>
          </div>
        )}

        {/* Teams table */}
        {teamsLoading ? (
          <div className="flex items-center justify-center h-48">
            <Loader2 className="animate-spin text-primary" size={28} />
          </div>
        ) : teams.length === 0 ? (
          <div className="glass rounded-2xl border border-white/5 flex flex-col items-center justify-center py-20 text-center">
            <Users size={40} className="text-white/20 mb-3" />
            <p className="text-white/60">No teams formed yet</p>
            <p className="text-sm text-white/30 mt-1">
              Leaderboard will appear once teams submit their projects.
            </p>
          </div>
        ) : (
          <div className="glass rounded-xl border border-white/5 overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="px-6 py-4 text-xs text-white/40 font-medium uppercase tracking-wider">
                    Rank
                  </th>
                  <th className="px-6 py-4 text-xs text-white/40 font-medium uppercase tracking-wider">
                    Team
                  </th>
                  <th className="px-6 py-4 text-xs text-white/40 font-medium uppercase tracking-wider">
                    Members
                  </th>
                  <th className="px-6 py-4 text-xs text-white/40 font-medium uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-xs text-white/40 font-medium uppercase tracking-wider text-right">
                    Score
                  </th>
                </tr>
              </thead>
              <tbody>
                {teams.map((team: any, idx: number) => (
                  <tr
                    key={team.id}
                    className="border-b border-white/5 last:border-none hover:bg-white/5 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <RankBadge rank={idx + 1} />
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-white font-medium">{team.name}</p>
                      {team.description && (
                        <p className="text-xs text-white/30 mt-0.5 truncate max-w-[200px]">
                          {team.description}
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-4 text-white/60 text-sm">
                      {team.currentSize ?? team.members?.length ?? "—"} /{" "}
                      {team.maxSize ?? "—"}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs px-2 py-1 rounded-full bg-white/5 text-white/50 capitalize">
                        {team.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-white/30 text-sm">—</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Scoring note */}
            <div className="px-6 py-3 bg-white/5 text-xs text-white/30 flex items-center gap-2">
              <Info size={12} />
              Scoring will be enabled when the submissions feature is ready.
              Teams are listed by creation order.
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) {
    return (
      <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center">
        <Medal size={16} className="text-yellow-400" />
      </div>
    );
  }
  if (rank === 2) {
    return (
      <div className="w-8 h-8 rounded-full bg-gray-400/20 flex items-center justify-center">
        <Medal size={16} className="text-gray-300" />
      </div>
    );
  }
  if (rank === 3) {
    return (
      <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center">
        <Medal size={16} className="text-orange-400" />
      </div>
    );
  }
  return (
    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
      <span className="text-sm text-white/60 font-medium">{rank}</span>
    </div>
  );
}
