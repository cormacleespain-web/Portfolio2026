"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import type { Project } from "@/content/projects";

interface CaseStudyHeroProps {
  project: Project;
}

const META_ITEMS_DELAY_STEP = 0.08;

export function CaseStudyHero({ project }: CaseStudyHeroProps) {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);

  const metaItems: { label: string; value: string }[] = [];
  if (project.role) metaItems.push({ label: "Role", value: project.role });
  if (project.team) metaItems.push({ label: "Team", value: project.team });
  if (project.timeframe && project.timeframe !== "—")
    metaItems.push({ label: "Timeline", value: project.timeframe });
  if (project.tools?.length)
    metaItems.push({ label: "Tools", value: project.tools.join(", ") });

  return (
    <header ref={heroRef} className="mb-12">
      {/* Back navigation */}
      <Link
        href="/#selected-works"
        className="mb-8 inline-flex items-center gap-2 text-body-sm text-text-muted transition-colors hover:text-accent"
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
        Back
      </Link>

      {/* Parallax hero image */}
      {project.image && (
        <div className="relative mb-10 aspect-video w-full overflow-hidden rounded-xl border border-border bg-surface">
          <motion.div className="absolute inset-0" style={{ y: imageY }}>
            <Image
              src={project.image}
              alt={`${project.title} case study cover`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 960px"
              priority
            />
          </motion.div>
        </div>
      )}

      {/* Title block */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <p className="text-section font-semibold uppercase tracking-wider text-accent">
          Case Study
        </p>
        <h1 className="mt-2 text-display font-display font-bold text-text">{project.title}</h1>
        {project.tagline && (
          <p className="mt-3 max-w-2xl text-body-lg text-text-muted">
            {project.tagline}
          </p>
        )}
      </motion.div>

      {/* Metadata strip */}
      {metaItems.length > 0 && (
        <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-4">
          {metaItems.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.4,
                ease: "easeOut",
                delay: 0.3 + i * META_ITEMS_DELAY_STEP,
              }}
              className="border-l-2 border-accent pl-4"
            >
              <p className="text-caption font-semibold uppercase tracking-wider text-text-subtle">
                {item.label}
              </p>
              <p className="mt-1 text-body-sm text-text">{item.value}</p>
            </motion.div>
          ))}
        </div>
      )}

      {/* Fallback metadata for unmigrated projects */}
      {metaItems.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-caption text-text-subtle"
        >
          <span>{project.category}</span>
          {project.timeframe && project.timeframe !== "—" && (
            <span>{project.timeframe}</span>
          )}
          {project.readTime && <span>{project.readTime}</span>}
        </motion.div>
      )}
    </header>
  );
}
