"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Mail, Lock, User as UserIcon, ArrowRight, ShieldCheck, Building2 } from "lucide-react";
import { useAuthStore, UserRole, getRedirectUrl } from "@shared/utils";
import { registerUser } from "../../lib/api";

export default function SignUpPage() {
  const router = useRouter();
  const { login, isAuthenticated, user, _hasHydrated } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Exclude<UserRole, null>>("student");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!_hasHydrated) return;
    if (isAuthenticated && user?.role) {
      const url = getRedirectUrl(user.role);
      if (url.startsWith("http")) {
        window.location.href = url;
      } else {
        router.replace(url);
      }
    }
  }, [isAuthenticated, user, router, _hasHydrated]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match!");
      return;
    }
    if (!formData.agreeToTerms) {
      setError("You must agree to the terms.");
      return;
    }
    setLoading(true);
    try {
      const result = await registerUser({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        role: selectedRole,
      });

      const mockUser = {
        id: result.user?.id ?? Math.random().toString(36).slice(2),
        email: formData.email,
        fullName: formData.fullName,
        role: selectedRole,
      };
      login(mockUser);

      const url = getRedirectUrl(selectedRole);
      if (url.startsWith("http")) {
        window.location.href = url;
      } else {
        router.push(url);
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden py-12">
      <div className="absolute inset-0 bg-gradient-to-br from-dark via-dark-50 to-dark opacity-50" />
      <div className="absolute top-20 left-10 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }} />

      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="glass rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 group">
              <span className="text-4xl font-bold text-primary transition-all duration-300 group-hover:text-glow-sm">T</span>
              <span className="text-2xl font-semibold text-white/90 tracking-wide">AKATHON</span>
            </Link>
            <p className="text-white/60 mt-2 text-sm">Create your account and start building teams</p>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-8">
            <button
              type="button"
              onClick={() => setSelectedRole("student")}
              className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all duration-300 ${
                selectedRole === "student" ? "bg-primary/20 border-primary text-white" : "bg-white/5 border-white/10 text-white/40 hover:bg-white/10"
              }`}
            >
              <UserIcon className="w-5 h-5" />
              <span className="text-xs font-medium">Student</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedRole("organizer")}
              className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all duration-300 ${
                selectedRole === "organizer" ? "bg-primary/20 border-primary text-white" : "bg-white/5 border-white/10 text-white/40 hover:bg-white/10"
              }`}
            >
              <ShieldCheck className="w-5 h-5" />
              <span className="text-xs font-medium">Organizer</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedRole("sponsor")}
              className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all duration-300 ${
                selectedRole === "sponsor" ? "bg-primary/20 border-primary text-white" : "bg-white/5 border-white/10 text-white/40 hover:bg-white/10"
              }`}
            >
              <Building2 className="w-5 h-5" />
              <span className="text-xs font-medium">Sponsor</span>
            </button>
          </div>

          {error && <div className="mb-4 text-sm text-red-400">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-white/80 mb-2">Full Name</label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 z-10 pointer-events-none" />
                <input
                  id="fullName"
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="input-field pl-12"
                  placeholder="First Last"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white/80 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 z-10 pointer-events-none" />
                <input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="input-field pl-12"
                  placeholder="name@university.edu"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white/80 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 z-10 pointer-events-none" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={8}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="input-field pl-12 pr-12"
                  placeholder="At least 8 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text sm font-medium text-white/80 mb-2">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 z-10 pointer-events-none" />
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="input-field pl-12 pr-12"
                  placeholder="Re-enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <input
                id="terms"
                type="checkbox"
                required
                checked={formData.agreeToTerms}
                onChange={(e) => setFormData({ ...formData, agreeToTerms: e.target.checked })}
                className="mt-1 w-4 h-4 rounded border-white/20 bg-white/5 text-primary focus:ring-primary focus:ring-offset-0"
              />
              <label htmlFor="terms" className="text-sm text-white/60">
                I agree to the{" "}
                <Link href="/terms" title="Coming soon" className="text-primary hover:text-primary-light pointer-events-none opacity-50">Terms of Service</Link>{" "}
                and{" "}
                <Link href="/privacy" title="Coming soon" className="text-primary hover:text-primary-light pointer-events-none opacity-50">Privacy Policy</Link>
              </label>
            </div>

            <button type="submit" disabled={loading} className="w-full btn-primary flex items-center justify-center gap-2 group">
              <span>{loading ? "Creating Account..." : `Create ${selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)} Account`}</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10" /></div>
            <div className="relative flex justify-center text-sm"><span className="px-4 bg-dark text-white/40">OR</span></div>
          </div>

          <p className="text-center text-sm text-white/60">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:text-primary-light font-semibold transition-colors">Sign in</Link>
          </p>
        </div>

        <div className="text-center mt-6">
          <Link href="/" className="text-sm text-white/40 hover:text-white/70 transition-colors">← Back to Home</Link>
        </div>
      </div>
    </div>
  );
}

