import type { Vote } from '@/domain/models/vote.model'
import type { VoteRepositoryInterface } from '@/domain/repositories/vote.repository.interface'

export class FindAllVotesUseCase {
  constructor(private readonly voteRepository: VoteRepositoryInterface) {}

  async execute(params: { skip: number; limit: number }): Promise<{ success: boolean; data: Vote[] }> {
    const data = await this.voteRepository.findAll(params)
    return { success: true, data }
  }
}
