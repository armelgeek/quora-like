import { z } from 'zod'

export const QuestionSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1),
  body: z.string().min(1),
  userId: z.string().uuid(),
  topicId: z.string().uuid().optional(),
  createdAt: z.date(),
  updatedAt: z.date()
})

export type Question = z.infer<typeof QuestionSchema>
