import { eq } from 'drizzle-orm'
import { db } from '../database/db'
import { blog } from '../database/schema/blog'
import type { Blog, BlogCreate, BlogListResponse, BlogResponse, BlogUpdate } from '../../../../shared/src/types/blog'
import type { BlogRepository } from '../../domain/repositories/blog.repository'

export class BlogRepositoryImpl implements BlogRepository {
  async getAll(page = 1, limit = 10): Promise<BlogListResponse> {
    const offset = (page - 1) * limit
    const itemsRaw = await db.select().from(blog).limit(limit).offset(offset)
    const totalRaw = await db.select().from(blog)
    const total = totalRaw.length
    // Convert types for API contract
    const items: Blog[] = itemsRaw.map((item: any) => ({
      ...item,
      id: String(item.id),
      createdAt: item.createdAt ? new Date(item.createdAt).toISOString() : '',
      updatedAt: item.updatedAt ? new Date(item.updatedAt).toISOString() : ''
    }))
    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  }

  async getById(id: string): Promise<BlogResponse> {
    const dataRaw = await db
      .select()
      .from(blog)
      .where(eq(blog.id, Number(id)))
      .limit(1)
    if (!dataRaw?.[0]) return { success: false, error: 'Not found' }
    const data: Blog = {
      ...dataRaw[0],
      id: String(dataRaw[0].id),
      createdAt: dataRaw[0].createdAt ? new Date(dataRaw[0].createdAt).toISOString() : '',
      updatedAt: dataRaw[0].updatedAt ? new Date(dataRaw[0].updatedAt).toISOString() : '',
      tags: dataRaw[0].tags ?? undefined,
      published: dataRaw[0].published ?? undefined
    }
    return { success: true, data }
  }

  async create(data: BlogCreate): Promise<BlogResponse> {
    const [createdRaw] = await db.insert(blog).values(data).returning()
    const created: Blog = {
      ...createdRaw,
      id: String(createdRaw.id),
      createdAt: createdRaw.createdAt ? new Date(createdRaw.createdAt).toISOString() : '',
      updatedAt: createdRaw.updatedAt ? new Date(createdRaw.updatedAt).toISOString() : '',
      tags: createdRaw.tags ?? undefined,
      published: createdRaw.published ?? undefined
    }
    return { success: true, data: created }
  }

  async update(id: string, data: BlogUpdate): Promise<BlogResponse> {
    const [updatedRaw] = await db
      .update(blog)
      .set(data)
      .where(eq(blog.id, Number(id)))
      .returning()
    const updated: Blog = {
      ...updatedRaw,
      id: String(updatedRaw.id),
      createdAt: updatedRaw.createdAt ? new Date(updatedRaw.createdAt).toISOString() : '',
      updatedAt: updatedRaw.updatedAt ? new Date(updatedRaw.updatedAt).toISOString() : '',
      tags: updatedRaw.tags ?? undefined,
      published: updatedRaw.published ?? undefined
    }
    return { success: true, data: updated }
  }

  async deleteById(id: string): Promise<BlogResponse> {
    await db.delete(blog).where(eq(blog.id, Number(id)))
    return { success: true }
  }
}
