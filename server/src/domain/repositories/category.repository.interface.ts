import type { CategoryType } from '../models/category.model'

export interface CategoryRepositoryInterface {
  findById: (id: string) => Promise<CategoryType | null>
  findBySlug: (slug: string) => Promise<CategoryType | null>
  findAll: (
    page?: number,
    limit?: number
  ) => Promise<{ items: CategoryType[]; total: number; page: number; limit: number; totalPages: number }>
  save: (category: CategoryType) => Promise<CategoryType>
  update: (id: string, data: Partial<CategoryType>) => Promise<CategoryType | null>
  remove: (id: string) => Promise<boolean>
}
