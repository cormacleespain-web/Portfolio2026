/**
 * Selected works & case studies.
 * Content gathered from imcormaclee.me; add images in public/images/projects/<slug>/.
 */

// ─── TypeScript interfaces ──────────────────────────────────────────────

export interface CaseStudySection {
  heading: string;
  body: string;
  image?: string;
  imageAlt?: string;
  imageAspect?: "video" | "square" | "wide";
  callout?: string;
  /** Render style: default prose, or a specialized block */
  variant?: "prose" | "gallery" | "beforeAfter" | "metricsRow";
  /** For variant "gallery" / "beforeAfter": multiple images with alts */
  images?: { src: string; alt: string; caption?: string }[];
}

export interface ImpactMetric {
  label: string;
  value: string;
  /** e.g. "internal measure, directional" — rendered as a footnote rather than presented as a precise figure */
  caveat?: string;
}

export interface Project {
  /** URL slug for /work/[slug] */
  slug: string;
  title: string;
  /** e.g. "Dashboard Design", "Responsive App Design" */
  category: string;
  /** Month/year range, e.g. "Jun '25 – Aug '25" */
  timeframe: string;
  /** e.g. "10 min read" */
  readTime: string;
  /** Optional short tagline for the card */
  tagline?: string;
  /** Legacy plain-text body -- kept for backward compat with unmigrated projects */
  description?: string;
  /** Optional path to cover image (e.g. /images/projects/my3-case-study/cover.jpg) */
  image?: string;
  /** Index into siteData.experiences to show this project on the timeline under that role (0-based) */
  experienceIndex?: number;
  /** If true, hide from Selected Works and timeline (project page still accessible via URL) */
  hidden?: boolean;
  /** Client/employer display line, e.g. "Oxford Analytica · via Wizeline & Dow Jones" */
  client?: string;
  /** Shown as an NDA notice banner on the case study page */
  confidentialityNote?: string;
  /** Platform/domain chips, e.g. ["Web platform", "Enterprise SaaS"] */
  platform?: string[];

  // ── Structured case study fields ────────────────────────────────────
  role?: string;
  team?: string;
  tools?: string[];
  problem?: string;
  impact?: ImpactMetric[];
  sections?: CaseStudySection[];
  reflection?: string;
  nextProject?: string;
}

// ─── Projects (from imcormaclee.me) ───────────────────────────────────────

