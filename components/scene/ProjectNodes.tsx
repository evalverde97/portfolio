"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { projectNodes } from "@/lib/graph-data";
import { useExperienceStore } from "@/lib/experience-store";
import { smoothstep } from "@/lib/camera-path";
import { mulberry32 } from "@/lib/random";
import ProjectNode from "./ProjectNode";

const STEPS = 28;
const TRAIL = 5;
const ACCENT = new THREE.Color("#9fc6ff");
const REST = new THREE.Color("#425e81");

function buildFibers() {
  const rand = mulberry32(4242);
  const byId = new Map(projectNodes.map(node => [node.id, node]));
  const seen = new Set<string>();
  const fibers: { points: THREE.Vector3[]; owners: string[]; phase: number; speed: number; twig: boolean }[] = [];
  function add(start: THREE.Vector3, end: THREE.Vector3, owners: string[], twig = false) {
    const direction = end.clone().sub(start);
    const normal = new THREE.Vector3(-direction.y, direction.x, .3).normalize();
    const bend = (rand() > .5 ? 1 : -1) * Math.min(direction.length() * .3, .65);
    const controls = [start];
    for (const u of [.28, .62]) {
      controls.push(start.clone().lerp(end, u).addScaledVector(normal, bend * (u < .5 ? 1 : -.6)));
    }
    controls.push(end);
    const curve = new THREE.CatmullRomCurve3(controls);
    const fiber = { points: curve.getPoints(STEPS), owners, phase: rand() * 3, speed: .16 + rand() * .17, twig };
    fibers.push(fiber);
    return curve;
  }
  for (const node of projectNodes) {
    for (const id of node.connections) {
      const other = byId.get(id);
      if (!other) continue;
      const key = [node.id, id].sort().join(":");
      if (seen.has(key)) continue;
      seen.add(key);
      const owners = [node.id, id];
      const curve = add(new THREE.Vector3(...node.position), new THREE.Vector3(...other.position), owners);
      // Short dendritic endings break up the long paths without closing polygons.
      for (const u of [.3, .68]) {
        const start = curve.getPoint(u);
        const tangent = curve.getTangent(u);
        const side = rand() > .5 ? 1 : -1;
        const end = start.clone().add(new THREE.Vector3(-tangent.y * side, tangent.x * side, (rand() - .5) * .6).multiplyScalar(.4 + rand() * .55));
        add(start, end, owners, true);
      }
    }
  }
  // Local arbors around each project make the nodes read as neural clusters.
  for (const node of projectNodes.filter(node => !node.parentId)) {
    for (let i = 0; i < 3; i++) {
      const angle = rand() * Math.PI * 2;
      const start = new THREE.Vector3(...node.position);
      const end = start.clone().add(new THREE.Vector3(Math.cos(angle), Math.sin(angle), (rand() - .5) * .8).multiplyScalar(.5 + rand() * .8));
      add(start, end, [node.id], true);
    }
  }
  const positions = new Float32Array(fibers.length * STEPS * 6);
  fibers.forEach((fiber, index) => {
    for (let s = 0; s < STEPS; s++) positions.set([...fiber.points[s].toArray(), ...fiber.points[s + 1].toArray()], (index * STEPS + s) * 6);
  });
  return { fibers, positions, colors: new Float32Array(positions.length) };
}

export default function ProjectNodes() {
  const lineRef = useRef<THREE.LineSegments>(null);
  const materialRef = useRef<THREE.LineBasicMaterial>(null);
  const pulseRef = useRef<THREE.Points>(null);
  const pulseMaterialRef = useRef<THREE.PointsMaterial>(null);
  const { fibers, positions, colors } = useMemo(() => buildFibers(), []);
  const pulsePositions = useMemo(() => new Float32Array(fibers.length * TRAIL * 3), [fibers]);
  const pulseColors = useMemo(() => new Float32Array(fibers.length * TRAIL * 3), [fibers]);

  useFrame((state, delta) => {
    const { scrollProgress, hoveredNodeId, reducedMotion } = useExperienceStore.getState();
    const fade = smoothstep(.56, .7, scrollProgress);
    if (materialRef.current) materialRef.current.opacity = fade * .7;
    if (pulseMaterialRef.current) pulseMaterialRef.current.opacity = reducedMotion ? 0 : fade;
    if (!fade || !lineRef.current || !pulseRef.current) return;
    const lineColors = lineRef.current.geometry.attributes.color;
    const colorArray = lineColors.array as Float32Array;
    const pulsePositionAttr = pulseRef.current.geometry.attributes.position;
    const pulseColorAttr = pulseRef.current.geometry.attributes.color;
    const time = reducedMotion ? 0 : state.clock.elapsedTime;
    const smoothing = 1 - Math.exp(-8 * delta);
    fibers.forEach((fiber, index) => {
      const selected = hoveredNodeId !== null && fiber.owners.includes(hoveredNodeId);
      const dimmed = hoveredNodeId !== null && !selected;
      // Each fiber rests between firings; the trails never flash in synchrony.
      const cycle = (time * fiber.speed + fiber.phase) % 2.7;
      const brightness = reducedMotion ? 0 : Math.sin(Math.min(cycle, 1) * Math.PI) * .16;
      const strength = (fiber.twig ? .5 : .85) * (dimmed ? .2 : 1) + brightness;
      const target = selected ? ACCENT : REST;
      for (let s = 0; s < STEPS * 2; s++) {
        const off = (index * STEPS * 2 + s) * 3;
        colorArray[off] += (target.r * strength - colorArray[off]) * smoothing;
        colorArray[off + 1] += (target.g * strength - colorArray[off + 1]) * smoothing;
        colorArray[off + 2] += (target.b * strength - colorArray[off + 2]) * smoothing;
      }
      for (let trail = 0; trail < TRAIL; trail++) {
        const u = cycle - trail * .025;
        const visible = !reducedMotion && u > 0 && u < 1;
        const sample = THREE.MathUtils.clamp(u, 0, .9999) * STEPS;
        const segment = Math.floor(sample), fraction = sample - segment;
        const a = fiber.points[segment], b = fiber.points[segment + 1];
        const offset = (index * TRAIL + trail) * 3;
        pulsePositions[offset] = THREE.MathUtils.lerp(a.x, b.x, fraction);
        pulsePositions[offset + 1] = THREE.MathUtils.lerp(a.y, b.y, fraction);
        pulsePositions[offset + 2] = THREE.MathUtils.lerp(a.z, b.z, fraction);
        const intensity = visible ? Math.sin(u * Math.PI) * (1 - trail / TRAIL) * (dimmed ? .15 : 1) : 0;
        pulseColors[offset] = ACCENT.r * intensity;
        pulseColors[offset + 1] = ACCENT.g * intensity;
        pulseColors[offset + 2] = ACCENT.b * intensity;
      }
    });
    lineColors.needsUpdate = true;
    pulsePositionAttr.needsUpdate = true;
    pulseColorAttr.needsUpdate = true;
  });

  return <group>
    <lineSegments ref={lineRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <lineBasicMaterial ref={materialRef} transparent opacity={0} vertexColors depthWrite={false} />
    </lineSegments>
    <points ref={pulseRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[pulsePositions, 3]} />
        <bufferAttribute attach="attributes-color" args={[pulseColors, 3]} />
      </bufferGeometry>
      <pointsMaterial ref={pulseMaterialRef} transparent vertexColors opacity={0} size={.055} depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
    {projectNodes.map(node => <ProjectNode key={node.id} node={node} />)}
  </group>;
}
