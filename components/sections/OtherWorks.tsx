"use client";

import Image from "next/image";
import Link from "next/link";
import { siteData } from "@/content/siteData";

function isExternalLogo(logo: string) {
  return logo.startsWith("http://") || logo.startsWith("https://");
}

export function OtherWorks() {
  const brands = siteData.brands;
  if (!brands?.length) return null;

  return (
    <>
      <div className="people-worked-with-band relative left-1/2 right-1/2 w-screen -translate-x-1/2 py-24 sm:py-20 md:py-28">
        <div className="people-worked-with-band-bg" aria-hidden />
        <div className="relative z-10">
          <section
            id="people-worked-with"
            className="relative z-10"
            aria-labelledby="people-worked-with-heading"
          >
            <h2
              id="people-worked-with-heading"
              className="mb-8 text-center text-sm font-light tracking-wide text-white/80 md:text-base"
            >
              People I've Worked With
            </h2>
            <div className="people-worked-with-marquee-wrap w-full overflow-hidden">
              <div className="people-worked-with-marquee-track flex w-max items-center">
                <span className="flex shrink-0 items-center gap-12 md:gap-16">
                  {brands.map((brand) => (
                    <BrandLogo key={`a-${brand.name}`} brand={brand} />
                  ))}
                  {/* Spacer matches gap between logos; negative margin so seam gap = single gap not gap+spacer */}
                  <span className="marquee-separator w-12 shrink-0 md:w-16" aria-hidden />
                </span>
                <span className="marquee-duplicate flex shrink-0 items-center gap-12 md:gap-16">
                  {brands.map((brand) => (
                    <BrandLogo key={`b-${brand.name}`} brand={brand} />
                  ))}
                  <span className="marquee-separator w-12 shrink-0 md:w-16" aria-hidden />
                </span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}

function BrandLogo({ brand }: { brand: (typeof siteData.brands)[0] }) {
  const sizeClass = "flex h-24 w-40 shrink-0 items-center justify-center md:h-28 md:w-48";
  const darkBg = brand.logoDarkBackground ?? false;
  /* Cache-bust Wizeline/Huawei so updated white-background assets are always fetched */
  const logoSrc =
    !isExternalLogo(brand.logo) && (brand.name === "Wizeline" || brand.name === "Huawei")
      ? `${brand.logo}?v=white`
      : brand.logo;
  /* White background + padding; extra padding for dark-bg logos so black doesn't dominate */
  const wrapperClass = `flex h-full w-full items-center justify-center overflow-hidden rounded-2xl bg-white p-3 ${darkBg ? "logo-dark-bg-cell p-4" : ""}`;
  const scale = brand.logoScale ?? 1;
  const imageClass = `people-worked-with-logo max-h-full max-w-full object-contain object-center ${darkBg ? "logo-dark-bg-img" : ""}`;

  const content = (
    <span className={wrapperClass}>
      <span
        className="flex h-full w-full items-center justify-center"
        style={{ transform: `scale(${scale})` }}
      >
        {isExternalLogo(logoSrc) ? (
          <img
            src={logoSrc}
            alt=""
            className={imageClass}
            width={192}
            height={112}
            loading="lazy"
          />
        ) : (
          <Image
            src={logoSrc}
            alt=""
            width={192}
            height={112}
            className={imageClass}
            loading="lazy"
            unoptimized
          />
        )}
      </span>
    </span>
  );

  if (brand.url) {
    return (
      <Link
        href={brand.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${brand.name} (opens in new tab)`}
        className={sizeClass}
        title={brand.name}
      >
        {content}
      </Link>
    );
  }
  return (
    <span className={sizeClass} title={brand.name}>
      {content}
    </span>
  );
}
