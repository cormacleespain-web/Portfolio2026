import Image from "next/image";
import Link from "next/link";
import { projects } from "@/content/projects";
import { Section } from "@/components/ui/Section";
import { Tag } from "@/components/ui/Tag";

const visibleProjects = () => projects.filter((p) => !p.hidden);

export function OtherWorks() {
  const rest = visibleProjects().slice(3);
  if (rest.length === 0) return null;

  return (
    <Section id="other-works" title="Other works">
      <ul className="space-y-3" role="list">
        {rest.map((project) => (
          <li key={project.slug}>
            <Link
              href={`/work/${project.slug}`}
              prefetch={false}
              className="group flex flex-col gap-2 rounded-xl border border-border bg-surface p-4 transition hover:border-border hover:bg-surface-hover sm:flex-row sm:items-start sm:gap-4 sm:p-5"
            >
              {project.image && (
                <div className="relative w-full shrink-0 overflow-hidden rounded-lg border border-border aspect-video sm:w-72 sm:min-w-[280px]">
                  <Image
                    src={project.image}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 315px"
                  />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <span className="text-body-lg font-semibold text-text group-hover:text-accent">
                    {project.title}
                  </span>
                  <Tag className="shrink-0">{project.readTime}</Tag>
                </div>
                <div className="flex flex-wrap gap-x-2 gap-y-0 text-caption text-text-muted">
                  <span>{project.category}</span>
                  {project.timeframe && project.timeframe !== "—" && (
                    <>
                      <span aria-hidden className="text-text-subtle">·</span>
                      <span>{project.timeframe}</span>
                    </>
                  )}
                </div>
                {project.tagline && (
                  <p className="text-body-sm text-text-muted">
                    {project.tagline}
                  </p>
                )}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </Section>
  );
}
