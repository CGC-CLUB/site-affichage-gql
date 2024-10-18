ALTER TABLE "User" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "User" ALTER COLUMN "id" SET DEFAULT uuid();