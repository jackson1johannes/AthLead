import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Star, Plus } from "lucide-react";
import {
  getSchoolById,
  getSportById,
  getEspnLogoUrl,
  getContrastColor,
  RATING_DIMENSIONS,
} from "@/constants/data";
import { createClient } from "@/lib/supabase/server";
import { Review } from "@/types";
import { ReviewCard } from "@/components/ReviewCard";
import ProgramClientSection from "./ProgramClientSection";

interface Props {
  params: Promise<{ schoolId: string; sportId: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { schoolId, sportId } = await params;
  const school = getSchoolById(schoolId);
  const sport = getSportById(sportId);
  if (!school || !sport) return {};
  return {
    title: `${school.name} ${sport.name} — AthLead`,
    description: `Reviews and ratings for the ${school.name} ${sport.name} program.`,
  };
}

export default async function ProgramPage({ params }: Props) {
  const { schoolId, sportId } = await params;
  const school = getSchoolById(schoolId);
  const sport = getSportById(sportId);
  if (!school || !sport) notFound();

  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  const { data: reviews } = await supabase
    .from("reviews")
    .select("*")
    .eq("school_id", school.id)
    .eq("sport_id", sport.id)
    .order("created_at", { ascending: false });

  const { data: coaches } = await supabase
    .from("coaches")
    .select("*")
    .eq("school_id", school.id)
    .eq("sport_id", sport.id);

  const typedReviews = (reviews ?? []) as Review[];

  // Compute averages
  const avgOf = (key: keyof Review) => {
    if (!typedReviews.length) return 0;
    const vals = typedReviews.map((r) => r[key] as number).filter(Boolean);
    return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
  };

  const avgOverall = avgOf("rating_overall");

  const logoUrl = getEspnLogoUrl(school.espnId);
  const textOnPrimary = getContrastColor(school.primaryColor);

  return (
    <div>
      {/* Header */}
      <div
        className="relative overflow-hidden"
        style={{ background: school.primaryColor }}
      >
        <div className="relative max-w-7xl mx-auto px-4 py-8">
          <Link
            href={`/school/${school.slug}`}
            className="inline-flex items-center gap-1.5 text-xs font-medium mb-5 opacity-70 hover:opacity-100 transition-opacity"
            style={{ color: textOnPrimary }}
          >
            <ArrowLeft size={13} />
            {school.name}
          </Link>

          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5">
            <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-white/10">
              <Image
                src={logoUrl}
                alt={school.name}
                fill
                className="object-contain p-2"
                unoptimized
                priority
              />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <p className="text-xs font-semibold uppercase tracking-widest opacity-70 mb-0.5" style={{ color: textOnPrimary }}>
                {school.name}
              </p>
              <h1 className="text-3xl font-black" style={{ color: textOnPrimary }}>
                {sport.icon} {sport.name}
              </h1>
            </div>

            {/* Overall rating */}
            {typedReviews.length > 0 && (
              <div
                className="flex flex-col items-center gap-0.5 px-5 py-3 rounded-xl shrink-0"
                style={{ background: "rgba(255,255,255,0.12)" }}
              >
                <span className="text-3xl font-black" style={{ color: textOnPrimary }}>
                  {avgOverall.toFixed(1)}
                </span>
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      size={12}
                      fill={s <= Math.round(avgOverall) ? textOnPrimary : "transparent"}
                      color={textOnPrimary}
                    />
                  ))}
                </div>
                <span className="text-xs opacity-70" style={{ color: textOnPrimary }}>
                  {typedReviews.length} review{typedReviews.length !== 1 ? "s" : ""}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 py-10 grid lg:grid-cols-3 gap-8">
        {/* Left column */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          {/* Rating dimensions */}
          {typedReviews.length > 0 && (
            <div
              className="rounded-xl p-5 border"
              style={{ background: "var(--bg-card)", borderColor: "var(--border-color)" }}
            >
              <h2 className="font-bold text-base mb-4" style={{ color: "var(--foreground)" }}>
                Program Ratings
              </h2>
              <div className="flex flex-col gap-3">
                {RATING_DIMENSIONS.map((dim) => {
                  const avg = avgOf(dim.key);
                  return (
                    <div key={dim.key} className="flex items-center gap-3">
                      <span className="text-sm w-28 shrink-0" style={{ color: "var(--text-muted)" }}>
                        {dim.icon} {dim.label}
                      </span>
                      <div
                        className="flex-1 h-2 rounded-full overflow-hidden"
                        style={{ background: "var(--border-color)" }}
                      >
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${(avg / 5) * 100}%`,
                            background: school.primaryColor,
                          }}
                        />
                      </div>
                      <span
                        className="text-sm font-bold w-8 text-right tabular-nums"
                        style={{ color: "var(--foreground)" }}
                      >
                        {avg.toFixed(1)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Reviews section */}
          <ProgramClientSection
            schoolId={school.id}
            sportId={sport.id}
            schoolName={school.name}
            sportName={sport.name}
            initialReviews={typedReviews}
            user={user}
          />
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-6">
          {/* Coaches */}
          <div
            className="rounded-xl border overflow-hidden"
            style={{ borderColor: "var(--border-color)" }}
          >
            <div
              className="px-4 py-3 border-b"
              style={{
                borderColor: "var(--border-color)",
                background: "var(--bg-card)",
              }}
            >
              <h2 className="font-bold text-sm" style={{ color: "var(--foreground)" }}>
                Coaching Staff
              </h2>
            </div>
            <div style={{ background: "var(--bg-card)" }}>
              {coaches && coaches.length > 0 ? (
                coaches.map((coach: { id: string; name: string; title: string }) => (
                  <div
                    key={coach.id}
                    className="px-4 py-3 border-b last:border-0 flex flex-col gap-0.5"
                    style={{ borderColor: "var(--border-color)" }}
                  >
                    <span className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                      {coach.name}
                    </span>
                    <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                      {coach.title}
                    </span>
                  </div>
                ))
              ) : (
                <div className="px-4 py-5 text-center">
                  <p className="text-xs" style={{ color: "var(--text-dim)" }}>
                    No coaching staff data yet
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* School info */}
          <div
            className="rounded-xl border overflow-hidden"
            style={{ borderColor: "var(--border-color)" }}
          >
            <div
              className="h-2"
              style={{ background: school.primaryColor }}
            />
            <div
              className="p-4 flex flex-col gap-3"
              style={{ background: "var(--bg-card)" }}
            >
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 shrink-0">
                  <Image
                    src={logoUrl}
                    alt={school.name}
                    fill
                    className="object-contain"
                    unoptimized
                  />
                </div>
                <div>
                  <p className="font-bold text-sm" style={{ color: "var(--foreground)" }}>
                    {school.name}
                  </p>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                    {school.mascot} · {school.city}, {school.state}
                  </p>
                </div>
              </div>
              <Link
                href={`/school/${school.slug}`}
                className="text-xs font-semibold text-center py-2 rounded-lg border transition-colors hover:bg-[#4ECBA5]/10"
                style={{
                  borderColor: "var(--border-color)",
                  color: "var(--text-muted)",
                }}
              >
                View all {school.name} programs
              </Link>
            </div>
          </div>

          {/* Compare CTA */}
          <Link
            href={`/compare?school1=${school.id}&sport=${sport.id}`}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border text-sm font-semibold transition-colors hover:bg-[#4ECBA5]/10"
            style={{
              borderColor: "var(--border-color)",
              color: "#4ECBA5",
            }}
          >
            Compare this program
          </Link>
        </div>
      </div>
    </div>
  );
}
