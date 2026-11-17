export const dynamic = "force-dynamic";
import { TheLetter } from "@/components/home/TheLetter";
import { getHomePageSections } from "@/lib/site-content";
export const metadata = { title: "About" };
export default async function About() {
  const sections = await getHomePageSections();
  return (
    <div className="journal-shell about-page">
      <p className="eyebrow">A little context</p>
      <h1>Hello, I’m Isaac.</h1>
      <TheLetter sections={sections} />
    </div>
  );
}
