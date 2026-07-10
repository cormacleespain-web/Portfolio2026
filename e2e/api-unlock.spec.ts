import { test, expect } from "@playwright/test";

const SITE_PASSWORD = process.env.SITE_PASSWORD ?? "ci-placeholder-password";

test.describe("/api/unlock", () => {
  test("accepts the correct password", async ({ request }) => {
    const res = await request.post("/api/unlock", {
      data: { password: SITE_PASSWORD },
    });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
  });

  test("rejects the wrong password", async ({ request }) => {
    const res = await request.post("/api/unlock", {
      data: { password: "definitely-wrong" },
    });
    expect(res.status()).toBe(401);
  });

  // Passwords of different lengths must still be rejected cleanly (T7 fix
  // hashes both sides to a fixed-length digest before comparing, so a
  // length mismatch can't throw or otherwise misbehave).
  test("rejects a password of different length without erroring", async ({ request }) => {
    const res = await request.post("/api/unlock", {
      data: { password: "x" },
    });
    expect(res.status()).toBe(401);
  });

  test("rejects a malformed body", async ({ request }) => {
    const res = await request.post("/api/unlock", {
      data: Buffer.from("{unterminated"),
      headers: { "Content-Type": "application/json" },
    });
    expect(res.status()).toBe(400);
  });
});
