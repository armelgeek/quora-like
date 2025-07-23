
import { z } from 'zod'

export const tagSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  createdAt: z.string()
})
export type Tag = z.infer<typeof tagSchema>

export const questionSchema = z.object({
  id: z.string(),
  title: z.string().min(1),
  body: z.string().min(1),
  topicId: z.string(),
  type: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
  tags: z.array(tagSchema).default([])
})

export type Question = z.infer<typeof questionSchema>
