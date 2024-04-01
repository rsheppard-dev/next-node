ALTER TABLE "users" ADD COLUMN "is_verified" boolean DEFAULT false NOT NULL;
ALTER TABLE "users" ADD COLUMN "verification_token" varchar(256) DEFAULT 'i81vRxV_N6tVDm5ZdCrXH' NOT NULL;
ALTER TABLE "users" ADD COLUMN "password_reset_token" varchar(256);