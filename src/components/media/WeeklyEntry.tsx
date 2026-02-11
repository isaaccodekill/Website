"use client";

import { FadeIn } from "@/components/ui/FadeIn";
import { MonoLabel } from "@/components/ui/MonoLabel";
import { TrackList, type Track } from "./TrackList";
import { MediaList, type MediaItem } from "./MediaList";

interface WeeklyEntryProps {
  weekStart: string;
  weekEnd: string;
  tracks: Track[];
  media: MediaItem[];
}

function formatWeekDate(dateStr: string): string {
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}.${month}.${day}`;
}

export function WeeklyEntry({
  weekStart,
  weekEnd,
  tracks,
  media,
}: WeeklyEntryProps) {
  return (
    <section className="mb-12">
      {/* Week header */}
      <FadeIn>
        <div className="flex items-center gap-3 mb-6">
          <span className="font-mono text-sm text-text-secondary whitespace-nowrap">
            {formatWeekDate(weekStart)} — {formatWeekDate(weekEnd)}
          </span>
          <div className="flex-1 h-px bg-border" />
        </div>
      </FadeIn>

      {/* Listening section */}
      {tracks.length > 0 && (
        <div className="mb-8">
          <FadeIn>
            <MonoLabel className="mb-4 block">Listening</MonoLabel>
          </FadeIn>
          <TrackList tracks={tracks} />
        </div>
      )}

      {/* Watching & Reading section */}
      {media.length > 0 && (
        <div>
          <FadeIn>
            <MonoLabel className="mb-4 block">Watching & Reading</MonoLabel>
          </FadeIn>
          <MediaList items={media} />
        </div>
      )}
    </section>
  );
}
