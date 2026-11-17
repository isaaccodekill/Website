"use client";
import { useState, useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Editor } from "./Editor";
import { RichText, textOf } from "@/components/journal/RichText";
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
const prompts = [
  "What’s taking up space in my mind?",
  "What am I feeling, before I try to explain it?",
  "What do I know — and what am I assuming?",
  "What would I tell a friend in this situation?",
  "What am I beginning to understand?",
];
export function PostEditor({ post: initial }: { post: Post }) {
  const router = useRouter();
  const [post, setPost] = useState(initial);
  const [content, setContent] = useState(() =>
    typeof initial.tiptapJson === "string"
      ? initial.tiptapJson
      : JSON.stringify(
          initial.tiptapJson || {
            type: "doc",
            content: [{ type: "paragraph" }],
          },
        ),
  );
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState("");
  const [focus, setFocus] = useState(false);
  const [preview, setPreview] = useState(false);
  const [details, setDetails] = useState(false);
  const [review, setReview] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [prompt, setPrompt] = useState(-1);
  const current = useRef({ post, content });
  const version = useRef(0);
  const savedVersion = useRef(0);
  const queue = useRef<Promise<boolean> | null>(null);
  const payload = () => {
    const { post, content } = current.current;
    return {
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      topics: post.topics,
      tiptap_json: content,
    };
  };
  const changed = () => {
    version.current++;
    setDirty(true);
    setError("");
  };
  function field<K extends keyof Post>(key: K, value: Post[K]) {
    current.current.post = { ...current.current.post, [key]: value };
    setPost(current.current.post);
    changed();
  }
  const save = useCallback(async (): Promise<boolean> => {
    if (current.current.post.status === "published") return false;
    if (queue.current) {
      const ok = await queue.current;
      if (!ok) return false;
    }
    if (savedVersion.current === version.current) return true;
    const task = (async () => {
      setSaving(true);
      setError("");
      try {
        while (savedVersion.current !== version.current) {
          const snapshot = version.current;
          const r = await fetch(`/api/posts/${current.current.post.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload()),
          });
          if (!r.ok)
            throw Error(
              r.status === 401
                ? "Your session ended. Keep this tab open and sign in again in another tab."
                : "Couldn’t save. Your words are still here — check your connection and retry.",
            );
          savedVersion.current = snapshot;
        }
        setDirty(false);
        setSaved(
          new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        );
        return true;
      } catch (e) {
        setError((e as Error).message);
        return false;
      } finally {
        setSaving(false);
      }
    })();
    queue.current = task;
    const result = await task;
    queue.current = null;
    return result;
  }, []);
  useEffect(() => {
    if (!dirty || post.status !== "draft" || error) return;
    const timer = setTimeout(() => void save(), 1500);
    return () => clearTimeout(timer);
  }, [dirty, post, content, error, save]);
  useEffect(() => {
    const leave = (e: BeforeUnloadEvent) => {
      if (version.current !== savedVersion.current) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    const key = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        if (current.current.post.status === "draft") void save();
        else {
          setReview(true);
          setPreview(true);
        }
      }
      if (e.key === "Escape") {
        setFocus(false);
        setReview(false);
      }
    };
    window.addEventListener("beforeunload", leave);
    window.addEventListener("keydown", key);
    return () => {
      window.removeEventListener("beforeunload", leave);
      window.removeEventListener("keydown", key);
    };
  }, [save]);
  async function back() {
    if (post.status === "draft") {
      if (!(await save())) return;
    } else if (
      dirty &&
      !window.confirm("Leave without publishing these changes?")
    )
      return;
    router.push("/cms/posts");
  }
  useEffect(() => {
    const navigate = async (e: MouseEvent) => {
      if (
        !dirty ||
        e.defaultPrevented ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey ||
        e.button !== 0
      )
        return;
      const a = (e.target as Element).closest("a");
      if (!a || a.target === "_blank" || a.origin !== location.origin) return;
      e.preventDefault();
      e.stopPropagation();
      if (current.current.post.status === "draft") {
        if (!(await save())) return;
      } else if (!window.confirm("Leave without publishing these changes?"))
        return;
      router.push(a.pathname + a.search + a.hash);
    };
    document.addEventListener("click", navigate, true);
    return () => document.removeEventListener("click", navigate, true);
  }, [dirty, save, router]);
  async function publish() {
    setPublishing(true);
    setError("");
    try {
      if (queue.current && !(await queue.current)) return;
      const r = await fetch(`/api/posts/${post.id}/publish`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload(), confirmPublish: true }),
      });
      const data = await r.json();
      if (!r.ok)
        throw Error(data.error || "Couldn’t publish. Your page is still here.");
      current.current.post = { ...current.current.post, status: "published" };
      setPost(current.current.post);
      savedVersion.current = version.current;
      setDirty(false);
      setReview(false);
      setSaved("Published");
      router.refresh();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setPublishing(false);
    }
  }
  function download() {
    const blob = new Blob([post.title + "\n\n" + textOf(JSON.parse(content))], {
      type: "text/plain",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = (post.slug || "my-page") + ".txt";
    a.click();
    URL.revokeObjectURL(url);
  }
  const words = textOf(JSON.parse(content))
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  return (
    <div className={`writing-desk ${focus ? "focus-mode" : ""}`}>
      <div className="editor-toolbar">
        <button onClick={back}>← notebook</button>
        <span className="save-state" role="status" aria-live="polite">
          {saving
            ? "Saving…"
            : error
              ? "Not saved"
              : dirty
                ? post.status === "draft"
                  ? "Waiting to save…"
                  : "Unpublished changes"
                : post.status === "draft"
                  ? `Private · ${saved ? "saved " + saved : "saved"}`
                  : "Published"}
        </span>
        <div className="editor-actions">
          <button aria-pressed={focus} onClick={() => setFocus(!focus)}>
            {focus ? "Exit focus" : "Focus"}
          </button>
          <button aria-pressed={preview} onClick={() => setPreview(!preview)}>
            {preview ? "Write" : "Read"}
          </button>
          <button onClick={() => setDetails(!details)} aria-expanded={details}>
            Details
          </button>
          <button
            className="ink-button"
            disabled={saving || publishing}
            onClick={() => {
              setReview(true);
              setPreview(true);
              setFocus(false);
            }}
          >
            Review & {post.status === "published" ? "update" : "publish"}
          </button>
        </div>
      </div>
      {error && (
        <div className="save-error" role="alert">
          {error} <button onClick={() => void save()}>Retry save</button>{" "}
          <button onClick={download}>Download a text copy</button>
        </div>
      )}
      {post.status === "published" && dirty && (
        <p className="editor-notice">
          Changes to this published page stay in this tab until you review and
          publish them. Download a copy before leaving.
        </p>
      )}
      <fieldset className="writing-page" disabled={publishing}>
        <p className="eyebrow">
          {preview
            ? "Reading preview · only you can see this"
            : post.status === "draft"
              ? "A private page. No need to make it perfect."
              : "A page you’ve shared"}
        </p>
        {preview ? (
          <h1>{post.title || "Untitled"}</h1>
        ) : (
          <input
            className="writing-title"
            aria-label="Page title"
            placeholder="Give this a name, if you like…"
            value={post.title}
            disabled={publishing}
            onChange={(e) => field("title", e.target.value)}
          />
        )}
        {!preview && words === 0 && (
          <div className="reflection-prompt">
            <button onClick={() => setPrompt((p) => (p + 1) % prompts.length)}>
              ✳ {prompt < 0 ? "Need a place to begin?" : "Another question"}
            </button>
            {prompt >= 0 && <p>{prompts[prompt]}</p>}
          </div>
        )}
        <div hidden={preview || publishing}>
          <Editor
            content={content}
            onChange={(value) => {
              current.current.content = value;
              setContent(value);
              changed();
            }}
          />
        </div>
        {(preview || publishing) && (
          <div className="prose reading-prose">
            <RichText document={content} />
          </div>
        )}
        <div className="page-footnote">
          <span>
            {words} {words === 1 ? "word" : "words"} ·{" "}
            {Math.max(1, Math.ceil(words / 200))} min read
          </span>
          <span>
            {preview
              ? "The same type and spacing your readers see"
              : "Select text to format · / for more · ⌘/Ctrl S to save"}
          </span>
        </div>
        {details && (
          <section className="page-details">
            <h2>A few details</h2>
            <label>
              Page address
              <input
                value={post.slug}
                onChange={(e) => field("slug", e.target.value)}
              />
            </label>
            <button
              onClick={() =>
                field(
                  "slug",
                  post.title
                    .toLowerCase()
                    .normalize("NFKD")
                    .replace(/[^a-z0-9\s-]/g, "")
                    .trim()
                    .replace(/[\s-]+/g, "-"),
                )
              }
            >
              Make from title
            </button>
            <label>
              A small introduction
              <textarea
                value={post.excerpt}
                onChange={(e) => field("excerpt", e.target.value)}
                placeholder="Optional. A sentence to welcome someone in."
              />
            </label>
            <label>
              Topics, separated by commas
              <input
                value={post.topics.join(", ")}
                onChange={(e) =>
                  field(
                    "topics",
                    e.target.value.split(",").map((x) => x.trim()),
                  )
                }
              />
            </label>
            <button onClick={download}>Download a text copy ↗</button>
          </section>
        )}
        {review && (
          <section className="publish-review" aria-label="Review publication">
            <p className="eyebrow">A deliberate little step</p>
            <h2>
              {post.status === "draft"
                ? "Ready to open this page?"
                : "Ready to share these changes?"}
            </h2>
            <p>
              {post.status === "draft"
                ? "Publishing makes this piece readable by anyone. Your other drafts stay private."
                : "This replaces the version people can currently read."}
            </p>
            <label>
              Title
              <input
                value={post.title}
                onChange={(e) => field("title", e.target.value)}
                disabled={publishing}
              />
            </label>
            <label>
              Page address
              <input
                value={post.slug}
                onChange={(e) => field("slug", e.target.value)}
                disabled={publishing}
              />
            </label>
            <div>
              <button
                className="ink-button"
                onClick={publish}
                disabled={publishing || !post.title.trim() || !post.slug.trim()}
              >
                {publishing ? "Publishing…" : "Yes, publish this page"}
              </button>
              <button onClick={() => setReview(false)} disabled={publishing}>
                Keep thinking
              </button>
            </div>
          </section>
        )}
      </fieldset>
    </div>
  );
}
