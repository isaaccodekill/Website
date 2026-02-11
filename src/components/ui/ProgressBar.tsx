"use client";

import { useEffect, useState, useCallback } from "react";

interface Section {
  id: string;
  title: string;
  offsetTop: number;
}

interface ProgressBarProps {
  contentRef: React.RefObject<HTMLElement | null>;
}

export function ProgressBar({ contentRef }: ProgressBarProps) {
  const [progress, setProgress] = useState(0);
  const [sections, setSections] = useState<Section[]>([]);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);

  // Extract sections from h2 headings
  useEffect(() => {
    if (!contentRef.current) return;

    const headings = contentRef.current.querySelectorAll("h2");
    const newSections: Section[] = Array.from(headings).map((heading) => ({
      id:
        heading.id ||
        heading.textContent?.toLowerCase().replace(/\s+/g, "-") ||
        "",
      title: heading.textContent || "",
      offsetTop: heading.offsetTop,
    }));

    headings.forEach((heading, index) => {
      if (!heading.id) {
        heading.id = newSections[index].id;
      }
    });

    setSections(newSections);
  }, [contentRef]);

  // Track scroll progress
  useEffect(() => {
    const handleScroll = () => {
      if (!contentRef.current) return;

      const content = contentRef.current;
      const windowHeight = window.innerHeight;
      const scrollTop = window.scrollY;
      const contentTop = content.offsetTop;
      const contentHeight = content.offsetHeight;

      const scrolled = scrollTop - contentTop + windowHeight * 0.3;
      const total = contentHeight - windowHeight * 0.5;
      const newProgress = Math.max(0, Math.min(100, (scrolled / total) * 100));

      setProgress(newProgress);

      const scrollPosition = scrollTop + windowHeight * 0.3;
      let currentSection: string | null = null;

      for (let i = sections.length - 1; i >= 0; i--) {
        if (scrollPosition >= sections[i].offsetTop + contentTop) {
          currentSection = sections[i].id;
          break;
        }
      }

      setActiveSection(currentSection);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [contentRef, sections]);

  const scrollToSection = useCallback((sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 100;
      const top = element.offsetTop - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  }, []);

  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) =>
      setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  // Calculate the total height and where each section dot should be
  const totalHeight = 320; // Total height of the progress bar track
  const dotSize = 8;
  const getYPosition = (index: number) => {
    if (sections.length === 1) return 0;
    return (index / (sections.length - 1)) * (totalHeight - dotSize);
  };

  // Calculate how much of the track should be filled based on scroll progress
  const fillHeight = (progress / 100) * totalHeight;

  // Simple progress-only bar when no sections exist
  if (sections.length === 0) {
    return (
      <div className="relative flex items-start">
        <div className="relative" style={{ height: totalHeight, width: dotSize }}>
          {/* Background track line */}
          <div
            className="absolute bg-border"
            style={{
              left: (dotSize - 1) / 2,
              top: dotSize / 2,
              width: 1,
              height: totalHeight - dotSize,
            }}
          />

          {/* Filled track line */}
          <div
            className="absolute bg-accent origin-top"
            style={{
              left: (dotSize - 1) / 2,
              top: dotSize / 2,
              width: 1,
              height: Math.max(0, fillHeight - dotSize),
              transition: prefersReducedMotion
                ? "none"
                : "height 400ms cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          />
        </div>

        {/* Progress percentage */}
        <div
          className="absolute font-mono text-[0.5625rem] text-text-tertiary tabular-nums"
          style={{ top: totalHeight + 12, right: 0 }}
        >
          {Math.round(progress)}%
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex items-start">
      {/* Labels container - positioned to the left */}
      <div className="relative mr-4" style={{ height: totalHeight }}>
        {sections.map((section, index) => {
          const isActive = activeSection === section.id;
          const isHovered = hoveredSection === section.id;
          const yPos = getYPosition(index);

          return (
            <div
              key={`label-${section.id}`}
              className="absolute right-0 flex items-center"
              style={{ top: yPos, height: dotSize }}
            >
              <span
                className={`font-mono text-[0.625rem] tracking-wide uppercase whitespace-nowrap transition-all duration-300 ${
                  isHovered || isActive
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 translate-x-2 pointer-events-none"
                } ${isActive ? "text-accent" : "text-text-secondary"}`}
                style={{
                  maxWidth: "140px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {section.title}
              </span>
            </div>
          );
        })}
      </div>

      {/* Track and dots container */}
      <div className="relative" style={{ height: totalHeight, width: dotSize }}>
        {/* Background track line */}
        <div
          className="absolute bg-border"
          style={{
            left: (dotSize - 1) / 2,
            top: dotSize / 2,
            width: 1,
            height: totalHeight - dotSize,
          }}
        />

        {/* Filled track line - liquid animation */}
        <div
          className="absolute bg-accent origin-top"
          style={{
            left: (dotSize - 1) / 2,
            top: dotSize / 2,
            width: 1,
            height: Math.max(0, fillHeight - dotSize),
            transition: prefersReducedMotion
              ? "none"
              : "height 400ms cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        />

        {/* Section dots */}
        {sections.map((section, index) => {
          const isActive = activeSection === section.id;
          const yPos = getYPosition(index);
          const sectionProgress = (index / (sections.length - 1)) * 100;
          const isPassed = progress >= sectionProgress;

          return (
            <button
              key={section.id}
              onClick={() => scrollToSection(section.id)}
              onMouseEnter={() => setHoveredSection(section.id)}
              onMouseLeave={() => setHoveredSection(null)}
              className="absolute left-0 group"
              style={{ top: yPos }}
              aria-label={section.title}
            >
              {/* Dot */}
              <div
                className={`rounded-full transition-all duration-300 ${
                  isActive
                    ? "bg-accent scale-125"
                    : isPassed
                      ? "bg-accent"
                      : "bg-border group-hover:bg-text-tertiary"
                }`}
                style={{ width: dotSize, height: dotSize }}
              />
            </button>
          );
        })}
      </div>

      {/* Progress percentage */}
      <div
        className="absolute font-mono text-[0.5625rem] text-text-tertiary tabular-nums"
        style={{ top: totalHeight + 12, right: 0 }}
      >
        {Math.round(progress)}%
      </div>
    </div>
  );
}
