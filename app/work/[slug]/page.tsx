import Image from "next/image";
import { notFound } from "next/navigation";
import { getProjectBySlug, projects } from "@/content/projects";
import { CaseStudyTimeline, type TimelinePhase } from "@/components/work/CaseStudyTimeline";
import { CaseStudyImagePlaceholder } from "@/components/work/CaseStudyImagePlaceholder";

const backHref = "/#selected-works";

const DEFAULT_TIMELINE_PHASES: TimelinePhase[] = [
  { label: "Discovery & context" },
  { label: "Research & insights" },
  { label: "Ideation & IA" },
  { label: "Design & wireframing" },
  { label: "Iteration & testing" },
  { label: "Delivery & results" },
];

interface ParsedSection {
  heading: string;
  body: string;
}

function parseCaseStudySections(description: string): ParsedSection[] {
  const chunks = description.trim().split(/\n\n+/).filter(Boolean);
  const sections: ParsedSection[] = [];
  for (let i = 0; i < chunks.length; i += 2) {
    const heading = chunks[i] ?? "";
    const body = chunks[i + 1] ?? "";
    if (heading && body) {
      sections.push({ heading: heading.replace(/\n/g, " ").trim(), body });
    } else if (heading && !body && sections.length > 0) {
      sections[sections.length - 1].body += "\n\n" + heading;
    } else if (heading) {
      sections.push({ heading, body: "" });
    }
  }
  return sections;
}

function sectionsToTimelinePhases(sections: ParsedSection[], max = 8): TimelinePhase[] {
  const fromHeadings = sections
    .slice(0, max)
    .map((s) => ({ label: s.heading, short: s.heading.length > 28 ? s.heading.slice(0, 26) + "…" : s.heading }));
  return fromHeadings.length >= 3 ? fromHeadings : DEFAULT_TIMELINE_PHASES;
}

interface WorkPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export default async function WorkPage({ params }: WorkPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const sections = project.description
    ? parseCaseStudySections(project.description)
    : [];
  const timelinePhases = sectionsToTimelinePhases(sections);
  const hasStructuredContent = sections.length > 0;

  return (
    <article className="py-8">
      {/* Back navigation */}
      <a
        href={backHref}
        className="mb-8 inline-flex items-center gap-2 text-body-sm text-text-muted hover:text-accent"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Back
      </a>

      {/* Hero image */}
      {project.image && (
        <div className="relative mb-10 aspect-video w-full overflow-hidden rounded-xl border border-border bg-surface">
          <Image
            src={project.image}
            alt=""
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 672px"
            priority
          />
        </div>
      )}

      {/* Project header — Senior PD case study style */}
      <header className="mb-10">
        <p className="text-section font-semibold uppercase tracking-wider text-accent">
          Case Study
        </p>
        <h1 className="mt-2 text-hero font-bold text-text">{project.title}</h1>
        {project.tagline && (
          <p className="mt-3 text-body-lg text-text-muted">{project.tagline}</p>
        )}
        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-caption text-text-subtle">
          <span>{project.category}</span>
          {project.timeframe && project.timeframe !== "—" && (
            <span>{project.timeframe}</span>
          )}
          {project.readTime && <span>{project.readTime}</span>}
        </div>
      </header>

      {/* Overview / intro placeholder when we have structured sections */}
      {hasStructuredContent && sections[0] && (
        <>
          <section className="mb-12">
            <h2 className="text-section font-semibold uppercase tracking-wider text-text-muted mb-4">
              Overview
            </h2>
            <p className="whitespace-pre-wrap text-body text-text-muted max-w-3xl">
              {sections[0].body}
            </p>
          </section>
          <CaseStudyImagePlaceholder
            label="Hero / project context"
            aspectRatio="wide"
            className="mb-12"
          />
        </>
      )}

      {/* Process timeline */}
      <section className="mb-14" aria-labelledby="timeline-heading">
        <h2 id="timeline-heading" className="text-section font-semibold uppercase tracking-wider text-text-muted mb-6">
          Process
        </h2>
        <CaseStudyTimeline phases={timelinePhases} />
      </section>

      {/* Case study body: sections with image placeholders */}
      <div className="space-y-16">
        {hasStructuredContent ? (
          sections.slice(1).map((section, i) => (
            <div key={section.heading}>
              <section>
                <h2 className="text-section font-semibold uppercase tracking-wider text-text-muted mb-4">
                  {section.heading}
                </h2>
                <p className="whitespace-pre-wrap text-body text-text-muted max-w-3xl">
                  {section.body}
                </p>
              </section>
              <CaseStudyImagePlaceholder
                label={section.heading}
                aspectRatio={i % 2 === 0 ? "video" : "square"}
                className="mt-8"
              />
            </div>
          ))
        ) : project.description ? (
          <>
            <section>
              <h2 className="text-section font-semibold uppercase tracking-wider text-text-muted mb-4">
                Overview
              </h2>
              <p className="whitespace-pre-wrap text-body text-text-muted max-w-3xl">
                {project.description}
              </p>
            </section>
            <CaseStudyImagePlaceholder label="Project detail" aspectRatio="video" />
          </>
        ) : (
          <>
            <p className="text-body-sm text-text-muted max-w-2xl">
              Case study content. Edit this project in{" "}
              <code className="rounded bg-surface border border-border px-1.5 py-0.5 text-caption">
                content/projects.ts
              </code>{" "}
              or add a dedicated content source (e.g. MDX) for the body.
            </p>
            <CaseStudyImagePlaceholder label="Add hero or key screenshot" aspectRatio="video" />
          </>
        )}
      </div>

      {/* Closing CTA / back */}
      <div className="mt-16 pt-8 border-t border-border">
        <a
          href={backHref}
          className="inline-flex items-center gap-2 text-body-sm font-medium text-text-muted hover:text-accent"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back
        </a>
      </div>
    </article>
  );
}
