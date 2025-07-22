import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { questionService } from '../question.service'
import type { Question } from '../question.schema'

export function useQuestions(params?: Record<string, string | number | boolean>) {
  // Cast params en Record<string, string> pour l'appel
  const stringParams = params
    ? Object.fromEntries(Object.entries(params).map(([k, v]) => [k, String(v)]))
    : undefined;
  return useQuery({
    queryKey: ['questions', params],
    queryFn: () => questionService.get('', stringParams).then(res => res.data),
  })
}

export function useCreateQuestion() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Omit<Question, 'id' | 'createdAt' | 'updatedAt'>) => questionService.post('', data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['questions'] })
  })
}

export function useUpdateQuestion() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...data }: Partial<Question> & { id: string }) => questionService.put(`/${id}`, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['questions'] })
  })
}

export function useDeleteQuestion() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => questionService.delete(`/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['questions'] })
  })
}
