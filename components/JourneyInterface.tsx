"use client";

import { useState } from "react";
import Link from "next/link";
import { useExperienceStore } from "@/lib/experience-store";
import { useLocaleStore } from "@/lib/locale-store";
import { projectNodes } from "@/lib/graph-data";
import { smoothstep } from "@/lib/camera-path";
import { pick } from "@/lib/i18n";
import { exploreProjects } from "./HeadlineOverlay";

export default function JourneyInterface() {
  const [list, setList] = useState(false);
  const p = useExperienceStore((s) => s.scrollProgress);
  const phase = useExperienceStore((s) => s.transitionPhase);
  const locale = useLocaleStore((s) => s.locale);
  const es = locale === "es";
  const brainOpacity = smoothstep(.2, .3, p) * (1 - smoothstep(.43, .5, p));
  const network = p > .7;
  if (phase !== "idle") return null;
  return <>
    <div className="brain-caption" style={{ opacity: brainOpacity }} aria-hidden={brainOpacity < .5}>
      <p>{es ? "Todo empieza con una conexión." : "Everything starts with a connection."}</p>
      <span>{es ? "Seguí explorando" : "Keep exploring"} ↓</span>
    </div>
    {network && !list && <div className="network-heading">
      <p>{es ? "Un universo de ideas." : "A universe of ideas."}</p>
      <span>{es ? "Elegí un nodo. Descubrí lo que hay detrás." : "Choose a node. Discover what is behind it."}</span>
    </div>}
    {list && <section className="project-index" aria-label={es ? "Índice de proyectos" : "Project index"}>
      <div className="index-heading"><h2>{es ? "Ideas en acción." : "Ideas in action."}</h2><button onClick={() => setList(false)} aria-label={es ? "Cerrar lista" : "Close list"}>×</button></div>
      {projectNodes.filter(n => !n.parentId).map(node => <Link href={`/projects/${node.slug}`} key={node.id} className="index-project">
        <span><strong>{node.title}</strong><small>{pick(locale, node.description)}</small></span><span>↗</span>
      </Link>)}
    </section>}
    <footer className="journey-footer">
      <span className="footer-signature">EV <span>— {es ? "Ideas en movimiento" : "Ideas in motion"}</span></span>
      <div className="journey-controls">
        {p > .1 && !network && <button onClick={exploreProjects}>{es ? "Saltar a proyectos" : "Skip to projects"} ↗</button>}
        <button onClick={() => setList(!list)} aria-expanded={list}>{list ? (es ? "Volver al mapa" : "Back to map") : (es ? "Ver lista" : "View list")} <span>≡</span></button>
        {network && <Link href="/contact">{es ? "Hablemos" : "Let's talk"} ↗</Link>}
      </div>
    </footer>
    <div className="journey-progress" aria-hidden="true"><span style={{ transform: `scaleX(${p})` }} /></div>
  </>;
}
