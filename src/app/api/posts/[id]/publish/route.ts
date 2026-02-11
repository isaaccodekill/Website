import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { posts } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { tiptapToMdx, generateMdxFile } from "@/lib/tiptap-to-mdx";
import fs from "fs";
import path from "path";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// POST /api/posts/[id]/publish - Publish a post to MDX file
export async function POST(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;

    const rows = await db.select().from(posts).where(eq(posts.id, id));

    if (rows.length === 0) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const post = rows[0];

    // Validate required fields
    if (!post.title || !post.slug) {
      return NextResponse.json(
        { error: "Title and slug are required to publish" },
        { status: 400 }
      );
    }

    // Parse tiptap JSON and convert to MDX
    let mdxContent = "";
    if (post.tiptapJson) {
      try {
        const tiptapDoc =
          typeof post.tiptapJson === "string"
            ? JSON.parse(post.tiptapJson)
            : post.tiptapJson;
        mdxContent = tiptapToMdx(tiptapDoc);
      } catch (e) {
        console.error("Error parsing tiptap JSON:", e);
        mdxContent = "";
      }
    }

    // Parse topics
    const topics: string[] = Array.isArray(post.topics)
      ? (post.topics as string[])
      : [];

    // Generate MDX file content
    const mdxFile = generateMdxFile(
      {
        title: post.title,
        slug: post.slug,
        date:
          post.publishedAt?.toISOString().split("T")[0] ||
          new Date().toISOString().split("T")[0],
        topics,
        excerpt: post.excerpt || "",
        readingTime: post.readingTime || 1,
      },
      mdxContent
    );

    // Write to content/posts directory
    const postsDir = path.join(process.cwd(), "content", "posts");

    // Ensure directory exists
    if (!fs.existsSync(postsDir)) {
      fs.mkdirSync(postsDir, { recursive: true });
    }

    const filePath = path.join(postsDir, `${post.slug}.mdx`);
    fs.writeFileSync(filePath, mdxFile, "utf8");

    // Update post status in database
    const now = new Date();
    const [updated] = await db
      .update(posts)
      .set({
        status: "published",
        publishedAt: post.publishedAt ?? now,
        updatedAt: now,
      })
      .where(eq(posts.id, id))
      .returning();

    return NextResponse.json({
      success: true,
      post: updated,
      filePath: `content/posts/${post.slug}.mdx`,
    });
  } catch (error) {
    console.error("Error publishing post:", error);
    return NextResponse.json(
      { error: "Failed to publish post" },
      { status: 500 }
    );
  }
}
