"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { ArrowLeftRight, ChevronDown } from "lucide-react";
import {
  BIG_TEN_SCHOOLS,
  SPORTS,
  getEspnLogoUrl,
  RATING_DIMENSIONS,
} from "@/constants/data";
import { School, Sport, Review } from "@/types";
import { createClient } from "@/lib/supabase/client";

interface ProgramPick {
  school: School | null;
  sport: Sport | null;
}

function avg(reviews: Review[], key: keyof Review): number {
  if (!reviews.length) return 0;
  const vals = reviews.map((r) => r[key] as number).filter(Boolean);
  return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
}

function ProgramSelector({
  label,
  value,
  onChange,
}: {
  label: string;
  value: ProgramPick;
  onChange: (p: ProgramPick) => void;
}) {
  return (
    <div
      className="flex-1 rounded-xl border p-5 flex flex-col gap-4"
      style={{ background: "var(--bg-card)", borderColor: "var(--border-color)" }}
    >
      <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#4ECBA5" }}>
        {label}
      </p>

      {/* School picker */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs" style={{ color: "var(--text-muted)" }}>
          School
        </label>
        <div className="relative">
          <select
            value={value.school?.id ?? ""}
            onChange={(e) => {
              const school = BIG_TEN_SCHOOLS.find((s) => s.id === e.target.value) ?? null;
              onChange({ ...value, school });
            }}
            className="w-full appearance-none px-3 py-2 pr-8 text-sm rounded-lg border outline-none"
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
            className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: "var(--text-muted)" }}
          />
        </div>
      </div>

      {/* Sport picker */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs" style={{ color: "var(--text-muted)" }}>
          Sport
        </label>
        <div className="relative">
          <select
            value={value.sport?.id ?? ""}
            onChange={(e) => {
              const sport = SPORTS.find((s) => s.id === e.target.value) ?? null;
              onChange({ ...value, sport });
            }}
            className="w-full appearance-none px-3 py-2 pr-8 text-sm rounded-lg border outline-none"
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
            className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: "var(--text-muted)" }}
          />
        </div>
      </div>

      {/* Preview */}
      {value.school && (
        <div className="flex items-center gap-3 mt-1">
          <div className="relative w-10 h-10 shrink-0">
            <Image
              src={getEspnLogoUrl(value.school.espnId)}
              alt={value.school.name}
              fill
              className="object-contain"
              unoptimized
            />
          </div>
          <div>
            <p className="font-bold text-sm" style={{ color: "var(--foreground)" }}>
              {value.school.name}
            </p>
            {value.sport && (
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                {value.sport.name}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function ComparePage() {
  const [left, setLeft] = useState<ProgramPick>({ school: null, sport: null });
  const [right, setRight] = useState<ProgramPick>({ school: null, sport: null });
  const [leftReviews, setLeftReviews] = useState<Review[]>([]);
  const [rightReviews, setRightReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchReviews = useCallback(async () => {
    if (!left.school || !left.sport || !right.school || !right.sport) return;
    setLoading(true);
    const supabase = createClient();
    const [l, r] = await Promise.all([
      supabase
        .from("reviews")
        .select("*")
        .eq("school_id", left.school.id)
        .eq("sport_id", left.sport.id),
      supabase
        .from("reviews")
        .select("*")
        .eq("school_id", right.school.id)
        .eq("sport_id", right.sport.id),
    ]);
    setLeftReviews((l.data ?? []) as Review[]);
    setRightReviews((r.data ?? []) as Review[]);
    setLoading(false);
  }, [left.school, left.sport, right.school, right.sport]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const canCompare =
    left.school && left.sport && right.school && right.sport;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-black mb-1" style={{ color: "var(--foreground)" }}>
          Compare Programs
        </h1>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          Side-by-side comparison of any two Big Ten programs
        </p>
      </div>

      {/* Selectors */}
      <div className="flex gap-4 items-start mb-8 flex-col sm:flex-row">
        <ProgramSelector label="Program A" value={left} onChange={setLeft} />
        <div className="flex items-center justify-center pt-12 shrink-0">
          <div
            className="p-2 rounded-full"
            style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)" }}
          >
            <ArrowLeftRight size={18} style={{ color: "#4ECBA5" }} />
          </div>
        </div>
        <ProgramSelector label="Program B" value={right} onChange={setRight} />
      </div>

      {/* Results */}
      {canCompare && (
        <div>
          {loading ? (
            <div className="text-center py-10">
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>Loading…</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {RATING_DIMENSIONS.map((dim) => {
                const lVal = avg(leftReviews, dim.key);
                const rVal = avg(rightReviews, dim.key);
                const winner = lVal > rVal ? "left" : rVal > lVal ? "right" : "tie";

                return (
                  <div
                    key={dim.key}
                    className="rounded-xl border p-4"
                    style={{ background: "var(--bg-card)", borderColor: "var(--border-color)" }}
                  >
                    <p className="text-xs font-semibold text-center mb-3" style={{ color: "var(--text-muted)" }}>
                      {dim.icon} {dim.label}
                    </p>
                    <div className="flex items-center gap-4">
                      {/* Left */}
                      <div className="flex-1 text-right">
                        <span
                          className="text-2xl font-black tabular-nums"
                          style={{
                            color:
                              winner === "left"
                                ? "#4ECBA5"
                                : "var(--text-muted)",
                          }}
                        >
                          {leftReviews.length ? lVal.toFixed(1) : "—"}
                        </span>
                        {winner === "left" && (
                          <span className="ml-1.5 text-xs font-bold" style={{ color: "#4ECBA5" }}>
                            ▲
                          </span>
                        )}
                      </div>

                      {/* Bar */}
                      <div className="flex-[2] flex items-center gap-1 h-4">
                        <div className="flex-1 h-2 rounded-full overflow-hidden flex justify-end" style={{ background: "var(--border-color)" }}>
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${(lVal / 5) * 100}%`,
                              background:
                                left.school?.primaryColor ?? "#4ECBA5",
                            }}
                          />
                        </div>
                        <div className="w-px h-4 shrink-0" style={{ background: "var(--border-color)" }} />
                        <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: "var(--border-color)" }}>
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${(rVal / 5) * 100}%`,
                              background:
                                right.school?.primaryColor ?? "#4ECBA5",
                            }}
                          />
                        </div>
                      </div>

                      {/* Right */}
                      <div className="flex-1 text-left">
                        {winner === "right" && (
                          <span className="mr-1.5 text-xs font-bold" style={{ color: "#4ECBA5" }}>
                            ▲
                          </span>
                        )}
                        <span
                          className="text-2xl font-black tabular-nums"
                          style={{
                            color:
                              winner === "right"
                                ? "#4ECBA5"
                                : "var(--text-muted)",
                          }}
                        >
                          {rightReviews.length ? rVal.toFixed(1) : "—"}
                        </span>
                      </div>
                    </div>

                    {/* School labels */}
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs" style={{ color: "var(--text-dim)" }}>
                        {left.school?.abbr}
                      </span>
                      <span className="text-xs" style={{ color: "var(--text-dim)" }}>
                        {right.school?.abbr}
                      </span>
                    </div>

                    {/* No data notice */}
                    {(!leftReviews.length || !rightReviews.length) && (
                      <p className="text-xs text-center mt-2" style={{ color: "var(--text-dim)" }}>
                        {!leftReviews.length && !rightReviews.length
                          ? "No reviews for either program yet"
                          : !leftReviews.length
                          ? `No reviews for ${left.school?.name} yet`
                          : `No reviews for ${right.school?.name} yet`}
                      </p>
                    )}
                  </div>
                );
              })}

              {/* Review counts */}
              <div
                className="rounded-xl border p-4 flex justify-around"
                style={{ background: "var(--bg-card)", borderColor: "var(--border-color)" }}
              >
                <div className="text-center">
                  <p className="text-2xl font-black" style={{ color: "var(--foreground)" }}>
                    {leftReviews.length}
                  </p>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                    {left.school?.name} reviews
                  </p>
                </div>
                <div className="w-px" style={{ background: "var(--border-color)" }} />
                <div className="text-center">
                  <p className="text-2xl font-black" style={{ color: "var(--foreground)" }}>
                    {rightReviews.length}
                  </p>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                    {right.school?.name} reviews
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {!canCompare && (
        <div
          className="rounded-xl border p-16 text-center"
          style={{ borderColor: "var(--border-color)", background: "var(--bg-card)" }}
        >
          <p className="text-3xl mb-3">⚖️</p>
          <p className="font-bold mb-1" style={{ color: "var(--foreground)" }}>
            Select two programs to compare
          </p>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Choose a school and sport for each side above
          </p>
        </div>
      )}
    </div>
  );
}
