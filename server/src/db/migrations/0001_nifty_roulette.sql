ALTER TABLE "groups" ALTER COLUMN "id" SET DEFAULT 'aqnug333lorfxdi5';
ALTER TABLE "invites" ALTER COLUMN "id" SET DEFAULT 'bpd37dsnrrnd2img';
ALTER TABLE "invites" ALTER COLUMN "invite_code" SET DEFAULT '399542';
ALTER TABLE "notifications" ALTER COLUMN "id" SET DEFAULT '3icxgx6vp2qkr34p';
ALTER TABLE "users" ALTER COLUMN "verification_code" SET DEFAULT '185251';
ALTER TABLE "sessions" DROP COLUMN IF EXISTS "user_agent";