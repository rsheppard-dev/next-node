ALTER TABLE "users" ALTER COLUMN "verification_token" SET DEFAULT 'p60QdyIdAkmCvF60mJeyM';
ALTER TABLE "sessions" ADD COLUMN "user_agent" varchar(256);
ALTER TABLE "sessions" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;
ALTER TABLE "sessions" DROP COLUMN IF EXISTS "expires_at";