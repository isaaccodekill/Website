import "server-only";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";
import { createHighlighter, type Highlighter } from "shiki";
import { db } from "./db";
import { posts } from "./schema";
import { eq } from "drizzle-orm";
import { tiptapToMdx } from "./tiptap-to-mdx";

// Custom theme matching the portfolio palette
const portfolioTheme = {
  name: "portfolio",
  type: "light" as const,
  colors: {
    "editor.background": "#F0EFEB",
    "editor.foreground": "#1A1A18",
  },
  tokenColors: [
    {
      scope: ["comment", "punctuation.definition.comment"],
      settings: { foreground: "#9C9C96", fontStyle: "italic" },
    },
    {
      scope: ["string", "string.quoted"],
      settings: { foreground: "#067D17" },
    },
    {
      scope: ["constant.numeric", "constant.language"],
      settings: { foreground: "#1750EB" },
    },
    {
      scope: ["keyword", "storage.type", "storage.modifier"],
      settings: { foreground: "#CF222E" },
    },
    {
      scope: ["entity.name.function", "support.function"],
      settings: { foreground: "#8250DF" },
    },
    {
      scope: ["entity.name.type", "entity.name.class", "support.type"],
      settings: { foreground: "#953800" },
    },
    {
      scope: ["variable", "variable.other"],
      settings: { foreground: "#1A1A18" },
    },
    {
      scope: ["entity.name.tag"],
      settings: { foreground: "#116329" },
    },
    {
      scope: ["entity.other.attribute-name"],
      settings: { foreground: "#0550AE" },
    },
    {
      scope: ["punctuation"],
      settings: { foreground: "#6B6B66" },
    },
    {
      scope: ["meta.import", "meta.export"],
      settings: { foreground: "#CF222E" },
    },
  ],
};

let highlighter: Highlighter | null = null;

async function getHighlighter() {
  if (!highlighter) {
    highlighter = await createHighlighter({
      themes: [portfolioTheme],
      langs: [
        "typescript",
        "javascript",
        "tsx",
        "jsx",
        "python",
        "rust",
        "go",
        "bash",
        "json",
        "yaml",
        "css",
        "html",
        "sql",
        "markdown",
      ],
    });
  }
  return highlighter;
}

// Re-export types for backward compatibility
export type { PostFrontmatter, Post } from "./types";
import type { Post } from "./types";

const POSTS_PATH = path.join(process.cwd(), "content", "posts");

// --- Filesystem-based helpers (used as fallback) ---

function getFilePostSlugs(): string[] {
  if (!fs.existsSync(POSTS_PATH)) {
    return [];
  }
  return fs
    .readdirSync(POSTS_PATH)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.replace(/\.mdx$/, ""));
}

function getFilePostBySlug(slug: string): Post | null {
  const filePath = path.join(POSTS_PATH, `${slug}.mdx`);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const fileContents = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(fileContents);
  const stats = readingTime(content);

  return {
    frontmatter: {
      title: data.title || "",
      slug: data.slug || slug,
      date: data.date || new Date().toISOString(),
      topics: data.topics || [],
      excerpt: data.excerpt || "",
      readingTime: Math.ceil(stats.minutes),
    },
    content,
    slug,
  };
}

// --- Database-based helpers ---

async function getDbPublishedPosts(): Promise<Post[]> {
  if (!process.env.DATABASE_URL) {
    return [];
  }

  try {
    const rows = await db
      .select()
      .from(posts)
      .where(eq(posts.status, "published"));

    return rows.map((row) => {
      const topics: string[] = Array.isArray(row.topics)
        ? (row.topics as string[])
        : [];

      let content = "";
      if (row.tiptapJson) {
        try {
          const tiptapDoc =
            typeof row.tiptapJson === "string"
              ? JSON.parse(row.tiptapJson)
              : row.tiptapJson;
          content = tiptapToMdx(tiptapDoc);
        } catch {
          content = "";
        }
      }

      const date = row.publishedAt
        ? row.publishedAt.toISOString()
        : row.createdAt.toISOString();

      return {
        frontmatter: {
          title: row.title,
          slug: row.slug,
          date,
          topics,
          excerpt: row.excerpt || "",
          readingTime: row.readingTime || Math.ceil(readingTime(content).minutes) || 1,
        },
        content,
        slug: row.slug,
      };
    });
  } catch (error) {
    console.error("Error fetching posts from database:", error);
    return [];
  }
}

async function getDbPostBySlug(slug: string): Promise<Post | null> {
  if (!process.env.DATABASE_URL) {
    return null;
  }

  try {
    const rows = await db
      .select()
      .from(posts)
      .where(eq(posts.slug, slug));

    if (rows.length === 0) return null;

    const row = rows[0];
    if (row.status !== "published") return null;

    const topics: string[] = Array.isArray(row.topics)
      ? (row.topics as string[])
      : [];

    let content = "";
    if (row.tiptapJson) {
      try {
        const tiptapDoc =
          typeof row.tiptapJson === "string"
            ? JSON.parse(row.tiptapJson)
            : row.tiptapJson;
        content = tiptapToMdx(tiptapDoc);
      } catch {
        content = "";
      }
    }

    const date = row.publishedAt
      ? row.publishedAt.toISOString()
      : row.createdAt.toISOString();

    return {
      frontmatter: {
        title: row.title,
        slug: row.slug,
        date,
        topics,
        excerpt: row.excerpt || "",
        readingTime: row.readingTime || Math.ceil(readingTime(content).minutes) || 1,
      },
      content,
      slug: row.slug,
    };
  } catch (error) {
    console.error("Error fetching post from database:", error);
    return null;
  }
}

// --- Public API (merges DB + filesystem, DB takes priority) ---

export async function getPostSlugs(): Promise<string[]> {
  const dbPosts = await getDbPublishedPosts();
  const dbSlugs = new Set(dbPosts.map((p) => p.slug));
  const fileSlugs = getFilePostSlugs().filter((s) => !dbSlugs.has(s));
  return [...dbSlugs, ...fileSlugs];
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  // Try database first
  const dbPost = await getDbPostBySlug(slug);
  if (dbPost) return dbPost;

  // Fall back to filesystem
  return getFilePostBySlug(slug);
}

export async function getAllPosts(): Promise<Post[]> {
  const dbPosts = await getDbPublishedPosts();
  const dbSlugs = new Set(dbPosts.map((p) => p.slug));

  // Get filesystem posts that aren't already in the DB
  const fileSlugs = getFilePostSlugs().filter((s) => !dbSlugs.has(s));
  const filePosts = fileSlugs
    .map((slug) => getFilePostBySlug(slug))
    .filter((post): post is Post => post !== null);

  const allPosts = [...dbPosts, ...filePosts];

  allPosts.sort((a, b) => {
    const dateA = new Date(a.frontmatter.date).getTime();
    const dateB = new Date(b.frontmatter.date).getTime();
    return dateB - dateA;
  });

  return allPosts;
}

export async function getAllTopics(): Promise<{ name: string; count: number }[]> {
  const allPosts = await getAllPosts();
  const topicCounts = new Map<string, number>();

  allPosts.forEach((post) => {
    post.frontmatter.topics.forEach((topic) => {
      topicCounts.set(topic, (topicCounts.get(topic) || 0) + 1);
    });
  });

  return Array.from(topicCounts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

export async function highlightCode(
  code: string,
  lang: string
): Promise<string> {
  const hl = await getHighlighter();
  return hl.codeToHtml(code, {
    lang: lang || "text",
    theme: "portfolio",
  });
}

// Re-export formatDate for backward compatibility
export { formatDate } from "./utils";
