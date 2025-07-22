import { z } from 'zod'

export const questionSchema = z.object({
  id: z.string(),
  title: z.string().min(1),
  body: z.string().min(1),
  topicId: z.string(),
  createdAt: z.string(),
  updatedAt: z.string()
})

export type Question = z.infer<typeof questionSchema>
