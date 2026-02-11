import Link from "next/link";
import { ToastProvider } from "@/components/ui/Toast";

export default function CMSLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-bg">
      {/* CMS Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-bg/95 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link
              href="/cms"
              className="font-mono text-[0.6875rem] font-semibold tracking-[0.12em] uppercase text-text hover:text-accent transition-colors"
            >
              Writing Studio
            </Link>
            <nav className="flex items-center gap-4">
              <Link
                href="/cms/posts"
                className="font-mono text-[0.6875rem] tracking-[0.08em] uppercase text-text-secondary hover:text-accent transition-colors"
              >
                Posts
              </Link>
              <Link
                href="/cms/media"
                className="font-mono text-[0.6875rem] tracking-[0.08em] uppercase text-text-secondary hover:text-accent transition-colors"
              >
                Media
              </Link>
              <Link
                href="/cms/home"
                className="font-mono text-[0.6875rem] tracking-[0.08em] uppercase text-text-secondary hover:text-accent transition-colors"
              >
                Home
              </Link>
            </nav>
          </div>

          <Link
            href="/"
            target="_blank"
            className="font-mono text-[0.6875rem] tracking-[0.08em] uppercase text-text-tertiary hover:text-accent transition-colors"
          >
            View Site &rarr;
          </Link>
        </div>
      </header>

      {/* Main content */}
      <ToastProvider>
        <main>{children}</main>
      </ToastProvider>
    </div>
  );
}
