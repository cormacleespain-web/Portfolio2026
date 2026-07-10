import { siteData } from "@/content/siteData";
import { getSiteUrl } from "@/lib/site";

export function PersonJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: siteData.hero.name,
    jobTitle: siteData.experiences[0]?.title,
    url: getSiteUrl(),
    email: `mailto:${siteData.contact.email}`,
    sameAs: siteData.contact.links.map((link) => link.href),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
