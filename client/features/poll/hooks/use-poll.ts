import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { pollService, pollVote, getPollByQuestion } from '../poll.service'
import type { CreatePollPayload } from '../poll.schema'

export function useCreatePoll() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: CreatePollPayload) => {
      const res = await pollService.post('', payload)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['polls'] })
    }
  })
}

export function usePollByQuestion(questionId: string) {
  return useQuery({
    queryKey: ['poll', questionId],
    queryFn: async () => {
      const res = await getPollByQuestion(questionId)
      return res.data
    },
    enabled: !!questionId
  })
}

export function useVotePollOption() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ optionId, userId, questionId }: { optionId: string; userId: string; questionId: string }) => {
      type PollVoteResponse = { success: boolean; error?: string }
      try {
        const res = await pollVote(optionId, userId)
        let data: PollVoteResponse
        if (typeof res.data === 'object' && res.data !== null && 'success' in res.data) {
          const d = res.data as Record<string, unknown>
          data = {
            ...(d as object),
            success: typeof d.success === 'boolean' ? d.success : Boolean(d.success),
            error: typeof d.error === 'string' ? d.error : undefined
          }
        } else {
          data = { success: false, error: 'Réponse inattendue du serveur' }
        }
        if (data.success) {
          return { ...data, questionId }
        } else {
          throw new Error(data.error || 'Erreur lors du vote')
        }
      } catch (err) {
        const e = err as { response?: { data?: { error?: string } }; message?: string }
        throw new Error(e?.response?.data?.error || e?.message || 'Erreur lors du vote')
      }
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['poll', variables.questionId] })
    }
  })
}
