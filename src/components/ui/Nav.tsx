"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MagneticElement } from "@/components/effects/MagneticElement";
import { ThemeToggle } from "./ThemeToggle";

export function Nav() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? "nav-scrolled" : ""
      }`}
      style={{
        background: isScrolled
          ? "color-mix(in srgb, var(--bg) 92%, transparent)"
          : "transparent",
        backdropFilter: isScrolled ? "blur(12px)" : "none",
        WebkitBackdropFilter: isScrolled ? "blur(12px)" : "none",
        borderBottom: isScrolled
          ? "1px solid var(--border)"
          : "1px solid transparent",
      }}
    >
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link
          href="/"
          className="font-mono text-[0.6875rem] font-semibold tracking-[0.12em] uppercase text-text hover:text-accent transition-colors duration-300"
        >
          Isaac Bello
        </Link>

        {/* Nav Links */}
        <div className="flex items-center gap-3 sm:gap-6">
          <MagneticElement>
            <Link
              href="/"
              className="hidden sm:inline font-mono text-[0.6875rem] font-normal tracking-[0.08em] uppercase text-text-secondary hover:text-accent transition-colors duration-300"
            >
              <span className="text-text-tertiary">[H]</span> Home
            </Link>
          </MagneticElement>

          <MagneticElement>
            <Link
              href="/blog"
              className="font-mono text-[0.6875rem] font-normal tracking-[0.08em] uppercase text-text-secondary hover:text-accent transition-colors duration-300"
            >
              <span className="hidden sm:inline text-text-tertiary">[B]</span> Blog
            </Link>
          </MagneticElement>

          <MagneticElement>
            <Link
              href="/media"
              className="font-mono text-[0.6875rem] font-normal tracking-[0.08em] uppercase text-text-secondary hover:text-accent transition-colors duration-300"
            >
              <span className="hidden sm:inline text-text-tertiary">[M]</span> Media
            </Link>
          </MagneticElement>

          <MagneticElement>
            <a
              href="/Isaac_Bello_Full_Stack_Developer.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[0.6875rem] font-normal tracking-[0.08em] uppercase text-text-secondary hover:text-accent transition-colors duration-300"
            >
              <span className="hidden sm:inline text-text-tertiary">[R]</span> Resume
            </a>
          </MagneticElement>

          <div className="border-l border-border pl-3 sm:pl-6">
            <ThemeToggle />
          </div>
        </div>
      </nav>
    </header>
  );
}
