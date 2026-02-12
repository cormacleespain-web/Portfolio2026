import { siteData } from "@/content/siteData";

export function Hero() {
  const { positioningLine, supportingText } = siteData.hero;

  return (
    <section
      className="relative overflow-hidden pt-[2.4rem] pb-[4.8rem] md:pt-[3.6rem] md:pb-[7.2rem]"
      id="hero"
      aria-labelledby="hero-heading"
    >
      <div className="relative z-10">
        <header>
          <h1
            id="hero-heading"
            className="text-hero font-bold text-text drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]"
          >
            <span className="block">{positioningLine}</span>
          </h1>
        </header>
        <p className="mt-[1.8rem] max-w-xl text-body text-text-muted drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]">
          {supportingText}
        </p>
      </div>
    </section>
  );
}
