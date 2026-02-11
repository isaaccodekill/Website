"use client";

import { TypewriterIllustration } from "./illustrations/TypewriterIllustration";

export function BlogIllustrations() {
  return (
    <div className="hidden lg:block pointer-events-none">
      {/* Typewriter - bottom left */}
      <div className="fixed left-[2%] bottom-4 text-accent opacity-45 hover:opacity-65 transition-opacity duration-500 pointer-events-auto">
        <TypewriterIllustration className="w-56 h-64" />
      </div>
    </div>
  );
}
