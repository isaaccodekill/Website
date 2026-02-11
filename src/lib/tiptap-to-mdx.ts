interface TiptapNode {
  type: string;
  content?: TiptapNode[];
  text?: string;
  marks?: { type: string; attrs?: Record<string, any> }[];
  attrs?: Record<string, any>;
}

export function tiptapToMdx(doc: TiptapNode): string {
  if (!doc || !doc.content) return "";

  return doc.content.map((node) => nodeToMdx(node)).join("\n\n");
}

function nodeToMdx(node: TiptapNode): string {
  switch (node.type) {
    case "paragraph":
      return contentToMdx(node.content || []);

    case "heading":
      const level = node.attrs?.level || 2;
      const prefix = "#".repeat(level);
      return `${prefix} ${contentToMdx(node.content || [])}`;

    case "bulletList":
      return (node.content || [])
        .map((item) => `- ${contentToMdx(item.content?.[0]?.content || [])}`)
        .join("\n");

    case "orderedList":
      return (node.content || [])
        .map(
          (item, i) =>
            `${i + 1}. ${contentToMdx(item.content?.[0]?.content || [])}`
        )
        .join("\n");

    case "blockquote":
      return (node.content || [])
        .map((p) => `> ${contentToMdx(p.content || [])}`)
        .join("\n");

    case "codeBlock":
      const language = node.attrs?.language || "";
      const code = contentToMdx(node.content || []);
      return `\`\`\`${language}\n${code}\n\`\`\``;

    case "image":
      const src = node.attrs?.src || "";
      const alt = node.attrs?.alt || "";
      const title = node.attrs?.title || "";
      if (title) {
        return `![${alt}](${src} "${title}")`;
      }
      return `![${alt}](${src})`;

    case "horizontalRule":
      return "---";

    case "hardBreak":
      return "  \n";

    default:
      if (node.content) {
        return contentToMdx(node.content);
      }
      return "";
  }
}

function contentToMdx(content: TiptapNode[]): string {
  return content
    .map((node) => {
      if (node.type === "text") {
        let text = node.text || "";

        // Apply marks
        if (node.marks) {
          for (const mark of node.marks) {
            switch (mark.type) {
              case "bold":
                text = `**${text}**`;
                break;
              case "italic":
                text = `*${text}*`;
                break;
              case "strike":
                text = `~~${text}~~`;
                break;
              case "code":
                text = `\`${text}\``;
                break;
              case "link":
                const href = mark.attrs?.href || "";
                text = `[${text}](${href})`;
                break;
              case "highlight":
                // MDX doesn't have native highlight, use custom component
                text = `<mark>${text}</mark>`;
                break;
            }
          }
        }

        return text;
      }

      return nodeToMdx(node);
    })
    .join("");
}

export function generateMdxFile(
  frontmatter: {
    title: string;
    slug: string;
    date: string;
    topics: string[];
    excerpt: string;
    readingTime: number;
  },
  content: string
): string {
  const fm = `---
title: "${frontmatter.title.replace(/"/g, '\\"')}"
slug: "${frontmatter.slug}"
date: "${frontmatter.date}"
topics: ${JSON.stringify(frontmatter.topics)}
excerpt: "${frontmatter.excerpt.replace(/"/g, '\\"')}"
---`;

  return `${fm}\n\n${content}`;
}
