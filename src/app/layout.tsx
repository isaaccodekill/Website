import type { Metadata } from "next";
import { newsreader, jetbrainsMono, inter } from "@/lib/fonts";
import { Nav } from "@/components/ui/Nav";
import { Footer } from "@/components/ui/Footer";
import { ThemeProvider } from "@/components/ui/ThemeProvider";
import "./globals.css";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://isaacadewumi.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Isaac Bello — Software Engineer",
    template: "%s — Isaac Bello",
  },
  description:
    "Personal portfolio and blog of Isaac Bello, a software engineer transitioning into AI engineering.",
  authors: [{ name: "Isaac Bello" }],
  creator: "Isaac Bello",
  openGraph: {
    title: "Isaac Bello — Software Engineer",
    description:
      "Personal portfolio and blog of Isaac Bello, a software engineer transitioning into AI engineering.",
    type: "website",
    locale: "en_US",
    siteName: "Isaac Bello",
  },
  twitter: {
    card: "summary_large_image",
    title: "Isaac Bello — Software Engineer",
    description:
      "Personal portfolio and blog of Isaac Bello, a software engineer transitioning into AI engineering.",
  },
  alternates: {
    canonical: SITE_URL,
    types: {
      "application/rss+xml": `${SITE_URL}/feed.xml`,
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${newsreader.variable} ${jetbrainsMono.variable} ${inter.variable}`}>
      <head>
        <link
          rel="alternate"
          type="application/rss+xml"
          title="Isaac Bello's Blog"
          href="/feed.xml"
        />
      </head>
      <body className="antialiased">
        <ThemeProvider>
          {/* Skip link for accessibility */}
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-accent focus:text-white focus:rounded-md focus:font-mono focus:text-sm"
          >
            Skip to main content
          </a>
          <Nav />
          <main id="main-content">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
