// Central project data. Add new projects here — the list page and the
// [slug] detail page both render from this single source of truth.

export type ProjectTag = "web" | "tools" | "experiments";
export type ProjectStatus = "live" | "building" | "archived";

export type Project = {
  slug: string;
  name: string;
  tag: ProjectTag;
  year: string;
  status: ProjectStatus;
  desc: string;
  stack: string[];
  links?: { live?: string; source?: string };
  caseStudy?: {
    summary: string;
    problem: string;
    approach: string[];
    learned: string;
  };
};

export const PROJECTS: Project[] = [
  {
    slug: "status207",
    name: "status207",
    tag: "web",
    year: "2026",
    status: "building",
    desc: "a soft little portfolio in the shape of a game.",
    stack: ["Next.js 16", "TypeScript", "Tailwind 4", "Supabase"],
    links: { source: "https://github.com/kashik09/portfolio" },
    caseStudy: {
      summary:
        "status207 is my corner of the web — a cozy, lightly gamified portfolio built around a splash screen, three time-of-day themes, and a soft pastel-forest palette. every page is treated like a little room you can wander into.",
      problem:
        "most developer portfolios feel like a resume stuffed into a browser tab: tidy, corporate, forgettable. i wanted mine to feel like stepping into a warm room — personal, playful, and unmistakably mine.",
      approach: [
        "built a token-driven design system in css variables, so three full themes (morning, dusk, cabin) swap from a single source of truth.",
        "leaned into a cozy visual language: fraunces italics, a pixel display face, hand-drawn svg illustrations, and gentle ambient motion.",
        "opened with a 'press space to begin' splash moment to set the game-like tone before the site even loads.",
        "wired the contact form to supabase with turnstile bot protection, plus a small protected admin view to read the messages.",
      ],
      learned:
        "a design system pays for itself the moment you add a second theme — and the third one is basically free. and the small cozy details (a blinking cursor, a drifting leaf) are what actually make people smile, so they earn their keep.",
    },
  },
];

export function getProject(slug: string): Project | undefined {
  return PROJECTS.find((p) => p.slug === slug);
}
