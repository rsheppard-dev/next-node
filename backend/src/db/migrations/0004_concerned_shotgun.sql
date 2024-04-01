ALTER TABLE "users" ALTER COLUMN "verification_token" SET DEFAULT 'ZWCJz7eeSo-3zeuf2lQWI';
ALTER TABLE "users" ADD CONSTRAINT "users_email_unique" UNIQUE("email");