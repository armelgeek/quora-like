import { IUseCase } from '@/domain/types/use-case.type'
import type { PollRepositoryInterface } from '@/domain/repositories/poll.repository.interface'

type VotePollOptionParams = { optionId: string; userId: string }
type VotePollOptionResponse = { success: boolean; error?: string }

export class VotePollOptionUseCase {
  constructor(private readonly pollRepository: PollRepositoryInterface) {}

  async execute(params: VotePollOptionParams): Promise<VotePollOptionResponse> {
    try {
      await this.pollRepository.vote(params.optionId, params.userId)
      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }
}
