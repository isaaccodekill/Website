"use client";

import { useEffect, useState } from "react";

export function TVIllustration({ className = "" }: { className?: string }) {
  const [time, setTime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((t) => t + 1);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Animation cycle for fighting
  const fightFrame = time % 40;

  // Stick figure 1 (left) - punching motion
  const punch1 = Math.sin(time * 0.3) > 0;
  const arm1X = punch1 ? 42 : 38;
  const arm1Y = punch1 ? 32 : 35;

  // Stick figure 2 (right) - punching motion
  const punch2 = Math.sin(time * 0.3 + Math.PI) > 0;
  const arm2X = punch2 ? 58 : 62;
  const arm2Y = punch2 ? 32 : 35;

  // Bobbing motion
  const bob1 = Math.sin(time * 0.2) * 1.5;
  const bob2 = Math.sin(time * 0.2 + 1) * 1.5;

  return (
    <svg
      viewBox="0 0 100 90"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      {/* TV main body */}
      <rect
        x="5"
        y="5"
        width="90"
        height="60"
        rx="4"
        fill="currentColor"
        fillOpacity="0.04"
        stroke="currentColor"
        strokeWidth="1.2"
      />

      {/* Screen - reduced bezel */}
      <rect
        x="8"
        y="8"
        width="84"
        height="54"
        rx="2"
        fill="currentColor"
        fillOpacity="0.03"
        stroke="currentColor"
        strokeWidth="0.8"
      />

      {/* Screen content - stick men fighting */}
      <g>
        {/* Stick figure 1 (left) */}
        <g style={{ transform: `translateY(${bob1}px)` }}>
          {/* Head */}
          <circle cx="35" cy="24" r="4" stroke="currentColor" strokeWidth="1" fill="none" strokeOpacity="0.5" />
          {/* Body */}
          <line x1="35" y1="28" x2="35" y2="42" stroke="currentColor" strokeWidth="1" strokeOpacity="0.5" />
          {/* Punching arm */}
          <line x1="35" y1="32" x2={arm1X} y2={arm1Y} stroke="currentColor" strokeWidth="1" strokeOpacity="0.5" />
          {/* Other arm */}
          <line x1="35" y1="32" x2="30" y2="38" stroke="currentColor" strokeWidth="1" strokeOpacity="0.5" />
          {/* Left leg */}
          <line x1="35" y1="42" x2="30" y2="52" stroke="currentColor" strokeWidth="1" strokeOpacity="0.5" />
          {/* Right leg */}
          <line x1="35" y1="42" x2="40" y2="52" stroke="currentColor" strokeWidth="1" strokeOpacity="0.5" />
        </g>

        {/* Stick figure 2 (right) */}
        <g style={{ transform: `translateY(${bob2}px)` }}>
          {/* Head */}
          <circle cx="65" cy="24" r="4" stroke="currentColor" strokeWidth="1" fill="none" strokeOpacity="0.5" />
          {/* Body */}
          <line x1="65" y1="28" x2="65" y2="42" stroke="currentColor" strokeWidth="1" strokeOpacity="0.5" />
          {/* Punching arm */}
          <line x1="65" y1="32" x2={arm2X} y2={arm2Y} stroke="currentColor" strokeWidth="1" strokeOpacity="0.5" />
          {/* Other arm */}
          <line x1="65" y1="32" x2="70" y2="38" stroke="currentColor" strokeWidth="1" strokeOpacity="0.5" />
          {/* Left leg */}
          <line x1="65" y1="42" x2="60" y2="52" stroke="currentColor" strokeWidth="1" strokeOpacity="0.5" />
          {/* Right leg */}
          <line x1="65" y1="42" x2="70" y2="52" stroke="currentColor" strokeWidth="1" strokeOpacity="0.5" />
        </g>

        {/* Impact effect when punches connect */}
        {punch1 && (
          <g>
            <line x1="44" y1="30" x2="47" y2="28" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.4" />
            <line x1="44" y1="33" x2="48" y2="33" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.4" />
            <line x1="44" y1="36" x2="47" y2="38" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.4" />
          </g>
        )}

        {/* Tumbleweed rolling across */}
        <g
          style={{
            transform: `translateX(${((time * 0.8) % 100) - 10}px) rotate(${time * 3}deg)`,
            transformOrigin: "50px 54px",
          }}
        >
          <circle cx="50" cy="54" r="4" stroke="currentColor" strokeWidth="0.6" fill="none" strokeOpacity="0.35" />
          <circle cx="50" cy="54" r="2.5" stroke="currentColor" strokeWidth="0.4" fill="none" strokeOpacity="0.25" />
          <line x1="46" y1="54" x2="54" y2="54" stroke="currentColor" strokeWidth="0.4" strokeOpacity="0.3" />
          <line x1="50" y1="50" x2="50" y2="58" stroke="currentColor" strokeWidth="0.4" strokeOpacity="0.3" />
          <line x1="47" y1="51" x2="53" y2="57" stroke="currentColor" strokeWidth="0.4" strokeOpacity="0.3" />
          <line x1="53" y1="51" x2="47" y2="57" stroke="currentColor" strokeWidth="0.4" strokeOpacity="0.3" />
        </g>

        {/* Scan line */}
        <line x1="8" y1={10 + (time % 70) * 0.75} x2="92" y2={10 + (time % 70) * 0.75} stroke="currentColor" strokeOpacity="0.04" strokeWidth="0.6" />
      </g>

      {/* TV stand - left leg */}
      <line
        x1="35"
        y1="65"
        x2="30"
        y2="82"
        stroke="currentColor"
        strokeWidth="1.2"
      />

      {/* TV stand - right leg */}
      <line
        x1="65"
        y1="65"
        x2="70"
        y2="82"
        stroke="currentColor"
        strokeWidth="1.2"
      />

      {/* Stand base */}
      <line
        x1="25"
        y1="82"
        x2="75"
        y2="82"
        stroke="currentColor"
        strokeWidth="1.2"
      />

      {/* Power indicator */}
      <circle cx="90" cy="60" r="2" fill="currentColor" fillOpacity={0.3 + Math.sin(time * 0.1) * 0.15} />
    </svg>
  );
}
