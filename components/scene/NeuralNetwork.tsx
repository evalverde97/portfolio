"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { generateAmbientField, generateAmbientEdges } from "@/lib/graph-data";
import { useExperienceStore } from "@/lib/experience-store";
import { smoothstep } from "@/lib/camera-path";
import { mulberry32 } from "@/lib/random";

const NODE_COUNT = 46;

export default function NeuralNetwork() {
  const pointsRef = useRef<THREE.Points>(null);
  const nodeMaterialRef = useRef<THREE.PointsMaterial>(null);
  const lineMaterialRef = useRef<THREE.LineBasicMaterial>(null);

  const { basePositions, edgePositions, seeds } = useMemo(() => {
    const field = generateAmbientField(NODE_COUNT);
    const edges = generateAmbientEdges(field, 2);

    const basePositions = new Float32Array(field.length * 3);
    field.forEach((p, i) => {
      basePositions[i * 3] = p[0];
      basePositions[i * 3 + 1] = p[1];
      basePositions[i * 3 + 2] = p[2];
    });

    const edgePositions = new Float32Array(edges.length * 6);
    edges.forEach(([a, b], i) => {
      edgePositions.set([a[0], a[1], a[2], b[0], b[1], b[2]], i * 6);
    });

    const rand = mulberry32(2024);
    const seeds = field.map(() => rand() * Math.PI * 2);

    return { basePositions, edgePositions, seeds };
  }, []);

  const nodePositions = useMemo(() => basePositions.slice(), [basePositions]);

  useFrame((state) => {
    const { scrollProgress, reducedMotion } = useExperienceStore.getState();
    const fadeIn = smoothstep(0.18, 0.36, scrollProgress);

    if (nodeMaterialRef.current) nodeMaterialRef.current.opacity = fadeIn * 0.9;
    if (lineMaterialRef.current) lineMaterialRef.current.opacity = fadeIn * 0.35;

    if (!reducedMotion && pointsRef.current) {
      const posAttr = pointsRef.current.geometry.attributes.position;
      const array = posAttr.array as Float32Array;
      const t = state.clock.elapsedTime;
      for (let i = 0; i < seeds.length; i += 1) {
        const ix = i * 3;
        const s = seeds[i];
        array[ix] = basePositions[ix] + Math.sin(t * 0.15 + s) * 0.12;
        array[ix + 1] = basePositions[ix + 1] + Math.cos(t * 0.12 + s) * 0.12;
        array[ix + 2] = basePositions[ix + 2] + Math.sin(t * 0.1 + s) * 0.12;
      }
      posAttr.needsUpdate = true;
    }
  });

  return (
    <group>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[nodePositions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          ref={nodeMaterialRef}
          transparent
          opacity={0}
          color="#9fc6ff"
          size={0.05}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[edgePositions, 3]} />
        </bufferGeometry>
        <lineBasicMaterial ref={lineMaterialRef} transparent opacity={0} color="#4d6fa8" />
      </lineSegments>
    </group>
  );
}
