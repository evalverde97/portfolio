"use client";

import { useEffect, useMemo, useState } from "react";
import { useExperienceStore } from "@/lib/experience-store";
import { smoothstep } from "@/lib/camera-path";
import { useLocaleStore } from "@/lib/locale-store";
import { dictionary } from "@/lib/i18n";

// Same neon celeste as the node network, kept as a single accent color
// across the whole experience.
const NEON_ACCENT = "var(--accent-soft)";

export default function HeadlineOverlay() {
  const scrollProgress = useExperienceStore((s) => s.scrollProgress);
  const reducedMotion = useExperienceStore((s) => s.reducedMotion);
  const locale = useLocaleStore((s) => s.locale);
  const opacity = 1 - smoothstep(0, 0.06, scrollProgress);

  const fullText = useMemo(
    () => dictionary[locale].headline.join("\n"),
    [locale]
  );

  const [typedCount, setTypedCount] = useState(0);

  // Retype from scratch in the new language when the visitor switches locale
  // (adjust state during render rather than in an effect, per React docs).
  const [typedLocale, setTypedLocale] = useState(locale);
  if (locale !== typedLocale) {
    setTypedLocale(locale);
    setTypedCount(0);
  }

  useEffect(() => {
    if (reducedMotion) return; // full text shown instantly via displayCount below
    if (typedCount >= fullText.length) return;
    // Old-computer typewriter cadence: quick per-character jitter, a longer
    // beat on line breaks so it reads like it's being typed line by line.
    const nextChar = fullText[typedCount];
    const delay = nextChar === "\n" ? 220 : 25 + Math.random() * 55;
    const timeout = window.setTimeout(() => setTypedCount((c) => c + 1), delay);
    return () => window.clearTimeout(timeout);
  }, [typedCount, reducedMotion, fullText]);

  const displayCount = reducedMotion ? fullText.length : typedCount;
  const done = displayCount >= fullText.length;

  const [headlineText, subtitleText] = useMemo(() => {
    const visible = fullText.slice(0, displayCount);
    const [headline, subtitle] = visible.split("\n\n");
    return [headline ?? "", subtitle ?? ""];
  }, [displayCount, fullText]);

  if (opacity <= 0) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-10 flex flex-col justify-center px-6 font-mono sm:px-16"
      style={{ opacity }}
    >
      <div className="max-w-xl">
        <p
          className="whitespace-pre-line break-words text-3xl leading-tight sm:text-5xl md:text-6xl"
          style={{
            color: NEON_ACCENT,
            textShadow:
              "0 0 14px rgba(77,159,255,0.6), 0 0 28px rgba(77,159,255,0.3)",
          }}
        >
          {headlineText}
          {!done && <span className="animate-pulse">▌</span>}
        </p>
        <div
          className="mt-6 flex flex-col gap-1 whitespace-pre-line text-xs tracking-[0.15em] sm:mt-8 sm:text-sm md:text-base"
          style={{ color: "var(--accent-soft)", opacity: 0.7 }}
        >
          {subtitleText}
          {done && <span className="animate-pulse">▌</span>}
        </div>
      </div>
      <div
        className="absolute inset-x-0 bottom-8 flex flex-col items-center gap-2 text-xs tracking-[0.3em] sm:bottom-10"
        style={{ color: "var(--accent-soft)", opacity: 0.55 }}
      >
        <span className="animate-bounce text-lg">↓</span>
        <span>{dictionary[locale].scroll}</span>
      </div>
    </div>
  );
}
