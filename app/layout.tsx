import type { Metadata } from "next";
import { Playfair_Display, Ephesis } from "next/font/google";
import "@/styles/globals.css";
import { PageShell } from "@/components/ui/PageShell";
import { ScrollToHash } from "@/components/ui/ScrollToHash";
import { FloatingNav } from "@/components/ui/FloatingNav";
import { TopRightNav } from "@/components/ui/TopRightNav";
import { ArrivalCoverGate } from "@/components/ui/ArrivalCoverGate";
import { Footer } from "@/components/sections/Footer";

const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-contact-email",
});

const ephesis = Ephesis({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-hero-name",
});

export const metadata: Metadata = {
  title: "Cormac Lee",
  description: "Personal portfolio",
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
      </head>
      <body className={`min-h-screen bg-background ${playfair.variable} ${ephesis.variable}`}>
        <a
          href="#main-content"
          className="absolute left-[-9999px] top-4 z-[200] rounded bg-accent px-4 py-2 text-sm font-medium text-white ring-2 ring-ring ring-offset-2 ring-offset-background outline-none transition-[left,top] focus:left-4 focus:top-4 focus:overflow-visible"
        >
          Skip to main content
        </a>
        <ScrollToHash />
        <TopRightNav />
        <FloatingNav />
        <ArrivalCoverGate />
        <PageShell as="main" className="pb-12 pt-4">
          <div id="main-content" className="page-grid-span-full min-w-0">{children}</div>
        </PageShell>
        <Footer />
      </body>
    </html>
  );
}
