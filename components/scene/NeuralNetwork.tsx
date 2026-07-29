"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { generateAmbientField, generateAmbientEdges } from "@/lib/graph-data";
import { useExperienceStore } from "@/lib/experience-store";
import { smoothstep } from "@/lib/camera-path";
import { mulberry32 } from "@/lib/random";

const NODE_COUNT = 70;
const NEIGHBOURS = 3;
const PULSE_COLOR = new THREE.Color("#dcebff");

export default function NeuralNetwork() {
  const pointsRef = useRef<THREE.Points>(null);
  const nodeMaterialRef = useRef<THREE.PointsMaterial>(null);
  const lineMaterialRef = useRef<THREE.LineBasicMaterial>(null);
  const pulseRef = useRef<THREE.Points>(null);
  const pulseMaterialRef = useRef<THREE.PointsMaterial>(null);

  const {
    basePositions,
    edgePositions,
    seeds,
    pulseEdgeA,
    pulseEdgeB,
    pulsePhase,
    pulseSpeed,
    pulseCount,
  } = useMemo(() => {
    const field = generateAmbientField(NODE_COUNT);
    const edges = generateAmbientEdges(field, NEIGHBOURS);

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

    // One "signal" travels along each edge, like impulses along a dendrite.
    const pulseCount = edges.length;
    const pulseEdgeA = new Float32Array(pulseCount * 3);
    const pulseEdgeB = new Float32Array(pulseCount * 3);
    const pulsePhase = new Float32Array(pulseCount);
    const pulseSpeed = new Float32Array(pulseCount);
    edges.forEach(([a, b], i) => {
      pulseEdgeA.set(a, i * 3);
      pulseEdgeB.set(b, i * 3);
      pulsePhase[i] = rand();
      pulseSpeed[i] = 0.18 + rand() * 0.32;
    });

    return {
      basePositions,
      edgePositions,
      seeds,
      pulseEdgeA,
      pulseEdgeB,
      pulsePhase,
      pulseSpeed,
      pulseCount,
    };
  }, []);

  const nodePositions = useMemo(() => basePositions.slice(), [basePositions]);
  const pulsePositions = useMemo(() => new Float32Array(pulseCount * 3), [pulseCount]);
  const pulseColors = useMemo(() => new Float32Array(pulseCount * 3), [pulseCount]);

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

    if (pulseRef.current) {
      const posAttr = pulseRef.current.geometry.attributes.position;
      const posArray = posAttr.array as Float32Array;
      const colorAttr = pulseRef.current.geometry.attributes.color;
      const colorArray = colorAttr.array as Float32Array;
      const t = reducedMotion ? 0 : state.clock.elapsedTime;

      for (let i = 0; i < pulseCount; i += 1) {
        const ix = i * 3;
        const progress = reducedMotion
          ? 0
          : (t * pulseSpeed[i] + pulsePhase[i]) % 1;

        posArray[ix] = pulseEdgeA[ix] + (pulseEdgeB[ix] - pulseEdgeA[ix]) * progress;
        posArray[ix + 1] =
          pulseEdgeA[ix + 1] + (pulseEdgeB[ix + 1] - pulseEdgeA[ix + 1]) * progress;
        posArray[ix + 2] =
          pulseEdgeA[ix + 2] + (pulseEdgeB[ix + 2] - pulseEdgeA[ix + 2]) * progress;

        // Fade in/out across the traversal so pulses don't pop at the ends.
        const intensity = reducedMotion ? 0 : Math.sin(progress * Math.PI) * fadeIn;
        colorArray[ix] = PULSE_COLOR.r * intensity;
        colorArray[ix + 1] = PULSE_COLOR.g * intensity;
        colorArray[ix + 2] = PULSE_COLOR.b * intensity;
      }

      posAttr.needsUpdate = true;
      colorAttr.needsUpdate = true;
      if (pulseMaterialRef.current) pulseMaterialRef.current.opacity = fadeIn;
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
      <points ref={pulseRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[pulsePositions, 3]} />
          <bufferAttribute attach="attributes-color" args={[pulseColors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          ref={pulseMaterialRef}
          transparent
          vertexColors
          opacity={0}
          size={0.055}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}
