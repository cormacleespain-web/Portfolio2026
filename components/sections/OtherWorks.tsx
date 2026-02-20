"use client";

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
    <>
      {/* Edge-to-edge band: gradient (masked) behind, glass + content (full opacity) on top */}
      <div className="other-works-band relative left-1/2 right-1/2 w-screen -translate-x-1/2 py-48 sm:py-44 md:py-40 lg:py-36">
        <div className="other-works-band-bg" aria-hidden />
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
          <div className="overflow-hidden rounded-2xl">
            <div className="other-works-glass relative overflow-hidden rounded-2xl p-5 md:p-6">
            <Section
              id="other-works"
              title="Other works"
              className="relative z-10 py-0 md:py-0"
              headerClassName="mb-2"
              titleClassName="text-2xl md:text-3xl font-bold text-white/90 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]"
            >
              <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3 lg:grid-cols-4 lg:gap-2" role="list">
                {rest.map((project) => (
                  <li key={project.slug} className="flex">
                    <Link
                      href={`/work/${project.slug}`}
                      prefetch={false}
                      className="group flex h-full w-full flex-col gap-1.5 rounded-lg border border-white/10 bg-white/5 p-2 transition hover:border-white/20 hover:bg-white/10 md:p-2.5"
                    >
                      {project.image && (
                        <div className="relative w-full shrink-0 overflow-hidden rounded-md border border-white/10 aspect-video">
                          <Image
                            src={project.image}
                            alt=""
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 25vw"
                          />
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-start justify-between gap-1.5">
                          <span className="text-body font-semibold text-white/95 group-hover:text-accent">
                            {project.title}
                          </span>
                          <Tag className="shrink-0 text-caption border-white/20 bg-white/10 text-white/80">
                            {project.readTime}
                          </Tag>
                        </div>
                        <div className="flex flex-wrap gap-x-2 gap-y-0 text-caption text-white/70">
                          <span>{project.category}</span>
                          {project.timeframe && project.timeframe !== "—" && (
                            <>
                              <span aria-hidden className="text-white/50">·</span>
                              <span>{project.timeframe}</span>
                            </>
                          )}
                        </div>
                        {project.tagline && (
                          <p className="text-body-sm text-white/60 line-clamp-2">
                            {project.tagline}
                          </p>
                        )}
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </Section>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
