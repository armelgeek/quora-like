import { integer, pgTable, primaryKey, text, timestamp } from 'drizzle-orm/pg-core'
import { users } from './auth'

export const topics = pgTable('topics', {
  id: text('id').primaryKey(),
  name: text('name').notNull().unique(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow().notNull()
})

export const questions = pgTable('questions', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  body: text('body').notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  topicId: text('topic_id').references(() => topics.id, { onDelete: 'set null' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
})

export const answers = pgTable('answers', {
  id: text('id').primaryKey(),
  body: text('body').notNull(),
  questionId: text('question_id')
    .notNull()
    .references(() => questions.id, { onDelete: 'cascade' }),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  parentAnswerId: text('parent_answer_id').references(() => answers.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
})

export const votes = pgTable('votes', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  questionId: text('question_id').references(() => questions.id, { onDelete: 'cascade' }),
  answerId: text('answer_id').references(() => answers.id, { onDelete: 'cascade' }),
  value: integer('value').notNull(), // +1 ou -1
  createdAt: timestamp('created_at').defaultNow().notNull()
})

export const comments = pgTable('comments', {
  id: text('id').primaryKey(),
  body: text('body').notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  answerId: text('answer_id')
    .notNull()
    .references(() => answers.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull()
})

export const follows = pgTable('follows', {
  id: text('id').primaryKey(),
  followerId: text('follower_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  followingUserId: text('following_user_id').references(() => users.id, { onDelete: 'cascade' }),
  topicId: text('topic_id').references(() => topics.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull()
})
