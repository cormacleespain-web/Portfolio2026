import type { Project } from "@/content/projects";
import { siteData } from "@/content/siteData";
import { getSiteUrl } from "@/lib/site";

export function CreativeWorkJsonLd({ project }: { project: Project }) {
  const siteUrl = getSiteUrl();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.tagline ?? project.description ?? project.category,
    url: `${siteUrl}/work/${project.slug}`,
    ...(project.image && { image: `${siteUrl}${project.image}` }),
    author: {
      "@type": "Person",
      name: siteData.hero.name,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
