import Link from "next/link";
import { requireOwner } from "@/lib/studio-auth";
import { db } from "@/lib/db";
import { posts } from "@/lib/schema";
import { desc } from "drizzle-orm";
export const metadata = { title: "My notebook" };
export default async function Dashboard() {
  await requireOwner();
  const pages = await db
    .select()
    .from(posts)
    .orderBy(desc(posts.updatedAt))
    .limit(8);
  return (
    <div className="studio-dashboard">
      <p className="eyebrow">Your quiet corner</p>
      <h1>What’s on your mind?</h1>
      <p>
        You don’t need a conclusion to begin.
        <br />
        Everything starts as a private draft.
      </p>
      <Link className="ink-button" href="/cms/posts/new">
        Open a blank page +
      </Link>
      <div className="section-heading">
        <h2>Pick up a thought</h2>
        <Link href="/cms/posts">all pages ↗</Link>
      </div>
      {pages.map((p) => (
        <Link key={p.id} href={`/cms/posts/${p.id}`} className="notebook-row">
          <h3>{p.title || "An untitled thought"}</h3>
          <span>{p.status === "draft" ? "private draft" : "published"}</span>
        </Link>
      ))}
      {!pages.length && (
        <p className="empty-note">Your first page is waiting.</p>
      )}
      <div className="page-footnote" style={{ marginTop: 50 }}>
        <Link href="/cms/home">Edit about page</Link>
        <Link href="/cms/media">Edit shelf</Link>
      </div>
    </div>
  );
}
