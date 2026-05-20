export interface School {
  id: string;
  name: string;
  abbr: string;
  slug: string;
  city: string;
  state: string;
  primaryColor: string;
  secondaryColor: string;
  espnId: number;
  mascot: string;
  domain: string;
}

export interface Sport {
  id: string;
  name: string;
  slug: string;
  icon: string;
  gender: "Men" | "Women" | "Mixed";
  positions: string[];
}

export interface Coach {
  id: string;
  school_id: string;
  sport_id: string;
  name: string;
  title: string;
  bio?: string;
  photo_url?: string;
  years_at_school?: number;
}

export interface Review {
  id: string;
  school_id: string;
  sport_id: string;
  author_id: string;
  author_name?: string;
  rating_coaching: number;
  rating_culture: number;
  rating_facilities: number;
  rating_development: number;
  rating_nil: number;
  rating_overall: number;
  review_text: string;
  is_verified: boolean;
  created_at: string;
}

export interface RatingDimension {
  key: keyof Pick<Review, "rating_coaching" | "rating_culture" | "rating_facilities" | "rating_development" | "rating_nil" | "rating_overall">;
  label: string;
  icon: string;
}

export interface ProgramStats {
  school_id: string;
  sport_id: string;
  avg_coaching: number;
  avg_culture: number;
  avg_facilities: number;
  avg_development: number;
  avg_nil: number;
  avg_overall: number;
  review_count: number;
}

export type Theme = "dark" | "light";
