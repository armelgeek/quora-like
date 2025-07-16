import { eq } from 'drizzle-orm'
import type { CategoryType } from '@/domain/models/category.model'
import type { CategoryRepositoryInterface } from '@/domain/repositories/category.repository.interface'
import { categories } from '../database/schema/category'
import { BaseRepository } from './base.repository'

interface CategoryCreateData {
  name: string
  slug: string
  description?: string
  color?: string
  createdAt?: string | Date
  updatedAt?: string | Date
}

interface CategoryUpdateData {
  name?: string
  slug?: string
  description?: string
  color?: string
  updatedAt?: string | Date
}

export class CategoryRepositoryImpl
  extends BaseRepository<CategoryType, CategoryCreateData, CategoryUpdateData>
  implements CategoryRepositoryInterface
{
  constructor() {
    super(categories)
  }

  async findBySlug(slug: string): Promise<CategoryType | null> {
    const result = await this.db.select().from(categories).where(eq(categories.slug, slug)).limit(1)
    if (!result.length) return null
    return this.transformToEntity(result[0])
  }

  // Implémentation de l'interface CategoryRepositoryInterface
  async update(id: string, data: Partial<CategoryType>): Promise<CategoryType | null> {
    return await this.updateEntity(id, data as CategoryUpdateData)
  }
}
