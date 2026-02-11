import "server-only";
import { db } from "./db";
import { mediaEntries } from "./schema";
import { eq, isNotNull, desc } from "drizzle-orm";

export interface Track {
  name: string;
  artist: string;
  albumArt?: string;
}

export interface MediaItem {
  title: string;
  type: "book" | "film" | "podcast" | "article" | "show";
  note?: string;
  url?: string;
}

export interface MediaEntry {
  id: string;
  weekStart: string;
  weekEnd: string;
  tracks: Track[];
  media: MediaItem[];
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
}

export async function getAllMediaEntries(): Promise<MediaEntry[]> {
  try {
    const rows = await db
      .select()
      .from(mediaEntries)
      .where(isNotNull(mediaEntries.publishedAt))
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

export async function getMediaEntryById(
  id: string
): Promise<MediaEntry | null> {
  try {
    const rows = await db
      .select()
      .from(mediaEntries)
      .where(eq(mediaEntries.id, id));

    if (rows.length === 0) {
      return null;
    }

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

// Get the Monday and Sunday of a given week
export function getWeekBounds(date: Date = new Date()): {
  weekStart: string;
  weekEnd: string;
} {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday

  const monday = new Date(d.setDate(diff));
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  return {
    weekStart: monday.toISOString().split("T")[0],
    weekEnd: sunday.toISOString().split("T")[0],
  };
}
