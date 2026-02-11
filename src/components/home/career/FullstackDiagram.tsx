"use client";

import { useEffect, useState } from "react";

export function FullstackDiagram() {
  const [time, setTime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((t) => t + 1);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Data packets flowing between layers
  const packet1Y = 30 + ((time * 2) % 100);
  const packet2Y = 130 - ((time * 2 + 50) % 100);
  const showPacket1 = packet1Y < 120;
  const showPacket2 = packet2Y > 30 && packet2Y < 120;

  const getPulse = (offset: number) => {
    return 0.5 + Math.sin(time * 0.08 + offset) * 0.3;
  };

  return (
    <div className="flex flex-col items-center">
      <svg
        width="160"
        height="160"
        viewBox="0 0 160 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-accent"
      >
        {/* Client layer */}
        <rect
          x="30"
          y="15"
          width="100"
          height="30"
          rx="4"
          stroke="currentColor"
          strokeWidth="1.5"
          fill="currentColor"
          fillOpacity={0.05 + Math.sin(time * 0.1) * 0.03}
        />
        <text
          x="80"
          y="34"
          textAnchor="middle"
          fontSize="11"
          fill="currentColor"
          fillOpacity={getPulse(0)}
          fontFamily="monospace"
        >
          BROWSER
        </text>
        {/* Browser dots */}
        <circle cx="42" cy="24" r="2" fill="currentColor" fillOpacity="0.3" />
        <circle cx="50" cy="24" r="2" fill="currentColor" fillOpacity="0.25" />
        <circle cx="58" cy="24" r="2" fill="currentColor" fillOpacity="0.2" />

        {/* Connection line 1 */}
        <line x1="80" y1="45" x2="80" y2="60" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.4" />
        <line x1="60" y1="60" x2="100" y2="60" stroke="currentColor" strokeWidth="1" strokeOpacity="0.3" strokeDasharray="4 2" />

        {/* API/Server layer */}
        <rect
          x="30"
          y="65"
          width="100"
          height="30"
          rx="4"
          stroke="currentColor"
          strokeWidth="1.5"
          fill="currentColor"
          fillOpacity={0.05 + Math.sin(time * 0.1 + 1) * 0.03}
        />
        <text
          x="80"
          y="84"
          textAnchor="middle"
          fontSize="11"
          fill="currentColor"
          fillOpacity={getPulse(1)}
          fontFamily="monospace"
        >
          API SERVER
        </text>

        {/* Connection line 2 */}
        <line x1="80" y1="95" x2="80" y2="110" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.4" />
        <line x1="60" y1="110" x2="100" y2="110" stroke="currentColor" strokeWidth="1" strokeOpacity="0.3" strokeDasharray="4 2" />

        {/* Database layer - cylinder */}
        <ellipse
          cx="80"
          cy="125"
          rx="45"
          ry="10"
          stroke="currentColor"
          strokeWidth="1.5"
          fill="currentColor"
          fillOpacity={0.05 + Math.sin(time * 0.1 + 2) * 0.03}
        />
        <path
          d="M35 125 L35 140 Q35 150 80 150 Q125 150 125 140 L125 125"
          stroke="currentColor"
          strokeWidth="1.5"
          fill="currentColor"
          fillOpacity="0.03"
        />
        <ellipse
          cx="80"
          cy="140"
          rx="45"
          ry="10"
          stroke="currentColor"
          strokeWidth="1"
          strokeOpacity="0.3"
          fill="none"
        />
        <text
          x="80"
          y="142"
          textAnchor="middle"
          fontSize="10"
          fill="currentColor"
          fillOpacity={getPulse(2)}
          fontFamily="monospace"
        >
          DATABASE
        </text>

        {/* Data packets flowing down (request) */}
        {showPacket1 && (
          <g>
            <circle cx="70" cy={packet1Y} r="4" fill="currentColor" fillOpacity="0.5" />
            <circle cx="70" cy={packet1Y} r="6" stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.3" fill="none" />
          </g>
        )}

        {/* Data packets flowing up (response) */}
        {showPacket2 && (
          <g>
            <circle cx="90" cy={packet2Y} r="4" fill="currentColor" fillOpacity="0.4" />
            <circle cx="90" cy={packet2Y} r="6" stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.3" fill="none" />
          </g>
        )}

        {/* Labels on right side */}
        <text x="140" y="34" fontSize="7" fill="currentColor" fillOpacity="0.4" fontFamily="monospace">GET /api</text>
        <text x="140" y="84" fontSize="7" fill="currentColor" fillOpacity="0.4" fontFamily="monospace">SELECT *</text>
        <text x="140" y="140" fontSize="7" fill="currentColor" fillOpacity="0.4" fontFamily="monospace">rows[ ]</text>
      </svg>
      <span className="text-xs text-text-tertiary mt-2 font-mono">FIG.03</span>
    </div>
  );
}
