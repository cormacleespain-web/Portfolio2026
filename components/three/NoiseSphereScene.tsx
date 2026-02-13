"use client";

import { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";
import {
  vertex,
  fragment,
  particleVertex,
  particleFragment,
  backgroundVertex,
  backgroundFragment,
} from "./shaders/codepenShaders";

const N = 30000;
const RADIUS = 2;

function createParticlePositions(): Float32Array {
  const position = new Float32Array(N * 3);
  const inc = Math.PI * (3 - Math.sqrt(5));
  const offset = 2 / N;

  for (let i = 0; i < N; i++) {
    const y = i * offset - 1 + offset / 2;
    const r = Math.sqrt(1 - y * y);
    const phi = i * inc;
    position[3 * i] = RADIUS * Math.cos(phi) * r;
    position[3 * i + 1] = RADIUS * y;
    position[3 * i + 2] = RADIUS * Math.sin(phi) * r;
  }
  return position;
}

interface NoiseSphereSceneProps {
  /** Hide the grainy background plane */
  hideBackground?: boolean;
  /** Scale the sphere + particles (default 1) */
  scale?: number;
  /** Move main content along X (positive = right) */
  positionX?: number;
}

export function NoiseSphereScene({
  hideBackground = false,
  scale = 1,
  positionX = 0,
}: NoiseSphereSceneProps = {}) {
  const pointsRef = useRef<THREE.Points>(null);
  const sphereUniforms = useMemo(
    () => ({
      u_time: { value: 0 },
      u_progress: { value: 0 },
    }),
    []
  );
  const pointsUniforms = useMemo(
    () => ({
      u_time: { value: 0 },
      u_progress: { value: 0 },
    }),
    []
  );
  const backgroundUniforms = useMemo(
    () => ({
      u_time: { value: 0 },
      u_progress: { value: 0 },
    }),
    []
  );

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    sphereUniforms.u_time.value = t;
    pointsUniforms.u_time.value = t;
    if (!hideBackground) backgroundUniforms.u_time.value = t;
    if (pointsRef.current) {
      pointsRef.current.rotation.y += 0.005;
    }
  });

  useEffect(() => {
    const tl = gsap.timeline({ repeat: -1, yoyo: true });
    tl.to(sphereUniforms.u_progress, {
      value: 5,
      duration: 5,
      ease: "power3.inOut",
    }).to(sphereUniforms.u_progress, {
      value: 1,
      duration: 5,
      ease: "power3.inOut",
    });
    gsap.to(pointsUniforms.u_progress, {
      value: 0.4,
      duration: 5,
      ease: "power3.inOut",
    });
    return () => {
      tl.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run once on mount
  }, []);

  const particlePositions = useMemo(() => createParticlePositions(), []);

  const mainContent = (
    <group scale={scale} position={[positionX, 0, 0]}>
      {/* Deformed sphere */}
      <mesh>
        <sphereGeometry args={[1, 162, 162]} />
        <shaderMaterial
          vertexShader={vertex}
          fragmentShader={fragment}
          uniforms={sphereUniforms}
          wireframe={false}
        />
      </mesh>

      {/* Particle shell */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[particlePositions, 3]}
          />
        </bufferGeometry>
        <shaderMaterial
          vertexShader={particleVertex}
          fragmentShader={particleFragment}
          uniforms={pointsUniforms}
          transparent
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </points>
    </group>
  );

  return (
    <>
      {mainContent}
      {!hideBackground && (
        <mesh position={[0, 0, -2]}>
          <planeGeometry args={[100, 15, 16, 16]} />
          <shaderMaterial
            vertexShader={backgroundVertex}
            fragmentShader={backgroundFragment}
            uniforms={backgroundUniforms}
            wireframe={false}
          />
        </mesh>
      )}
    </>
  );
}
