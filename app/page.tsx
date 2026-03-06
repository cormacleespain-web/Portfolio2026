import { Hero } from "@/components/sections/Hero";
import { SelectedWorks } from "@/components/sections/SelectedWorks";
import { Experiences } from "@/components/sections/Experiences";
import { AllWork } from "@/components/sections/AllWork";
import { OtherWorks } from "@/components/sections/OtherWorks";
import { ShootingStarBackground } from "@/components/ui/ShootingStarBackground";
import { RotatingTitle } from "@/components/ui/RotatingTitle";

export default function HomePage() {
  return (
    <>
      <RotatingTitle />
      <ShootingStarBackground />
      <div className="relative z-10">
        <Hero />
        <SelectedWorks />
        <Experiences />
        <AllWork />
        <OtherWorks />
      </div>
    </>
  );
}
