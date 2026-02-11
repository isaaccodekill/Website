"use client";

import { useEffect, useState } from "react";

export function VinylIllustration({ className = "" }: { className?: string }) {
  const [time, setTime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((t) => t + 1);
    }, 20);
    return () => clearInterval(interval);
  }, []);

  const rotation = (time * 0.8) % 360;

  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      {/* Turntable base */}
      <rect
        x="5"
        y="5"
        width="90"
        height="90"
        rx="4"
        fill="currentColor"
        fillOpacity="0.04"
        stroke="currentColor"
        strokeWidth="1.2"
      />

      {/* Platter rim */}
      <circle
        cx="50"
        cy="50"
        r="40"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeOpacity="0.5"
      />

      {/* Vinyl record - rotates */}
      <g
        style={{
          transformOrigin: "50px 50px",
          transform: `rotate(${rotation}deg)`,
        }}
      >
        {/* Record outer edge */}
        <circle
          cx="50"
          cy="50"
          r="38"
          fill="currentColor"
          fillOpacity="0.06"
          stroke="currentColor"
          strokeWidth="1"
        />

        {/* Grooves */}
        {[34, 30, 26, 22, 18].map((r) => (
          <circle
            key={r}
            cx="50"
            cy="50"
            r={r}
            stroke="currentColor"
            strokeOpacity="0.2"
            strokeWidth="0.6"
            fill="none"
          />
        ))}

        {/* Label circle */}
        <circle
          cx="50"
          cy="50"
          r="12"
          fill="currentColor"
          fillOpacity="0.08"
          stroke="currentColor"
          strokeWidth="0.8"
        />

        {/* Center spindle hole */}
        <circle
          cx="50"
          cy="50"
          r="3"
          fill="currentColor"
          fillOpacity="0.15"
          stroke="currentColor"
          strokeWidth="0.6"
        />

        {/* Light reflection */}
        <path
          d="M28 42 Q40 30 58 36"
          stroke="currentColor"
          strokeOpacity={0.1 + Math.sin(time * 0.015) * 0.05}
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
        />
      </g>

      {/* Tonearm pivot base */}
      <circle
        cx="85"
        cy="20"
        r="6"
        fill="currentColor"
        fillOpacity="0.06"
        stroke="currentColor"
        strokeWidth="0.8"
      />

      {/* Tonearm */}
      <line
        x1="85"
        y1="20"
        x2="60"
        y2="45"
        stroke="currentColor"
        strokeWidth="1.2"
      />

      {/* Headshell */}
      <path
        d="M60 45 L54 51 L52 49"
        stroke="currentColor"
        strokeWidth="1"
        fill="none"
      />

      {/* Cartridge */}
      <rect
        x="50"
        y="47"
        width="6"
        height="4"
        rx="1"
        fill="currentColor"
        fillOpacity="0.12"
        stroke="currentColor"
        strokeWidth="0.6"
        transform="rotate(-45 53 49)"
      />
    </svg>
  );
}
