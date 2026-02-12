"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";

/**
 * Floating rocket: body, nose, two fins, middle band, and flame.
 * Clock-based rotation and gentle float for hero background use.
 */
export function Rocket() {
  const group = useRef<Group>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (!group.current) return;

    // Slow rotation
    group.current.rotation.y = t * 0.4;
    group.current.rotation.z = Math.sin(t * 0.3) * 0.1;

    // Gentle up & down float
    group.current.position.y = Math.sin(t * 1.2) * 0.2;
  });

  return (
    <group ref={group} position={[0, 0, 0]}>
      {/* Body */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.3, 0.2, 1.4, 32]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>

      {/* Nose */}
      <mesh position={[0, 0.8, 0]}>
        <coneGeometry args={[0.25, 0.5, 32]} />
        <meshStandardMaterial color="#d946ef" />
      </mesh>

      {/* Fins */}
      <mesh position={[0.25, -0.3, 0]}>
        <boxGeometry args={[0.25, 0.4, 0.05]} />
        <meshStandardMaterial color="#a855f7" />
      </mesh>
      <mesh position={[-0.25, -0.3, 0]}>
        <boxGeometry args={[0.25, 0.4, 0.05]} />
        <meshStandardMaterial color="#a855f7" />
      </mesh>

      {/* Middle band */}
      <mesh position={[0, 0.2, 0]}>
        <torusGeometry args={[0.28, 0.05, 16, 100]} />
        <meshStandardMaterial color="#7c3aed" />
      </mesh>

      {/* Flame */}
      <mesh position={[0, -0.9, 0]}>
        <coneGeometry args={[0.15, 0.5, 32]} />
        <meshStandardMaterial
          color="#fbbf24"
          emissive="#fbbf24"
          emissiveIntensity={0.8}
        />
      </mesh>
    </group>
  );
}
