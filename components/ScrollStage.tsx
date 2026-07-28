"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { useExperienceStore } from "@/lib/experience-store";

const SCROLL_HEIGHT_VH = 500;

/**
 * Renders a tall spacer to generate real page scroll, smooths it with Lenis,
 * and writes the 0→1 progress into the shared experience store every frame
 * so the R3F scene (rendered separately) can drive off it inside useFrame.
 *
 * Under prefers-reduced-motion we keep scroll-linked progress (it only moves
 * in response to the user's own scroll input) but drop Lenis's inertia
 * smoothing and let downstream scene components know to skip auto-playing
 * ambient motion (idle drift, camera breathing, portal warp burst).
 */
export default function ScrollStage() {
  const lenisRef = useRef<Lenis | null>(null);
  const setScrollProgress = useExperienceStore((s) => s.setScrollProgress);
  const setNetworkSettled = useExperienceStore((s) => s.setNetworkSettled);
  const setReducedMotion = useExperienceStore((s) => s.setReducedMotion);
  const transitionPhase = useExperienceStore((s) => s.transitionPhase);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const reduced = media.matches;
    setReducedMotion(reduced);

    const updateProgress = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? window.scrollY / max : 0;
      const clamped = Math.min(Math.max(progress, 0), 1);
      setScrollProgress(clamped);
      setNetworkSettled(clamped > 0.55);
    };

    if (reduced) {
      window.addEventListener("scroll", updateProgress, { passive: true });
      updateProgress();
      return () => window.removeEventListener("scroll", updateProgress);
    }

    const lenis = new Lenis({ duration: 1.2, smoothWheel: true });
    lenisRef.current = lenis;
    lenis.on("scroll", updateProgress);
    updateProgress();

    let rafId = requestAnimationFrame(function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    });

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [setScrollProgress, setNetworkSettled, setReducedMotion]);

  // Lock page scroll while a portal travel transition is in flight.
  useEffect(() => {
    const lenis = lenisRef.current;
    if (!lenis) return;
    if (transitionPhase === "traveling" || transitionPhase === "returning") {
      lenis.stop();
    } else {
      lenis.start();
    }
  }, [transitionPhase]);

  return <div style={{ height: `${SCROLL_HEIGHT_VH}vh` }} />;
}
