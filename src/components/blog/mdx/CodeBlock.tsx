"use client";

import { useEffect, useState } from "react";

interface CodeBlockProps {
  children: string;
  language?: string;
  filename?: string;
  showLineNumbers?: boolean;
}

export function CodeBlock({
  children,
  language = "text",
  filename,
  showLineNumbers = false,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(children);
    setCopied(true);
  };

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  // Add line numbers if requested
  const lines = children.trim().split("\n");
  const codeWithLineNumbers = showLineNumbers
    ? lines
        .map(
          (line, i) =>
            `<span class="line-number">${String(i + 1).padStart(3, " ")}</span>${line}`
        )
        .join("\n")
    : children;

  return (
    <div className="group relative my-6 rounded-md overflow-hidden border border-border bg-code-bg">
      {/* Header with filename and language */}
      {(filename || language !== "text") && (
        <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-bg-subtle">
          {filename && (
            <span className="font-mono text-xs text-text-secondary">
              {filename}
            </span>
          )}
          {!filename && language !== "text" && (
            <span className="font-mono text-xs text-text-tertiary uppercase">
              {language}
            </span>
          )}
          <button
            onClick={handleCopy}
            className="font-mono text-xs text-text-tertiary hover:text-accent transition-colors duration-200"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      )}

      {/* Code content */}
      <pre className="overflow-x-auto p-4">
        <code
          className={`font-mono text-sm leading-relaxed language-${language}`}
          style={{ fontFamily: "var(--font-mono)" }}
        >
          {codeWithLineNumbers}
        </code>
      </pre>

      {/* Copy button for blocks without header */}
      {!filename && language === "text" && (
        <button
          onClick={handleCopy}
          className="absolute top-2 right-2 font-mono text-xs text-text-tertiary hover:text-accent transition-colors duration-200 opacity-0 group-hover:opacity-100"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      )}

      <style jsx>{`
        .line-number {
          display: inline-block;
          width: 3ch;
          margin-right: 1.5ch;
          color: var(--text-tertiary);
          text-align: right;
          user-select: none;
        }
      `}</style>
    </div>
  );
}

// Server component for pre-highlighted code
interface HighlightedCodeBlockProps {
  html: string;
  filename?: string;
  language?: string;
}

export function HighlightedCodeBlock({
  html,
  filename,
  language,
}: HighlightedCodeBlockProps) {
  return (
    <div className="my-6 rounded-md overflow-hidden border border-border">
      {(filename || language) && (
        <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-bg-subtle">
          {filename && (
            <span className="font-mono text-xs text-text-secondary">
              {filename}
            </span>
          )}
          {!filename && language && (
            <span className="font-mono text-xs text-text-tertiary uppercase">
              {language}
            </span>
          )}
        </div>
      )}
      <div
        className="overflow-x-auto [&>pre]:p-4 [&>pre]:m-0 [&_code]:font-mono [&_code]:text-sm [&_code]:leading-relaxed"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
