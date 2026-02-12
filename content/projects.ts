/**
 * Selected works & case studies.
 * Content gathered from imcormaclee.me; add images in public/images/projects/<slug>/.
 */

// ─── TypeScript interface ───────────────────────────────────────────────

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
  /** Case study body for /work/[slug] */
  description?: string;
  /** Optional path to cover image (e.g. /images/projects/my3-case-study/cover.jpg) */
  image?: string;
  /** Index into siteData.experiences to show this project on the timeline under that role (0-based) */
  experienceIndex?: number;
  /** If true, hide from Selected Works and timeline (project page still accessible via URL) */
  hidden?: boolean;
}

// ─── Projects (from imcormaclee.me) ───────────────────────────────────────

export const projects: Project[] = [
  {
    slug: "my3-case-study",
    title: "My3 Case Study",
    category: "UX/UI Lead · Project Management · Information Architecture · Accessibility",
    timeframe: "—",
    readTime: "8 min read",
    tagline: "Lead designer on a transformative UX & UI overhaul for My3 at Three Ireland.",
    image: "/images/projects/my3-case-study.png",
    experienceIndex: 2,
    description: `Context

While working at Three Ireland I worked on many different projects. One I am particularly proud of was being the lead designer of this transformative project aimed at enhancing UX & UI for My3. Our journey, from research to implementation, focused on seamless navigation and intuitive functionality. Through a human-centered approach, we prioritized empathy and accessibility. The result? A revitalized My3 platform exceeding user expectations. The project's goal was to overhaul our dashboards as well as update all other pages to match our latest design system. Understanding the value of user input, I prioritized user-friendliness and alignment with user preferences. I aimed to create an experience that feels intuitive and empowers users to make informed decisions effortlessly. The focus was on putting users at the forefront while ensuring our changes supported Three's business goals.

Competitive Analysis

Working alongside our journey team, we meticulously analyzed competitors' offerings, identifying strengths, weaknesses, and opportunities for differentiation. Through comparative feature mapping and heuristic evaluations, we gained valuable insights into industry trends and best practices.

Heat/Journey Mapping

Leveraging the heat mapping tool Hot Jar and user analytics, we analyzed user interactions with the existing My3 platform. This provided invaluable insights into user behavior, popular features, and areas of friction. We then translated this data into actionable insights to inform our design decisions.

Requirement Gathering

Engaging with cross-functional teams including developers, business analysts, and customer support, we conducted comprehensive requirements-gathering. In collaborative discussions with product owners, UXR, and Journey Design we defined functional and non-functional requirements, ensuring alignment with business goals and technical feasibility.

Affinity Mapping

With user feedback and research findings in hand, working with our UX Researcher affinity mapping sessions were organized we clustered related ideas and observations. Identifying overarching themes and pain points. This exercise provided a holistic view of user needs, guiding our design decisions. We noticed 5 clear groupings across all of the verbatim gathered.

Information Architecture

Drawing upon the insights gathered, we crafted a user-centric information architecture for the redesigned My3 platform. Collaborating closely with journey designers and solution architects, we defined navigation pathways, categorized content, and structured the user interface to optimize usability and clarity. This stage was complex due to the various types of customers with varying levels of access. All have different needs from our product along with accessing different back-end systems. These challenges come with projects within a mature business.

Design and Wireframing

Armed with a solid understanding of user needs and a well-defined information architecture, I transitioned into the design and wireframing phase. Collaborating closely with product owners and developers, I translated insights into visually compelling interfaces. Sketching, prototyping, and iterative design sessions allowed me to explore various design concepts and refine interactions. A Mobile first approach was taken due to our users being 80% mobile.

Iteration & Testing

Iteration and testing were central to our design process, ensuring that our solutions were not only aesthetically pleasing but also highly functional and intuitive. Through rapid prototyping and usability testing sessions with real users, we gathered feedback and iterated on our designs iteratively. This iterative approach allowed us to address pain points and refine the user experience based on real-world usage. All of our testing was done through Usertesting (UserZoom). A variety of Usability, A/B & Surveys were completed with design iterations.

Delivery

With the design finalized and tested, we transitioned into the delivery phase. I collaborated closely with development teams to bring our user's vision to life. Throughout the development process, I established open communication channels and conducted regular design reviews/demos to ensure alignment with the original vision.

Results

Post-launch, we monitored key performance metrics and solicited user feedback to measure the success of the redesign. The results exceeded our expectations, with increased user satisfaction and engagement.`,
  },
  {
    slug: "crewpay-pwa",
    title: "Crew Pay PWA",
    category: "UX/UI · Project Management · Information Architecture",
    timeframe: "—",
    readTime: "6 min read",
    tagline: "PWA for crew payments and management.",
    image: "/images/projects/crewpay-pwa.png",
    description: "Case study content from your original portfolio could not be fetched (page timed out). Add your narrative, process, and outcomes here or in a separate MDX file.",
  },
  {
    slug: "three-ireland-comp",
    title: "Three Ireland Components",
    category: "UX/UI · User Research · Branding",
    timeframe: "—",
    readTime: "5 min read",
    tagline: "Redesign and update of carousels and AEM components for Three.ie.",
    image: "/images/projects/three-ireland-comp.png",
    experienceIndex: 2,
    description: `Phone Carousel

This project was to redesign and update the current carousels used on the main Three websites. I was the sole designer leading Ux Research and Design on this task. The main objectives for this update were to:

1. Improve accessibility
2. Reduce cluttered presentation
3. Better the overall design appearance
4. Add Social Proofing
5. Reduce the overall size of the component in comparison to its predecessor

Customer Reviews

The concept of this project was to design an AEM component that would enable us to display reviews on Three.ie from other sources. I was the sole designer leading UX Design on this task. The main objectives for this component were to:

1. Display a max of 4 Reviews
2. Be responsive across all devices
3. Display the author's details and the platform from which the review was coming
4. AEM Author-level editable rating system

API Upgrade Component

The purpose of this component is to enable Three Customers to check if they are eligible for an upgrade on Three.ie without ever having to log in to My3. This was one of our first API-driven components for AEM. It was particularly fun to work on. I again was the solo designer on this project.`,
  },
  {
    slug: "youngbank",
    title: "Young Bank - PWA",
    category: "UX/UI · User Research · Branding",
    timeframe: "—",
    readTime: "5 min read",
    tagline: "Banking experience that is clear, fun, and trustworthy. Professional Certificate in UI Design (UX Design Institute).",
    image: "/images/projects/youngbank.png",
    description: `Moodboards & inspirations

This project was part of my Professional Certificate in UI Design from the UX Design Institute. I completed this course in tandem with full-time work. The main objectives for this update were to:

1. Create a banking experience that is both Clear, Fun, and Trustworthy
2. Explore branding and overall inspiration for the UI
3. Design 3 Pages, Responsively for 3 Devices.
4. I also decided to try to create some animations and interactions that felt relevant to the brand I had created.

Branding, Style Guides & Components: Logo & Icons, Colour Palette, Typography/Text Styles.

Final Designs

The reason for choosing these three screens was to both deliver a good feel for what this application could look like, and to show different styles of UI elements/components. Screens: My Accounts, Current Account, My Spending.

Figma Link: https://shorturl.at/hlqF7`,
  },
  {
    slug: "grad-cap",
    title: "Grad Cap",
    category: "UX/UI · User Research · Branding",
    timeframe: "—",
    readTime: "5 min read",
    tagline: "Add a short tagline for this project.",
    image: "/images/projects/grad-cap.png",
    description: "Add your case study content for Grad Cap. Edit in content/projects.ts.",
  },
  {
    slug: "fitprint",
    title: "Fitprint",
    category: "UX/UI · Graphic Design · Branding",
    timeframe: "—",
    readTime: "5 min read",
    tagline: "Add a short tagline for this project.",
    image: "/images/projects/fitprint.png",
    description: "Add your case study content for Fitprint. Edit in content/projects.ts.",
  },
  {
    slug: "helping-hand-student-employment-app",
    title: "Helping Hand",
    category: "UX/UI · Graphic Design · Illustration",
    timeframe: "—",
    readTime: "5 min read",
    tagline: "Student employment app.",
    image: "/images/projects/helping-hand.png",
    description: "Add your case study content for Helping Hand. Edit in content/projects.ts.",
  },
  {
    slug: "university-of-limerick",
    title: "University of Limerick",
    hidden: true,
    category: "Print Design · Information Architecture · Graphic Design",
    timeframe: "—",
    readTime: "5 min read",
    tagline: "Add a short tagline (e.g. AHECS Graduate Market Survey).",
    image: "/images/placeholder.svg",
    experienceIndex: 6,
    description: "Add your case study content. Edit in content/projects.ts.",
  },
  {
    slug: "ahecs-graduate-market-survey",
    title: "AHECS Graduate Market Survey",
    hidden: true,
    category: "Print Design · Information Architecture · Graphic Design",
    timeframe: "—",
    readTime: "5 min read",
    tagline: "Add a short tagline for this project.",
    image: "/images/placeholder.svg",
    experienceIndex: 6,
    description: "Add your case study content for AHECS Graduate Market Survey. Edit in content/projects.ts.",
  },
  {
    slug: "shannon-airport-marketing",
    title: "Shannon Airport - Marketing Brief",
    hidden: true,
    category: "Digital Marketing · Graphic Design · Research",
    timeframe: "—",
    readTime: "5 min read",
    tagline: "Add a short tagline for this project.",
    image: "/images/placeholder.svg",
    description: "Add your case study content for Shannon Airport. Edit in content/projects.ts.",
  },
  {
    slug: "ul-careers-fair-web-app",
    title: "UL Careers Fair Web-App",
    hidden: true,
    category: "UX/UI · Information Architecture · Branding",
    timeframe: "—",
    readTime: "5 min read",
    tagline: "Add a short tagline for this project.",
    image: "/images/placeholder.svg",
    experienceIndex: 6,
    description: "Add your case study content for UL Careers Fair Web-App. Edit in content/projects.ts.",
  },
];

/** Get a single project by slug (for /work/[slug]). */
export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
