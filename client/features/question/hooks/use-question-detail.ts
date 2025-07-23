import { useQuery } from '@tanstack/react-query'
import { questionService } from '../question.service'
import type { Question } from '../question.schema'

export function useQuestionDetail(id: string) {
  return useQuery<Question | null>({
    queryKey: ['question', id],
    queryFn: async () => {
      if (!id) return null
      const res = await questionService.get(`/${id}`)
      return res.data as Question
    },
    enabled: !!id
  })
}
