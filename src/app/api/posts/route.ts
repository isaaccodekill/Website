import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { posts } from "@/lib/schema";
import { desc } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

// GET /api/posts - List all posts
export async function GET() {
  try {
    const rows = await db
      .select()
      .from(posts)
      .orderBy(desc(posts.updatedAt));

    return NextResponse.json(rows);
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}

// POST /api/posts - Create a new post
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const id = uuidv4();
    const slug = body.slug || `untitled-${id.slice(0, 8)}`;

    const [newPost] = await db
      .insert(posts)
      .values({
        id,
        title: body.title || "",
        slug,
        excerpt: body.excerpt || "",
        topics: body.topics || [],
        status: body.status || "draft",
        tiptapJson: body.tiptap_json ? JSON.parse(body.tiptap_json) : {},
      })
      .returning();

    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 }
    );
  }
}
