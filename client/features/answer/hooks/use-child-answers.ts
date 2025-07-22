import { useQuery } from '@tanstack/react-query'
import { answerService } from '../answer.service'
import type { Answer } from '../answer.schema'

export function useChildAnswers(parentAnswerId: string) {
  return useQuery<Answer[]>({
    queryKey: ['child-answers', parentAnswerId],
    queryFn: async () => {
      const res = await answerService.list({ parentAnswerId })
      return res.data as Answer[]
    },
    enabled: !!parentAnswerId
  })
}
