/**
 * Site-wide content. Edit this file to change all section copy.
 * Types are defined here for type safety.
 * Content below was gathered from imcormaclee.me (Oct 2026).
 */

// ─── TypeScript interfaces ───────────────────────────────────────────────

export interface HeroCta {
  label: string;
  href: string;
}

export interface HeroData {
  /** First line: punchy positioning statement */
  positioningLine: string;
  /** Second line: your name */
  name: string;
  /** Supporting paragraph: what kind of designer you are */
  supportingText: string;
  ctaPrimary: HeroCta;
  /** Secondary CTA as text link (e.g. View résumé) */
  ctaSecondary: HeroCta;
}

export interface Experience {
  /** e.g. "Oct '25 – Present" */
  timeframe: string;
  /** Job title */
  title: string;
  company: string;
  /** Employer site URL for favicon (e.g. "https://wizeline.com") */
  companyUrl?: string;
  /** Custom logo path (e.g. "/images/employers/ux-effect.png") overrides favicon when set */
  companyLogo?: string;
  /** If set, same company can appear as separate timeline cards (e.g. "ul-intern" vs "ul-social") */
  timelineGroup?: string;
}

export interface Achievement {
  /** e.g. "2025" or "Oct 2025" */
  year: string;
  /** e.g. "Winner", "Best Thesis Award" */
  title: string;
  /** Organisation or event name */
  context: string;
}

export interface EducationEntry {
  /** e.g. "2023 – 2025" */
  timeframe: string;
  degree: string;
  institution: string;
}

export interface Testimonial {
  quote: string;
  name: string;
  /** Role or title */
  role: string;
  organisation: string;
}

export interface ContactLink {
  label: string;
  href: string;
}

export interface ContactData {
  /** Section title (e.g. "Let's get in touch") */
  heading: string;
  subheading?: string;
  email: string;
  links: ContactLink[];
}

/** Brand logo for the "People I've Worked With" marquee */
export interface Brand {
  /** Company/brand name (used for alt text and optional link) */
  name: string;
  /** Logo image path (e.g. /images/brands/wizeline.svg) or URL */
  logo: string;
  /** Optional link (e.g. company site) */
  url?: string;
  /** Optional scale so logo fits comfortably (e.g. 0.9 = slightly smaller, 1.15 = slightly larger) */
  logoScale?: number;
  /** If true, logo has dark/black background – we treat black as transparent so it shows white */
  logoDarkBackground?: boolean;
}

export interface SiteData {
  hero: HeroData;
  experiences: Experience[];
  achievements: Achievement[];
  education: EducationEntry[];
  testimonials: Testimonial[];
  contact: ContactData;
  /** Brands shown in the auto-scrolling logo marquee */
  brands: Brand[];
}

// ─── Content (from imcormaclee.me; experiences/education/contact partially placeholder) ───────

export const siteData: SiteData = {
  hero: {
    positioningLine: "Cormac Lee is a product designer evolving the products behind global decision-making",
    name: "Cormac Lee",
    supportingText:
      "Currently leading end-to-end projects for Wizeline & DowJones from discovery and IA to delivery, adoption and scale. Trusted by product and engineering leadership to modernize legacy platforms, define AI-ready workflows, and ship multi-product migrations.",
    ctaPrimary: { label: "View Case Studies", href: "/#selected-works" },
    ctaSecondary: { label: "See How I lead", href: "/#experience" },
  },

  experiences: [
    { timeframe: "Jul 2025 – Present", title: "Senior Product Designer", company: "Wizeline", companyUrl: "https://wizeline.com" },
    { timeframe: "Aug 2024 – Jul 2025", title: "Product Designer II", company: "Wizeline", companyUrl: "https://wizeline.com" },
    { timeframe: "May 2023 – Mar 2024", title: "UX UI Designer", company: "Three Ireland", companyUrl: "https://www.three.ie" },
    { timeframe: "Sep 2022 – May 2023", title: "Digital Delivery Grad", company: "Three Ireland", companyUrl: "https://www.three.ie" },
    { timeframe: "Sep 2021 – Sep 2022", title: "Digital Service Graduate", company: "Three Ireland", companyUrl: "https://www.three.ie" },
    { timeframe: "Jun 2021 – Jun 2022", title: "UX Researcher Designer", company: "UX Effect", companyLogo: "/images/employers/ux-effect.png" },
    { timeframe: "May 2019 – Jan 2020", title: "UX Design Admin Intern", company: "University of Limerick", companyUrl: "https://www.ul.ie", timelineGroup: "ul-intern" },
    { timeframe: "Jan 2020 – Jun 2021", title: "Freelance Designer", company: "Milk & Sugars", companyLogo: "/images/employers/milk-sugars.png" },
    { timeframe: "Nov 2019 – Sep 2021", title: "Social Media Officer", company: "University of Limerick", companyUrl: "https://www.ul.ie", timelineGroup: "ul-social" },
  ],

  achievements: [
    { year: "—", title: "Add awards or recognition", context: "Edit in content/siteData.ts" },
  ],

  education: [
    { timeframe: "—", degree: "Professional Certificate in UI Design", institution: "UX Design Institute" },
    { timeframe: "—", degree: "Add your degree(s)", institution: "Edit in content/siteData.ts" },
  ],

  testimonials: [
    {
      quote:
        "Add a testimonial from a colleague, manager, or client. Edit in content/siteData.ts.",
      name: "Name",
      role: "Role",
      organisation: "Company",
    },
  ],

  contact: {
    heading: "Let's get in touch",
    subheading: "Drop a line or find me elsewhere.",
    email: "imcormaclee@gmail.com",
    links: [
      { label: "LinkedIn", href: "https://linkedin.com/in/imcormaclee" },
      { label: "Dribbble", href: "https://dribbble.com" },
    ],
  },

  brands: [
    { name: "Wizeline", logo: "/images/brands/wizeline-white.png", url: "https://wizeline.com", logoScale: 0.92 },
    { name: "Dow Jones", logo: "/images/brands/dow-jones.png", url: "https://www.dowjones.com", logoScale: 0.88 },
    { name: "Oxford Analytica", logo: "/images/brands/oxford-analytica.png", url: "https://www.oxfordanalytica.com", logoScale: 0.88 },
    { name: "WSJ", logo: "/images/brands/wsj.png", url: "https://www.wsj.com", logoScale: 1.02 },
    { name: "Three Ireland", logo: "/images/brands/three-ie.png", url: "https://www.three.ie", logoScale: 0.88 },
    { name: "Apple", logo: "/images/brands/apple.png", url: "https://www.apple.com", logoScale: 0.95 },
    { name: "Samsung", logo: "/images/brands/samsung.png", url: "https://www.samsung.com", logoScale: 1.05 },
    { name: "Huawei", logo: "/images/brands/huawei-white.png", url: "https://www.huawei.com", logoScale: 1.05 },
    { name: "iUX Effect", logo: "/images/brands/iux-effect.png", url: "https://uxeffect.ie", logoScale: 1.05 },
    { name: "Rainmaker", logo: "/images/brands/rainmaker.png", logoScale: 1.05 },
    { name: "Shannon Airport", logo: "/images/brands/shannon-airport.png", url: "https://www.shannonairport.com", logoScale: 0.9 },
    { name: "University of Limerick", logo: "/images/brands/university-limerick.png", url: "https://www.ul.ie", logoScale: 0.85 },
  ],
};
