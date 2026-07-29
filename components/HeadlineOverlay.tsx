"use client";

import { useEffect, useMemo, useState } from "react";
import { useExperienceStore } from "@/lib/experience-store";
import { smoothstep } from "@/lib/camera-path";

const SCRIPT = [
  "Hola.",
  "Soy",
  "Ezequiel Valverde.",
  "",
  "Software Developer",
  "Entrepreneur",
  "AI Builder",
];

const FULL_TEXT = SCRIPT.join("\n");
const TERMINAL_GREEN = "#4dff8c";

export default function HeadlineOverlay() {
  const scrollProgress = useExperienceStore((s) => s.scrollProgress);
  const reducedMotion = useExperienceStore((s) => s.reducedMotion);
  const opacity = 1 - smoothstep(0, 0.06, scrollProgress);

  const [typedCount, setTypedCount] = useState(0);

  useEffect(() => {
    if (reducedMotion) return; // full text shown instantly via displayCount below
    if (typedCount >= FULL_TEXT.length) return;
    // Old-computer typewriter cadence: quick per-character jitter, a longer
    // beat on line breaks so it reads like it's being typed line by line.
    const nextChar = FULL_TEXT[typedCount];
    const delay = nextChar === "\n" ? 220 : 25 + Math.random() * 55;
    const timeout = window.setTimeout(() => setTypedCount((c) => c + 1), delay);
    return () => window.clearTimeout(timeout);
  }, [typedCount, reducedMotion]);

  const displayCount = reducedMotion ? FULL_TEXT.length : typedCount;
  const done = displayCount >= FULL_TEXT.length;

  const [headlineText, subtitleText] = useMemo(() => {
    const visible = FULL_TEXT.slice(0, displayCount);
    const [headline, subtitle] = visible.split("\n\n");
    return [headline ?? "", subtitle ?? ""];
  }, [displayCount]);

  if (opacity <= 0) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-10 flex flex-col justify-center px-8 font-mono sm:px-16"
      style={{ opacity }}
    >
      <div className="max-w-xl">
        <p
          className="whitespace-pre-line text-4xl leading-tight sm:text-6xl"
          style={{
            color: TERMINAL_GREEN,
            textShadow:
              "0 0 14px rgba(77,255,140,0.6), 0 0 28px rgba(77,255,140,0.25)",
          }}
        >
          {headlineText}
          {!done && <span className="animate-pulse">▌</span>}
        </p>
        <div
          className="mt-8 flex flex-col gap-1 whitespace-pre-line text-sm tracking-[0.15em] sm:text-base"
          style={{ color: "rgba(77,255,140,0.65)" }}
        >
          {subtitleText}
          {done && <span className="animate-pulse">▌</span>}
        </div>
      </div>
      <div
        className="absolute inset-x-0 bottom-10 flex flex-col items-center gap-2 text-xs tracking-[0.3em]"
        style={{ color: "rgba(77,255,140,0.5)" }}
      >
        <span className="animate-bounce text-lg">↓</span>
        <span>SCROLL</span>
      </div>
    </div>
  );
}
