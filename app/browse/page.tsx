"use client";

import { useState, useMemo } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { BIG_TEN_SCHOOLS, SPORTS } from "@/constants/data";
import { SchoolCard } from "@/components/SchoolCard";

type Filter = "all" | "Men" | "Women" | "Mixed";

export default function BrowsePage() {
  const [query, setQuery] = useState("");
  const [genderFilter, setGenderFilter] = useState<Filter>("all");
  const [selectedSport, setSelectedSport] = useState<string | null>(null);

  const filteredSchools = useMemo(() => {
    const q = query.toLowerCase();
    return BIG_TEN_SCHOOLS.filter(
      (s) =>
        !q ||
        s.name.toLowerCase().includes(q) ||
        s.mascot.toLowerCase().includes(q) ||
        s.city.toLowerCase().includes(q) ||
        s.state.toLowerCase().includes(q)
    );
  }, [query]);

  const filteredSports = useMemo(() => {
    if (genderFilter === "all") return SPORTS;
    return SPORTS.filter((s) => s.gender === genderFilter);
  }, [genderFilter]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-3xl font-black mb-1" style={{ color: "var(--foreground)" }}>
          Browse Programs
        </h1>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          Explore all 18 Big Ten schools and their athletic programs
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-6 max-w-sm">
        <Search
          size={15}
          className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
          style={{ color: "var(--text-muted)" }}
        />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search schools…"
          className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border outline-none focus:ring-2 focus:ring-[#4ECBA5]/40"
          style={{
            background: "var(--bg-card)",
            borderColor: "var(--border-color)",
            color: "var(--foreground)",
          }}
        />
      </div>

      {/* Schools grid */}
      <section className="mb-16">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-lg" style={{ color: "var(--foreground)" }}>
            Schools
            <span className="ml-2 text-sm font-normal" style={{ color: "var(--text-muted)" }}>
              ({filteredSchools.length})
            </span>
          </h2>
        </div>

        {filteredSchools.length === 0 ? (
          <div
            className="rounded-xl p-12 text-center border"
            style={{ borderColor: "var(--border-color)" }}
          >
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              No schools match "{query}"
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredSchools.map((school) => (
              <SchoolCard key={school.id} school={school} />
            ))}
          </div>
        )}
      </section>

      {/* Sports section */}
      <section>
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <div className="flex items-center gap-1">
            <SlidersHorizontal size={15} style={{ color: "var(--text-muted)" }} />
            <span className="font-bold text-lg" style={{ color: "var(--foreground)" }}>
              Sports
            </span>
          </div>

          {/* Gender filter */}
          <div className="flex gap-1 ml-auto">
            {(["all", "Men", "Women", "Mixed"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setGenderFilter(f)}
                className="px-3 py-1 text-xs rounded-full font-semibold border transition-colors"
                style={{
                  background:
                    genderFilter === f ? "#4ECBA5" : "var(--bg-card)",
                  borderColor:
                    genderFilter === f ? "#4ECBA5" : "var(--border-color)",
                  color: genderFilter === f ? "#000" : "var(--text-muted)",
                }}
              >
                {f === "all" ? "All" : f}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {filteredSports.map((sport) => (
            <button
              key={sport.id}
              onClick={() =>
                setSelectedSport(
                  selectedSport === sport.id ? null : sport.id
                )
              }
              className="flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all hover:border-[#4ECBA5]/50 hover:bg-[#4ECBA5]/05"
              style={{
                background:
                  selectedSport === sport.id
                    ? "rgba(78,203,165,0.10)"
                    : "var(--bg-card)",
                borderColor:
                  selectedSport === sport.id
                    ? "#4ECBA5"
                    : "var(--border-color)",
              }}
            >
              <span className="text-xl leading-none">{sport.icon}</span>
              <div className="min-w-0">
                <p
                  className="text-sm font-semibold truncate"
                  style={{
                    color:
                      selectedSport === sport.id
                        ? "#4ECBA5"
                        : "var(--foreground)",
                  }}
                >
                  {sport.name}
                </p>
                <p className="text-xs" style={{ color: "var(--text-dim)" }}>
                  {sport.gender}
                </p>
              </div>
            </button>
          ))}
        </div>

        {/* If sport selected, show all schools for that sport */}
        {selectedSport && (
          <div className="mt-8">
            <h3 className="font-bold mb-4" style={{ color: "var(--foreground)" }}>
              {SPORTS.find((s) => s.id === selectedSport)?.name} — All Schools
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {BIG_TEN_SCHOOLS.map((school) => (
                <a
                  key={school.id}
                  href={`/school/${school.slug}/${selectedSport}`}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl border transition-all hover:scale-[1.02] hover:shadow-md"
                  style={{
                    background: "var(--bg-card)",
                    borderColor: "var(--border-color)",
                  }}
                >
                  <div
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ background: school.primaryColor }}
                  />
                  <span className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                    {school.name}
                  </span>
                </a>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
