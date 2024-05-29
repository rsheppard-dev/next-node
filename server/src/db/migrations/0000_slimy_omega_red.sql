DO $$ BEGIN
 CREATE TYPE "public"."invite_status" AS ENUM('sent', 'viewed', 'accepted', 'rejected');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 CREATE TYPE "public"."roles" AS ENUM('admin', 'member');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS "users_to_notifications" (
	"user_id" varchar NOT NULL,
	"notification_id" varchar NOT NULL,
	"is_viewed" boolean DEFAULT false NOT NULL
);

CREATE TABLE IF NOT EXISTS "groups" (
	"id" varchar(255) PRIMARY KEY DEFAULT 'nxjiz6hjly6ammbj' NOT NULL,
	"name" varchar(256) NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "groups_id_unique" UNIQUE("id")
);

CREATE TABLE IF NOT EXISTS "invites" (
	"id" varchar(255) PRIMARY KEY DEFAULT 'dh5jd6ie5yyd3fgi' NOT NULL,
	"inviter_id" varchar NOT NULL,
	"group_id" varchar NOT NULL,
	"invite_date" timestamp DEFAULT now() NOT NULL,
	"join_date" timestamp,
	"invite_code" varchar(256) DEFAULT '904161',
	"email" varchar(256) NOT NULL,
	"role" "roles" DEFAULT 'member' NOT NULL,
	"message" text,
	"invitee_id" varchar,
	"status" "invite_status" DEFAULT 'sent' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "invites_id_unique" UNIQUE("id")
);

CREATE TABLE IF NOT EXISTS "notifications" (
	"id" varchar(255) PRIMARY KEY DEFAULT 'omul7qruk7kkltmz' NOT NULL,
	"title" varchar(256) NOT NULL,
	"message" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "notifications_id_unique" UNIQUE("id")
);

CREATE TABLE IF NOT EXISTS "sessions" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"user_agent" varchar(256) NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	CONSTRAINT "sessions_id_unique" UNIQUE("id")
);

CREATE TABLE IF NOT EXISTS "users" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"given_name" varchar(256) NOT NULL,
	"family_name" varchar(256) NOT NULL,
	"email" varchar(256) NOT NULL,
	"password" varchar(256) NOT NULL,
	"date_of_birth" date,
	"picture" varchar(256),
	"is_verified" boolean DEFAULT false NOT NULL,
	"verification_code" varchar(256) DEFAULT '894353',
	"password_reset_code" varchar(256),
	"password_reset_expires_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_id_unique" UNIQUE("id"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);

CREATE TABLE IF NOT EXISTS "users_to_groups" (
	"user_id" varchar NOT NULL,
	"group_id" varchar NOT NULL,
	"role" "roles" DEFAULT 'member' NOT NULL,
	CONSTRAINT "users_to_groups_user_id_group_id_pk" PRIMARY KEY("user_id","group_id")
);

DO $$ BEGIN
 ALTER TABLE "users_to_notifications" ADD CONSTRAINT "users_to_notifications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "users_to_notifications" ADD CONSTRAINT "users_to_notifications_notification_id_notifications_id_fk" FOREIGN KEY ("notification_id") REFERENCES "public"."notifications"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "invites" ADD CONSTRAINT "invites_group_id_groups_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."groups"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "invites" ADD CONSTRAINT "invites_invitee_id_users_id_fk" FOREIGN KEY ("invitee_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "users_to_groups" ADD CONSTRAINT "users_to_groups_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "users_to_groups" ADD CONSTRAINT "users_to_groups_group_id_groups_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."groups"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

CREATE INDEX IF NOT EXISTS "invite_email_index" ON "invites" ("email");
CREATE INDEX IF NOT EXISTS "invite_code_index" ON "invites" ("invite_code");
CREATE UNIQUE INDEX IF NOT EXISTS "email_index" ON "users" ("email");