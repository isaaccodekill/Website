"use client";

interface MonoLabelProps {
  children: string;
  className?: string;
}

export function MonoLabel({ children, className = "" }: MonoLabelProps) {
  return (
    <span
      className={`font-mono text-[0.6875rem] font-normal tracking-[0.08em] uppercase text-text-secondary ${className}`}
    >
      / {children}
    </span>
  );
}
