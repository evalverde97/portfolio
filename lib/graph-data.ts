import { mulberry32 } from "./random";
import type { Bilingual } from "./i18n";

export type Vec3 = [number, number, number];

export type ProjectNode = {
  id: string;
  slug: string;
  /** Product/brand names stay as-is across languages. */
  title: string;
  category: Bilingual;
  tech: string[];
  year: string;
  description: Bilingual;
  longDescription: Bilingual;
  liveUrl?: string;
  githubUrl?: string;
  instagramUrl?: string;
  /** Local path (e.g. "/images/vuelapp.png") to a real screenshot of the site. */
  screenshotUrl?: string;
  screenshots?: { src: string; caption: Bilingual }[];
  experience?: Bilingual;
  screenshotSource?: "website" | "instagram" | "document";
  /** Overrides the default "Ver proyecto" label on the primary CTA button. */
  ctaLabel?: Bilingual;
  /** Shows a small status badge ("Building" / "Coming soon") on the project page. */
  statusKey?: "building" | "comingSoon";
  position: Vec3;
  connections: string[];
  /** Ids of child ProjectNodes nested under this one (always visible, smaller). */
  children?: string[];
  /** Set on a sub-node to link it back to its umbrella parent. */
  parentId?: string;
};

/**
 * Featured project nodes — placeholder content until Ezequiel supplies the
 * real project data. Five top-level nodes (AI Projects, E-commerce,
 * Software Development, Doll-Ars, Experiments) form asymmetric clusters joined by sparse
 * neural paths. Each umbrella retains its smaller related project nodes.
 */
