"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore, UserRole, getRedirectUrl } from "@shared/utils";
import { loginUser } from "../../lib/api";
import ClientOnly from "../../lib/ClientOnly";

export default function LoginPage() {
  return (
    <ClientOnly>
      <LoginContent />
    </ClientOnly>
  );
}

function LoginContent() {
  const router = useRouter();
  const { login, isAuthenticated, user, _hasHydrated } = useAuthStore();
  const [selectedRole, setSelectedRole] = useState<Exclude<UserRole, null>>("student");
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (useAuthStore.getState().isAuthenticated) {
      useAuthStore.getState().logout();
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !_hasHydrated) return;
    if (isAuthenticated && user?.role) {
      const targetUrl = getRedirectUrl(user.role);
      if (window.location.href !== targetUrl) {
        if (targetUrl.startsWith("http")) {
          window.location.href = targetUrl;
        } else {
          router.replace(targetUrl);
        }
      }
    }
  }, [isAuthenticated, user, router, _hasHydrated]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const result = await loginUser({
        email: formData.email,
        password: formData.password,
        role: selectedRole,
      });
      const mockUser = {
        id: result.user?.id ?? "1",
        email: formData.email,
        fullName: result.user?.fullName ?? "User",
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
      setError(err?.response?.data?.message || "Authentication failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const roles = [
    {
      id: "student",
      label: "Student",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBPGkPLZUd1zHNoZnDHc7TwvIKpjtDYa3MVrTl7xk1mGaeY8dJGP7g32UgtuTFRB6WX0mDmFLMNAGtZE-bGizb8sC6xzqhkmblFCi3WJR0pDMOPpysz2HDHBNdnGc0h_es3kugYGrVxKEkF-3LuQeB5SIofQgjmh9wyGVcSoHxkILOD1Anyt-SWjYJYmGXaJdB38B_UO3Pwg80HlL02lwQhhHrPo3aR2BwihoRCB9ztuIDZRbJM1O6cGKonE4RXrST6O4mYZ4RVEEg",
    },
    {
      id: "organizer",
      label: "Organizer",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDruA4RT_G63TeWm8HoS367mK3r3pAafcvDVl45QDw9r0aRPddOAPzCSemv4WLfs5cbVXB0reLoUohZUoLQVVjfIjnu6nXj14gChK3mFUNQhqXr1qIJJxPAHufhk7cMg9rQD3jXQ1iVstfGgJ6t4e6exIi0QlgKCNiXU6c4K0c2jpYtSZB824x3femRT1C0GlE1OME7mI25ITcH65IuBbiGAEY3FpfqNj00zi8NUvUT1yd3c-ZqEOYdrRAzWiedciIHMoFjxXR89bc",
    },
    {
      id: "sponsor",
      label: "Sponsor",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAg7hvMljrZGLkAa-tHrsvrXc6aWQKvY6z2QtcTp3gc3CqW8cWiA818mvPgAsK507AkgNY6LqS6FWArMduRVZpbfXWR3DPxEPFwTUHGHLSXnTq8YTyfP63Ax4ZcZ-vvkvXhVm9gk2vBpO2CL1JYjFDCWRuY5mcLh0r9KfY4UL9QYRWUiLr21-yaoGHwp2iqzM0TuiETjZO076wplw5Noyh1ry7UPpZdbrjicQfy758bPkQy9mS-IdjryddzxOmuoehCjXIuHtOg_kQ",
    },
  ];

  return (
    <div className="h-screen w-screen flex items-center justify-center font-sans antialiased selection:bg-primary selection:text-white overflow-hidden bg-black">
      {/* Digital Dust */}
      <div className="digital-dust"></div>
      {/* Radial gradient background */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-neutral-900/50 via-black to-black -z-20"></div>

      {/* Main Container */}
      <div className="relative w-full max-w-[1200px] h-full lg:h-[700px] bg-black lg:border lg:border-neutral-800 lg:rounded-xl shadow-2xl flex flex-col lg:flex-row overflow-hidden mx-auto my-auto z-10">

        {/* Left Panel - Mascot */}
        <div className="w-full lg:w-1/2 relative bg-[#050505] overflow-hidden flex items-center justify-center border-b lg:border-b-0 lg:border-r border-neutral-800 min-h-[300px] lg:min-h-0">
          <div className="absolute inset-0 hero-pattern opacity-20"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] cinematic-glow pointer-events-none"></div>

          {/* Floating Elements */}
          <div className="absolute top-16 left-8 w-12 h-12 border border-neutral-700 bg-neutral-900/50 backdrop-blur rounded flex items-center justify-center float-slow opacity-60">
            <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z" />
            </svg>
          </div>
          <div className="absolute bottom-24 right-8 w-14 h-14 border border-neutral-700 bg-neutral-900/50 backdrop-blur rounded-full flex items-center justify-center float-med opacity-60">
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 9l1.25-2.75L23 5l-2.75-1.25L19 1l-1.25 2.75L15 5l2.75 1.25L19 9zm-7.5.5L9 4 6.5 9.5 1 12l5.5 2.5L9 20l2.5-5.5L17 12l-5.5-2.5z" />
            </svg>
          </div>
          <div className="absolute top-1/4 right-16 w-8 h-8 border border-primary/30 bg-primary/10 backdrop-blur rounded rotate-45 flex items-center justify-center float-fast-auth">
            <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
          </div>

          {/* Mascot */}
          <div className="relative z-10 w-full max-w-sm aspect-square flex items-center justify-center p-6">
            <img
              alt="Takathon Phoenix Mascot"
              className="w-full h-full object-contain drop-shadow-[0_20px_50px_rgba(255,92,0,0.3)] filter contrast-125 saturate-150 mascot-float"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBp-h5nlug8j53t4bKjxp3SnwaCPWxpJJK0I4_6pJ_2byaHtwPkE041jeZ7HEt4tV5dNeCqFELA5oIM73cPeovkg49RJ_clC3Q4ICjlf4Tx_vmoBBstQ4t5WmukmqgcypJxP3O7aey7XYlvSE7jVNxgDlexmemSaRwdh-DhFCBOT6JGTEjO74Gg5MH1xdvVuSZwVX3gWpHRSRWRizxC62VdiML7fj7vpc6QRRcWyAnf2z3qBpX97kqjmVou3SpBbf6dXJzsJz1i7wc"
            />
          </div>

          {/* Bottom Text */}
          <div className="absolute bottom-8 left-0 right-0 text-center px-6">
            <h2 className="text-xl font-black text-white tracking-widest uppercase opacity-90">
              Happy to <span className="text-primary">See You</span>
            </h2>
            <div className="w-12 h-1 bg-primary mx-auto mt-3"></div>
          </div>
        </div>

        {/* Right Panel - Form */}
        <div className="w-full lg:w-1/2 bg-black relative flex flex-col justify-center px-8 py-4 lg:px-12 lg:py-6">
          {/* Return Link */}
          <div className="mb-4">
            <div className="flex justify-end items-start mb-2">
              <Link href="/" className="flex items-center gap-1.5 text-neutral-500 hover:text-primary transition-colors text-[10px] font-bold uppercase tracking-widest group">
                <svg className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
                </svg>
                Return to Home
              </Link>
            </div>
            <h1 className="text-4xl lg:text-5xl font-black text-white leading-tight uppercase tracking-tight">
              Login to <span className="text-primary">Continue</span>
            </h1>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex-1 flex flex-col justify-center space-y-4">
            {/* Role Selector Cards */}
            <div>
              <div className="grid grid-cols-3 gap-3 h-32">
                {roles.map((role) => (
                  <div key={role.id} className="relative group h-full">
                    <input
                      type="radio"
                      name="role"
                      id={`role-${role.id}`}
                      className="peer sr-only role-radio"
                      checked={selectedRole === role.id}
                      onChange={() => setSelectedRole(role.id as Exclude<UserRole, null>)}
                    />
                    <label
                      htmlFor={`role-${role.id}`}
                      className="h-full w-full block relative rounded-lg overflow-hidden border border-neutral-800 cursor-pointer transition-all duration-300 hover:border-neutral-500"
                    >
                      <div
                        className="absolute inset-0 bg-cover bg-center grayscale group-hover:grayscale-0 transition-all duration-500"
                        style={{ backgroundImage: `url('${role.image}')` }}
                      ></div>
                      <div className="overlay absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent transition-all duration-300"></div>
                      <div className="absolute bottom-2 left-0 right-0 text-center z-10">
                        <span className="font-black text-[10px] uppercase tracking-widest text-neutral-300 block">
                          {role.label}
                        </span>
                      </div>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {error && <div className="text-sm text-red-400">{error}</div>}

            {/* Input Fields */}
            <div className="space-y-3">
              <div className="group">
                <label className="block text-[10px] font-bold mb-1 ml-1 text-neutral-500 group-focus-within:text-primary transition-colors">
                  EMAIL IDENTITY
                </label>
                <div className="relative">
                  <input
                    className="tech-input w-full px-4 py-2.5 text-sm font-medium rounded-none placeholder-neutral-700"
                    placeholder="ENTER YOUR EMAIL"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                  <div className="absolute right-0 top-0 bottom-0 w-1 bg-neutral-800 group-focus-within:bg-primary transition-colors"></div>
                </div>
              </div>
              <div className="group">
                <label className="block text-[10px] font-bold mb-1 ml-1 text-neutral-500 group-focus-within:text-primary transition-colors">
                  PASSWORD
                </label>
                <div className="relative">
                  <input
                    className="tech-input w-full px-4 py-2.5 text-sm font-medium rounded-none placeholder-neutral-700"
                    placeholder="••••••••••••"
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                  <div className="absolute right-0 top-0 bottom-0 w-1 bg-neutral-800 group-focus-within:bg-primary transition-colors"></div>
                </div>
              </div>
            </div>

            {/* Links */}
            <div className="flex justify-between items-center text-[10px] font-bold tracking-wide py-1">
              <button type="button" className="text-neutral-500 hover:text-white transition-colors">
                FORGOT PASSWORD?
              </button>
              <Link href="/signup" className="text-white hover:text-primary transition-colors flex items-center gap-2 group">
                NEW TO TAKATHON? <span className="text-primary group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary btn-3d shadow-button-bevel text-white font-black text-lg tracking-widest py-3 uppercase hover:bg-[#ff7b1a] relative overflow-hidden group mt-1 disabled:opacity-50"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {loading ? "SIGNING IN..." : "LOGIN"}
              </span>
            </button>
          </form>
          <div className="pt-3 h-4"></div>
        </div>
      </div>
    </div>
  );
}
