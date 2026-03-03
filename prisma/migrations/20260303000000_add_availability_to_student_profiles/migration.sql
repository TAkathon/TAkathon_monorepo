-- AlterTable: add availability column to student_profiles
ALTER TABLE "student_profiles" ADD COLUMN IF NOT EXISTS "availability" JSONB;
