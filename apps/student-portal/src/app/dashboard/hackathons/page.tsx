"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Calendar, MapPin, Users, Filter, Search, ChevronDown, Loader2 } from "lucide-react";
import { studentService } from "@/lib/api";

export default function HackathonsPage() {
    const [hackathons, setHackathons] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [registering, setRegistering] = useState<string | null>(null);

    const fetchHackathons = async () => {
        setLoading(true);
        try {
            const params: Record<string, string | number> = { page, limit: 10 };
            if (searchQuery) params.search = searchQuery;
            if (selectedStatus) params.status = selectedStatus;
            const res = await studentService.listHackathons(params);
            const data = res.data?.data;
            setHackathons(data?.hackathons || []);
            setTotalPages(data?.pagination?.totalPages || 1);
        } catch {
            setHackathons([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHackathons();
    }, [page, selectedStatus]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setPage(1);
        fetchHackathons();
    };

    const handleRegister = async (hackathonId: string) => {
        setRegistering(hackathonId);
        try {
            await studentService.registerForHackathon(hackathonId);
            fetchHackathons();
        } catch (err: any) {
            alert(err.response?.data?.error?.message || "Registration failed");
        } finally {
            setRegistering(null);
        }
    };

    const formatDate = (date: string) => new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Browse Hackathons</h1>
                    <p className="text-white/60">
                        Discover and join exciting hackathons
                    </p>
                </div>

                {/* Filters */}
                <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
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
                            onChange={(e) => { setSelectedStatus(e.target.value); setPage(1); }}
                            className="w-full pl-11 pr-8 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary/50 transition-all appearance-none cursor-pointer"
                        >
                            <option value="">All Status</option>
                            <option value="registration_open">Registration Open</option>
                            <option value="in_progress">In Progress</option>
                            <option value="completed">Completed</option>
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-white/40">
                            <ChevronDown className="w-4 h-4" />
                        </div>
                    </div>
                </form>

                {loading ? (
                    <div className="flex items-center justify-center h-48">
                        <Loader2 className="w-8 h-8 text-primary animate-spin" />
                    </div>
                ) : (
                    <>
                        <p className="text-white/60 text-sm">
                            Showing {hackathons.length} hackathons (page {page} of {totalPages})
                        </p>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {hackathons.map((h: any) => (
                                <div
                                    key={h.id}
                                    className="glass rounded-xl p-6 hover:bg-white/10 transition-all duration-300 cursor-pointer group"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <h3 className="text-xl font-bold text-white mb-1 group-hover:text-primary transition-colors">
                                                {h.title}
                                            </h3>
                                            <p className="text-sm text-white/60">
                                                {h.organizer?.fullName || h.organizer?.organization || ""}
                                            </p>
                                        </div>
                                        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-500/20 text-green-400 capitalize">
                                            {h.status?.replace(/_/g, " ")}
                                        </span>
                                    </div>
                                    <p className="text-white/70 text-sm mb-4 line-clamp-2">{h.description}</p>

                                    {h.requiredSkills?.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {h.requiredSkills.slice(0, 4).map((tag: string) => (
                                                <span key={tag} className="px-2 py-1 bg-white/5 text-white/60 text-xs rounded-full">{tag}</span>
                                            ))}
                                        </div>
                                    )}

                                    <div className="grid grid-cols-2 gap-3 mb-4">
                                        <div className="flex items-center gap-2 text-sm text-white/60">
                                            <Calendar className="w-4 h-4 text-primary" />
                                            <span>{formatDate(h.startDate)} – {formatDate(h.endDate)}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-white/60">
                                            <MapPin className="w-4 h-4 text-primary" />
                                            <span>{h.isVirtual ? "Virtual" : h.location || "TBA"}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-white/60">
                                            <Users className="w-4 h-4 text-primary" />
                                            <span>{h._count?.participants || 0}{h.maxParticipants ? `/${h.maxParticipants}` : ""}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-4 border-t border-white/10">
                                        {h.prizePool && (
                                            <div>
                                                <span className="text-primary font-bold text-lg">{h.prizePool}</span>
                                                <span className="text-white/40 text-sm ml-1">Prize Pool</span>
                                            </div>
                                        )}
                                        <button
                                            onClick={() => handleRegister(h.id)}
                                            disabled={registering === h.id || h.status !== "registration_open"}
                                            className="px-4 py-2 bg-primary hover:bg-primary-dark text-white font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {registering === h.id ? "Registering..." : h.status === "registration_open" ? "Register" : "View"}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {hackathons.length === 0 && (
                            <div className="text-center py-12 glass rounded-xl">
                                <Calendar className="w-16 h-16 text-white/20 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-white/60 mb-2">No hackathons found</h3>
                                <p className="text-white/40">Try adjusting your search or filters</p>
                            </div>
                        )}

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center gap-2 pt-4">
                                <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                                    className="px-4 py-2 bg-white/5 text-white rounded-lg hover:bg-white/10 disabled:opacity-30">
                                    Previous
                                </button>
                                <span className="px-4 py-2 text-white/60">Page {page} of {totalPages}</span>
                                <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                                    className="px-4 py-2 bg-white/5 text-white rounded-lg hover:bg-white/10 disabled:opacity-30">
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </DashboardLayout>
    );
}
