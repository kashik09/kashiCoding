-- Blog posts for the "field notes" section
CREATE TABLE IF NOT EXISTS public.posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  excerpt TEXT,
  body TEXT NOT NULL,
  tags TEXT[] NOT NULL DEFAULT '{}',
  published BOOLEAN NOT NULL DEFAULT FALSE,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- Published posts are readable by anyone (this is a public blog)
CREATE POLICY "Published posts are public"
  ON public.posts
  FOR SELECT
  USING (published = true);

CREATE INDEX IF NOT EXISTS idx_posts_published_at
  ON public.posts (published_at DESC);

-- Keep updated_at fresh on edits
CREATE OR REPLACE FUNCTION public.posts_set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER posts_updated_at
  BEFORE UPDATE ON public.posts
  FOR EACH ROW
  EXECUTE FUNCTION public.posts_set_updated_at();

-- Seed: first field note
INSERT INTO public.posts (slug, title, excerpt, body, tags, published, published_at)
VALUES (
  'hello-world',
  'hello, world',
  'why this little site exists, and what these field notes are for.',
  E'welcome to the field notes — the corner of status207 where i think out loud.\n\ni built this site to feel less like a resume and more like a room you can wander into: soft colors, a splash screen, and three themes that follow the time of day.\n\nthese notes are where i''ll write about what i''m building, what breaks, and what i learn along the way.\n\nthanks for stopping by. more soon.',
  ARRAY['meta','intro'],
  TRUE,
  NOW()
)
ON CONFLICT (slug) DO NOTHING;
