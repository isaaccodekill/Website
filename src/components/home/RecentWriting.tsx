import Link from "next/link";
import { getAllPosts, formatDate } from "@/lib/mdx";
import { FadeIn, FadeInStagger, FadeInStaggerItem } from "@/components/ui/FadeIn";
import { MonoLabel } from "@/components/ui/MonoLabel";

export async function RecentWriting() {
  const posts = (await getAllPosts()).slice(0, 3);

  if (posts.length === 0) {
    return null;
  }

  return (
    <section className="mt-16">
      <FadeIn>
        <MonoLabel className="mb-6 block">Recent Writing</MonoLabel>
      </FadeIn>

      <FadeInStagger staggerDelay={0.08}>
        <div className="space-y-0">
          {posts.map((post) => (
            <FadeInStaggerItem key={post.slug}>
              <Link
                href={`/blog/${post.slug}`}
                className="group flex items-baseline gap-4 py-3 -mx-3 px-3 rounded transition-colors duration-300 hover:bg-bg-subtle"
              >
                <span className="font-mono text-[0.75rem] text-text-secondary shrink-0">
                  <span className="text-accent mr-1.5">&#9632;</span>
                  {formatDate(post.frontmatter.date)}
                </span>
                <span className="font-serif text-[1.0625rem] font-medium text-text group-hover:text-accent transition-colors duration-300">
                  {post.frontmatter.title}
                </span>
              </Link>
            </FadeInStaggerItem>
          ))}
        </div>
      </FadeInStagger>

      <FadeIn delay={0.3}>
        <Link
          href="/blog"
          className="inline-block mt-6 font-mono text-[0.6875rem] tracking-[0.08em] uppercase text-text-secondary hover:text-accent transition-colors duration-300 link-underline"
        >
          View all posts &rarr;
        </Link>
      </FadeIn>
    </section>
  );
}
