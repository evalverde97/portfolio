"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import CameraRig from "./CameraRig";
import ParticleText from "./ParticleText";
import NeuralNetwork from "./NeuralNetwork";
import ProjectNodes from "./ProjectNodes";
import PortalTransition from "./PortalTransition";
import { isMobileViewport } from "@/lib/device";

export default function Experience() {
  const mobile = isMobileViewport();

  return (
    <Canvas
      camera={{ position: [0, 0, 6.5], fov: 45, near: 0.1, far: 60 }}
      gl={{ antialias: !mobile, powerPreference: "high-performance" }}
      dpr={mobile ? [1, 1.5] : [1, 2]}
    >
      <color attach="background" args={["#000000"]} />
      <fog attach="fog" args={["#000000", 9, 24]} />
      <ambientLight intensity={0.35} />
      <pointLight position={[0, 2, 6]} intensity={12} color="#bcd9ff" />
      <CameraRig />
      <Suspense fallback={null}>
        <ParticleText />
        <NeuralNetwork />
        <ProjectNodes />
      </Suspense>
      <PortalTransition />
      <EffectComposer multisampling={0}>
        <Bloom
          intensity={mobile ? 0.5 : 0.7}
          luminanceThreshold={0.18}
          luminanceSmoothing={0.4}
          mipmapBlur={!mobile}
        />
      </EffectComposer>
    </Canvas>
  );
}
