import { z } from 'zod'

export const CommentSchema = z.object({
  id: z.string().uuid(),
  body: z.string().min(1),
  userId: z.string().uuid(),
  answerId: z.string().uuid(),
  createdAt: z.date()
})

export type Comment = z.infer<typeof CommentSchema>
