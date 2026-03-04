"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import {
  BarChart3,
  Users,
  TrendingUp,
  Loader2,
  AlertCircle,
  ChevronDown,
  UserCheck,
  UserMinus,
  Percent,
  Handshake,
} from "lucide-react";
import { organizerApi } from "@takathon/shared/api";
import { toast } from "sonner";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

/* ── Types ────────────────────────────────────────────────────── */
interface AnalyticsData {
  hackathonId: string;
  participants: {
    total: number;
    registered: number;
    inTeam: number;
    withdrawn: number;
  };
  teams: {
    total: number;
    forming: number;
    complete: number;
    averageSize: number;
  };
  sponsors: { total: number };
  participantsWithoutTeam: number;
  skillDistribution: Record<string, number>;
  categoryDistribution: Record<string, number>;
}

const PIE_COLORS = [
  "#D94C1A",
  "#F59E0B",
  "#10B981",
  "#3B82F6",
  "#8B5CF6",
  "#EC4899",
  "#6366F1",
  "#14B8A6",
];

export default function AnalyticsPage() {
  const [hackathons, setHackathons] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* ── Load hackathons ─────────────────────────────────────── */
  useEffect(() => {
    (async () => {
      try {
        const data = await organizerApi.listMyHackathons();
        setHackathons(data);
        if (data.length > 0) setSelectedId(data[0].id);
      } catch {
        toast.error("Failed to load hackathons");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* ── Load analytics when selection changes ───────────────── */
  useEffect(() => {
    if (!selectedId) return;
    (async () => {
      try {
        setAnalyticsLoading(true);
        setError(null);
        const data = await organizerApi.getAnalytics(selectedId);
        setAnalytics(data);
      } catch {
        setError("Failed to load analytics for this hackathon.");
      } finally {
        setAnalyticsLoading(false);
      }
    })();
  }, [selectedId]);

  /* ── Derived chart data ──────────────────────────────────── */
  const skillData = analytics
    ? Object.entries(analytics.skillDistribution)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10)
    : [];

  const categoryData = analytics
    ? Object.entries(analytics.categoryDistribution)
        .map(([name, count]) => ({ name: name.replace(/_/g, " "), count }))
        .sort((a, b) => b.count - a.count)
    : [];

  const teamFormationRate =
    analytics && analytics.participants.total > 0
      ? Math.round(
          (analytics.participants.inTeam / analytics.participants.total) * 100,
        )
      : 0;

  const statusData = analytics
    ? [
        { name: "Registered", value: analytics.participants.registered },
        { name: "In Team", value: analytics.participants.inTeam },
        { name: "Withdrawn", value: analytics.participants.withdrawn },
      ].filter((d) => d.value > 0)
    : [];

  /* ── Render ──────────────────────────────────────────────── */
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
            <h1 className="text-3xl font-bold text-white">Analytics</h1>
            <p className="text-white/40 mt-1">
              Performance insights across your events
            </p>
          </div>
          <div className="glass rounded-2xl border border-white/5 flex flex-col items-center justify-center py-24 text-center">
            <BarChart3 size={48} className="text-white/20 mb-4" />
            <p className="text-lg text-white/60">No hackathons yet</p>
            <p className="text-sm text-white/30 mt-1">
              Create a hackathon to start seeing analytics.
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* ── Header + Selector ─────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">Analytics</h1>
            <p className="text-white/40 mt-1">
              Performance insights across your events
            </p>
          </div>
          <div className="relative">
            <select
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
              className="input-field pr-10 min-w-[220px]"
            >
              {hackathons.map((h) => (
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

        {/* ── Loading / Error ───────────────────────────────── */}
        {analyticsLoading && (
          <div className="flex items-center justify-center h-48">
            <Loader2 className="animate-spin text-primary" size={28} />
          </div>
        )}

        {error && !analyticsLoading && (
          <div className="glass p-6 rounded-xl border border-red-500/20 text-red-400 flex items-center gap-3">
            <AlertCircle size={20} />
            {error}
          </div>
        )}

        {analytics && !analyticsLoading && (
          <>
            {/* ── Stat Cards ────────────────────────────────── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                icon={Users}
                label="Total Participants"
                value={analytics.participants.total}
              />
              <StatCard
                icon={TrendingUp}
                label="Teams"
                value={analytics.teams.total}
                sub={`Avg size: ${analytics.teams.averageSize}`}
              />
              <StatCard
                icon={Percent}
                label="Team Formation"
                value={`${teamFormationRate}%`}
                sub={`${analytics.participants.inTeam} of ${analytics.participants.total}`}
              />
              <StatCard
                icon={Handshake}
                label="Sponsors"
                value={analytics.sponsors.total}
              />
            </div>

            {/* ── Participant Status Row ────────────────────── */}
            <div className="grid grid-cols-3 gap-4">
              <MiniStat
                icon={UserCheck}
                label="Registered"
                value={analytics.participants.registered}
                color="text-green-400"
              />
              <MiniStat
                icon={Users}
                label="In Team"
                value={analytics.participants.inTeam}
                color="text-blue-400"
              />
              <MiniStat
                icon={UserMinus}
                label="Withdrawn"
                value={analytics.participants.withdrawn}
                color="text-red-400"
              />
            </div>

            {/* ── Charts Row ────────────────────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Skill Distribution Bar Chart */}
              <div className="glass rounded-xl border border-white/5 p-6">
                <h3 className="text-white font-semibold mb-4">
                  Top Skills (Participants)
                </h3>
                {skillData.length >= 2 ? (
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart
                      data={skillData}
                      layout="vertical"
                      margin={{ left: 10, right: 20 }}
                    >
                      <XAxis type="number" stroke="#ffffff30" />
                      <YAxis
                        dataKey="name"
                        type="category"
                        width={100}
                        tick={{ fill: "#ffffff80", fontSize: 12 }}
                        stroke="#ffffff10"
                      />
                      <Tooltip
                        contentStyle={{
                          background: "#1A0A00",
                          border: "1px solid rgba(255,255,255,.1)",
                          borderRadius: 8,
                          color: "#fff",
                        }}
                      />
                      <Bar
                        dataKey="count"
                        fill="#D94C1A"
                        radius={[0, 4, 4, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <ChartEmpty label="Not enough skill data yet" />
                )}
              </div>

              {/* Participant Status Pie */}
              <div className="glass rounded-xl border border-white/5 p-6">
                <h3 className="text-white font-semibold mb-4">
                  Participant Status
                </h3>
                {statusData.length >= 1 ? (
                  <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                      <Pie
                        data={statusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={3}
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) =>
                          `${name} ${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {statusData.map((_, i) => (
                          <Cell
                            key={i}
                            fill={PIE_COLORS[i % PIE_COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          background: "#1A0A00",
                          border: "1px solid rgba(255,255,255,.1)",
                          borderRadius: 8,
                          color: "#fff",
                        }}
                      />
                      <Legend
                        wrapperStyle={{ color: "#ffffff80", fontSize: 12 }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <ChartEmpty label="No participants yet" />
                )}
              </div>
            </div>

            {/* ── Category Distribution ─────────────────────── */}
            {categoryData.length >= 2 && (
              <div className="glass rounded-xl border border-white/5 p-6">
                <h3 className="text-white font-semibold mb-4">
                  Skills by Category
                </h3>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={categoryData}>
                    <XAxis
                      dataKey="name"
                      tick={{ fill: "#ffffff80", fontSize: 12 }}
                      stroke="#ffffff10"
                    />
                    <YAxis stroke="#ffffff30" />
                    <Tooltip
                      contentStyle={{
                        background: "#1A0A00",
                        border: "1px solid rgba(255,255,255,.1)",
                        borderRadius: 8,
                        color: "#fff",
                      }}
                    />
                    <Bar dataKey="count" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* ── Teams Breakdown ───────────────────────────── */}
            <div className="glass rounded-xl border border-white/5 p-6">
              <h3 className="text-white font-semibold mb-4">Teams Breakdown</h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-white">
                    {analytics.teams.forming}
                  </p>
                  <p className="text-xs text-white/40 mt-1">Forming</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">
                    {analytics.teams.complete}
                  </p>
                  <p className="text-xs text-white/40 mt-1">Complete</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">
                    {analytics.teams.averageSize}
                  </p>
                  <p className="text-xs text-white/40 mt-1">Avg Size</p>
                </div>
              </div>
            </div>

            {/* ── Note ──────────────────────────────────────── */}
            <p className="text-xs text-white/30 text-center">
              Analytics update in real-time as participants register and form
              teams.
            </p>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}

/* ── Sub-components ────────────────────────────────────────── */

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
}: {
  icon: any;
  label: string;
  value: string | number;
  sub?: string;
}) {
  return (
    <div className="glass rounded-xl p-5 border border-white/5">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon size={18} className="text-primary" />
        </div>
      </div>
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="text-xs text-white/40 mt-0.5">{label}</p>
      {sub && <p className="text-xs text-white/30 mt-0.5">{sub}</p>}
    </div>
  );
}

function MiniStat({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: any;
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="glass rounded-lg p-4 border border-white/5 flex items-center gap-3">
      <Icon size={18} className={color} />
      <div>
        <p className="text-lg font-bold text-white">{value}</p>
        <p className="text-xs text-white/40">{label}</p>
      </div>
    </div>
  );
}

function ChartEmpty({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-[280px] text-white/30">
      <BarChart3 size={32} className="mb-2 opacity-40" />
      <p className="text-sm">{label}</p>
    </div>
  );
}
