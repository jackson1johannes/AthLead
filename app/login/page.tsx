"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (authError) throw authError;
      router.push("/");
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm flex flex-col gap-8">
        {/* Logo */}
        <div className="text-center">
          <Link href="/" className="font-black text-2xl" style={{ color: "#4ECBA5" }}>
            AthLead
          </Link>
          <p className="mt-2 text-sm" style={{ color: "var(--text-muted)" }}>
            Welcome back
          </p>
        </div>

        {/* Card */}
        <div
          className="rounded-2xl border p-6 flex flex-col gap-5"
          style={{ background: "var(--bg-card)", borderColor: "var(--border-color)" }}
        >
          <h1 className="font-bold text-xl" style={{ color: "var(--foreground)" }}>
            Sign in
          </h1>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@school.edu"
                className="px-3 py-2.5 text-sm rounded-lg border outline-none focus:ring-2 focus:ring-[#4ECBA5]/40"
                style={{
                  background: "var(--bg-card-hover)",
                  borderColor: "var(--border-color)",
                  color: "var(--foreground)",
                }}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>
                Password
              </label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full px-3 py-2.5 pr-10 text-sm rounded-lg border outline-none focus:ring-2 focus:ring-[#4ECBA5]/40"
                  style={{
                    background: "var(--bg-card-hover)",
                    borderColor: "var(--border-color)",
                    color: "var(--foreground)",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: "var(--text-muted)" }}
                >
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-xs font-medium" style={{ color: "#ef4444" }}>
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="py-2.5 rounded-lg font-bold text-sm transition-opacity disabled:opacity-50 hover:opacity-90"
              style={{ background: "#4ECBA5", color: "#000" }}
            >
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <p className="text-center text-xs" style={{ color: "var(--text-muted)" }}>
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="font-semibold hover:underline"
              style={{ color: "#4ECBA5" }}
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
