const TECH_ICONS = [
  { name: "TypeScript", icon: "TS", color: "#3178c6" },
  { name: "JavaScript", icon: "JS", color: "#f7df1e" },
  { name: "Python", icon: "PY", color: "#3776ab" },
  { name: "React", icon: "⚛", color: "#61dafb" },
  { name: "Next.js", icon: "N", color: "#000000" },
  { name: "Tailwind", icon: "TW", color: "#06b6d4" },
  { name: "Node.js", icon: "NO", color: "#339933" },
  { name: "PostgreSQL", icon: "PG", color: "#4169e1" },
  { name: "Prisma", icon: "PR", color: "#2d3748" },
  { name: "Git", icon: "GI", color: "#f05032" },
  { name: "Vercel", icon: "▲", color: "#000000" },
  { name: "Supabase", icon: "SB", color: "#3ecf8e" },
  { name: "Claude", icon: "◇", color: "#d97757" },
];

const SKILL_BARS = [
  { name: "frontend", level: 90 },
  { name: "backend", level: 75 },
  { name: "databases", level: 70 },
  { name: "devops", level: 60 },
  { name: "design", level: 55 },
];

const CURRENTLY_LEARNING = [
  "motion design",
  "animation",
  "game dev",
  "rust",
];

export default function SkillsPage() {
  return (
    <div className="animate-fade-in min-h-screen">
      <div className="mx-auto max-w-[900px] px-[clamp(24px,4vw,48px)] pb-20 pt-[clamp(24px,4vw,40px)]">
        {/* Header */}
        <div className="mb-8">
          <p className="mb-1.5 font-pixel text-[13px] uppercase tracking-[0.16em] text-rose">
            # skills
          </p>
          <h1 className="font-serif text-[clamp(34px,4.5vw,48px)] font-medium italic leading-[1.1] tracking-[-0.01em] text-ink">
            what i work with
          </h1>
          <div className="mt-4 h-0.5 w-12.5 rounded-full bg-rose" />
        </div>

        {/* Tech Icons Grid */}
        <section className="mb-10">
          <p className="mb-4 font-pixel text-xs uppercase tracking-[0.12em] text-whisper">
            tools & technologies
          </p>
          <div className="grid grid-cols-5 gap-3 sm:grid-cols-6 md:grid-cols-8">
            {TECH_ICONS.map((tech) => (
              <div
                key={tech.name}
                className="group relative flex aspect-square flex-col items-center justify-center rounded-card border border-(--shadow) bg-bg-card p-2 shadow-[0_2px_6px_var(--shadow)] transition-all hover:-translate-y-1 hover:shadow-[0_4px_12px_var(--shadow-mid)]"
              >
                <span
                  className="mb-1 font-pixel text-lg font-bold"
                  style={{ color: tech.color }}
                >
                  {tech.icon}
                </span>
                <span className="text-center font-mono text-[8px] leading-tight text-whisper">
                  {tech.name}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Skill Bars */}
        <section className="mb-10">
          <p className="mb-4 font-pixel text-xs uppercase tracking-[0.12em] text-whisper">
            proficiency
          </p>
          <div className="rounded-card border border-(--shadow) bg-bg-card p-5 shadow-[0_2px_8px_var(--shadow)]">
            <div className="flex flex-col gap-5">
              {SKILL_BARS.map((skill) => (
                <div key={skill.name}>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="font-pixel text-sm text-ink">
                      {skill.name}
                    </span>
                    <span className="font-mono text-xs text-whisper">
                      {skill.level}%
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-bg-linen">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-rose to-rose-deep transition-all duration-500"
                      style={{ width: `${skill.level}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Currently Learning */}
        <section>
          <p className="mb-4 font-pixel text-xs uppercase tracking-[0.12em] text-whisper">
            currently exploring
          </p>
          <div className="flex flex-wrap gap-2">
            {CURRENTLY_LEARNING.map((item) => (
              <span
                key={item}
                className="rounded-pill border border-rose/30 bg-rose/10 px-3 py-1.5 font-mono text-sm text-rose"
              >
                {item}
              </span>
            ))}
          </div>
        </section>

        <p className="mt-10 text-center font-mono text-xs italic text-whisper">
          always learning, always growing.
        </p>
      </div>
    </div>
  );
}
