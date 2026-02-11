import { Metadata } from "next";
import { getAllMediaEntries } from "@/lib/media";
import { WeeklyEntry } from "@/components/media/WeeklyEntry";
import { FadeIn } from "@/components/ui/FadeIn";
import { MediaIllustrations } from "@/components/media/MediaIllustrations";
import { Butterflies } from "@/components/effects/Butterflies";

export const metadata: Metadata = {
  title: "Media — Isaac Bello",
  description:
    "A weekly log of music, books, films, and media I'm consuming.",
};

// Sample data for when database is empty
const sampleEntries = [
  {
    id: "sample-1",
    weekStart: "2026-02-03",
    weekEnd: "2026-02-09",
    tracks: [
      { name: "Runaway", artist: "Kanye West" },
      { name: "Pink + White", artist: "Frank Ocean" },
      { name: "Nights", artist: "Frank Ocean" },
      { name: "Redbone", artist: "Childish Gambino" },
    ],
    media: [
      {
        title: "Designing Data-Intensive Applications",
        type: "book" as const,
        note: "The distributed systems bible. Re-reading the consistency chapters.",
      },
      {
        title: "The Social Network",
        type: "film" as const,
        note: "Sorkin's dialogue is still unmatched.",
      },
    ],
    createdAt: "2026-02-03",
    updatedAt: "2026-02-09",
    publishedAt: "2026-02-09",
  },
  {
    id: "sample-2",
    weekStart: "2026-01-27",
    weekEnd: "2026-02-02",
    tracks: [
      { name: "Ivy", artist: "Frank Ocean" },
      { name: "Motion Sickness", artist: "Phoebe Bridgers" },
      { name: "Kyoto", artist: "Phoebe Bridgers" },
    ],
    media: [
      {
        title: "The Pragmatic Programmer",
        type: "book" as const,
        note: "Timeless advice on the craft.",
      },
      {
        title: "Lex Fridman Podcast #400",
        type: "podcast" as const,
        note: "Elon on AI, consciousness, and the future.",
      },
      {
        title: "Severance",
        type: "show" as const,
        note: "Season 2 is somehow even better.",
      },
    ],
    createdAt: "2026-01-27",
    updatedAt: "2026-02-02",
    publishedAt: "2026-02-02",
  },
];

export default async function MediaPage() {
  let entries = await getAllMediaEntries();

  // Use sample data if database is empty
  if (entries.length === 0) {
    entries = sampleEntries;
  }

  return (
    <div className="min-h-screen pt-36 pb-16 relative overflow-hidden">
      {/* Butterflies */}
      <Butterflies />

      {/* Decorative illustrations in white space */}
      <MediaIllustrations />

      <div className="relative z-10 mx-auto max-w-[38rem] px-6">
        <FadeIn>
          <header className="mb-12">
            <h1 className="font-serif text-4xl font-semibold tracking-tight text-text mb-2">
              Media
            </h1>
            <span className="font-mono text-[0.6875rem] tracking-[0.08em] uppercase text-text-secondary">
              / Updated Weekly
            </span>
          </header>
        </FadeIn>

        {entries.length === 0 ? (
          <FadeIn>
            <p className="text-center py-16 font-mono text-sm text-text-secondary">
              No media entries yet. Check back soon.
            </p>
          </FadeIn>
        ) : (
          entries.map((entry) => (
            <WeeklyEntry
              key={entry.id}
              weekStart={entry.weekStart}
              weekEnd={entry.weekEnd}
              tracks={entry.tracks}
              media={entry.media}
            />
          ))
        )}
      </div>
    </div>
  );
}
