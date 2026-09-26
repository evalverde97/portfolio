"use client";

import Link from "next/link";
import { useExperienceStore } from "@/lib/experience-store";
import { smoothstep } from "@/lib/camera-path";
import { useLocaleStore } from "@/lib/locale-store";
import { EXPLORE_PROGRESS } from "@/lib/brain-geometry";

export function exploreProjects() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  window.scrollTo({ top: max * EXPLORE_PROGRESS, behavior: "instant" });
}

export default function HeadlineOverlay() {
  const p = useExperienceStore((s) => s.scrollProgress);
  const locale = useLocaleStore((s) => s.locale);
  const es = locale === "es";
  const opacity = 1 - smoothstep(.015, .09, p);
  return (
    <section className="hero-overlay" style={{ opacity, pointerEvents: opacity > .5 ? "auto" : "none" }} aria-hidden={opacity < .1} inert={opacity < .1}>
      <p className="hero-signature">Ezequiel Valverde <span>Software · AI · Ventures</span></p>
      <h1 className="hero-title" id="particle-headline">
        <span>{es ? "Bienvenido" : "Welcome"}</span>
        <span>{es ? "a mi cabeza." : "to my mind."}</span>
      </h1>
      <p className="hero-description">{es ? "Conecto ideas. Construyo lo que imagino." : "Connecting ideas. Building what I imagine."}</p>
      <div className="hero-actions">
        <button type="button" onClick={exploreProjects}>{es ? "Explorar proyectos" : "Explore projects"} <span>↗</span></button>
        <Link href="/about">{es ? "Conoceme" : "Meet me"} <span>↗</span></Link>
      </div>
      <div className="hero-scroll"><span className="scroll-line" />{es ? "Scrolleá. Todo está conectado." : "Scroll. Everything is connected."}</div>
    </section>
  );
}
