import { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";
import { posts } from "@/lib/schema";
import { desc } from "drizzle-orm";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Posts — Writing Studio",
};

async function getPosts() {
  try {
    const rows = await db.select().from(posts).orderBy(desc(posts.updatedAt));
    return rows;
  } catch (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
}

export default async function PostsPage() {
  const allPosts = await getPosts();

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-text mb-1">
            Posts
          </h1>
          <p className="font-mono text-xs text-text-secondary uppercase tracking-wider">
            / {allPosts.length} total
          </p>
        </div>
        <Link
          href="/cms/posts/new"
          className="px-4 py-2 bg-accent text-white font-mono text-xs uppercase tracking-wider rounded-md hover:bg-accent-hover transition-colors"
        >
          + New Post
        </Link>
      </header>

      {allPosts.length === 0 ? (
        <div className="text-center py-16">
          <p className="font-mono text-sm text-text-secondary mb-4">
            No posts yet
          </p>
          <Link
            href="/cms/posts/new"
            className="inline-block px-4 py-2 border border-accent text-accent font-mono text-xs uppercase tracking-wider rounded-md hover:bg-accent hover:text-white transition-colors"
          >
            Create your first post
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {allPosts.map((post) => (
            <Link
              key={post.id}
              href={`/cms/posts/${post.id}`}
              className="flex items-center justify-between p-4 -mx-4 rounded-lg hover:bg-bg-subtle transition-colors group"
            >
              <div className="flex-1 min-w-0">
                <h2 className="font-serif text-lg text-text group-hover:text-accent transition-colors truncate">
                  {post.title || "Untitled"}
                </h2>
                <div className="flex items-center gap-3 mt-1">
                  <span className="font-mono text-xs text-text-tertiary">
                    {formatDate(post.updatedAt.toISOString())}
                  </span>
                  {post.excerpt && (
                    <span className="font-mono text-xs text-text-tertiary truncate max-w-[300px]">
                      {post.excerpt}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3 ml-4">
                <span
                  className={`font-mono text-[0.625rem] uppercase tracking-wider px-2 py-0.5 rounded ${
                    post.status === "published"
                      ? "bg-green-100 text-green-700"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {post.status}
                </span>
                <svg
                  className="w-4 h-4 text-text-tertiary group-hover:text-accent transition-colors"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
