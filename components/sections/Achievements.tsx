import { siteData } from "@/content/siteData";
import { Section } from "@/components/ui/Section";

export function Achievements() {
  const items = siteData.achievements;
  return (
    <Section id="achievements" title="Achievements">
      <ul className="space-y-4" role="list">
        {items.map((item, i) => (
          <li
            key={i}
            className="flex flex-col gap-0.5 sm:flex-row sm:gap-6"
          >
            <span className="w-24 shrink-0 text-caption text-text-muted">
              {item.year}
            </span>
            <div className="text-body-sm">
              <span className="font-medium text-text">{item.title}</span>
              <span className="text-text-muted"> · {item.context}</span>
            </div>
          </li>
        ))}
      </ul>
    </Section>
  );
}
