import { z } from 'zod'

export const FollowSchema = z.object({
  id: z.string().uuid(),
  followerId: z.string().uuid(),
  followingUserId: z.string().uuid().optional(),
  topicId: z.string().uuid().optional(),
  createdAt: z.date()
})

export type Follow = z.infer<typeof FollowSchema>
