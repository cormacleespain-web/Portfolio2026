import type { MetadataRoute } from "next";
import { projects } from "@/content/projects";
import { getSiteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  const visibleProjects = projects.filter((p) => !p.hidden);

  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    ...visibleProjects.map((project) => ({
      url: `${siteUrl}/work/${project.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
