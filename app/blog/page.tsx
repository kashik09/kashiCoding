import Link from "next/link";
import type { Metadata } from "next";
import { getPublishedPosts, formatPostDate } from "@/lib/supabase/posts";

export const metadata: Metadata = {
  title: "field notes",
  description: "what kashi is thinking about, learning, and building.",
};

export const revalidate = 60;

export default async function BlogPage() {
  const posts = await getPublishedPosts();

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
          <div className="mt-4 h-0.5 w-12.5 rounded-full bg-rose" />
        </div>

        {posts.length > 0 ? (
          <div className="flex flex-col gap-4">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group block rounded-card border border-(--shadow) bg-bg-card p-5 shadow-[0_2px_8px_var(--shadow)] transition-all hover:-translate-y-0.5 hover:border-rose hover:shadow-[0_6px_16px_var(--shadow-mid)]"
              >
                <h2 className="mb-1 font-serif text-[22px] font-medium italic leading-[1.2] text-ink">
                  {post.title}
                </h2>
                <p className="mb-2.5 font-mono text-xs text-whisper">
                  {formatPostDate(post.published_at)}
                </p>
                {post.excerpt && (
                  <p className="mb-3 font-mono text-sm leading-relaxed text-ink">
                    {post.excerpt}
                  </p>
                )}
                {post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {post.tags.map((t) => (
                      <span
                        key={t}
                        className="rounded-pill border border-(--shadow) px-2 py-0.5 font-mono text-[10px] text-whisper"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </Link>
            ))}
          </div>
        ) : (
          <div className="mt-12 text-center">
            <p className="font-serif text-2xl italic text-ink">
              the meadow&apos;s quiet today.
            </p>
            <p className="mt-2 font-mono text-sm text-whisper">
              come back soon for field notes.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
