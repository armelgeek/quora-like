"use client"

import { BaseServiceImpl, type ResourceEndpoints } from '@/shared/domain/base.service'
import { API_ENDPOINTS } from '@/shared/config/api'
import type { Category, CategoryCreate, CategoryUpdate } from '@shared/types'
import type { Filter } from '@/shared/lib/types/filter'

export class CategoryService extends BaseServiceImpl<Category, CategoryUpdate> {
  protected endpoints: ResourceEndpoints = {
    base: API_ENDPOINTS.category.list,
    list: (qs: string) => `${API_ENDPOINTS.category.list}${qs}`,
    create: API_ENDPOINTS.category.create,
    detail: (id: string) => API_ENDPOINTS.category.detail(id),
    update: (id: string) => API_ENDPOINTS.category.update(id),
    delete: (id: string) => API_ENDPOINTS.category.delete(id),
  }

  protected serializeParams(filter: Filter): string {
    const params = new URLSearchParams()
    if (filter.page) params.append('page', filter.page.toString())
    if (filter.limit) params.append('limit', filter.limit.toString())
    if (filter.search) params.append('search', filter.search)
    return params.toString() ? `?${params.toString()}` : ''
  }

  // Get all categories with pagination
  async getCategories(page: number = 1, limit: number = 10) {
    try {
      const url = `${API_ENDPOINTS.category.list}?page=${page}&limit=${limit}`
      const response = await this.get<{
        success: boolean
        data?: {
          items: Category[]
          total: number
          page: number
          limit: number
          totalPages: number
        }
        error?: string
      }>(url)
      return response
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }

  // Get category by ID
  async getCategoryById(id: string) {
    try {
      const response = await this.get<{ success: boolean; data?: Category; error?: string }>(
        API_ENDPOINTS.category.detail(id)
      )
      return response
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }

  // Get category by slug
  async getCategoryBySlug(slug: string) {
    try {
      const response = await this.get<{ success: boolean; data?: Category; error?: string }>(
        API_ENDPOINTS.category.bySlug(slug)
      )
      return response
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }

  // Create new category
  async createCategory(data: CategoryCreate) {
    try {
      const response = await this.post<{ success: boolean; data?: Category; error?: string }>(
        API_ENDPOINTS.category.create,
        data
      )
      return response
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }

  // Update category
  async updateCategory(id: string, data: CategoryUpdate) {
    try {
      const response = await this.put<{ success: boolean; data?: Category; error?: string }>(
        API_ENDPOINTS.category.update(id),
        data
      )
      return response
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }

  // Delete category
  async deleteCategory(id: string) {
    try {
      const response = await this.delete<{ success: boolean; error?: string }>(
        API_ENDPOINTS.category.delete(id)
      )
      return response
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }
}

export const categoryService = new CategoryService()
