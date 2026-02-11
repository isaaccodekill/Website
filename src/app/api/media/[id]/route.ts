import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { mediaEntries } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { Track, MediaItem } from "@/lib/media";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/media/[id] - Get a single media entry
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;

    const rows = await db
      .select()
      .from(mediaEntries)
      .where(eq(mediaEntries.id, id));

    if (rows.length === 0) {
      return NextResponse.json(
        { error: "Media entry not found" },
        { status: 404 }
      );
    }

    const row = rows[0];
    return NextResponse.json({
      id: row.id,
      weekStart: row.weekStart,
      weekEnd: row.weekEnd,
      tracks: (row.tracks as Track[]) || [],
      media: (row.media as MediaItem[]) || [],
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
      publishedAt: row.publishedAt?.toISOString() ?? null,
    });
  } catch (error) {
    console.error("Error fetching media entry:", error);
    return NextResponse.json(
      { error: "Failed to fetch media entry" },
      { status: 500 }
    );
  }
}

// PUT /api/media/[id] - Update a media entry
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();

    const updateData: Record<string, unknown> = {
      updatedAt: new Date(),
    };

    if (body.weekStart !== undefined) updateData.weekStart = body.weekStart;
    if (body.weekEnd !== undefined) updateData.weekEnd = body.weekEnd;
    if (body.tracks !== undefined) updateData.tracks = body.tracks;
    if (body.media !== undefined) updateData.media = body.media;
    if (body.publishedAt !== undefined)
      updateData.publishedAt = body.publishedAt
        ? new Date(body.publishedAt)
        : null;

    const [updated] = await db
      .update(mediaEntries)
      .set(updateData)
      .where(eq(mediaEntries.id, id))
      .returning();

    if (!updated) {
      return NextResponse.json(
        { error: "Media entry not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: updated.id,
      weekStart: updated.weekStart,
      weekEnd: updated.weekEnd,
      tracks: (updated.tracks as Track[]) || [],
      media: (updated.media as MediaItem[]) || [],
      createdAt: updated.createdAt.toISOString(),
      updatedAt: updated.updatedAt.toISOString(),
      publishedAt: updated.publishedAt?.toISOString() ?? null,
    });
  } catch (error) {
    console.error("Error updating media entry:", error);
    return NextResponse.json(
      { error: "Failed to update media entry" },
      { status: 500 }
    );
  }
}

// DELETE /api/media/[id] - Delete a media entry
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;

    await db.delete(mediaEntries).where(eq(mediaEntries.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting media entry:", error);
    return NextResponse.json(
      { error: "Failed to delete media entry" },
      { status: 500 }
    );
  }
}
