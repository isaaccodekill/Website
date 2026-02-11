import { Letterhead } from "@/components/home/Letterhead";
import { TheLetter } from "@/components/home/TheLetter";
import { RecentWriting } from "@/components/home/RecentWriting";
import { Divider } from "@/components/ui/Divider";
import { LiquidBlob } from "@/components/effects/LiquidBlob";
import { Butterflies } from "@/components/effects/Butterflies";
import { getHomePageSections } from "@/lib/site-content";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://belloisaac.com";

// JSON-LD structured data for SEO
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Isaac Bello",
  url: SITE_URL,
  jobTitle: "Software Engineer",
  description:
    "Software engineer transitioning into AI engineering, with experience in TypeScript, Next.js, Python, and machine learning.",
  sameAs: [
    "https://github.com/belloisaac",
    "https://twitter.com/belloisaac",
    "https://linkedin.com/in/belloisaac",
  ],
  knowsAbout: [
    "TypeScript",
    "Next.js",
    "React",
    "Python",
    "Machine Learning",
    "Deep Learning",
    "Software Engineering",
    "AI Engineering",
  ],
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "University of Lagos",
  },
};

export default async function Home() {
  const sections = await getHomePageSections();

  return (
    <>
      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Ambient cursor blob effect (desktop only) */}
      <LiquidBlob />

      {/* Subtle butterflies floating across screen */}
      <Butterflies />

      {/* Main content */}
      <div className="relative z-10 min-h-screen">
        {/* The Letter */}
        <div className="mx-auto max-w-[38rem] px-6 pt-36 pb-16">
          <Letterhead />
          <TheLetter sections={sections} />
          <Divider className="mt-16" />
          <RecentWriting />
        </div>
      </div>
    </>
  );
}
