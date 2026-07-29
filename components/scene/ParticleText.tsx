"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";
import { useExperienceStore } from "@/lib/experience-store";
import { smoothstep } from "@/lib/camera-path";
import { mulberry32 } from "@/lib/random";
import { isMobileViewport } from "@/lib/device";

const LINES = ["Hola.", "Soy", "Ezequiel Valverde."];
const CANVAS_W = 1024;
const CANVAS_H = 384;
const PLANE_WIDTH = 7.6;

function sampleTextPoints(rand: () => number, step: number) {
  const canvas = document.createElement("canvas");
  canvas.width = CANVAS_W;
  canvas.height = CANVAS_H;
  const ctx = canvas.getContext("2d");
  if (!ctx) return { origins: new Float32Array(0), count: 0 };

  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
  ctx.fillStyle = "#fff";
  ctx.textBaseline = "middle";
  ctx.font = "700 74px 'Courier New', Consolas, monospace";

  const lineHeight = 92;
  const startY = CANVAS_H / 2 - lineHeight;
  LINES.forEach((line, i) => {
    ctx.fillText(line, 24, startY + i * lineHeight);
  });

  const { data } = ctx.getImageData(0, 0, CANVAS_W, CANVAS_H);
  const positions: number[] = [];
  const planeHeight = (PLANE_WIDTH * CANVAS_H) / CANVAS_W;

  for (let y = 0; y < CANVAS_H; y += step) {
    for (let x = 0; x < CANVAS_W; x += step) {
      const alpha = data[(y * CANVAS_W + x) * 4 + 3];
      if (alpha > 128) {
        const worldX = (x / CANVAS_W - 0.5) * PLANE_WIDTH;
        const worldY = -(y / CANVAS_H - 0.5) * planeHeight + 0.2;
        const worldZ = (rand() - 0.5) * 0.4;
        positions.push(worldX, worldY, worldZ);
      }
    }
  }

  return { origins: new Float32Array(positions), count: positions.length / 3 };
}

function randomDustTarget(rand: () => number): [number, number, number] {
  const radius = 2.4 + rand() * 4.2;
  const theta = rand() * Math.PI * 2;
  const phi = Math.acos(rand() * 2 - 1);
  return [
    radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.sin(phi) * Math.sin(theta) * 0.6,
    radius * Math.cos(phi) - 2,
  ];
}

const TERMINAL_GREEN = new THREE.Color("#4dff8c");
const NETWORK_BLUE = new THREE.Color("#bcd9ff");

export default function ParticleText() {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.PointsMaterial>(null);

  const { origins, targets, count } = useMemo(() => {
    const rand = mulberry32(99);
    const { origins, count } = sampleTextPoints(rand, isMobileViewport() ? 5 : 3);
    const targets = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      const [tx, ty, tz] = randomDustTarget(rand);
      targets[i * 3] = tx;
      targets[i * 3 + 1] = ty;
      targets[i * 3 + 2] = tz;
    }
    return { origins, targets, count };
  }, []);

  const positions = useMemo(() => origins.slice(), [origins]);

  useFrame(() => {
    const geometry = pointsRef.current?.geometry;
    if (!geometry || count === 0) return;

    const { scrollProgress } = useExperienceStore.getState();
    const dissolveT = smoothstep(0, 0.18, scrollProgress);
    const fadeIn = smoothstep(0, 0.03, scrollProgress);
    const fadeOut = smoothstep(0.2, 0.34, scrollProgress);
    const opacity = Math.max(fadeIn - fadeOut, 0);

    if (materialRef.current) {
      materialRef.current.opacity = opacity;
      // The typed-out headline is terminal green; as it dissolves into the
      // network it shifts toward the network's electric blue.
      materialRef.current.color.lerpColors(TERMINAL_GREEN, NETWORK_BLUE, dissolveT);
    }
    if (opacity <= 0) return;

    const posAttr = geometry.attributes.position;
    const array = posAttr.array as Float32Array;
    for (let i = 0; i < count; i += 1) {
      const ix = i * 3;
      array[ix] = origins[ix] + (targets[ix] - origins[ix]) * dissolveT;
      array[ix + 1] =
        origins[ix + 1] + (targets[ix + 1] - origins[ix + 1]) * dissolveT;
      array[ix + 2] =
        origins[ix + 2] + (targets[ix + 2] - origins[ix + 2]) * dissolveT;
    }
    posAttr.needsUpdate = true;
  });

  if (count === 0) return null;

  return (
    <Points ref={pointsRef} positions={positions} stride={3}>
      <PointMaterial
        ref={materialRef}
        transparent
        color="#4dff8c"
        size={0.026}
        sizeAttenuation
        depthWrite={false}
        opacity={0}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}
