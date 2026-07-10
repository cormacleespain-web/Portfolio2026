import { Hero } from "@/components/sections/Hero";
import { SelectedWorks } from "@/components/sections/SelectedWorks";
import { Experiences } from "@/components/sections/Experiences";
import { Testimonials } from "@/components/sections/Testimonials";
import { AllWork } from "@/components/sections/AllWork";
import { OtherWorks } from "@/components/sections/OtherWorks";
import { ShootingStarBackground } from "@/components/ui/ShootingStarBackground";

export default function HomePage() {
  return (
    <>
      <ShootingStarBackground />
      <div className="relative z-10">
        <Hero />
        <SelectedWorks />
        <Experiences />
        <Testimonials />
        <AllWork />
        <OtherWorks />
      </div>
    </>
  );
}
