"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import {
  Search,
  Filter,
  MapPin,
  Calendar,
  DollarSign,
  ChevronRight,
  Loader2,
  Users,
  CheckCircle2,
} from "lucide-react";
import { sponsorService } from "@/lib/api";

export default function OpportunitiesPage() {
  const [hackathons, setHackathons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sponsoring, setSponsoring] = useState<string | null>(null);

  useEffect(() => {
    fetchHackathons();
  }, []);

  const fetchHackathons = async () => {
    setLoading(true);
    try {
      const res = await sponsorService.listHackathons();
      setHackathons(res.data?.data?.hackathons || res.data?.data || []);
    } catch {
      setHackathons([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSponsor = async (hackathonId: string) => {
    setSponsoring(hackathonId);
    try {
      await sponsorService.createSponsorship(hackathonId, {
        tier: "gold",
        amount: 1000,
      });
      fetchHackathons();
    } catch {
      /* empty */
    } finally {
      setSponsoring(null);
    }
  };

  const filtered = hackathons.filter((h: any) => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      !q ||
      h.title?.toLowerCase().includes(q) ||
      h.description?.toLowerCase().includes(q);
    const matchesStatus = statusFilter === "all" || h.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Discover Opportunities
          </h1>
          <p className="text-white/60">
            Find upcoming events looking for sponsorships.
          </p>
        </div>

        {/* Filters & Search */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <input
              type="text"
              placeholder="Search by name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-11"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-field pl-11 appearance-none bg-dark w-full"
            >
              <option value="all">All Statuses</option>
              <option value="published">Published</option>
              <option value="registration_open">Registration Open</option>
              <option value="ongoing">Ongoing</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-48">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 glass rounded-2xl">
            <Calendar className="w-16 h-16 text-white/20 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white/60 mb-2">
              No opportunities found
            </h3>
            <p className="text-white/40">
              Check back later for upcoming events.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {filtered.map((h: any) => (
              <div
                key={h.id}
                className="glass p-6 rounded-2xl hover:border-primary/30 transition-all duration-300 group"
              >
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="flex-1 space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors">
                          {h.title}
                        </h3>
                        <p className="text-white/40 text-sm">
                          by {h.organizer?.user?.fullName || "Organizer"}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium uppercase capitalize ${
                          h.status === "published" ||
                          h.status === "registration_open"
                            ? "bg-green-500/10 text-green-400 border border-green-500/20"
                            : "bg-white/10 text-white/60 border border-white/10"
                        }`}
                      >
                        {h.status?.replace(/_/g, " ")}
                      </span>
                    </div>

                    {h.description && (
                      <p className="text-white/70 text-sm leading-relaxed max-w-2xl line-clamp-2">
                        {h.description}
                      </p>
                    )}

                    <div className="flex flex-wrap gap-4 text-sm text-white/40">
                      {h.startDate && (
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-4 h-4" />
                          {new Date(h.startDate).toLocaleDateString()}
                          {h.endDate &&
                            ` – ${new Date(h.endDate).toLocaleDateString()}`}
                        </div>
                      )}
                      {h.location && (
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-4 h-4" />
                          {h.location}
                        </div>
                      )}
                      <div className="flex items-center gap-1.5">
                        <Users className="w-4 h-4" />
                        {h.maxParticipants
                          ? `Max ${h.maxParticipants}`
                          : "Open"}{" "}
                        participants
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-row lg:flex-col justify-center gap-3 min-w-[160px]">
                    <button
                      onClick={() => handleSponsor(h.id)}
                      disabled={sponsoring === h.id}
                      className="flex-1 lg:flex-none btn-primary flex items-center justify-center gap-2 py-2.5"
                    >
                      {sponsoring === h.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <DollarSign className="w-4 h-4" />
                          Sponsor
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
