"use client";

import { FadeIn } from "@/components/ui/FadeIn";

export function Letterhead() {
  const currentDate = new Date();
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const formattedDate = `${monthNames[currentDate.getMonth()].toUpperCase()} ${currentDate.getFullYear()}`;

  return (
    <FadeIn className="mb-12">
      <div className="text-center">
        <p className="font-mono text-[0.625rem] tracking-[0.12em] uppercase text-text-tertiary">
          Lagos, Nigeria — {formattedDate}
        </p>
        <div className="mt-4 flex justify-center">
          <div className="w-10 h-px bg-border" />
        </div>
      </div>
    </FadeIn>
  );
}
