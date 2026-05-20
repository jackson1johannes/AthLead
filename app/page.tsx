import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Star, Shield, BarChart2 } from "lucide-react";
import { BIG_TEN_SCHOOLS, getEspnLogoUrl } from "@/constants/data";

export default function LandingPage() {
  const featured = BIG_TEN_SCHOOLS.slice(0, 8);

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden px-4 pt-20 pb-24 sm:pt-28 sm:pb-32">
        <div
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 0%, #4ECBA5, transparent)",
          }}
        />
        <div className="relative max-w-4xl mx-auto text-center flex flex-col items-center gap-6">
          <span
            className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full border"
            style={{
              borderColor: "rgba(78,203,165,0.3)",
              color: "#4ECBA5",
              background: "rgba(78,203,165,0.08)",
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#4ECBA5] animate-pulse inline-block" />
            Big Ten Conference — 18 Schools
          </span>

          <h1
            className="text-4xl sm:text-6xl font-black tracking-tight leading-[1.08]"
            style={{ color: "var(--foreground)" }}
          >
            Giving athletes the leads
            <br />
            <span style={{ color: "#4ECBA5" }}>they need to thrive.</span>
          </h1>

          <p
            className="text-lg sm:text-xl max-w-xl leading-relaxed"
            style={{ color: "var(--text-muted)" }}
          >
            Honest reviews of college athletic programs — from athletes who have
            lived it. Find your perfect program or leave a review for the next
            recruit.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/browse"
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-opacity hover:opacity-90"
              style={{ background: "#4ECBA5", color: "#000" }}
            >
              Browse Programs
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/feed"
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm border transition-colors hover:bg-[#4ECBA5]/10"
              style={{
                borderColor: "var(--border-color)",
                color: "var(--foreground)",
              }}
            >
              View Latest Reviews
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-8 mt-2">
            {[
              { label: "Schools", value: "18" },
              { label: "Sports", value: "27+" },
              { label: "Conference", value: "Big Ten" },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col items-center gap-0.5">
                <span className="text-2xl font-black" style={{ color: "#4ECBA5" }}>
                  {stat.value}
                </span>
                <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* School logos */}
      <section
        className="border-y py-6"
        style={{ borderColor: "var(--border-color)" }}
      >
        <div className="flex items-center gap-10 px-4 flex-wrap justify-center">
          {BIG_TEN_SCHOOLS.map((school) => (
            <Link
              key={school.id}
              href={`/school/${school.slug}`}
              className="relative w-10 h-10 opacity-50 hover:opacity-100 transition-opacity shrink-0"
              title={school.name}
            >
              <Image
                src={getEspnLogoUrl(school.espnId)}
                alt={school.name}
                fill
                className="object-contain"
                unoptimized
              />
            </Link>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-5xl mx-auto px-4 py-20">
        <h2
          className="text-2xl sm:text-3xl font-black text-center mb-3"
          style={{ color: "var(--foreground)" }}
        >
          Built for athletes, by athletes
        </h2>
        <p
          className="text-center text-sm mb-12 max-w-md mx-auto"
          style={{ color: "var(--text-muted)" }}
        >
          The transfer portal is chaotic. AthLead gives you the real picture
          before you commit.
        </p>

        <div className="grid sm:grid-cols-3 gap-6">
          {[
            {
              Icon: Star,
              title: "Rate your program",
              description:
                "Leave detailed ratings on coaching, culture, facilities, development, and NIL opportunities.",
            },
            {
              Icon: Shield,
              title: "Verified athletes only",
              description:
                "Reviews come from verified roster athletes. Real experiences from people who've been there.",
            },
            {
              Icon: BarChart2,
              title: "Compare programs",
              description:
                "Side-by-side comparison of any two programs across every dimension that matters.",
            },
          ].map(({ Icon, title, description }) => (
            <div
              key={title}
              className="flex flex-col gap-3 p-6 rounded-xl border"
              style={{
                background: "var(--bg-card)",
                borderColor: "var(--border-color)",
              }}
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ background: "rgba(78,203,165,0.12)" }}
              >
                <Icon size={20} color="#4ECBA5" />
              </div>
              <h3 className="font-bold text-base" style={{ color: "var(--foreground)" }}>
                {title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
                {description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured schools */}
      <section className="border-t" style={{ borderColor: "var(--border-color)" }}>
        <div className="max-w-5xl mx-auto px-4 py-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-black" style={{ color: "var(--foreground)" }}>
              Browse Big Ten Schools
            </h2>
            <Link
              href="/browse"
              className="text-sm font-semibold flex items-center gap-1 hover:underline"
              style={{ color: "#4ECBA5" }}
            >
              All schools <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {featured.map((school) => (
              <Link
                key={school.id}
                href={`/school/${school.slug}`}
                className="group flex flex-col items-center gap-3 p-5 rounded-xl border transition-all hover:scale-[1.03] hover:shadow-lg"
                style={{
                  background: "var(--bg-card)",
                  borderColor: "var(--border-color)",
                }}
              >
                <div
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: school.primaryColor }}
                />
                <div className="relative w-14 h-14">
                  <Image
                    src={getEspnLogoUrl(school.espnId)}
                    alt={school.name}
                    fill
                    className="object-contain"
                    unoptimized
                  />
                </div>
                <div className="text-center">
                  <p className="font-bold text-sm" style={{ color: "var(--foreground)" }}>
                    {school.name}
                  </p>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                    {school.mascot}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t px-4 py-20 text-center" style={{ borderColor: "var(--border-color)" }}>
        <div className="max-w-lg mx-auto flex flex-col items-center gap-5">
          <h2 className="text-2xl sm:text-3xl font-black" style={{ color: "var(--foreground)" }}>
            Ready to find your next home?
          </h2>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Join AthLead and access honest reviews from athletes across the Big Ten.
          </p>
          <Link
            href="/signup"
            className="px-8 py-3 rounded-xl font-bold text-sm transition-opacity hover:opacity-90"
            style={{ background: "#4ECBA5", color: "#000" }}
          >
            Create a free account
          </Link>
        </div>
      </section>
    </div>
  );
}
