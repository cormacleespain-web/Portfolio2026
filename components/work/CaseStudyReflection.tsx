"use client";

import { ScrollReveal } from "@/components/ui/ScrollReveal";

interface CaseStudyReflectionProps {
  reflection: string;
  className?: string;
}

export function CaseStudyReflection({
  reflection,
  className = "",
}: CaseStudyReflectionProps) {
  return (
    <ScrollReveal className={className}>
      <section className="my-16 rounded-2xl border border-border bg-surface px-6 py-10 sm:px-10">
        <p className="mb-4 text-caption font-semibold uppercase tracking-wider text-accent">
          Reflection
        </p>
        <p className="max-w-3xl text-body leading-relaxed text-text-muted">
          {reflection}
        </p>
      </section>
    </ScrollReveal>
  );
}