export const projects: Project[] = [
  {
    slug: "my3-case-study",
    title: "MyThree",
    category: "UX/UI Lead · Project Management · Information Architecture · Accessibility",
    timeframe: "—",
    readTime: "8 min read",
    tagline: "Lead designer on a transformative UX & UI overhaul for My3 at Three Ireland.",
    image: "/images/projects/my3-case-study.png",
    experienceIndex: 2,

    role: "Lead Product Designer",
    team: "Journey designers, UX researcher, solution architects, developers & POs",
    tools: ["Figma", "Hotjar", "UserZoom", "Miro"],

    problem:
      "My3's dashboard and account pages had grown fragmented over years of incremental changes. Users struggled with cluttered navigation, inconsistent patterns, and poor mobile performance, despite 80% of traffic coming from mobile devices. The platform needed a full UX & UI overhaul that put users first while aligning with Three's business goals and latest design system.",

    impact: [
      { label: "Mobile-first coverage", value: "80%" },
      { label: "User pain-point themes identified", value: "5" },
      { label: "Testing methods used", value: "3" },
    ],

    sections: [
      {
        heading: "Context & Discovery",
        body: "While working at Three Ireland I worked on many different projects. One I am particularly proud of was being the lead designer of this transformative project aimed at enhancing UX & UI for My3. Our journey, from research to implementation, focused on seamless navigation and intuitive functionality. Through a human-centered approach, we prioritized empathy and accessibility. The result? A revitalized My3 platform exceeding user expectations.\n\nThe project's goal was to overhaul our dashboards as well as update all other pages to match our latest design system. Understanding the value of user input, I prioritized user-friendliness and alignment with user preferences. I aimed to create an experience that feels intuitive and empowers users to make informed decisions effortlessly.",
        callout: "The focus was on putting users at the forefront while ensuring our changes supported Three's business goals.",
      },
      {
        heading: "Competitive Analysis",
        body: "Working alongside our journey team, we meticulously analyzed competitors' offerings, identifying strengths, weaknesses, and opportunities for differentiation. Through comparative feature mapping and heuristic evaluations, we gained valuable insights into industry trends and best practices.",
        imageAspect: "wide",
      },
      {
        heading: "Heat & Journey Mapping",
        body: "Leveraging the heat mapping tool Hotjar and user analytics, we analyzed user interactions with the existing My3 platform. This provided invaluable insights into user behavior, popular features, and areas of friction. We then translated this data into actionable insights to inform our design decisions.",
      },
      {
        heading: "Requirement Gathering",
        body: "Engaging with cross-functional teams including developers, business analysts, and customer support, we conducted comprehensive requirements-gathering. In collaborative discussions with product owners, UXR, and Journey Design we defined functional and non-functional requirements, ensuring alignment with business goals and technical feasibility.",
        callout: "Aligning cross-functional stakeholders early was critical. It ensured every design decision was grounded in both user needs and technical reality.",
      },
      {
        heading: "Affinity Mapping",
        body: "With user feedback and research findings in hand, working with our UX Researcher we organized affinity mapping sessions where we clustered related ideas and observations, identifying overarching themes and pain points. This exercise provided a holistic view of user needs, guiding our design decisions. We noticed 5 clear groupings across all of the verbatim gathered.",
        imageAspect: "wide",
      },
      {
        heading: "Information Architecture",
        body: "Drawing upon the insights gathered, we crafted a user-centric information architecture for the redesigned My3 platform. Collaborating closely with journey designers and solution architects, we defined navigation pathways, categorized content, and structured the user interface to optimize usability and clarity.\n\nThis stage was complex due to the various types of customers with varying levels of access. All have different needs from our product along with accessing different back-end systems. These challenges come with projects within a mature business.",
      },
      {
        heading: "Design & Wireframing",
        body: "Armed with a solid understanding of user needs and a well-defined information architecture, I transitioned into the design and wireframing phase. Collaborating closely with product owners and developers, I translated insights into visually compelling interfaces. Sketching, prototyping, and iterative design sessions allowed me to explore various design concepts and refine interactions. A mobile-first approach was taken due to our users being 80% mobile.",
        callout: "Mobile-first wasn't just a design principle. With 80% of our users on mobile, it was a business imperative.",
      },
      {
        heading: "Iteration & Testing",
        body: "Iteration and testing were central to our design process, ensuring that our solutions were not only aesthetically pleasing but also highly functional and intuitive. Through rapid prototyping and usability testing sessions with real users, we gathered feedback and iterated on our designs. This iterative approach allowed us to address pain points and refine the user experience based on real-world usage.\n\nAll of our testing was done through UserTesting (UserZoom). A variety of usability tests, A/B tests, and surveys were completed with design iterations.",
      },
      {
        heading: "Delivery",
        body: "With the design finalized and tested, we transitioned into the delivery phase. I collaborated closely with development teams to bring our users' vision to life. Throughout the development process, I established open communication channels and conducted regular design reviews and demos to ensure alignment with the original vision.",
      },
      {
        heading: "Results",
        body: "Post-launch, we monitored key performance metrics and solicited user feedback to measure the success of the redesign. The results exceeded our expectations, with increased user satisfaction and engagement across the platform.",
      },
    ],

    reflection:
      "This project reinforced the value of embedding research deeply into every phase of design. Leading a cross-functional team through a large-scale redesign taught me that the best outcomes come from constant collaboration, early stakeholder alignment, and the discipline to let user data, not assumptions, drive decisions. If I were to do it again, I would push for even more frequent, lightweight usability checks between major iterations.",

    nextProject: "three-ireland-comp",
  },
  {
    slug: "crewpay-pwa",
    title: "CrewPay",
    category: "UX/UI · Project Management · Information Architecture",
    timeframe: "—",
    readTime: "6 min read",
    tagline: "PWA for crew payments and management.",
    image: "/images/projects/crewpay-pwa.png",
    description: "Full case study coming soon.",
  },
  {
    slug: "three-ireland-comp",
    title: "Three Ireland",
    category: "UX/UI · User Research · Branding",
    timeframe: "—",
    readTime: "5 min read",
    tagline: "Redesign and update of carousels and AEM components for Three.ie.",
    image: "/images/projects/three-ireland-comp.png",
    experienceIndex: 2,

    role: "Sole Product Designer",
    team: "Developers, product owners & content authors",
    tools: ["Figma", "Adobe AEM"],

    problem:
      "Three.ie's marketing components (phone carousels, review blocks, and upgrade eligibility checkers) had become outdated, inaccessible, and visually cluttered. Each needed a ground-up redesign to meet modern accessibility standards, reduce visual noise, and support AEM's author-editable content model.",

    sections: [
      {
        heading: "Phone Carousel",
        body: "This project was to redesign and update the current carousels used on the main Three websites. I was the sole designer leading UX Research and Design on this task. The main objectives were to:\n\n1. Improve accessibility\n2. Reduce cluttered presentation\n3. Better the overall design appearance\n4. Add social proofing\n5. Reduce the overall size of the component compared to its predecessor",
        callout: "Accessibility was the driving force. The existing carousel failed multiple WCAG criteria.",
      },
      {
        heading: "Customer Reviews",
        body: "The concept of this project was to design an AEM component that would enable us to display reviews on Three.ie from other sources. I was the sole designer leading UX Design on this task. The main objectives were to:\n\n1. Display a max of 4 reviews\n2. Be responsive across all devices\n3. Display the author's details and the platform from which the review was coming\n4. AEM Author-level editable rating system",
      },
      {
        heading: "API Upgrade Component",
        body: "The purpose of this component is to enable Three customers to check if they are eligible for an upgrade on Three.ie without ever having to log in to My3. This was one of our first API-driven components for AEM. It was particularly fun to work on as it bridged live back-end data with the CMS authoring experience.",
        callout: "This was Three's first API-driven AEM component, a milestone that opened the door for richer, data-connected marketing experiences.",
      },
    ],

    reflection:
      "Working as the sole designer across three distinct component redesigns sharpened my ability to context-switch rapidly while maintaining design consistency. Each component had different constraints, from accessibility compliance to API integration, which reinforced the importance of understanding technical feasibility early in the design process.",

    nextProject: "youngbank",
  },
  {
    slug: "youngbank",
    title: "Young Bank",
    category: "UX/UI · User Research · Branding",
    timeframe: "—",
    readTime: "5 min read",
    tagline: "A banking experience that is clear, fun, and trustworthy.",
    image: "/images/projects/youngbank.png",

    role: "UI Designer",
    tools: ["Figma"],

    problem:
      "As part of the Professional Certificate in UI Design from the UX Design Institute, I set out to design a banking app that felt genuinely approachable (clear, fun, and trustworthy) while demonstrating strong UI craft across responsive breakpoints.",

    sections: [
      {
        heading: "Moodboards & Inspiration",
        body: "This project was part of my Professional Certificate in UI Design from the UX Design Institute. I completed this course in tandem with full-time work. The main objectives were to:\n\n1. Create a banking experience that is clear, fun, and trustworthy\n2. Explore branding and overall inspiration for the UI\n3. Design 3 pages, responsively for 3 devices\n4. Create animations and interactions that felt relevant to the brand",
      },
      {
        heading: "Branding & Design System",
        body: "I developed a complete brand identity and design system for Young Bank, including logo and icon design, a vibrant colour palette, and a typography system. These components formed the foundation for a consistent, recognizable experience across all screens.",
        imageAspect: "wide",
      },
      {
        heading: "Final Designs",
        body: "The reason for choosing these three screens (My Accounts, Current Account, and My Spending) was to both deliver a strong feel for what this application could look like and to showcase different styles of UI elements and components. Each screen demonstrates responsive design across mobile, tablet, and desktop.",
        callout: "The goal was to show range, from data-dense account overviews to playful spending visualizations, all within a cohesive design language.",
      },
    ],

    reflection:
      "Completing this project alongside full-time work was a test of discipline and time management. It reinforced that strong UI design is inseparable from strong branding. Every colour choice, type scale, and micro-interaction needs to serve the brand story.",

    nextProject: "crewpay-pwa",
  },
  {
    slug: "grad-cap",
    title: "GradCap",
    category: "UX/UI · User Research · Branding",
    timeframe: "—",
    readTime: "5 min read",
    tagline: "A product helping third-level students understand and articulate their own strengths: their \"graduate capital\".",
    image: "/images/projects/grad-cap.png",

    role: "UX/UI Designer",

    problem:
      "Students had no single way to understand their full range of graduate capital (the strengths, behaviors, and skills that make them employable) or to articulate that capital effectively to employers. The brief was to design a product that closed that gap end to end, from self-assessment to communication.",

    sections: [
      {
        heading: "Research & Discovery",
        body: "Research began with a literature review of roughly 15 academic articles and resources to understand graduate capital models, surfacing the \"5 Main Capitals\" framework and how each applies to current and future employment markets, alongside a competitive landscape analysis.\n\nThis was paired with interviews across a deliberately broad panel: students from multiple departments, and employers spanning IT, Medical Devices/Technology, Food & Beverage, and HR/Recruitment, covering different stages of the graduate hiring process from both sides. Findings were synthesized into personas and storyboards.",
        callout: "No one application was able to provide a user with an understanding of all their capitals as well as how to use them for the user's benefit.",
      },
      {
        heading: "Design Process",
        body: "The design moved through six stages: defining the information architecture for the psychometric and capital-test frameworks; sketching and low-fidelity prototyping; usability and A/B testing with the original research participants; branding and high-fidelity development incorporating that feedback; a final round of 5-second testing with the same panel; and final product delivery.",
      },
      {
        heading: "Outputs & Delivery",
        body: "Low-fidelity flows covered registration, login, adding experience, and the capital test itself, mapped end to end. The branding system (app icon, logo variations, color palette, and type) carried through into a six-screen high-fidelity prototype, alongside a product video and presentation.",
      },
    ],
  },
  {
    slug: "fitprint",
    title: "Fitprint",
    category: "UX/UI · Graphic Design · Branding",
    timeframe: "—",
    readTime: "5 min read",
    tagline: "A fitness app built around wellbeing rather than figures.",
    image: "/images/projects/fitprint.png",
    role: "UX/UI Designer",
    description:
      "Fitprint set out to make users more aware of their wellbeing and connect them to fitness through socializing and their local area, rather than emphasizing metrics: a fitness experience not centered on numbers.",
  },
  {
    slug: "helping-hand-student-employment-app",
    title: "Helping Hand",
    category: "UX/UI · Graphic Design · Illustration",
    timeframe: "—",
    readTime: "5 min read",
    tagline: "A community-based engagement app connecting students and their local community.",
    image: "/images/projects/helping-hand.png",
    role: "UX/UI Designer, Graphic Designer, Illustrator",
    description:
      "Helping Hand addresses a need for communities to access student resources and talents, enabling third-level students to showcase their skills and availability while connecting them with local community needs.",
  },
];

/** Get a single project by slug (for /work/[slug]). */
export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
