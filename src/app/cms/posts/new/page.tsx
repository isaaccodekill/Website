"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
export default function NewPost() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  async function create() {
    setBusy(true);
    setError("");
    try {
      const r = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "{}",
      });
      if (!r.ok)
        throw Error("Couldn’t open a page. Please sign in and try again.");
      const p = await r.json();
      router.replace(`/cms/posts/${p.id}`);
    } catch (e) {
      setError((e as Error).message);
      setBusy(false);
    }
  }
  return (
    <section className="studio-welcome">
      <p className="eyebrow">No need to have it figured out</p>
      <h1>Start anywhere.</h1>
      <p>
        A sentence, a question, a feeling. This page will be a private draft.
      </p>
      <button className="ink-button" disabled={busy} onClick={create}>
        {busy ? "Opening your page…" : "Open a blank page →"}
      </button>
      {error && <p role="alert">{error}</p>}
    </section>
  );
}
