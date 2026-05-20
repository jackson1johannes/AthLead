"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ChevronDown } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { BIG_TEN_SCHOOLS, SPORTS } from "@/constants/data";

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState<"account" | "profile" | "done">("account");

  // Account fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPw, setShowPw] = useState(false);

  // Profile fields
  const [schoolId, setSchoolId] = useState("");
  const [sportId, setSportId] = useState("");
  const [role, setRole] = useState<"athlete" | "fan">("athlete");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    if (step === "account") {
      if (!fullName.trim()) { setError("Full name is required"); return; }
      if (password.length < 8) { setError("Password must be at least 8 characters"); return; }
      setError("");
      setStep("profile");
      return;
    }

    setError("");
    setLoading(true);
    try {
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            school_id: schoolId || null,
            sport_id: sportId || null,
            role,
          },
        },
      });
      if (authError) throw authError;
      setStep("done");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Sign up failed");
    } finally {
      setLoading(false);
    }
  }

  if (step === "done") {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-sm text-center flex flex-col items-center gap-5">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-2xl"
            style={{ background: "rgba(78,203,165,0.15)" }}
          >
            ✅
          </div>
          <h1 className="font-black text-2xl" style={{ color: "var(--foreground)" }}>
            Check your email
          </h1>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            We sent a confirmation link to <strong style={{ color: "var(--foreground)" }}>{email}</strong>.
            Click it to activate your account.
          </p>
          <Link
            href="/login"
            className="px-6 py-2.5 rounded-xl font-bold text-sm"
            style={{ background: "#4ECBA5", color: "#000" }}
          >
            Back to login
          </Link>
        </div>
      </div>
    );
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
            Create your account
          </p>
        </div>

        {/* Progress */}
        <div className="flex gap-2">
          {["Account", "Profile"].map((s, i) => (
            <div
              key={s}
              className="flex-1 h-1 rounded-full"
              style={{
                background:
                  (i === 0 && step === "account") ||
                  (i === 0 && step === "profile") ||
                  (i === 1 && step === "profile")
                    ? "#4ECBA5"
                    : "var(--border-color)",
              }}
            />
          ))}
        </div>

        {/* Card */}
        <div
          className="rounded-2xl border p-6 flex flex-col gap-5"
          style={{ background: "var(--bg-card)", borderColor: "var(--border-color)" }}
        >
          <h1 className="font-bold text-xl" style={{ color: "var(--foreground)" }}>
            {step === "account" ? "Create account" : "Your profile"}
          </h1>

          <form onSubmit={handleSignup} className="flex flex-col gap-4">
            {step === "account" ? (
              <>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>
                    Full name
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    placeholder="Your name"
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
                      placeholder="At least 8 characters"
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
              </>
            ) : (
              <>
                {/* Role */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>
                    I am a…
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {(["athlete", "fan"] as const).map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setRole(r)}
                        className="py-2 rounded-lg text-sm font-semibold border capitalize transition-colors"
                        style={{
                          background: role === r ? "#4ECBA5" : "var(--bg-card-hover)",
                          borderColor: role === r ? "#4ECBA5" : "var(--border-color)",
                          color: role === r ? "#000" : "var(--foreground)",
                        }}
                      >
                        {r === "athlete" ? "🏅 Athlete" : "👀 Fan"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* School */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>
                    School (optional)
                  </label>
                  <div className="relative">
                    <select
                      value={schoolId}
                      onChange={(e) => setSchoolId(e.target.value)}
                      className="w-full appearance-none px-3 py-2.5 pr-8 text-sm rounded-lg border outline-none"
                      style={{
                        background: "var(--bg-card-hover)",
                        borderColor: "var(--border-color)",
                        color: "var(--foreground)",
                      }}
                    >
                      <option value="">Select school…</option>
                      {BIG_TEN_SCHOOLS.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={14}
                      className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                      style={{ color: "var(--text-muted)" }}
                    />
                  </div>
                </div>

                {/* Sport */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>
                    Sport (optional)
                  </label>
                  <div className="relative">
                    <select
                      value={sportId}
                      onChange={(e) => setSportId(e.target.value)}
                      className="w-full appearance-none px-3 py-2.5 pr-8 text-sm rounded-lg border outline-none"
                      style={{
                        background: "var(--bg-card-hover)",
                        borderColor: "var(--border-color)",
                        color: "var(--foreground)",
                      }}
                    >
                      <option value="">Select sport…</option>
                      {SPORTS.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.icon} {s.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={14}
                      className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                      style={{ color: "var(--text-muted)" }}
                    />
                  </div>
                </div>
              </>
            )}

            {error && (
              <p className="text-xs font-medium" style={{ color: "#ef4444" }}>
                {error}
              </p>
            )}

            <div className="flex gap-2">
              {step === "profile" && (
                <button
                  type="button"
                  onClick={() => setStep("account")}
                  className="flex-1 py-2.5 rounded-lg font-semibold text-sm border transition-colors hover:bg-[#4ECBA5]/10"
                  style={{ borderColor: "var(--border-color)", color: "var(--text-muted)" }}
                >
                  Back
                </button>
              )}
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-2.5 rounded-lg font-bold text-sm transition-opacity disabled:opacity-50 hover:opacity-90"
                style={{ background: "#4ECBA5", color: "#000" }}
              >
                {loading
                  ? "Creating account…"
                  : step === "account"
                  ? "Continue"
                  : "Create account"}
              </button>
            </div>
          </form>

          <p className="text-center text-xs" style={{ color: "var(--text-muted)" }}>
            Already have an account?{" "}
            <Link href="/login" className="font-semibold hover:underline" style={{ color: "#4ECBA5" }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
