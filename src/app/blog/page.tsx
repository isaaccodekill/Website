import { getAllPosts, getAllTopics } from "@/lib/mdx";
import { PostList } from "@/components/blog/PostList";
export const dynamic = "force-dynamic";
export const metadata = {
  title: "Writing",
  description:
    "Notes on feelings, questions, and figuring things out. A personal notebook by Isaac Bello.",
};
export default async function BlogPage() {
  const posts = await getAllPosts();
  const topics = await getAllTopics();
  return (
    <div className="journal-shell archive-page">
      <p className="eyebrow">The open pages</p>
      <h1>Writing, to understand.</h1>
      <p className="intro-copy">
        Thoughts I’ve spent some time with. Take your time, too.
      </p>
      <PostList posts={posts} topics={topics} />
    </div>
  );
}
