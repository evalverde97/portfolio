"use client";

import { useExperienceStore } from "@/lib/experience-store";
import { smoothstep } from "@/lib/camera-path";

export default function ClosingTagline() {
  const scrollProgress = useExperienceStore((s) => s.scrollProgress);
  const transitionPhase = useExperienceStore((s) => s.transitionPhase);
  const opacity =
    smoothstep(0.86, 1, scrollProgress) * (transitionPhase === "idle" ? 1 : 0);

  if (opacity <= 0) return null;

  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-20 z-10 flex flex-col items-center gap-3 text-center px-6"
      style={{ opacity }}
    >
      <p className="text-2xl font-light text-white sm:text-3xl">
        Every idea begins as a node.
        <br />
        <span className="text-accent-soft">Explore my universe.</span>
      </p>
      <p className="text-xs tracking-[0.25em] text-muted">ezequielvalverde.com</p>
    </div>
  );
}
