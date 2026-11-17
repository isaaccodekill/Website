"use client";
import { useState } from "react";
import Link from "next/link";
import type { Post } from "@/lib/types";
import { formatDate } from "@/lib/utils";
export function PostList({
  posts,
  topics,
}: {
  posts: Post[];
  topics: { name: string; count: number }[];
}) {
  const [topic, setTopic] = useState("");
  const [query, setQuery] = useState("");
  const filtered = posts.filter(
    (p) =>
      (!topic || p.frontmatter.topics.includes(topic)) &&
      `${p.frontmatter.title} ${p.frontmatter.excerpt}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  return (
    <section className="archive-list">
      <label className="search-label">
        Find a thought
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search these pages…"
        />
      </label>
      {topics.length > 0 && (
        <div className="topic-tabs">
          <button aria-pressed={!topic} onClick={() => setTopic("")}>
            all pages
          </button>
          {topics.map((t) => (
            <button
              key={t.name}
              aria-pressed={topic === t.name}
              onClick={() => setTopic(t.name)}
            >
              {t.name}
            </button>
          ))}
        </div>
      )}
      {filtered.map((p, i) => (
        <Link className="entry-row" href={`/blog/${p.slug}`} key={p.slug}>
          <span className="entry-number">{String(i + 1).padStart(2, "0")}</span>
          <div>
            <h2>{p.frontmatter.title}</h2>
            <p>{p.frontmatter.excerpt}</p>
            <span className="entry-date">
              {formatDate(p.frontmatter.date)} · {p.frontmatter.readingTime} min
              read
            </span>
          </div>
          <span aria-hidden="true">↗</span>
        </Link>
      ))}
      {!filtered.length && (
        <p className="empty-note">
          No pages here yet
          {query || topic ? ". Try another search or topic." : "."}
        </p>
      )}
    </section>
  );
}
