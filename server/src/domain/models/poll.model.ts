import { z } from 'zod'

export const PollOptionSchema = z.object({
  id: z.string().uuid(),
  questionId: z.string().uuid(),
  text: z.string().min(1),
  votesCount: z.number().default(0)
})

export const PollSchema = z.object({
  id: z.string().uuid(),
  questionId: z.string().uuid(),
  options: z.array(PollOptionSchema),
  createdAt: z.date(),
  updatedAt: z.date()
})

export type PollOption = z.infer<typeof PollOptionSchema>
export type Poll = z.infer<typeof PollSchema>
