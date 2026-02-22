"use client";

import { Fragment } from "react";
import { siteData } from "@/content/siteData";

const EMPLOYER_FAVICONS = [
  { name: "Wizeline", href: "https://wizeline.com", favicon: "https://www.google.com/s2/favicons?domain=wizeline.com&sz=64" },
  { name: "Dow Jones", href: "https://dowjones.com", favicon: "https://www.google.com/s2/favicons?domain=dowjones.com&sz=64" },
] as const;

const EMPLOYER_PLACEHOLDER = "Wizeline & DowJones";

export function Hero() {
  const { name, supportingText } = siteData.hero;
  const parts = supportingText.split(EMPLOYER_PLACEHOLDER);
  const hasEmployerIcons = parts.length === 2;
  const [before, after] = hasEmployerIcons ? parts : [supportingText, null];

  return (
    <section
      className="relative overflow-hidden min-h-[78vh] flex flex-col justify-end pt-[1.6rem] pb-[4.8rem] md:pt-[2.4rem] md:pb-[7.2rem]"
      id="hero"
      aria-labelledby="hero-heading"
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-center md:gap-8">
        <div className="relative z-10 min-w-0 flex-1 flex flex-col items-center text-center max-w-5xl mx-auto">
        <header className="w-full">
          <h1
            id="hero-heading"
            className="text-hero font-bold text-text dark:drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]"
          >
            <span className="flex flex-col gap-[0.25em]">
              <span>I'm <span className="font-hero-name text-[1.2em]">{name}</span>
              <span className="hero-heading-asterisk ml-4" aria-hidden>*</span></span>
              <span className="block leading-[1.5]">
                {" A Senior Designer "}
                <span className="hero-heading-accent-green">evolving</span>
                {" the "}
                <span className="hero-heading-accent-blue">products</span>
                {" behind global "}
                <span className="hero-heading-accent-pink">decision-making</span>
              </span>
            </span>
          </h1>
        </header>
        <p className="mt-[1.8rem] w-full text-body text-text-muted dark:drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)] text-center">
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
                    aria-label={`Visit ${name}`}
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
        </div>
      </div>
    </section>
  );
}
