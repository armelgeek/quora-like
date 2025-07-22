import { eq } from 'drizzle-orm'
import type { Vote } from '@/domain/models/vote.model'
import type { VoteRepositoryInterface } from '@/domain/repositories/vote.repository.interface'
import { db } from '../database/db/index'
import { votes } from '../database/schema/quora.schema'

export class VoteRepository implements VoteRepositoryInterface {
  async findById(id: string): Promise<Vote | null> {
    const result = await db.select().from(votes).where(eq(votes.id, id)).limit(1)
    return result.length ? this.map(result[0]) : null
  }

  async findAll(pagination?: { skip: number; limit: number }): Promise<Vote[]> {
    const { skip = 0, limit = 20 } = pagination || {}
    const results = await db.select().from(votes).offset(skip).limit(limit)
    return results.map(this.map)
  }

  async create(data: Omit<Vote, 'id' | 'createdAt'>): Promise<Vote> {
    const id = crypto.randomUUID()
    const createdAt = new Date()
    await db.insert(votes).values({ ...data, id, createdAt })
    return { ...data, id, createdAt }
  }

  async delete(id: string): Promise<boolean> {
    const result = await db.delete(votes).where(eq(votes.id, id))
    // drizzle returns { count: number }
    // @ts-ignore
    return result.count > 0
  }

  async findByAnswer(answerId: string): Promise<Vote[]> {
    const results = await db.select().from(votes).where(eq(votes.answerId, answerId))
    return results.map(this.map)
  }

  async findByUser(userId: string): Promise<Vote[]> {
    const results = await db.select().from(votes).where(eq(votes.userId, userId))
    return results.map(this.map)
  }

  async getVoteCount(answerId: string): Promise<number> {
    const results = await db.select().from(votes).where(eq(votes.answerId, answerId))
    return results.reduce((acc: number, v: any) => acc + v.value, 0)
  }

  private map(row: any): Vote {
    return {
      id: row.id,
      userId: row.user_id,
      answerId: row.answer_id,
      value: row.value,
      createdAt: row.created_at
    }
  }
}
