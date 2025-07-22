import type { Follow } from '../models/follow.model'

export interface FollowRepositoryInterface {
  findById: (id: string) => Promise<Follow | null>
  findAll: (pagination?: { skip: number; limit: number }) => Promise<Follow[]>
  create: (data: Omit<Follow, 'id' | 'createdAt'>) => Promise<Follow>
  delete: (id: string) => Promise<boolean>
  findByFollower: (followerId: string) => Promise<Follow[]>
  findByFollowingUser: (followingUserId: string) => Promise<Follow[]>
  findByTopic: (topicId: string) => Promise<Follow[]>
}
