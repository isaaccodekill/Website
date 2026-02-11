import { NextResponse } from "next/server";
import { updateHomePageSections, HomeSection } from "@/lib/site-content";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Handle the new sections format
    if (body.sections && Array.isArray(body.sections)) {
      const sections: HomeSection[] = body.sections;

      // Validate sections
      for (const section of sections) {
        if (!section.id || typeof section.text !== "string") {
          return NextResponse.json(
            { error: "Invalid section format" },
            { status: 400 }
          );
        }
      }

      const success = await updateHomePageSections(sections);

      if (success) {
        return NextResponse.json({ message: "Content saved successfully" });
      } else {
        return NextResponse.json(
          { error: "Failed to save content" },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { error: "Invalid request format" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error saving home content:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
