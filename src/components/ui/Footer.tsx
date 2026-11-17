"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
export function Footer() {
  const path = usePathname();
  if (path.startsWith("/cms")) return null;
  return (
    <footer className="journal-footer">
      <span>A little corner of the internet.</span>
      <div>
        <a href="/feed.xml">RSS</a>
        <a href="mailto:isaacbello3200@gmail.com">say hello ↗</a>
        <Link href="/cms">my notebook</Link>
      </div>
    </footer>
  );
}
