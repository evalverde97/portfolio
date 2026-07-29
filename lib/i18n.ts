export type Locale = "es" | "en";

export const dictionary = {
  es: {
    nav: { projects: "Proyectos", about: "Sobre mí", contact: "Contacto" },
    builtWith: "Tecnologías",
    viewProject: "Ver proyecto",
    visit: "Visitar",
    instagram: "Instagram",
    backToUniverse: "Volver al universo",
    includedProjects: "Proyectos incluidos",
    scroll: "SCROLL",
    project: "proyecto",
    projects: "proyectos",
    comingSoonTitle: "Próximamente.",
    aboutBody:
      "La historia completa — y la línea de tiempo animada — llega en la próxima etapa de la experiencia.",
    contactBody:
      "Email, GitHub, LinkedIn e Instagram llegan en la próxima etapa de la experiencia.",
  },
  en: {
    nav: { projects: "Projects", about: "About", contact: "Contact" },
    builtWith: "Built with",
    viewProject: "View project",
    visit: "Visit",
    instagram: "Instagram",
    backToUniverse: "Back to the universe",
    includedProjects: "Included projects",
    scroll: "SCROLL",
    project: "project",
    projects: "projects",
    comingSoonTitle: "Coming soon.",
    aboutBody:
      "The full story — and the animated timeline — is landing in the next pass of the experience.",
    contactBody:
      "Email, GitHub, LinkedIn and Instagram links are landing in the next pass of the experience.",
  },
} as const;

export function pluralProjects(count: number, locale: Locale) {
  const d = dictionary[locale];
  return count === 1 ? d.project : d.projects;
}
