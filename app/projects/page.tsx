import Link from "next/link";
import type { Metadata } from "next";
import { PROJECTS, type Project } from "./data";

export const metadata: Metadata = {
  title: "projects",
  description: "things kashi has built, is building, or wants to build.",
};

export default function ProjectsPage() {
  return (
    <div className="animate-fade-in min-h-screen bg-bg-page">
      <div className="mx-auto max-w-[1100px] px-[clamp(24px,4vw,48px)] pb-20 pt-[clamp(24px,4vw,40px)]">
        {/* Header */}
        <div className="mb-7">
          <p className="mb-1.5 font-pixel text-[13px] uppercase tracking-[0.16em] text-rose">
            [ projects ]
          </p>
          <h1 className="font-serif text-[clamp(34px,4.5vw,48px)] font-medium italic leading-[1.1] tracking-[-0.01em] text-ink">
            projects
          </h1>
          <p className="mt-2.5 font-mono text-sm text-whisper">
            things i&apos;ve built, am building, or want to build.
          </p>
          <div className="mt-4 h-0.5 w-12.5 rounded-full bg-rose" />
        </div>

        {/* Projects Grid */}
        <div className="grid gap-5 sm:grid-cols-[repeat(auto-fit,minmax(280px,1fr))]">
          {PROJECTS.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
          <WorkshopCard />
        </div>
      </div>
    </div>
  );
}

function StatusDot({ status }: { status: Project["status"] }) {
  const color =
    status === "live" ? "bg-moss" : status === "building" ? "bg-honey" : "bg-whisper";
  return <span className={`h-1.5 w-1.5 rounded-full ${color}`} />;
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group grid gap-3 rounded-card border border-(--shadow) bg-bg-card p-5 shadow-[0_2px_8px_var(--shadow)] transition-all hover:-translate-y-0.5 hover:border-rose hover:shadow-[0_6px_16px_var(--shadow-mid)]"
      style={{ gridTemplateRows: "auto auto 1fr auto" }}
    >
      {/* Preview */}
      <div className="grid aspect-video place-items-center rounded-lg bg-bg-linen">
        <div className="text-center">
          <div className="mb-2 flex justify-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-rose" />
            <span className="h-2 w-2 rounded-full bg-honey" />
            <span className="h-2 w-2 rounded-full bg-moss" />
          </div>
          <span className="font-pixel text-sm text-ink">{project.name}</span>
        </div>
      </div>

      {/* Meta Row */}
      <div className="flex items-center justify-between text-[11px] text-whisper">
        <span className="font-pixel text-rose">{project.tag}</span>
        <span className="inline-flex items-center gap-1.5">
          <StatusDot status={project.status} />
          {project.status} · {project.year}
        </span>
      </div>

      {/* Title + Desc */}
      <div>
        <p className="mb-1.5 font-serif text-xl italic leading-[1.2] text-ink">
          {project.name}
        </p>
        <p className="font-mono text-[13px] leading-relaxed text-ink">
          {project.desc}
        </p>
      </div>

      {/* Stack Chips */}
      <div className="flex flex-wrap gap-1">
        {project.stack.map((s) => (
          <span
            key={s}
            className="rounded-pill border border-(--shadow) px-2 py-0.5 font-mono text-[10px] text-whisper"
          >
            {s}
          </span>
        ))}
      </div>
    </Link>
  );
}

function WorkshopCard() {
  return (
    <div
      className="grid place-items-center rounded-card border border-dashed border-(--shadow) bg-bg-card p-5 text-center"
      style={{ minHeight: "220px" }}
    >
      <div>
        <div className="animate-bob mx-auto mb-3 grid h-12 w-12 place-items-center rounded-full bg-bg-linen">
          <span className="font-pixel text-lg text-rose">+</span>
        </div>
        <p className="font-serif text-lg italic text-ink">in the workshop</p>
        <p className="mt-1 font-mono text-xs text-whisper">
          new builds are brewing — check back soon.
        </p>
      </div>
    </div>
  );
}
