"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { StarInput } from "./StarRating";
import { createClient } from "@/lib/supabase/client";
import { RATING_DIMENSIONS } from "@/constants/data";

interface AddReviewModalProps {
  schoolId: string;
  sportId: string;
  schoolName: string;
  sportName: string;
  onClose: () => void;
  onSuccess: () => void;
}

const defaultRatings = {
  rating_coaching: 0,
  rating_culture: 0,
  rating_facilities: 0,
  rating_development: 0,
  rating_nil: 0,
  rating_overall: 0,
};

export function AddReviewModal({
  schoolId,
  sportId,
  schoolName,
  sportName,
  onClose,
  onSuccess,
}: AddReviewModalProps) {
  const [ratings, setRatings] = useState(defaultRatings);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function setRating(key: keyof typeof defaultRatings, val: number) {
    setRatings((prev) => ({ ...prev, [key]: val }));
  }

  async function submit() {
    const missing = RATING_DIMENSIONS.find((d) => ratings[d.key] === 0);
    if (missing) {
      setError(`Please rate ${missing.label}`);
      return;
    }
    if (!text.trim()) {
      setError("Please write a review");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError("You must be signed in to leave a review");
        setLoading(false);
        return;
      }
      const { error: dbError } = await supabase.from("reviews").insert({
        school_id: schoolId,
        sport_id: sportId,
        author_id: user.id,
        author_name: user.user_metadata?.full_name ?? user.email?.split("@")[0] ?? "Athlete",
        review_text: text.trim(),
        is_verified: false,
        ...ratings,
      });
      if (dbError) throw dbError;
      onSuccess();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="relative z-10 w-full max-w-lg rounded-2xl border shadow-2xl overflow-hidden"
        style={{ background: "var(--bg-card)", borderColor: "var(--border-color)" }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4 border-b"
          style={{ borderColor: "var(--border-color)" }}
        >
          <div>
            <h2 className="font-bold text-lg" style={{ color: "var(--foreground)" }}>
              Write a Review
            </h2>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              {schoolName} — {sportName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-[#4ECBA5]/10 transition-colors"
            style={{ color: "var(--text-muted)" }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-4 flex flex-col gap-5 max-h-[70vh] overflow-y-auto">
          {/* Ratings grid */}
          <div className="grid grid-cols-2 gap-4">
            {RATING_DIMENSIONS.map((dim) => (
              <StarInput
                key={dim.key}
                label={`${dim.icon} ${dim.label}`}
                value={ratings[dim.key]}
                onChange={(v) => setRating(dim.key, v)}
              />
            ))}
          </div>

          {/* Text review */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs" style={{ color: "var(--text-muted)" }}>
              Your review
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Share your honest experience with this program…"
              rows={4}
              className="w-full px-3 py-2.5 text-sm rounded-lg border resize-none outline-none focus:ring-2 focus:ring-[#4ECBA5]/40"
              style={{
                background: "var(--bg-card-hover)",
                borderColor: "var(--border-color)",
                color: "var(--foreground)",
              }}
            />
          </div>

          {error && (
            <p className="text-sm font-medium" style={{ color: "#ef4444" }}>
              {error}
            </p>
          )}
        </div>

        {/* Footer */}
        <div
          className="px-5 py-4 border-t flex items-center justify-between gap-3"
          style={{ borderColor: "var(--border-color)" }}
        >
          <button
            onClick={onClose}
            className="text-sm px-4 py-2 rounded-lg border font-medium transition-colors hover:bg-[#4ECBA5]/10"
            style={{ borderColor: "var(--border-color)", color: "var(--text-muted)" }}
          >
            Cancel
          </button>
          <button
            onClick={submit}
            disabled={loading}
            className="text-sm px-5 py-2 rounded-lg font-bold transition-opacity disabled:opacity-50"
            style={{ background: "#4ECBA5", color: "#000" }}
          >
            {loading ? "Submitting…" : "Submit Review"}
          </button>
        </div>
      </div>
    </div>
  );
}
