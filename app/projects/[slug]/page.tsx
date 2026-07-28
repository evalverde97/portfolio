import { notFound } from "next/navigation";
import { getProjectBySlug, projectNodes } from "@/lib/graph-data";
import BackToUniverse from "@/components/BackToUniverse";

export function generateStaticParams() {
  return projectNodes.map((node) => ({ slug: node.slug }));
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const childItems = (project.children ?? [])
    .map((id) => projectNodes.find((n) => n.id === id))
    .filter((n): n is NonNullable<typeof n> => Boolean(n))
    .map((n) => ({
      name: n.title,
      description: n.description,
      url: n.liveUrl,
    }));
  const includedItems = [...(project.subProjects ?? []), ...childItems];
  const hasMockup = Boolean(project.liveUrl);

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
          hasMockup ? "lg:grid-cols-2 lg:items-center" : "max-w-2xl"
        }`}
      >
        <div className="flex flex-col gap-8">
          <BackToUniverse />

          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-accent-soft">
              {project.category}
              {project.year && ` · ${project.year}`}
            </p>
            <h1 className="mt-3 text-4xl font-light text-white sm:text-5xl">
              {project.title}
            </h1>
            <p className="mt-6 max-w-md text-base leading-relaxed text-muted">
              {project.longDescription}
            </p>
          </div>

          {project.tech.length > 0 && (
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-muted">
                Built with
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

          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-fit items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-medium text-black transition-transform hover:-translate-y-0.5"
            >
              Ver proyecto
              <span aria-hidden>↗</span>
            </a>
          )}
        </div>

        {hasMockup && (
          <div className="relative">
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] shadow-2xl shadow-black/60 backdrop-blur-sm">
              <div className="flex items-center gap-1.5 border-b border-white/10 px-4 py-3">
                <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
                <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
                <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
                <span className="ml-3 text-xs text-muted">
                  {project.title.toLowerCase().replace(/\s+/g, "")}.com
                </span>
              </div>
              <div className="grid gap-3 p-6 sm:grid-cols-3">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="aspect-[3/4] rounded-lg border border-white/10"
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
            Proyectos incluidos
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
                      Visitar
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
