
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { answerService } from '../answer.service'
import type { Answer, AnswerPayload } from '../answer.schema'

export function useAnswers(questionId: string) {
  return useQuery<Answer[]>({
    queryKey: ['answers', questionId],
    queryFn: async () => {
      const res = await answerService.list({ questionId })
      // On caste la réponse enrichie (user, votesCount)
      return res.data as Answer[]
    },
    enabled: !!questionId
  })
}

export function useCreateAnswer(questionId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: AnswerPayload) => {
      const res = await answerService.post('', { ...payload, questionId })
      return res.data as Answer
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['answers', questionId] })
    }
  })
}
