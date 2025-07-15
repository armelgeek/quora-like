import { sql } from 'drizzle-orm';
import { varchar, text, boolean, timestamp, pgTable, serial } from 'drizzle-orm/pg-core';

export const blog = pgTable('blog', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  content: text('content').notNull(),
  authorId: varchar('author_id', { length: 36 }).notNull(),
  tags: varchar('tags', { length: 255 }).array(),
  published: boolean('published').default(false),
  createdAt: timestamp('created_at').default(sql`now()`),
  updatedAt: timestamp('updated_at').default(sql`now()`),
});
