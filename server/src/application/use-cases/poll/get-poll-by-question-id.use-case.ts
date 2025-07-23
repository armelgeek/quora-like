import { IUseCase } from '@/domain/types/use-case.type'
import type { Poll } from '@/domain/models/poll.model'
import type { PollRepositoryInterface } from '@/domain/repositories/poll.repository.interface'

export class GetPollByQuestionIdUseCase {
  constructor(private readonly pollRepository: PollRepositoryInterface) {}

  async execute(params: { questionId: string }) {
    try {
      const poll = await this.pollRepository.findByQuestionId(params.questionId)
      if (!poll) return { success: false, error: 'Poll not found' }
      return { success: true, data: poll }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }
}
