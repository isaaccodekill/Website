"use client";

import { useRef, useEffect, useState } from "react";

interface MagneticElementProps {
  children: React.ReactNode;
  strength?: number;
  threshold?: number;
  className?: string;
}

export function MagneticElement({
  children,
  strength = 0.3,
  threshold = 40,
  className = "",
}: MagneticElementProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isHoverable, setIsHoverable] = useState(true);

  useEffect(() => {
    // Check if device supports hover (not touch-only)
    const mediaQuery = window.matchMedia("(hover: hover)");
    setIsHoverable(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setIsHoverable(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    if (!isHoverable || !elementRef.current) return;

    const element = elementRef.current;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const distanceX = e.clientX - centerX;
      const distanceY = e.clientY - centerY;
      const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

      if (distance < threshold) {
        const factor = 1 - distance / threshold;
        setOffset({
          x: distanceX * strength * factor,
          y: distanceY * strength * factor,
        });
      } else {
        setOffset({ x: 0, y: 0 });
      }
    };

    const handleMouseLeave = () => {
      setOffset({ x: 0, y: 0 });
    };

    // Listen on document for mouse move, element for leave
    document.addEventListener("mousemove", handleMouseMove);
    element.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      element.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [isHoverable, strength, threshold]);

  // Check for reduced motion preference
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return (
    <div
      ref={elementRef}
      className={className}
      style={{
        transform:
          !prefersReducedMotion && isHoverable
            ? `translate(${offset.x}px, ${offset.y}px)`
            : undefined,
        transition: "transform 400ms cubic-bezier(0.4, 0, 0.2, 1)",
        willChange: "transform",
      }}
    >
      {children}
    </div>
  );
}
