"use client";

import { useState, useEffect, useMemo } from "react";
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
  Activity,
  Target,
  Eye,
  Globe,
  ArrowUpRight,
  Clock,
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
  "#FF5C00",
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
        toast.error("Failed to load operations");
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
        setError("FAILED TO RETRIEVE MISSION INTEL.");
      } finally {
        setAnalyticsLoading(false);
      }
    })();
  }, [selectedId]);

  /* ── Derived chart data ──────────────────────────────────── */
  const skillData = useMemo(() => {
    if (!analytics) return [];
    return Object.entries(analytics.skillDistribution)
        .map(([name, count]) => ({ name: name.toUpperCase(), count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 8);
  }, [analytics]);

  const teamFormationRate =
    analytics && analytics.participants.total > 0
      ? Math.round(
          (analytics.participants.inTeam / analytics.participants.total) * 100,
        )
      : 0;

  const statusData = useMemo(() => {
    if (!analytics) return [];
    return [
        { name: "REGISTERED", value: analytics.participants.registered },
        { name: "IN TEAM", value: analytics.participants.inTeam },
        { name: "WITHDRAWN", value: analytics.participants.withdrawn },
      ].filter((d) => d.value > 0);
  }, [analytics]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-96">
          <Loader2 className="animate-spin text-primary mb-4" size={40} />
          <div className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">INITIALIZING INTEL LINK...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8 pb-12 relative">
         {/* Background Floating Objects */}
         <div className="absolute top-20 left-10 w-32 h-32 bg-primary/20 rounded-full blur-[80px] pointer-events-none"></div>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
                <div className="flex items-center relative mb-1">
                    <h1 className="text-5xl md:text-6xl font-black italic tracking-tighter uppercase text-white">
                        <span className="text-white">INTEL DASHBOARD</span>
                    </h1>
                    <div className="flex ml-4 gap-1 opacity-60 mt-2">
                        <div className="w-8 h-1 bg-primary"></div>
                        <div className="w-2 h-1 bg-primary"></div>
                        <div className="w-1 h-1 bg-primary"></div>
                    </div>
                </div>
                <div className="flex items-center gap-2 mt-4 mb-2">
                    <div className="w-2 h-2 bg-green-500 rounded-sm" />
                    <span className="text-[10px] text-white/60 uppercase tracking-[0.2em] font-bold">
                        EVENT ANALYTICS AND PERFORMANCE INTELLIGENCE
                    </span>
                </div>
            </div>

            <div className="relative min-w-[240px] mt-4">
                <select
                    value={selectedId}
                    onChange={(e) => setSelectedId(e.target.value)}
                    className="w-full pl-4 pr-10 py-3 bg-[#080808] border border-white/10 text-[10px] font-bold uppercase tracking-widest text-white focus:outline-none focus:border-primary/50 transition-all appearance-none cursor-pointer rounded-sm"
                >
                    {hackathons.map((h) => (
                        <option key={h.id} value={h.id}>
                            {h.title.toUpperCase()}
                        </option>
                    ))}
                    {hackathons.length === 0 && <option value="">NO MISSION DATA</option>}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
            </div>
        </div>

        {analyticsLoading ? (
            <div className="flex flex-col items-center justify-center py-24 border border-white/5 bg-[#080808] rounded-sm">
                <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
                <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest">DECRYPTING PACKETS...</div>
            </div>
        ) : error ? (
            <div className="bg-[#080808] border border-red-500/20 p-12 rounded-sm text-center">
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <div className="text-sm font-bold text-red-400 uppercase tracking-widest">{error}</div>
            </div>
        ) : analytics ? (
            <>
                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <AnalyticsStatCard 
                        icon={Users}
                        label="TOTAL RECRUITS"
                        value={analytics.participants.total}
                        change="+12%"
                    />
                    <AnalyticsStatCard 
                        icon={TrendingUp}
                        label="DEPLOYED SQUADS"
                        value={analytics.teams.total}
                        change={`AVG ${analytics.teams.averageSize}`}
                        isChangePositive
                    />
                    <AnalyticsStatCard 
                        icon={Percent}
                        label="FORMATION RATE"
                        value={`${teamFormationRate}%`}
                        change={`${analytics.participants.inTeam} IN TEAM`}
                        isChangePositive={teamFormationRate > 50}
                    />
                    <AnalyticsStatCard 
                        icon={Handshake}
                        label="LOGISTICS ASSETS"
                        value={analytics.sponsors.total}
                        change="ACTIVE"
                        isChangePositive
                    />
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Primary Distribution (Bar Chart) */}
                    <div className="relative p-8 border border-white/5 bg-[#080808] rounded-sm group hover:border-white/10 transition-all duration-300">
                        <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
                            <h2 className="text-xl font-black italic tracking-tighter text-white flex items-center gap-2 uppercase">
                                <BarChart3 className="w-5 h-5 text-primary" />
                                SKILL RADAR
                            </h2>
                        </div>
                        <div className="h-72">
                            {skillData.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={skillData} layout="vertical" margin={{ left: -20, right: 30 }}>
                                        <XAxis type="number" hide />
                                        <YAxis 
                                            dataKey="name" 
                                            type="category" 
                                            tick={{ fill: "#ffffff40", fontSize: 9, fontWeight: 700 }}
                                            width={100}
                                            axisLine={false}
                                            tickLine={false}
                                        />
                                        <Tooltip 
                                            contentStyle={{ 
                                                backgroundColor: "#0a0a0a", 
                                                border: "1px solid rgba(255,92,0,0.2)",
                                                borderRadius: "2px",
                                                fontSize: "10px",
                                                fontWeight: 700
                                            }}
                                            itemStyle={{ color: "#fff" }}
                                            cursor={{ fill: "rgba(255,255,255,0.02)" }}
                                        />
                                        <Bar 
                                            dataKey="count" 
                                            fill="url(#barGradient)" 
                                            radius={[0, 2, 2, 0]} 
                                            barSize={12}
                                        />
                                        <defs>
                                            <linearGradient id="barGradient" x1="0" y1="0" x2="1" y2="0">
                                                <stop offset="0%" stopColor="rgba(255,92,0,0.2)" />
                                                <stop offset="100%" stopColor="#FF5C00" />
                                            </linearGradient>
                                        </defs>
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-white/20">
                                    <BarChart3 className="w-12 h-12 mb-2 opacity-10" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest">MINIMAL DATA DETECTED</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Status Composition (Pie Chart) */}
                    <div className="relative p-8 border border-white/5 bg-[#080808] rounded-sm group hover:border-white/10 transition-all duration-300">
                        <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
                            <h2 className="text-xl font-black italic tracking-tighter text-white flex items-center gap-2 uppercase">
                                <Activity className="w-5 h-5 text-primary" />
                                STATUS COMPOSITION
                            </h2>
                        </div>
                        <div className="h-72">
                            {statusData.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={statusData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={90}
                                            paddingAngle={8}
                                            dataKey="value"
                                            stroke="none"
                                        >
                                            {statusData.map((_, index) => (
                                                <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip 
                                            contentStyle={{ 
                                                backgroundColor: "#0a0a0a", 
                                                border: "1px solid rgba(255,92,0,0.2)",
                                                borderRadius: "2px",
                                                fontSize: "10px",
                                                fontWeight: 700
                                            }}
                                        />
                                        <Legend 
                                            verticalAlign="bottom" 
                                            height={36}
                                            formatter={(value) => <span className="text-[9px] font-bold text-white/40 tracking-widest px-2 uppercase">{value}</span>}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-white/20">
                                    <Activity className="w-12 h-12 mb-2 opacity-10" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest">NO ASSETS REGISTERED</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Team Breakdown Mini Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-6 border border-white/5 bg-[#080808] rounded-sm text-center space-y-2">
                        <div className="text-3xl font-black text-white italic tracking-tighter">{analytics.teams.forming}</div>
                        <div className="text-[10px] text-white/40 font-bold uppercase tracking-widest">SQUADS FORMING</div>
                    </div>
                    <div className="p-6 border border-white/5 bg-[#080808] rounded-sm text-center space-y-2">
                        <div className="text-3xl font-black text-primary italic tracking-tighter">{analytics.teams.complete}</div>
                        <div className="text-[10px] text-white/40 font-bold uppercase tracking-widest">SQUADS READY</div>
                    </div>
                    <div className="p-6 border border-white/5 bg-[#080808] rounded-sm text-center space-y-2">
                        <div className="text-3xl font-black text-white italic tracking-tighter">{analytics.teams.averageSize}</div>
                        <div className="text-[10px] text-white/40 font-bold uppercase tracking-widest">AVG SQUAD SIZE</div>
                    </div>
                </div>

                {/* Activity Feed (Placeholder/Static based on mock) */}
                <div className="relative border border-white/5 bg-[#080808] rounded-sm transition-all duration-300 overflow-hidden">
                    <div className="px-8 py-6 border-b border-white/5 bg-white/[0.02]">
                        <h2 className="text-xl font-black italic tracking-tighter text-white uppercase flex items-center gap-2">
                            <Clock className="w-5 h-5 text-primary" />
                            LIVE MISSION FEED
                        </h2>
                    </div>
                    <div className="divide-y divide-white/5">
                        <ActivityItem action="OPERATIVE JOINED" detail="RECRUIT ENROLLED IN MISSION PARAMETERS" time="JUST NOW" />
                        <ActivityItem action="SQUAD DEPLOYED" detail="NEW TEAM UNIT INITIALIZED AND NAMED" time="14 MIN AGO" />
                        <ActivityItem action="INTEL UPDATED" detail="MISSION CONTENT AND ASSETS SYNCHRONIZED" time="1 HOUR AGO" />
                    </div>
                </div>
            </>
        ) : (
            <div className="py-24 text-center">
                <Target className="w-16 h-16 text-white/10 mx-auto mb-4" />
                <div className="text-xl font-black italic text-white/40 uppercase tracking-tighter">SELECT MISSION TO VIEW ANALYTICS</div>
            </div>
        )}
      </div>
    </DashboardLayout>
  );
}

function AnalyticsStatCard({ icon: Icon, label, value, change, isChangePositive }: any) {
    return (
        <div className="relative p-6 border border-white/5 bg-[#080808] rounded-sm group hover:border-white/10 transition-all duration-300">
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-primary opacity-50 group-hover:opacity-100 transition-opacity"></div>
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-primary opacity-50 group-hover:opacity-100 transition-opacity"></div>

            <div className="flex items-center justify-between mb-4">
                <Icon className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
                <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-sm shadow-glow-sm ${
                    isChangePositive ? 'text-[#050505] bg-primary' : 'text-white/40 bg-white/5'
                }`}>
                    {change}
                </span>
            </div>
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-bold mb-1">{label}</p>
            <p className="text-3xl font-black text-white tracking-tighter">{value}</p>
        </div>
    );
}

function ActivityItem({ action, detail, time }: any) {
    return (
        <div className="px-8 py-5 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
            <div className="flex items-center gap-6">
                <div className="w-2 h-2 bg-primary rounded-sm animate-pulse shadow-glow-sm rotate-45" />
                <div>
                    <p className="text-white font-black italic uppercase tracking-wider text-sm">{action}</p>
                    <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold mt-1">{detail}</p>
                </div>
            </div>
            <span className="text-[10px] text-primary/60 uppercase tracking-widest font-bold whitespace-nowrap">{time}</span>
        </div>
    );
}
