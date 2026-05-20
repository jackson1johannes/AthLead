import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { MapPin, ExternalLink } from "lucide-react";
import {
  getSchoolById,
  getEspnLogoUrl,
  SPORTS,
  getContrastColor,
} from "@/constants/data";

interface Props {
  params: Promise<{ schoolId: string }>;
}

export async function generateStaticParams() {
  const { BIG_TEN_SCHOOLS } = await import("@/constants/data");
  return BIG_TEN_SCHOOLS.map((s) => ({ schoolId: s.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { schoolId } = await params;
  const school = getSchoolById(schoolId);
  if (!school) return {};
  return {
    title: `${school.name} ${school.mascot} — AthLead`,
    description: `Browse athletic programs and reviews for ${school.name}.`,
  };
}

export default async function SchoolPage({ params }: Props) {
  const { schoolId } = await params;
  const school = getSchoolById(schoolId);
  if (!school) notFound();

  const logoUrl = getEspnLogoUrl(school.espnId);
  const textOnPrimary = getContrastColor(school.primaryColor);

  return (
    <div>
      {/* School header */}
      <div
        className="relative overflow-hidden"
        style={{ background: school.primaryColor }}
      >
        {/* Pattern overlay */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px)",
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 py-10 sm:py-14">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6">
            {/* Logo */}
            <div
              className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-2xl flex items-center justify-center shadow-xl shrink-0"
              style={{ background: "rgba(255,255,255,0.15)" }}
            >
              <Image
                src={logoUrl}
                alt={`${school.name} logo`}
                fill
                className="object-contain p-2"
                unoptimized
                priority
              />
            </div>

            {/* Info */}
            <div className="flex-1 text-center sm:text-left">
              <p
                className="text-xs font-semibold uppercase tracking-widest mb-1 opacity-70"
                style={{ color: textOnPrimary }}
              >
                Big Ten Conference
              </p>
              <h1
                className="text-3xl sm:text-4xl font-black"
                style={{ color: textOnPrimary }}
              >
                {school.name}
              </h1>
              <p
                className="text-lg font-medium opacity-80"
                style={{ color: textOnPrimary }}
              >
                {school.mascot}
              </p>
              <div
                className="flex items-center justify-center sm:justify-start gap-1 mt-2 opacity-70 text-sm"
                style={{ color: textOnPrimary }}
              >
                <MapPin size={13} />
                <span>
                  {school.city}, {school.state}
                </span>
              </div>
            </div>

            {/* Secondary color pill */}
            <div className="flex items-center gap-2 shrink-0">
              <div
                className="w-4 h-4 rounded-full border-2 border-white/30"
                style={{ background: school.secondaryColor }}
              />
              <div
                className="w-4 h-4 rounded-full border-2 border-white/30"
                style={{ background: school.primaryColor }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Sports grid */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        <h2
          className="text-xl font-black mb-6"
          style={{ color: "var(--foreground)" }}
        >
          Athletic Programs
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SPORTS.map((sport) => (
            <Link
              key={sport.id}
              href={`/school/${school.slug}/${sport.slug}`}
              className="group flex items-center gap-4 p-4 rounded-xl border transition-all hover:scale-[1.02] hover:shadow-md"
              style={{
                background: "var(--bg-card)",
                borderColor: "var(--border-color)",
              }}
            >
              {/* Icon */}
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0 transition-colors group-hover:scale-110"
                style={{ background: `${school.primaryColor}18` }}
              >
                {sport.icon}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p
                  className="font-semibold text-sm truncate"
                  style={{ color: "var(--foreground)" }}
                >
                  {sport.name}
                </p>
                <p className="text-xs" style={{ color: "var(--text-dim)" }}>
                  {sport.gender}
                </p>
              </div>

              <ExternalLink
                size={14}
                className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                style={{ color: school.primaryColor }}
              />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
