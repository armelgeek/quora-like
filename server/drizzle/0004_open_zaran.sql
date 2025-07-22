DROP TABLE "blog" CASCADE;--> statement-breakpoint
DROP TABLE "blog_categories" CASCADE;--> statement-breakpoint
DROP TABLE "categories" CASCADE;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "bio" text;