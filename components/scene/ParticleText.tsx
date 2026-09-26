"use client";

import { useEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useExperienceStore } from "@/lib/experience-store";
import { useLocaleStore } from "@/lib/locale-store";
import { smoothstep } from "@/lib/camera-path";
import { mulberry32 } from "@/lib/random";
import { brainPaths } from "@/lib/brain-geometry";

type Samples = { origins: Float32Array; dust: Float32Array; brain: Float32Array; positions: Float32Array };

function sampleHeadline(): Samples | null {
  const title = document.getElementById("particle-headline");
  if (!title) return null;
  const w = window.innerWidth, h = window.innerHeight;
  const canvas = document.createElement("canvas");
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  ctx.fillStyle = "white";
  ctx.textBaseline = "middle";
  ctx.textAlign = "center";
  for (const line of title.children) {
    const rect = line.getBoundingClientRect();
    const style = getComputedStyle(line);
    ctx.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
    ctx.letterSpacing = style.letterSpacing;
    ctx.fillText(line.textContent ?? "", rect.x + rect.width / 2, rect.y + rect.height / 2);
  }
  const pixels = ctx.getImageData(0, 0, w, h).data;
  const origins: number[] = [], dust: number[] = [], brain: number[] = [];
  const curves = brainPaths().flat();
  const rand = mulberry32(99);
  const worldHeight = 2 * 6.5 * Math.tan(THREE.MathUtils.degToRad(45 / 2));
  const unit = worldHeight / h;
  const brainScale = Math.min(1, w / h * .92);
  const step = w < 768 ? 4 : 5;
  for (let y = 0; y < h; y += step) for (let x = 0; x < w; x += step) {
    // Transparent background: only glyph pixels become particles.
    if (pixels[(y * w + x) * 4 + 3] < 100) continue;
    origins.push((x - w / 2) * unit, (h / 2 - y) * unit, 0);
    const angle = rand() * Math.PI * 2, radius = 1 + rand() * 3;
    dust.push(Math.cos(angle) * radius * brainScale, Math.sin(angle) * radius * .65, (rand() - .5) * 2);
    const point = curves[Math.floor(rand() * curves.length)];
    brain.push(point.x * brainScale, point.y * brainScale, point.z);
  }
  return { origins: new Float32Array(origins), dust: new Float32Array(dust), brain: new Float32Array(brain), positions: new Float32Array(origins) };
}

export default function ParticleText() {
  const ref = useRef<THREE.Points>(null);
  const material = useRef<THREE.PointsMaterial>(null);
  const [samples, setSamples] = useState<Samples | null>(null);
  const locale = useLocaleStore((s) => s.locale);
  useEffect(() => {
    let active = true;
    const sample = () => { if (active) setSamples(sampleHeadline()); };
    void document.fonts.ready.then(sample);
    window.addEventListener("resize", sample);
    return () => { active = false; window.removeEventListener("resize", sample); };
  }, [locale]);
  useFrame(() => {
    if (!samples || !ref.current || !material.current) return;
    const { scrollProgress: p, reducedMotion } = useExperienceStore.getState();
    material.current.opacity = reducedMotion ? 0 : smoothstep(.015, .065, p) * (1 - smoothstep(.42, .57, p));
    if (!material.current.opacity) return;
    const scatter = smoothstep(.04, .2, p), form = smoothstep(.18, .34, p);
    const attr = ref.current.geometry.attributes.position;
    const a = attr.array as Float32Array;
    for (let i = 0; i < a.length; i++) {
      const spread = THREE.MathUtils.lerp(samples.origins[i], samples.dust[i], scatter);
      a[i] = THREE.MathUtils.lerp(spread, samples.brain[i], form);
    }
    attr.needsUpdate = true;
  });
  if (!samples) return null;
  return <points ref={ref} frustumCulled={false}>
    <bufferGeometry><bufferAttribute attach="attributes-position" args={[samples.positions, 3]} /></bufferGeometry>
    <pointsMaterial ref={material} color="#9fc6ff" transparent opacity={0} size={.016} depthWrite={false} blending={THREE.AdditiveBlending} />
  </points>;
}
