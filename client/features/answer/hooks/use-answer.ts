
  import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
    import { answerService } from '../answer.service'
  import type { Answer, AnswerPayload } from '../answer.schema'
export function useUpdateAnswer(questionId: string) {
 
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<AnswerPayload> }) => {
      const res = await answerService.put(`${id}`, data)
      return res.data as Answer
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['answers', questionId] })
      queryClient.invalidateQueries({ queryKey: ['questions'] })
      // Invalider la liste des enfants du parent direct
      if (variables.data.parentAnswerId) {
        queryClient.invalidateQueries({ queryKey: ['child-answers', variables.data.parentAnswerId] })
      }
      // Invalider la liste des enfants de la réponse modifiée
      queryClient.invalidateQueries({ queryKey: ['child-answers', variables.id] })
    }
  })
}

export function useDeleteAnswer(questionId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id }: { id: string; parentAnswerId?: string }) => {
      await answerService.delete(`${id}`)
      return id
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['answers', questionId] })
      queryClient.invalidateQueries({ queryKey: ['questions'] })
      if (variables.parentAnswerId) {
        queryClient.invalidateQueries({ queryKey: ['child-answers', variables.parentAnswerId] })
      }
    }
  })
}


export function useAnswers(questionId: string) {
  return useQuery<Answer[]>({
    queryKey: ['answers', questionId],
    queryFn: async () => {
      const res = await answerService.list({ questionId })
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
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['answers', questionId] })
      queryClient.invalidateQueries({ queryKey: ['questions'] })
      if (variables.parentAnswerId) {
        queryClient.invalidateQueries({ queryKey: ['child-answers', variables.parentAnswerId] })
      }
    }
  })
}
