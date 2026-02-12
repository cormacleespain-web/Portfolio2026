import { siteData } from "@/content/siteData";
import { Section } from "@/components/ui/Section";

export function Testimonials() {
  const items = siteData.testimonials;
  return (
    <Section id="testimonials" title="Little notes that made my day">
      <ul className="space-y-8" role="list">
        {items.map((t, i) => (
          <li
            key={i}
            className="border-l-2 border-accent/30 pl-5"
          >
            <blockquote className="text-body-lg text-text leading-relaxed">
              &ldquo;{t.quote}&rdquo;
            </blockquote>
            <footer className="mt-3 text-caption text-text-muted">
              <strong className="font-medium text-text">{t.name}</strong>
              {" · "}
              {t.role}, {t.organisation}
            </footer>
          </li>
        ))}
      </ul>
    </Section>
  );
}
