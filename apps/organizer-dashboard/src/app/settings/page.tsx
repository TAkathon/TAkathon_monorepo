"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import {
  Building2,
  Shield,
  Save,
  ChevronRight,
  Loader2,
  AlertCircle,
  CheckCircle,
  Trash2,
  Eye,
  EyeOff,
} from "lucide-react";
import { organizerApi } from "@takathon/shared/api";
import { useAuthStore } from "@takathon/shared/utils";
import { toast } from "sonner";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ProfileForm {
  fullName: string;
  organizationName: string;
  organizationWebsite: string;
  position: string;
  bio: string;
  avatarUrl: string;
  githubUrl: string;
  linkedinUrl: string;
  portfolioUrl: string;
}

const INITIAL_PROFILE: ProfileForm = {
  fullName: "",
  organizationName: "",
  organizationWebsite: "",
  position: "",
  bio: "",
  avatarUrl: "",
  githubUrl: "",
  linkedinUrl: "",
  portfolioUrl: "",
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SettingsPage() {
  const router = useRouter();
  const { logout } = useAuthStore();

  // Tab state
  const [activeTab, setActiveTab] = useState<"profile" | "security">("profile");

  // Profile state
  const [profile, setProfile] = useState<ProfileForm>(INITIAL_PROFILE);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);

  // Password state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [showDeletePw, setShowDeletePw] = useState(false);

  // Delete account state
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // ─── Fetch profile on mount ──────────────────────────────────────────────

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    try {
      setLoadingProfile(true);
      setProfileError(null);
      const data = await organizerApi.getProfile();
      setProfile({
        fullName: data.fullName || "",
        organizationName: data.organizationName || "",
        organizationWebsite: data.organizationWebsite || "",
        position: data.position || "",
        bio: data.bio || "",
        avatarUrl: data.avatarUrl || "",
        githubUrl: data.githubUrl || "",
        linkedinUrl: data.linkedinUrl || "",
        portfolioUrl: data.portfolioUrl || "",
      });
    } catch (err: any) {
      setProfileError(err.response?.data?.message || "Failed to load profile.");
    } finally {
      setLoadingProfile(false);
    }
  }

  // ─── Handlers ────────────────────────────────────────────────────────────

  function handleProfileChange(field: keyof ProfileForm, value: string) {
    setProfile((prev) => ({ ...prev, [field]: value }));
    setProfileSuccess(null);
  }

  async function handleSaveProfile() {
    try {
      setSavingProfile(true);
      setProfileError(null);
      setProfileSuccess(null);
      await organizerApi.updateProfile(profile);
      await fetchProfile(); // re-sync from DB
      setProfileSuccess("Profile updated successfully.");
      toast.success("Profile updated successfully");
    } catch (err: any) {
      setProfileError(
        err.response?.data?.message || "Failed to update profile.",
      );
      toast.error(err.response?.data?.message || "Failed to update profile");
    } finally {
      setSavingProfile(false);
    }
  }

  async function handleChangePassword() {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }
    if (passwordForm.newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters.");
      return;
    }
    try {
      setChangingPassword(true);
      setPasswordError(null);
      setPasswordSuccess(null);
      await organizerApi.changePassword(
        passwordForm.currentPassword,
        passwordForm.newPassword,
      );
      setPasswordSuccess("Password changed successfully.");
      toast.success("Password changed successfully");
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err: any) {
      setPasswordError(
        err.response?.data?.message || "Failed to change password.",
      );
      toast.error(err.response?.data?.message || "Failed to change password");
    } finally {
      setChangingPassword(false);
    }
  }

  async function handleDeleteAccount() {
    if (deleteConfirm !== "DELETE") {
      setDeleteError('Please type "DELETE" to confirm.');
      return;
    }
    try {
      setDeleting(true);
      setDeleteError(null);
      await organizerApi.deleteAccount(deletePassword, deleteConfirm);
      toast.success("Account deleted");
      logout();
      router.push("/login");
    } catch (err: any) {
      setDeleteError(
        err.response?.data?.message || "Failed to delete account.",
      );
      toast.error(err.response?.data?.message || "Failed to delete account");
    } finally {
      setDeleting(false);
    }
  }

  // ─── Tab config ──────────────────────────────────────────────────────────

  const tabs = [
    { id: "profile" as const, label: "Organization Profile", icon: Building2 },
    { id: "security" as const, label: "Security", icon: Shield },
  ];

  // ─── Render ──────────────────────────────────────────────────────────────

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white">Settings</h1>
          <p className="text-white/60 mt-1">
            Manage your organization profile and account security
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Nav */}
          <div className="space-y-2">
            {tabs.map((tab) => {
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
                    className={`w-4 h-4 transition-transform ${
                      activeTab === tab.id ? "rotate-90" : ""
                    }`}
                  />
                </button>
              );
            })}
          </div>

          {/* Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* ── Organization Profile Tab ─────────────────────────────── */}
            {activeTab === "profile" && (
              <>
                {loadingProfile ? (
                  <div className="flex items-center justify-center py-16">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  </div>
                ) : (
                  <div className="glass p-6 rounded-xl space-y-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-bold text-white">
                        Organization Profile
                      </h2>
                      <button
                        onClick={handleSaveProfile}
                        disabled={savingProfile}
                        className="btn-primary flex items-center gap-2 disabled:opacity-50"
                      >
                        {savingProfile ? (
                          <>
                            <Loader2 size={16} className="animate-spin" />{" "}
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save size={16} /> Save Changes
                          </>
                        )}
                      </button>
                    </div>

                    {/* Alerts */}
                    {profileError && (
                      <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                        <AlertCircle size={16} /> {profileError}
                      </div>
                    )}
                    {profileSuccess && (
                      <div className="flex items-center gap-2 p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm">
                        <CheckCircle size={16} /> {profileSuccess}
                      </div>
                    )}

                    {/* Avatar preview */}
                    <div className="flex items-center gap-5">
                      <div className="w-20 h-20 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center overflow-hidden">
                        {profile.avatarUrl ? (
                          <img
                            src={profile.avatarUrl}
                            alt="Avatar"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-primary text-2xl font-bold">
                            {(
                              profile.organizationName ||
                              profile.fullName ||
                              "O"
                            )
                              .charAt(0)
                              .toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-white/60 mb-1">
                          Logo / Avatar URL
                        </label>
                        <input
                          type="url"
                          className="input-field w-full"
                          placeholder="https://example.com/logo.png"
                          value={profile.avatarUrl}
                          onChange={(e) =>
                            handleProfileChange("avatarUrl", e.target.value)
                          }
                        />
                      </div>
                    </div>

                    {/* Form fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-white/60">
                          Full Name
                        </label>
                        <input
                          type="text"
                          className="input-field w-full"
                          value={profile.fullName}
                          onChange={(e) =>
                            handleProfileChange("fullName", e.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-white/60">
                          Organization Name
                        </label>
                        <input
                          type="text"
                          className="input-field w-full"
                          value={profile.organizationName}
                          onChange={(e) =>
                            handleProfileChange(
                              "organizationName",
                              e.target.value,
                            )
                          }
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-white/60">
                          Position / Role
                        </label>
                        <input
                          type="text"
                          className="input-field w-full"
                          placeholder="e.g. Head of Events"
                          value={profile.position}
                          onChange={(e) =>
                            handleProfileChange("position", e.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-white/60">
                          Organization Website
                        </label>
                        <input
                          type="url"
                          className="input-field w-full"
                          placeholder="https://yourorg.com"
                          value={profile.organizationWebsite}
                          onChange={(e) =>
                            handleProfileChange(
                              "organizationWebsite",
                              e.target.value,
                            )
                          }
                        />
                      </div>
                      <div className="space-y-1.5 md:col-span-2">
                        <label className="text-sm font-medium text-white/60">
                          Bio / About
                        </label>
                        <textarea
                          rows={3}
                          className="input-field w-full resize-none"
                          placeholder="Tell participants about your organization..."
                          value={profile.bio}
                          maxLength={500}
                          onChange={(e) =>
                            handleProfileChange(
                              "bio",
                              e.target.value.slice(0, 500),
                            )
                          }
                        />
                        <p className="text-xs text-white/40 text-right mt-1">
                          {(profile.bio || "").length} / 500
                        </p>
                      </div>
                    </div>

                    {/* Social links */}
                    <div>
                      <h3 className="text-sm font-semibold text-white/40 uppercase tracking-wider mb-3">
                        Social Links
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <div className="space-y-1.5">
                          <label className="text-sm font-medium text-white/60">
                            GitHub
                          </label>
                          <input
                            type="url"
                            className="input-field w-full"
                            placeholder="https://github.com/yourorg"
                            value={profile.githubUrl}
                            onChange={(e) =>
                              handleProfileChange("githubUrl", e.target.value)
                            }
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-sm font-medium text-white/60">
                            LinkedIn
                          </label>
                          <input
                            type="url"
                            className="input-field w-full"
                            placeholder="https://linkedin.com/company/..."
                            value={profile.linkedinUrl}
                            onChange={(e) =>
                              handleProfileChange("linkedinUrl", e.target.value)
                            }
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-sm font-medium text-white/60">
                            Portfolio
                          </label>
                          <input
                            type="url"
                            className="input-field w-full"
                            placeholder="https://yourportfolio.com"
                            value={profile.portfolioUrl}
                            onChange={(e) =>
                              handleProfileChange(
                                "portfolioUrl",
                                e.target.value,
                              )
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* ── Security Tab ─────────────────────────────────────────── */}
            {activeTab === "security" && (
              <>
                {/* Change Password */}
                <div className="glass p-6 rounded-xl space-y-5">
                  <h2 className="text-xl font-bold text-white">
                    Change Password
                  </h2>

                  {passwordError && (
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                      <AlertCircle size={16} /> {passwordError}
                    </div>
                  )}
                  {passwordSuccess && (
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm">
                      <CheckCircle size={16} /> {passwordSuccess}
                    </div>
                  )}

                  <div className="space-y-4 max-w-md">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-white/60">
                        Current Password
                      </label>
                      <div className="relative">
                        <input
                          type={showCurrentPw ? "text" : "password"}
                          className="input-field w-full pr-10"
                          value={passwordForm.currentPassword}
                          onChange={(e) =>
                            setPasswordForm((p) => ({
                              ...p,
                              currentPassword: e.target.value,
                            }))
                          }
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPw(!showCurrentPw)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                        >
                          {showCurrentPw ? (
                            <EyeOff size={16} />
                          ) : (
                            <Eye size={16} />
                          )}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-white/60">
                        New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showNewPw ? "text" : "password"}
                          className="input-field w-full pr-10"
                          placeholder="Minimum 8 characters"
                          value={passwordForm.newPassword}
                          onChange={(e) =>
                            setPasswordForm((p) => ({
                              ...p,
                              newPassword: e.target.value,
                            }))
                          }
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPw(!showNewPw)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                        >
                          {showNewPw ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-white/60">
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPw ? "text" : "password"}
                          className="input-field w-full pr-10"
                          value={passwordForm.confirmPassword}
                          onChange={(e) =>
                            setPasswordForm((p) => ({
                              ...p,
                              confirmPassword: e.target.value,
                            }))
                          }
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPw(!showConfirmPw)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                          aria-label={
                            showConfirmPw ? "Hide password" : "Show password"
                          }
                        >
                          {showConfirmPw ? (
                            <EyeOff size={16} />
                          ) : (
                            <Eye size={16} />
                          )}
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={handleChangePassword}
                      disabled={
                        changingPassword ||
                        !passwordForm.currentPassword ||
                        !passwordForm.newPassword ||
                        !passwordForm.confirmPassword
                      }
                      className="btn-primary flex items-center gap-2 disabled:opacity-50"
                    >
                      {changingPassword ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />{" "}
                          Changing...
                        </>
                      ) : (
                        "Change Password"
                      )}
                    </button>
                  </div>
                </div>

                {/* Danger Zone */}
                <div className="glass p-6 rounded-xl border border-red-500/20 space-y-5">
                  <div>
                    <h2 className="text-xl font-bold text-red-400">
                      Danger Zone
                    </h2>
                    <p className="text-white/50 text-sm mt-1">
                      Deleting your account will{" "}
                      <strong>cancel all draft and published hackathons</strong>{" "}
                      and permanently remove your organizer data. This action
                      cannot be undone.
                    </p>
                  </div>

                  {deleteError && (
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                      <AlertCircle size={16} /> {deleteError}
                    </div>
                  )}

                  <div className="space-y-4 max-w-md">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-white/60">
                        Enter your password
                      </label>
                      <div className="relative">
                        <input
                          type={showDeletePw ? "text" : "password"}
                          className="input-field w-full pr-10"
                          value={deletePassword}
                          onChange={(e) => setDeletePassword(e.target.value)}
                        />
                        <button
                          type="button"
                          onClick={() => setShowDeletePw(!showDeletePw)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                          aria-label={
                            showDeletePw ? "Hide password" : "Show password"
                          }
                        >
                          {showDeletePw ? (
                            <EyeOff size={16} />
                          ) : (
                            <Eye size={16} />
                          )}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-white/60">
                        Type{" "}
                        <span className="text-red-400 font-bold">DELETE</span>{" "}
                        to confirm
                      </label>
                      <input
                        type="text"
                        className="input-field w-full"
                        placeholder='Type "DELETE"'
                        value={deleteConfirm}
                        onChange={(e) => setDeleteConfirm(e.target.value)}
                      />
                    </div>
                    <button
                      onClick={handleDeleteAccount}
                      disabled={
                        deleting ||
                        deleteConfirm !== "DELETE" ||
                        !deletePassword
                      }
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {deleting ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />{" "}
                          Deleting...
                        </>
                      ) : (
                        <>
                          <Trash2 size={16} /> Delete My Account
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
