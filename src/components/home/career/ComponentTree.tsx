"use client";

import { useEffect, useState } from "react";

export function ComponentTree() {
  const [time, setTime] = useState(0);
  const [activeNode, setActiveNode] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((t) => t + 1);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const nodeInterval = setInterval(() => {
      setActiveNode((n) => (n + 1) % 5);
    }, 800);
    return () => clearInterval(nodeInterval);
  }, []);

  const getNodeOpacity = (nodeIndex: number) => {
    return activeNode === nodeIndex ? 0.25 : 0.05;
  };

  const getPulse = (offset: number) => {
    return 0.4 + Math.sin(time * 0.1 + offset) * 0.2;
  };

  return (
    <div className="flex flex-col items-center">
      <svg
        width="180"
        height="140"
        viewBox="0 0 180 140"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-accent"
      >
        {/* Root component (App) */}
        <rect
          x="65"
          y="10"
          width="50"
          height="24"
          rx="4"
          stroke="currentColor"
          strokeWidth="1.5"
          fill="currentColor"
          fillOpacity={getNodeOpacity(0)}
        />
        <text
          x="90"
          y="26"
          textAnchor="middle"
          fontSize="10"
          fill="currentColor"
          fillOpacity={getPulse(0)}
          fontFamily="monospace"
        >
          {"<App />"}
        </text>

        {/* Connecting lines from root - animated */}
        <line x1="90" y1="34" x2="90" y2="44" stroke="currentColor" strokeWidth="1.5" strokeOpacity={getPulse(0.5)} />
        <line x1="45" y1="44" x2="135" y2="44" stroke="currentColor" strokeWidth="1.5" strokeOpacity={getPulse(0.5)} />
        <line x1="45" y1="44" x2="45" y2="54" stroke="currentColor" strokeWidth="1.5" strokeOpacity={getPulse(1)} />
        <line x1="135" y1="44" x2="135" y2="54" stroke="currentColor" strokeWidth="1.5" strokeOpacity={getPulse(1.5)} />

        {/* Left child (Header) */}
        <rect
          x="15"
          y="54"
          width="60"
          height="24"
          rx="4"
          stroke="currentColor"
          strokeWidth="1.5"
          fill="currentColor"
          fillOpacity={getNodeOpacity(1)}
        />
        <text
          x="45"
          y="70"
          textAnchor="middle"
          fontSize="9"
          fill="currentColor"
          fillOpacity={getPulse(1)}
          fontFamily="monospace"
        >
          {"<Header />"}
        </text>

        {/* Right child (Main) */}
        <rect
          x="105"
          y="54"
          width="60"
          height="24"
          rx="4"
          stroke="currentColor"
          strokeWidth="1.5"
          fill="currentColor"
          fillOpacity={getNodeOpacity(2)}
        />
        <text
          x="135"
          y="70"
          textAnchor="middle"
          fontSize="9"
          fill="currentColor"
          fillOpacity={getPulse(1.5)}
          fontFamily="monospace"
        >
          {"<Main />"}
        </text>

        {/* Connecting lines from Main */}
        <line x1="135" y1="78" x2="135" y2="88" stroke="currentColor" strokeWidth="1.5" strokeOpacity={getPulse(2)} />
        <line x1="105" y1="88" x2="165" y2="88" stroke="currentColor" strokeWidth="1.5" strokeOpacity={getPulse(2)} />
        <line x1="105" y1="88" x2="105" y2="98" stroke="currentColor" strokeWidth="1.5" strokeOpacity={getPulse(2.5)} />
        <line x1="165" y1="88" x2="165" y2="98" stroke="currentColor" strokeWidth="1.5" strokeOpacity={getPulse(3)} />

        {/* Grandchildren */}
        <rect
          x="80"
          y="98"
          width="50"
          height="22"
          rx="4"
          stroke="currentColor"
          strokeWidth="1.5"
          fill="currentColor"
          fillOpacity={getNodeOpacity(3)}
        />
        <text
          x="105"
          y="113"
          textAnchor="middle"
          fontSize="8"
          fill="currentColor"
          fillOpacity={getPulse(2.5)}
          fontFamily="monospace"
        >
          {"<Card />"}
        </text>

        <rect
          x="140"
          y="98"
          width="50"
          height="22"
          rx="4"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeDasharray="4 3"
          fill="currentColor"
          fillOpacity={getNodeOpacity(4)}
        />
        <text
          x="165"
          y="113"
          textAnchor="middle"
          fontSize="8"
          fill="currentColor"
          fillOpacity={getPulse(3)}
          fontFamily="monospace"
        >
          {"<List />"}
        </text>

        {/* Render signal flowing down */}
        <circle
          cx="90"
          cy={20 + (time % 30) * 3.5}
          r="3"
          fill="currentColor"
          fillOpacity={0.4}
        />
      </svg>
      <span className="text-xs text-text-tertiary mt-2 font-mono">FIG.02</span>
    </div>
  );
}
