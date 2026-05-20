"use client";

import { Review } from "@/types";
import { StarRating } from "./StarRating";
import { formatDate } from "@/lib/utils";
import { RATING_DIMENSIONS } from "@/constants/data";
import { ShieldCheck } from "lucide-react";

interface ReviewCardProps {
  review: Review;
  showProgram?: boolean;
  programName?: string;
}

export function ReviewCard({ review, showProgram, programName }: ReviewCardProps) {
  const dimensions = RATING_DIMENSIONS.filter(
    (d) => d.key !== "rating_overall"
  );

  return (
    <div
      className="rounded-xl p-5 border flex flex-col gap-4 transition-colors"
      style={{
        background: "var(--bg-card)",
        borderColor: "var(--border-color)",
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm" style={{ color: "var(--foreground)" }}>
              {review.author_name ?? "Anonymous Athlete"}
            </span>
            {review.is_verified && (
              <span
                className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full"
                style={{ background: "rgba(78,203,165,0.12)", color: "#4ECBA5" }}
              >
                <ShieldCheck size={11} />
                Verified
              </span>
            )}
          </div>
          {showProgram && programName && (
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>
              {programName}
            </span>
          )}
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          <div className="flex items-center gap-1.5">
            <StarRating value={review.rating_overall} size="sm" />
            <span className="text-sm font-bold" style={{ color: "#4ECBA5" }}>
              {review.rating_overall.toFixed(1)}
            </span>
          </div>
          <span className="text-xs" style={{ color: "var(--text-dim)" }}>
            {formatDate(review.created_at)}
          </span>
        </div>
      </div>

      {/* Review text */}
      {review.review_text && (
        <p className="text-sm leading-relaxed" style={{ color: "var(--foreground)" }}>
          {review.review_text}
        </p>
      )}

      {/* Dimension ratings */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {dimensions.map((dim) => {
          const val = review[dim.key] as number;
          return (
            <div
              key={dim.key}
              className="flex flex-col gap-0.5 rounded-lg p-2"
              style={{ background: "rgba(255,255,255,0.04)" }}
            >
              <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                {dim.icon} {dim.label}
              </span>
              <div className="flex items-center gap-1.5">
                <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: "var(--border-color)" }}>
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${(val / 5) * 100}%`, background: "#4ECBA5" }}
                  />
                </div>
                <span className="text-xs font-semibold tabular-nums" style={{ color: "var(--foreground)" }}>
                  {val.toFixed(1)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
