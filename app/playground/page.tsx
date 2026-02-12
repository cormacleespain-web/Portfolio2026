import { RocketScene } from "@/components/three/RocketScene";
import { ShootingStarBackground } from "@/components/ui/ShootingStarBackground";

export default function PlaygroundPage() {
  return (
    <>
      <ShootingStarBackground />
      <RocketScene
        className="fixed inset-0 z-[10]"
        controls
        hideBackground
        transparentBackground
      />
    </>
  );
}
