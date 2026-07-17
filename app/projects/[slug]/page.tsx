import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PROJECTS, getProject } from "../data";

export function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return { title: "project not found" };
  return { title: project.name, description: project.desc };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const cs = project.caseStudy;

  return (
    <div className="animate-fade-in min-h-screen bg-bg-page">
      <div className="mx-auto max-w-[780px] px-[clamp(24px,4vw,48px)] pb-20 pt-[clamp(24px,4vw,40px)]">
        {/* Back Link */}
        <Link
          href="/projects"
          className="mb-6 inline-flex items-center gap-1.5 font-mono text-[13px] text-rose transition-colors hover:text-rose-deep"
        >
          ← back to projects
        </Link>

        {/* Header */}
        <div className="mb-5 flex flex-wrap items-baseline justify-between gap-4">
          <p className="font-pixel text-[13px] uppercase tracking-[0.16em] text-rose">
            {project.tag}
          </p>
          <p className="font-mono text-xs text-whisper">
            {project.year} · {project.status}
          </p>
        </div>

        <h1 className="font-serif text-[clamp(36px,5vw,52px)] font-medium italic leading-[1.05] tracking-[-0.015em] text-ink">
          {project.name}
        </h1>

        <div className="my-[18px] h-0.5 w-14 rounded-full bg-rose" />

        <p className="mb-7 font-mono text-[17px] leading-relaxed text-ink">
          {project.desc}
        </p>

        {/* Meta Strip */}
        <div className="mb-9 grid gap-3.5 rounded-card border border-(--shadow) bg-bg-card px-[18px] py-4 sm:grid-cols-3">
          <MetaCell k="status" v={project.status} />
          <MetaCell k="year" v={project.year} />
          <MetaCell k="stack" v={project.stack.join(", ")} />
        </div>

        {cs ? (
          <>
            <Section title="summary">
              <p className="font-mono text-[15px] leading-[1.7] text-ink">
                {cs.summary}
              </p>
            </Section>

            <Section title="the problem">
              <p className="font-mono text-[15px] leading-[1.7] text-ink">
                {cs.problem}
              </p>
            </Section>

            <Section title="approach">
              <ol className="flex flex-col gap-3">
                {cs.approach.map((step, i) => (
                  <li
                    key={i}
                    className="grid grid-cols-[32px_1fr] gap-3.5 rounded-[10px] border border-(--shadow) bg-bg-card px-4 py-3"
                  >
                    <div className="grid h-7 w-7 place-items-center rounded-full bg-rose font-pixel text-xs text-bg-linen">
                      {i + 1}
                    </div>
                    <p className="self-center font-mono text-sm leading-relaxed text-ink">
                      {step}
                    </p>
                  </li>
                ))}
              </ol>
            </Section>

            <Section title="what i learned">
              <p className="border-l-2 border-rose pl-4 font-mono text-[15px] italic leading-[1.7] text-ink">
                {cs.learned}
              </p>
            </Section>
          </>
        ) : (
          <div className="mb-9 rounded-card border border-dashed border-(--shadow) bg-bg-card p-6 text-center">
            <p className="font-serif text-xl italic text-ink">
              write-up in progress
            </p>
            <p className="mt-1.5 font-mono text-sm text-whisper">
              the full case study for this one is still being written.
            </p>
          </div>
        )}

        {/* Links */}
        {(project.links?.live || project.links?.source) && (
          <div className="flex flex-wrap gap-2.5">
            {project.links?.live && (
              <a
                href={project.links.live}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-btn bg-rose px-4 py-2.5 font-pixel text-xs tracking-[0.06em] text-bg-linen transition-all hover:-translate-y-0.5 hover:bg-rose-deep"
              >
                view live
              </a>
            )}
            {project.links?.source && (
              <a
                href={project.links.source}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-btn border border-rose bg-transparent px-4 py-2.5 font-pixel text-xs tracking-[0.06em] text-rose transition-all hover:-translate-y-0.5 hover:bg-rose hover:text-bg-linen"
              >
                source code
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function MetaCell({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <p className="font-pixel text-[11px] uppercase tracking-[0.12em] text-rose">
        {k}
      </p>
      <p className="mt-1 font-mono text-[13px] text-ink">{v}</p>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-9">
      <p className="mb-3.5 font-pixel text-[11px] uppercase tracking-[0.12em] text-rose">
        —— {title}
      </p>
      {children}
    </section>
  );
}
