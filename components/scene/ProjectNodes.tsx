"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { projectNodes } from "@/lib/graph-data";
import { useExperienceStore } from "@/lib/experience-store";
import { smoothstep } from "@/lib/camera-path";
import ProjectNode from "./ProjectNode";

const ACCENT = new THREE.Color("#6fb3ff");
const NEUTRAL = new THREE.Color("#3a4f73");
const DIM = new THREE.Color("#171d29");
const HIDDEN = new THREE.Color("#000000");

export default function ProjectNodes() {
  const lineRef = useRef<THREE.LineSegments>(null);
  const materialRef = useRef<THREE.LineBasicMaterial>(null);

  const { positions, colors, edgePairs, edgeGates } = useMemo(() => {
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

    return { positions, colors, edgePairs: pairs, edgeGates: gates };
  }, []);

  useFrame(() => {
    const { scrollProgress, hoveredNodeId, expandedNodeId } =
      useExperienceStore.getState();
    const fadeIn = smoothstep(0.32, 0.5, scrollProgress);
    if (materialRef.current) materialRef.current.opacity = fadeIn * 0.8;

    const colorAttr = lineRef.current?.geometry.attributes.color;
    if (!colorAttr) return;
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
      {projectNodes.map((node) => (
        <ProjectNode key={node.id} node={node} />
      ))}
    </group>
  );
}
