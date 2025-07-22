import { z } from 'zod'

export const AnswerSchema = z.object({
  id: z.string().uuid(),
  body: z.string().min(1),
  questionId: z.string().uuid(),
  userId: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date()
})

export type Answer = z.infer<typeof AnswerSchema>
