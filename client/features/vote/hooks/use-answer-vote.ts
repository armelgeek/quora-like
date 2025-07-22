import { useMutation, useQueryClient } from '@tanstack/react-query'
import { answerVoteService } from '../answer-vote.service'
import { API_ENDPOINTS } from '@/shared/config/api'

export function useAnswerVote() {
  const queryClient = useQueryClient()
  const upvoteAnswer = useMutation({
    mutationFn: async (vars: { answerId: string; questionId: string }) => {
      // questionId is used for cache invalidation only
      await answerVoteService.post(API_ENDPOINTS.vote.upAnswer(vars.answerId))
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['answers', variables.questionId] })
    }
  })
  const downvoteAnswer = useMutation({
    mutationFn: async (vars: { answerId: string; questionId: string }) => {
      // questionId is used for cache invalidation only
      await answerVoteService.post(API_ENDPOINTS.vote.downAnswer(vars.answerId))
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['answers', variables.questionId] })
    }
  })
  return { upvoteAnswer, downvoteAnswer }
}
