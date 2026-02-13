import type { Metadata } from "next";
import { Playfair_Display } from "next/font/google";
import "@/styles/globals.css";
import { PageShell } from "@/components/ui/PageShell";
import { ScrollToHash } from "@/components/ui/ScrollToHash";
import { FloatingNav } from "@/components/ui/FloatingNav";
import { TopRightNav } from "@/components/ui/TopRightNav";
import { Analytics } from "@vercel/analytics/next";

const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-contact-email",
});

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Personal portfolio",
};

const themeScript = `
(function() {
  var stored = localStorage.getItem('theme');
  var dark = stored !== 'light';
  if (dark) document.documentElement.classList.add('dark');
  else document.documentElement.classList.remove('dark');
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={`min-h-screen bg-background ${playfair.variable}`}>
        <ScrollToHash />
        <TopRightNav />
        <FloatingNav />
        <main>
          <PageShell as="main" className="pb-28 pt-8">
            <div className="page-grid-span-full min-w-0">{children}</div>
          </PageShell>
        </main>
        <Analytics />
      </body>
    </html>
  );
}
