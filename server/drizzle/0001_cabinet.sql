CREATE TYPE "public"."document_type" AS ENUM('passport', 'foreign_passport', 'visa', 'id_card', 'driver_license', 'photo', 'other');--> statement-breakpoint
CREATE TYPE "public"."user_tier" AS ENUM('bronze', 'silver', 'gold', 'platinum');--> statement-breakpoint
CREATE TYPE "public"."wallet_kind" AS ENUM('miles', 'cashback');--> statement-breakpoint
CREATE TYPE "public"."wallet_txn_type" AS ENUM('accrual', 'spend', 'refund', 'manual_adjustment', 'expired');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "referral_redemptions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"referral_id" uuid NOT NULL,
	"invited_user_id" uuid NOT NULL,
	"awarded_at" timestamp with time zone,
	"miles_awarded" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "referrals" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"owner_id" uuid NOT NULL,
	"code" varchar(24) NOT NULL,
	"signups_count" integer DEFAULT 0 NOT NULL,
	"bookings_count" integer DEFAULT 0 NOT NULL,
	"total_miles_earned" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_documents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"type" "document_type" NOT NULL,
	"name" varchar(160) NOT NULL,
	"number" varchar(64),
	"issued_at" timestamp with time zone,
	"expires_at" timestamp with time zone,
	"country_code" varchar(2),
	"file_url" text,
	"meta" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "wallet_transactions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"kind" "wallet_kind" NOT NULL,
	"type" "wallet_txn_type" NOT NULL,
	"amount" numeric(14, 2) NOT NULL,
	"currency" "currency",
	"description" text NOT NULL,
	"booking_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "tier" "user_tier" DEFAULT 'bronze' NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "miles_balance" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "cashback_balance" numeric(12, 2) DEFAULT '0' NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "referral_redemptions" ADD CONSTRAINT "referral_redemptions_referral_id_referrals_id_fk" FOREIGN KEY ("referral_id") REFERENCES "public"."referrals"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "referral_redemptions" ADD CONSTRAINT "referral_redemptions_invited_user_id_users_id_fk" FOREIGN KEY ("invited_user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "referrals" ADD CONSTRAINT "referrals_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_documents" ADD CONSTRAINT "user_documents_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "wallet_transactions" ADD CONSTRAINT "wallet_transactions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "wallet_transactions" ADD CONSTRAINT "wallet_transactions_booking_id_bookings_id_fk" FOREIGN KEY ("booking_id") REFERENCES "public"."bookings"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "referral_redemptions_referral_idx" ON "referral_redemptions" USING btree ("referral_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "referral_redemptions_invited_uq" ON "referral_redemptions" USING btree ("invited_user_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "referrals_code_uq" ON "referrals" USING btree ("code");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "referrals_owner_uq" ON "referrals" USING btree ("owner_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_docs_user_idx" ON "user_documents" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_docs_type_idx" ON "user_documents" USING btree ("user_id","type");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_docs_expires_idx" ON "user_documents" USING btree ("expires_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "wallet_user_idx" ON "wallet_transactions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "wallet_user_kind_idx" ON "wallet_transactions" USING btree ("user_id","kind");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "wallet_created_at_idx" ON "wallet_transactions" USING btree ("created_at");