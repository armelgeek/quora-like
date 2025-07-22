import type { Vote } from '@/domain/models/vote.model'
import type { VoteRepositoryInterface } from '@/domain/repositories/vote.repository.interface'

export class CreateVoteUseCase {
  constructor(private readonly voteRepository: VoteRepositoryInterface) {}

  async execute(
    data: Omit<Vote, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<{ success: boolean; data?: Vote; error?: string }> {
    try {
      const vote = await this.voteRepository.create(data)
      return { success: true, data: vote }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }
}
