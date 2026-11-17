import Link from "next/link";
import { getAllPosts } from "@/lib/mdx";
import { Doodle } from "@/components/journal/Doodle";
import { formatDate } from "@/lib/utils";
export const dynamic = "force-dynamic";
export default async function Home() {
  const posts = await getAllPosts();
  return (
    <div className="journal-shell">
      <section className="journal-intro">
        <p className="eyebrow">A personal notebook, open at a few pages</p>
        <h1>
          Thinking out loud.
          <br />
          <em>Finding my way.</em>
        </h1>
        <Doodle />
        <p className="intro-copy">
          I’m Isaac. I write to make a little more sense of what I feel, who I
          am, and the world around me.
        </p>
        <p className="margin-note">
          Still figuring things out. You’re welcome to stay a while.
        </p>
      </section>
      <section className="journal-entries">
        <div className="section-heading">
          <h2>Pages I’ve opened</h2>
          <Link href="/blog">all writing ↗</Link>
        </div>
        {posts.length ? (
          posts.slice(0, 5).map((post, i) => (
            <Link
              className="entry-row"
              key={post.slug}
              href={`/blog/${post.slug}`}
            >
              <span className="entry-number">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h3>{post.frontmatter.title}</h3>
                {post.frontmatter.excerpt && <p>{post.frontmatter.excerpt}</p>}
                <span className="entry-date">
                  {formatDate(post.frontmatter.date)} ·{" "}
                  {post.frontmatter.readingTime} min read
                </span>
              </div>
              <span aria-hidden="true">↗</span>
            </Link>
          ))
        ) : (
          <p className="empty-note">
            A few thoughts are taking shape. I’ll share them here when they’re
            ready.
          </p>
        )}
      </section>
      <aside className="little-note">
        <span aria-hidden="true">✳</span>
        <p>
          Some things make more sense
          <br />
          when you give them a page.
        </p>
        <span className="eyebrow">A reminder to myself</span>
      </aside>
    </div>
  );
}
