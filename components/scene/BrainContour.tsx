"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { brainPaths } from "@/lib/brain-geometry";
import { smoothstep } from "@/lib/camera-path";
import { useExperienceStore } from "@/lib/experience-store";

export default function BrainContour() {
  const material = useRef<THREE.LineBasicMaterial>(null);
  const group = useRef<THREE.Group>(null);
  const { size } = useThree();
  const positions = useMemo(() => {
    const vertices: number[] = [];
    for (const path of brainPaths()) for (let i = 1; i < path.length; i++) {
      vertices.push(...path[i - 1].toArray(), ...path[i].toArray());
    }
    return new Float32Array(vertices);
  }, []);
  useFrame(() => {
    const { scrollProgress: p } = useExperienceStore.getState();
    const alpha = smoothstep(.26, .35, p) * (1 - smoothstep(.47, .6, p));
    if (material.current) material.current.opacity = alpha * .8;
    if (group.current) group.current.visible = alpha > .001;
  });
  const scale = Math.min(1, size.width / size.height * .92);
  return <group ref={group} scale={[scale, scale, 1]}>
    <lineSegments>
      <bufferGeometry><bufferAttribute attach="attributes-position" args={[positions, 3]} /></bufferGeometry>
      <lineBasicMaterial ref={material} color="#9fc6ff" transparent opacity={0} depthWrite={false} blending={THREE.AdditiveBlending} />
    </lineSegments>
  </group>;
}
