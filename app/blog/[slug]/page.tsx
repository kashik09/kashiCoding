import Link from "next/link";

const POSTS = [
  {
    slug: "hello-world",
    title: "hello, world",
    date: "coming soon",
    body: "the first field note will appear here when i'm ready to share it.",
    tags: ["meta", "intro"],
  },
];

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = POSTS.find((p) => p.slug === slug);

  if (!post) {
    return (
      <div className="animate-fade-in min-h-screen bg-bg-page">
        <div className="mx-auto max-w-[640px] px-[clamp(24px,4vw,48px)] py-12 text-center">
          <p className="font-serif text-2xl italic text-ink">
            post not found.
          </p>
          <p className="mt-2 font-mono text-sm text-whisper">
            try one of the other field notes.
          </p>
          <Link
            href="/blog"
            className="mt-6 inline-block font-pixel text-sm text-rose transition-colors hover:text-rose-deep"
          >
            ← back to field notes
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in min-h-screen bg-bg-page">
      <div className="mx-auto max-w-[640px] px-[clamp(24px,4vw,48px)] pb-20 pt-[clamp(24px,4vw,40px)]">
        {/* Back Link */}
        <Link
          href="/blog"
          className="mb-7 inline-flex items-center gap-1.5 font-mono text-[13px] text-rose transition-colors hover:text-rose-deep"
        >
          ← back to field notes
        </Link>

        {/* Title */}
        <h1 className="font-serif text-[clamp(34px,5vw,48px)] font-medium italic leading-[1.1] tracking-[-0.01em] text-ink">
          {post.title}
        </h1>

        {/* Meta */}
        <div className="mt-3 mb-8 flex flex-wrap items-center gap-3 font-mono text-xs text-whisper">
          <span>{post.date}</span>
          {post.tags.map((t) => (
            <span
              key={t}
              className="rounded-pill border border-[var(--shadow)] px-2 py-0.5"
            >
              {t}
            </span>
          ))}
        </div>

        {/* Body */}
        <div className="font-mono text-base leading-[1.7] text-ink">
          <p>{post.body}</p>
        </div>

        {/* Back to blog */}
        <div className="mt-14 border-t border-[var(--shadow)] pt-6">
          <Link
            href="/blog"
            className="font-pixel text-sm text-rose transition-colors hover:text-rose-deep"
          >
            ← back to field notes
          </Link>
        </div>
      </div>
    </div>
  );
}
