"use client";

import { TVIllustration } from "./illustrations/TVIllustration";
import { VinylIllustration } from "./illustrations/VinylIllustration";

export function MediaIllustrations() {
  return (
    <div className="hidden lg:block pointer-events-none">
      {/* TV - top right */}
      <div className="fixed right-[6%] top-40 text-accent opacity-40 hover:opacity-60 transition-opacity duration-500 pointer-events-auto">
        <TVIllustration className="w-36 h-28" />
      </div>

      {/* Vinyl - left side, vertically centered */}
      <div className="fixed left-[4%] top-1/2 -translate-y-1/2 text-accent opacity-40 hover:opacity-60 transition-opacity duration-500 pointer-events-auto">
        <VinylIllustration className="w-40 h-40" />
      </div>
    </div>
  );
}
