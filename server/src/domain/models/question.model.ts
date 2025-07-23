import { z } from 'zod'
import { Tag, TagSchema } from './tag.model'

export const QuestionSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1),
  body: z.string().min(1),
  userId: z.string().uuid(),
  topicId: z.string().uuid().optional(),
  type: z.enum(['text', 'poll']).default('text'),
  createdAt: z.date(),
  updatedAt: z.date(),
  tags: z.array(TagSchema).default([])
})

export type Question = z.infer<typeof QuestionSchema>
