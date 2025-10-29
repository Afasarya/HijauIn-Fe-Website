"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      router.push("/");
    }, 1500);
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Side - Image/Illustration */}
      <div className="hidden lg:flex lg:w-1/2 bg-linear-to-br from-emerald-900/20 via-emerald-800/10 to-teal-900/20 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        
        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center w-full p-12">
          {/* Logo */}
          <div className="mb-8">
            <div className="relative h-32 w-32">
              <Image
                src="/images/logo.svg"
                alt="HijauIn Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>

          {/* Brand Text */}
          <div className="text-center space-y-4 max-w-md">
            <h1 className="text-4xl font-bold text-white">
              HijauIn Admin
            </h1>
            <p className="text-lg text-gray-300 leading-relaxed">
              Manage your eco-tech waste management platform with powerful admin tools
            </p>
          </div>

          {/* Decorative Elements */}
          <div className="mt-12 space-y-4 text-sm text-gray-400">
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
              <span>Real-time waste location tracking</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
              <span>User & transaction management</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
              <span>Content & product administration</span>
            </div>
          </div>

          {/* Quote/Testimonial */}
          <div className="mt-auto pt-12 text-center max-w-lg">
            <p className="text-sm text-gray-400 italic">
              "This library has saved me countless hours of work and helped me deliver stunning designs to my clients faster than ever before."
            </p>
            <p className="mt-2 text-xs text-emerald-400">- Sofia Davis</p>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-8 lg:p-12">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-8 flex justify-center">
            <div className="relative h-16 w-16">
              <Image
                src="/images/logo.svg"
                alt="HijauIn Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white">HijauIn Admin</h2>
            <p className="mt-2 text-sm text-gray-400">
              Welcome back! Please sign in to continue
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Input */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-medium text-gray-300"
              >
                Email or Username
              </label>
              <Input
                id="email"
                type="text"
                placeholder="admin@hijauin.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="h-12 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus-visible:ring-emerald-500/50 focus-visible:border-emerald-500/50"
                required
              />
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-medium text-gray-300"
              >
                Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="h-12 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus-visible:ring-emerald-500/50 focus-visible:border-emerald-500/50 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <input
                  id="remember"
                  type="checkbox"
                  checked={formData.remember}
                  onChange={(e) =>
                    setFormData({ ...formData, remember: e.target.checked })
                  }
                  className="h-4 w-4 rounded border-white/10 bg-white/5 text-emerald-500 focus:ring-2 focus:ring-emerald-500/50 focus:ring-offset-0"
                />
                <label
                  htmlFor="remember"
                  className="text-sm text-gray-400 cursor-pointer select-none"
                >
                  Remember me
                </label>
              </div>
              <Link
                href="/forgot-password"
                className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors font-medium"
              >
                Forgot password?
              </Link>
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-lg shadow-emerald-500/20 transition-all text-base"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>

          {/* Footer */}
          <p className="mt-8 text-center text-xs text-gray-500">
            Protected by HijauIn Security © 2025
          </p>
        </div>
      </div>
    </div>
  );
}
