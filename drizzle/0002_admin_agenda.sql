ALTER TABLE "reservations" ADD COLUMN "scheduled_at" timestamp;
--> statement-breakpoint
ALTER TABLE "reservations" ADD COLUMN "duration_minutes" integer DEFAULT 120;
--> statement-breakpoint
CREATE TABLE "availability_slots" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"starts_at" timestamp NOT NULL,
	"ends_at" timestamp NOT NULL,
	"note" varchar(255),
	"created_at" timestamp DEFAULT now()
);
