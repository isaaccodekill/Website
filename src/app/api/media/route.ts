import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { mediaEntries } from "@/lib/schema";
import { desc, eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { getWeekBounds, Track, MediaItem } from "@/lib/media";

// GET /api/media - List all media entries
export async function GET() {
  try {
    const rows = await db
      .select()
      .from(mediaEntries)
      .orderBy(desc(mediaEntries.weekStart));

    const entries = rows.map((row) => ({
      id: row.id,
      weekStart: row.weekStart,
      weekEnd: row.weekEnd,
      tracks: (row.tracks as Track[]) || [],
      media: (row.media as MediaItem[]) || [],
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
      publishedAt: row.publishedAt?.toISOString() ?? null,
    }));

    return NextResponse.json(entries);
  } catch (error) {
    console.error("Error fetching media entries:", error);
    return NextResponse.json(
      { error: "Failed to fetch media entries" },
      { status: 500 }
    );
  }
}

// POST /api/media - Create a new media entry
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const id = uuidv4();

    // Use provided dates or default to current week
    const { weekStart, weekEnd } = body.weekStart
      ? { weekStart: body.weekStart, weekEnd: body.weekEnd }
      : getWeekBounds();

    const [newEntry] = await db
      .insert(mediaEntries)
      .values({
        id,
        weekStart,
        weekEnd,
        tracks: body.tracks || [],
        media: body.media || [],
      })
      .returning();

    return NextResponse.json(
      {
        id: newEntry.id,
        weekStart: newEntry.weekStart,
        weekEnd: newEntry.weekEnd,
        tracks: (newEntry.tracks as Track[]) || [],
        media: (newEntry.media as MediaItem[]) || [],
        createdAt: newEntry.createdAt.toISOString(),
        updatedAt: newEntry.updatedAt.toISOString(),
        publishedAt: newEntry.publishedAt?.toISOString() ?? null,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating media entry:", error);
    return NextResponse.json(
      { error: "Failed to create media entry" },
      { status: 500 }
    );
  }
}
