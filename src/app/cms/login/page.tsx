import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "CMS — Writing Studio",
};

// Auth disabled for now - just show link to dashboard
export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg">
      <div className="w-full max-w-sm px-6 text-center">
        <h1 className="font-serif text-3xl font-semibold text-text mb-2">
          Writing Studio
        </h1>
        <p className="font-mono text-xs text-text-secondary uppercase tracking-wider mb-8">
          / CMS Access
        </p>

        <Link
          href="/cms"
          className="inline-block w-full px-4 py-3 bg-text text-bg font-mono text-sm uppercase tracking-wider rounded-md hover:bg-text/90 transition-colors duration-200"
        >
          Enter Dashboard
        </Link>

        <p className="mt-6 font-mono text-[0.625rem] text-text-tertiary uppercase tracking-wider">
          Authentication disabled for development
        </p>
      </div>
    </div>
  );
}
