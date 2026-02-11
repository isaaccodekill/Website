"use client";

import Image from "next/image";
import { FadeInStagger, FadeInStaggerItem } from "@/components/ui/FadeIn";

export interface Track {
  name: string;
  artist: string;
  albumArt?: string;
}

interface TrackListProps {
  tracks: Track[];
}

export function TrackList({ tracks }: TrackListProps) {
  if (tracks.length === 0) return null;

  return (
    <FadeInStagger staggerDelay={0.05}>
      <div className="space-y-3">
        {tracks.map((track, index) => (
          <FadeInStaggerItem key={`${track.name}-${index}`}>
            <div className="flex items-center gap-3 group">
              {track.albumArt && (
                <div className="relative w-10 h-10 rounded overflow-hidden flex-shrink-0 border border-border">
                  <Image
                    src={track.albumArt}
                    alt={`${track.name} album art`}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="font-serif text-text truncate group-hover:text-accent transition-colors duration-200">
                  {track.name}
                </p>
                <p className="font-mono text-xs text-text-tertiary truncate">
                  {track.artist}
                </p>
              </div>
            </div>
          </FadeInStaggerItem>
        ))}
      </div>
    </FadeInStagger>
  );
}
