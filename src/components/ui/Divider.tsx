"use client";

interface DividerProps {
  className?: string;
}

export function Divider({ className = "" }: DividerProps) {
  return (
    <div
      className={`flex items-center justify-center py-8 ${className}`}
      aria-hidden="true"
    >
      <span className="font-mono text-border text-sm tracking-widest select-none">
        &#9670; &middot; &middot; &middot; &#9670; &middot; &middot; &middot; &#9670;
      </span>
    </div>
  );
}
