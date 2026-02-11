import { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";
import { mediaEntries } from "@/lib/schema";
import { desc, eq } from "drizzle-orm";
import { MediaForm } from "@/components/cms/MediaForm";
import { getWeekBounds, Track, MediaItem } from "@/lib/media";
import { v4 as uuidv4 } from "uuid";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Media — Writing Studio",
};

interface PageProps {
  searchParams: Promise<{ id?: string; new?: string }>;
}

async function getMediaEntries() {
  try {
    const rows = await db
      .select()
      .from(mediaEntries)
      .orderBy(desc(mediaEntries.weekStart));

    return rows.map((row) => ({
      id: row.id,
      weekStart: row.weekStart,
      weekEnd: row.weekEnd,
      tracks: (row.tracks as Track[]) || [],
      media: (row.media as MediaItem[]) || [],
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
      publishedAt: row.publishedAt?.toISOString() ?? null,
    }));
  } catch (error) {
    console.error("Error fetching media entries:", error);
    return [];
  }
}

async function getMediaEntry(id: string) {
  try {
    const rows = await db
      .select()
      .from(mediaEntries)
      .where(eq(mediaEntries.id, id));

    if (rows.length === 0) return null;

    const row = rows[0];
    return {
      id: row.id,
      weekStart: row.weekStart,
      weekEnd: row.weekEnd,
      tracks: (row.tracks as Track[]) || [],
      media: (row.media as MediaItem[]) || [],
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
      publishedAt: row.publishedAt?.toISOString() ?? null,
    };
  } catch (error) {
    console.error("Error fetching media entry:", error);
    return null;
  }
}

async function createNewEntry() {
  const id = uuidv4();
  const { weekStart, weekEnd } = getWeekBounds();

  await db.insert(mediaEntries).values({
    id,
    weekStart,
    weekEnd,
    tracks: [],
    media: [],
  });

  return id;
}

export default async function MediaCMSPage({ searchParams }: PageProps) {
  const params = await searchParams;

  // Create new entry if requested
  if (params.new === "true") {
    const id = await createNewEntry();
    redirect(`/cms/media?id=${id}`);
  }

  const entries = await getMediaEntries();
  const selectedEntry = params.id ? await getMediaEntry(params.id) : null;

  // Format date for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}`;
  };

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-text mb-1">
            Media Log
          </h1>
          <p className="font-mono text-xs text-text-secondary uppercase tracking-wider">
            / {entries.length} entries
          </p>
        </div>
        <Link
          href="/cms/media?new=true"
          className="px-4 py-2 bg-accent text-white font-mono text-xs uppercase tracking-wider rounded-md hover:bg-accent-hover transition-colors"
        >
          + New Week
        </Link>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
        {/* Entry list sidebar */}
        <aside className="space-y-2">
          <p className="font-mono text-[0.6875rem] tracking-[0.08em] uppercase text-text-secondary mb-3">
            / Weeks
          </p>
          {entries.length === 0 ? (
            <p className="text-center py-8 font-mono text-xs text-text-tertiary">
              No entries yet
            </p>
          ) : (
            entries.map((entry: any) => (
              <Link
                key={entry.id}
                href={`/cms/media?id=${entry.id}`}
                className={`block p-3 rounded-lg transition-colors ${
                  params.id === entry.id
                    ? "bg-accent-light border border-accent"
                    : "bg-bg-subtle hover:bg-border/50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-text-secondary">
                    {formatDate(entry.weekStart)} — {formatDate(entry.weekEnd)}
                  </span>
                  <span
                    className={`w-2 h-2 rounded-full ${
                      entry.publishedAt ? "bg-green-500" : "bg-amber-400"
                    }`}
                  />
                </div>
                <div className="mt-1 font-mono text-[0.625rem] text-text-tertiary">
                  {entry.tracks.length} tracks · {entry.media.length} items
                </div>
              </Link>
            ))
          )}
        </aside>

        {/* Editor area */}
        <main className="min-h-[60vh]">
          {selectedEntry ? (
            <MediaForm entry={selectedEntry} />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <p className="font-mono text-sm text-text-secondary mb-4">
                  Select a week to edit or create a new one
                </p>
                <Link
                  href="/cms/media?new=true"
                  className="inline-block px-4 py-2 border border-accent text-accent font-mono text-xs uppercase tracking-wider rounded-md hover:bg-accent hover:text-white transition-colors"
                >
                  + New Week
                </Link>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
