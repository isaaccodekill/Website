"use client";
import { useState } from "react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import type { PostFrontmatter } from "@/lib/types";
export function PostArticle({
  frontmatter,
  children,
}: {
  frontmatter: PostFrontmatter;
  children: React.ReactNode;
}) {
  const [large, setLarge] = useState(false);
  return (
    <article className="reading-page">
      <Link className="quiet-link" href="/blog">
        ← all writing
      </Link>
      <header>
        <p className="eyebrow">
          {formatDate(frontmatter.date)} · {frontmatter.readingTime} min read
        </p>
        <h1>{frontmatter.title}</h1>
        <div className="reading-tools">
          <span>by Isaac Bello</span>
          <button aria-pressed={large} onClick={() => setLarge(!large)}>
            {large ? "Standard text" : "Larger text"}{" "}
            <span aria-hidden="true">Aa</span>
          </button>
        </div>
      </header>
      <div className={`prose reading-prose ${large ? "large-type" : ""}`}>
        {children}
      </div>
      <footer className="reading-end">
        <span aria-hidden="true">✳</span>
        <p>Thanks for spending a little time here.</p>
        <Link href="/blog">Back to the open pages ↗</Link>
      </footer>
    </article>
  );
}
