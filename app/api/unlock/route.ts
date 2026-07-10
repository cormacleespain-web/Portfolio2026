import { NextResponse } from "next/server";
import { createHash, timingSafeEqual } from "crypto";

const SITE_PASSWORD = process.env.SITE_PASSWORD;

// Constant-time compare via fixed-length digests — avoids both the
// non-constant-time `===` and timingSafeEqual's length-mismatch throw for
// inputs of different lengths.
function safeCompare(a: string, b: string): boolean {
  const digestA = createHash("sha256").update(a).digest();
  const digestB = createHash("sha256").update(b).digest();
  return timingSafeEqual(digestA, digestB);
}

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
  if (safeCompare(password, SITE_PASSWORD)) {
    return NextResponse.json({ ok: true });
  }
  return NextResponse.json({ error: "Invalid password" }, { status: 401 });
}
