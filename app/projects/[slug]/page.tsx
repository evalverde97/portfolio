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

  const childNodes = (project.children ?? [])
    .map((id) => projectNodes.find((n) => n.id === id))
    .filter((n): n is NonNullable<typeof n> => Boolean(n));

  return (
    <ProjectPageContent
      project={project}
      childNodes={childNodes}
    />
  );
}
