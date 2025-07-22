import { useMutation, useQueryClient } from '@tanstack/react-query'
import { answerVoteService } from '../answer-vote.service'
import { API_ENDPOINTS } from '@/shared/config/api'

export function useAnswerVote() {
  const queryClient = useQueryClient()

  // Helper to recursively invalidate all child-answers up the tree
  const invalidateAncestors = (answerId: string) => {
    // Invalidate the direct children
    queryClient.invalidateQueries({ queryKey: ['child-answers', answerId] })
    // Optionally, recursively walk up the parent chain if parent ids are tracked in the query cache
    // For now, we invalidate all child-answers queries to ensure deep updates
    queryClient.invalidateQueries({ queryKey: ['child-answers'] })
  }

  const upvoteAnswer = useMutation({
    mutationFn: async (vars: { answerId: string; questionId: string }) => {
      await answerVoteService.post(API_ENDPOINTS.vote.upAnswer(vars.answerId))
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['answers', variables.questionId] })
      invalidateAncestors(variables.answerId)
    }
  })
  const downvoteAnswer = useMutation({
    mutationFn: async (vars: { answerId: string; questionId: string }) => {
      await answerVoteService.post(API_ENDPOINTS.vote.downAnswer(vars.answerId))
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['answers', variables.questionId] })
      invalidateAncestors(variables.answerId)
    }
  })
  return { upvoteAnswer, downvoteAnswer }
}
