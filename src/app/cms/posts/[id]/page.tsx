import { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { posts } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { PostEditor } from "@/components/cms/PostEditor";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;

  const rows = await db
    .select({ title: posts.title })
    .from(posts)
    .where(eq(posts.id, id));

  const title = rows[0]?.title || "Untitled";
  return {
    title: `${title || "Edit Post"} — Writing Studio`,
  };
}

async function getPost(id: string) {
  try {
    const rows = await db.select().from(posts).where(eq(posts.id, id));

    if (rows.length === 0) {
      return null;
    }

    const post = rows[0];

    // topics is already an array from jsonb
    const topics: string[] = Array.isArray(post.topics)
      ? (post.topics as string[])
      : [];

    return {
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt ?? "",
      topics,
      status: post.status as "draft" | "published",
      tiptapJson: post.tiptapJson,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      publishedAt: post.publishedAt,
    };
  } catch (error) {
    console.error("Error fetching post:", error);
    return null;
  }
}

export default async function EditPostPage({ params }: PageProps) {
  const { id } = await params;
  const post = await getPost(id);

  if (!post) {
    notFound();
  }

  return <PostEditor post={post} />;
}
