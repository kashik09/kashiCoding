import { ArrowRightIcon, BoxesIcon, SparklesIcon } from "@/components/icons";
import { SoftLeaves } from "@/components/ambient/SoftLeaves";
import { ReadingDesk } from "@/components/illustrations/ReadingDesk";
import Link from "next/link";

const ROOMS = [
  { id: "skills", label: "skills", sub: "what i work with" },
  { id: "blog", label: "blog", sub: "field notes" },
  { id: "contact", label: "contact", sub: "send a letter" },
] as const;

export default function HomePage() {
  return (
    <div className="relative min-h-screen">
      <SoftLeaves count={4} />

      <div className="animate-fade-in relative z-[2] mx-auto max-w-[1100px] px-[clamp(24px,4vw,48px)] pb-20 pt-8">
        {/* HERO */}
        <section className="mt-8 grid items-center gap-[clamp(24px,4vw,56px)] md:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
          <div>
            <p className="mb-2 font-pixel text-[17px] text-whisper">hi, i'm</p>
            <h1 className="font-serif text-[clamp(44px,6.5vw,72px)] font-medium italic leading-[1.02] tracking-[-0.02em] text-ink">
              kashi kweyu
            </h1>
            <div className="my-3.5 h-0.5 w-[60px] rounded-full bg-rose" />
            <p className="max-w-[460px] font-mono text-base italic leading-relaxed text-whisper">
              a full-stack developer building soft, cozy things on the web.
            </p>

            <div className="mt-[26px] flex flex-wrap items-center gap-[18px]">
              {/* Status Pill */}
              <span className="animate-pulse-soft inline-flex items-center gap-2 rounded-pill bg-moss px-3.5 py-1.5 font-mono text-sm text-ink">
                <span className="h-2 w-2 rounded-full bg-fern shadow-[0_0_0_3px_rgba(122,144,114,0.25)]" />
                available
              </span>

              {/* CTA Button */}
              <Link
                href="/skills"
                className="inline-flex items-center gap-2 rounded-btn bg-rose px-5 py-2.5 font-pixel text-sm text-bg-linen shadow-[0_2px_6px_var(--shadow)] transition-all hover:-translate-y-0.5 hover:bg-rose-deep hover:shadow-[0_4px_10px_var(--shadow-mid)]"
              >
                view skills
                <ArrowRightIcon className="h-4 w-4" />
              </Link>

              {/* Ghost Link */}
              <Link
                href="/contact"
                className="inline-flex items-center gap-1.5 font-pixel text-sm text-whisper transition-colors hover:text-rose-deep"
              >
                or say hello →
              </Link>
            </div>
          </div>

          {/* Illustration */}
          <div className="hidden items-center justify-center md:flex">
            <div className="animate-bob inline-block">
              <ReadingDesk size={300} />
            </div>
          </div>
        </section>

        {/* WHAT I'M UP TO */}
        <section className="mt-16">
          <SectionRule>what i&apos;m up to</SectionRule>

          <div className="mt-[22px] grid gap-4 sm:grid-cols-[repeat(auto-fit,minmax(220px,1fr))]">
            <NowCard
              label="NOW BUILDING"
              body="this portfolio site"
              icon={<BoxesIcon className="h-5 w-5 text-rose-deep" />}
            />
            <NowCard
              label="NOW LEARNING"
              body="motion design & animation"
              icon={<SparklesIcon className="h-5 w-5 text-rose-deep" />}
            />
          </div>
        </section>

        {/* WANDER THE ROOMS */}
        <section className="mt-12">
          <SectionRule>wander the rooms</SectionRule>

          <div className="mt-[22px] grid gap-4 sm:grid-cols-2 md:grid-cols-[repeat(auto-fit,minmax(180px,1fr))]">
            {ROOMS.map((r) => (
              <RoomCard key={r.id} href={`/${r.id}`} label={r.label} sub={r.sub} />
            ))}
          </div>
        </section>
      </div>
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

function NowCard({
  label,
  body,
  icon,
}: {
  label: string;
  body: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-card border border-[var(--shadow)] bg-bg-card p-5 shadow-[0_2px_8px_var(--shadow)] transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_16px_var(--shadow-mid)]">
      <div className="mb-3.5 flex items-center justify-between">
        <span className="font-pixel text-xs uppercase tracking-[0.12em] text-rose">
          {label}
        </span>
        {icon}
      </div>
      <p className="font-mono text-sm leading-[1.55] text-ink">{body}</p>
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
    <Link
      href={href}
      className="group relative block rounded-card border border-[var(--shadow)] bg-bg-card p-5 text-left shadow-[0_2px_8px_var(--shadow)] transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_16px_var(--shadow-mid)] before:absolute before:bottom-3 before:left-0 before:top-3 before:w-0.5 before:rounded-r before:bg-transparent before:transition-colors hover:before:bg-rose"
    >
      <p className="font-pixel text-lg text-ink">{label}</p>
      <p className="mt-1.5 font-mono text-xs text-whisper">{sub}</p>
      <p className="mt-3.5 inline-flex items-center gap-1.5 font-mono text-xs text-rose">
        → enter
      </p>
    </Link>
  );
}
