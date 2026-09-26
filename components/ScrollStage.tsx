"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
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
  const reducedMotion = useExperienceStore((s) => s.reducedMotion);
  const transitionPhase = useExperienceStore((s) => s.transitionPhase);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, [setReducedMotion]);

  useEffect(() => {
    const updateProgress = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? window.scrollY / max : 0;
      const clamped = Math.min(Math.max(progress, 0), 1);
      setScrollProgress(clamped);
      setNetworkSettled(clamped > 0.7);
    };

    if (reducedMotion) {
      window.addEventListener("scroll", updateProgress, { passive: true });
      window.addEventListener("resize", updateProgress);
      updateProgress();
      return () => {
        window.removeEventListener("scroll", updateProgress);
        window.removeEventListener("resize", updateProgress);
      };
    }

    const lenis = new Lenis({ duration: 1.2, smoothWheel: true });
    lenisRef.current = lenis;
    gsap.registerPlugin(ScrollTrigger);
    const trigger = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: updateProgress,
      onRefresh: updateProgress,
    });
    lenis.on("scroll", ScrollTrigger.update);
    updateProgress();

    let rafId = requestAnimationFrame(function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    });

    return () => {
      cancelAnimationFrame(rafId);
      trigger.kill();
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [setScrollProgress, setNetworkSettled, reducedMotion]);

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
