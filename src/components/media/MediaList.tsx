"use client";

import { FadeInStagger, FadeInStaggerItem } from "@/components/ui/FadeIn";

export interface MediaItem {
  title: string;
  type: "book" | "film" | "podcast" | "article" | "show";
  note?: string;
  url?: string;
}

interface MediaListProps {
  items: MediaItem[];
}

const typeStyles: Record<string, string> = {
  book: "bg-blue-50 text-blue-700",
  film: "bg-purple-50 text-purple-700",
  podcast: "bg-green-50 text-green-700",
  article: "bg-amber-50 text-amber-700",
  show: "bg-pink-50 text-pink-700",
};

export function MediaList({ items }: MediaListProps) {
  if (items.length === 0) return null;

  return (
    <FadeInStagger staggerDelay={0.05}>
      <div className="space-y-3">
        {items.map((item, index) => (
          <FadeInStaggerItem key={`${item.title}-${index}`}>
            <div className="group">
              <div className="flex items-baseline gap-3">
                {item.url ? (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-serif text-text hover:text-accent transition-colors duration-200"
                  >
                    {item.title}
                  </a>
                ) : (
                  <span className="font-serif text-text">{item.title}</span>
                )}
                <span
                  className={`font-mono text-[0.625rem] tracking-wider uppercase px-1.5 py-0.5 rounded ${
                    typeStyles[item.type] || "bg-bg-subtle text-text-tertiary"
                  }`}
                >
                  {item.type}
                </span>
              </div>
              {item.note && (
                <p className="mt-1 font-serif text-sm text-text-secondary italic">
                  {item.note}
                </p>
              )}
            </div>
          </FadeInStaggerItem>
        ))}
      </div>
    </FadeInStagger>
  );
}
