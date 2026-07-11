"use client";

import { ScrollReveal } from "@/components/ui/ScrollReveal";

interface CaseStudyProblemProps {
  problem: string;
  className?: string;
}

export function CaseStudyProblem({
  problem,
  className = "",
}: CaseStudyProblemProps) {
  return (
    <ScrollReveal className={className}>
      <section className="my-16 border-l-4 border-accent pl-6 sm:pl-8">
        <h2 className="mb-3 text-xl md:text-2xl font-display font-bold text-accent">
          The Challenge
        </h2>
        <p className="max-w-3xl text-body-lg leading-relaxed text-text sm:text-[1.375rem]">
          {problem}
        </p>
      </section>
    </ScrollReveal>
  );
}
