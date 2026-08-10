"use client";

import Image from "next/image";
import type { ProjectNode } from "@/lib/graph-data";
import { useLocaleStore } from "@/lib/locale-store";
import { dictionary, pick } from "@/lib/i18n";
import BackToUniverse from "@/components/BackToUniverse";

function hostnameLabel(url?: string) {
  if (!url) return "";
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

function instagramHandle(url: string) {
  try {
    const path = new URL(url).pathname.replace(/^\/+|\/+$/g, "");
    return path.split("/")[0] || url;
  } catch {
    return url;
  }
}

export default function ProjectPageContent({
  project,
  childNodes,
  hasMockup,
}: {
  project: ProjectNode;
  childNodes: ProjectNode[];
  hasMockup: boolean;
}) {
  const locale = useLocaleStore((s) => s.locale);
  const t = dictionary[locale];

  const includedItems = childNodes.map((n) => ({
    name: n.title,
    description: pick(locale, n.description),
    url: n.liveUrl ?? n.instagramUrl,
  }));

  // Real websites get a browser mockup (with a real screenshot once we have
  // one); Instagram-only businesses get an Instagram-style card instead of
  // a fake browser window pretending to be a site that doesn't exist.
  const hasWebsite = hasMockup;
  const instagramOnly = !hasWebsite && !!project.instagramUrl;
  const hasRightPanel = hasWebsite || instagramOnly;

  return (
    <main className="relative min-h-screen overflow-hidden bg-black px-6 pb-24 pt-32 sm:px-12 lg:px-20">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full opacity-40 blur-[120px]"
        style={{
          background: "radial-gradient(circle, #4d9fff, transparent 70%)",
        }}
      />

      <div
        className={`relative mx-auto grid max-w-6xl gap-16 ${
          hasRightPanel ? "lg:grid-cols-2 lg:items-center" : "max-w-2xl"
        }`}
      >
        <div className="flex flex-col gap-8">
          <BackToUniverse />

          <div>
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-sm uppercase tracking-[0.25em] text-accent-soft">
                {pick(locale, project.category)}
                {project.year && ` · ${project.year}`}
              </p>
              {project.statusKey && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-accent-soft/30 bg-accent-soft/10 px-3 py-1 text-xs text-accent-soft">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent-soft animate-pulse" />
                  {t.status[project.statusKey]}
                </span>
              )}
            </div>
            <h1 className="mt-3 text-4xl font-light text-white sm:text-5xl">
              {project.title}
            </h1>
            <p className="mt-6 max-w-md text-base leading-relaxed text-muted">
              {pick(locale, project.longDescription)}
            </p>
          </div>

          {project.tech.length > 0 && (
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-muted">
                {t.builtWith}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {project.tech.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full border border-white/15 px-3 py-1 text-xs text-white/80"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {(project.liveUrl || project.instagramUrl) && (
            <div className="flex flex-wrap items-center gap-3">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-fit items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-medium text-black transition-transform hover:-translate-y-0.5"
                >
                  {project.ctaLabel ? pick(locale, project.ctaLabel) : t.viewProject}
                  <span aria-hidden>↗</span>
                </a>
              )}
              {project.instagramUrl && (
                <a
                  href={project.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-fit items-center gap-2 rounded-full border border-white/20 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:border-white/40"
                >
                  {t.instagram}
                  <span aria-hidden>↗</span>
                </a>
              )}
            </div>
          )}
        </div>

        {hasWebsite && (
          <div className="relative">
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] shadow-2xl shadow-black/60 backdrop-blur-sm">
              <div className="flex items-center gap-1.5 border-b border-white/10 px-4 py-3">
                <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
                <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
                <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
                <span className="ml-3 text-xs text-muted">
                  {hostnameLabel(project.liveUrl)}
                </span>
              </div>
              <div className="relative aspect-[4/3] w-full">
                {project.screenshotUrl ? (
                  <Image
                    src={project.screenshotUrl}
                    alt={project.title}
                    fill
                    className="object-cover object-top"
                  />
                ) : (
                  <div
                    className="flex h-full w-full items-center justify-center"
                    style={{
                      background:
                        "linear-gradient(155deg, rgba(77,159,255,0.14), rgba(255,255,255,0.02))",
                    }}
                  >
                    <span className="text-xs text-muted">{t.previewSoon}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {instagramOnly && (
          <div className="relative">
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] shadow-2xl shadow-black/60 backdrop-blur-sm">
              <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-accent to-accent-soft text-xs font-semibold text-black">
                  {project.title.charAt(0)}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-white">
                    @{instagramHandle(project.instagramUrl!)}
                  </p>
                  <p className="text-[10px] uppercase tracking-wider text-muted">
                    {t.instagram}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-1 p-1">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="aspect-square"
                    style={{
                      background:
                        "linear-gradient(155deg, rgba(77,159,255,0.18), rgba(255,255,255,0.03))",
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {includedItems.length > 0 && (
        <div className="relative mx-auto mt-24 max-w-6xl">
          <p className="text-xs uppercase tracking-[0.2em] text-muted">
            {t.includedProjects}
          </p>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            {includedItems.map((sub) => (
              <div
                key={sub.name}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
              >
                <div className="flex items-center justify-between gap-4">
                  <h2 className="text-xl font-light text-white">{sub.name}</h2>
                  {sub.url && (
                    <a
                      href={sub.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-accent-soft transition-colors hover:text-white"
                    >
                      {t.visit}
                      <span aria-hidden>↗</span>
                    </a>
                  )}
                </div>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  {sub.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
