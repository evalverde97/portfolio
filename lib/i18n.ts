export type Locale = "es" | "en";

/** A piece of content authored in both languages. */
export type Bilingual = { es: string; en: string };

export function pick(locale: Locale, value: Bilingual): string {
  return value[locale];
}

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
    status: { building: "En construcción", comingSoon: "Próximamente" },
    headline: ["Hola.", "Soy", "Ezequiel Valverde.", "", "Bienvenido a mi cabeza"],
    tagline: ["Cada idea empieza como un nodo.", "Explorá mi universo."],
    previewSoon: "Vista previa próximamente",
    followOn: "Seguir en",
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
    status: { building: "Building", comingSoon: "Coming soon" },
    headline: ["Hi.", "I'm", "Ezequiel Valverde.", "", "Welcome to my head"],
    tagline: ["Every idea begins as a node.", "Explore my universe."],
    previewSoon: "Preview coming soon",
    followOn: "Follow on",
  },
} as const;

export function pluralProjects(count: number, locale: Locale) {
  const d = dictionary[locale];
  return count === 1 ? d.project : d.projects;
}
