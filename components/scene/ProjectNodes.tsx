"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { projectNodes } from "@/lib/graph-data";
import { useExperienceStore } from "@/lib/experience-store";
import { smoothstep } from "@/lib/camera-path";
import { mulberry32 } from "@/lib/random";
import ProjectNode from "./ProjectNode";

const ACCENT = new THREE.Color("#6fb3ff");
const NEUTRAL = new THREE.Color("#3a4f73");
const DIM = new THREE.Color("#171d29");
const HIDDEN = new THREE.Color("#000000");
const PULSE_COLOR = new THREE.Color("#eaf3ff");

export default function ProjectNodes() {
  const lineRef = useRef<THREE.LineSegments>(null);
  const materialRef = useRef<THREE.LineBasicMaterial>(null);
  const pulseRef = useRef<THREE.Points>(null);
  const pulseMaterialRef = useRef<THREE.PointsMaterial>(null);

  const {
    positions,
    colors,
    edgePairs,
    edgeGates,
    pulseEdgeA,
    pulseEdgeB,
    pulsePhase,
    pulseSpeed,
    pulseCount,
  } = useMemo(() => {
    const byId = new Map(projectNodes.map((n) => [n.id, n]));
    const seen = new Set<string>();
    const pairs: [string, string][] = [];
    // For each edge, the parent id that must be expanded for it to show
    // (null for edges between two top-level nodes, always visible).
    const gates: (string | null)[] = [];

    projectNodes.forEach((node) => {
      node.connections.forEach((targetId) => {
        if (!byId.has(targetId)) return;
        const key = [node.id, targetId].sort().join("::");
        if (seen.has(key)) return;
        seen.add(key);
        pairs.push([node.id, targetId]);
        const a = byId.get(node.id)!;
        const b = byId.get(targetId)!;
        gates.push(a.parentId ?? b.parentId ?? null);
      });
    });

    const positions = new Float32Array(pairs.length * 6);
    const colors = new Float32Array(pairs.length * 6);
    pairs.forEach(([a, b], i) => {
      const na = byId.get(a)!;
      const nb = byId.get(b)!;
      positions.set(
        [...na.position, ...nb.position],
        i * 6
      );
      colors.set(
        [
          NEUTRAL.r, NEUTRAL.g, NEUTRAL.b,
          NEUTRAL.r, NEUTRAL.g, NEUTRAL.b,
        ],
        i * 6
      );
    });

    // Traveling signal pulses along the always-visible top-level mesh
    // (skip parent-gated edges — they're mostly hidden anyway).
    const rand = mulberry32(4242);
    const topLevelIdx = pairs
      .map((_, i) => i)
      .filter((i) => gates[i] == null);
    const pulseCount = topLevelIdx.length;
    const pulseEdgeA = new Float32Array(pulseCount * 3);
    const pulseEdgeB = new Float32Array(pulseCount * 3);
    const pulsePhase = new Float32Array(pulseCount);
    const pulseSpeed = new Float32Array(pulseCount);
    topLevelIdx.forEach((edgeIdx, i) => {
      const [a, b] = pairs[edgeIdx];
      pulseEdgeA.set(byId.get(a)!.position, i * 3);
      pulseEdgeB.set(byId.get(b)!.position, i * 3);
      pulsePhase[i] = rand();
      pulseSpeed[i] = 0.12 + rand() * 0.18;
    });

    return {
      positions,
      colors,
      edgePairs: pairs,
      edgeGates: gates,
      pulseEdgeA,
      pulseEdgeB,
      pulsePhase,
      pulseSpeed,
      pulseCount,
    };
  }, []);

  const pulsePositions = useMemo(() => new Float32Array(pulseCount * 3), [pulseCount]);
  const pulseColors = useMemo(() => new Float32Array(pulseCount * 3), [pulseCount]);

  useFrame((state) => {
    const { scrollProgress, hoveredNodeId, expandedNodeId, reducedMotion } =
      useExperienceStore.getState();
    const fadeIn = smoothstep(0.32, 0.5, scrollProgress);
    if (materialRef.current) materialRef.current.opacity = fadeIn * 0.8;

    const colorAttr = lineRef.current?.geometry.attributes.color;
    if (colorAttr) {
      const array = colorAttr.array as Float32Array;

      edgePairs.forEach(([a, b], i) => {
        const gate = edgeGates[i];
        const gateOpen = gate == null || gate === expandedNodeId;
        let target = NEUTRAL;
        if (!gateOpen) {
          target = HIDDEN;
        } else if (hoveredNodeId != null) {
          const connected = a === hoveredNodeId || b === hoveredNodeId;
          target = connected ? ACCENT : DIM;
        }
        const ix = i * 6;
        for (let v = 0; v < 2; v += 1) {
          const off = ix + v * 3;
          array[off] += (target.r - array[off]) * 0.12;
          array[off + 1] += (target.g - array[off + 1]) * 0.12;
          array[off + 2] += (target.b - array[off + 2]) * 0.12;
        }
      });
      colorAttr.needsUpdate = true;
    }

    if (pulseRef.current && pulseCount > 0) {
      const posAttr = pulseRef.current.geometry.attributes.position;
      const posArray = posAttr.array as Float32Array;
      const pulseColorAttr = pulseRef.current.geometry.attributes.color;
      const pulseColorArray = pulseColorAttr.array as Float32Array;
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

        const intensity = reducedMotion ? 0 : Math.sin(progress * Math.PI) * fadeIn;
        pulseColorArray[ix] = PULSE_COLOR.r * intensity;
        pulseColorArray[ix + 1] = PULSE_COLOR.g * intensity;
        pulseColorArray[ix + 2] = PULSE_COLOR.b * intensity;
      }

      posAttr.needsUpdate = true;
      pulseColorAttr.needsUpdate = true;
      if (pulseMaterialRef.current) pulseMaterialRef.current.opacity = fadeIn * 0.8;
    }
  });

  return (
    <group>
      <lineSegments ref={lineRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        </bufferGeometry>
        <lineBasicMaterial ref={materialRef} transparent opacity={0} vertexColors />
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
          size={0.07}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
      {projectNodes.map((node) => (
        <ProjectNode key={node.id} node={node} />
      ))}
    </group>
  );
}
