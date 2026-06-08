const SKILLS = [
  { k: "languages", v: "TypeScript, JavaScript, Python, Go" },
  { k: "frontend", v: "React, Next.js, Tailwind CSS, Framer Motion" },
  { k: "backend", v: "Node.js, Express, PostgreSQL, Prisma" },
  { k: "tools", v: "Git, Docker, Vercel, Supabase, Figma" },
  { k: "currently", v: "motion design, animation, game dev" },
];

export default function SkillsPage() {
  return (
    <div className="animate-fade-in min-h-screen">
      <div className="mx-auto max-w-[880px] px-[clamp(24px,4vw,48px)] pb-20 pt-[clamp(24px,4vw,40px)]">
        {/* Header */}
        <div className="mb-7">
          <p className="mb-1.5 font-pixel text-[13px] uppercase tracking-[0.16em] text-rose">
            # skills
          </p>
          <h1 className="font-serif text-[clamp(34px,4.5vw,48px)] font-medium italic leading-[1.1] tracking-[-0.01em] text-ink">
            stat sheet
          </h1>
          <div className="mt-4 h-0.5 w-[50px] rounded-full bg-rose" />
        </div>

        {/* Skills List */}
        <div className="rounded-card border border-[var(--shadow)] bg-bg-card px-7 py-2 shadow-[0_4px_14px_var(--shadow)]">
          {SKILLS.map((s, i) => (
            <div key={s.k}>
              <div className="grid items-baseline gap-[22px] py-[18px] md:grid-cols-[160px_1fr]">
                <p className="font-pixel text-[13px] uppercase tracking-[0.12em] text-rose">
                  {s.k}
                </p>
                <p className="font-mono text-base leading-relaxed text-ink">
                  {s.v}
                </p>
              </div>
              {i < SKILLS.length - 1 && (
                <div className="h-px bg-[var(--shadow)]" />
              )}
            </div>
          ))}
        </div>

        <p className="mt-5 text-center font-mono text-[13px] italic text-whisper">
          kashi will keep adding to this.
        </p>
      </div>
    </div>
  );
}
