import { Hero } from "@/components/sections/Hero";
import { SelectedWorks } from "@/components/sections/SelectedWorks";
import { Experiences } from "@/components/sections/Experiences";
import { OtherWorks } from "@/components/sections/OtherWorks";
import { Testimonials } from "@/components/sections/Testimonials";
import { Contact } from "@/components/sections/Contact";
import { ShootingStarBackground } from "@/components/ui/ShootingStarBackground";

export default function HomePage() {
  return (
    <>
      <ShootingStarBackground />
      <div className="relative z-10">
        <Hero />
        <SelectedWorks />
        <Experiences />
        <OtherWorks />
        <Testimonials />
        <Contact />
      </div>
    </>
  );
}
