import { SoftLeaves } from "@/components/ambient/SoftLeaves";
import { MapPinIcon } from "@/components/icons/misc";

const STATS = [
  { k: "location", v: "kampala, uganda" },
  { k: "role", v: "full-stack developer" },
  { k: "stack", v: "Next.js, TypeScript, Tailwind" },
  { k: "currently", v: "building this portfolio" },
  { k: "studying", v: "motion design & animation" },
];

const VITALS = [
  { k: "caffeine", v: 78 },
  { k: "curiosity", v: 95 },
  { k: "patience", v: 62 },
  { k: "ship rate", v: 70 },
];

const ABOUT_LINES = [
  "hi there! i'm kashi — a developer who loves building soft, cozy things on the web.",
  "i believe good software should feel like a warm cup of coffee on a rainy afternoon.",
  "when i'm not coding, you'll find me exploring new music, reading, or tending to my plants.",
  "i'm always excited to collaborate on projects that make the web a little more delightful.",
];

export default function AboutPage() {
  return (
    <div className="relative min-h-screen">
      <SoftLeaves count={3} />

      <div className="animate-fade-in relative z-2 mx-auto max-w-220 px-[clamp(24px,4vw,48px)] pb-20 pt-[clamp(24px,4vw,40px)]">
        {/* Header */}
        <div className="mb-8">
          <p className="mb-1.5 font-pixel text-[13px] uppercase tracking-[0.16em] text-rose">
            &lt;about/&gt;
          </p>
          <h1 className="font-serif text-[clamp(34px,4.5vw,48px)] font-medium italic leading-[1.1] tracking-[-0.01em] text-ink">
            a small introduction
          </h1>
          <div className="mt-4 h-0.5 w-12.5 rounded-full bg-rose" />
        </div>

        {/* Two Column Layout */}
        <div className="grid gap-[clamp(20px,3vw,36px)] md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.3fr)]">
          {/* Left - Monogram Card */}
          <div className="rounded-card border border-(--shadow) bg-bg-card p-6.5 shadow-[0_2px_8px_var(--shadow)]">
            {/* Avatar Circle */}
            <div className="mx-auto mb-5 flex h-22.5 w-22.5 items-center justify-center rounded-full border border-(--shadow) bg-bg-linen shadow-[0_4px_14px_var(--shadow)]">
              <span className="font-serif text-[40px] italic leading-none text-rose-deep">
                k
              </span>
            </div>

            <div className="text-center">
              <p className="font-serif text-[22px] italic leading-[1.2] text-ink">
                kashi kweyu
              </p>
              <p className="mt-1 font-pixel text-xs uppercase tracking-[0.12em] text-rose">
                full-stack developer
              </p>
              <p className="mt-3 font-mono text-[13px] italic leading-relaxed text-whisper">
                &quot;building soft, cozy things on the web.&quot;
              </p>
            </div>

            {/* Location */}
            <div className="mt-5 border-t border-(--shadow) pt-3.5">
              <p className="mb-2 font-pixel text-[11px] uppercase tracking-[0.12em] text-whisper">
                where
              </p>
              <p className="flex items-center gap-2 font-mono text-[13px] text-ink">
                <MapPinIcon className="h-4 w-4 text-rose-deep" />
                kampala, uganda
              </p>
            </div>
          </div>

          {/* Right - Dialog Letter */}
          <div className="min-h-70 rounded-card border border-(--shadow) bg-bg-card p-6 shadow-[0_4px_14px_var(--shadow)]">
            <p className="mb-4 font-pixel text-xs uppercase tracking-[0.12em] text-rose">
              ✎ from kashi
            </p>

            <div className="min-h-40 font-mono text-[17px] leading-[1.7] text-ink">
              {ABOUT_LINES.map((line, i) => (
                <p key={i} className="mb-2 last:mb-0">
                  {line}
                </p>
              ))}
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-(--shadow) pt-3.5 font-mono text-xs text-whisper">
              <span className="text-rose">— that&apos;s the whole letter.</span>
            </div>
          </div>
        </div>

        {/* Stat Sheet */}
        <section className="mt-8 rounded-card border border-(--shadow) bg-bg-card p-6 shadow-[0_2px_8px_var(--shadow)]">
          <p className="mb-4 font-pixel text-[11px] uppercase tracking-widest text-rose">
            STAT SHEET
          </p>

          <div className="grid gap-6 md:grid-cols-[repeat(auto-fit,minmax(240px,1fr))]">
            {/* Left - Facts */}
            <div className="flex flex-col gap-2.5">
              {STATS.map((row) => (
                <div
                  key={row.k}
                  className="grid grid-cols-[90px_1fr] gap-3 border-b border-dashed border-(--shadow) pb-2 text-[13px]"
                >
                  <span className="font-pixel text-[11px] tracking-[0.08em] text-rose">
                    {row.k}
                  </span>
                  <span className="font-mono text-ink">{row.v}</span>
                </div>
              ))}
            </div>

            {/* Right - Vitals */}
            <div className="flex flex-col gap-3.5">
              {VITALS.map((row) => (
                <div key={row.k}>
                  <div className="mb-1 flex justify-between text-[11px]">
                    <span className="font-pixel tracking-[0.08em] text-rose">
                      {row.k}
                    </span>
                    <span className="text-whisper">{row.v}%</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-bg-linen">
                    <div
                      className="h-full rounded-full bg-rose transition-[width] duration-400"
                      style={{ width: `${row.v}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p className="mt-4 border-t border-dashed border-(--shadow) pt-3 text-center text-[10px] text-whisper/70">
            · self-reported · updated whenever ·
          </p>
        </section>
      </div>
    </div>
  );
}
