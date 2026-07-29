import { notFound } from "next/navigation";
import { getProjectBySlug, projectNodes } from "@/lib/graph-data";
import ProjectPageContent from "@/components/ProjectPageContent";

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
      url: n.liveUrl ?? n.instagramUrl,
    }));
  const includedItems = [...(project.subProjects ?? []), ...childItems];
  // The browser-chrome mockup only makes sense for an actual website —
  // skip it for links to documents, docs, etc.
  const hasMockup =
    !!project.liveUrl && !project.liveUrl.includes("docs.google.com");

  return (
    <ProjectPageContent
      project={project}
      includedItems={includedItems}
      hasMockup={hasMockup}
    />
  );
}
