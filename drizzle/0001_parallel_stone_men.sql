ALTER TABLE "User" ALTER COLUMN "id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "User" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "Department" DROP COLUMN IF EXISTS "updatedAt";--> statement-breakpoint
ALTER TABLE "Post" DROP COLUMN IF EXISTS "updatedAt";--> statement-breakpoint
ALTER TABLE "TVs" DROP COLUMN IF EXISTS "updatedAt";--> statement-breakpoint
ALTER TABLE "User" DROP COLUMN IF EXISTS "updatedAt";