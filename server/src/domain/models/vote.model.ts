import { z } from 'zod'

export const VoteSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  answerId: z.string().uuid(),
  value: z
    .number()
    .int()
    .refine((v) => v === 1 || v === -1),
  createdAt: z.date()
})

export type Vote = z.infer<typeof VoteSchema>
