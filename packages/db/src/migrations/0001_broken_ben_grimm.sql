CREATE TYPE "public"."order_status" AS ENUM('Awaiting payment', 'Payment received', 'Processing', 'Completed');--> statement-breakpoint
CREATE TABLE "esim" (
	"id" text PRIMARY KEY NOT NULL,
	"order_id" text NOT NULL,
	"provider_esim_id" text NOT NULL,
	"status" text,
	"qr_code_url" text,
	"short_url" text,
	"activation_code" text,
	"data_usage" double precision DEFAULT 0 NOT NULL,
	"total_data" double precision DEFAULT 0 NOT NULL,
	"expires_at" text,
	"details_fetched_at" timestamp,
	"status_updated_at" timestamp,
	"usage_updated_at" timestamp,
	"validity_updated_at" timestamp,
	CONSTRAINT "esim_order_id_unique" UNIQUE("order_id"),
	CONSTRAINT "esim_provider_esim_id_unique" UNIQUE("provider_esim_id")
);
--> statement-breakpoint
CREATE TABLE "order" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text,
	"package_slug" text NOT NULL,
	"package_name" text NOT NULL,
	"price" integer NOT NULL,
	"currency_code" text NOT NULL,
	"status" "order_status" DEFAULT 'Awaiting payment' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"stripe_payment_intent_id" text,
	"paid_at" timestamp,
	"checkout_token_hash" text,
	"checkout_expires_at" timestamp,
	CONSTRAINT "order_stripe_payment_intent_id_unique" UNIQUE("stripe_payment_intent_id")
);
--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "is_anonymous" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "esim" ADD CONSTRAINT "esim_order_id_order_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."order"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order" ADD CONSTRAINT "order_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "order_user_id_idx" ON "order" USING btree ("user_id");