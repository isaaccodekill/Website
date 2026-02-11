import { db } from "./db";
import { siteContent } from "./schema";
import { eq, like } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

// Re-export types and constants so existing server-side imports still work
export {
  illustrationOptions,
  defaultHomeContent,
  defaultHomeSections,
} from "./site-content-types";
export type {
  IllustrationId,
  HomeSection,
  HomePageContent,
  HomePageSettings,
} from "./site-content-types";

import type { HomePageContent, HomeSection } from "./site-content-types";
import { defaultHomeContent, defaultHomeSections } from "./site-content-types";

export async function getHomePageContent(): Promise<HomePageContent> {
  if (!process.env.DATABASE_URL) {
    return defaultHomeContent;
  }

  try {
    const rows = await db
      .select({
        contentKey: siteContent.contentKey,
        contentValue: siteContent.contentValue,
      })
      .from(siteContent)
      .where(like(siteContent.contentKey, "home_%"));

    const content: HomePageContent = { ...defaultHomeContent };

    for (const row of rows) {
      const key = row.contentKey.replace("home_", "") as keyof HomePageContent;
      if (key in content) {
        content[key] = row.contentValue;
      }
    }

    return content;
  } catch (error) {
    console.error("Error fetching home page content:", error);
    return defaultHomeContent;
  }
}

export async function updateHomePageContent(
  key: keyof HomePageContent,
  value: string
): Promise<boolean> {
  try {
    const contentKey = `home_${key}`;

    await db
      .insert(siteContent)
      .values({
        id: uuidv4(),
        contentKey,
        contentValue: value,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: siteContent.contentKey,
        set: {
          contentValue: value,
          updatedAt: new Date(),
        },
      });

    return true;
  } catch (error) {
    console.error("Error updating home page content:", error);
    return false;
  }
}

export async function updateAllHomePageContent(
  content: HomePageContent
): Promise<boolean> {
  try {
    for (const [key, value] of Object.entries(content)) {
      await updateHomePageContent(key as keyof HomePageContent, value);
    }

    return true;
  } catch (error) {
    console.error("Error updating all home page content:", error);
    return false;
  }
}

// Get home page sections (new flexible format)
export async function getHomePageSections(): Promise<HomeSection[]> {
  if (!process.env.DATABASE_URL) {
    return defaultHomeSections;
  }

  try {
    const rows = await db
      .select({ contentValue: siteContent.contentValue })
      .from(siteContent)
      .where(eq(siteContent.contentKey, "home_sections"));

    if (rows.length > 0 && rows[0].contentValue) {
      return JSON.parse(rows[0].contentValue);
    }

    return defaultHomeSections;
  } catch (error) {
    console.error("Error fetching home page sections:", error);
    return defaultHomeSections;
  }
}

// Update home page sections
export async function updateHomePageSections(
  sections: HomeSection[]
): Promise<boolean> {
  try {
    const value = JSON.stringify(sections);

    await db
      .insert(siteContent)
      .values({
        id: uuidv4(),
        contentKey: "home_sections",
        contentValue: value,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: siteContent.contentKey,
        set: {
          contentValue: value,
          updatedAt: new Date(),
        },
      });

    return true;
  } catch (error) {
    console.error("Error updating home page sections:", error);
    return false;
  }
}
