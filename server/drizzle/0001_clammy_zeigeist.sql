CREATE TABLE "blog_categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"blog_id" text NOT NULL,
	"category_id" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"description" text,
	"color" varchar(7),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "categories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "blog" ADD COLUMN "slug" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "blog" ADD COLUMN "excerpt" text;--> statement-breakpoint
ALTER TABLE "blog" ADD COLUMN "status" varchar(50) DEFAULT 'draft';--> statement-breakpoint
ALTER TABLE "blog" ADD COLUMN "view_count" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "blog" ADD COLUMN "read_time" integer;--> statement-breakpoint
ALTER TABLE "blog" ADD COLUMN "featured_image" text;--> statement-breakpoint
ALTER TABLE "blog" ADD COLUMN "published_at" timestamp;--> statement-breakpoint
ALTER TABLE "blog" ADD CONSTRAINT "blog_slug_unique" UNIQUE("slug");