import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { posts } from "@/lib/schema";
import { v4 as uuidv4 } from "uuid";

export default async function NewPostPage() {
  // Create a new post and redirect to the editor
  const id = uuidv4();
  const slug = `untitled-${id.slice(0, 8)}`;

  await db.insert(posts).values({
    id,
    title: "",
    slug,
    excerpt: "",
    topics: [],
    status: "draft",
    tiptapJson: {},
  });

  redirect(`/cms/posts/${id}`);
}
