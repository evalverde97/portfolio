"use client";

import { useExperienceStore } from "@/lib/experience-store";
import { smoothstep } from "@/lib/camera-path";
import { useLocaleStore } from "@/lib/locale-store";
import { dictionary } from "@/lib/i18n";

export default function ClosingTagline() {
  const scrollProgress = useExperienceStore((s) => s.scrollProgress);
  const transitionPhase = useExperienceStore((s) => s.transitionPhase);
  const locale = useLocaleStore((s) => s.locale);
  const [line1, line2] = dictionary[locale].tagline;
  const opacity =
    smoothstep(0.86, 1, scrollProgress) * (transitionPhase === "idle" ? 1 : 0);

  if (opacity <= 0) return null;

  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-20 z-10 flex flex-col items-center gap-3 text-center px-6"
      style={{ opacity }}
    >
      <p className="text-2xl font-light text-white sm:text-3xl">
        {line1}
        <br />
        <span className="text-accent-soft">{line2}</span>
      </p>
      <p className="text-xs tracking-[0.25em] text-muted">ezequielvalverde.com</p>
    </div>
  );
}
