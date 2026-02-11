"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/Toast";

interface Track {
  name: string;
  artist: string;
  albumArt?: string;
}

interface MediaItem {
  title: string;
  type: "book" | "film" | "podcast" | "article" | "show";
  note?: string;
  url?: string;
}

interface MediaEntry {
  id: string;
  weekStart: string;
  weekEnd: string;
  tracks: Track[];
  media: MediaItem[];
  publishedAt: string | null;
}

interface MediaFormProps {
  entry?: MediaEntry;
  isNew?: boolean;
}

export function MediaForm({ entry, isNew = false }: MediaFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  const [weekStart, setWeekStart] = useState(entry?.weekStart || "");
  const [weekEnd, setWeekEnd] = useState(entry?.weekEnd || "");
  const [tracks, setTracks] = useState<Track[]>(entry?.tracks || []);
  const [media, setMedia] = useState<MediaItem[]>(entry?.media || []);

  // Track management
  const addTrack = () => {
    setTracks([...tracks, { name: "", artist: "" }]);
  };

  const updateTrack = (index: number, field: keyof Track, value: string) => {
    const newTracks = [...tracks];
    newTracks[index] = { ...newTracks[index], [field]: value };
    setTracks(newTracks);
  };

  const removeTrack = (index: number) => {
    setTracks(tracks.filter((_, i) => i !== index));
  };

  const moveTrack = (index: number, direction: "up" | "down") => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === tracks.length - 1)
    ) {
      return;
    }
    const newTracks = [...tracks];
    const newIndex = direction === "up" ? index - 1 : index + 1;
    [newTracks[index], newTracks[newIndex]] = [
      newTracks[newIndex],
      newTracks[index],
    ];
    setTracks(newTracks);
  };

  // Media item management
  const addMediaItem = () => {
    setMedia([...media, { title: "", type: "book" }]);
  };

  const updateMediaItem = (
    index: number,
    field: keyof MediaItem,
    value: string
  ) => {
    const newMedia = [...media];
    newMedia[index] = { ...newMedia[index], [field]: value };
    setMedia(newMedia);
  };

  const removeMediaItem = (index: number) => {
    setMedia(media.filter((_, i) => i !== index));
  };

  // Save
  const save = useCallback(async () => {
    setIsSaving(true);
    try {
      const url = isNew ? "/api/media" : `/api/media/${entry?.id}`;
      const method = isNew ? "POST" : "PUT";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          weekStart,
          weekEnd,
          tracks: tracks.filter((t) => t.name.trim()),
          media: media.filter((m) => m.title.trim()),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        toast("Saved successfully", "success");
        if (isNew) {
          router.push(`/cms/media?id=${data.id}`);
        }
        router.refresh();
      }
    } catch (error) {
      console.error("Error saving:", error);
      toast("Failed to save", "error");
    } finally {
      setIsSaving(false);
    }
  }, [isNew, entry?.id, weekStart, weekEnd, tracks, media, router, toast]);

  // Publish
  const publish = useCallback(async () => {
    if (!weekStart || !weekEnd) {
      toast("Please set the week dates before publishing", "error");
      return;
    }

    setIsPublishing(true);
    try {
      // First save
      await save();

      // Then update with published_at
      const response = await fetch(`/api/media/${entry?.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          publishedAt: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        toast("Published successfully!", "success");
        router.refresh();
      }
    } catch (error) {
      console.error("Error publishing:", error);
      toast("Failed to publish", "error");
    } finally {
      setIsPublishing(false);
    }
  }, [save, entry?.id, weekStart, weekEnd, router, toast]);

  // Delete
  const deleteEntry = useCallback(async () => {
    if (!confirm("Are you sure you want to delete this entry?")) return;

    try {
      const response = await fetch(`/api/media/${entry?.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast("Entry deleted", "info");
        router.push("/cms/media");
      }
    } catch (error) {
      console.error("Error deleting:", error);
      toast("Failed to delete", "error");
    }
  }, [entry?.id, router, toast]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {entry?.publishedAt ? (
            <span className="font-mono text-[0.625rem] uppercase tracking-wider px-2 py-0.5 bg-green-100 text-green-700 rounded">
              Published
            </span>
          ) : (
            <span className="font-mono text-[0.625rem] uppercase tracking-wider px-2 py-0.5 bg-amber-100 text-amber-700 rounded">
              Draft
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={save}
            disabled={isSaving}
            className="px-3 py-1.5 border border-border rounded font-mono text-xs text-text-secondary hover:text-accent hover:border-accent transition-colors disabled:opacity-50"
          >
            {isSaving ? "Saving..." : "Save"}
          </button>
          {!isNew && (
            <>
              <button
                onClick={publish}
                disabled={isPublishing}
                className="px-3 py-1.5 bg-accent text-white rounded font-mono text-xs hover:bg-accent-hover transition-colors disabled:opacity-50"
              >
                {isPublishing ? "Publishing..." : "Publish"}
              </button>
              <button
                onClick={deleteEntry}
                className="px-3 py-1.5 border border-red-300 text-red-600 rounded font-mono text-xs hover:bg-red-50 transition-colors"
              >
                Delete
              </button>
            </>
          )}
        </div>
      </div>

      {/* Week dates */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block font-mono text-[0.625rem] uppercase tracking-wider text-text-tertiary mb-2">
            Week Start (Monday)
          </label>
          <input
            type="date"
            value={weekStart}
            onChange={(e) => setWeekStart(e.target.value)}
            className="w-full px-3 py-2 bg-bg-subtle border border-border rounded-md font-mono text-sm text-text focus:outline-none focus:border-accent"
          />
        </div>
        <div>
          <label className="block font-mono text-[0.625rem] uppercase tracking-wider text-text-tertiary mb-2">
            Week End (Sunday)
          </label>
          <input
            type="date"
            value={weekEnd}
            onChange={(e) => setWeekEnd(e.target.value)}
            className="w-full px-3 py-2 bg-bg-subtle border border-border rounded-md font-mono text-sm text-text focus:outline-none focus:border-accent"
          />
        </div>
      </div>

      {/* Tracks */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <label className="font-mono text-[0.6875rem] tracking-[0.08em] uppercase text-text-secondary">
            / Listening
          </label>
          <button
            onClick={addTrack}
            className="font-mono text-xs text-accent hover:text-accent-hover transition-colors"
          >
            + Add Track
          </button>
        </div>
        <div className="space-y-3">
          {tracks.map((track, index) => (
            <div
              key={index}
              className="flex items-start gap-2 p-3 bg-bg-subtle rounded-md"
            >
              <div className="flex flex-col gap-1">
                <button
                  onClick={() => moveTrack(index, "up")}
                  disabled={index === 0}
                  className="text-text-tertiary hover:text-text disabled:opacity-30 text-xs"
                >
                  ▲
                </button>
                <button
                  onClick={() => moveTrack(index, "down")}
                  disabled={index === tracks.length - 1}
                  className="text-text-tertiary hover:text-text disabled:opacity-30 text-xs"
                >
                  ▼
                </button>
              </div>
              <div className="flex-1 grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={track.name}
                  onChange={(e) => updateTrack(index, "name", e.target.value)}
                  placeholder="Track name"
                  className="px-2 py-1.5 bg-bg border border-border rounded font-serif text-sm text-text focus:outline-none focus:border-accent"
                />
                <input
                  type="text"
                  value={track.artist}
                  onChange={(e) => updateTrack(index, "artist", e.target.value)}
                  placeholder="Artist"
                  className="px-2 py-1.5 bg-bg border border-border rounded font-mono text-xs text-text-secondary focus:outline-none focus:border-accent"
                />
              </div>
              <button
                onClick={() => removeTrack(index)}
                className="text-text-tertiary hover:text-red-500 transition-colors"
              >
                ×
              </button>
            </div>
          ))}
          {tracks.length === 0 && (
            <p className="text-center py-4 font-mono text-xs text-text-tertiary">
              No tracks yet. Click "+ Add Track" to start.
            </p>
          )}
        </div>
      </div>

      {/* Media items */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <label className="font-mono text-[0.6875rem] tracking-[0.08em] uppercase text-text-secondary">
            / Watching & Reading
          </label>
          <button
            onClick={addMediaItem}
            className="font-mono text-xs text-accent hover:text-accent-hover transition-colors"
          >
            + Add Item
          </button>
        </div>
        <div className="space-y-3">
          {media.map((item, index) => (
            <div key={index} className="p-3 bg-bg-subtle rounded-md space-y-2">
              <div className="flex items-start gap-2">
                <div className="flex-1">
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) =>
                      updateMediaItem(index, "title", e.target.value)
                    }
                    placeholder="Title"
                    className="w-full px-2 py-1.5 bg-bg border border-border rounded font-serif text-sm text-text focus:outline-none focus:border-accent"
                  />
                </div>
                <select
                  value={item.type}
                  onChange={(e) =>
                    updateMediaItem(index, "type", e.target.value)
                  }
                  className="px-2 py-1.5 bg-bg border border-border rounded font-mono text-xs text-text focus:outline-none focus:border-accent"
                >
                  <option value="book">Book</option>
                  <option value="film">Film</option>
                  <option value="show">Show</option>
                  <option value="podcast">Podcast</option>
                  <option value="article">Article</option>
                </select>
                <button
                  onClick={() => removeMediaItem(index)}
                  className="text-text-tertiary hover:text-red-500 transition-colors"
                >
                  ×
                </button>
              </div>
              <input
                type="text"
                value={item.note || ""}
                onChange={(e) => updateMediaItem(index, "note", e.target.value)}
                placeholder="Note (optional)"
                className="w-full px-2 py-1.5 bg-bg border border-border rounded font-serif text-xs text-text-secondary focus:outline-none focus:border-accent"
              />
              <input
                type="url"
                value={item.url || ""}
                onChange={(e) => updateMediaItem(index, "url", e.target.value)}
                placeholder="URL (optional)"
                className="w-full px-2 py-1.5 bg-bg border border-border rounded font-mono text-xs text-text-tertiary focus:outline-none focus:border-accent"
              />
            </div>
          ))}
          {media.length === 0 && (
            <p className="text-center py-4 font-mono text-xs text-text-tertiary">
              No items yet. Click "+ Add Item" to start.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
