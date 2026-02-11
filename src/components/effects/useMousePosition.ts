"use client";

import { useState, useEffect, useCallback, useRef } from "react";

interface MousePosition {
  x: number;
  y: number;
}

export function useMousePosition() {
  const [mousePosition, setMousePosition] = useState<MousePosition>({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return mousePosition;
}

// Smooth mouse position with lerp for trailing effects
export function useSmoothMousePosition(lerpFactor: number = 0.08) {
  const [smoothPosition, setSmoothPosition] = useState<MousePosition>({
    x: 0,
    y: 0,
  });
  const targetRef = useRef<MousePosition>({ x: 0, y: 0 });
  const currentRef = useRef<MousePosition>({ x: 0, y: 0 });
  const rafRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      targetRef.current = { x: event.clientX, y: event.clientY };
    };

    const animate = () => {
      // Lerp toward target
      currentRef.current.x +=
        (targetRef.current.x - currentRef.current.x) * lerpFactor;
      currentRef.current.y +=
        (targetRef.current.y - currentRef.current.y) * lerpFactor;

      setSmoothPosition({
        x: currentRef.current.x,
        y: currentRef.current.y,
      });

      rafRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", handleMouseMove);
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [lerpFactor]);

  return smoothPosition;
}

// Hook to detect if element is near cursor
export function useProximity(
  elementRef: React.RefObject<HTMLElement | null>,
  threshold: number = 40
) {
  const [isNear, setIsNear] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const mousePosition = useMousePosition();

  const calculateProximity = useCallback(() => {
    if (!elementRef.current) return;

    const rect = elementRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const distanceX = mousePosition.x - centerX;
    const distanceY = mousePosition.y - centerY;
    const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

    if (distance < threshold) {
      setIsNear(true);
      // Normalize and scale the offset (max 3px movement)
      const strength = 1 - distance / threshold;
      setOffset({
        x: (distanceX / distance) * strength * 3,
        y: (distanceY / distance) * strength * 3,
      });
    } else {
      setIsNear(false);
      setOffset({ x: 0, y: 0 });
    }
  }, [elementRef, mousePosition.x, mousePosition.y, threshold]);

  useEffect(() => {
    calculateProximity();
  }, [calculateProximity]);

  return { isNear, offset };
}
