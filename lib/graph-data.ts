import { mulberry32 } from "./random";

export type Vec3 = [number, number, number];

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
};

/**
 * Featured project nodes — placeholder content until Ezequiel supplies the
 * real project data. Positions are hand-authored to mirror the storyboard's
 * hub-and-spoke layout (AuraX at the center).
 */
export const projectNodes: ProjectNode[] = [
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
    position: [0, 0.4, 0],
    connections: [
      "ai-projects",
      "trading-bot",
      "marketplace",
      "agency",
      "dropshipping",
      "experiments",
    ],
  },
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
    position: [-3.4, 1.7, -1.1],
    connections: ["aurax", "trading-bot", "experiments"],
  },
  {
    id: "trading-bot",
    slug: "trading-bot",
    title: "Trading Bot",
    category: "Automation",
    tech: ["Python", "WebSocket", "AWS"],
    year: "2025",
    description: "Automated strategy execution for crypto markets.",
    longDescription:
      "A rules-based trading bot that watches multiple markets in real time and executes strategies automatically, with risk limits, backtesting and alerting built in.",
    position: [2.9, 2.1, 0.9],
    connections: ["aurax", "ai-projects"],
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
    position: [3.8, 0.3, -0.7],
    connections: ["aurax", "dropshipping", "agency"],
  },
  {
    id: "agency",
    slug: "agency",
    title: "Agency",
    category: "Services",
    tech: ["Next.js", "Tailwind", "Figma"],
    year: "2024",
    description: "Digital agency building products for other founders.",
    longDescription:
      "A small digital agency helping founders design, build and ship their products — from landing pages to full web applications.",
    position: [2.5, -1.9, 0.5],
    connections: ["aurax", "marketplace"],
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
    position: [-3.0, -1.7, 0.6],
    connections: ["aurax", "marketplace"],
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
    position: [0.2, -2.7, -1.3],
    connections: ["aurax", "ai-projects"],
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
