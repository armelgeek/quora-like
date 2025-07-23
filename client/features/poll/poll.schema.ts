import { z } from 'zod'

export const PollOptionSchema = z.object({
  id: z.string().uuid(),
  questionId: z.string().uuid(),
  text: z.string().min(1),
  votesCount: z.number().default(0)
})

export type PollOption = z.infer<typeof PollOptionSchema>

export const PollSchema = z.object({
  id: z.string().uuid(),
  questionId: z.string().uuid(),
  options: z.array(PollOptionSchema),
  createdAt: z.date(),
  updatedAt: z.date()
})

export type Poll = z.infer<typeof PollSchema>

export const CreatePollSchema = z.object({
  questionId: z.string().uuid(),
  options: z.array(z.object({ text: z.string().min(1) }))
})

export type CreatePollPayload = z.infer<typeof CreatePollSchema>
