import { NextRequest } from "next/server";
import OpenAI from "openai";
import { projects } from "@/content/projects";
import { siteData } from "@/content/siteData";

const openai = new OpenAI({ apiKey: process.env.API_KEY });

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

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!process.env.API_KEY) {
      return new Response(
        JSON.stringify({ error: "OpenAI API key not configured" }),
        { status: 503, headers: { "Content-Type": "application/json" } },
      );
    }

    const stream = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      stream: true,
      max_tokens: 1024,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...messages.slice(-20),
      ],
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
  } catch {
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}
