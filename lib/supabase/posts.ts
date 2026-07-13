import { createClient } from "@supabase/supabase-js";

export type Post = {
  slug: string;
  title: string;
  excerpt: string | null;
  body: string;
  tags: string[];
  published_at: string | null;
};

const COLUMNS = "slug,title,excerpt,body,tags,published_at";

// Public (anon) client for reading published posts. Returns null when the
// Supabase env vars are missing, so callers can degrade gracefully instead
// of throwing during render.
function publicClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

export async function getPublishedPosts(): Promise<Post[]> {
  const supabase = publicClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("posts")
    .select(COLUMNS)
    .eq("published", true)
    .order("published_at", { ascending: false });

  if (error || !data) return [];
  return data as Post[];
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const supabase = publicClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("posts")
    .select(COLUMNS)
    .eq("published", true)
    .eq("slug", slug)
    .maybeSingle();

  if (error || !data) return null;
  return data as Post;
}

export function formatPostDate(iso: string | null): string {
  if (!iso) return "draft";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d
    .toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
    .toLowerCase();
}
