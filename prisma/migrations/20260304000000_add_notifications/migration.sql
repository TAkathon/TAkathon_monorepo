-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM (
  'TEAM_INVITATION_RECEIVED',
  'TEAM_INVITATION_ACCEPTED',
  'TEAM_INVITATION_REJECTED',
  'HACKATHON_REGISTRATION_CONFIRMED',
  'HACKATHON_CANCELLED',
  'HACKATHON_STARTING_SOON',
  'SPONSORSHIP_REQUEST_RECEIVED',
  'TEAM_JOIN_REQUEST_RECEIVED',
  'SPONSORSHIP_REQUEST_APPROVED',
  'SPONSORSHIP_REQUEST_REJECTED',
  'SYSTEM_ANNOUNCEMENT'
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "type" "NotificationType" NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "message" TEXT NOT NULL,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "action_url" TEXT,
    "metadata" JSONB,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "notifications_user_id_is_read_idx" ON "notifications"("user_id", "is_read");

-- CreateIndex
CREATE INDEX "notifications_user_id_idx" ON "notifications"("user_id");

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_fkey"
  FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
