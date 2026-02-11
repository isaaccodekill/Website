"use client";

interface DropCapProps {
  children: string;
}

export function DropCap({ children }: DropCapProps) {
  const firstLetter = children.charAt(0);
  const restOfText = children.slice(1);

  return (
    <p className="text-lg leading-[1.78]">
      <span
        className="float-left mr-3 mt-1 text-[4.5rem] font-semibold leading-[0.8] text-accent"
        style={{ fontFamily: "var(--font-newsreader), Georgia, serif" }}
      >
        {firstLetter}
      </span>
      {restOfText}
    </p>
  );
}
