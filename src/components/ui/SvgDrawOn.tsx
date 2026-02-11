"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

interface SvgDrawOnProps {
  children: React.ReactNode;
  duration?: number;
  delay?: number;
  className?: string;
  label?: string;
}

export function SvgDrawOn({
  children,
  duration = 1.2,
  delay = 0,
  className = "",
  label,
}: SvgDrawOnProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (ref.current) {
            observer.unobserve(ref.current);
          }
        }
      },
      {
        threshold: 0.3,
        rootMargin: "0px",
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return (
    <div ref={ref} className={`flex flex-col items-center gap-2 ${className}`}>
      <motion.div
        initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0 }}
        animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.3, delay }}
        className="svg-draw-container"
        style={
          {
            "--draw-duration": `${duration}s`,
            "--draw-delay": `${delay}s`,
          } as React.CSSProperties
        }
      >
        <style jsx global>{`
          .svg-draw-container svg path,
          .svg-draw-container svg line,
          .svg-draw-container svg circle,
          .svg-draw-container svg rect,
          .svg-draw-container svg polyline {
            stroke-dasharray: 1000;
            stroke-dashoffset: 1000;
          }

          .svg-draw-container.animate svg path,
          .svg-draw-container.animate svg line,
          .svg-draw-container.animate svg circle,
          .svg-draw-container.animate svg rect,
          .svg-draw-container.animate svg polyline {
            animation: drawOn var(--draw-duration) var(--draw-delay)
              cubic-bezier(0.65, 0, 0.35, 1) forwards;
          }

          @keyframes drawOn {
            to {
              stroke-dashoffset: 0;
            }
          }

          @media (prefers-reduced-motion: reduce) {
            .svg-draw-container svg path,
            .svg-draw-container svg line,
            .svg-draw-container svg circle,
            .svg-draw-container svg rect,
            .svg-draw-container svg polyline {
              stroke-dasharray: none;
              stroke-dashoffset: 0;
              animation: none;
            }
          }
        `}</style>
        <div className={isVisible && !prefersReducedMotion ? "animate" : ""}>
          {children}
        </div>
      </motion.div>

      {label && (
        <motion.span
          initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.4, delay: delay + duration * 0.8 }}
          className="font-mono text-[0.625rem] tracking-[0.1em] uppercase text-text-tertiary"
        >
          {label}
        </motion.span>
      )}
    </div>
  );
}
