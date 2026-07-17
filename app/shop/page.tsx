import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "shop",
  description: "digital goods and services from kashi — coming soon.",
};

export default function ShopPage() {
  return (
    <div className="animate-fade-in min-h-screen bg-bg-page">
      <div className="mx-auto max-w-[1100px] px-[clamp(24px,4vw,48px)] pb-20 pt-[clamp(24px,4vw,40px)]">
        {/* Header */}
        <div className="mb-7">
          <p className="mb-1.5 font-pixel text-[13px] uppercase tracking-[0.16em] text-rose">
            $ shop
          </p>
          <h1 className="font-serif text-[clamp(34px,4.5vw,48px)] font-medium italic leading-[1.1] tracking-[-0.01em] text-ink">
            the market
          </h1>
          <p className="mt-2.5 font-mono text-sm text-whisper">
            digital goods & services, coming soon.
          </p>
          <div className="mt-4 h-0.5 w-12.5 rounded-full bg-rose" />
        </div>

        {/* Coming Soon State */}
        <div className="mt-16 flex flex-col items-center text-center">
          <div className="animate-bob mb-6 flex h-32 w-32 items-center justify-center rounded-full bg-bg-card shadow-[0_4px_16px_var(--shadow)]">
            <span className="font-pixel text-4xl text-rose">$</span>
          </div>
          <p className="font-serif text-2xl italic text-ink">
            setting up shop...
          </p>
          <p className="mt-2 max-w-sm font-mono text-sm text-whisper">
            i&apos;m working on some digital goods and services to offer. check
            back soon!
          </p>
        </div>

        {/* Coming-soon shelf */}
        <div className="mt-12 grid gap-5 sm:grid-cols-2 md:grid-cols-3">
          {[
            { label: "prints & wallpapers", icon: "❋" },
            { label: "starter templates", icon: "◳" },
            { label: "something surprising", icon: "✦" },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-card border border-dashed border-(--shadow) bg-bg-card p-5"
            >
              <div className="mb-4 grid aspect-square place-items-center rounded-lg bg-bg-linen font-pixel text-3xl text-rose">
                {item.icon}
              </div>
              <p className="font-serif text-lg italic text-ink">{item.label}</p>
              <p className="mt-1 font-mono text-sm text-whisper">
                on the way — soon
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
