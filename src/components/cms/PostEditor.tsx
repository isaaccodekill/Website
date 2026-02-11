"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Editor } from "./Editor";
import { MetadataPanel } from "./MetadataPanel";
import { useToast } from "@/components/ui/Toast";

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  topics: string[];
  status: "draft" | "published";
  tiptapJson: unknown;
  createdAt: Date | string;
  updatedAt: Date | string;
  publishedAt: Date | string | null;
}

interface PostEditorProps {
  post: Post;
}

export function PostEditor({ post: initialPost }: PostEditorProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [post, setPost] = useState(initialPost);
  const [content, setContent] = useState(() => {
    if (!initialPost.tiptapJson) return "{}";
    if (typeof initialPost.tiptapJson === "string") return initialPost.tiptapJson;
    return JSON.stringify(initialPost.tiptapJson);
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isMetadataOpen, setIsMetadataOpen] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Autosave
  const save = useCallback(async () => {
    if (isSaving) return;

    setIsSaving(true);
    try {
      const response = await fetch(`/api/posts/${post.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          topics: post.topics,
          status: post.status,
          tiptap_json: content,
        }),
      });

      if (response.ok) {
        setLastSaved(new Date());
        setHasUnsavedChanges(false);
      }
    } catch (error) {
      console.error("Error saving post:", error);
    } finally {
      setIsSaving(false);
    }
  }, [post, content, isSaving]);

  // Debounced autosave
  useEffect(() => {
    if (!hasUnsavedChanges) return;

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      save();
    }, 3000); // Save after 3 seconds of inactivity

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [hasUnsavedChanges, save]);

  // Mark as changed
  const handleContentChange = useCallback((newContent: string) => {
    setContent(newContent);
    setHasUnsavedChanges(true);
  }, []);

  const handleMetadataChange = useCallback(
    (field: string, value: any) => {
      setPost((prev) => ({ ...prev, [field]: value }));
      setHasUnsavedChanges(true);
    },
    []
  );

  // Publish
  const publish = useCallback(async () => {
    // Validate
    if (!post.title.trim()) {
      toast("Please add a title before publishing", "error");
      setIsMetadataOpen(true);
      return;
    }

    if (!post.slug.trim()) {
      toast("Please add a slug before publishing", "error");
      setIsMetadataOpen(true);
      return;
    }

    setIsPublishing(true);
    try {
      // First save
      await save();

      // Then publish
      const response = await fetch(`/api/posts/${post.id}/publish`, {
        method: "POST",
      });

      if (response.ok) {
        setPost((prev) => ({ ...prev, status: "published" }));
        toast("Post published successfully!", "success");
        router.refresh();
      } else {
        const error = await response.json();
        toast(`Failed to publish: ${error.error}`, "error");
      }
    } catch (error) {
      console.error("Error publishing:", error);
      toast("Failed to publish post", "error");
    } finally {
      setIsPublishing(false);
    }
  }, [post, save, router, toast]);

  // Delete
  const deletePost = useCallback(async () => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    try {
      const response = await fetch(`/api/posts/${post.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast("Post deleted", "info");
        router.push("/cms/posts");
      } else {
        toast("Failed to delete post", "error");
      }
    } catch (error) {
      console.error("Error deleting:", error);
      toast("Failed to delete post", "error");
    }
  }, [post.id, router, toast]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        save();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        publish();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "m") {
        e.preventDefault();
        setIsMetadataOpen((prev) => !prev);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [save, publish]);

  return (
    <div className="min-h-screen bg-bg">
      {/* Editor header */}
      <div className="sticky top-[57px] z-30 bg-bg border-b border-border">
        <div className="mx-auto max-w-4xl px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/cms/posts"
              className="font-mono text-xs text-text-tertiary hover:text-accent transition-colors"
            >
              &larr; Back
            </Link>
            <div className="flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full ${
                  hasUnsavedChanges ? "bg-amber-400" : "bg-green-400"
                }`}
              />
              <span className="font-mono text-[0.625rem] text-text-tertiary uppercase tracking-wider">
                {isSaving
                  ? "Saving..."
                  : hasUnsavedChanges
                    ? "Unsaved"
                    : lastSaved
                      ? `Saved ${lastSaved.toLocaleTimeString()}`
                      : "Saved"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMetadataOpen(true)}
              className="px-3 py-1.5 border border-border rounded font-mono text-xs text-text-secondary hover:text-accent hover:border-accent transition-colors"
            >
              Metadata
            </button>
            <button
              onClick={save}
              disabled={isSaving}
              className="px-3 py-1.5 border border-border rounded font-mono text-xs text-text-secondary hover:text-accent hover:border-accent transition-colors disabled:opacity-50"
            >
              Save
            </button>
            <button
              onClick={publish}
              disabled={isPublishing}
              className="px-3 py-1.5 bg-accent text-white rounded font-mono text-xs hover:bg-accent-hover transition-colors disabled:opacity-50"
            >
              {isPublishing ? "Publishing..." : "Publish"}
            </button>
            <button
              onClick={deletePost}
              className="px-3 py-1.5 border border-red-300 text-red-600 rounded font-mono text-xs hover:bg-red-50 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Title input */}
      <div className="mx-auto max-w-3xl px-6 pt-8">
        <input
          type="text"
          value={post.title}
          onChange={(e) => handleMetadataChange("title", e.target.value)}
          placeholder="Post title..."
          className="w-full font-serif text-3xl font-semibold text-text bg-transparent border-none focus:outline-none placeholder:text-text-tertiary"
        />
      </div>

      {/* Editor */}
      <div className="mx-auto max-w-3xl">
        <Editor content={content} onChange={handleContentChange} onSave={save} />
      </div>

      {/* Metadata panel */}
      <MetadataPanel
        isOpen={isMetadataOpen}
        onClose={() => setIsMetadataOpen(false)}
        title={post.title}
        onTitleChange={(v) => handleMetadataChange("title", v)}
        slug={post.slug}
        onSlugChange={(v) => handleMetadataChange("slug", v)}
        excerpt={post.excerpt}
        onExcerptChange={(v) => handleMetadataChange("excerpt", v)}
        topics={post.topics}
        onTopicsChange={(v) => handleMetadataChange("topics", v)}
        status={post.status}
        onStatusChange={(v) => handleMetadataChange("status", v)}
      />

      {/* Keyboard shortcuts hint */}
      <div className="fixed bottom-4 right-4 font-mono text-[0.625rem] text-text-tertiary space-x-4">
        <span>⌘S Save</span>
        <span>⌘M Metadata</span>
        <span>⌘↵ Publish</span>
      </div>
    </div>
  );
}
