import { siteData } from "@/content/siteData";
import { Section } from "@/components/ui/Section";

export function Education() {
  const items = siteData.education;
  return (
    <Section id="education" title="Education">
      <ul className="space-y-4" role="list">
        {items.map((item, i) => (
          <li
            key={i}
            className="flex flex-col gap-0.5 sm:flex-row sm:gap-6"
          >
            <span className="w-24 shrink-0 text-caption text-text-muted">
              {item.timeframe}
            </span>
            <div className="text-body-sm">
              <span className="font-medium text-text">{item.degree}</span>
              <span className="text-text-muted"> · {item.institution}</span>
            </div>
          </li>
        ))}
      </ul>
    </Section>
  );
}