export const projectNodes: ProjectNode[] = [
  {
    id: "ai-projects",
    slug: "ai-projects",
    title: "AI Projects",
    category: { es: "Inteligencia Artificial", en: "Artificial Intelligence" },
    tech: ["Python", "OpenAI API", "Next.js"],
    year: "2026",
    description: {
      es: "Una colección de herramientas y prototipos con IA.",
      en: "A collection of AI-powered tools and prototypes.",
    },
    longDescription: {
      es: "Un conjunto en evolución de productos y experimentos con IA — desde automatización de contenido hasta agentes conversacionales — explorando cómo los modelos de lenguaje pueden integrarse en flujos de trabajo reales y cotidianos.",
      en: "An evolving set of AI-driven products and experiments — from content automation to conversational agents — exploring how large language models can be embedded into real, everyday workflows.",
    },
    position: [-2.2, 1.35, -0.6],
    connections: ["software-development", "dollars"],
    children: ["vuelapp"],
  },
  {
    id: "ecommerce",
    slug: "ecommerce",
    title: "E-commerce",
    category: { es: "Emprendimientos", en: "Ventures" },
    tech: [],
    year: "",
    description: {
      es: "Marcas digitales de ecommerce.",
      en: "Digital ecommerce brands.",
    },
    longDescription: {
      es: "Los emprendimientos de ecommerce — marcas digitales que venden directo a través de su propia tienda e Instagram.",
      en: "The ecommerce ventures — digital brands selling directly through their own storefronts and Instagram.",
    },
    position: [2.45, 0.1, 0.25],
    connections: ["software-development"],
    children: ["aurax-labs", "ocean-force"],
  },
  {
    id: "software-development",
    slug: "software-development",
    title: "Software Development",
    category: { es: "Desarrollo de software", en: "Software development" },
    tech: [], year: "",
    description: { es: "Sitios, experiencias digitales y desarrollo de productos.", en: "Websites, digital experiences and product development." },
    longDescription: {
      es: "Desarrollo experiencias digitales que conectan diseño, interacción y funcionalidad. Acá podés explorar algunos de los sitios que construí.",
      en: "I develop digital experiences that connect design, interaction and functionality. Explore some of the websites I have built.",
    },
    experience: {
      es: "Trabajé durante 3 años como desarrollador en MercadoLibre, una empresa multinacional, participando en el desarrollo del CRM que se utilizaba en la compañía.",
      en: "I worked for 3 years as a developer at MercadoLibre, a multinational company, contributing to the development of the CRM used within the company.",
    },
    children: ["contrabando", "maestro-noel", "lenghi"],
    position: [0.6, 2.35, -0.15],
    connections: ["ai-projects", "ecommerce"],
  },
  {
    id: "dollars",
    slug: "dollars",
    title: "Doll-Ars",
    category: { es: "Emprendimientos", en: "Ventures" },
    tech: [],
    year: "",
    description: {
      es: "Una marca con varios negocios a cargo.",
      en: "A brand with several businesses under it.",
    },
    longDescription: {
      es: "Doll-Ars es una entidad con varios negocios a cargo. Hacé click para explorar cada uno.",
      en: "Doll-Ars is an entity with several businesses under it. Click to explore each one.",
    },
    position: [-1.85, -1.4, 0.4],
    connections: ["ai-projects", "experiments"],
    children: ["doll-art", "doll-ars-agency"],
  },
  {
    id: "experiments",
    slug: "experiments",
    title: "Experiments",
    category: { es: "Laboratorio", en: "Playground" },
    tech: [],
    year: "",
    description: {
      es: "Ideas, escritos y emprendimientos que no encajan en otro lado.",
      en: "Ideas, writing and ventures that don't fit elsewhere.",
    },
    longDescription: {
      es: "Un espacio para cosas que no necesitan un producto alrededor para existir — ensayos, emprendimientos paralelos, experimentos visuales.",
      en: "A playground for things that don't need a product around them to exist — essays, side ventures, visual experiments.",
    },
    position: [1.2, -2.2, -0.8],
    connections: ["dollars"],
    children: ["estados-alterados-de-consciencia", "valketing"],
  },

  {
  "id": "contrabando",
  "slug": "contrabando",
  "title": "Contrabando Clothing Brand",
  "liveUrl": "https://contrabando23.netlify.app/",
  "category": {
    "es": "Desarrollo web",
    "en": "Web development"
  },
  "tech": [],
  "year": "",
  "description": {
    "es": "Sitio para una marca de indumentaria, con una entrada inmersiva al depósito y exploración de prendas.",
    "en": "A clothing brand website with an immersive warehouse entrance and garment exploration."
  },
  "longDescription": {
    "es": "Sitio para una marca de indumentaria, con una entrada inmersiva al depósito y exploración de prendas.",
    "en": "A clothing brand website with an immersive warehouse entrance and garment exploration."
  },
    screenshotUrl: "/images/projects/contrabando-hero.webp",
    screenshotSource: "website",
    screenshots: [{"src":"/images/projects/contrabando-hero.webp","caption":{"es":"Página de inicio","en":"Homepage"}},{"src":"/images/projects/contrabando-detail.webp","caption":{"es":"Exploración del sitio","en":"Website detail"}}],
  "position": [
    -0.9,
    3.25,
    -0.7
  ],
  "connections": [
    "software-development"
  ],
  "parentId": "software-development"
},
  {
  "id": "maestro-noel",
  "slug": "maestro-noel",
  "title": "Maestro Noel Services",
  "liveUrl": "https://maestronoel.com/",
  "category": {
    "es": "Desarrollo web",
    "en": "Web development"
  },
  "tech": [],
  "year": "",
  "description": {
    "es": "Sitio de servicios con presentación de propuestas, preguntas frecuentes y acceso al contacto.",
    "en": "A services website presenting its offerings, frequently asked questions and contact options."
  },
  "longDescription": {
    "es": "Sitio de servicios con presentación de propuestas, preguntas frecuentes y acceso al contacto.",
    "en": "A services website presenting its offerings, frequently asked questions and contact options."
  },
    screenshotUrl: "/images/projects/maestro-noel-hero.webp",
    screenshotSource: "website",
    screenshots: [{"src":"/images/projects/maestro-noel-hero.webp","caption":{"es":"Página de inicio","en":"Homepage"}},{"src":"/images/projects/maestro-noel-detail.webp","caption":{"es":"Exploración del sitio","en":"Website detail"}}],
  "position": [
    1.4,
    3.35,
    -0.9
  ],
  "connections": [
    "software-development"
  ],
  "parentId": "software-development"
},
  {
  "id": "lenghi",
  "slug": "lenghi",
  "title": "Lenghi Portfolio",
  "liveUrl": "https://lenghi.netlify.app/",
  "category": {
    "es": "Desarrollo web",
    "en": "Web development"
  },
  "tech": [],
  "year": "",
  "description": {
    "es": "Portfolio digital con presentación de LT Game, una galería de vistas previas y acceso a descargas.",
    "en": "A digital portfolio presenting LT Game, a preview gallery and download links."
  },
  "longDescription": {
    "es": "Portfolio digital con presentación de LT Game, una galería de vistas previas y acceso a descargas.",
    "en": "A digital portfolio presenting LT Game, a preview gallery and download links."
  },
    screenshotUrl: "/images/projects/lenghi-hero.webp",
    screenshotSource: "website",
    screenshots: [{"src":"/images/projects/lenghi-hero.webp","caption":{"es":"Página de inicio","en":"Homepage"}},{"src":"/images/projects/lenghi-detail.webp","caption":{"es":"Exploración del sitio","en":"Website detail"}}],
  "position": [
    2.3,
    2.6,
    -0.65
  ],
  "connections": [
    "software-development"
  ],
  "parentId": "software-development"
},

  // --- Sub-nodes, always visible (smaller/dimmer until hovered) ---
  {
    id: "vuelapp",
    slug: "vuelapp",
    title: "Vuelapp",
    category: { es: "AI Projects", en: "AI Projects" },
    tech: [],
    year: "",
    description: {
      es: "App para organizar viajes con IA.",
      en: "AI-powered trip planning app.",
    },
    longDescription: {
      es: "Una app para organizar viajes (incluso multidestino) teniendo en cuenta todos los factores necesarios para que el viaje sea una experiencia agradable: busca el vuelo más conveniente para cada tramo, arma un cronograma de actividades día por día según el motivo del viaje, sugiere alojamiento concreto con links reales, estima el costo total y suma información práctica del destino (moneda, transporte, eSIM, VPN). Todo generado con IA a partir de un solo formulario.",
      en: "An app for planning trips (including multi-destination ones) that accounts for every factor needed to make the trip enjoyable: it finds the most convenient flight for each leg, builds a day-by-day itinerary based on the purpose of the trip, suggests real accommodation with working links, estimates the total cost, and adds practical destination info (currency, transport, eSIM, VPN). All generated by AI from a single form.",
    },
    liveUrl: "https://vuelapp.netlify.app/",
    statusKey: "building",
    screenshotUrl: "/images/projects/vuelapp-hero.webp",
    screenshotSource: "website",
    screenshots: [{"src":"/images/projects/vuelapp-hero.webp","caption":{"es":"Página de inicio","en":"Homepage"}},{"src":"/images/projects/vuelapp-detail.webp","caption":{"es":"Exploración del sitio","en":"Website detail"}}],
    position: [-3.3, 2.3, -0.2],
    connections: ["ai-projects"],
    parentId: "ai-projects",
  },
  {
    id: "aurax-labs",
    slug: "aurax-labs",
    title: "AuraX Labs",
    category: { es: "Ecommerce", en: "Ecommerce" },
    tech: [],
    year: "",
    description: {
      es: "Venta de productos para el cuidado y mantenimiento de la estética.",
      en: "Skincare and aesthetic-care products.",
    },
    longDescription: {
      es: "AuraX Labs es un negocio digital de venta de productos para el cuidado y mantenimiento de la estética.",
      en: "AuraX Labs is a digital business selling skincare and aesthetic-care products.",
    },
    liveUrl: "https://www.auraxlabs.com",
    instagramUrl: "https://www.instagram.com/aurax_labs",
    screenshotUrl: "/images/projects/aurax-labs-hero.webp",
    screenshotSource: "instagram",
    screenshots: [{"src":"/images/projects/aurax-labs-hero.webp","caption":{"es":"Perfil público en Instagram","en":"Public Instagram profile"}}],
    position: [3.25, 1.45, -0.1],
    connections: ["ecommerce"],
    parentId: "ecommerce",
  },
  {
    id: "ocean-force",
    slug: "ocean-force",
    title: "Ocean Force",
    category: { es: "Ecommerce", en: "Ecommerce" },
    tech: [],
    year: "",
    description: {
      es: "Venta de suplementos deportivos.",
      en: "Sports supplements.",
    },
    longDescription: {
      es: "Ocean Force es un negocio digital de venta de suplementos deportivos.",
      en: "Ocean Force is a digital business selling sports supplements.",
    },
    instagramUrl: "https://www.instagram.com/oceanforcefit",
    screenshotUrl: "/images/projects/ocean-force-hero.webp",
    screenshotSource: "instagram",
    screenshots: [{"src":"/images/projects/ocean-force-hero.webp","caption":{"es":"Perfil público en Instagram","en":"Public Instagram profile"}}],
    position: [3.35, -1.15, 0.5],
    connections: ["ecommerce"],
    parentId: "ecommerce",
  },
  {
    id: "estados-alterados-de-consciencia",
    slug: "estados-alterados-de-consciencia",
    title: "Estados Alterados De Consciencia",
    category: { es: "Experiments", en: "Experiments" },
    tech: [],
    year: "",
    description: {
      es: "Ensayo sobre el despertar de consciencia y experiencias personales.",
      en: "An essay on the awakening of consciousness and personal experiences.",
    },
    longDescription: {
      es: "Un documento donde Ezequiel plantea sus ideas acerca del despertar de consciencia y comparte experiencias personales.",
      en: "A document where Ezequiel lays out his ideas about the awakening of consciousness and shares personal experiences.",
    },
    liveUrl:
      "https://docs.google.com/document/d/1nJRp5GBz4KtyqKgny62teataXMy7I2PN3BdtjKIC_d0/edit?tab=t.0",
    ctaLabel: { es: "Leer el ensayo", en: "Read the essay" },
    screenshotUrl: "/images/projects/estados-alterados-de-consciencia-hero.webp",
    screenshotSource: "document",
    screenshots: [{ src: "/images/projects/estados-alterados-de-consciencia-hero.webp", caption: { es: "Vista del ensayo", en: "Essay preview" } }],
    position: [0.25, -2.85, -0.3],
    connections: ["experiments"],
    parentId: "experiments",
  },
  {
    id: "valketing",
    slug: "valketing",
    title: "Valketing",
    category: { es: "Experiments", en: "Experiments" },
    tech: [],
    year: "",
    description: {
      es: "Agencia de marketing digital.",
      en: "Digital marketing agency.",
    },
    longDescription: {
      es: "Valketing es una agencia de marketing digital.",
      en: "Valketing is a digital marketing agency.",
    },
    liveUrl: "https://valketing.netlify.app/",
    screenshotUrl: "/images/projects/valketing-hero.webp",
    screenshotSource: "website",
    screenshots: [{"src":"/images/projects/valketing-hero.webp","caption":{"es":"Página de inicio","en":"Homepage"}},{"src":"/images/projects/valketing-detail.webp","caption":{"es":"Exploración del sitio","en":"Website detail"}}],
    position: [2.7, -2.7, -1.0],
    connections: ["experiments"],
    parentId: "experiments",
  },
  {
    id: "doll-art",
    slug: "doll-art",
    title: "Doll-Art",
    category: { es: "Doll-Ars", en: "Doll-Ars" },
    tech: [],
    year: "",
    description: {
      es: "Venta y exposición de arte.",
      en: "Art sales and exhibitions.",
    },
    longDescription: {
      es: "Doll-Art es la rama de Doll-Ars dedicada a la venta y exposición de arte.",
      en: "Doll-Art is the branch of Doll-Ars dedicated to selling and exhibiting art.",
    },
    instagramUrl: "https://www.instagram.com/doll.art___",
    screenshotUrl: "/images/projects/doll-art-hero.webp",
    screenshotSource: "instagram",
    screenshots: [{"src":"/images/projects/doll-art-hero.webp","caption":{"es":"Perfil público en Instagram","en":"Public Instagram profile"}}],
    position: [-3.25, -0.45, 0.2],
    connections: ["dollars"],
    parentId: "dollars",
  },
  {
    id: "doll-ars-agency",
    slug: "doll-ars-agency",
    title: "Doll-Ars Agency",
    category: { es: "Doll-Ars", en: "Doll-Ars" },
    tech: [],
    year: "",
    description: { es: "Agencia de modelos.", en: "Modeling agency." },
    longDescription: {
      es: "Doll-Ars Agency es la agencia de modelos dentro del ecosistema Doll-Ars.",
      en: "Doll-Ars Agency is the modeling agency within the Doll-Ars ecosystem.",
    },
    liveUrl: "https://doll-ars.netlify.app",
    instagramUrl: "https://www.instagram.com/dollars_agency",
    screenshotUrl: "/images/projects/doll-ars-agency-hero.webp",
    screenshotSource: "website",
    screenshots: [{"src":"/images/projects/doll-ars-agency-hero.webp","caption":{"es":"Página de inicio","en":"Homepage"}},{"src":"/images/projects/doll-ars-agency-detail.webp","caption":{"es":"Exploración del sitio","en":"Website detail"}}],
    position: [-0.35, -0.65, 0.1],
    connections: ["dollars"],
    parentId: "dollars",
  },

];

