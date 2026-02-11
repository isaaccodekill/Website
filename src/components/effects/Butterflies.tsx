"use client";

import { useEffect, useState } from "react";

interface Butterfly {
  id: number;
  startX: number;
  startY: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
  pathVariant: number;
}

function ButterflyPath({ variant, time }: { variant: number; time: number }) {
  // Different flight paths based on variant - larger movements across screen
  const paths = [
    { x: Math.sin(time * 0.015) * 120, y: Math.cos(time * 0.012) * 60 },
    { x: Math.cos(time * 0.012) * 150, y: Math.sin(time * 0.018) * 70 },
    { x: Math.sin(time * 0.018) * 100, y: Math.sin(time * 0.015) * 80 },
    { x: Math.cos(time * 0.014) * 130, y: Math.cos(time * 0.016) * 55 },
    { x: Math.sin(time * 0.01) * 140, y: Math.cos(time * 0.02) * 65 },
    { x: Math.cos(time * 0.016) * 110, y: Math.sin(time * 0.014) * 75 },
    { x: Math.sin(time * 0.013) * 125, y: Math.cos(time * 0.017) * 50 },
    { x: Math.cos(time * 0.019) * 135, y: Math.sin(time * 0.011) * 85 },
  ];
  return paths[variant % paths.length];
}

export function Butterflies() {
  const [butterflies, setButterflies] = useState<Butterfly[]>([]);
  const [time, setTime] = useState(0);

  useEffect(() => {
    // Generate random butterflies spread across the full screen
    const count = 4;
    const generated: Butterfly[] = [];

    // Positions that favor the white space (sides of screen)
    const positions = [
      { x: 6, y: 25 },   // far left
      { x: 10, y: 70 },  // left lower
      { x: 90, y: 20 },  // far right
      { x: 85, y: 65 },  // right lower
    ];

    for (let i = 0; i < count; i++) {
      const pos = positions[i];
      generated.push({
        id: i,
        startX: pos.x,
        startY: pos.y,
        size: 26 + Math.random() * 14,
        duration: 25 + Math.random() * 20,
        delay: Math.random() * 10,
        opacity: 0.3 + Math.random() * 0.18,
        pathVariant: i,
      });
    }

    setButterflies(generated);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((t) => t + 1);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {butterflies.map((butterfly) => {
        const path = ButterflyPath({ variant: butterfly.pathVariant, time: time + butterfly.delay * 20 });
        const rotation = Math.sin(time * 0.03 + butterfly.id) * 15;
        // Wing flap - scales horizontally to simulate 3D flapping
        const flapPhase = Math.sin(time * 0.35 + butterfly.id * 0.7);
        const leftWingScale = 0.3 + (flapPhase + 1) * 0.35;
        const rightWingScale = 0.3 + (-flapPhase + 1) * 0.35;

        return (
          <div
            key={butterfly.id}
            className="absolute"
            style={{
              left: `${butterfly.startX}%`,
              top: `${butterfly.startY}%`,
              transform: `translate(${path.x}px, ${path.y}px) rotate(${rotation}deg)`,
            }}
          >
            <svg
              width={butterfly.size}
              height={butterfly.size}
              viewBox="0 0 32 32"
              fill="none"
              className="text-accent"
              style={{ opacity: butterfly.opacity }}
            >
              {/* Left upper wing */}
              <path
                d="M16 14 Q12 8 6 6 Q2 8 3 14 Q4 18 10 18 Q14 18 16 16 Z"
                stroke="currentColor"
                strokeWidth="0.5"
                fill="currentColor"
                fillOpacity="0.15"
                style={{
                  transform: `scaleX(${leftWingScale})`,
                  transformOrigin: "16px 16px",
                }}
              />
              {/* Left lower wing */}
              <path
                d="M16 18 Q12 20 8 26 Q10 28 14 26 Q16 24 16 20 Z"
                stroke="currentColor"
                strokeWidth="0.5"
                fill="currentColor"
                fillOpacity="0.12"
                style={{
                  transform: `scaleX(${leftWingScale})`,
                  transformOrigin: "16px 16px",
                }}
              />
              {/* Right upper wing */}
              <path
                d="M16 14 Q20 8 26 6 Q30 8 29 14 Q28 18 22 18 Q18 18 16 16 Z"
                stroke="currentColor"
                strokeWidth="0.5"
                fill="currentColor"
                fillOpacity="0.15"
                style={{
                  transform: `scaleX(${rightWingScale})`,
                  transformOrigin: "16px 16px",
                }}
              />
              {/* Right lower wing */}
              <path
                d="M16 18 Q20 20 24 26 Q22 28 18 26 Q16 24 16 20 Z"
                stroke="currentColor"
                strokeWidth="0.5"
                fill="currentColor"
                fillOpacity="0.12"
                style={{
                  transform: `scaleX(${rightWingScale})`,
                  transformOrigin: "16px 16px",
                }}
              />
              {/* Body */}
              <path
                d="M16 8 Q15 12 15 16 Q15 20 16 24 Q17 20 17 16 Q17 12 16 8 Z"
                fill="currentColor"
                fillOpacity="0.35"
              />
              {/* Antennae */}
              <path
                d="M16 8 Q14 5 12 4"
                stroke="currentColor"
                strokeWidth="0.5"
                fill="none"
                strokeLinecap="round"
              />
              <path
                d="M16 8 Q18 5 20 4"
                stroke="currentColor"
                strokeWidth="0.5"
                fill="none"
                strokeLinecap="round"
              />
            </svg>
          </div>
        );
      })}
    </div>
  );
}
