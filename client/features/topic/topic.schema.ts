import { z } from 'zod'

export const topicSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Le nom du topic est requis'),
  description: z.string().optional(),
  createdAt: z.string()
})

export type Topic = z.infer<typeof topicSchema>
