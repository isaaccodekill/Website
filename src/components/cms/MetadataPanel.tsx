"use client";

import { useState } from "react";

interface MetadataPanelProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  onTitleChange: (title: string) => void;
  slug: string;
  onSlugChange: (slug: string) => void;
  excerpt: string;
  onExcerptChange: (excerpt: string) => void;
  topics: string[];
  onTopicsChange: (topics: string[]) => void;
  status: "draft" | "published";
  onStatusChange: (status: "draft" | "published") => void;
}

export function MetadataPanel({
  isOpen,
  onClose,
  title,
  onTitleChange,
  slug,
  onSlugChange,
  excerpt,
  onExcerptChange,
  topics,
  onTopicsChange,
  status,
  onStatusChange,
}: MetadataPanelProps) {
  const [newTopic, setNewTopic] = useState("");

  const addTopic = () => {
    if (newTopic.trim() && !topics.includes(newTopic.trim().toLowerCase())) {
      onTopicsChange([...topics, newTopic.trim().toLowerCase()]);
      setNewTopic("");
    }
  };

  const removeTopic = (topic: string) => {
    onTopicsChange(topics.filter((t) => t !== topic));
  };

  const generateSlug = () => {
    const generatedSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
    onSlugChange(generatedSlug);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/20 z-40"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed right-0 top-0 bottom-0 w-96 bg-bg border-l border-border shadow-xl z-50 overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-mono text-[0.6875rem] tracking-[0.08em] uppercase text-text-secondary">
              / Metadata
            </h2>
            <button
              onClick={onClose}
              className="text-text-tertiary hover:text-text transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="space-y-6">
            {/* Title */}
            <div>
              <label className="block font-mono text-[0.625rem] uppercase tracking-wider text-text-tertiary mb-2">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => onTitleChange(e.target.value)}
                className="w-full px-3 py-2 bg-bg-subtle border border-border rounded-md font-serif text-text focus:outline-none focus:border-accent"
                placeholder="Post title"
              />
            </div>

            {/* Slug */}
            <div>
              <label className="block font-mono text-[0.625rem] uppercase tracking-wider text-text-tertiary mb-2">
                Slug
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => onSlugChange(e.target.value)}
                  className="flex-1 px-3 py-2 bg-bg-subtle border border-border rounded-md font-mono text-sm text-text focus:outline-none focus:border-accent"
                  placeholder="post-slug"
                />
                <button
                  type="button"
                  onClick={generateSlug}
                  className="px-3 py-2 bg-bg-subtle border border-border rounded-md font-mono text-xs text-text-secondary hover:text-accent hover:border-accent transition-colors"
                >
                  Auto
                </button>
              </div>
            </div>

            {/* Excerpt */}
            <div>
              <label className="block font-mono text-[0.625rem] uppercase tracking-wider text-text-tertiary mb-2">
                Excerpt
              </label>
              <textarea
                value={excerpt}
                onChange={(e) => onExcerptChange(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 bg-bg-subtle border border-border rounded-md font-serif text-sm text-text focus:outline-none focus:border-accent resize-none"
                placeholder="Brief description for SEO..."
              />
            </div>

            {/* Topics */}
            <div>
              <label className="block font-mono text-[0.625rem] uppercase tracking-wider text-text-tertiary mb-2">
                Topics
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {topics.map((topic) => (
                  <span
                    key={topic}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-bg-subtle border border-border rounded font-mono text-xs text-text-secondary"
                  >
                    {topic}
                    <button
                      type="button"
                      onClick={() => removeTopic(topic)}
                      className="text-text-tertiary hover:text-accent"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTopic}
                  onChange={(e) => setNewTopic(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addTopic();
                    }
                  }}
                  className="flex-1 px-3 py-2 bg-bg-subtle border border-border rounded-md font-mono text-xs text-text focus:outline-none focus:border-accent"
                  placeholder="Add topic..."
                />
                <button
                  type="button"
                  onClick={addTopic}
                  className="px-3 py-2 bg-bg-subtle border border-border rounded-md font-mono text-xs text-text-secondary hover:text-accent hover:border-accent transition-colors"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="block font-mono text-[0.625rem] uppercase tracking-wider text-text-tertiary mb-2">
                Status
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => onStatusChange("draft")}
                  className={`flex-1 px-3 py-2 rounded-md font-mono text-xs transition-colors ${
                    status === "draft"
                      ? "bg-amber-100 text-amber-700 border border-amber-300"
                      : "bg-bg-subtle border border-border text-text-secondary hover:border-amber-300"
                  }`}
                >
                  Draft
                </button>
                <button
                  type="button"
                  onClick={() => onStatusChange("published")}
                  className={`flex-1 px-3 py-2 rounded-md font-mono text-xs transition-colors ${
                    status === "published"
                      ? "bg-green-100 text-green-700 border border-green-300"
                      : "bg-bg-subtle border border-border text-text-secondary hover:border-green-300"
                  }`}
                >
                  Published
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
