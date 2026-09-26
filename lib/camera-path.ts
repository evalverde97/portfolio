import { Vector3 } from "three";

type Keyframe = { t: number; position: Vector3; fov: number };

/**
 * Hand-authored camera path across the 0→1 scroll timeline, matching the
 * storyboard beats: dissolve the text, hold the brain silhouette, travel
 * through the cortex and settle inside the project network at z=-12.
 */
const keyframes: Keyframe[] = [
  { t: 0, position: new Vector3(0, 0, 6.5), fov: 45 },
  { t: 0.36, position: new Vector3(0, 0, 6.5), fov: 45 },
  { t: 0.43, position: new Vector3(0, 0, 6.5), fov: 45 },
  { t: 0.62, position: new Vector3(0, 0, -2.5), fov: 50 },
  { t: 1, position: new Vector3(0, 0, -2.5), fov: 50 },
];

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = Math.min(Math.max((x - edge0) / (edge1 - edge0), 0), 1);
  return t * t * (3 - 2 * t);
}

const tmp = new Vector3();

export function getCameraKeyframe(progress: number) {
  const p = Math.min(Math.max(progress, 0), 1);
  let lower = keyframes[0];
  let upper = keyframes[keyframes.length - 1];

  for (let i = 0; i < keyframes.length - 1; i += 1) {
    if (p >= keyframes[i].t && p <= keyframes[i + 1].t) {
      lower = keyframes[i];
      upper = keyframes[i + 1];
      break;
    }
  }

  const span = upper.t - lower.t || 1;
  const localT = smoothstep(0, 1, (p - lower.t) / span);

  tmp.copy(lower.position).lerp(upper.position, localT);
  const fov = lower.fov + (upper.fov - lower.fov) * localT;

  return { position: tmp.clone(), fov };
}

export { smoothstep };
