import BaseService from '@/shared/lib/services/base-service'
import { API_ENDPOINTS } from '@/shared/config/api'

export const pollService = new BaseService(API_ENDPOINTS.poll.base)

export const pollVote = async (optionId: string, userId: string) => {
  return pollService.post('/vote', { optionId, userId })
}

export const getPollByQuestion = async (questionId: string) => {
  return pollService.get(`?questionId=${questionId}`)
}