export function getProjectBySlug(slug: string) {
  return projectNodes.find((node) => node.slug === slug);
}

/** Unlabeled background nodes that give the network density and atmosphere. */
export function generateAmbientField(count = 42, seed = 1337) {
  const rand = mulberry32(seed);
  const points: Vec3[] = [];

  for (let i = 0; i < count; i += 1) {
    const radius = 6 + rand() * 9;
    const theta = rand() * Math.PI * 2;
    const phi = Math.acos(rand() * 2 - 1);
    points.push([
      radius * Math.sin(phi) * Math.cos(theta),
      radius * Math.sin(phi) * Math.sin(theta) * 0.6,
      radius * Math.cos(phi),
    ]);
  }

  return points;
}

/** Nearest-neighbour edges among the ambient field, for a web-like look. */
export function generateAmbientEdges(points: Vec3[], neighbours = 2) {
  const edges: [Vec3, Vec3][] = [];

  points.forEach((point, i) => {
    const distances = points
      .map((other, j) => ({ j, d: distanceSq(point, other) }))
      .filter((entry) => entry.j !== i)
      .sort((a, b) => a.d - b.d)
      .slice(0, neighbours);

    distances.forEach(({ j }) => {
      if (j > i) edges.push([point, points[j]]);
    });
  });

  return edges;
}

function distanceSq(a: Vec3, b: Vec3) {
  const dx = a[0] - b[0];
  const dy = a[1] - b[1];
  const dz = a[2] - b[2];
  return dx * dx + dy * dy + dz * dz;
}
