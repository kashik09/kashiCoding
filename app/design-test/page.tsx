"use client";

import { useState } from "react";

type Theme = "morning" | "dusk" | "cabin";

export default function DesignTestPage() {
  const [theme, setTheme] = useState<Theme>("morning");

  const cycleTheme = () => {
    const next: Theme =
      theme === "morning" ? "dusk" : theme === "dusk" ? "cabin" : "morning";
    setTheme(next);
    document.documentElement.dataset.theme = next;
  };

  return (
    <div className="min-h-screen bg-bg-page p-8 transition-colors duration-400">
      <div className="mx-auto max-w-4xl space-y-12">
        {/* Header */}
        <header className="space-y-4">
          <h1 className="font-serif text-5xl font-medium italic text-ink">
            Design Tokens Test
          </h1>
          <p className="font-mono text-base text-whisper">
            Verify colors, typography, spacing, and radius match the reference.
          </p>
          <button
            onClick={cycleTheme}
            className="rounded-btn bg-rose px-4 py-2 font-pixel text-sm text-bg-linen transition-colors hover:bg-rose-deep"
          >
            Theme: {theme} (click to cycle)
          </button>
        </header>

        {/* Colors */}
        <section className="space-y-4">
          <h2 className="font-pixel text-lg uppercase tracking-widest text-rose">
            [ colors ]
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            <ColorSwatch name="bg-page" className="bg-bg-page" />
            <ColorSwatch name="bg-card" className="bg-bg-card" />
            <ColorSwatch name="bg-linen" className="bg-bg-linen" />
            <ColorSwatch name="moss" className="bg-moss" />
            <ColorSwatch name="fern" className="bg-fern" />
            <ColorSwatch name="rose" className="bg-rose" />
            <ColorSwatch name="rose-deep" className="bg-rose-deep" />
            <ColorSwatch name="honey" className="bg-honey" />
            <ColorSwatch name="ink" className="bg-ink" />
            <ColorSwatch name="whisper" className="bg-whisper" />
          </div>
        </section>

        {/* Typography */}
        <section className="space-y-4">
          <h2 className="font-pixel text-lg uppercase tracking-widest text-rose">
            [ typography ]
          </h2>

          <div className="space-y-6 rounded-card bg-bg-card p-6 shadow-[0_2px_8px_var(--shadow)]">
            <div>
              <p className="mb-2 font-pixel text-xs uppercase tracking-widest text-whisper">
                font-serif (Fraunces)
              </p>
              <p className="font-serif text-4xl font-medium italic text-ink">
                status207
              </p>
            </div>

            <div>
              <p className="mb-2 font-pixel text-xs uppercase tracking-widest text-whisper">
                font-pixel (Pixelify Sans)
              </p>
              <p className="font-pixel text-2xl text-ink">
                press SPACE to begin
              </p>
            </div>

            <div>
              <p className="mb-2 font-pixel text-xs uppercase tracking-widest text-whisper">
                font-stamp (Silkscreen)
              </p>
              <p className="font-stamp text-sm uppercase tracking-widest text-whisper">
                STATUS207 v2.0
              </p>
            </div>

            <div>
              <p className="mb-2 font-pixel text-xs uppercase tracking-widest text-whisper">
                font-mono (IBM Plex Mono)
              </p>
              <p className="font-mono text-base text-ink">
                a soft little portfolio in the shape of a game.
              </p>
            </div>
          </div>
        </section>

        {/* Font Sizes */}
        <section className="space-y-4">
          <h2 className="font-pixel text-lg uppercase tracking-widest text-rose">
            [ font sizes ]
          </h2>

          <div className="space-y-4 rounded-card bg-bg-card p-6 shadow-[0_2px_8px_var(--shadow)]">
            <p className="font-serif text-7xl font-medium italic text-ink">
              H1 Title (72px)
            </p>
            <p className="font-serif text-5xl font-medium italic text-ink">
              H2 Section (48px)
            </p>
            <p className="font-pixel text-xl text-ink">Nav/Button (20px)</p>
            <p className="font-mono text-base text-ink">Body text (16px)</p>
            <p className="font-mono text-sm text-whisper">Small text (14px)</p>
            <p className="font-pixel text-xs uppercase tracking-widest text-whisper">
              Overline (12px)
            </p>
          </div>
        </section>

        {/* Border Radius */}
        <section className="space-y-4">
          <h2 className="font-pixel text-lg uppercase tracking-widest text-rose">
            [ border radius ]
          </h2>

          <div className="flex flex-wrap gap-4">
            <div className="flex h-24 w-24 items-center justify-center rounded-card bg-bg-card shadow-[0_2px_8px_var(--shadow)]">
              <span className="font-mono text-xs text-whisper">card (12px)</span>
            </div>
            <div className="flex h-24 w-24 items-center justify-center rounded-btn bg-bg-card shadow-[0_2px_8px_var(--shadow)]">
              <span className="font-mono text-xs text-whisper">btn (8px)</span>
            </div>
            <div className="flex h-24 w-24 items-center justify-center rounded-pill bg-bg-card shadow-[0_2px_8px_var(--shadow)]">
              <span className="font-mono text-xs text-whisper">pill (999px)</span>
            </div>
          </div>
        </section>

        {/* Components */}
        <section className="space-y-4">
          <h2 className="font-pixel text-lg uppercase tracking-widest text-rose">
            [ components ]
          </h2>

          <div className="space-y-6 rounded-card bg-bg-card p-6 shadow-[0_2px_8px_var(--shadow)]">
            {/* Buttons */}
            <div className="space-y-2">
              <p className="font-pixel text-xs uppercase tracking-widest text-whisper">
                buttons
              </p>
              <div className="flex flex-wrap gap-3">
                <button className="rounded-btn bg-rose px-5 py-2.5 font-pixel text-sm text-bg-linen shadow-[0_2px_6px_var(--shadow)] transition-all hover:-translate-y-0.5 hover:bg-rose-deep hover:shadow-[0_4px_10px_var(--shadow-mid)]">
                  Primary Button
                </button>
                <button className="font-pixel text-sm text-whisper transition-colors hover:text-rose-deep">
                  Ghost Button →
                </button>
              </div>
            </div>

            {/* Pills */}
            <div className="space-y-2">
              <p className="font-pixel text-xs uppercase tracking-widest text-whisper">
                pills
              </p>
              <div className="flex flex-wrap gap-3">
                <span className="inline-flex items-center gap-2 rounded-pill bg-moss px-3.5 py-1.5 font-mono text-sm text-ink">
                  <span className="h-2 w-2 rounded-full bg-fern shadow-[0_0_0_3px_rgba(122,144,114,0.25)]" />
                  available
                </span>
                <span className="rounded-pill border border-rose bg-transparent px-2.5 py-0.5 font-mono text-xs text-rose">
                  tag
                </span>
              </div>
            </div>

            {/* Chips */}
            <div className="space-y-2">
              <p className="font-pixel text-xs uppercase tracking-widest text-whisper">
                chips
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="rounded-pill border border-(--shadow) bg-bg-linen px-3 py-1 font-mono text-xs text-ink">
                  Next.js
                </span>
                <span className="rounded-pill border border-(--shadow) bg-bg-linen px-3 py-1 font-mono text-xs text-ink">
                  TypeScript
                </span>
                <span className="rounded-pill border border-(--shadow) bg-bg-linen px-3 py-1 font-mono text-xs text-ink">
                  Tailwind
                </span>
              </div>
            </div>

            {/* Cards */}
            <div className="space-y-2">
              <p className="font-pixel text-xs uppercase tracking-widest text-whisper">
                cards
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="relative rounded-card border border-(--shadow) bg-bg-card p-5 shadow-[0_2px_8px_var(--shadow)] transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_16px_var(--shadow-mid)] before:absolute before:left-0 before:top-3 before:bottom-3 before:w-0.5 before:rounded-r before:bg-transparent before:transition-colors hover:before:bg-rose">
                  <p className="font-pixel text-lg text-ink">projects</p>
                  <p className="mt-1 font-mono text-xs text-whisper">
                    what i&apos;ve built
                  </p>
                  <p className="mt-4 font-mono text-xs text-rose">→ enter</p>
                </div>
                <div className="rounded-card border border-(--shadow) bg-bg-card p-5 shadow-[0_2px_8px_var(--shadow)]">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="font-pixel text-xs uppercase tracking-widest text-rose">
                      NOW BUILDING
                    </span>
                  </div>
                  <p className="font-mono text-sm text-ink">
                    a soft little portfolio
                  </p>
                </div>
              </div>
            </div>

            {/* Keycap */}
            <div className="space-y-2">
              <p className="font-pixel text-xs uppercase tracking-widest text-whisper">
                keycap
              </p>
              <div className="flex gap-2">
                <span className="inline-flex h-6 min-w-5.5 items-center justify-center rounded-md border border-(--shadow-mid) bg-bg-linen px-1.5 font-pixel text-xs text-ink shadow-[0_1px_2px_var(--shadow)]">
                  SPACE
                </span>
                <span className="inline-flex h-6 min-w-5.5 items-center justify-center rounded-md border border-(--shadow-mid) bg-bg-linen px-1.5 font-pixel text-xs text-ink shadow-[0_1px_2px_var(--shadow)]">
                  ESC
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Animations */}
        <section className="space-y-4">
          <h2 className="font-pixel text-lg uppercase tracking-widest text-rose">
            [ animations ]
          </h2>

          <div className="flex flex-wrap gap-8 rounded-card bg-bg-card p-6 shadow-[0_2px_8px_var(--shadow)]">
            <div className="text-center">
              <div className="animate-bob mx-auto mb-2 h-12 w-12 rounded-card bg-moss" />
              <p className="font-mono text-xs text-whisper">bob</p>
            </div>
            <div className="text-center">
              <div className="animate-wiggle mx-auto mb-2 h-12 w-12 rounded-card bg-rose" />
              <p className="font-mono text-xs text-whisper">wiggle</p>
            </div>
            <div className="text-center">
              <div className="animate-pulse-soft mx-auto mb-2 h-12 w-12 rounded-full bg-moss" />
              <p className="font-mono text-xs text-whisper">pulse-soft</p>
            </div>
            <div className="text-center">
              <span className="animate-blink font-mono text-2xl text-ink">|</span>
              <p className="font-mono text-xs text-whisper">blink</p>
            </div>
          </div>
        </section>

        {/* Shadows */}
        <section className="space-y-4">
          <h2 className="font-pixel text-lg uppercase tracking-widest text-rose">
            [ shadows ]
          </h2>

          <div className="flex flex-wrap gap-6">
            <div className="flex h-24 w-32 items-center justify-center rounded-card bg-bg-card shadow-[0_2px_8px_var(--shadow)]">
              <span className="font-mono text-xs text-whisper">soft</span>
            </div>
            <div className="flex h-24 w-32 items-center justify-center rounded-card bg-bg-card shadow-[0_4px_16px_var(--shadow)]">
              <span className="font-mono text-xs text-whisper">lift</span>
            </div>
            <div className="flex h-24 w-32 items-center justify-center rounded-card bg-bg-card shadow-[0_6px_16px_var(--shadow-mid)]">
              <span className="font-mono text-xs text-whisper">hover</span>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-(--shadow) pt-8 text-center">
          <p className="font-mono text-sm text-whisper">
            design tokens test page — status207 v2
          </p>
        </footer>
      </div>
    </div>
  );
}

function ColorSwatch({
  name,
  className,
}: {
  name: string;
  className: string;
}) {
  return (
    <div className="space-y-2">
      <div
        className={`h-16 w-full rounded-card border border-(--shadow) ${className}`}
      />
      <p className="font-mono text-xs text-whisper">{name}</p>
    </div>
  );
}
