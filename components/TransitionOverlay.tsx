"use client";

import { useExperienceStore } from "@/lib/experience-store";

export default function TransitionOverlay() {
  const transitionPhase = useExperienceStore((s) => s.transitionPhase);
  const active = transitionPhase === "traveling" || transitionPhase === "returning";

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[90] transition-opacity duration-700 ease-in-out"
      style={{
        opacity: active ? 1 : 0,
        background:
          "radial-gradient(circle at center, rgba(196,224,255,0.95) 0%, rgba(77,159,255,0.55) 35%, rgba(0,0,0,0.98) 78%)",
      }}
    />
  );
}
