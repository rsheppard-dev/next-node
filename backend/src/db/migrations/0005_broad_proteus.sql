ALTER TABLE "invites" DROP CONSTRAINT "invites_inviter_id_users_id_fk";

ALTER TABLE "invites" ALTER COLUMN "invite_code" SET DEFAULT '833332';
ALTER TABLE "users" ALTER COLUMN "verification_code" SET DEFAULT '092103';
CREATE INDEX IF NOT EXISTS "invite_email_index" ON "invites" ("email");
CREATE INDEX IF NOT EXISTS "invite_code_index" ON "invites" ("invite_code");