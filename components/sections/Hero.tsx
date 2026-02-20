"use client";

import { Fragment } from "react";
import Link from "next/link";
import { siteData } from "@/content/siteData";
import { RocketScene } from "@/components/three/RocketScene";

const EMPLOYER_FAVICONS = [
  { name: "Wizeline", href: "https://wizeline.com", favicon: "https://www.google.com/s2/favicons?domain=wizeline.com&sz=64" },
  { name: "Dow Jones", href: "https://dowjones.com", favicon: "https://www.google.com/s2/favicons?domain=dowjones.com&sz=64" },
] as const;

const EMPLOYER_PLACEHOLDER = "Wizeline & DowJones";

export function Hero() {
  const { positioningLine, supportingText, ctaPrimary, ctaSecondary } = siteData.hero;
  const parts = supportingText.split(EMPLOYER_PLACEHOLDER);
  const hasEmployerIcons = parts.length === 2;
  const [before, after] = hasEmployerIcons ? parts : [supportingText, null];

  return (
    <section
      className="relative overflow-hidden pt-[1.6rem] pb-[4.8rem] md:pt-[2.4rem] md:pb-[7.2rem]"
      id="hero"
      aria-labelledby="hero-heading"
    >
      <div className="flex flex-col md:flex-row md:items-center md:gap-8">
        {/* Mobile: canvas on top, copy below. Desktop: copy left, canvas right */}
        <div
          className="order-1 md:order-2 h-[400px] min-h-[400px] w-full md:h-[520px] md:min-h-[520px] md:w-[45%] md:max-w-[520px] md:shrink-0"
          aria-hidden
        >
          <RocketScene
            className="h-full w-full"
            controls={true}
            pointerEvents="auto"
            fillParent
            hideBackground
            transparentBackground
            sceneScale={1.2}
            scenePositionX={0}
          />
        </div>

        <div className="order-2 md:order-1 relative z-10 min-w-0 flex-1">
        <header>
          <h1
            id="hero-heading"
            className="text-hero font-bold text-text dark:drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]"
          >
            <span className="block">{positioningLine}</span>
          </h1>
        </header>
        <p className="mt-[1.8rem] max-w-xl text-body text-text-muted dark:drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]">
          {before}
          {hasEmployerIcons && (
            <span className="inline-flex items-center gap-1.5 align-middle ml-1 mr-1">
              {EMPLOYER_FAVICONS.map(({ name, href, favicon }, index) => (
                <Fragment key={name}>
                  {index > 0 && (
                    <span className="mx-0.5 text-text-muted/80" aria-hidden>
                      +
                    </span>
                  )}
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hero-employer-icon-glow inline-flex h-7 w-7 shrink-0 rounded-lg bg-white p-0.5 focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    title={name}
                  >
                    <span className="hero-employer-icon-glow-inner" aria-hidden />
                    <img
                      src={favicon}
                      alt=""
                      width={24}
                      height={24}
                      className="relative h-full w-full rounded-[4px] object-contain"
                    />
                  </a>
                </Fragment>
              ))}
            </span>
          )}
          {after}
        </p>
        <nav
          className="mt-[2rem] flex flex-wrap items-center gap-4"
          aria-label="Hero actions"
        >
          <Link
            href={ctaPrimary.href}
            className="hero-cta-primary inline-flex items-center justify-center rounded-md px-5 py-2.5 text-sm font-bold shadow transition-[filter,color] focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring"
          >
            {ctaPrimary.label}
          </Link>
          <span className="hero-cta-secondary-wrap">
            <Link
              href={ctaSecondary.href}
              className="hero-cta-secondary-inner focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              {ctaSecondary.label}
            </Link>
          </span>
        </nav>
        </div>
      </div>
    </section>
  );
}
