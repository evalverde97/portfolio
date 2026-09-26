"use client";

import Image from "next/image";
import Link from "next/link";
import type { ProjectNode } from "@/lib/graph-data";
import { useLocaleStore } from "@/lib/locale-store";
import { dictionary, pick } from "@/lib/i18n";
import BackToUniverse from "@/components/BackToUniverse";

export default function ProjectPageContent({ project, childNodes }: {
  project: ProjectNode;
  childNodes: ProjectNode[];
}) {
  const locale = useLocaleStore(s => s.locale);
  const es = locale === "es";
  const t = dictionary[locale];
  const screenshots = project.screenshots ?? [];
  const cover = screenshots[0];
  const sourceLabel = project.screenshotSource === "instagram"
    ? (es ? "Perfil público · Instagram" : "Public profile · Instagram")
    : project.screenshotSource === "document"
      ? (es ? "Documento · Google Docs" : "Document · Google Docs")
      : project.liveUrl ? new URL(project.liveUrl).hostname.replace(/^www\./, "") : "";
  return <main className="project-page">
    <div className="project-intro">
      <div>
        <BackToUniverse />
        {project.parentId && <Link className="project-parent" href={`/projects/${project.parentId}`}>← {es ? "Ver categoría" : "View category"}</Link>}
        <p className="project-category">{pick(locale, project.category)}{project.year && ` · ${project.year}`}</p>
        <h1>{project.title}</h1>
        <p className="project-description">{pick(locale, project.longDescription)}</p>
        {project.statusKey && <p className="project-status">{t.status[project.statusKey]}</p>}
        {project.tech.length > 0 && <div className="project-tech" aria-label={t.builtWith}>{project.tech.map(tech => <span key={tech}>{tech}</span>)}</div>}
        <div className="project-links">
          {project.liveUrl && <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">{project.ctaLabel ? pick(locale,project.ctaLabel) : t.viewProject} ↗</a>}
          {project.instagramUrl && <a href={project.instagramUrl} target="_blank" rel="noopener noreferrer">Instagram ↗</a>}
        </div>
      </div>
      {cover && <figure className="project-cover">
        <div className="capture-bar"><span aria-hidden="true">○ ○ ○</span><span>{sourceLabel}</span></div>
        <a href={cover.src} target="_blank" rel="noopener noreferrer" aria-label={es ? "Ampliar captura" : "Enlarge screenshot"}>
          <Image src={cover.src} alt={`${project.title} — ${pick(locale,cover.caption)}`} width={1280} height={720} sizes="(max-width: 900px) 100vw, 55vw" preload className="project-capture" />
        </a>
        <figcaption>{pick(locale,cover.caption)}</figcaption>
      </figure>}
    </div>

    {project.experience && <section className="project-experience" aria-label={es ? "Experiencia profesional" : "Professional experience"}>
      <div><span>{es ? "Experiencia profesional" : "Professional experience"}</span><h2>MercadoLibre</h2></div>
      <p>{pick(locale,project.experience)}</p>
    </section>}

    {screenshots.length > 1 && <section className="project-gallery" aria-label={es ? "Capturas del proyecto" : "Project screenshots"}>
      <h2>{es ? "Una mirada más de cerca." : "A closer look."}</h2>
      {screenshots.slice(1).map(shot => <figure key={shot.src}>
        <a href={shot.src} target="_blank" rel="noopener noreferrer" aria-label={es ? "Ampliar captura" : "Enlarge screenshot"}>
          <Image src={shot.src} alt={`${project.title} — ${pick(locale,shot.caption)}`} width={1280} height={720} sizes="(max-width: 1200px) 100vw, 1152px" className="project-capture" />
        </a>
        <figcaption>{pick(locale,shot.caption)}</figcaption>
      </figure>)}
    </section>}

    {childNodes.length > 0 && <section className="included-projects">
      <h2>{t.includedProjects}</h2>
      <div className="project-card-grid">
        {childNodes.map(child => <article className="project-card" key={child.id}>
          <Link href={`/projects/${child.slug}`} className="project-card-link">
            {child.screenshotUrl && <div className="project-card-image">
              <Image src={child.screenshotUrl} alt={es ? `Vista de ${child.title}` : `Preview of ${child.title}`} width={1280} height={720} sizes="(max-width: 700px) 100vw, 50vw" />
            </div>}
            <div className="project-card-copy">
              <h3>{child.title}<span aria-hidden="true">↗</span></h3>
              <p>{pick(locale,child.description)}</p>
              <span className="project-card-action">{es ? "Explorar proyecto" : "Explore project"}</span>
            </div>
          </Link>
        </article>)}
      </div>
    </section>}
  </main>;
}
