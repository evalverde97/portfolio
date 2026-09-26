"use client";

import { useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { useFrame, useThree } from "@react-three/fiber";
import gsap from "gsap";
import * as THREE from "three";
import { useExperienceStore } from "@/lib/experience-store";
import { projectNodes } from "@/lib/graph-data";
import { mulberry32 } from "@/lib/random";
import { NETWORK_DEPTH } from "@/lib/brain-geometry";

const STREAK_COUNT = 260;

export default function PortalTransition() {
  const { camera } = useThree();
  const router = useRouter();
  const runningRef = useRef(false);
  const burstRef = useRef<THREE.Points>(null);
  const burstMaterialRef = useRef<THREE.PointsMaterial>(null);
  const burstProgress = useRef({ current: 0 });

  const { positions, directions } = useMemo(() => {
    const rand = mulberry32(7);
    const positions = new Float32Array(STREAK_COUNT * 3);
    const directions = new Float32Array(STREAK_COUNT * 3);
    for (let i = 0; i < STREAK_COUNT; i += 1) {
      const dir = new THREE.Vector3(
        rand() * 2 - 1,
        rand() * 2 - 1,
        rand() * 2 - 1
      ).normalize();
      directions.set([dir.x, dir.y, dir.z], i * 3);
      positions.set([dir.x * 0.4, dir.y * 0.4, dir.z * 0.4], i * 3);
    }
    return { positions, directions };
  }, []);

  useFrame(() => {
    if (!burstRef.current) return;
    const p = burstProgress.current.current;

    if (p <= 0) {
      if (burstMaterialRef.current) burstMaterialRef.current.opacity = 0;
      return;
    }

    const posAttr = burstRef.current.geometry.attributes.position;
    const array = posAttr.array as Float32Array;
    for (let i = 0; i < STREAK_COUNT; i += 1) {
      const ix = i * 3;
      const radius = 0.4 + p * 16;
      array[ix] = directions[ix] * radius;
      array[ix + 1] = directions[ix + 1] * radius;
      array[ix + 2] = directions[ix + 2] * radius;
    }
    posAttr.needsUpdate = true;
    if (burstMaterialRef.current) {
      burstMaterialRef.current.opacity = Math.sin(Math.min(p, 1) * Math.PI) * 0.85;
    }
  });

  useEffect(() => {
    return useExperienceStore.subscribe((state, prev) => {
      if (
        state.transitionPhase !== "traveling" ||
        prev.transitionPhase === "traveling" ||
        !state.activeNodeId ||
        runningRef.current
      ) {
        return;
      }

      runningRef.current = true;
      const node = projectNodes.find((n) => n.id === state.activeNodeId);
      const { reducedMotion } = useExperienceStore.getState();

      if (!node) {
        runningRef.current = false;
        return;
      }

      const finish = () => {
        router.push(`/projects/${node.slug}`);
        window.setTimeout(() => {
          burstProgress.current.current = 0;
          useExperienceStore.getState().setTransitionPhase("idle");
          runningRef.current = false;
        }, 350);
      };

      if (reducedMotion) {
        window.setTimeout(finish, 150);
        return;
      }

      const target = new THREE.Vector3(...node.position);
      target.z += NETWORK_DEPTH;
      burstRef.current?.position.copy(camera.position);
      const tl = gsap.timeline({
        defaults: { ease: "power2.inOut" },
        onComplete: finish,
      });

      tl.to(camera.position, {
        x: target.x * 0.55,
        y: target.y * 0.55 + 0.2,
        z: target.z + 1.3,
        duration: 0.85,
      });
      if (camera instanceof THREE.PerspectiveCamera) {
        tl.to(
          camera,
          {
            fov: 24,
            duration: 0.85,
            onUpdate: () => camera.updateProjectionMatrix(),
          },
          "<"
        );
      }
      tl.to(
        burstProgress.current,
        { current: 1, duration: 0.75, ease: "power1.in" },
        "<0.15"
      );
    });
  }, [camera, router]);

  return (
    <points ref={burstRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        ref={burstMaterialRef}
        transparent
        opacity={0}
        color="#eaf3ff"
        size={0.05}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
