import { z } from 'zod'

export const VoteSchema = z
  .object({
    id: z.string().uuid(),
    userId: z.string().uuid(),
    questionId: z.string().uuid().optional(),
    answerId: z.string().uuid().optional(),
    value: z
      .number()
      .int()
      .refine((v) => v === 1 || v === 0),
    createdAt: z.date()
  })
  .refine((data) => data.questionId || data.answerId, {
    message: 'Either questionId or answerId must be provided'
  })

export type Vote = z.infer<typeof VoteSchema>
