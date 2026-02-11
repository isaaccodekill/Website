import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { posts } from "@/lib/schema";
import { eq } from "drizzle-orm";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/posts/[id] - Get a single post
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;

    const rows = await db.select().from(posts).where(eq(posts.id, id));

    if (rows.length === 0) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error("Error fetching post:", error);
    return NextResponse.json(
      { error: "Failed to fetch post" },
      { status: 500 }
    );
  }
}

// PUT /api/posts/[id] - Update a post
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Calculate word count and reading time from tiptap_json
    let wordCount = 0;
    let readingTime = 0;

    const tiptapContent = body.tiptap_json
      ? typeof body.tiptap_json === "string"
        ? JSON.parse(body.tiptap_json)
        : body.tiptap_json
      : null;

    if (tiptapContent) {
      const text = extractTextFromTiptap(tiptapContent);
      wordCount = text.split(/\s+/).filter(Boolean).length;
      readingTime = Math.ceil(wordCount / 200);
    }

    const updateData: Record<string, unknown> = {
      wordCount,
      readingTime,
      updatedAt: new Date(),
    };

    if (body.title !== undefined) updateData.title = body.title;
    if (body.slug !== undefined) updateData.slug = body.slug;
    if (body.excerpt !== undefined) updateData.excerpt = body.excerpt;
    if (body.topics !== undefined)
      updateData.topics =
        typeof body.topics === "string" ? JSON.parse(body.topics) : body.topics;
    if (body.status !== undefined) updateData.status = body.status;
    if (tiptapContent !== null) updateData.tiptapJson = tiptapContent;

    const [updated] = await db
      .update(posts)
      .set(updateData)
      .where(eq(posts.id, id))
      .returning();

    if (!updated) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating post:", error);
    return NextResponse.json(
      { error: "Failed to update post" },
      { status: 500 }
    );
  }
}

// DELETE /api/posts/[id] - Delete a post
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;

    await db.delete(posts).where(eq(posts.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting post:", error);
    return NextResponse.json(
      { error: "Failed to delete post" },
      { status: 500 }
    );
  }
}

// Helper function to extract text from Tiptap JSON
function extractTextFromTiptap(node: any): string {
  if (!node) return "";

  let text = "";

  if (node.type === "text") {
    text += node.text || "";
  }

  if (node.content && Array.isArray(node.content)) {
    for (const child of node.content) {
      text += extractTextFromTiptap(child) + " ";
    }
  }

  return text;
}
