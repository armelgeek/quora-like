import { text, pgTable, integer, timestamp } from 'drizzle-orm/pg-core'
import { users } from './auth'
import { polls } from './quora.schema'

export const pollVotes = pgTable('poll_votes', {
  id: text('id').primaryKey(),
  pollId: text('poll_id')
    .notNull()
    .references(() => polls.id, { onDelete: 'cascade' }),
  optionId: text('option_id').notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull()
})
