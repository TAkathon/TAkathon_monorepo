"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import {
  Search,
  Filter,
  Users,
  User,
  MessageSquare,
  ChevronDown,
  CheckCircle2,
  Shield,
  Loader2,
  Calendar,
} from "lucide-react";
import { organizerService } from "@/lib/api";

export default function TeamsPage() {
  const [hackathons, setHackathons] = useState<any[]>([]);
  const [selectedHackathon, setSelectedHackathon] = useState("");
  const [teams, setTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await organizerService.myHackathons();
        const list = res.data?.data || [];
        setHackathons(list);
        if (list.length > 0) setSelectedHackathon(list[0].id);
      } catch {
        /* empty */
      }
    })();
  }, []);

  useEffect(() => {
    if (selectedHackathon) fetchTeams();
  }, [selectedHackathon]);

  const fetchTeams = async () => {
    setLoading(true);
    try {
      const res = await organizerService.listTeams(selectedHackathon);
      setTeams(res.data?.data?.teams || res.data?.data || []);
    } catch {
      setTeams([]);
    } finally {
      setLoading(false);
    }
  };

  const filtered = teams.filter((t: any) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      t.name?.toLowerCase().includes(q) ||
      t.projectDescription?.toLowerCase().includes(q)
    );
  });

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">Teams</h1>
            <p className="text-white/60 mt-1">
              View team formations and projects
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by team name or project..."
              className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:border-primary/50 transition-all"
            />
          </div>
          <div className="relative min-w-[200px]">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <select
              value={selectedHackathon}
              onChange={(e) => setSelectedHackathon(e.target.value)}
              className="w-full pl-11 pr-8 py-3 bg-white/5 border border-white/10 rounded-lg text-white appearance-none cursor-pointer focus:outline-none focus:border-primary/50 transition-all"
            >
              {hackathons.map((h: any) => (
                <option key={h.id} value={h.id}>
                  {h.title}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-48">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 glass rounded-xl">
            <Users className="w-16 h-16 text-white/20 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white/60 mb-2">
              No teams found
            </h3>
            <p className="text-white/40">
              Teams will appear here once participants form them
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((team: any) => {
              const members = team.members || [];
              const captain = members.find((m: any) => m.role === "captain");
              return (
                <div
                  key={team.id}
                  className="glass rounded-xl p-6 border border-white/10 hover:border-primary/30 transition-all group flex flex-col"
                >
                  <div className="flex items-start justify-between">
                    <div className="p-3 bg-primary/10 rounded-lg text-primary">
                      <Users className="w-6 h-6" />
                    </div>
                  </div>

                  <div className="mt-4">
                    <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors">
                      {team.name}
                    </h3>
                    <p className="text-sm text-white/40 mt-1 capitalize">
                      {team.status?.replace(/_/g, " ")}
                    </p>
                  </div>

                  <div className="mt-6 space-y-4 flex-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-white/60">Members</span>
                      <div className="flex items-center gap-1.5">
                        <div className="flex -space-x-2">
                          {members.slice(0, 4).map((m: any, i: number) => (
                            <div
                              key={i}
                              className="w-6 h-6 rounded-full bg-primary/20 border border-dark flex items-center justify-center text-[10px] text-primary font-bold"
                            >
                              {(m.user?.fullName || "?").charAt(0)}
                            </div>
                          ))}
                          {team.maxMembers &&
                            members.length < team.maxMembers &&
                            [
                              ...Array(
                                Math.min(2, team.maxMembers - members.length),
                              ),
                            ].map((_, i) => (
                              <div
                                key={`e${i}`}
                                className="w-6 h-6 rounded-full bg-white/5 border border-dark flex items-center justify-center text-[10px] text-white/20"
                              >
                                +
                              </div>
                            ))}
                        </div>
                        <span className="text-white font-medium ml-1">
                          {members.length}/{team.maxMembers || "∞"}
                        </span>
                      </div>
                    </div>

                    {team.description && (
                      <div className="p-3 bg-white/5 rounded-lg border border-white/5">
                        <div className="text-[10px] uppercase tracking-wider text-white/40 font-bold mb-1">
                          Description
                        </div>
                        <div className="text-sm text-white/80 font-medium line-clamp-2">
                          {team.description}
                        </div>
                      </div>
                    )}

                    {captain && (
                      <div className="flex items-center gap-2 text-xs">
                        <Shield className="w-3.5 h-3.5 text-primary" />
                        <span className="text-white/60">Captain:</span>
                        <span className="text-white font-medium">
                          {captain.user?.fullName}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="mt-6 pt-6 border-t border-white/10 flex items-center justify-between">
                    <span
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium capitalize ${
                        team.status === "complete"
                          ? "bg-green-500/10 text-green-400"
                          : "bg-yellow-500/10 text-yellow-400"
                      }`}
                    >
                      {team.status === "complete" ? (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      ) : (
                        <Users className="w-3.5 h-3.5" />
                      )}
                      {team.status?.replace(/_/g, " ")}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
