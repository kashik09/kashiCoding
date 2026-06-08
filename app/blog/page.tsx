const POSTS = [
  {
    id: "first-post",
    title: "hello, world",
    date: "coming soon",
    excerpt: "the first field note will appear here when i'm ready to share it.",
    tags: ["meta", "intro"],
  },
];

export default function BlogPage() {
  return (
    <div className="animate-fade-in min-h-screen bg-bg-page">
      <div className="mx-auto max-w-[820px] px-[clamp(24px,4vw,48px)] pb-20 pt-[clamp(24px,4vw,40px)]">
        {/* Header */}
        <div className="mb-7">
          <p className="mb-1.5 font-pixel text-[13px] uppercase tracking-[0.16em] text-rose">
            # blog
          </p>
          <h1 className="font-serif text-[clamp(34px,4.5vw,48px)] font-medium italic leading-[1.1] tracking-[-0.01em] text-ink">
            field notes
          </h1>
          <p className="mt-2.5 font-mono text-sm text-whisper">
            what i&apos;m thinking about, learning, building.
          </p>
          <div className="mt-4 h-0.5 w-[50px] rounded-full bg-rose" />
        </div>

        {/* Posts List */}
        <div className="flex flex-col gap-4">
          {POSTS.map((post) => (
            <article
              key={post.id}
              className="rounded-card border border-[var(--shadow)] bg-bg-card p-5 shadow-[0_2px_8px_var(--shadow)] transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_16px_var(--shadow-mid)]"
            >
              <h2 className="mb-1 font-serif text-[22px] font-medium italic leading-[1.2] text-ink">
                {post.title}
              </h2>
              <p className="mb-2.5 font-mono text-xs text-whisper">
                {post.date}
              </p>
              <p className="mb-3 font-mono text-sm leading-relaxed text-ink">
                {post.excerpt}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {post.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-pill border border-[var(--shadow)] px-2 py-0.5 font-mono text-[10px] text-whisper"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>

        {/* Empty State */}
        <div className="mt-12 text-center">
          <p className="font-serif text-2xl italic text-ink">
            the meadow&apos;s quiet today.
          </p>
          <p className="mt-2 font-mono text-sm text-whisper">
            come back soon for field notes.
          </p>
        </div>
      </div>
    </div>
  );
}
