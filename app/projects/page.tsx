import Link from "next/link";

const FILTERS = ["all", "web", "tools", "experiments", "archive"] as const;

const PROJECTS = [
  {
    slug: "portfolio",
    name: "kashi.quest",
    tag: "web",
    year: "2024",
    desc: "a soft little portfolio in the shape of a game.",
    stack: ["Next.js", "Tailwind", "TypeScript"],
  },
  {
    slug: "placeholder-1",
    name: "{ project name }",
    tag: "{ tag }",
    year: "{ year }",
    desc: "{ one-line description }",
    stack: ["{ stack }"],
  },
  {
    slug: "placeholder-2",
    name: "{ project name }",
    tag: "{ tag }",
    year: "{ year }",
    desc: "{ one-line description }",
    stack: ["{ stack }"],
  },
];

export default function ProjectsPage() {
  return (
    <div className="animate-fade-in min-h-screen bg-bg-page">
      <div className="mx-auto max-w-[1100px] px-[clamp(24px,4vw,48px)] pb-20 pt-[clamp(24px,4vw,40px)]">
        {/* Header */}
        <div className="mb-5">
          <p className="mb-1.5 font-pixel text-[13px] uppercase tracking-[0.16em] text-rose">
            [ projects ]
          </p>
          <h1 className="font-serif text-[clamp(34px,4.5vw,48px)] font-medium italic leading-[1.1] tracking-[-0.01em] text-ink">
            projects
          </h1>
          <p className="mt-2.5 font-mono text-sm text-whisper">
            things i&apos;ve built, am building, or want to build.
          </p>
          <div className="mt-4 h-0.5 w-[50px] rounded-full bg-rose" />
        </div>

        {/* Filter Chips */}
        <div className="mb-7 flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              className="rounded-pill border border-rose/40 bg-transparent px-3.5 py-1.5 font-mono text-xs text-rose transition-colors first:border-rose first:bg-rose first:text-bg-linen hover:border-rose hover:bg-rose hover:text-bg-linen"
            >
              {f}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid gap-5 sm:grid-cols-[repeat(auto-fit,minmax(280px,1fr))]">
          {PROJECTS.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </div>
    </div>
  );
}

function ProjectCard({
  project,
}: {
  project: {
    slug: string;
    name: string;
    tag: string;
    year: string;
    desc: string;
    stack: string[];
  };
}) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group grid gap-3 rounded-card border border-[var(--shadow)] bg-bg-card p-5 shadow-[0_2px_8px_var(--shadow)] transition-all hover:-translate-y-0.5 hover:border-rose hover:shadow-[0_6px_16px_var(--shadow-mid)]"
      style={{ gridTemplateRows: "auto auto 1fr auto" }}
    >
      {/* Preview Thumbnail */}
      <div className="grid aspect-video place-items-center rounded-lg bg-bg-linen font-pixel text-[11px] text-whisper">
        {"{ preview }"}
      </div>

      {/* Meta Row */}
      <div className="flex justify-between text-[11px] text-whisper">
        <span className="font-pixel text-rose">{project.tag}</span>
        <span>{project.year}</span>
      </div>

      {/* Title + Desc */}
      <div>
        <p className="mb-1.5 font-serif text-xl italic leading-[1.2] text-ink">
          {project.name}
        </p>
        <p className="font-mono text-[13px] leading-relaxed text-ink/85">
          {project.desc}
        </p>
      </div>

      {/* Stack Chips */}
      <div className="flex flex-wrap gap-1">
        {project.stack.map((s, j) => (
          <span
            key={j}
            className="rounded-pill border border-[var(--shadow)] px-2 py-0.5 font-mono text-[10px] text-whisper"
          >
            {s}
          </span>
        ))}
      </div>
    </Link>
  );
}
