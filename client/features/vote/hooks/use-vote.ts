import { useMutation, useQueryClient } from '@tanstack/react-query'
import { voteService } from '../vote.service'

export function useVote() {
  const queryClient = useQueryClient()

  const upvoteAnswer = useMutation({
    mutationFn: (answerId: string) => voteService.post(`/up/${answerId}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['questions'] })
  })

  const downvoteAnswer = useMutation({
    mutationFn: (answerId: string) => voteService.post(`/down/${answerId}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['questions'] })
  })

  const upvoteQuestion = useMutation({
    mutationFn: (questionId: string) => voteService.post(`/up/${questionId}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['questions'] })
  })

  const downvoteQuestion = useMutation({
    mutationFn: (questionId: string) => voteService.post(`/down/${questionId}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['questions'] })
  })

  return { upvoteAnswer, downvoteAnswer, upvoteQuestion, downvoteQuestion }
}
