"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html, useCursor } from "@react-three/drei";
import * as THREE from "three";
import type { ProjectNode as ProjectNodeData } from "@/lib/graph-data";
import { useExperienceStore } from "@/lib/experience-store";
import { smoothstep } from "@/lib/camera-path";

const tmpScale = new THREE.Vector3();

export default function ProjectNode({ node }: { node: ProjectNodeData }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);
  const [hovered, setHovered] = useState(false);
  useCursor(hovered);

  const isUmbrella = Boolean(node.children && node.children.length > 0);
  const parentVisible = useExperienceStore(
    (s) => !node.parentId || s.expandedNodeId === node.parentId
  );

  const setHoveredNodeId = useExperienceStore((s) => s.setHoveredNodeId);
  const beginTravelTo = useExperienceStore((s) => s.beginTravelTo);
  const toggleExpandedNode = useExperienceStore((s) => s.toggleExpandedNode);

  useFrame((state) => {
    const { scrollProgress, hoveredNodeId, transitionPhase, reducedMotion } =
      useExperienceStore.getState();
    const fadeIn =
      smoothstep(0.32, 0.5, scrollProgress) * (parentVisible ? 1 : 0);
    const isHovered = hoveredNodeId === node.id;
    const dimmed = hoveredNodeId != null && !isHovered;

    if (materialRef.current) {
      const targetEmissive = isHovered ? 1.5 : dimmed ? 0.15 : 0.55;
      materialRef.current.emissiveIntensity +=
        (targetEmissive - materialRef.current.emissiveIntensity) * 0.15;
      materialRef.current.opacity += (fadeIn - materialRef.current.opacity) * 0.1;
    }

    if (meshRef.current) {
      const targetScale = (isHovered ? 1.5 : 1) * Math.max(fadeIn, 0.001);
      tmpScale.set(targetScale, targetScale, targetScale);
      meshRef.current.scale.lerp(tmpScale, 0.15);

      if (!reducedMotion && transitionPhase === "idle") {
        const t = state.clock.elapsedTime;
        const drift = Math.sin(t * 0.2 + node.position[0]) * 0.05;
        meshRef.current.position.set(
          node.position[0],
          node.position[1] + drift,
          node.position[2]
        );
      } else {
        meshRef.current.position.set(...node.position);
      }
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={node.position}
      onPointerOver={(e) => {
        if (!parentVisible) return;
        e.stopPropagation();
        setHovered(true);
        setHoveredNodeId(node.id);
      }}
      onPointerOut={(e) => {
        if (!parentVisible) return;
        e.stopPropagation();
        setHovered(false);
        setHoveredNodeId(null);
      }}
      onClick={(e) => {
        if (!parentVisible) return;
        e.stopPropagation();
        if (isUmbrella) {
          toggleExpandedNode(node.id);
        } else {
          beginTravelTo(node.id);
        }
      }}
    >
      <sphereGeometry args={[0.16, 32, 32]} />
      <meshStandardMaterial
        ref={materialRef}
        color="#bcd9ff"
        emissive="#4d9fff"
        emissiveIntensity={0.5}
        transparent
        opacity={0}
        toneMapped={false}
      />
      {hovered && parentVisible && (
        <Html distanceFactor={8} position={[0.3, 0.15, 0]} className="pointer-events-none">
          <div className="w-48 rounded-lg border border-white/15 bg-black/80 p-3 text-white backdrop-blur-md">
            <p className="text-sm font-semibold">{node.title}</p>
            <p className="mt-1 text-xs text-muted">{node.category}</p>
            {isUmbrella ? (
              <p className="mt-2 text-xs text-accent-soft">
                {node.children!.length}{" "}
                {node.children!.length === 1 ? "proyecto" : "proyectos"} · click
                para explorar
              </p>
            ) : (
              <ul className="mt-2 space-y-0.5 text-xs text-accent-soft">
                {node.tech.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            )}
            {node.year && <p className="mt-2 text-xs text-muted">{node.year}</p>}
          </div>
        </Html>
      )}
    </mesh>
  );
}
