"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Review } from "@/types";
import { ReviewCard } from "@/components/ReviewCard";
import { AddReviewModal } from "@/components/AddReviewModal";

interface Props {
  schoolId: string;
  sportId: string;
  schoolName: string;
  sportName: string;
  initialReviews: Review[];
  user: { email?: string } | null;
}

export default function ProgramClientSection({
  schoolId,
  sportId,
  schoolName,
  sportName,
  initialReviews,
  user,
}: Props) {
  const [reviews, setReviews] = useState(initialReviews);
  const [showModal, setShowModal] = useState(false);

  async function refreshReviews() {
    const { createClient } = await import("@/lib/supabase/client");
    const supabase = createClient();
    const { data } = await supabase
      .from("reviews")
      .select("*")
      .eq("school_id", schoolId)
      .eq("sport_id", sportId)
      .order("created_at", { ascending: false });
    if (data) setReviews(data as Review[]);
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Reviews header */}
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-base" style={{ color: "var(--foreground)" }}>
          Reviews
          {reviews.length > 0 && (
            <span className="ml-2 text-sm font-normal" style={{ color: "var(--text-muted)" }}>
              ({reviews.length})
            </span>
          )}
        </h2>
        {user ? (
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-lg transition-opacity hover:opacity-90"
            style={{ background: "#4ECBA5", color: "#000" }}
          >
            <Plus size={13} />
            Write Review
          </button>
        ) : (
          <a
            href="/login"
            className="flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-lg border transition-colors hover:bg-[#4ECBA5]/10"
            style={{ borderColor: "var(--border-color)", color: "#4ECBA5" }}
          >
            Sign in to review
          </a>
        )}
      </div>

      {/* Review list */}
      {reviews.length === 0 ? (
        <div
          className="rounded-xl p-10 text-center border"
          style={{ borderColor: "var(--border-color)", background: "var(--bg-card)" }}
        >
          <p className="text-2xl mb-2">📝</p>
          <p className="font-semibold text-sm mb-1" style={{ color: "var(--foreground)" }}>
            No reviews yet
          </p>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            Be the first to review this program
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      )}

      {/* Add review modal */}
      {showModal && (
        <AddReviewModal
          schoolId={schoolId}
          sportId={sportId}
          schoolName={schoolName}
          sportName={sportName}
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false);
            refreshReviews();
          }}
        />
      )}
    </div>
  );
}
