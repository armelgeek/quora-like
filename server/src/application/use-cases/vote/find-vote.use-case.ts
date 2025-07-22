import type { Vote } from '@/domain/models/vote.model'
import type { VoteRepositoryInterface } from '@/domain/repositories/vote.repository.interface'

export class FindVoteUseCase {
  constructor(private readonly voteRepository: VoteRepositoryInterface) {}

  async execute(id: string): Promise<{ success: boolean; data?: Vote; error?: string }> {
    const data = await this.voteRepository.findById(id)
    if (!data) return { success: false, error: 'Not found' }
    return { success: true, data }
  }
}
