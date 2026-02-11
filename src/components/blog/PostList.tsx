"use client";

import { useState, useMemo } from "react";
import { PostListItem } from "./PostListItem";
import { TopicFilter } from "./TopicFilter";
import { FadeInStagger, FadeInStaggerItem } from "@/components/ui/FadeIn";
import type { Post } from "@/lib/types";

interface PostListProps {
  posts: Post[];
  topics: { name: string; count: number }[];
}

export function PostList({ posts, topics }: PostListProps) {
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);

  const filteredPosts = useMemo(() => {
    if (selectedTopics.length === 0) {
      return posts;
    }
    return posts.filter((post) =>
      post.frontmatter.topics.some((topic) => selectedTopics.includes(topic))
    );
  }, [posts, selectedTopics]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-8">
      {/* Sidebar filters - hidden on mobile */}
      <div className="hidden md:block">
        <TopicFilter
          topics={topics}
          selectedTopics={selectedTopics}
          onTopicChange={setSelectedTopics}
          totalPosts={posts.length}
        />
      </div>

      {/* Post list */}
      <main>
        {/* Column headers */}
        <div className="grid grid-cols-[100px_1fr_auto] md:grid-cols-[120px_1fr_auto] gap-4 font-mono text-[0.6875rem] tracking-[0.08em] uppercase text-text-secondary mb-4 pb-2 border-b border-border">
          <span>/ Date</span>
          <span>/ Name</span>
          <span className="hidden md:block w-4" />
        </div>

        {/* Posts */}
        {filteredPosts.length === 0 ? (
          <p className="py-8 text-center font-mono text-sm text-text-secondary">
            No posts found for the selected filters.
          </p>
        ) : (
          <FadeInStagger staggerDelay={0.05}>
            <div className="space-y-0">
              {filteredPosts.map((post) => (
                <FadeInStaggerItem key={post.slug}>
                  <PostListItem
                    slug={post.slug}
                    title={post.frontmatter.title}
                    date={post.frontmatter.date}
                  />
                </FadeInStaggerItem>
              ))}
            </div>
          </FadeInStagger>
        )}

        {/* Mobile filters */}
        <div className="md:hidden mt-8 pt-8 border-t border-border">
          <TopicFilter
            topics={topics}
            selectedTopics={selectedTopics}
            onTopicChange={setSelectedTopics}
            totalPosts={posts.length}
          />
        </div>
      </main>
    </div>
  );
}
