import { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";
import { posts } from "@/lib/schema";
import { count, eq, desc } from "drizzle-orm";

export const metadata: Metadata = {
  title: "Dashboard — Writing Studio",
};

async function getStats() {
  try {
    const [totalResult, draftsResult, publishedResult] = await Promise.all([
      db.select({ count: count() }).from(posts),
      db.select({ count: count() }).from(posts).where(eq(posts.status, "draft")),
      db.select({ count: count() }).from(posts).where(eq(posts.status, "published")),
    ]);

    const totalPosts = totalResult[0]?.count || 0;
    const drafts = draftsResult[0]?.count || 0;
    const published = publishedResult[0]?.count || 0;

    // Get recent posts
    const recentPosts = await db
      .select({
        id: posts.id,
        title: posts.title,
        status: posts.status,
        updatedAt: posts.updatedAt,
      })
      .from(posts)
      .orderBy(desc(posts.updatedAt))
      .limit(5);

    return {
      totalPosts,
      drafts,
      published,
      recentPosts,
    };
  } catch (error) {
    console.error("Error fetching stats:", error);
    return {
      totalPosts: 0,
      drafts: 0,
      published: 0,
      recentPosts: [],
    };
  }
}

export default async function CMSDashboard() {
  const stats = await getStats();

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <header className="mb-12">
        <h1 className="font-serif text-3xl font-semibold text-text mb-2">
          Dashboard
        </h1>
        <p className="font-mono text-xs text-text-secondary uppercase tracking-wider">
          / Welcome back
        </p>
      </header>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
        <Link
          href="/cms/posts/new"
          className="group p-6 border border-border rounded-lg hover:border-accent hover:bg-accent-light/30 transition-all duration-200"
        >
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">+</span>
            <span className="font-serif text-lg font-medium text-text group-hover:text-accent transition-colors">
              New Post
            </span>
          </div>
          <p className="font-mono text-xs text-text-secondary">
            Start writing a new blog post
          </p>
        </Link>

        <Link
          href="/cms/posts"
          className="group p-6 border border-border rounded-lg hover:border-accent hover:bg-accent-light/30 transition-all duration-200"
        >
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">&#9776;</span>
            <span className="font-serif text-lg font-medium text-text group-hover:text-accent transition-colors">
              All Posts
            </span>
          </div>
          <p className="font-mono text-xs text-text-secondary">
            View and manage your posts
          </p>
        </Link>

        <Link
          href="/cms/home"
          className="group p-6 border border-border rounded-lg hover:border-accent hover:bg-accent-light/30 transition-all duration-200"
        >
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">&#9998;</span>
            <span className="font-serif text-lg font-medium text-text group-hover:text-accent transition-colors">
              Edit Home
            </span>
          </div>
          <p className="font-mono text-xs text-text-secondary">
            Update home page text
          </p>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-12">
        <div className="p-4 bg-bg-subtle rounded-lg">
          <p className="font-mono text-3xl font-semibold text-text">
            {stats.totalPosts}
          </p>
          <p className="font-mono text-xs text-text-secondary uppercase tracking-wider">
            Total Posts
          </p>
        </div>
        <div className="p-4 bg-bg-subtle rounded-lg">
          <p className="font-mono text-3xl font-semibold text-accent">
            {stats.drafts}
          </p>
          <p className="font-mono text-xs text-text-secondary uppercase tracking-wider">
            Drafts
          </p>
        </div>
        <div className="p-4 bg-bg-subtle rounded-lg">
          <p className="font-mono text-3xl font-semibold text-text">
            {stats.published}
          </p>
          <p className="font-mono text-xs text-text-secondary uppercase tracking-wider">
            Published
          </p>
        </div>
      </div>

      {/* Recent Posts */}
      {stats.recentPosts.length > 0 && (
        <section>
          <h2 className="font-mono text-[0.6875rem] tracking-[0.08em] uppercase text-text-secondary mb-4">
            / Recent Posts
          </h2>
          <div className="space-y-2">
            {stats.recentPosts.map((post: any) => (
              <Link
                key={post.id}
                href={`/cms/posts/${post.id}`}
                className="flex items-center justify-between p-3 -mx-3 rounded hover:bg-bg-subtle transition-colors"
              >
                <span className="font-serif text-text">
                  {post.title || "Untitled"}
                </span>
                <span
                  className={`font-mono text-[0.625rem] uppercase tracking-wider px-2 py-0.5 rounded ${
                    post.status === "published"
                      ? "bg-green-100 text-green-700"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {post.status}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
