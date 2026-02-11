"use client";

import { useEffect, useState } from "react";

export function TypewriterIllustration({
  className = "",
}: {
  className?: string;
}) {
  const [time, setTime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((t) => t + 1);
    }, 80);
    return () => clearInterval(interval);
  }, []);

  const lines = [
    "The code is poetry.",
    "Build what matters.",
    "Simplicity is the",
    "ultimate sophistication.",
  ];
  const totalCycleFrames = 400;
  const cycleFrame = time % totalCycleFrames;
  const currentLine = Math.floor(cycleFrame / 100) % 4;
  const frameInLine = cycleFrame % 100;
  const typingFrames = 60;
  const progress = Math.min(frameInLine / typingFrames, 1);
  const easedProgress = 1 - Math.pow(1 - progress, 2);
  const charsToShow = Math.floor(easedProgress * lines[currentLine].length);
  const displayText = lines[currentLine].slice(0, charsToShow);
  const paperOffset = currentLine * 9;
  const cursorOpacity = 0.5 + Math.sin(time * 0.25) * 0.2;

  return (
    <svg
      viewBox="0 0 200 240"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      {/* ===== PAPER ===== */}
      <g
        style={{
          transform: `translateY(-${paperOffset}px)`,
          transition: "transform 0.5s ease-out",
        }}
      >
        <path
          d="M45 8 L45 88 Q45 90 47 90 L153 90 Q155 90 155 88 L155 8 Q155 5 152 5 L48 5 Q45 5 45 8 Z"
          fill="currentColor"
          fillOpacity="0.03"
          stroke="currentColor"
          strokeWidth="1"
        />
        {/* Typed text - typewriter font - BOLDER */}
        {currentLine > 0 && (
          <text x="52" y="35" fontSize="8" fontFamily="'Courier New', Courier, monospace" fontWeight="600" letterSpacing="0.3" fill="currentColor" fillOpacity="0.4">
            {lines[0]}
          </text>
        )}
        {currentLine > 1 && (
          <text x="52" y="45" fontSize="8" fontFamily="'Courier New', Courier, monospace" fontWeight="600" letterSpacing="0.3" fill="currentColor" fillOpacity="0.4">
            {lines[1]}
          </text>
        )}
        {currentLine > 2 && (
          <text x="52" y="55" fontSize="8" fontFamily="'Courier New', Courier, monospace" fontWeight="600" letterSpacing="0.3" fill="currentColor" fillOpacity="0.4">
            {lines[2]}
          </text>
        )}
        <text x="52" y={35 + currentLine * 10} fontSize="8" fontFamily="'Courier New', Courier, monospace" fontWeight="600" letterSpacing="0.3" fill="currentColor" fillOpacity="0.7">
          {displayText}
        </text>
        <rect x={52 + charsToShow * 4.8} y={26 + currentLine * 10} width="2" height="12" fill="currentColor" fillOpacity={cursorOpacity} />
      </g>

      {/* ===== PAPER BAIL ROLLERS (left) ===== */}
      <g>
        <rect x="38" y="70" width="8" height="20" rx="2" fill="currentColor" fillOpacity="0.04" stroke="currentColor" strokeWidth="0.8" />
        <line x1="38" y1="75" x2="46" y2="75" stroke="currentColor" strokeWidth="0.5" />
        <line x1="38" y1="80" x2="46" y2="80" stroke="currentColor" strokeWidth="0.5" />
        <line x1="38" y1="85" x2="46" y2="85" stroke="currentColor" strokeWidth="0.5" />
      </g>
      {/* Paper bail rollers (right) */}
      <g>
        <rect x="154" y="70" width="8" height="20" rx="2" fill="currentColor" fillOpacity="0.04" stroke="currentColor" strokeWidth="0.8" />
        <line x1="154" y1="75" x2="162" y2="75" stroke="currentColor" strokeWidth="0.5" />
        <line x1="154" y1="80" x2="162" y2="80" stroke="currentColor" strokeWidth="0.5" />
        <line x1="154" y1="85" x2="162" y2="85" stroke="currentColor" strokeWidth="0.5" />
      </g>

      {/* ===== PLATEN KNOBS (ribbed cylinders) ===== */}
      {/* Left knob */}
      <g>
        <circle cx="25" cy="92" r="12" fill="currentColor" fillOpacity="0.05" stroke="currentColor" strokeWidth="1" />
        <circle cx="25" cy="92" r="8" fill="none" stroke="currentColor" strokeWidth="0.7" />
        <circle cx="25" cy="92" r="4" fill="none" stroke="currentColor" strokeWidth="0.5" />
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <line key={`lrib-${i}`} x1={25 + Math.cos((i * 60 * Math.PI) / 180) * 10} y1={92 + Math.sin((i * 60 * Math.PI) / 180) * 10} x2={25 + Math.cos((i * 60 * Math.PI) / 180) * 6} y2={92 + Math.sin((i * 60 * Math.PI) / 180) * 6} stroke="currentColor" strokeWidth="0.5" />
        ))}
      </g>
      {/* Right knob */}
      <g>
        <circle cx="175" cy="92" r="12" fill="currentColor" fillOpacity="0.05" stroke="currentColor" strokeWidth="1" />
        <circle cx="175" cy="92" r="8" fill="none" stroke="currentColor" strokeWidth="0.7" />
        <circle cx="175" cy="92" r="4" fill="none" stroke="currentColor" strokeWidth="0.5" />
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <line key={`rrib-${i}`} x1={175 + Math.cos((i * 60 * Math.PI) / 180) * 10} y1={92 + Math.sin((i * 60 * Math.PI) / 180) * 10} x2={175 + Math.cos((i * 60 * Math.PI) / 180) * 6} y2={92 + Math.sin((i * 60 * Math.PI) / 180) * 6} stroke="currentColor" strokeWidth="0.5" />
        ))}
      </g>

      {/* ===== DARK CARRIAGE BAR ===== */}
      <rect x="35" y="95" width="130" height="10" rx="1" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="0.8" />

      {/* ===== TYPE GUIDE / BASKET AREA ===== */}
      <path d="M50 105 Q100 120 150 105" fill="none" stroke="currentColor" strokeWidth="0.8" />
      <path d="M60 108 L100 118 L140 108" fill="none" stroke="currentColor" strokeWidth="0.6" />
      <rect x="95" y="112" width="10" height="8" fill="currentColor" fillOpacity="0.06" stroke="currentColor" strokeWidth="0.6" />
      <line x1="100" y1="112" x2="100" y2="120" stroke="currentColor" strokeWidth="0.5" />

      {/* ===== CARRIAGE RETURN LEVER (left) ===== */}
      <path d="M15 75 Q8 75 8 85 L8 105" stroke="currentColor" strokeWidth="0.8" fill="none" />
      <ellipse cx="15" cy="73" rx="6" ry="4" fill="currentColor" fillOpacity="0.05" stroke="currentColor" strokeWidth="0.8" />

      {/* ===== MAIN BODY - TOP PANEL ===== */}
      <path
        d="M25 122 L20 125 L20 145 L180 145 L180 125 L175 122 Z"
        fill="currentColor"
        fillOpacity="0.03"
        stroke="currentColor"
        strokeWidth="0.8"
      />
      <rect x="80" y="128" width="40" height="10" rx="1" fill="none" stroke="currentColor" strokeWidth="0.6" />
      <circle cx="35" cy="133" r="3" fill="none" stroke="currentColor" strokeWidth="0.5" />
      <circle cx="160" cy="133" r="2" fill="none" stroke="currentColor" strokeWidth="0.5" />
      <line x1="165" y1="131" x2="170" y2="131" stroke="currentColor" strokeWidth="0.5" />
      <line x1="165" y1="135" x2="170" y2="135" stroke="currentColor" strokeWidth="0.5" />

      {/* ===== MAIN BODY - SIDES (tapered) ===== */}
      <path
        d="M20 145 L15 230 Q15 235 25 235 L175 235 Q185 235 185 230 L180 145"
        fill="currentColor"
        fillOpacity="0.025"
        stroke="currentColor"
        strokeWidth="1"
      />

      {/* ===== KEYBOARD WELL (dark) ===== */}
      <path
        d="M28 152 L23 218 L177 218 L172 152 Z"
        fill="currentColor"
        fillOpacity="0.15"
        stroke="currentColor"
        strokeWidth="0.6"
      />

      {/* ===== KEYBOARD KEYS ===== */}
      {[...Array(12)].map((_, i) => {
        const x = 35 + i * 11;
        return (
          <g key={`r1-${i}`}>
            <rect x={x} y="158" width="9" height="11" rx="2" fill="currentColor" fillOpacity="0.03" stroke="currentColor" strokeWidth="0.6" />
            <rect x={x + 1} y="159" width="7" height="4" rx="1" fill="none" stroke="currentColor" strokeWidth="0.3" strokeOpacity="0.6" />
          </g>
        );
      })}
      {[...Array(11)].map((_, i) => {
        const x = 38 + i * 11;
        return (
          <g key={`r2-${i}`}>
            <rect x={x} y="172" width="9" height="11" rx="2" fill="currentColor" fillOpacity="0.03" stroke="currentColor" strokeWidth="0.6" />
            <rect x={x + 1} y="173" width="7" height="4" rx="1" fill="none" stroke="currentColor" strokeWidth="0.3" strokeOpacity="0.6" />
          </g>
        );
      })}
      {[...Array(10)].map((_, i) => {
        const x = 42 + i * 11;
        return (
          <g key={`r3-${i}`}>
            <rect x={x} y="186" width="9" height="11" rx="2" fill="currentColor" fillOpacity="0.03" stroke="currentColor" strokeWidth="0.6" />
            <rect x={x + 1} y="187" width="7" height="4" rx="1" fill="none" stroke="currentColor" strokeWidth="0.3" strokeOpacity="0.6" />
          </g>
        );
      })}
      {[...Array(8)].map((_, i) => {
        const x = 52 + i * 11;
        return (
          <g key={`r4-${i}`}>
            <rect x={x} y="200" width="9" height="11" rx="2" fill="currentColor" fillOpacity="0.03" stroke="currentColor" strokeWidth="0.6" />
            <rect x={x + 1} y="201" width="7" height="4" rx="1" fill="none" stroke="currentColor" strokeWidth="0.3" strokeOpacity="0.6" />
          </g>
        );
      })}

      {/* ===== SPACE BAR ===== */}
      <rect x="55" y="214" width="90" height="8" rx="2" fill="currentColor" fillOpacity="0.03" stroke="currentColor" strokeWidth="0.7" />
      <rect x="60" y="215" width="80" height="3" rx="1" fill="none" stroke="currentColor" strokeWidth="0.3" strokeOpacity="0.5" />

      {/* ===== BOTTOM EDGE ===== */}
      <line x1="20" y1="228" x2="180" y2="228" stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.4" />
    </svg>
  );
}
