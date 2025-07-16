"use client"

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { userService } from '../user.service'
import type { UserUpdate } from '@shared/types'

export const useUsers = (page: number = 1, limit: number = 10) => {
  return useQuery({
    queryKey: ['users', page, limit],
    queryFn: () => userService.getUsers(page, limit),
  })
}

export const useUser = (id: string) => {
  return useQuery({
    queryKey: ['users', id],
    queryFn: () => userService.getUserById(id),
    enabled: !!id,
  })
}

export const useUserByEmail = (email: string) => {
  return useQuery({
    queryKey: ['users', 'email', email],
    queryFn: () => userService.getUserByEmail(email),
    enabled: !!email,
  })
}

export const useUserSession = () => {
  return useQuery({
    queryKey: ['users', 'session'],
    queryFn: () => userService.getUserSession(),
  })
}

export const useUpdateUser = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UserUpdate }) =>
      userService.updateUser(id, data),
    onSuccess: (data, variables) => {
      // Invalidate and refetch user queries
      queryClient.invalidateQueries({ queryKey: ['users'] })
      if (data.success && data.data) {
        queryClient.setQueryData(['users', variables.id], data)
      }
    },
  })
}

export const useDeleteUser = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: string) => userService.deleteUser(id),
    onSuccess: () => {
      // Invalidate and refetch user queries
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}
