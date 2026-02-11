import { notFound } from "next/navigation";
import { Metadata } from "next";
import { compileMDX } from "next-mdx-remote/rsc";
import { getPostBySlug, getPostSlugs, highlightCode } from "@/lib/mdx";
import { PostArticle } from "@/components/blog/PostArticle";
import { Callout } from "@/components/blog/mdx/Callout";
import { BlockQuote } from "@/components/blog/mdx/BlockQuote";
import { ImageWithCaption } from "@/components/blog/mdx/ImageWithCaption";
import { Butterflies } from "@/components/effects/Butterflies";

// Custom components for MDX
const components = {
  Callout,
  BlockQuote,
  ImageWithCaption,
  // Custom code block with syntax highlighting
  pre: async ({
    children,
    ...props
  }: {
    children: React.ReactElement<{ className?: string; children: string }>;
  }) => {
    const code = children?.props?.children || "";
    const className = children?.props?.className || "";
    const language = className.replace("language-", "") || "text";

    const html = await highlightCode(code.trim(), language);

    return (
      <div
        className="my-6 rounded-md overflow-hidden border border-border [&>pre]:p-4 [&>pre]:m-0 [&_code]:font-mono [&_code]:text-sm [&_code]:leading-relaxed"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  },
  // Override default elements
  h2: ({ children, ...props }: { children: React.ReactNode }) => {
    const id =
      typeof children === "string"
        ? children.toLowerCase().replace(/\s+/g, "-")
        : "";
    return (
      <h2 id={id} {...props}>
        {children}
      </h2>
    );
  },
  a: ({
    href,
    children,
    ...props
  }: {
    href?: string;
    children: React.ReactNode;
  }) => {
    const isExternal = href?.startsWith("http");
    return (
      <a
        href={href}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
        {...props}
      >
        {children}
      </a>
    );
  },
};

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: "Post Not Found — Isaac Bello",
    };
  }

  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://isaacadewumi.com";
  const ogImageUrl = `${SITE_URL}/api/og?title=${encodeURIComponent(
    post.frontmatter.title
  )}&subtitle=${encodeURIComponent(`${post.frontmatter.readingTime} min read`)}`;

  return {
    title: `${post.frontmatter.title} — Isaac Bello`,
    description: post.frontmatter.excerpt,
    openGraph: {
      title: post.frontmatter.title,
      description: post.frontmatter.excerpt,
      type: "article",
      publishedTime: post.frontmatter.date,
      authors: ["Isaac Bello"],
      tags: post.frontmatter.topics,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: post.frontmatter.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.frontmatter.title,
      description: post.frontmatter.excerpt,
      images: [ogImageUrl],
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const { content } = await compileMDX({
    source: post.content,
    components,
    options: {
      parseFrontmatter: false,
    },
  });

  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://isaacadewumi.com";

  // JSON-LD structured data for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.frontmatter.title,
    description: post.frontmatter.excerpt,
    datePublished: post.frontmatter.date,
    dateModified: post.frontmatter.date,
    author: {
      "@type": "Person",
      name: "Isaac Bello",
      url: SITE_URL,
    },
    publisher: {
      "@type": "Person",
      name: "Isaac Bello",
      url: SITE_URL,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/blog/${slug}`,
    },
    keywords: post.frontmatter.topics.join(", "),
    wordCount: post.frontmatter.readingTime * 200, // Approximate words based on reading time
    timeRequired: `PT${post.frontmatter.readingTime}M`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Butterflies />
      <PostArticle frontmatter={post.frontmatter}>{content}</PostArticle>
    </>
  );
}
