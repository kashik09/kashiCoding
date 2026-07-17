-- Add mustResetPassword field to users table
ALTER TABLE "users" ADD COLUMN "mustResetPassword" BOOLEAN NOT NULL DEFAULT false;

-- Add passwordUpdatedAt field to users table
ALTER TABLE "users" ADD COLUMN "passwordUpdatedAt" TIMESTAMP(3);

-- Set mustResetPassword=true for all existing users with passwords
-- This forces them to reset on next login
UPDATE "users" SET "mustResetPassword" = true WHERE "password" IS NOT NULL;
