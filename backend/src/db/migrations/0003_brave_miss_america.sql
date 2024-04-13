DO $$ BEGIN
 CREATE TYPE "invite_status" AS ENUM('sent', 'viewed', 'accepted', 'rejected');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS "users_to_notifications" (
	"user_id" uuid NOT NULL,
	"notification_id" uuid NOT NULL,
	"is_viewed" boolean DEFAULT false NOT NULL
);

CREATE TABLE IF NOT EXISTS "invites" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"inviter_id" uuid NOT NULL,
	"group_id" uuid NOT NULL,
	"invite_date" timestamp DEFAULT now() NOT NULL,
	"join_date" timestamp,
	"invite_code" varchar(256) DEFAULT '804663',
	"email" varchar(256) NOT NULL,
	"role" "roles" DEFAULT 'member' NOT NULL,
	"message" text,
	"invitee_id" uuid,
	"status" "invite_status" DEFAULT 'sent' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "notifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(256) NOT NULL,
	"message" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

ALTER TABLE "users" ALTER COLUMN "verification_code" SET DEFAULT '510328';
ALTER TABLE "users_to_groups" ALTER COLUMN "role" SET DEFAULT 'member';
DO $$ BEGIN
 ALTER TABLE "users_to_notifications" ADD CONSTRAINT "users_to_notifications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "users_to_notifications" ADD CONSTRAINT "users_to_notifications_notification_id_notifications_id_fk" FOREIGN KEY ("notification_id") REFERENCES "notifications"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "invites" ADD CONSTRAINT "invites_inviter_id_users_id_fk" FOREIGN KEY ("inviter_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "invites" ADD CONSTRAINT "invites_group_id_groups_id_fk" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "invites" ADD CONSTRAINT "invites_invitee_id_users_id_fk" FOREIGN KEY ("invitee_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
