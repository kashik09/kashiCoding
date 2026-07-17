-- CreateIndex
CREATE INDEX IF NOT EXISTS "projects_featured_createdAt_idx"
ON "projects" ("featured", "createdAt");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "projects_published_featured_createdAt_idx"
ON "projects" ("published", "featured", "createdAt");
