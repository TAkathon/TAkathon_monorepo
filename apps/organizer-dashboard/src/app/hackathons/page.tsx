"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import {
  Plus,
  Search,
  Filter,
  Users,
  Calendar,
  MapPin,
  Globe,
  ChevronDown,
  Edit2,
  Eye,
  Loader2,
} from "lucide-react";
import { organizerService } from "@/lib/api";

export default function HackathonsPage() {
  const [hackathons, setHackathons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  useEffect(() => {
    fetchHackathons();
  }, []);

  const fetchHackathons = async () => {
    setLoading(true);
    try {
      const res = await organizerService.myHackathons();
      setHackathons(res.data?.data || []);
    } catch {
      /* empty */
    } finally {
      setLoading(false);
    }
  };

  const filtered = hackathons.filter((h: any) => {
    const matchesSearch =
      !searchQuery ||
      h.title?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !selectedStatus || h.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">My Hackathons</h1>
            <p className="text-white/60 mt-1">
              Manage and monitor your organized events
            </p>
          </div>
          <button className="btn-primary flex items-center justify-center gap-2">
            <Plus className="w-5 h-5" />
            <span>Create Hackathon</span>
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4">
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
          <div className="relative min-w-[200px]">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full pl-11 pr-8 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary/50 transition-all appearance-none cursor-pointer"
            >
              <option value="">All Status</option>
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

        {loading ? (
          <div className="flex items-center justify-center h-48">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((hackathon: any) => {
              const participants = hackathon._count?.participants || 0;
              const maxP = hackathon.maxParticipants || 100;
              const pct = Math.round((participants / maxP) * 100);
              return (
                <div
                  key={hackathon.id}
                  className="glass rounded-xl overflow-hidden border border-white/10 hover:border-primary/30 transition-all group flex flex-col"
                >
                  <div className="relative h-48 bg-white/5 overflow-hidden flex items-center justify-center">
                    <Calendar className="w-16 h-16 text-white/10" />
                    <div className="absolute top-4 left-4">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider capitalize ${
                          hackathon.status === "in_progress"
                            ? "bg-green-500 text-white shadow-[0_0_10px_rgba(34,197,94,0.5)]"
                            : hackathon.status === "registration_open"
                              ? "bg-primary text-white"
                              : "bg-white/20 text-white backdrop-blur-md"
                        }`}
                      >
                        {hackathon.status?.replace(/_/g, " ")}
                      </span>
                    </div>
                  </div>

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
                            : hackathon.location || "TBA"}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDate(hackathon.startDate)}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-white/40">Registrations</span>
                        <span className="text-white font-medium">
                          {participants} / {maxP}
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full transition-all duration-500"
                          style={{ width: `${Math.min(100, pct)}%` }}
                        />
                      </div>
                    </div>

                    <div className="pt-4 mt-auto grid grid-cols-2 gap-3">
                      <button className="flex items-center justify-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-all text-sm font-medium border border-white/10">
                        <Eye className="w-4 h-4" />
                        View Details
                      </button>
                      <button className="flex items-center justify-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-all text-sm font-medium border border-primary/20">
                        <Edit2 className="w-4 h-4" />
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Create New Card */}
            <button className="glass rounded-xl border-2 border-dashed border-white/10 hover:border-primary/50 hover:bg-primary/5 transition-all group flex flex-col items-center justify-center p-8 gap-4 min-h-[400px]">
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

            {filtered.length === 0 && (
              <div className="col-span-full text-center py-12 glass rounded-xl">
                <Calendar className="w-16 h-16 text-white/20 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white/60 mb-2">
                  No hackathons found
                </h3>
                <p className="text-white/40">
                  Create your first hackathon to get started
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
