"use client";

import Link from "next/link";
import { ClickRipple } from "@/components/effects/ClickRipple";
import { formatDate } from "@/lib/utils";

interface PostListItemProps {
  slug: string;
  title: string;
  date: string;
}

export function PostListItem({ slug, title, date }: PostListItemProps) {
  return (
    <ClickRipple>
      <Link
        href={`/blog/${slug}`}
        className="group grid grid-cols-[100px_1fr_auto] md:grid-cols-[120px_1fr_auto] gap-4 py-3 -mx-3 px-3 rounded transition-colors duration-300 hover:bg-bg-subtle"
      >
        <span className="font-mono text-[0.75rem] text-text-secondary flex items-baseline">
          <span className="text-accent mr-1.5">&#9632;</span>
          {formatDate(date)}
        </span>
        <span className="font-serif text-[1.0625rem] font-medium text-text group-hover:text-accent transition-colors duration-300">
          {title}
        </span>
        <span className="hidden md:flex items-center text-text-tertiary group-hover:text-accent transition-colors duration-300">
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
              d="M12 4v16m8-8H4"
            />
          </svg>
        </span>
      </Link>
    </ClickRipple>
  );
}
