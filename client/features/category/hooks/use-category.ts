"use client"

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { categoryService } from '../category.service'
import type { CategoryCreate, CategoryUpdate } from '@shared/types'

// Query keys
export const categoryKeys = {
  all: ['categories'] as const,
  lists: () => [...categoryKeys.all, 'list'] as const,
  list: (page: number, limit: number) => [...categoryKeys.lists(), { page, limit }] as const,
  details: () => [...categoryKeys.all, 'detail'] as const,
  detail: (id: string) => [...categoryKeys.details(), id] as const,
  bySlug: (slug: string) => [...categoryKeys.all, 'slug', slug] as const,
}

// Get all categories
export function useCategories(page: number = 1, limit: number = 10) {
  return useQuery({
    queryKey: categoryKeys.list(page, limit),
    queryFn: () => categoryService.getCategories(page, limit),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Get category by ID
export function useCategory(id: string) {
  return useQuery({
    queryKey: categoryKeys.detail(id),
    queryFn: () => categoryService.getCategoryById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  })
}

// Get category by slug
export function useCategoryBySlug(slug: string) {
  return useQuery({
    queryKey: categoryKeys.bySlug(slug),
    queryFn: () => categoryService.getCategoryBySlug(slug),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  })
}

// Create category mutation
export function useCreateCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CategoryCreate) => categoryService.createCategory(data),
    onSuccess: () => {
      // Invalidate and refetch categories list
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() })
    },
  })
}

// Update category mutation
export function useUpdateCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: CategoryUpdate }) =>
      categoryService.updateCategory(id, data),
    onSuccess: (_, { id }) => {
      // Invalidate specific category and lists
      queryClient.invalidateQueries({ queryKey: categoryKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() })
    },
  })
}

// Delete category mutation
export function useDeleteCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => categoryService.deleteCategory(id),
    onSuccess: (_, id) => {
      // Remove category from cache and invalidate lists
      queryClient.removeQueries({ queryKey: categoryKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() })
    },
  })
}

// Optimistic update for category
export function useOptimisticUpdateCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: CategoryUpdate }) =>
      categoryService.updateCategory(id, data),
    onMutate: async ({ id, data }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: categoryKeys.detail(id) })

      // Snapshot previous value
      const previousCategory = queryClient.getQueryData(categoryKeys.detail(id))

      // Optimistically update category
      queryClient.setQueryData(categoryKeys.detail(id), (old: unknown) => {
        if (old && typeof old === 'object' && 'success' in old && 'data' in old) {
          const typedOld = old as { success: boolean; data?: Record<string, unknown> }
          if (typedOld.success && typedOld.data) {
            return {
              ...typedOld,
              data: { ...typedOld.data, ...data, updatedAt: new Date().toISOString() }
            }
          }
        }
        return old
      })

      return { previousCategory }
    },
    onError: (_, { id }, context) => {
      // Rollback on error
      if (context?.previousCategory) {
        queryClient.setQueryData(categoryKeys.detail(id), context.previousCategory)
      }
    },
    onSettled: (_, __, { id }) => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: categoryKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() })
    },
  })
}
