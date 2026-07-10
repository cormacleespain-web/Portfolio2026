import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getProjectBySlug,
  projects,
  type CaseStudySection as CaseStudySectionData,
  type Project,
} from "@/content/projects";
import { CreativeWorkJsonLd } from "@/components/seo/CreativeWorkJsonLd";
import { CaseStudyHero } from "@/components/work/CaseStudyHero";
import { CaseStudyProblem } from "@/components/work/CaseStudyProblem";
import { CaseStudyImpact } from "@/components/work/CaseStudyImpact";
import {
  CaseStudyTimeline,
  type TimelinePhase,
} from "@/components/work/CaseStudyTimeline";
import { CaseStudySection } from "@/components/work/CaseStudySection";
import { CaseStudyReflection } from "@/components/work/CaseStudyReflection";
import { CaseStudyNextProject } from "@/components/work/CaseStudyNextProject";
import { CaseStudyPinnedPanels } from "@/components/work/CaseStudyPinnedPanels";
import { CaseStudyImagePlaceholder } from "@/components/work/CaseStudyImagePlaceholder";

// ── Fallback legacy parser for unmigrated projects ──────────────────────

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

function parseLegacySections(description: string): ParsedSection[] {
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

function sectionsToPhases(
  sections: CaseStudySectionData[] | ParsedSection[],
  max = 8,
): TimelinePhase[] {
  const fromHeadings = sections.slice(0, max).map((s) => ({
    label: s.heading,
    short:
      s.heading.length > 28 ? s.heading.slice(0, 26) + "\u2026" : s.heading,
  }));
  return fromHeadings.length >= 3 ? fromHeadings : DEFAULT_TIMELINE_PHASES;
}

// ── Route generation & metadata ─────────────────────────────────────────

interface WorkPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

function getProjectDescription(project: Project): string {
  if (project.tagline?.trim()) return project.tagline.trim();
  if (project.problem?.trim()) {
    const p = project.problem.trim();
    return p.length > 200 ? `${p.slice(0, 197)}...` : p;
  }
  return `Case study: ${project.title}, ${project.category}.`;
}

export async function generateMetadata({
  params,
}: WorkPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return { title: "Case Study" };

  const description = getProjectDescription(project);
  return {
    title: project.title,
    description,
    openGraph: {
      title: project.title,
      description,
      type: "article",
      url: `/work/${project.slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description,
    },
  };
}

// ── Page ─────────────────────────────────────────────────────────────────

export default async function WorkPage({ params }: WorkPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const hasStructured = !!project.sections?.length;

  // Resolve the next case study for the CTA
  const nextProject = project.nextProject
    ? getProjectBySlug(project.nextProject)
    : undefined;

  // ── Structured path ───────────────────────────────────────────────────
  if (hasStructured) {
    const allSections = project.sections!;
    const phases = sectionsToPhases(allSections);

    // Split: all sections except the last become pinned cards;
    // the trailing section (e.g. "Results") renders as a normal on-page section.
    const hasPinnedLayout = allSections.length >= 2;
    const cardSections = hasPinnedLayout ? allSections.slice(0, -1) : [];
    const trailingSections = hasPinnedLayout
      ? allSections.slice(-1)
      : allSections;

    return (
      <article className="py-8">
        <CreativeWorkJsonLd project={project} />
        <CaseStudyHero project={project} />

        {project.problem && <CaseStudyProblem problem={project.problem} />}

        {project.impact && project.impact.length > 0 && (
          <CaseStudyImpact metrics={project.impact} />
        )}

        {hasPinnedLayout ? (
          <CaseStudyPinnedPanels phases={phases} sections={cardSections} />
        ) : (
          <CaseStudyTimeline phases={phases} />
        )}

        {/* Trailing sections (e.g. Results) rendered as normal on-page content */}
        {trailingSections.length > 0 && (
          <div className="space-y-20">
            {trailingSections.map((section, i) => (
              <CaseStudySection
                key={section.heading}
                heading={section.heading}
                body={section.body}
                image={section.image}
                imageAlt={section.imageAlt}
                imageAspect={section.imageAspect}
                callout={section.callout}
                variant={section.variant}
                images={section.images}
                index={i}
              />
            ))}
          </div>
        )}

        {project.reflection && (
          <CaseStudyReflection reflection={project.reflection} />
        )}

        {nextProject && <CaseStudyNextProject project={nextProject} />}

        {!nextProject && (
          <div className="mt-16 pt-8 border-t border-border">
            <Link
              href="/#selected-works"
              className="inline-flex items-center gap-2 text-body-sm font-medium text-text-muted transition-colors hover:text-accent"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              All work
            </Link>
          </div>
        )}
      </article>
    );
  }

  // ── Legacy fallback for unmigrated projects ───────────────────────────
  const legacySections = project.description
    ? parseLegacySections(project.description)
    : [];
  const legacyPhases = sectionsToPhases(legacySections);
  const hasLegacy = legacySections.length > 0;

  return (
    <article className="py-8">
      <CreativeWorkJsonLd project={project} />
      <CaseStudyHero project={project} />

      {hasLegacy && legacySections[0] && (
        <>
          <section className="mb-12">
            <h2 className="mb-4 text-section font-semibold uppercase tracking-wider text-text-muted">
              Overview
            </h2>
            <p className="max-w-3xl whitespace-pre-wrap text-body text-text-muted">
              {legacySections[0].body}
            </p>
          </section>
          <CaseStudyImagePlaceholder
            label="Hero / project context"
            aspectRatio="wide"
            className="mb-12"
          />
        </>
      )}

      <CaseStudyTimeline phases={legacyPhases} />

      <div className="space-y-16">
        {hasLegacy ? (
          legacySections.slice(1).map((section, i) => (
            <div key={section.heading}>
              <section>
                <h2 className="mb-4 text-section font-semibold uppercase tracking-wider text-text-muted">
                  {section.heading}
                </h2>
                <p className="max-w-3xl whitespace-pre-wrap text-body text-text-muted">
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
              <h2 className="mb-4 text-section font-semibold uppercase tracking-wider text-text-muted">
                Overview
              </h2>
              <p className="max-w-3xl whitespace-pre-wrap text-body text-text-muted">
                {project.description}
              </p>
            </section>
            <CaseStudyImagePlaceholder
              label="Project detail"
              aspectRatio="video"
            />
          </>
        ) : (
          <>
            <p className="max-w-2xl text-body-sm text-text-muted">
              Case study content coming soon. Edit this project in{" "}
              <code className="rounded bg-surface border border-border px-1.5 py-0.5 text-caption">
                content/projects.ts
              </code>{" "}
              to add the full story.
            </p>
            <CaseStudyImagePlaceholder
              label="Add hero or key screenshot"
              aspectRatio="video"
            />
          </>
        )}
      </div>

      <div className="mt-16 pt-8 border-t border-border">
        <Link
          href="/#selected-works"
          className="inline-flex items-center gap-2 text-body-sm font-medium text-text-muted transition-colors hover:text-accent"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          All work
        </Link>
      </div>
    </article>
  );
}
