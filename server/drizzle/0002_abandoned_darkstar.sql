ALTER TABLE "blog" ADD COLUMN "meta_title" varchar(255);--> statement-breakpoint
ALTER TABLE "blog" ADD COLUMN "meta_description" text;--> statement-breakpoint
ALTER TABLE "blog" ADD COLUMN "meta_keywords" varchar(255)[];--> statement-breakpoint
ALTER TABLE "blog" ADD COLUMN "og_image" text;--> statement-breakpoint
ALTER TABLE "blog" ADD COLUMN "og_description" text;--> statement-breakpoint
ALTER TABLE "blog" ADD COLUMN "content_type" varchar(50) DEFAULT 'rich-text';--> statement-breakpoint
ALTER TABLE "blog" ADD COLUMN "is_draft" boolean DEFAULT true;--> statement-breakpoint
ALTER TABLE "blog" ADD COLUMN "scheduled_at" timestamp;--> statement-breakpoint
ALTER TABLE "blog" ADD COLUMN "gallery_images" jsonb;--> statement-breakpoint
ALTER TABLE "blog" ADD COLUMN "video_url" text;--> statement-breakpoint
ALTER TABLE "blog" ADD COLUMN "audio_url" text;