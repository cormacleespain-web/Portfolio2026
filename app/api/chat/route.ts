import { NextRequest } from "next/server";
import OpenAI from "openai";
import { projects } from "@/content/projects";
import { siteData } from "@/content/siteData";

let _openai: OpenAI | null = null;
function getClient() {
  if (!_openai) _openai = new OpenAI({ apiKey: process.env.API_KEY });
  return _openai;
}

function buildSystemPrompt(): string {
  const hero = siteData.hero;
  const experiences = siteData.experiences
    .map((e) => `- ${e.timeframe}: ${e.title} at ${e.company}`)
    .join("\n");
  const education = siteData.education
    .map((e) => `- ${e.timeframe}: ${e.degree}, ${e.institution}`)
    .join("\n");
  const brands = siteData.brands.map((b) => b.name).join(", ");
  const contact = siteData.contact;

  const projectSummaries = projects
    .filter((p) => !p.hidden)
    .map((p) => {
      let summary = `## ${p.title}\n`;
      summary += `Slug: /work/${p.slug}\n`;
      summary += `Category: ${p.category}\n`;
      if (p.tagline) summary += `Tagline: ${p.tagline}\n`;
      if (p.role) summary += `Role: ${p.role}\n`;
      if (p.team) summary += `Team: ${p.team}\n`;
      if (p.tools?.length) summary += `Tools: ${p.tools.join(", ")}\n`;
      if (p.problem) summary += `Problem:\n${p.problem}\n`;
      if (p.impact?.length) {
        summary += `Impact:\n${p.impact.map((i) => `- ${i.label}: ${i.value}`).join("\n")}\n`;
      }
      if (p.sections?.length) {
        summary += `Case Study Sections:\n`;
        for (const s of p.sections) {
          summary += `### ${s.heading}\n${s.body}\n`;
          if (s.callout) summary += `Key insight: ${s.callout}\n`;
        }
      }
      if (p.reflection) summary += `Reflection: ${p.reflection}\n`;
      if (p.description) summary += `Description: ${p.description}\n`;
      return summary;
    })
    .join("\n---\n\n");

  return `You are a friendly, knowledgeable assistant embedded on Cormac Lee's portfolio website. Your role is to help visitors learn about Cormac's work, experience, and design philosophy.

Answer questions conversationally and accurately based ONLY on the information below. If you don't know something, say so honestly — don't make things up. Keep responses concise but informative. Use markdown formatting when it helps readability.

When discussing case studies, reference specific details like tools used, process steps, and outcomes. If someone asks about a project, you can suggest they visit /work/<slug> for the full case study.

If someone asks about unreleased, confidential, or in-progress work that isn't described below, decline gracefully — say that project isn't public yet rather than speculating or inventing details.

---

# About Cormac Lee

${hero.positioningLine}

${hero.supportingText}

# Work Experience
${experiences}

# Education
${education}

# Brands Worked With
${brands}

# Contact
Email: ${contact.email}
Links: ${contact.links.map((l) => `${l.label}: ${l.href}`).join(", ")}

---

# Case Studies & Projects

${projectSummaries}`;
}

const SYSTEM_PROMPT = buildSystemPrompt();

const MAX_MESSAGES = 20;
const MAX_MESSAGE_LENGTH = 4000;

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

function validateMessages(body: unknown): ChatMessage[] | null {
  if (typeof body !== "object" || body === null || !("messages" in body)) {
    return null;
  }
  const { messages } = body as { messages: unknown };
  if (!Array.isArray(messages) || messages.length === 0 || messages.length > MAX_MESSAGES) {
    return null;
  }
  for (const m of messages) {
    if (
      typeof m !== "object" ||
      m === null ||
      (m.role !== "user" && m.role !== "assistant") ||
      typeof m.content !== "string" ||
      m.content.length === 0 ||
      m.content.length > MAX_MESSAGE_LENGTH
    ) {
      return null;
    }
  }
  return messages as ChatMessage[];
}

function jsonResponse(status: number, error: string) {
  return new Response(JSON.stringify({ error }), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return jsonResponse(400, "Invalid request body");
  }

  const messages = validateMessages(body);
  if (!messages) {
    return jsonResponse(
      400,
      `Invalid messages: expected 1-${MAX_MESSAGES} messages, each under ${MAX_MESSAGE_LENGTH} characters`,
    );
  }

  if (!process.env.API_KEY) {
    return jsonResponse(503, "Assistant unavailable — API key not configured");
  }

  try {
    const stream = await getClient().chat.completions.create({
      model: "gpt-4o-mini",
      stream: true,
      max_tokens: 1024,
      messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content;
            if (content) {
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ content })}\n\n`),
              );
            }
          }
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        } catch (err) {
          console.error("[api/chat] stream error:", err instanceof Error ? err.message : err);
          controller.error(err);
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (err) {
    if (err instanceof OpenAI.APIError) {
      if (err.status === 401 || err.status === 403) {
        console.error("[api/chat] OpenAI auth error, status:", err.status);
        return jsonResponse(503, "Assistant unavailable — please try again later");
      }
      if (err.status === 429) {
        console.error("[api/chat] OpenAI rate limited");
        return jsonResponse(429, "Assistant is busy — please try again shortly");
      }
      console.error("[api/chat] OpenAI API error:", err.status, err.message);
      return jsonResponse(500, "Something went wrong talking to the assistant");
    }
    console.error("[api/chat] unexpected error:", err instanceof Error ? err.message : err);
    return jsonResponse(500, "Internal server error");
  }
}
