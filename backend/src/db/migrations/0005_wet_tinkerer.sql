ALTER TABLE "users" ALTER COLUMN "verification_token" SET DEFAULT '1cL80nutyFckolzEy-ekf';
CREATE UNIQUE INDEX IF NOT EXISTS "email_index" ON "users" ("email");