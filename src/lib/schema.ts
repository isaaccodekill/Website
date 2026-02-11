import {
  pgTable,
  text,
  integer,
  timestamp,
  jsonb,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const posts = pgTable(
  "posts",
  {
    id: text("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    title: text("title").notNull().default(""),
    slug: text("slug").unique().notNull(),
    excerpt: text("excerpt").default(""),
    topics: jsonb("topics").default([]),
    status: text("status").notNull().default("draft"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    readingTime: integer("reading_time").default(0),
    wordCount: integer("word_count").default(0),
    tiptapJson: jsonb("tiptap_json").default({}),
  },
  (table) => [
    index("idx_posts_status").on(table.status),
    index("idx_posts_created_at").on(table.createdAt),
  ]
);

export const mediaEntries = pgTable("media_entries", {
  id: text("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  weekStart: text("week_start").notNull(),
  weekEnd: text("week_end").notNull(),
  tracks: jsonb("tracks").default([]),
  media: jsonb("media").default([]),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  publishedAt: timestamp("published_at", { withTimezone: true }),
});

export const siteContent = pgTable(
  "site_content",
  {
    id: text("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    contentKey: text("content_key").unique().notNull(),
    contentValue: text("content_value").notNull().default(""),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [index("idx_site_content_key").on(table.contentKey)]
);
