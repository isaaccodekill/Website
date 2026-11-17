import "server-only";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
export async function isOwner() {
  const session = await auth();
  return session?.user?.id === "35108225";
}
export async function requireOwner() {
  if (!(await isOwner())) redirect("/cms/login");
}
export async function studioApiGuard(request?: Request) {
  if (!(await isOwner()))
    return NextResponse.json(
      { error: "Please sign in to your notebook." },
      { status: 401, headers: { "Cache-Control": "no-store" } },
    );
  if (request && !["GET", "HEAD"].includes(request.method)) {
    const origin = request.headers.get("origin");
    const expected = process.env.AUTH_URL
      ? new URL(process.env.AUTH_URL).origin
      : new URL(request.url).origin;
    if (!origin || origin !== expected)
      return NextResponse.json(
        { error: "Invalid request origin" },
        { status: 403 },
      );
  }
  return null;
}
