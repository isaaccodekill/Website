import { Metadata } from "next";
import { getAllPosts, getAllTopics } from "@/lib/mdx";
import { PostList } from "@/components/blog/PostList";
import { FadeIn } from "@/components/ui/FadeIn";
import { BlogIllustrations } from "@/components/blog/BlogIllustrations";
import { Butterflies } from "@/components/effects/Butterflies";

export const metadata: Metadata = {
  title: "Blog — Isaac Bello",
  description:
    "Weekly technical blog posts about software engineering, AI, and the craft of building.",
};

export default async function BlogPage() {
  const posts = await getAllPosts();
  const topics = await getAllTopics();

  return (
    <div className="min-h-screen pt-36 pb-16 relative overflow-hidden">
      {/* Butterflies */}
      <Butterflies />

      {/* Decorative typewriter illustration */}
      <BlogIllustrations />

      <div className="relative z-10 mx-auto max-w-4xl px-6">
        <FadeIn>
          <header className="mb-12">
            <h1 className="font-serif text-4xl font-semibold tracking-tight text-text">
              Blog
              <sup className="ml-1 font-mono text-sm text-text-tertiary">
                {posts.length}
              </sup>
            </h1>
          </header>
        </FadeIn>

        <PostList posts={posts} topics={topics} />
      </div>
    </div>
  );
}
