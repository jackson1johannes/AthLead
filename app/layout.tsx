import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "AthLead — College Athlete Program Reviews",
  description:
    "Giving athletes the leads they need to find their next home. Read and write honest reviews of Big Ten athletic programs.",
  openGraph: {
    title: "AthLead",
    description: "College athlete program reviews — Big Ten",
    type: "website",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <html lang="en" className="dark h-full">
      <body className="flex flex-col min-h-screen">
        <ThemeProvider>
          <Navbar user={user} />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
