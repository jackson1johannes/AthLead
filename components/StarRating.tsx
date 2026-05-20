"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  value: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
  className?: string;
}

export function StarRating({
  value,
  max = 5,
  size = "md",
  showValue = false,
  className,
}: StarRatingProps) {
  const filled = Math.round(value);
  const sizeClass = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  }[size];

  return (
    <span className={cn("inline-flex items-center gap-1", className)}>
      <span className={cn("flex", sizeClass)}>
        {Array.from({ length: max }).map((_, i) => (
          <span key={i} className={i < filled ? "star-filled" : "star-empty"}>
            ★
          </span>
        ))}
      </span>
      {showValue && (
        <span className={cn("font-semibold tabular-nums", sizeClass)}>
          {value.toFixed(1)}
        </span>
      )}
    </span>
  );
}

interface StarInputProps {
  value: number;
  onChange: (v: number) => void;
  label?: string;
}

export function StarInput({ value, onChange, label }: StarInputProps) {
  const [hover, setHover] = useState<number | null>(null);

  const display = hover ?? value;

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <span className="text-xs" style={{ color: "var(--text-muted)" }}>
          {label}
        </span>
      )}
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(null)}
            onClick={() => onChange(star)}
            className="text-xl transition-transform hover:scale-110 focus:outline-none"
            style={{ color: star <= display ? "#4ECBA5" : "#333" }}
            aria-label={`${star} star${star !== 1 ? "s" : ""}`}
          >
            ★
          </button>
        ))}
      </div>
    </div>
  );
}

