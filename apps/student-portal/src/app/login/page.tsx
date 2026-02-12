"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react";

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Implement authentication logic
        console.log("Login attempt:", formData);
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-dark via-dark-50 to-dark opacity-50" />
            
            {/* Animated background orbs */}
            <div className="absolute top-20 left-10 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-float" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }} />

            {/* Login Card */}
            <div className="relative z-10 w-full max-w-md mx-4">
                <div className="glass rounded-2xl p-8 shadow-2xl">
                    {/* Logo */}
                    <div className="text-center mb-8">
                        <Link href="/" className="inline-flex items-center gap-2 group">
                            <span className="text-4xl font-bold text-primary transition-all duration-300 group-hover:text-glow-sm">
                                T
                            </span>
                            <span className="text-2xl font-semibold text-white/90 tracking-wide">
                                AKATHON
                            </span>
                        </Link>
                        <p className="text-white/60 mt-2 text-sm">
                            Welcome back! Sign in to continue
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-white/80 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                                <input
                                    id="email"
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="input-field pl-11"
                                    placeholder="you@example.com"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-white/80 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="input-field pl-11 pr-11"
                                    placeholder="••••••••"
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

                        {/* Remember & Forgot */}
                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input type="checkbox" className="w-4 h-4 rounded border-white/20 bg-white/5 text-primary focus:ring-primary focus:ring-offset-0" />
                                <span className="text-white/60 group-hover:text-white/80 transition-colors">Remember me</span>
                            </label>
                            <Link href="/forgot-password" className="text-primary hover:text-primary-light transition-colors">
                                Forgot password?
                            </Link>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full btn-primary flex items-center justify-center gap-2 group"
                        >
                            <span>Sign In</span>
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-white/10" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-dark text-white/40">OR</span>
                        </div>
                    </div>

                    {/* Sign Up Link */}
                    <p className="text-center text-sm text-white/60">
                        Don't have an account?{" "}
                        <Link href="/signup" className="text-primary hover:text-primary-light font-semibold transition-colors">
                            Create one now
                        </Link>
                    </p>
                </div>

                {/* Back to home */}
                <div className="text-center mt-6">
                    <Link href="/" className="text-sm text-white/40 hover:text-white/70 transition-colors">
                        ← Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
