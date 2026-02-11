"use client";

import { useState } from "react";
import {
  HomeSection,
  IllustrationId,
  illustrationOptions,
} from "@/lib/site-content-types";

interface Props {
  initialSections: HomeSection[];
}

export function HomeContentEditor({ initialSections }: Props) {
  const [sections, setSections] = useState<HomeSection[]>(initialSections);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleTextChange = (id: string, text: string) => {
    setSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, text } : s))
    );
  };

  const handleTitleChange = (id: string, title: string) => {
    setSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, title } : s))
    );
  };

  const handleIllustrationChange = (id: string, illustration: IllustrationId) => {
    setSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, illustration } : s))
    );
  };

  const handleClosingToggle = (id: string, isClosing: boolean) => {
    setSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isClosing } : s))
    );
  };

  const moveSection = (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= sections.length) return;

    const newSections = [...sections];
    [newSections[index], newSections[newIndex]] = [
      newSections[newIndex],
      newSections[index],
    ];
    setSections(newSections);
  };

  const addSection = () => {
    const newSection: HomeSection = {
      id: `section-${Date.now()}`,
      title: "New Section",
      text: "",
      illustration: "none",
    };
    setSections([...sections, newSection]);
  };

  const removeSection = (id: string) => {
    if (sections.length <= 1) return;
    setSections(sections.filter((s) => s.id !== id));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);

    try {
      const response = await fetch("/api/cms/home", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sections }),
      });

      if (response.ok) {
        setMessage({ type: "success", text: "Content saved successfully!" });
      } else {
        setMessage({
          type: "error",
          text: "Failed to save content. Please try again.",
        });
      }
    } catch (error) {
      setMessage({ type: "error", text: "An error occurred. Please try again." });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {sections.map((section, index) => (
        <div
          key={section.id}
          className="border border-border rounded-lg p-6 bg-bg-subtle/30"
        >
          {/* Section header */}
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex-1">
              <input
                type="text"
                value={section.title}
                onChange={(e) => handleTitleChange(section.id, e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-md bg-bg text-text font-serif text-lg font-medium focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                placeholder="Section title..."
              />
            </div>

            {/* Move & delete buttons */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => moveSection(index, "up")}
                disabled={index === 0}
                className="p-2 text-text-secondary hover:text-text hover:bg-bg-subtle rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                title="Move up"
              >
                ↑
              </button>
              <button
                type="button"
                onClick={() => moveSection(index, "down")}
                disabled={index === sections.length - 1}
                className="p-2 text-text-secondary hover:text-text hover:bg-bg-subtle rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                title="Move down"
              >
                ↓
              </button>
              <button
                type="button"
                onClick={() => removeSection(section.id)}
                disabled={sections.length <= 1}
                className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                title="Remove section"
              >
                ×
              </button>
            </div>
          </div>

          {/* Text content */}
          <textarea
            value={section.text}
            onChange={(e) => handleTextChange(section.id, e.target.value)}
            rows={4}
            className="w-full px-4 py-3 border border-border rounded-lg bg-bg text-text font-serif text-base leading-relaxed focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent resize-y mb-4"
            placeholder="Section content..."
          />

          {/* Options row */}
          <div className="flex flex-wrap items-center gap-4">
            {/* Illustration selector */}
            <div className="flex items-center gap-2">
              <label className="font-mono text-xs text-text-secondary uppercase tracking-wider">
                Illustration:
              </label>
              <select
                value={section.illustration}
                onChange={(e) =>
                  handleIllustrationChange(
                    section.id,
                    e.target.value as IllustrationId
                  )
                }
                className="px-3 py-1.5 border border-border rounded-md bg-bg text-text font-mono text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              >
                {illustrationOptions.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Closing style toggle */}
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={section.isClosing || false}
                onChange={(e) =>
                  handleClosingToggle(section.id, e.target.checked)
                }
                className="w-4 h-4 rounded border-border text-accent focus:ring-accent"
              />
              <span className="font-mono text-xs text-text-secondary uppercase tracking-wider">
                Italic style (closing)
              </span>
            </label>
          </div>
        </div>
      ))}

      {/* Add section button */}
      <button
        type="button"
        onClick={addSection}
        className="w-full py-3 border-2 border-dashed border-border rounded-lg text-text-secondary hover:text-accent hover:border-accent transition-colors font-mono text-sm uppercase tracking-wider"
      >
        + Add Section
      </button>

      {/* Messages */}
      {message && (
        <div
          className={`p-4 rounded-lg font-mono text-sm ${
            message.type === "success"
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-4 pt-4">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-3 bg-text text-bg font-mono text-sm uppercase tracking-wider rounded-md hover:bg-text/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-xs text-text-secondary hover:text-accent transition-colors"
        >
          Preview Home Page →
        </a>
      </div>
    </div>
  );
}
