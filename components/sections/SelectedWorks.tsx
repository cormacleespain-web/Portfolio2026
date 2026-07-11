"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useSyncExternalStore } from "react";
import { motion, useInView } from "motion/react";
import { ArrowRight } from "@phosphor-icons/react";
import { projects, type Project } from "@/content/projects";

interface FeaturedProject extends Project {
  summary: string;
}

function getSummary(project: Project): string {
  if (project.tagline?.trim()) return project.tagline.trim();
  if (!project.description?.trim()) return "Explore the challenge, process, and outcome.";
  const firstParagraph = project.description.split(/\n\n+/).find(Boolean)?.trim() ?? "";
  if (!firstParagraph) return "Explore the challenge, process, and outcome.";
  return firstParagraph.length > 220
    ? `${firstParagraph.slice(0, 217)}...`
    : firstParagraph;
}

const FEATURED_PROJECTS: FeaturedProject[] = projects
  .filter((project) => !project.hidden)
  .slice(0, 3)
  .map((project) => ({
    ...project,
    summary: getSummary(project),
  }));

const CARD_BG_CLASSES = [
  "bg-gradient-to-b from-background to-accent-2",
  "bg-gradient-to-b from-accent-2 to-accent",
  "bg-gradient-to-b from-accent to-background",
] as const;

const springTransition = { type: "spring" as const, stiffness: 300, damping: 28 };

const HOVER_QUERY = "(hover: hover)";

function subscribeCanHover(callback: () => void) {
  const mq = window.matchMedia(HOVER_QUERY);
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

function getCanHoverSnapshot() {
  return window.matchMedia(HOVER_QUERY).matches;
}

function useCanHover() {
  return useSyncExternalStore(subscribeCanHover, getCanHoverSnapshot, () => true);
}

function CaseStudyCard({ project, index }: { project: FeaturedProject; index: number }) {
  const [hovered, setHovered] = useState(false);
  const canHover = useCanHover();
  const imageRef = useRef<HTMLDivElement>(null);
  const inView = useInView(imageRef, { once: true, margin: "-15%" });
  const caseStudyHref = `/work/${project.slug}`;

  const fanned = canHover ? hovered : inView;

  return (
    <article
      className={`selected-works-card relative z-10 flex min-h-dvh flex-col md:grid md:grid-cols-[1.05fr_0.95fr] md:items-center md:gap-6 lg:gap-10 ${CARD_BG_CLASSES[index % CARD_BG_CLASSES.length]}`}
      style={{ minHeight: "100dvh" }}
    >
      <div className="flex items-center justify-center px-6 pt-10 pb-2 md:flex-1 md:min-h-0 md:p-10">
        <div
          ref={imageRef}
          className="relative w-full max-w-xl py-6 md:py-0"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          {/* Backing card – fans left */}
          <motion.div
            className="absolute inset-x-0 top-6 bottom-6 md:inset-0 rounded-2xl border border-white/10 bg-white/[0.04]"
            initial={false}
            animate={fanned
              ? { y: 18, x: -30, rotate: -5, scale: 0.96, opacity: 1 }
              : { y: 0, x: 0, rotate: 0, scale: 1, opacity: 0 }
            }
            transition={springTransition}
            aria-hidden
          />
          {/* Backing card – fans right */}
          <motion.div
            className="absolute inset-x-0 top-6 bottom-6 md:inset-0 rounded-2xl border border-white/15 bg-white/[0.07]"
            initial={false}
            animate={fanned
              ? { y: 18, x: 30, rotate: 5, scale: 0.96, opacity: 1 }
              : { y: 0, x: 0, rotate: 0, scale: 1, opacity: 0 }
            }
            transition={springTransition}
            aria-hidden
          />
          {/* Main image – lifts forward, double-bezel nested hardware treatment */}
          <motion.div
            className="bezel-outer shadow-2xl backdrop-blur-[1px]"
            initial={false}
            animate={fanned ? { y: -8, scale: 1.03 } : { y: 0, scale: 1 }}
            transition={springTransition}
          >
            <div className="bezel-inner bg-black/20">
              <Link href={caseStudyHref} prefetch={false} className="block" aria-label={`Open case study for ${project.title}`}>
                {project.image ? (
                  <div className="relative aspect-[4/3] w-full">
                    <Image
                      src={project.image}
                      alt={`${project.title} case study preview`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 767px) 100vw, 52vw"
                      priority={index === 0}
                      quality={95}
                    />
                  </div>
                ) : (
                  <div className="flex aspect-[4/3] items-center justify-center text-sm font-medium text-white/70">
                    Project visual coming soon
                  </div>
                )}
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="flex flex-col justify-center px-6 pb-14 pt-2 md:flex-1 md:max-w-xl md:px-10 md:py-12">
        <h3 className="text-2xl font-bold tracking-tight text-white md:text-3xl lg:text-4xl">
          {project.title}
        </h3>
        <p className="mt-4 text-base leading-relaxed text-white/85 md:text-lg">
          {project.summary}
        </p>
        <p className="mt-4 text-sm text-white/70">{project.category}</p>
        <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs uppercase tracking-wide text-white/70">
          {project.timeframe && project.timeframe !== "—" && (
            <span>{project.timeframe}</span>
          )}
          {project.readTime && <span>{project.readTime}</span>}
        </div>
        <div className="mt-8">
          <motion.div
            className="inline-block"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            <Link
              href={caseStudyHref}
              prefetch={false}
              className="group inline-flex items-center gap-3 rounded-full bg-white py-1.5 pl-6 pr-1.5 text-sm font-semibold text-neutral-900 transition hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-white/60 focus:ring-offset-2 focus:ring-offset-transparent"
              aria-label={`Open case study for ${project.title}`}
            >
              Read case study
              <span className="btn-icon-well btn-icon-well-on-light">
                <ArrowRight weight="bold" className="h-4 w-4" aria-hidden />
              </span>
            </Link>
          </motion.div>
        </div>
      </div>
    </article>
  );
}

export function SelectedWorks() {
  if (FEATURED_PROJECTS.length === 0) return null;

  return (
    <section
      id="selected-works"
      className="relative left-1/2 -ml-[50vw] -mr-[50vw] w-screen pb-[16vh] pt-12 md:pt-16"
      style={{ minHeight: `${FEATURED_PROJECTS.length * 100}vh` }}
      aria-labelledby="selected-works-heading"
    >
      <header className="mb-8 md:text-center px-4 sm:px-6 max-w-7xl mx-auto">
        <h2
          id="selected-works-heading"
          className="text-2xl md:text-3xl font-bold text-text dark:drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]"
        >
          Selected Case Studies
        </h2>
      </header>

      {FEATURED_PROJECTS.map((project, index) => (
        <CaseStudyCard key={project.slug} project={project} index={index} />
      ))}

    </section>
  );
}
