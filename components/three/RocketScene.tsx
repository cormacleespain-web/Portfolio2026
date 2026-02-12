"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { NoiseSphereScene } from "./NoiseSphereScene";

interface RocketSceneProps {
  /** Optional class for the wrapper div (e.g. fixed inset-0 for full screen) */
  className?: string;
  /** Show orbit controls for the playground; hide for hero so it doesn't capture pointer */
  controls?: boolean;
  /** Use "none" when behind Hero so hero content stays clickable */
  pointerEvents?: "auto" | "none";
  /** When true, fill parent only (no minHeight: 100vh) for use inside a section */
  fillParent?: boolean;
  /** Hide the grainy background plane in the scene */
  hideBackground?: boolean;
  /** Transparent canvas (alpha: true, no background color) so a star/HTML background shows through */
  transparentBackground?: boolean;
  /** Scale the sphere + particles (default 1) */
  sceneScale?: number;
  /** Move main content along X, positive = right */
  scenePositionX?: number;
}

/**
 * Three.js scene (noise sphere + particles + background). Use on the playground to build and test,
 * then reuse behind the Hero with controls={false} and pointerEvents="none".
 */
export function RocketScene({
  className = "",
  controls = true,
  pointerEvents = "auto",
  fillParent = false,
  hideBackground = false,
  transparentBackground = false,
  sceneScale = 1,
  scenePositionX = 0,
}: RocketSceneProps) {
  return (
    <div
      className={className}
      style={{
        width: "100%",
        height: "100%",
        ...(fillParent ? {} : { minHeight: "100vh" }),
        pointerEvents,
        zIndex: 0,
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 10], fov: 40 }}
        gl={{ antialias: true, alpha: transparentBackground }}
        style={{ width: "100%", height: "100%" }}
      >
        {!transparentBackground && (
          <color attach="background" args={["#000000"]} />
        )}
        <NoiseSphereScene
          hideBackground={hideBackground}
          scale={sceneScale}
          positionX={scenePositionX}
        />
        {controls && (
          <OrbitControls enablePan={false} enableZoom={false} />
        )}
      </Canvas>
    </div>
  );
}
