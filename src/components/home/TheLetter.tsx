"use client";

import { FadeIn } from "@/components/ui/FadeIn";
import { DropCap } from "@/components/ui/DropCap";
import { CursorIcon } from "./career/CursorIcon";
import { ComponentTree } from "./career/ComponentTree";
import { FullstackDiagram } from "./career/FullstackDiagram";
import { NeuralNet } from "./career/NeuralNet";
import { HomeSection, IllustrationId } from "@/lib/site-content-types";

interface Props {
  sections: HomeSection[];
}

// Map illustration IDs to components
function getIllustration(id: IllustrationId) {
  switch (id) {
    case "cursor":
      return <CursorIcon />;
    case "component-tree":
      return <ComponentTree />;
    case "fullstack":
      return <FullstackDiagram />;
    case "neural-net":
      return <NeuralNet />;
    default:
      return null;
  }
}

export function TheLetter({ sections }: Props) {
  return (
    <article className="space-y-12">
      {sections.map((section, index) => {
        const illustration = getIllustration(section.illustration);
        const isFirst = index === 0;

        return (
          <div key={section.id}>
            {/* Text content */}
            <FadeIn delay={index * 0.1}>
              {isFirst ? (
                <DropCap>{section.text}</DropCap>
              ) : section.isClosing ? (
                <p className="italic text-text-secondary">{section.text}</p>
              ) : (
                <p>{section.text}</p>
              )}
            </FadeIn>

            {/* Illustration (if any) */}
            {illustration && (
              <FadeIn delay={index * 0.1 + 0.1} className="flex justify-center py-10">
                {illustration}
              </FadeIn>
            )}
          </div>
        );
      })}
    </article>
  );
}
