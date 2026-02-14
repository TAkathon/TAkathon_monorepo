"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import {
  Search,
  Filter,
  Download,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronDown,
  Loader2,
  Users,
} from "lucide-react";
import { organizerService } from "@/lib/api";

export default function ParticipantsPage() {
  const [hackathons, setHackathons] = useState<any[]>([]);
  const [selectedHackathon, setSelectedHackathon] = useState("");
  const [participants, setParticipants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 20;

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
    if (selectedHackathon) fetchParticipants();
  }, [selectedHackathon, page]);

  const fetchParticipants = async () => {
    setLoading(true);
    try {
      const params: Record<string, string | number> = { page, limit };
      if (searchQuery) params.search = searchQuery;
      const res = await organizerService.listParticipants(
        selectedHackathon,
        params,
      );
      const data = res.data?.data;
      setParticipants(data?.participants || []);
      setTotal(data?.pagination?.total || 0);
    } catch {
      setParticipants([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchParticipants();
  };

  const handleExport = async () => {
    if (!selectedHackathon) return;
    try {
      const res = await organizerService.exportData(selectedHackathon);
      const blob = new Blob([JSON.stringify(res.data?.data, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `participants-export.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert("Export failed");
    }
  };

  const totalPages = Math.ceil(total / limit);
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
            <h1 className="text-3xl font-bold text-white">Participants</h1>
            <p className="text-white/60 mt-1">
              Review and manage hackathon participants
            </p>
          </div>
          <button
            onClick={handleExport}
            className="btn-secondary flex items-center justify-center gap-2"
          >
            <Download className="w-5 h-5" />
            <span>Export Data</span>
          </button>
        </div>

        {/* Filters */}
        <form
          onSubmit={handleSearch}
          className="flex flex-col md:flex-row gap-4"
        >
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or email..."
              className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:border-primary/50 transition-all"
            />
          </div>
          <div className="relative min-w-[200px]">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <select
              value={selectedHackathon}
              onChange={(e) => {
                setSelectedHackathon(e.target.value);
                setPage(1);
              }}
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
        </form>

        {loading ? (
          <div className="flex items-center justify-center h-48">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : participants.length === 0 ? (
          <div className="text-center py-12 glass rounded-xl">
            <Users className="w-16 h-16 text-white/20 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white/60 mb-2">
              No participants yet
            </h3>
            <p className="text-white/40">
              Participants will appear here once they register
            </p>
          </div>
        ) : (
          <>
            <div className="glass rounded-xl overflow-hidden border border-white/10">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 bg-white/5">
                      <th className="px-6 py-4 text-sm font-semibold text-white/60 uppercase tracking-wider">
                        Participant
                      </th>
                      <th className="px-6 py-4 text-sm font-semibold text-white/60 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-sm font-semibold text-white/60 uppercase tracking-wider">
                        Registered
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {participants.map((p: any) => (
                      <tr
                        key={p.id}
                        className="hover:bg-white/[0.02] transition-colors group"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold group-hover:scale-110 transition-transform">
                              {(p.user?.fullName || "?").charAt(0)}
                            </div>
                            <div>
                              <div className="text-white font-medium">
                                {p.user?.fullName}
                              </div>
                              <div className="text-xs text-white/40">
                                {p.user?.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border capitalize ${
                              p.status === "registered"
                                ? "bg-green-500/10 text-green-400 border-green-500/20"
                                : p.status === "waitlisted"
                                  ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                                  : p.status === "withdrawn"
                                    ? "bg-red-500/10 text-red-400 border-red-500/20"
                                    : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                            }`}
                          >
                            {p.status === "registered" ? (
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            ) : p.status === "withdrawn" ? (
                              <XCircle className="w-3.5 h-3.5" />
                            ) : (
                              <Clock className="w-3.5 h-3.5" />
                            )}
                            {p.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-white/60">
                          {formatDate(p.registeredAt || p.createdAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-6 py-4 border-t border-white/10 bg-white/5 flex items-center justify-between text-sm">
                <div className="text-white/40">
                  Showing {participants.length} of {total} participants
                </div>
                {totalPages > 1 && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="px-3 py-1 bg-white/5 border border-white/10 rounded text-white hover:bg-white/10 disabled:opacity-30"
                    >
                      Previous
                    </button>
                    <span className="text-white/60">
                      Page {page} of {totalPages}
                    </span>
                    <button
                      onClick={() =>
                        setPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={page === totalPages}
                      className="px-3 py-1 bg-white/5 border border-white/10 rounded text-white hover:bg-white/10 disabled:opacity-30"
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
