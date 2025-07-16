import { sql } from 'drizzle-orm'
import { boolean, integer, jsonb, pgTable, serial, text, timestamp, varchar } from 'drizzle-orm/pg-core'
import { users } from './auth'

export const blog = pgTable('blog', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  content: text('content').notNull(),
  excerpt: text('excerpt'),
  authorId: text('author_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  tags: varchar('tags', { length: 255 }).array(),
  published: boolean('published').default(false),
  status: varchar('status', { length: 50 }).default('draft'),
  viewCount: integer('view_count').default(0),
  readTime: integer('read_time'),
  featuredImage: text('featured_image'),
  publishedAt: timestamp('published_at'),
  // SEO Metadata
  metaTitle: varchar('meta_title', { length: 255 }),
  metaDescription: text('meta_description'),
  metaKeywords: varchar('meta_keywords', { length: 255 }).array(),
  ogImage: text('og_image'),
  ogDescription: text('og_description'),
  // Content Management
  contentType: varchar('content_type', { length: 50 }).default('rich-text'),
  isDraft: boolean('is_draft').default(true),
  scheduledAt: timestamp('scheduled_at'),
  // Media
  galleryImages: jsonb('gallery_images'),
  videoUrl: text('video_url'),
  audioUrl: text('audio_url'),
  createdAt: timestamp('created_at').default(sql`now()`),
  updatedAt: timestamp('updated_at').default(sql`now()`)
})
