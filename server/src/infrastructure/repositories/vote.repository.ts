import { eq } from 'drizzle-orm'
import type { Vote } from '@/domain/models/vote.model'
import type { VoteRepositoryInterface } from '@/domain/repositories/vote.repository.interface'
import { db } from '../database/db/index'
import { votes } from '../database/schema/quora.schema'

export class VoteRepository implements VoteRepositoryInterface {
  async update(id: string, data: Partial<Omit<Vote, 'id' | 'createdAt'>>): Promise<Vote> {
    await db
      .update(votes)
      .set({ ...data })
      .where(eq(votes.id, id))
    const updated = await db.select().from(votes).where(eq(votes.id, id)).limit(1)
    if (!updated.length) {
      throw new Error('Vote not found')
    }
    return this.map(updated[0])
  }
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
    // On ne garde que la clé concernée (questionId ou answerId)
    const insertData: any = {
      id,
      userId: data.userId,
      value: data.value,
      createdAt
    }
    if (data.questionId) insertData.questionId = data.questionId
    if (data.answerId) insertData.answerId = data.answerId
    await db.insert(votes).values(insertData)
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

  async findByQuestion(questionId: string): Promise<Vote[]> {
    const results = await db.select().from(votes).where(eq(votes.questionId, questionId))
    return results.map(this.map)
  }

  async findByUser(userId: string): Promise<Vote[]> {
    const results = await db.select().from(votes).where(eq(votes.userId, userId))
    return results.map(this.map)
  }

  async getVoteCountByAnswer(answerId: string): Promise<number> {
    const results = await db.select().from(votes).where(eq(votes.answerId, answerId))
    return results.reduce((acc: number, v: any) => acc + v.value, 0)
  }

  async getVoteCountByQuestion(questionId: string): Promise<number> {
    const results = await db.select().from(votes).where(eq(votes.questionId, questionId))
    return results.reduce((acc: number, v: any) => acc + v.value, 0)
  }

  private map(row: any): Vote {
    return {
      id: row.id,
      userId: row.userId,
      questionId: row.questionId ?? undefined,
      answerId: row.answerId ?? undefined,
      value: row.value,
      createdAt: row.createdAt
    }
  }
}
