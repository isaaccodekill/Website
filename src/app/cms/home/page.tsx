import { Metadata } from "next";
import { getHomePageSections } from "@/lib/site-content";
import { HomeContentEditor } from "@/components/cms/HomeContentEditor";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Edit Home Page — CMS",
};

export default async function EditHomePage() {
  const sections = await getHomePageSections();

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <header className="mb-8">
        <Link
          href="/cms"
          className="inline-flex items-center gap-2 font-mono text-xs text-text-secondary hover:text-accent transition-colors mb-4"
        >
          <span>&larr;</span> Back to Dashboard
        </Link>
        <h1 className="font-serif text-3xl font-semibold text-text mb-2">
          Edit Home Page
        </h1>
        <p className="font-mono text-xs text-text-secondary uppercase tracking-wider">
          / Customize sections, text, and illustrations
        </p>
      </header>

      <HomeContentEditor initialSections={sections} />
    </div>
  );
}
