import { eq } from 'drizzle-orm'
import type { Topic } from '@/domain/models/topic.model'
import type { TopicRepositoryInterface } from '@/domain/repositories/topic.repository.interface'
import { db } from '../database/db/index'
import { topics } from '../database/schema/quora.schema'

export class TopicRepository implements TopicRepositoryInterface {
  async findById(id: string): Promise<Topic | null> {
    const result = await db.select().from(topics).where(eq(topics.id, id)).limit(1)
    return result.length ? this.map(result[0]) : null
  }

  async findByName(name: string): Promise<Topic | null> {
    const result = await db.select().from(topics).where(eq(topics.name, name)).limit(1)
    return result.length ? this.map(result[0]) : null
  }

  async findAll(pagination?: { skip: number; limit: number }): Promise<Topic[]> {
    const { skip = 0, limit = 20 } = pagination || {}
    const results = await db.select().from(topics).offset(skip).limit(limit)
    return results.map(this.map)
  }

  async create(data: Omit<Topic, 'id' | 'createdAt'>): Promise<Topic> {
    const id = crypto.randomUUID()
    const createdAt = new Date()
    await db.insert(topics).values({ ...data, id, createdAt })
    return { ...data, id, createdAt }
  }

  async update(id: string, data: Partial<Omit<Topic, 'id' | 'createdAt'>>): Promise<Topic> {
    await db.update(topics).set(data).where(eq(topics.id, id))
    const result = await db.select().from(topics).where(eq(topics.id, id)).limit(1)
    if (!result.length) throw new Error('Topic not found')
    return this.map(result[0])
  }

  async delete(id: string): Promise<boolean> {
    const result = await db.delete(topics).where(eq(topics.id, id))
    // @ts-ignore
    return result.count > 0
  }

  private map(row: any): Topic {
    return {
      id: row.id,
      name: row.name,
      description: row.description,
      createdAt: row.createdAt ?? row.created_at
    }
  }
}
