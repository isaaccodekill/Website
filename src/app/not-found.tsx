import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 — Page Not Found",
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center pt-20 pb-16">
      <div className="mx-auto max-w-[38rem] px-6 text-center">
        {/* 404 Number */}
        <div className="mb-8">
          <span className="font-mono text-[8rem] sm:text-[12rem] font-semibold leading-none text-border select-none">
            404
          </span>
        </div>

        {/* Message */}
        <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-text mb-4">
          Page not found
        </h1>

        <p className="font-serif text-text-secondary mb-8 max-w-md mx-auto leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist, or perhaps it wandered off somewhere.
          These things happen.
        </p>

        {/* Decorative divider */}
        <div className="mb-8 text-text-tertiary font-mono text-xs tracking-widest">
          · · ·
        </div>

        {/* Navigation options */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/"
            className="px-6 py-2.5 bg-accent text-white font-mono text-xs uppercase tracking-wider rounded-md hover:bg-accent-hover transition-colors"
          >
            Go Home
          </Link>

          <Link
            href="/blog"
            className="px-6 py-2.5 border border-border text-text-secondary font-mono text-xs uppercase tracking-wider rounded-md hover:border-accent hover:text-accent transition-colors"
          >
            Read Blog
          </Link>
        </div>

        {/* Helpful links */}
        <div className="mt-16 pt-8 border-t border-border">
          <p className="font-mono text-[0.625rem] uppercase tracking-wider text-text-tertiary mb-4">
            / Looking for something?
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            <Link
              href="/"
              className="font-mono text-xs text-text-secondary hover:text-accent transition-colors"
            >
              Home
            </Link>
            <Link
              href="/blog"
              className="font-mono text-xs text-text-secondary hover:text-accent transition-colors"
            >
              Blog
            </Link>
            <Link
              href="/media"
              className="font-mono text-xs text-text-secondary hover:text-accent transition-colors"
            >
              Media
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
