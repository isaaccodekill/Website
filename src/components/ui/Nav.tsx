"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";
export function Nav() {
  const path = usePathname();
  if (path.startsWith("/cms")) return null;
  return (
    <header className="journal-nav">
      <nav aria-label="Main navigation">
        <Link className="signature" href="/">
          isaac bello<span aria-hidden="true">✳</span>
        </Link>
        <div>
          {[
            ["/blog", "writing"],
            ["/about", "about"],
            ["/media", "on my shelf"],
          ].map(([href, label]) => (
            <Link
              key={href}
              href={href}
              aria-current={path.startsWith(href) ? "page" : undefined}
            >
              {label}
            </Link>
          ))}
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
