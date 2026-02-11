"use client";

import { useEffect, useState } from "react";

export function CursorIcon() {
  const [time, setTime] = useState(0);
  const [charIndex, setCharIndex] = useState(0);

  const text = "Hello, World!";

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((t) => t + 1);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const typeInterval = setInterval(() => {
      setCharIndex((i) => (i >= text.length ? 0 : i + 1));
    }, 200);
    return () => clearInterval(typeInterval);
  }, []);

  const cursorOpacity = Math.sin(time * 0.3) > 0 ? 1 : 0.2;
  const displayText = text.slice(0, charIndex);

  return (
    <div className="flex flex-col items-center">
      <svg
        width="160"
        height="120"
        viewBox="0 0 160 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-accent"
      >
        {/* Terminal window outline */}
        <rect
          x="10"
          y="10"
          width="140"
          height="100"
          rx="6"
          stroke="currentColor"
          strokeWidth="1.5"
          fill="currentColor"
          fillOpacity="0.03"
        />
        {/* Terminal header bar */}
        <rect
          x="10"
          y="10"
          width="140"
          height="24"
          rx="6"
          stroke="currentColor"
          strokeWidth="1.5"
          fill="currentColor"
          fillOpacity="0.05"
        />
        <line
          x1="10"
          y1="34"
          x2="150"
          y2="34"
          stroke="currentColor"
          strokeWidth="1"
        />
        {/* Window dots */}
        <circle cx="26" cy="22" r="4" fill="currentColor" fillOpacity="0.4" />
        <circle cx="40" cy="22" r="4" fill="currentColor" fillOpacity="0.3" />
        <circle cx="54" cy="22" r="4" fill="currentColor" fillOpacity="0.2" />

        {/* Terminal title */}
        <text
          x="80"
          y="26"
          textAnchor="middle"
          fontSize="8"
          fill="currentColor"
          fillOpacity="0.5"
          fontFamily="monospace"
        >
          terminal
        </text>

        {/* Prompt line 1 */}
        <text
          x="20"
          y="52"
          fontSize="10"
          fill="currentColor"
          fillOpacity="0.6"
          fontFamily="monospace"
        >
          $ python main.py
        </text>

        {/* Output line */}
        <text
          x="20"
          y="72"
          fontSize="12"
          fill="currentColor"
          fontFamily="monospace"
          fontWeight="bold"
        >
          {displayText}
        </text>

        {/* Blinking cursor */}
        <rect
          x={20 + charIndex * 7.2}
          y="60"
          width="8"
          height="14"
          fill="currentColor"
          fillOpacity={cursorOpacity * 0.6}
        />

        {/* Prompt line 2 */}
        <text
          x="20"
          y="95"
          fontSize="10"
          fill="currentColor"
          fillOpacity="0.4"
          fontFamily="monospace"
        >
          $ _
        </text>
      </svg>
      <span className="text-xs text-text-tertiary mt-2 font-mono">FIG.01</span>
    </div>
  );
}
