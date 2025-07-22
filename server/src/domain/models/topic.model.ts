import { z } from 'zod'

export const TopicSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  description: z.string().optional(),
  createdAt: z.date()
})

export type Topic = z.infer<typeof TopicSchema>
