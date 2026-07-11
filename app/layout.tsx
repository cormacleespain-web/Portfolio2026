import type { Metadata } from "next";
import { Ephesis } from "next/font/google";
import { GeistSans } from "geist/font/sans";
import "@/styles/globals.css";
import { PageShell } from "@/components/ui/PageShell";
import { ScrollToHash } from "@/components/ui/ScrollToHash";
import { FloatingNav } from "@/components/ui/FloatingNav";
import { ArrivalCoverGate } from "@/components/ui/ArrivalCoverGate";
import { MotionConfigProvider } from "@/components/ui/MotionConfigProvider";
import { Footer } from "@/components/sections/Footer";
import { ChatWidget } from "@/components/chat/ChatWidget";
import { PersonJsonLd } from "@/components/seo/PersonJsonLd";
import { getSiteUrl, SITE_NAME, SITE_DESCRIPTION } from "@/lib/site";

const ephesis = Ephesis({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-hero-name",
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: SITE_NAME,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    siteName: SITE_NAME,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
};

const darkScript = `document.documentElement.classList.add('dark');try{localStorage.removeItem('theme');}catch(e){}`;

const arrivalScript = `
(function() {
  try {
    var dismissed = sessionStorage.getItem('portfolio-arrival-dismissed') === '1';
    if (dismissed) document.documentElement.classList.add('arrival-dismissed');
    else document.documentElement.classList.add('arrival-cover-active');
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: darkScript }} />
        <script dangerouslySetInnerHTML={{ __html: arrivalScript }} />
        <PersonJsonLd />
      </head>
      <body className={`min-h-dvh bg-background font-sans ${GeistSans.variable} ${ephesis.variable}`}>
        <a
          href="#main-content"
          className="absolute left-[-9999px] top-4 z-[200] rounded bg-accent px-4 py-2 text-sm font-medium text-white ring-2 ring-ring ring-offset-2 ring-offset-background outline-none transition-[left,top] focus:left-4 focus:top-4 focus:overflow-visible"
        >
          Skip to main content
        </a>
        <MotionConfigProvider>
          <ScrollToHash />
          <FloatingNav />
          <ArrivalCoverGate />
          <PageShell as="main" className="pb-12 pt-4">
            <div id="main-content" className="page-grid-span-full min-w-0">{children}</div>
          </PageShell>
          <Footer />
          <ChatWidget />
        </MotionConfigProvider>
      </body>
    </html>
  );
}
