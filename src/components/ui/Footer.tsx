"use client";

import Link from "next/link";

const socialLinks = [
  { name: "GitHub", href: "https://github.com/isaaccodekill" },
  { name: "Twitter/X", href: "https://x.com/iscaa_82" },
  { name: "LinkedIn", href: "https://www.linkedin.com/in/isaac-bello/" },
  { name: "Email", href: "mailto:isaacbello3200@gmail.com" },
];

export function Footer() {
  return (
    <footer className="border-t border-border mt-auto">
      <div className="mx-auto max-w-5xl px-6 py-8">
        <div className="flex flex-col items-center gap-4">
          {/* Social Links */}
          <nav className="flex flex-wrap items-center justify-center gap-6">
            {socialLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                target={link.href.startsWith("mailto") ? undefined : "_blank"}
                rel={
                  link.href.startsWith("mailto")
                    ? undefined
                    : "noopener noreferrer"
                }
                className="font-mono text-[0.6875rem] tracking-[0.08em] uppercase text-text-tertiary hover:text-accent transition-colors duration-300"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Copyright */}
          <p className="font-mono text-[0.625rem] tracking-[0.08em] uppercase text-text-tertiary">
            {new Date().getFullYear()} Isaac Bello
          </p>
        </div>
      </div>
    </footer>
  );
}
