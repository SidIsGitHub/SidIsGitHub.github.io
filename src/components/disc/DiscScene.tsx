"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Environment, MeshReflectorMaterial } from "@react-three/drei";
import { useScroll, useSpring as useMotionSpring, useVelocity } from "motion/react";
import * as THREE from "three";
import { DISC_SPRING } from "@/lib/physics";

/**
 * DISC SCENE — THE YEEZUS JEWEL CASE
 *
 * A massive metallic CD in the center of the viewport.
 * Its rotation is tied to scroll VELOCITY, not position.
 * When you scroll hard, it SPINS violently.
 * When you stop, it decelerates with the weight of a flywheel.
 *
 * The red tape on the side — the one design element Kanye
 * used to mark the most stripped-down album of the decade.
 */
export default function DiscScene() {
  const discRef = useRef<THREE.Group>(null);
  const tapeRef = useRef<THREE.Mesh>(null);

  // Track scroll velocity
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useMotionSpring(scrollVelocity, DISC_SPRING);

  // Scroll-driven rotation — runs every frame
  useFrame((_, delta) => {
    if (!discRef.current) return;

    // Get current scroll velocity and normalize it
    const velocity = smoothVelocity.get();
    const normalizedVelocity = velocity * 0.0008;

    // Apply rotation — Y axis (spin) driven by velocity
    discRef.current.rotation.y += normalizedVelocity * delta * 60;

    // Subtle Z-axis wobble based on velocity magnitude
    const targetTilt = Math.sin(Date.now() * 0.001) * 0.05;
    discRef.current.rotation.z +=
      (targetTilt - discRef.current.rotation.z) * 0.02;

    // Gentle idle rotation when not scrolling
    discRef.current.rotation.y += delta * 0.15;

    // Subtle floating motion
    discRef.current.position.y =
      Math.sin(Date.now() * 0.0008) * 0.08;
  });

  return (
    <>
      {/* Harsh industrial lighting — single spot from above */}
      <spotLight
        position={[0, 8, 2]}
        angle={0.5}
        penumbra={0.3}
        intensity={3}
        color="#ffffff"
        castShadow
      />

      {/* Subtle fill from below — barely there */}
      <pointLight position={[0, -3, 1]} intensity={0.3} color="#d4a853" />

      {/* Ambient — very dim */}
      <ambientLight intensity={0.15} />

      {/* Environment for reflections */}
      <Environment preset="city" environmentIntensity={0.5} />

      {/* THE DISC */}
      <group ref={discRef} rotation={[Math.PI * 0.45, 0, 0.1]}>
        {/* Main CD body — thin cylinder */}
        <mesh>
          <cylinderGeometry args={[2.2, 2.2, 0.04, 64]} />
          <meshPhysicalMaterial
            color="#cccccc"
            metalness={1.0}
            roughness={0.08}
            clearcoat={1.0}
            clearcoatRoughness={0.05}
            iridescence={1.0}
            iridescenceIOR={1.8}
            iridescenceThicknessRange={[100, 800]}
            envMapIntensity={2.0}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Center hole */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.25, 0.25, 0.06, 32]} />
          <meshStandardMaterial color="#000000" metalness={0.9} roughness={0.2} />
        </mesh>

        {/* Inner ring detail */}
        <mesh>
          <torusGeometry args={[0.4, 0.015, 8, 64]} />
          <meshStandardMaterial
            color="#888888"
            metalness={0.9}
            roughness={0.3}
          />
        </mesh>

        {/* Outer rim */}
        <mesh>
          <torusGeometry args={[2.2, 0.02, 8, 64]} />
          <meshStandardMaterial
            color="#666666"
            metalness={0.95}
            roughness={0.2}
          />
        </mesh>

        {/* THE RED TAPE — the iconic Yeezus detail */}
        <mesh
          ref={tapeRef}
          position={[2.2, 0, 0]}
          rotation={[0, 0, Math.PI / 2]}
        >
          <boxGeometry args={[0.08, 0.8, 0.35]} />
          <meshStandardMaterial
            color="#cc0000"
            roughness={0.6}
            metalness={0.1}
          />
        </mesh>

        {/* Red tape text: "SIDDHANT" */}
        {/* We simulate text with a thin bright strip on the tape */}
        <mesh position={[2.2, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <boxGeometry args={[0.02, 0.6, 0.01]} />
          <meshStandardMaterial
            color="#ff4444"
            emissive="#ff0000"
            emissiveIntensity={0.3}
          />
        </mesh>
      </group>
    </>
  );
}
