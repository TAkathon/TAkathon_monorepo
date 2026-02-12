import DashboardLayout from "@/components/DashboardLayout";
import { 
    Users, 
    Calendar, 
    Trophy, 
    TrendingUp, 
    Clock, 
    ArrowUpRight, 
    ArrowDownRight,
    Plus,
    MoreVertical,
    CheckCircle2,
    AlertCircle
} from "lucide-react";

const stats = [
    {
        name: "Total Participants",
        value: "1,284",
        change: "+12%",
        changeType: "increase",
        icon: Users,
    },
    {
        name: "Active Hackathons",
        value: "3",
        change: "0",
        changeType: "neutral",
        icon: Calendar,
    },
    {
        name: "Teams Formed",
        value: "342",
        change: "+18%",
        changeType: "increase",
        icon: Trophy,
    },
    {
        name: "Avg. Engagement",
        value: "84%",
        change: "-2%",
        changeType: "decrease",
        icon: TrendingUp,
    },
];

const activeHackathons = [
    {
        id: 1,
        name: "AI Global Summit 2026",
        status: "In Progress",
        participants: 540,
        daysLeft: 2,
        progress: 75,
    },
    {
        id: 2,
        name: "Web3 Innovation Hack",
        status: "Registration Open",
        participants: 210,
        daysLeft: 12,
        progress: 30,
    },
];

const recentApplications = [
    {
        id: 1,
        name: "Alex Rivera",
        hackathon: "AI Global Summit",
        role: "Frontend Developer",
        status: "Approved",
        time: "2 hours ago",
    },
    {
        id: 2,
        name: "Sarah Chen",
        hackathon: "Web3 Innovation Hack",
        role: "Smart Contract dev",
        status: "Pending",
        time: "5 hours ago",
    },
    {
        id: 3,
        name: "James Wilson",
        hackathon: "AI Global Summit",
        role: "Data Scientist",
        status: "Under Review",
        time: "8 hours ago",
    },
    {
        id: 4,
        name: "Elena Petrova",
        hackathon: "AI Global Summit",
        role: "UI/UX Designer",
        status: "Approved",
        time: "1 day ago",
    },
];

export default function OverviewPage() {
    return (
        <DashboardLayout>
            <div className="space-y-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Dashboard Overview</h1>
                        <p className="text-white/60 mt-1">Welcome back, Tech Hub Organizer</p>
                    </div>
                    <button className="btn-primary flex items-center justify-center gap-2">
                        <Plus className="w-5 h-5" />
                        <span>Create New Hackathon</span>
                    </button>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat) => (
                        <div key={stat.name} className="glass p-6 rounded-xl hover:bg-white/10 transition-all group">
                            <div className="flex items-start justify-between">
                                <div className="p-3 bg-primary/10 rounded-lg text-primary group-hover:scale-110 transition-transform">
                                    <stat.icon className="w-6 h-6" />
                                </div>
                                <div className={`flex items-center gap-1 text-sm font-medium ${
                                    stat.changeType === "increase" ? "text-green-400" : 
                                    stat.changeType === "decrease" ? "text-red-400" : "text-white/40"
                                }`}>
                                    {stat.changeType === "increase" && <ArrowUpRight className="w-4 h-4" />}
                                    {stat.changeType === "decrease" && <ArrowDownRight className="w-4 h-4" />}
                                    {stat.change !== "0" && stat.change}
                                </div>
                            </div>
                            <div className="mt-4">
                                <h3 className="text-white/60 text-sm font-medium">{stat.name}</h3>
                                <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Active Hackathons */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold text-white">Active Hackathons</h2>
                            <button className="text-primary hover:text-primary-light text-sm font-medium">View All</button>
                        </div>
                        <div className="grid grid-cols-1 gap-4">
                            {activeHackathons.map((hackathon) => (
                                <div key={hackathon.id} className="glass p-6 rounded-xl border border-white/10 hover:border-primary/30 transition-all">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        <div className="space-y-1">
                                            <h3 className="text-lg font-bold text-white">{hackathon.name}</h3>
                                            <div className="flex items-center gap-3 text-sm text-white/60">
                                                <span className="flex items-center gap-1">
                                                    <Users className="w-4 h-4" /> {hackathon.participants} participants
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Clock className="w-4 h-4" /> {hackathon.daysLeft} days left
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                hackathon.status === "In Progress" ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-primary/10 text-primary border border-primary/20"
                                            }`}>
                                                {hackathon.status}
                                            </span>
                                            <button className="p-2 text-white/40 hover:text-white hover:bg-white/5 rounded-lg transition-all">
                                                <MoreVertical className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="mt-6 space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-white/60">Completion Progress</span>
                                            <span className="text-white font-medium">{hackathon.progress}%</span>
                                        </div>
                                        <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                                            <div 
                                                className="h-full bg-primary rounded-full shadow-[0_0_10px_rgba(217,76,26,0.5)]" 
                                                style={{ width: `${hackathon.progress}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recent Applications */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold text-white">Recent Applications</h2>
                            <button className="text-primary hover:text-primary-light text-sm font-medium">Review All</button>
                        </div>
                        <div className="glass rounded-xl overflow-hidden divide-y divide-white/10">
                            {recentApplications.map((app) => (
                                <div key={app.id} className="p-4 hover:bg-white/5 transition-all group">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                                {app.name.charAt(0)}
                                            </div>
                                            <div>
                                                <h4 className="text-white font-medium group-hover:text-primary transition-colors">{app.name}</h4>
                                                <p className="text-xs text-white/40">{app.hackathon}</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-1">
                                            <span className={`flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider ${
                                                app.status === "Approved" ? "text-green-400" :
                                                app.status === "Pending" ? "text-yellow-400" : "text-blue-400"
                                            }`}>
                                                {app.status === "Approved" ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                                                {app.status}
                                            </span>
                                            <span className="text-[10px] text-white/30">{app.time}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        {/* Quick Tip */}
                        <div className="bg-primary/10 border border-primary/20 rounded-xl p-5 space-y-2">
                            <h4 className="text-primary font-bold text-sm flex items-center gap-2">
                                <AlertCircle className="w-4 h-4" />
                                Organizer Tip
                            </h4>
                            <p className="text-xs text-white/70 leading-relaxed">
                                You have 12 pending applications for "Web3 Innovation Hack". Review them today to keep participants engaged!
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
