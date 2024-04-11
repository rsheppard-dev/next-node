ALTER TABLE "users" ALTER COLUMN "verification_code" SET DEFAULT '047170';
ALTER TABLE "users_to_groups" DROP COLUMN IF EXISTS "id";
ALTER TABLE "users_to_groups" DROP COLUMN IF EXISTS "created_at";
ALTER TABLE "users_to_groups" DROP COLUMN IF EXISTS "updated_at";