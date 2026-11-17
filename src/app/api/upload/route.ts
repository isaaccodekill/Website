import { NextResponse } from "next/server";
import { studioApiGuard } from "@/lib/studio-auth";
export async function POST(request: Request) {
  const denied = await studioApiGuard(request);
  if (denied) return denied;
  const form = await request.formData();
  const file = form.get("file");
  if (
    !(file instanceof File) ||
    !["image/png", "image/jpeg", "image/webp", "image/gif"].includes(
      file.type,
    ) ||
    file.size > 2 * 1024 * 1024
  )
    return NextResponse.json(
      { error: "Choose a PNG, JPEG, WebP or GIF under 2 MB." },
      { status: 400 },
    );
  return NextResponse.json(
    {
      url: `data:${file.type};base64,${Buffer.from(await file.arrayBuffer()).toString("base64")}`,
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
