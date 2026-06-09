import Link from "next/link";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

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
            {"{ tag }"}
          </p>
          <p className="font-mono text-xs text-whisper">
            {"{ year }"} · {"{ status }"}
          </p>
        </div>

        <h1 className="font-serif text-[clamp(36px,5vw,52px)] font-medium italic leading-[1.05] tracking-[-0.015em] text-ink">
          {slug.replace(/-/g, " ")}
        </h1>

        <div className="my-[18px] h-0.5 w-14 rounded-full bg-rose" />

        <p className="mb-7 font-mono text-[17px] leading-relaxed text-ink">
          {"{ one-line description }"}
        </p>

        {/* Meta Strip */}
        <div className="mb-9 grid gap-3.5 rounded-card border border-(--shadow) bg-bg-card px-[18px] py-4 sm:grid-cols-3">
          {[
            { k: "role", v: "{ role }" },
            { k: "period", v: "{ period }" },
            { k: "stack", v: "{ stack }" },
          ].map((row) => (
            <div key={row.k}>
              <p className="font-pixel text-[11px] uppercase tracking-[0.12em] text-rose">
                {row.k}
              </p>
              <p className="mt-1 font-mono text-[13px] text-ink">{row.v}</p>
            </div>
          ))}
        </div>

        {/* Hero Preview */}
        <div className="mb-9 grid aspect-video place-items-center rounded-card border border-(--shadow) bg-bg-linen font-pixel text-xs text-whisper">
          {"{ hero shot }"}
        </div>

        {/* Summary */}
        <section className="mb-9">
          <p className="mb-3.5 font-pixel text-[11px] uppercase tracking-[0.12em] text-rose">
            —— summary
          </p>
          <p className="font-mono text-[15px] leading-[1.7] text-ink">
            {"{ project summary }"}
          </p>
        </section>

        {/* The Problem */}
        <section className="mb-9">
          <p className="mb-3.5 font-pixel text-[11px] uppercase tracking-[0.12em] text-rose">
            —— the problem
          </p>
          <p className="font-mono text-[15px] leading-[1.7] text-ink">
            {"{ the problem }"}
          </p>
        </section>

        {/* Approach */}
        <section className="mb-9">
          <p className="mb-3.5 font-pixel text-[11px] uppercase tracking-[0.12em] text-rose">
            —— approach
          </p>
          <ol className="flex flex-col gap-3">
            {["{ step 1 }", "{ step 2 }", "{ step 3 }"].map((step, i) => (
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
        </section>

        {/* What I Learned */}
        <section className="mb-9">
          <p className="mb-3.5 font-pixel text-[11px] uppercase tracking-[0.12em] text-rose">
            —— what i learned
          </p>
          <p className="border-l-2 border-rose pl-4 font-mono text-[15px] italic leading-[1.7] text-ink">
            {"{ what you learned }"}
          </p>
        </section>

        {/* Links */}
        <div className="flex flex-wrap gap-2.5">
          <a
            href="#"
            className="rounded-btn bg-rose px-4 py-2.5 font-pixel text-xs tracking-[0.06em] text-bg-linen transition-all hover:-translate-y-0.5 hover:bg-rose-deep"
          >
            view live
          </a>
          <a
            href="#"
            className="rounded-btn border border-rose bg-transparent px-4 py-2.5 font-pixel text-xs tracking-[0.06em] text-rose transition-all hover:-translate-y-0.5 hover:bg-rose hover:text-bg-linen"
          >
            source code
          </a>
        </div>
      </div>
    </div>
  );
}
