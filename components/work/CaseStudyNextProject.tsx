"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight } from "@phosphor-icons/react";
import type { Project } from "@/content/projects";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

interface CaseStudyNextProjectProps {
  project: Project;
  className?: string;
}

export function CaseStudyNextProject({
  project,
  className = "",
}: CaseStudyNextProjectProps) {
  return (
    <ScrollReveal className={className}>
      <section className="mt-20 pt-12 border-t border-border">
        <p className="mb-6 text-caption font-semibold uppercase tracking-wider text-text-subtle">
          Next Case Study
        </p>
        <Link href={`/work/${project.slug}`} prefetch={false}>
          <motion.div
            className="group relative overflow-hidden rounded-2xl border border-border bg-surface transition-colors hover:border-accent/50"
            whileHover={{ y: -4 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            {project.image && (
              <div className="relative aspect-[21/9] w-full overflow-hidden">
                <Image
                  src={project.image}
                  alt={`${project.title} case study`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 960px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </div>
            )}
            <div className="px-6 py-6 sm:px-8">
              <h3 className="text-body-lg font-bold text-text group-hover:text-accent transition-colors">
                {project.title}
              </h3>
              {project.tagline && (
                <p className="mt-1 text-body-sm text-text-muted">
                  {project.tagline}
                </p>
              )}
              <span className="mt-4 inline-flex items-center gap-1.5 text-body-sm font-medium text-accent">
                Read case study
                <ArrowRight
                  weight="light"
                  className="h-4 w-4 transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-1"
                  aria-hidden
                />
              </span>
            </div>
          </motion.div>
        </Link>
      </section>
    </ScrollReveal>
  );
}
