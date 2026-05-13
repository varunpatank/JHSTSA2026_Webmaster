"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { authApi } from "@/lib/api";
import { loginUser } from "@/lib/clientState";
import HeroSection from "@/components/HeroSection";
import { BookOpen, Calendar, Gavel, LogIn, Shield, Users } from "lucide-react";

interface LoginFormClientProps {
  redirect: string;
}

export default function LoginFormClient({
  redirect,
}: LoginFormClientProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const accountCreated = searchParams.get("created") === "1";
  const { status } = useSession();

  useEffect(() => {
    if (status === "loading") return;
    // Only redirect when NextAuth definitively says authenticated.
    // Don't check Supabase here — its session recovery timing can conflict
    // with the profile page's own check, causing a redirect loop.
    if (status === "authenticated") {
      router.replace(redirect);
      return;
    }
    setCheckingAuth(false);
  }, [router, status, redirect]);


  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    if (!email || !password) return;
    setSubmitting(true);

    (async () => {
      try {
        const res = await authApi.signInWithEmail(email, password);
        if (res.error) {
          setError(res.error.message || "Sign in failed");
          setSubmitting(false);
          return;
        }

        loginUser(res.data?.user?.email?.split('@')[0] || email, email);
        router.push(redirect);
      } catch (e: any) {
        setError(e?.message || "Sign in failed");
      } finally {
        setSubmitting(false);
      }
    })();
  };

  const onJudgeLogin = () => {
    setEmail("judge@jhstsa.edu");
    setPassword("Judge!1");
    setError(null);
    setSubmitting(true);
    (async () => {
      try {
        const res = await authApi.signInWithEmail("judge@jhstsa.edu", "Judge!1");
        if (res.error) {
          setError("Judge account not found. Ask your admin to set up judge@jhstsa.edu.");
          setSubmitting(false);
          return;
        }
        loginUser(res.data?.user?.email?.split('@')[0] || "judge", "judge@jhstsa.edu");
        router.push(redirect);
      } catch (e: any) {
        setError(e?.message || "Judge sign in failed");
      } finally {
        setSubmitting(false);
      }
    })();
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-neutral-100 flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-primary-300 border-t-primary-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-100">
      <HeroSection
        eyebrow="Account"
        title="Welcome Back"
        description="Sign in to manage your clubs, events, and profile."
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="card p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10  bg-primary-100 text-primary-700 flex items-center justify-center">
                <LogIn size={20} />
              </div>
              <div>
                <h2 className="text-xl font-heading font-bold text-primary-600">Login</h2>
                <p className="text-sm text-neutral-500">Email & password authentication</p>
              </div>
            </div>

            <form className="space-y-4" onSubmit={onSubmit}>
              {accountCreated && (
                <div className="p-3 bg-green-50 border border-green-200 text-sm text-green-800">
                  Account created! Please sign in.
                </div>
              )}
              {error && (
                <div className="p-3  bg-red-50 border border-red-200 text-sm text-red-700">
                  {error}
                </div>
              )}
              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field"
                  placeholder="student@jhstsa.edu"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field"
                  placeholder="••••••••"
                  required
                />
              </div>
              <button type="submit" className="btn-primary w-full" disabled={submitting}>
                {submitting ? "Signing in..." : "Sign In"}
              </button>
              <div className="relative flex items-center gap-3">
                <div className="flex-1 border-t border-neutral-200" />
                <span className="text-xs text-neutral-400 font-medium">or</span>
                <div className="flex-1 border-t border-neutral-200" />
              </div>
              <button type="button" onClick={onJudgeLogin} disabled={submitting}
                className="w-full flex items-center justify-center gap-2 py-2.5 border-2 border-secondary-400 bg-secondary-50 text-secondary-800 text-sm font-bold hover:bg-secondary-100 transition-colors disabled:opacity-50">
                <Gavel size={15} /> Judge Quick Login
              </button>
            </form>

            <div className="mt-6 border-t border-neutral-200 pt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <p className="text-sm text-neutral-600">
                Don&apos;t have an account?{" "}
                <Link href="/signup" className="text-primary-600 font-semibold hover:underline">
                  Sign up
                </Link>
              </p>
              <Link href="/" className="text-sm text-primary-600 hover:underline">
                ← Back to Homepage
              </Link>
            </div>
          </div>
        </div>

        {}
        <aside className="space-y-5">
          <div className="card p-6 bg-gradient-to-br from-primary-50 to-white">
            <h3 className="text-lg font-heading font-bold text-primary-600">Why Sign In?</h3>
            <div className="mt-4 space-y-4">
              {[
                { icon: Users, label: "Join and manage clubs" },
                { icon: Calendar, label: "RSVP to events" },
                { icon: BookOpen, label: "Access resource library" },
                { icon: Shield, label: "Submit proposals & comments" },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="flex items-center gap-3">
                    <div className="w-8 h-8  bg-primary-100 text-primary-700 flex items-center justify-center shrink-0">
                      <Icon size={16} />
                    </div>
                    <span className="text-sm text-neutral-700">{item.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="card p-6">
            <h3 className="text-lg font-heading font-bold text-primary-600">Explore First</h3>
            <div className="mt-3 space-y-2">
              <Link href="/directory" className="block text-sm text-primary-600 hover:underline">Browse clubs</Link>
              <Link href="/events" className="block text-sm text-primary-600 hover:underline">View events</Link>
              <Link href="/guidance" className="block text-sm text-primary-600 hover:underline">Guidance hub</Link>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
