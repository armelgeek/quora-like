"use client"

import { BaseServiceImpl, type ResourceEndpoints } from '@/shared/domain/base.service'
import { API_ENDPOINTS } from '@/shared/config/api'
import type { User, UserUpdate, UserListResponse, UserResponse } from '@shared/types'
import type { Filter } from '@/shared/lib/types/filter'

export class UserService extends BaseServiceImpl<User, UserUpdate> {
  protected endpoints: ResourceEndpoints = {
    base: API_ENDPOINTS.user.list,
    list: (qs: string) => `${API_ENDPOINTS.user.list}${qs}`,
    create: API_ENDPOINTS.user.list,
    detail: (id: string) => API_ENDPOINTS.user.detail(id),
    update: (id: string) => API_ENDPOINTS.user.update(id),
    delete: (id: string) => API_ENDPOINTS.user.delete(id),
  }

  protected serializeParams(filter: Filter): string {
    const params = new URLSearchParams()
    if (filter.page) params.append('page', filter.page.toString())
    if (filter.limit) params.append('limit', filter.limit.toString())
    if (filter.search) params.append('search', filter.search)
    return params.toString() ? `?${params.toString()}` : ''
  }

  async getUsers(page: number = 1, limit: number = 10): Promise<{ success: boolean; data?: UserListResponse; error?: string }> {
    try {
      const url = `${API_ENDPOINTS.user.list}?page=${page}&limit=${limit}`
      const response = await this.get<{ success: boolean; data?: UserListResponse; error?: string }>(url)
      return response
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }

  async getUserById(id: string): Promise<UserResponse> {
    try {
      const response = await this.get<UserResponse>(API_ENDPOINTS.user.detail(id))
      return response
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }

  async getUserByEmail(email: string): Promise<UserResponse> {
    try {
      const response = await this.get<UserResponse>(API_ENDPOINTS.user.byEmail(email))
      return response
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }

  async updateUser(id: string, data: UserUpdate): Promise<UserResponse> {
    try {
      const response = await this.put<UserResponse>(API_ENDPOINTS.user.update(id), data)
      return response
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }

  async deleteUser(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await this.delete<{ success: boolean; error?: string }>(API_ENDPOINTS.user.delete(id))
      return response
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }

  async getUserSession(): Promise<{ success: boolean; data?: { user: User }; error?: string }> {
    try {
      const response = await this.get<{ success: boolean; data?: { user: User }; error?: string }>(API_ENDPOINTS.user.session)
      return response
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }
}

export const userService = new UserService()
