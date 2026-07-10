import { test, expect } from "@playwright/test";

test.describe("/api/chat validation (T6)", () => {
  test("rejects an empty messages array", async ({ request }) => {
    const res = await request.post("/api/chat", { data: { messages: [] } });
    expect(res.status()).toBe(400);
  });

  test("rejects more than 20 messages", async ({ request }) => {
    const messages = Array.from({ length: 21 }, () => ({ role: "user", content: "hi" }));
    const res = await request.post("/api/chat", { data: { messages } });
    expect(res.status()).toBe(400);
  });

  test("rejects a message over 4000 characters", async ({ request }) => {
    const res = await request.post("/api/chat", {
      data: { messages: [{ role: "user", content: "x".repeat(4001) }] },
    });
    expect(res.status()).toBe(400);
  });

  test("rejects an invalid role", async ({ request }) => {
    const res = await request.post("/api/chat", {
      data: { messages: [{ role: "system", content: "hi" }] },
    });
    expect(res.status()).toBe(400);
  });

  test("rejects malformed JSON", async ({ request }) => {
    const res = await request.post("/api/chat", {
      data: Buffer.from("{unterminated"),
      headers: { "Content-Type": "application/json" },
    });
    expect(res.status()).toBe(400);
  });

  // With a valid-shaped body but no real OpenAI key (CI/local dev use a
  // placeholder), the upstream 401 must degrade to a friendly 503 — never
  // the old bare 500 (T1).
  test("valid request degrades to 503 when the upstream key is invalid", async ({ request }) => {
    const res = await request.post("/api/chat", {
      data: { messages: [{ role: "user", content: "hello" }] },
    });
    expect(res.status()).toBe(503);
    const body = await res.json();
    expect(body.error).not.toContain("Internal server error");
  });
});
