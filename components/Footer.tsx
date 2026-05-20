import Link from "next/link";

export function Footer() {
  return (
    <footer
      className="border-t mt-auto"
      style={{ borderColor: "var(--border-color)", background: "var(--bg-nav)" }}
    >
      <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-col items-center sm:items-start gap-1">
          <span className="font-black text-lg" style={{ color: "#4ECBA5" }}>
            AthLead
          </span>
          <span className="text-xs" style={{ color: "var(--text-dim)" }}>
            Giving athletes the leads they need to find their next home.
          </span>
        </div>

        <nav className="flex items-center gap-5 text-sm" style={{ color: "var(--text-muted)" }}>
          <Link href="/browse" className="hover:text-[#4ECBA5] transition-colors">
            Browse
          </Link>
          <Link href="/feed" className="hover:text-[#4ECBA5] transition-colors">
            Feed
          </Link>
          <Link href="/compare" className="hover:text-[#4ECBA5] transition-colors">
            Compare
          </Link>
          <Link href="/signup" className="hover:text-[#4ECBA5] transition-colors">
            Sign up
          </Link>
        </nav>

        <div className="text-xs text-center" style={{ color: "var(--text-dim)" }}>
          <p>Designed by Jackson Johannes &amp; Austin Rowswell</p>
          <p className="mt-0.5">© {new Date().getFullYear()} AthLead. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
