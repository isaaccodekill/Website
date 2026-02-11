"use client";

import { useRef } from "react";
import Link from "next/link";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { MonoLabel } from "@/components/ui/MonoLabel";
import { FadeIn } from "@/components/ui/FadeIn";
import { formatDate } from "@/lib/utils";
import type { PostFrontmatter } from "@/lib/types";

interface PostArticleProps {
  frontmatter: PostFrontmatter;
  children: React.ReactNode;
}

export function PostArticle({ frontmatter, children }: PostArticleProps) {
  const contentRef = useRef<HTMLElement>(null);

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareText = `${frontmatter.title} by Isaac Bello`;

  return (
    <div className="min-h-screen pt-36 pb-16 relative">
      {/* Progress bar - fixed to right edge */}
      <div className="hidden lg:block fixed right-8 top-32 z-40">
        <ProgressBar contentRef={contentRef} />
      </div>

      <div className="mx-auto max-w-5xl px-6">
        <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-8 lg:gap-12">
          {/* Left sidebar - Metadata */}
          <aside className="lg:sticky lg:top-32 lg:self-start">
            <FadeIn>
              <div className="space-y-6">
                <div>
                  <MonoLabel className="mb-2 block">Metadata</MonoLabel>
                  <div className="space-y-3">
                    <div>
                      <span className="font-mono text-[0.625rem] uppercase tracking-wider text-text-tertiary block">
                        Date
                      </span>
                      <span className="font-mono text-xs text-text-secondary">
                        {formatDate(frontmatter.date)}
                      </span>
                    </div>
                    <div>
                      <span className="font-mono text-[0.625rem] uppercase tracking-wider text-text-tertiary block">
                        Reading Time
                      </span>
                      <span className="font-mono text-xs text-text-secondary">
                        {frontmatter.readingTime} min read
                      </span>
                    </div>
                    {frontmatter.topics.length > 0 && (
                      <div>
                        <span className="font-mono text-[0.625rem] uppercase tracking-wider text-text-tertiary block mb-1">
                          Topics
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {frontmatter.topics.map((topic) => (
                            <Link
                              key={topic}
                              href={`/blog?topic=${topic}`}
                              className="font-mono text-[0.625rem] uppercase tracking-wider px-2 py-0.5 bg-bg-subtle text-text-secondary hover:text-accent hover:bg-accent-light rounded transition-colors duration-200"
                            >
                              {topic}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Share links */}
                <div>
                  <MonoLabel className="mb-2 block">Share</MonoLabel>
                  <div className="flex gap-3">
                    <a
                      href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-[0.625rem] uppercase tracking-wider text-text-tertiary hover:text-accent transition-colors duration-200"
                    >
                      Twitter
                    </a>
                    <a
                      href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-[0.625rem] uppercase tracking-wider text-text-tertiary hover:text-accent transition-colors duration-200"
                    >
                      LinkedIn
                    </a>
                  </div>
                </div>
              </div>
            </FadeIn>
          </aside>

          {/* Main content */}
          <article ref={contentRef} className="min-w-0">
            <FadeIn>
              <header className="mb-12">
                <h1 className="font-serif text-3xl md:text-4xl font-semibold tracking-tight text-text leading-tight">
                  {frontmatter.title}
                </h1>
              </header>
            </FadeIn>

            <FadeIn delay={0.1}>
              <div className="prose prose-lg max-w-none">{children}</div>
            </FadeIn>

            {/* Back to blog link */}
            <FadeIn delay={0.2}>
              <div className="mt-16 pt-8 border-t border-border">
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-2 font-mono text-[0.6875rem] tracking-[0.08em] uppercase text-text-secondary hover:text-accent transition-colors duration-300"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                  </svg>
                  Back to all posts
                </Link>
              </div>
            </FadeIn>
          </article>
        </div>
      </div>
    </div>
  );
}
