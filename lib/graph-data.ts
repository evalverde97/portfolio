import { mulberry32 } from "./random";

export type Vec3 = [number, number, number];

export type SubProject = {
  name: string;
  description: string;
  url?: string;
};

export type ProjectNode = {
  id: string;
  slug: string;
  title: string;
  category: string;
  tech: string[];
  year: string;
  description: string;
  longDescription: string;
  liveUrl?: string;
  githubUrl?: string;
  position: Vec3;
  connections: string[];
  /** For umbrella nodes (like AI Projects) that bundle several standalone builds. */
  subProjects?: SubProject[];
  /**
   * Ids of child ProjectNodes nested under this one. Umbrella nodes with
   * children don't navigate to a project page on click — they toggle their
   * children's visibility as sub-nodes in the 3D network instead.
   */
  children?: string[];
  /** Set on a node that only appears once its parent has been expanded. */
  parentId?: string;
};

/**
 * Featured project nodes — placeholder content until Ezequiel supplies the
 * real project data. Five top-level nodes (AI Projects, E-commerce,
 * Trading, Doll-Ars, Experiments) sit in a pentagon around the network
 * center, fully interconnected; each umbrella bundles related ventures as
 * sub-nodes that only appear once their parent is clicked.
 */
export const projectNodes: ProjectNode[] = [
  {
    id: "ai-projects",
    slug: "ai-projects",
    title: "AI Projects",
    category: "Artificial Intelligence",
    tech: ["Python", "OpenAI API", "Next.js"],
    year: "2026",
    description: "A collection of AI-powered tools and prototypes.",
    longDescription:
      "An evolving set of AI-driven products and experiments — from content automation to conversational agents — exploring how large language models can be embedded into real, everyday workflows.",
    position: [-2.473, 0.803, -0.6],
    connections: ["ecommerce", "trading", "dollars", "experiments"],
    subProjects: [
      {
        name: "Vuelapp",
        description:
          "Una app para organizar viajes (incluso multidestino) teniendo en cuenta todos los factores necesarios para que el viaje sea una experiencia agradable: busca el vuelo más conveniente para cada tramo, arma un cronograma de actividades día por día según el motivo del viaje, sugiere alojamiento concreto con links reales, estima el costo total y suma información práctica del destino (moneda, transporte, eSIM, VPN). Todo generado con IA a partir de un solo formulario.",
        url: "https://vuelapp.netlify.app/",
      },
    ],
  },
  {
    id: "ecommerce",
    slug: "ecommerce",
    title: "E-commerce",
    category: "Ventures",
    tech: [],
    year: "",
    description: "Online stores and marketplaces built end to end.",
    longDescription:
      "The ecommerce ventures — from the first dropshipping tests to AuraX and a multi-vendor marketplace. Click to explore each one.",
    position: [2.473, 0.803, 0.5],
    connections: ["ai-projects", "trading", "dollars", "experiments"],
    children: ["aurax", "marketplace", "dropshipping"],
  },
  {
    id: "trading",
    slug: "trading",
    title: "Trading",
    category: "Automation",
    tech: ["Python", "WebSocket", "AWS"],
    year: "2025",
    description: "Automated strategy execution across markets.",
    longDescription:
      "Rules-based trading — systems that watch multiple markets in real time and execute strategies automatically, with risk limits, backtesting and alerting built in.",
    position: [0, 2.6, 0.9],
    connections: ["ai-projects", "ecommerce", "dollars", "experiments"],
  },
  {
    id: "dollars",
    slug: "dollars",
    title: "Doll-Ars",
    category: "Ventures",
    tech: [],
    year: "",
    description: "A brand with several businesses under it.",
    longDescription:
      "Doll-Ars is an entity with several businesses under it. Click to explore each one.",
    position: [-1.529, -2.103, 0.5],
    connections: ["ai-projects", "ecommerce", "trading", "experiments"],
    children: ["doll-art", "doll-ars-agency", "doll-ars-concierge"],
  },
  {
    id: "experiments",
    slug: "experiments",
    title: "Experiments",
    category: "Playground",
    tech: ["Three.js", "WebGL", "GSAP"],
    year: "2026",
    description: "Small interactive experiments and visual prototypes.",
    longDescription:
      "A playground of small interactive builds — visual experiments, motion studies and interface ideas that don't need a product around them to exist.",
    position: [1.529, -2.103, -0.6],
    connections: ["ai-projects", "ecommerce", "trading", "dollars"],
  },

  // --- Sub-nodes, revealed when their parent is clicked ---
  {
    id: "aurax",
    slug: "aurax",
    title: "AuraX",
    category: "Ecommerce",
    tech: ["React", "Node.js", "PostgreSQL"],
    year: "2026",
    description: "Ecommerce focused on health and self-care.",
    longDescription:
      "AuraX is a direct-to-consumer ecommerce platform for health and self-care products. Built end to end — storefront, checkout, inventory and an admin dashboard — with a focus on fast page loads and a calm, editorial visual language.",
    liveUrl: "https://example.com/aurax",
    position: [2.473, 2.003, 0.8],
    connections: ["ecommerce"],
    parentId: "ecommerce",
  },
  {
    id: "marketplace",
    slug: "marketplace",
    title: "Marketplace",
    category: "Ecommerce",
    tech: ["React", "Node.js", "Stripe"],
    year: "2025",
    description: "Multi-vendor marketplace with integrated payments.",
    longDescription:
      "A multi-vendor marketplace connecting independent sellers with buyers, with integrated payments, seller dashboards and order fulfillment tracking.",
    position: [3.573, 0.203, 0.2],
    connections: ["ecommerce"],
    parentId: "ecommerce",
  },
  {
    id: "dropshipping",
    slug: "dropshipping",
    title: "Dropshipping",
    category: "Ecommerce",
    tech: ["Shopify", "React", "Ads"],
    year: "2023",
    description: "First ecommerce ventures — where it all started.",
    longDescription:
      "The first ecommerce stores — testing products, running ads and learning the fundamentals of online retail that later shaped AuraX and Marketplace.",
    position: [1.373, 0.203, 0.9],
    connections: ["ecommerce"],
    parentId: "ecommerce",
  },
  {
    id: "doll-art",
    slug: "doll-art",
    title: "Doll-Art",
    category: "Doll-Ars",
    tech: [],
    year: "",
    description: "Venta de arte.",
    longDescription:
      "Doll-Art es la rama de Doll-Ars dedicada a la venta de arte.",
    position: [-2.629, -0.903, 0.8],
    connections: ["dollars"],
    parentId: "dollars",
  },
  {
    id: "doll-ars-agency",
    slug: "doll-ars-agency",
    title: "Doll-Ars Agency",
    category: "Doll-Ars",
    tech: [],
    year: "",
    description: "Agencia de modelos.",
    longDescription:
      "Doll-Ars Agency es la agencia de modelos dentro del ecosistema Doll-Ars.",
    position: [-0.329, -1.803, 0.1],
    connections: ["dollars"],
    parentId: "dollars",
  },
  {
    id: "doll-ars-concierge",
    slug: "doll-ars-concierge",
    title: "Doll-Ars Concierge",
    category: "Doll-Ars",
    tech: [],
    year: "",
    description: "Agencia de concierge, experiencias VIP.",
    longDescription:
      "Doll-Ars Concierge ofrece servicios de concierge y experiencias VIP.",
    position: [-1.529, -3.403, 1.0],
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
