import Image from "next/image";
import Link from "next/link";
import { projects } from "@/content/projects";
import { Section } from "@/components/ui/Section";
import { Tag } from "@/components/ui/Tag";

const visibleProjects = () => projects.filter((p) => !p.hidden);

export function SelectedWorks() {
  const projectsList = visibleProjects();
  const firstThree = projectsList.slice(0, 3);

  return (
    <Section id="selected-works" title="Selected Works">
      {firstThree.length > 0 && (
        <ul
          className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:items-stretch"
          role="list"
        >
          {firstThree.map((project) => (
            <li key={project.slug} className="flex min-h-0">
              <div className="selected-work-glow-outer flex min-h-0 flex-1 flex-col">
                <Link
                  href={`/work/${project.slug}`}
                  prefetch={false}
                  className="group flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-border bg-surface transition hover:border-border hover:bg-surface-hover"
                >
                {project.image && (
                  <div className="relative aspect-video w-full shrink-0 overflow-hidden border-b border-border">
                    <Image
                      src={project.image}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, 33vw"
                    />
                  </div>
                )}
                <div className="flex min-h-0 flex-1 flex-col gap-2 p-4">
                  <div className="min-h-0 flex-1 space-y-2">
                    <span className="text-body-lg font-semibold text-text group-hover:text-accent">
                      {project.title}
                    </span>
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
                      <p className="text-body-sm text-text-muted line-clamp-2">
                        {project.tagline}
                      </p>
                    )}
                  </div>
                  <div className="mt-auto flex shrink-0 items-center justify-between gap-2 pt-2">
                    <span className="text-body-sm font-medium text-accent group-hover:text-accent-hover">
                      View case study →
                    </span>
                    <span className="text-caption text-text-muted">
                      {project.readTime}
                    </span>
                  </div>
                </div>
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Section>
  );
}
