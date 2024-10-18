CREATE TYPE "public"."Role" AS ENUM('USER', 'CHEF', 'ADMIN');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Department" (
	"id" text PRIMARY KEY DEFAULT uuid() NOT NULL,
	"name" text NOT NULL,
	"chefId" text NOT NULL,
	"createdAt" timestamp (3) DEFAULT now() NOT NULL,
	"updatedAt" timestamp (3) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Post" (
	"id" text PRIMARY KEY DEFAULT uuid() NOT NULL,
	"content" text,
	"authorId" text NOT NULL,
	"image" text,
	"createdAt" timestamp (3) DEFAULT now() NOT NULL,
	"updatedAt" timestamp (3) NOT NULL,
	"validated" boolean NOT NULL,
	"departmentId" text NOT NULL,
	"important" boolean NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "TVs" (
	"id" text PRIMARY KEY DEFAULT uuid() NOT NULL,
	"name" text NOT NULL,
	"departmentId" text NOT NULL,
	"password" text NOT NULL,
	"createdAt" timestamp (3) DEFAULT now() NOT NULL,
	"updatedAt" timestamp (3) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "User" (
	"id" text PRIMARY KEY DEFAULT uuid() NOT NULL,
	"email" text NOT NULL,
	"family_name" text NOT NULL,
	"first_name" text NOT NULL,
	"password" text NOT NULL,
	"role" "Role" DEFAULT 'USER' NOT NULL,
	"departmentId" text,
	"createdAt" timestamp (3) DEFAULT now() NOT NULL,
	"updatedAt" timestamp (3) NOT NULL,
	"validated" boolean NOT NULL,
	CONSTRAINT "User_email_unique" UNIQUE("email")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Department" ADD CONSTRAINT "Department_chef_fkey" FOREIGN KEY ("chefId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Post" ADD CONSTRAINT "Post_author_fkey" FOREIGN KEY ("authorId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Post" ADD CONSTRAINT "Post_department_fkey" FOREIGN KEY ("departmentId") REFERENCES "public"."Department"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "TVs" ADD CONSTRAINT "TVs_Department_fkey" FOREIGN KEY ("departmentId") REFERENCES "public"."Department"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
