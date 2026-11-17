import { textOf } from "@/components/journal/RichText";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { studioApiGuard } from "@/lib/studio-auth";
import { db } from "@/lib/db";
import { posts } from "@/lib/schema";
import { eq } from "drizzle-orm";
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const denied = await studioApiGuard(request);
  if (denied) return denied;
  try {
    const { id } = await params;
    const body = await request.json();
    if (body.confirmPublish !== true)
      return NextResponse.json(
        { error: "Please confirm publication." },
        { status: 400 },
      );
    if (
      typeof body.title !== "string" ||
      !body.title.trim() ||
      typeof body.slug !== "string" ||
      !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(body.slug)
    )
      return NextResponse.json(
        {
          error:
            "Add a title and a URL containing lowercase letters, numbers and hyphens.",
        },
        { status: 400 },
      );
    const [existing] = await db.select().from(posts).where(eq(posts.id, id));
    if (!existing)
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    const doc =
      typeof body.tiptap_json === "string"
        ? JSON.parse(body.tiptap_json)
        : body.tiptap_json;
    if (doc?.type !== "doc")
      return NextResponse.json(
        { error: "Invalid page content" },
        { status: 400 },
      );
    const words = textOf(doc).trim().split(/\s+/).filter(Boolean).length;
    const [post] = await db
      .update(posts)
      .set({
        title: body.title.trim(),
        slug: body.slug,
        excerpt: body.excerpt || "",
        topics: body.topics || [],
        tiptapJson: doc,
        status: "published",
        publishedAt: existing.publishedAt ?? new Date(),
        updatedAt: new Date(),
        wordCount: words,
        readingTime: Math.max(1, Math.ceil(words / 200)),
      })
      .where(eq(posts.id, id))
      .returning();
    for (const path of [
      "/",
      "/blog",
      `/blog/${existing.slug}`,
      `/blog/${post.slug}`,
      "/feed.xml",
      "/sitemap.xml",
    ])
      revalidatePath(path);
    return NextResponse.json({ post });
  } catch {
    return NextResponse.json(
      {
        error: "Couldn’t publish. Check that the URL is unique and try again.",
      },
      { status: 500 },
    );
  }
}
