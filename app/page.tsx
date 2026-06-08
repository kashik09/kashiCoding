export default function HomePage() {
  return (
    <div className="animate-fade-in mx-auto max-w-[1100px] px-6 py-8 md:px-8">
      {/* Hero Section */}
      <section className="mt-8 grid items-center gap-8 md:grid-cols-[1.5fr_1fr] md:gap-14">
        <div>
          <p className="mb-2 font-pixel text-lg text-whisper">hi, i'm</p>
          <h1 className="font-serif text-5xl font-medium italic leading-none tracking-tight text-ink md:text-7xl">
            kashi kweyu
          </h1>
          <div className="my-4 h-0.5 w-16 rounded-full bg-rose" />
          <p className="max-w-md font-mono text-base italic leading-relaxed text-whisper">
            a full-stack developer building soft, cozy things on the web.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            {/* Status Pill */}
            <span className="animate-pulse-soft inline-flex items-center gap-2 rounded-pill bg-moss px-3.5 py-1.5 font-mono text-sm text-ink">
              <span className="h-2 w-2 rounded-full bg-fern shadow-[0_0_0_3px_rgba(122,144,114,0.25)]" />
              available
            </span>

            {/* CTA Button */}
            <a
              href="/projects"
              className="inline-flex items-center gap-2 rounded-btn bg-rose px-5 py-2.5 font-pixel text-sm text-bg-linen shadow-[0_2px_6px_var(--shadow)] transition-all hover:-translate-y-0.5 hover:bg-rose-deep hover:shadow-[0_4px_10px_var(--shadow-mid)]"
            >
              view work
              <ArrowRightIcon className="h-4 w-4" />
            </a>

            {/* Ghost Link */}
            <a
              href="/about"
              className="font-pixel text-sm text-whisper transition-colors hover:text-rose-deep"
            >
              or read about me →
            </a>
          </div>
        </div>

        {/* Illustration Placeholder */}
        <div className="hidden items-center justify-center md:flex">
          <div className="animate-bob flex h-64 w-64 items-center justify-center rounded-card bg-bg-card shadow-[0_4px_16px_var(--shadow)]">
            <span className="font-pixel text-sm text-whisper">
              [ illustration ]
            </span>
          </div>
        </div>
      </section>

      {/* What I'm Up To */}
      <section className="mt-16">
        <SectionRule>what i'm up to</SectionRule>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <NowCard label="NOW BUILDING" body="this portfolio site" />
          <NowCard label="NOW LEARNING" body="motion design & animation" />
        </div>
      </section>

      {/* Wander the Rooms */}
      <section className="mt-12">
        <SectionRule>wander the rooms</SectionRule>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 md:grid-cols-4">
          <RoomCard href="/projects" label="projects" sub="what i've built" />
          <RoomCard href="/about" label="about" sub="who you're reading" />
          <RoomCard href="/skills" label="skills" sub="what i work with" />
          <RoomCard href="/contact" label="contact" sub="send a letter" />
        </div>
      </section>
    </div>
  );
}

function SectionRule({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3.5 font-pixel text-sm text-whisper">
      <span>—— {children}</span>
      <span className="h-px flex-1 bg-[var(--shadow-mid)]" />
    </div>
  );
}

function NowCard({ label, body }: { label: string; body: string }) {
  return (
    <div className="rounded-card border border-[var(--shadow)] bg-bg-card p-5 shadow-[0_2px_8px_var(--shadow)] transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_16px_var(--shadow-mid)]">
      <div className="mb-3 flex items-center justify-between">
        <span className="font-pixel text-xs uppercase tracking-widest text-rose">
          {label}
        </span>
      </div>
      <p className="font-mono text-sm leading-relaxed text-ink">{body}</p>
    </div>
  );
}

function RoomCard({
  href,
  label,
  sub,
}: {
  href: string;
  label: string;
  sub: string;
}) {
  return (
    <a
      href={href}
      className="group relative block rounded-card border border-[var(--shadow)] bg-bg-card p-5 text-left shadow-[0_2px_8px_var(--shadow)] transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_16px_var(--shadow-mid)] before:absolute before:bottom-3 before:left-0 before:top-3 before:w-0.5 before:rounded-r before:bg-transparent before:transition-colors hover:before:bg-rose"
    >
      <p className="font-pixel text-lg text-ink">{label}</p>
      <p className="mt-1 font-mono text-xs text-whisper">{sub}</p>
      <p className="mt-4 font-mono text-xs text-rose">→ enter</p>
    </a>
  );
}

function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}
