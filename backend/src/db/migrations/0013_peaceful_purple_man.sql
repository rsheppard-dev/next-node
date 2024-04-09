ALTER TABLE "users" RENAME COLUMN "verification_token" TO "verification_code";
ALTER TABLE "users" RENAME COLUMN "password_reset_token" TO "password_reset_code";
ALTER TABLE "users" ALTER COLUMN "verification_code" SET DEFAULT 'yDRTLOKInOU2RCLH_S8C8';