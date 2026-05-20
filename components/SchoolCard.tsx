"use client";

import Link from "next/link";
import Image from "next/image";
import { School } from "@/types";
import { getEspnLogoUrl, getContrastColor } from "@/constants/data";

interface SchoolCardProps {
  school: School;
}

export function SchoolCard({ school }: SchoolCardProps) {
  const logoUrl = getEspnLogoUrl(school.espnId);
  const textColor = getContrastColor(school.primaryColor);

  return (
    <Link href={`/school/${school.slug}`}>
      <div
        className="relative group rounded-xl overflow-hidden border transition-all duration-200 hover:scale-[1.02] hover:shadow-xl cursor-pointer"
        style={{
          borderColor: "var(--border-color)",
          background: "var(--bg-card)",
        }}
      >
        {/* Color bar */}
        <div
          className="h-1.5 w-full"
          style={{ background: school.primaryColor }}
        />

        {/* Card body */}
        <div className="p-4 flex items-center gap-4">
          {/* Logo */}
          <div className="relative w-14 h-14 shrink-0">
            <Image
              src={logoUrl}
              alt={`${school.name} logo`}
              fill
              className="object-contain"
              unoptimized
            />
          </div>

          {/* Info */}
          <div className="min-w-0">
            <h3
              className="font-bold text-base leading-tight truncate"
              style={{ color: "var(--foreground)" }}
            >
              {school.name}
            </h3>
            <p className="text-sm truncate" style={{ color: "var(--text-muted)" }}>
              {school.mascot}
            </p>
            <p className="text-xs mt-0.5" style={{ color: "var(--text-dim)" }}>
              {school.city}, {school.state}
            </p>
          </div>
        </div>

        {/* Hover overlay showing school colors */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-[0.06] transition-opacity pointer-events-none"
          style={{ background: school.primaryColor }}
        />
      </div>
    </Link>
  );
}

interface SchoolBadgeProps {
  school: School;
  size?: "sm" | "md" | "lg";
}

export function SchoolBadge({ school, size = "md" }: SchoolBadgeProps) {
  const logoUrl = getEspnLogoUrl(school.espnId);
  const dim = size === "sm" ? 24 : size === "lg" ? 56 : 36;

  return (
    <div className="relative shrink-0" style={{ width: dim, height: dim }}>
      <Image
        src={logoUrl}
        alt={school.name}
        fill
        className="object-contain"
        unoptimized
      />
    </div>
  );
}
