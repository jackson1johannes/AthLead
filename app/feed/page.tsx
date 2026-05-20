import { createClient } from "@/lib/supabase/server";
import { Review } from "@/types";
import { ReviewCard } from "@/components/ReviewCard";
import { getSchoolById, getSportById } from "@/constants/data";

export const revalidate = 60;

export default async function FeedPage() {
  const supabase = await createClient();

  const { data: reviews } = await supabase
    .from("reviews")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);

  const typedReviews = (reviews ?? []) as Review[];

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-black mb-1" style={{ color: "var(--foreground)" }}>
          Latest Reviews
        </h1>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          Real reviews from verified Big Ten athletes
        </p>
      </div>

      {typedReviews.length === 0 ? (
        <div
          className="rounded-xl p-16 text-center border"
          style={{ borderColor: "var(--border-color)", background: "var(--bg-card)" }}
        >
          <p className="text-3xl mb-3">📋</p>
          <p className="font-bold mb-1" style={{ color: "var(--foreground)" }}>
            No reviews yet
          </p>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Be the first athlete to leave a review!
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          {typedReviews.map((review) => {
            const school = getSchoolById(review.school_id);
            const sport = getSportById(review.sport_id);
            const programName = school && sport
              ? `${school.name} ${sport.name}`
              : undefined;

            return (
              <div key={review.id} className="flex flex-col gap-2">
                {programName && (
                  <a
                    href={`/school/${review.school_id}/${review.sport_id}`}
                    className="text-xs font-semibold hover:underline"
                    style={{ color: "#4ECBA5" }}
                  >
                    {programName}
                  </a>
                )}
                <ReviewCard
                  review={review}
                  showProgram={false}
                  programName={programName}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
