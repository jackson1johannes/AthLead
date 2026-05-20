"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Search, Sun, Moon, Menu, X, LogOut } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { BIG_TEN_SCHOOLS, SPORTS } from "@/constants/data";
import { createClient } from "@/lib/supabase/client";

interface NavbarProps {
  user?: { email?: string } | null;
}

export function Navbar({ user }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, toggle } = useTheme();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<
    Array<{ label: string; href: string; type: string }>
  >([]);
  const [mobileOpen, setMobileOpen] = useState(false);

  function handleSearch(q: string) {
    setQuery(q);
    if (!q.trim()) {
      setResults([]);
      return;
    }
    const lower = q.toLowerCase();
    const schoolHits = BIG_TEN_SCHOOLS.filter(
      (s) =>
        s.name.toLowerCase().includes(lower) ||
        s.mascot.toLowerCase().includes(lower) ||
        s.abbr.toLowerCase().includes(lower)
    )
      .slice(0, 4)
      .map((s) => ({
        label: s.name,
        href: `/school/${s.slug}`,
        type: "School",
      }));

    const sportHits = SPORTS.filter((s) =>
      s.name.toLowerCase().includes(lower)
    )
      .slice(0, 3)
      .map((s) => ({
        label: s.name,
        href: `/browse?sport=${s.slug}`,
        type: "Sport",
      }));

    setResults([...schoolHits, ...sportHits].slice(0, 6));
  }

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  const navLinks = [
    { href: "/feed", label: "Feed" },
    { href: "/browse", label: "Browse" },
    { href: "/compare", label: "Compare" },
  ];

  return (
    <nav
      className="sticky top-0 z-50 border-b"
      style={{ background: "var(--bg-nav)", borderColor: "var(--border-color)" }}
    >
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center gap-4">
        {/* Logo */}
        <Link
          href="/"
          className="font-black text-xl tracking-tight shrink-0 hover:opacity-80 transition-opacity"
          style={{ color: "#4ECBA5" }}
        >
          AthLead
        </Link>

        {/* Search */}
        <div className="relative flex-1 max-w-sm hidden sm:block">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: "var(--text-muted)" }}
          />
          <input
            type="text"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            onBlur={() => setTimeout(() => setResults([]), 200)}
            placeholder="Search schools or sports…"
            className="w-full pl-9 pr-3 py-1.5 text-sm rounded-lg border outline-none focus:ring-2 focus:ring-[#4ECBA5]/40 transition-all"
            style={{
              background: "var(--bg-card)",
              borderColor: "var(--border-color)",
              color: "var(--foreground)",
            }}
          />
          {results.length > 0 && (
            <div
              className="absolute top-full left-0 right-0 mt-1 rounded-lg border shadow-xl overflow-hidden z-50"
              style={{
                background: "var(--bg-card)",
                borderColor: "var(--border-color)",
              }}
            >
              {results.map((r) => (
                <Link
                  key={r.href}
                  href={r.href}
                  className="flex items-center justify-between px-3 py-2 text-sm hover:bg-[#4ECBA5]/10 transition-colors"
                  style={{ color: "var(--foreground)" }}
                  onClick={() => { setQuery(""); setResults([]); }}
                >
                  <span>{r.label}</span>
                  <span
                    className="text-xs px-1.5 py-0.5 rounded"
                    style={{ background: "var(--border-color)", color: "var(--text-muted)" }}
                  >
                    {r.type}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Nav links */}
        <div className="hidden sm:flex items-center gap-1 ml-auto">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-3 py-1.5 text-sm rounded-lg font-medium transition-colors hover:bg-[#4ECBA5]/10"
              style={{
                color: pathname.startsWith(link.href) ? "#4ECBA5" : "var(--text-muted)",
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2 ml-2 sm:ml-0">
          {/* Theme toggle */}
          <button
            onClick={toggle}
            className="p-1.5 rounded-lg transition-colors hover:bg-[#4ECBA5]/10"
            style={{ color: "var(--text-muted)" }}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
          </button>

          {user ? (
            <button
              onClick={signOut}
              className="hidden sm:flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg font-medium border transition-colors hover:bg-[#4ECBA5]/10"
              style={{
                borderColor: "var(--border-color)",
                color: "var(--text-muted)",
              }}
            >
              <LogOut size={14} />
              Sign out
            </button>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Link
                href="/login"
                className="text-sm px-3 py-1.5 rounded-lg font-medium transition-colors hover:bg-[#4ECBA5]/10"
                style={{ color: "var(--text-muted)" }}
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="text-sm px-3 py-1.5 rounded-lg font-bold transition-colors"
                style={{ background: "#4ECBA5", color: "#000" }}
              >
                Sign up
              </Link>
            </div>
          )}

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileOpen((o) => !o)}
            className="sm:hidden p-1.5 rounded-lg transition-colors hover:bg-[#4ECBA5]/10"
            style={{ color: "var(--text-muted)" }}
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          className="sm:hidden border-t px-4 py-3 flex flex-col gap-2"
          style={{ borderColor: "var(--border-color)", background: "var(--bg-nav)" }}
        >
          {/* Mobile search */}
          <div className="relative">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: "var(--text-muted)" }}
            />
            <input
              type="text"
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search…"
              className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border outline-none"
              style={{
                background: "var(--bg-card)",
                borderColor: "var(--border-color)",
                color: "var(--foreground)",
              }}
            />
          </div>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="py-2 text-sm font-medium"
              style={{ color: pathname.startsWith(link.href) ? "#4ECBA5" : "var(--foreground)" }}
            >
              {link.label}
            </Link>
          ))}
          {user ? (
            <button onClick={signOut} className="text-sm text-left py-2" style={{ color: "var(--text-muted)" }}>
              Sign out
            </button>
          ) : (
            <div className="flex gap-3 pt-1">
              <Link href="/login" className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>
                Log in
              </Link>
              <Link
                href="/signup"
                className="text-sm font-bold px-3 py-1 rounded-lg"
                style={{ background: "#4ECBA5", color: "#000" }}
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
