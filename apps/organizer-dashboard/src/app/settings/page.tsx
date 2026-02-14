"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import {
  User,
  Bell,
  Shield,
  CreditCard,
  Save,
  ChevronRight,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { organizerService } from "@/lib/api";
import { useAuthStore } from "@shared/utils";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const { user } = useAuthStore();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [organizationName, setOrganizationName] = useState("");
  const [position, setPosition] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await organizerService.getProfile();
        const p = res.data?.data;
        if (p) {
          setOrganizationName(p.organizationName || "");
          setPosition(p.position || "");
          setFullName(p.user?.fullName || user?.fullName || "");
          setEmail(p.user?.email || user?.email || "");
        }
      } catch {
        /* fallback to auth store */
        setFullName(user?.fullName || "");
        setEmail(user?.email || "");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      await organizerService.updateProfile({ organizationName, position });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      /* toast */
    } finally {
      setSaving(false);
    }
  };

  const initials = (organizationName || fullName || "O")
    .split(" ")
    .map((w: string) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">Settings</h1>
            <p className="text-white/60 mt-1">
              Manage your organization and account preferences
            </p>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-primary flex items-center justify-center gap-2"
          >
            {saving ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : saved ? (
              <CheckCircle2 className="w-5 h-5" />
            ) : (
              <Save className="w-5 h-5" />
            )}
            <span>
              {saving ? "Saving..." : saved ? "Saved!" : "Save Changes"}
            </span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Navigation */}
          <div className="space-y-2">
            {[
              { id: "profile", label: "Org Profile", icon: User },
              { id: "notifications", label: "Notifications", icon: Bell },
              { id: "security", label: "Security", icon: Shield },
              { id: "billing", label: "Subscription", icon: CreditCard },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all ${
                    activeTab === tab.id
                      ? "bg-primary/10 text-primary border border-primary/20"
                      : "text-white/60 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-3 font-medium">
                    <Icon className="w-5 h-5" />
                    {tab.label}
                  </div>
                  <ChevronRight
                    className={`w-4 h-4 transition-transform ${activeTab === tab.id ? "rotate-90" : ""}`}
                  />
                </button>
              );
            })}
          </div>

          {/* Content */}
          <div className="lg:col-span-3 space-y-6">
            {activeTab === "profile" && (
              <>
                {loading ? (
                  <div className="flex items-center justify-center h-48">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                  </div>
                ) : (
                  <div className="glass p-6 rounded-xl space-y-6">
                    <div className="flex items-center gap-6">
                      <div className="w-24 h-24 rounded-2xl bg-primary/10 flex items-center justify-center text-primary text-3xl font-bold border border-primary/20">
                        {initials}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">
                          {organizationName || fullName}
                        </h3>
                        <p className="text-white/40 text-sm">{email}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-white/60">
                          Organization Name
                        </label>
                        <input
                          type="text"
                          value={organizationName}
                          onChange={(e) => setOrganizationName(e.target.value)}
                          className="input-field"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-white/60">
                          Position / Role
                        </label>
                        <input
                          type="text"
                          value={position}
                          onChange={(e) => setPosition(e.target.value)}
                          placeholder="e.g. Community Manager"
                          className="input-field"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-white/60">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={fullName}
                          disabled
                          className="input-field opacity-60"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-white/60">
                          Email
                        </label>
                        <input
                          type="email"
                          value={email}
                          disabled
                          className="input-field opacity-60"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            {activeTab === "notifications" && (
              <div className="glass p-6 rounded-xl space-y-4">
                <h3 className="text-lg font-bold text-white mb-4">
                  Notification Preferences
                </h3>
                {[
                  "New participant registrations",
                  "Team formation updates",
                  "Event reminders",
                  "Sponsor messages",
                ].map((label) => (
                  <label
                    key={label}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 cursor-pointer transition-all"
                  >
                    <span className="text-white/80">{label}</span>
                    <input
                      type="checkbox"
                      defaultChecked
                      className="w-5 h-5 accent-primary"
                    />
                  </label>
                ))}
                <p className="text-xs text-white/30 pt-2">
                  Notification preferences are saved locally and not synced to
                  the server yet.
                </p>
              </div>
            )}

            {activeTab === "security" && (
              <div className="glass p-6 rounded-xl space-y-4">
                <h3 className="text-lg font-bold text-white mb-4">Security</h3>
                <p className="text-white/60 text-sm">
                  Password change and two-factor authentication settings are
                  coming soon.
                </p>
              </div>
            )}

            {activeTab === "billing" && (
              <div className="glass p-6 rounded-xl space-y-4">
                <h3 className="text-lg font-bold text-white mb-4">
                  Subscription
                </h3>
                <p className="text-white/60 text-sm">
                  Billing and subscription management is not yet available.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
