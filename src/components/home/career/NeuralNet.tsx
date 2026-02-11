"use client";

import { useEffect, useState } from "react";

export function NeuralNet() {
  const [time, setTime] = useState(0);
  const [activeLayer, setActiveLayer] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((t) => t + 1);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const layerInterval = setInterval(() => {
      setActiveLayer((l) => (l + 1) % 3);
    }, 600);
    return () => clearInterval(layerInterval);
  }, []);

  const getNodeFill = (layer: number, nodeIndex: number) => {
    const isActive = layer === activeLayer;
    const pulse = Math.sin(time * 0.15 + nodeIndex * 0.5);
    return isActive ? 0.3 + pulse * 0.15 : 0.08 + pulse * 0.04;
  };

  const getConnectionOpacity = (fromLayer: number) => {
    const isActive = fromLayer === activeLayer || fromLayer === activeLayer - 1;
    return isActive ? 0.5 + Math.sin(time * 0.1) * 0.2 : 0.15;
  };

  // Signal propagation
  const signalProgress = (time * 3) % 100;
  const signalX = 25 + (signalProgress / 100) * 130;

  return (
    <div className="flex flex-col items-center">
      <svg
        width="200"
        height="140"
        viewBox="0 0 200 140"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-accent"
      >
        {/* Layer labels */}
        <text x="30" y="12" fontSize="8" fill="currentColor" fillOpacity="0.4" fontFamily="monospace">INPUT</text>
        <text x="85" y="12" fontSize="8" fill="currentColor" fillOpacity="0.4" fontFamily="monospace">HIDDEN</text>
        <text x="150" y="12" fontSize="8" fill="currentColor" fillOpacity="0.4" fontFamily="monospace">OUTPUT</text>

        {/* Connections: Input to Hidden */}
        {[20, 50, 80].map((y1, i) =>
          [25, 50, 75, 100].map((y2, j) => (
            <line
              key={`i-h-${i}-${j}`}
              x1="45"
              y1={y1 + 20}
              x2="85"
              y2={y2 + 10}
              stroke="currentColor"
              strokeWidth="0.8"
              opacity={getConnectionOpacity(0) * (0.3 + Math.random() * 0.4)}
            />
          ))
        )}

        {/* Connections: Hidden to Output */}
        {[25, 50, 75, 100].map((y1, i) =>
          [45, 85].map((y2, j) => (
            <line
              key={`h-o-${i}-${j}`}
              x1="115"
              y1={y1 + 10}
              x2="155"
              y2={y2 + 20}
              stroke="currentColor"
              strokeWidth="0.8"
              opacity={getConnectionOpacity(1) * (0.3 + Math.random() * 0.4)}
            />
          ))
        )}

        {/* Input layer - 3 nodes */}
        {[40, 70, 100].map((y, i) => (
          <g key={`input-${i}`}>
            <circle
              cx="35"
              cy={y}
              r="10"
              stroke="currentColor"
              strokeWidth="1.5"
              fill="currentColor"
              fillOpacity={getNodeFill(0, i)}
            />
            <circle
              cx="35"
              cy={y}
              r="14"
              stroke="currentColor"
              strokeWidth="0.5"
              strokeOpacity={activeLayer === 0 ? 0.4 : 0.1}
              fill="none"
            />
          </g>
        ))}

        {/* Hidden layer - 4 nodes */}
        {[35, 60, 85, 110].map((y, i) => (
          <g key={`hidden-${i}`}>
            <circle
              cx="100"
              cy={y}
              r="10"
              stroke="currentColor"
              strokeWidth="1.5"
              fill="currentColor"
              fillOpacity={getNodeFill(1, i)}
            />
            <circle
              cx="100"
              cy={y}
              r="14"
              stroke="currentColor"
              strokeWidth="0.5"
              strokeOpacity={activeLayer === 1 ? 0.4 : 0.1}
              fill="none"
            />
          </g>
        ))}

        {/* Output layer - 2 nodes */}
        {[65, 105].map((y, i) => (
          <g key={`output-${i}`}>
            <circle
              cx="165"
              cy={y}
              r="10"
              stroke="currentColor"
              strokeWidth="1.5"
              fill="currentColor"
              fillOpacity={getNodeFill(2, i)}
            />
            <circle
              cx="165"
              cy={y}
              r="14"
              stroke="currentColor"
              strokeWidth="0.5"
              strokeOpacity={activeLayer === 2 ? 0.4 : 0.1}
              fill="none"
            />
            {/* Output indicator */}
            <text
              x="165"
              y={y + 3}
              textAnchor="middle"
              fontSize="8"
              fill="currentColor"
              fillOpacity={getNodeFill(2, i)}
              fontFamily="monospace"
            >
              {i === 0 ? "1" : "0"}
            </text>
          </g>
        ))}

        {/* Signal propagation particle */}
        <circle
          cx={signalX}
          cy={70 + Math.sin(signalProgress * 0.1) * 20}
          r="4"
          fill="currentColor"
          fillOpacity={0.6}
        />
        <circle
          cx={signalX}
          cy={70 + Math.sin(signalProgress * 0.1) * 20}
          r="7"
          stroke="currentColor"
          strokeWidth="0.5"
          strokeOpacity="0.3"
          fill="none"
        />
      </svg>
      <span className="text-xs text-text-tertiary mt-2 font-mono">FIG.04</span>
    </div>
  );
}
