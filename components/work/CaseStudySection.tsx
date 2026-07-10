"use client";

import Image from "next/image";
import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { CaseStudyGallery } from "@/components/work/CaseStudyGallery";
import { CaseStudyBeforeAfter } from "@/components/work/CaseStudyBeforeAfter";
import type { CaseStudySection as CaseStudySectionData } from "@/content/projects";

interface CaseStudySectionProps {
  heading: string;
  body: string;
  image?: string;
  imageAlt?: string;
  imageAspect?: "video" | "square" | "wide";
  callout?: string;
  variant?: CaseStudySectionData["variant"];
  images?: CaseStudySectionData["images"];
  index: number;
  className?: string;
}

const aspectClasses = {
  video: "aspect-video",
  square: "aspect-square",
  wide: "aspect-[21/9]",
};

export function CaseStudySection({
  heading,
  body,
  image,
  imageAlt,
  imageAspect = "video",
  callout,
  variant,
  images,
  index,
  className = "",
}: CaseStudySectionProps) {
  const imageRef = useRef<HTMLDivElement>(null);
  const imageInView = useInView(imageRef, { once: true, margin: "-80px" });
  const isEven = index % 2 === 0;

  return (
    <div className={`${className}`}>
      <ScrollReveal direction={isEven ? "left" : "right"} delay={0.05}>
        <section>
          <h2 className="mb-4 text-section font-semibold uppercase tracking-wider text-text-muted">
            {heading}
          </h2>
          <p className="max-w-3xl whitespace-pre-wrap text-body leading-relaxed text-text-muted">
            {body}
          </p>
        </section>
      </ScrollReveal>

      {/* Callout block */}
      {callout && (
        <ScrollReveal delay={0.15}>
          <blockquote className="my-8 border-l-4 border-accent/50 bg-surface px-6 py-5 text-body-sm italic text-text-muted rounded-r-lg">
            {callout}
          </blockquote>
        </ScrollReveal>
      )}

      {variant === "gallery" && images ? (
        <div ref={imageRef}>
          <CaseStudyGallery images={images} />
        </div>
      ) : variant === "beforeAfter" && images ? (
        <div ref={imageRef}>
          <CaseStudyBeforeAfter images={images} />
        </div>
      ) : (
        // Section image — omitted entirely when there's no real asset,
        // rather than rendering an empty placeholder block (D3).
        image && (
          <div ref={imageRef} className="mt-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={imageInView ? { opacity: 1, scale: 1 } : undefined}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <div
                className={`relative w-full overflow-hidden rounded-xl border border-border bg-surface ${aspectClasses[imageAspect]}`}
              >
                <Image
                  src={image}
                  alt={imageAlt ?? heading}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 960px"
                />
              </div>
            </motion.div>
          </div>
        )
      )}
    </div>
  );
}
