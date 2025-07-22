import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { topicService } from '../topic.service'
import type { Topic } from '../topic.schema'
import type { ApiResponse } from '@/shared/lib/services/base-service'

export function useTopics() {
  return useQuery({
    queryKey: ['topics'],
    queryFn: () => topicService.get('').then(res => res.data)
  })
}

export function useCreateTopic() {
  const queryClient = useQueryClient()
  return useMutation<ApiResponse<Topic>, unknown, Omit<Topic, 'id' | 'createdAt'>>({
    mutationFn: (data) => topicService.post('', data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['topics'] })
  })
}
