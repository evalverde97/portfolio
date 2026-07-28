"use client";

import { useExperienceStore } from "@/lib/experience-store";
import { smoothstep } from "@/lib/camera-path";

export default function HeadlineOverlay() {
  const scrollProgress = useExperienceStore((s) => s.scrollProgress);
  const opacity = 1 - smoothstep(0, 0.06, scrollProgress);

  if (opacity <= 0) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-10 flex flex-col justify-center px-8 sm:px-16"
      style={{ opacity }}
    >
      <div className="max-w-xl">
        <p className="text-4xl font-light leading-tight text-white sm:text-6xl">
          Hola.
          <br />
          Soy
          <br />
          <span className="font-medium">Ezequiel Valverde.</span>
        </p>
        <div className="mt-8 flex flex-col gap-1 text-sm tracking-[0.15em] text-muted sm:text-base">
          <span>Software Developer</span>
          <span>Entrepreneur</span>
          <span>AI Builder</span>
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-10 flex flex-col items-center gap-2 text-xs tracking-[0.3em] text-muted">
        <span className="animate-bounce text-lg">↓</span>
        <span>SCROLL</span>
      </div>
    </div>
  );
}
