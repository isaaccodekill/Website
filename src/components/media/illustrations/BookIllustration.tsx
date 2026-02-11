"use client";

import { useEffect, useState } from "react";

export function BookIllustration({ className = "" }: { className?: string }) {
  const [pageFlip, setPageFlip] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPageFlip((p) => (p + 1) % 100);
    }, 60);
    return () => clearInterval(interval);
  }, []);

  // Page turn animation - smooth sine wave
  const flipProgress = (pageFlip % 50) / 50;
  const isFlipping = pageFlip < 50;
  const pageRotation = isFlipping ? flipProgress * 180 : 0;
  const pageScaleX = Math.abs(Math.cos((pageRotation * Math.PI) / 180));

  return (
    <svg
      viewBox="0 0 100 80"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      {/* Book cover - back */}
      <rect
        x="10"
        y="8"
        width="80"
        height="56"
        rx="2"
        stroke="currentColor"
        strokeWidth="2"
        fill="currentColor"
        fillOpacity="0.03"
      />

      {/* Spine */}
      <line
        x1="50"
        y1="8"
        x2="50"
        y2="64"
        stroke="currentColor"
        strokeWidth="2"
      />

      {/* Left page */}
      <rect
        x="14"
        y="12"
        width="33"
        height="48"
        fill="currentColor"
        fillOpacity="0.06"
      />

      {/* Left page text lines */}
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
        <line
          key={`l-${i}`}
          x1="18"
          y1={18 + i * 5}
          x2="43"
          y2={18 + i * 5}
          stroke="currentColor"
          strokeOpacity="0.2"
          strokeWidth="1"
        />
      ))}

      {/* Right page */}
      <rect
        x="53"
        y="12"
        width="33"
        height="48"
        fill="currentColor"
        fillOpacity="0.06"
      />

      {/* Right page text lines */}
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
        <line
          key={`r-${i}`}
          x1="57"
          y1={18 + i * 5}
          x2="82"
          y2={18 + i * 5}
          stroke="currentColor"
          strokeOpacity="0.2"
          strokeWidth="1"
        />
      ))}

      {/* Turning page */}
      {isFlipping && (
        <g style={{ transformOrigin: "50px 36px" }}>
          <rect
            x={50}
            y="12"
            width={33 * pageScaleX}
            height="48"
            fill="currentColor"
            fillOpacity={0.1 + pageScaleX * 0.1}
            stroke="currentColor"
            strokeWidth="0.5"
            strokeOpacity={0.3}
          />
          {/* Page shadow */}
          <ellipse
            cx="50"
            cy="62"
            rx={10 * (1 - pageScaleX)}
            ry="2"
            fill="currentColor"
            fillOpacity={0.1 * (1 - pageScaleX)}
          />
        </g>
      )}

      {/* Bookmark */}
      <path
        d="M65 8 L65 70 L68 66 L71 70 L71 8"
        fill="currentColor"
        fillOpacity="0.25"
        stroke="currentColor"
        strokeWidth="0.5"
        strokeOpacity="0.3"
      />

      {/* Label */}
      <text
        x="50"
        y="76"
        textAnchor="middle"
        fontSize="5"
        fontFamily="monospace"
        fill="currentColor"
        fillOpacity="0.5"
        letterSpacing="0.1em"
      >
        FIG.02
      </text>
    </svg>
  );
}
