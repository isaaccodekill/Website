"use client";

import { useCallback } from "react";

interface Topic {
  name: string;
  count: number;
}

interface TopicFilterProps {
  topics: Topic[];
  selectedTopics: string[];
  onTopicChange: (topics: string[]) => void;
  totalPosts: number;
}

export function TopicFilter({
  topics,
  selectedTopics,
  onTopicChange,
  totalPosts,
}: TopicFilterProps) {
  const handleAllChange = useCallback(() => {
    onTopicChange([]);
  }, [onTopicChange]);

  const handleTopicChange = useCallback(
    (topic: string) => {
      if (selectedTopics.includes(topic)) {
        onTopicChange(selectedTopics.filter((t) => t !== topic));
      } else {
        onTopicChange([...selectedTopics, topic]);
      }
    },
    [selectedTopics, onTopicChange]
  );

  const isAllSelected = selectedTopics.length === 0;

  return (
    <aside className="sticky top-24">
      <span className="font-mono text-[0.6875rem] tracking-[0.08em] uppercase text-text-secondary block mb-4">
        / Filters
      </span>
      <div className="space-y-2">
        {/* All posts filter */}
        <label className="flex items-center gap-2 cursor-pointer group">
          <input
            type="checkbox"
            checked={isAllSelected}
            onChange={handleAllChange}
            className="w-3.5 h-3.5 rounded border-border text-accent focus:ring-accent focus:ring-offset-0 cursor-pointer"
          />
          <span
            className={`font-mono text-xs transition-colors duration-200 ${
              isAllSelected
                ? "text-accent"
                : "text-text-secondary group-hover:text-text"
            }`}
          >
            All ({totalPosts})
          </span>
        </label>

        {/* Individual topic filters */}
        {topics.map((topic) => {
          const isSelected = selectedTopics.includes(topic.name);
          return (
            <label
              key={topic.name}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => handleTopicChange(topic.name)}
                className="w-3.5 h-3.5 rounded border-border text-accent focus:ring-accent focus:ring-offset-0 cursor-pointer"
              />
              <span
                className={`font-mono text-xs transition-colors duration-200 capitalize ${
                  isSelected
                    ? "text-accent"
                    : "text-text-secondary group-hover:text-text"
                }`}
              >
                {topic.name} ({topic.count})
              </span>
            </label>
          );
        })}
      </div>
    </aside>
  );
}
