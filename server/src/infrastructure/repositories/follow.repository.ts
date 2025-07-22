import { eq } from 'drizzle-orm'
import type { Follow } from '@/domain/models/follow.model'
import type { FollowRepositoryInterface } from '@/domain/repositories/follow.repository.interface'
import { db } from '../database/db/index'
import { follows } from '../database/schema/quora.schema'

export class FollowRepository implements FollowRepositoryInterface {
  async findById(id: string): Promise<Follow | null> {
    const result = await db.select().from(follows).where(eq(follows.id, id)).limit(1)
    return result.length ? this.map(result[0]) : null
  }

  async findAll(pagination?: { skip: number; limit: number }): Promise<Follow[]> {
    const { skip = 0, limit = 20 } = pagination || {}
    const results = await db.select().from(follows).offset(skip).limit(limit)
    return results.map(this.map)
  }

  async create(data: Omit<Follow, 'id' | 'createdAt'>): Promise<Follow> {
    const id = crypto.randomUUID()
    const createdAt = new Date()
    await db.insert(follows).values({ ...data, id, createdAt })
    return { ...data, id, createdAt }
  }

  async delete(id: string): Promise<boolean> {
    const result = await db.delete(follows).where(eq(follows.id, id))
    // @ts-ignore
    return result.count > 0
  }

  async findByFollower(followerId: string): Promise<Follow[]> {
    const results = await db.select().from(follows).where(eq(follows.followerId, followerId))
    return results.map(this.map)
  }

  async findByFollowingUser(followingUserId: string): Promise<Follow[]> {
    const results = await db.select().from(follows).where(eq(follows.followingUserId, followingUserId))
    return results.map(this.map)
  }

  async findByTopic(topicId: string): Promise<Follow[]> {
    const results = await db.select().from(follows).where(eq(follows.topicId, topicId))
    return results.map(this.map)
  }

  private map(row: any): Follow {
    return {
      id: row.id,
      followerId: row.followerId ?? row.follower_id,
      followingUserId: row.followingUserId ?? row.following_user_id,
      topicId: row.topicId ?? row.topic_id,
      createdAt: row.createdAt ?? row.created_at
    }
  }
}
