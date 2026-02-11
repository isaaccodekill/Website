"use client";

import { useEffect, useState } from "react";
import { useSmoothMousePosition } from "./useMousePosition";

export function LiquidBlob() {
  const smoothPosition = useSmoothMousePosition(0.08);
  const [isVisible, setIsVisible] = useState(false);
  const [isHoverable, setIsHoverable] = useState(true);

  useEffect(() => {
    // Check if device supports hover (not touch-only)
    const mediaQuery = window.matchMedia("(hover: hover)");
    setIsHoverable(mediaQuery.matches);

    // Check for reduced motion preference
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motionQuery.matches) {
      setIsHoverable(false);
    }

    const handleChange = (e: MediaQueryListEvent) => {
      setIsHoverable(e.matches);
    };

    const handleMotionChange = (e: MediaQueryListEvent) => {
      if (e.matches) setIsHoverable(false);
    };

    mediaQuery.addEventListener("change", handleChange);
    motionQuery.addEventListener("change", handleMotionChange);

    // Delay visibility to avoid flash on load
    const timer = setTimeout(() => setIsVisible(true), 100);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
      motionQuery.removeEventListener("change", handleMotionChange);
      clearTimeout(timer);
    };
  }, []);

  if (!isHoverable || !isVisible) {
    return null;
  }

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden="true"
    >
      <div
        className="absolute rounded-full"
        style={{
          width: 240,
          height: 240,
          left: smoothPosition.x - 120,
          top: smoothPosition.y - 120,
          background: "rgba(43, 74, 71, 0.12)",
          filter: "blur(60px)",
          willChange: "transform",
          transform: "translateZ(0)",
        }}
      />
    </div>
  );
}
