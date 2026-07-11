"use client";

import { motion, useInView } from "motion/react";
import { useRef, useEffect, useState } from "react";
import type { ImpactMetric } from "@/content/projects";

interface CaseStudyImpactProps {
  metrics: ImpactMetric[];
  className?: string;
}

function AnimatedValue({ value, inView }: { value: string; inView: boolean }) {
  const numericMatch = value.match(/^([+-]?)(\d+(?:\.\d+)?)(.*)/);
  const [display, setDisplay] = useState(numericMatch ? "0" : value);

  useEffect(() => {
    if (!inView || !numericMatch) return;

    const sign = numericMatch[1];
    const target = parseFloat(numericMatch[2]);
    const suffix = numericMatch[3];
    const isDecimal = numericMatch[2].includes(".");
    const duration = 1200;
    const start = performance.now();

    function tick(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = target * eased;
      setDisplay(
        `${sign}${isDecimal ? current.toFixed(1) : Math.round(current)}${suffix}`,
      );
      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }, [inView, numericMatch]);

  return <>{display}</>;
}

export function CaseStudyImpact({
  metrics,
  className = "",
}: CaseStudyImpactProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      className={`my-16 rounded-2xl border border-border bg-surface px-6 py-10 sm:px-10 ${className}`.trim()}
    >
      <h2 className="mb-8 text-xl md:text-2xl font-display font-bold text-text">
        Key Results
      </h2>
      <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
        {metrics.map((m, i) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : undefined}
            transition={{
              duration: 0.55,
              ease: [0.16, 1, 0.3, 1],
              delay: i * 0.1,
            }}
            className="text-center"
          >
            <p className="text-[2rem] font-bold leading-none text-accent sm:text-[2.5rem]">
              <AnimatedValue value={m.value} inView={inView} />
            </p>
            <p className="mt-2 text-body-sm text-text-muted">{m.label}</p>
            {m.caveat && (
              <p className="mt-1 text-caption text-text-subtle">{m.caveat}</p>
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );
}
