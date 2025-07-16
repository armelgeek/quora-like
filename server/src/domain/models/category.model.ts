import { z } from 'zod'

export const Category = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  description: z.string().optional(),
  color: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string()
})

export type CategoryType = z.infer<typeof Category>
