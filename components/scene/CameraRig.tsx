"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { PerspectiveCamera, Vector3 } from "three";
import { useExperienceStore } from "@/lib/experience-store";
import { getCameraKeyframe } from "@/lib/camera-path";

const lookTarget = new Vector3(0, 0.2, 0);

export default function CameraRig() {
  const { camera } = useThree();

  useFrame((state) => {
    const { scrollProgress, transitionPhase, reducedMotion } =
      useExperienceStore.getState();

    if (transitionPhase !== "idle") return; // PortalTransition owns the camera

    const { position, fov } = getCameraKeyframe(scrollProgress);

    if (!reducedMotion && scrollProgress > 0.55) {
      const breathe = Math.sin(state.clock.elapsedTime * 0.35) * 0.08;
      position.x += breathe;
      position.y += breathe * 0.5;
    }

    camera.position.lerp(position, reducedMotion ? 1 : 0.08);
    camera.lookAt(lookTarget);

    if (camera instanceof PerspectiveCamera) {
      const nextFov = reducedMotion
        ? fov
        : camera.fov + (fov - camera.fov) * 0.08;
      if (Math.abs(camera.fov - nextFov) > 0.01) {
        // Mutating the three.js camera imperatively inside useFrame is the
        // standard R3F pattern — this isn't a React render-phase mutation.
        // eslint-disable-next-line react-hooks/immutability
        camera.fov = nextFov;
        camera.updateProjectionMatrix();
      }
    }
  });

  return null;
}
