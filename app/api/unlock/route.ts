import { NextResponse } from "next/server";

const SITE_PASSWORD = process.env.SITE_PASSWORD;

export async function POST(request: Request) {
  if (!SITE_PASSWORD) {
    return NextResponse.json(
      { error: "Site password not configured" },
      { status: 503 }
    );
  }
  let body: { password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }
  const password = typeof body.password === "string" ? body.password : "";
  if (password === SITE_PASSWORD) {
    return NextResponse.json({ ok: true });
  }
  return NextResponse.json({ error: "Invalid password" }, { status: 401 });
}
